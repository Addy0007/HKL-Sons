package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.*;
import com.HKL.Ecomm_App.Repository.OrderRepository;
import com.HKL.Ecomm_App.Response.ApiResponse;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.ProductService;
import com.HKL.Ecomm_App.Service.UserService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
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

    // 🔹 Create Pending Order
    @PostMapping("/orders/pending")
    public ResponseEntity<?> createPendingOrder(@RequestBody Address address) {

        try {
            User user = getLoggedUser();
            Order pending = orderService.createPendingOrder(user, address);
            return ResponseEntity.ok(pending);

        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    // 🔹 Create Razorpay Order
    @PostMapping("/payments/razorpay-order/{orderId}")
    public ResponseEntity<?> createRazorpayOrder(@PathVariable Long orderId) {

        try {
            User user = getLoggedUser();
            Order order = orderService.findOrderById(orderId);

            // Verify order belongs to user
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse("Failed to create Razorpay order", false));
        }
    }

    // 🔹 Razorpay Redirect Callback
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> redirect(
            @RequestParam("payment_id") String paymentId,
            @RequestParam("order_id") Long orderId
    ) {
        try {
            Order order = orderService.findOrderById(orderId);
            RazorpayClient client = new RazorpayClient(apiKey, apiSecret);

            Payment payment = client.payments.fetch(paymentId);

            PaymentDetails details = order.getPaymentDetails();
            details.setPaymentId(paymentId);
            details.setProviderResponse(payment.toString());

            String method = payment.get("method");
            String rzpStatus = payment.get("status");

            // Payment method mapping
            switch (method.toLowerCase()) {
                case "upi" -> details.setPaymentMethod(PaymentMethod.UPI);
                case "card" -> details.setPaymentMethod(PaymentMethod.CARD);
                case "netbanking" -> details.setPaymentMethod(PaymentMethod.NET_BANKING);
                default -> details.setPaymentMethod(PaymentMethod.WALLET);
            }

            // Status mapping
            switch (rzpStatus.toLowerCase()) {
                case "captured" -> details.setStatus(PaymentStatus.SUCCESS);
                case "failed" -> details.setStatus(PaymentStatus.FAILED);
                case "refunded" -> details.setStatus(PaymentStatus.REFUNDED);
                default -> details.setStatus(PaymentStatus.PENDING);
            }

            if (details.getStatus() == PaymentStatus.SUCCESS) {
                order.setOrderStatus(OrderStatus.PLACED);
                orderRepository.save(order);

                productService.reduceStockAfterPurchase(order.getOrderItems());
                cartService.clearSelectedItems(order.getUser().getId());
            }

            return ResponseEntity.ok(new ApiResponse("Payment Updated", true));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse("Unexpected error in payment callback", false));
        }
    }

    // 🔹 COD Order
    @PostMapping("/orders/cod")
    public ResponseEntity<?> placeOrderCOD(@RequestBody Address address) {

        try {
            User user = getLoggedUser();
            Order order = orderService.createPendingOrder(user, address);

            order.setOrderStatus(OrderStatus.PLACED);
            order.getPaymentDetails().setPaymentMethod(PaymentMethod.CASH_ON_DELIVERY);
            order.getPaymentDetails().setStatus(PaymentStatus.SUCCESS);

            Order saved = orderRepository.save(order);

            productService.reduceStockAfterPurchase(saved.getOrderItems());
            cartService.clearSelectedItems(user.getId());

            return ResponseEntity.ok(saved);

        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }
}
