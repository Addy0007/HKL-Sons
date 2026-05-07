package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.AddressDTO;
import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.*;
import com.HKL.Ecomm_App.Repository.OrderRepository;
import com.HKL.Ecomm_App.Request.OrderRequest;
import com.HKL.Ecomm_App.Response.ApiResponse;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.ProductService;
import com.HKL.Ecomm_App.Service.UserService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    @Value("${razorpay.key_id}")
    private String apiKey;

    @Value("${razorpay.key_secret}")
    private String apiSecret;

    private final OrderService orderService;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductService productService;

    public PaymentController(OrderService orderService,
                             UserService userService,
                             OrderRepository orderRepository,
                             CartService cartService,
                             ProductService productService) {
        this.orderService = orderService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.productService = productService;
    }

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findUserByEmail(email);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 🔹 Create Razorpay Order
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/payments/razorpay-order/{orderId}")
    public ResponseEntity<?> createRazorpayOrder(@PathVariable Long orderId) {
        try {
            User user = getLoggedUser();
            Order order = orderService.findOrderById(orderId);

            if (!order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                        .body(new ApiResponse("Unauthorized access to order", false));
            }

            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
            int amount = (int) Math.round(order.getTotalDiscountedPrice() * 100);

            JSONObject options = new JSONObject();
            options.put("amount", amount);
            options.put("currency", "INR");
            options.put("receipt", "rcpt_" + order.getId());
            options.put("payment_capture", 1);

            com.razorpay.Order rzpOrder = razorpay.orders.create(options);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("razorpayOrderId", rzpOrder.get("id"));
            response.put("key", apiKey);
            response.put("amount", amount);
            response.put("currency", "INR");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to create Razorpay order for orderId={}: {}", orderId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Failed to create Razorpay order: " + e.getMessage(), false));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 🔹 Verify & Update Payment — called by frontend PaymentSuccess page
    //
    //    Frontend sends: GET /api/payments?payment_id=pay_xxx&order_id=6
    //    Each step is logged so you can see exactly where it fails.
    // ─────────────────────────────────────────────────────────────────────────
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> redirect(
            @RequestParam("payment_id") String paymentId,
            @RequestParam("order_id") Long orderId
    ) {
        log.info("▶ Payment callback received | paymentId={} orderId={}", paymentId, orderId);

        // ── 1. Load order ────────────────────────────────────────────────────
        Order order;
        try {
            order = orderService.findOrderById(orderId);
            log.info("✅ Order found: id={} status={}", order.getId(), order.getOrderStatus());
        } catch (Exception e) {
            log.error("❌ Order not found for orderId={}: {}", orderId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("Order not found: " + e.getMessage(), false));
        }

        // ── 2. Guard: skip if already processed (idempotency) ────────────────
        if (order.getOrderStatus() == OrderStatus.PLACED) {
            log.info("ℹ️ Order {} already PLACED — skipping duplicate callback", orderId);
            return ResponseEntity.ok(new ApiResponse("Payment already processed", true));
        }

        // ── 3. Fetch payment from Razorpay ───────────────────────────────────
        Payment payment;
        try {
            RazorpayClient client = new RazorpayClient(apiKey, apiSecret);
            payment = client.payments.fetch(paymentId);
            log.info("✅ Razorpay payment fetched: id={} status={} method={}",
                    paymentId, payment.get("status"), payment.get("method"));
        } catch (RazorpayException e) {
            log.error("❌ Razorpay fetch failed for paymentId={}: {}", paymentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiResponse("Failed to fetch payment from Razorpay: " + e.getMessage(), false));
        }

        // ── 4. Map payment details ───────────────────────────────────────────
        try {
            PaymentDetails details = order.getPaymentDetails();
            if (details == null) {
                details = new PaymentDetails();
                order.setPaymentDetails(details);
            }

            details.setPaymentId(paymentId);
            details.setProviderResponse(payment.toString());

            String method  = payment.get("method")  != null ? payment.get("method").toString()  : "wallet";
            String rzpStatus = payment.get("status") != null ? payment.get("status").toString() : "pending";

            switch (method.toLowerCase()) {
                case "upi"        -> details.setPaymentMethod(PaymentMethod.UPI);
                case "card"       -> details.setPaymentMethod(PaymentMethod.CARD);
                case "netbanking" -> details.setPaymentMethod(PaymentMethod.NET_BANKING);
                default           -> details.setPaymentMethod(PaymentMethod.WALLET);
            }

            switch (rzpStatus.toLowerCase()) {
                case "captured" -> details.setStatus(PaymentStatus.SUCCESS);
                case "failed"   -> details.setStatus(PaymentStatus.FAILED);
                case "refunded" -> details.setStatus(PaymentStatus.REFUNDED);
                default         -> details.setStatus(PaymentStatus.PENDING);
            }

            log.info("✅ Payment details mapped: method={} status={}", method, rzpStatus);

        } catch (Exception e) {
            log.error("❌ Failed to map payment details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to map payment details: " + e.getMessage(), false));
        }

        // ── 5. If payment captured → place order, reduce stock, clear cart ───
        if (order.getPaymentDetails().getStatus() == PaymentStatus.SUCCESS) {
            try {
                order.setOrderStatus(OrderStatus.PLACED);
                orderRepository.save(order);
                log.info("✅ Order {} marked as PLACED", orderId);
            } catch (Exception e) {
                log.error("❌ Failed to save order {}: {}", orderId, e.getMessage(), e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse("Failed to update order status: " + e.getMessage(), false));
            }

            try {
                productService.reduceStockAfterPurchase(order.getOrderItems());
                log.info("✅ Stock reduced for order {}", orderId);
            } catch (Exception e) {
                // Non-fatal — log but don't fail the payment response
                log.error("⚠️ Stock reduction failed for order {}: {}", orderId, e.getMessage(), e);
            }

            try {
                cartService.clearSelectedItems(order.getUser().getId());
                log.info("✅ Cart cleared for userId={}", order.getUser().getId());
            } catch (Exception e) {
                // Non-fatal — frontend also clears cart independently
                log.error("⚠️ Cart clear failed for userId={}: {}", order.getUser().getId(), e.getMessage(), e);
            }
        } else {
            // Payment not captured — save updated details but don't place order
            try {
                orderRepository.save(order);
                log.info("ℹ️ Order {} saved with payment status={}", orderId,
                        order.getPaymentDetails().getStatus());
            } catch (Exception e) {
                log.error("❌ Failed to save order after non-success payment: {}", e.getMessage(), e);
            }
        }

        return ResponseEntity.ok(new ApiResponse("Payment Updated", true));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 🔹 COD Order
    // ─────────────────────────────────────────────────────────────────────────
    @PostMapping("/orders/cod")
    public ResponseEntity<?> placeOrderCOD(@RequestBody OrderRequest requestBody) {
        try {
            User user = getLoggedUser();

            AddressDTO addressDTO = requestBody.getAddress();
            String couponCode = requestBody.getCouponCode();

            Order order;
            if (couponCode != null && !couponCode.trim().isEmpty()) {
                order = orderService.createPendingOrder(user, addressDTO, couponCode.trim());
            } else {
                order = orderService.createPendingOrder(user, addressDTO);
            }

            order.setOrderStatus(OrderStatus.PLACED);
            order.getPaymentDetails().setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
            order.getPaymentDetails().setStatus(PaymentStatus.SUCCESS);

            Order saved = orderRepository.save(order);

            try {
                productService.reduceStockAfterPurchase(saved.getOrderItems());
            } catch (Exception e) {
                log.error("⚠️ Stock reduction failed for COD order {}: {}", saved.getId(), e.getMessage(), e);
            }

            try {
                cartService.clearSelectedItems(user.getId());
            } catch (Exception e) {
                log.error("⚠️ Cart clear failed for COD order {}: {}", saved.getId(), e.getMessage(), e);
            }

            return ResponseEntity.ok(saved);

        } catch (UserException e) {
            log.error("❌ COD order failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper
    // ─────────────────────────────────────────────────────────────────────────
    private Address mapToAddress(Map<String, Object> addressMap) {
        if (addressMap == null) return null;

        Address address = new Address();
        address.setFirstName((String) addressMap.get("firstName"));
        address.setLastName((String) addressMap.get("lastName"));
        address.setStreetAddress((String) addressMap.get("streetAddress"));
        address.setCity((String) addressMap.get("city"));
        address.setDistrict((String) addressMap.get("district"));
        address.setState((String) addressMap.get("state"));
        address.setZipCode((String) addressMap.get("zipCode"));
        address.setMobile((String) addressMap.get("mobile"));

        return address;
    }
}