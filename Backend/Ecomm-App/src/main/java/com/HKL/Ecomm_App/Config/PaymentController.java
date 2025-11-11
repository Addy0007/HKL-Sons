package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Model.*;
import com.HKL.Ecomm_App.Repository.AddressRepository;
import com.HKL.Ecomm_App.Repository.OrderRepository;
import com.HKL.Ecomm_App.Response.ApiResponse;
import com.HKL.Ecomm_App.Response.PaymentLinkResponse;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.UserService;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private final AddressRepository addressRepository;

    public PaymentController(OrderService orderService, UserService userService, OrderRepository orderRepository,
                             CartService cartService,AddressRepository addressRepository) {
        this.orderService = orderService;
        this.userService = userService;
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.addressRepository = addressRepository;
    }

    // ✅ Create Pending Order for Razorpay
    @PostMapping("/orders/pending")
    public ResponseEntity<Order> createPendingOrder(
            @RequestBody Address address,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        User user = userService.findUserProfileByJwt(jwt);

        Order pendingOrder = orderService.createPendingOrder(user, address);
        return ResponseEntity.ok(pendingOrder);
    }

    // ✅ Create Razorpay Order (used by popup)
    @PostMapping("/payments/razorpay-order/{orderId}")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        Order order = orderService.findOrderById(orderId);
        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        int amount = (int) Math.round(order.getTotalPrice() * 100);

        JSONObject options = new JSONObject();
        options.put("amount", amount);
        options.put("currency", "INR");
        options.put("receipt", "rcpt_" + order.getId());
        options.put("payment_capture", 1);

        com.razorpay.Order rzpOrder = razorpay.orders.create(options);

        Map<String, Object> res = new HashMap<>();
        res.put("orderId", order.getId());
        res.put("razorpayOrderId", rzpOrder.get("id"));
        res.put("amount", amount);
        res.put("currency", "INR");
        res.put("key", apiKey);

        return ResponseEntity.ok(res);
    }

    // ✅ Razorpay Callback Verify & Confirm Order
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse> redirect(
            @RequestParam(name = "payment_id") String paymentId,
            @RequestParam(name = "order_id") Long orderId
    ) throws OrderException, RazorpayException {

        Order order = orderService.findOrderById(orderId);
        RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);

        Payment payment = razorpayClient.payments.fetch(paymentId);

        if (payment.get("status").equals("captured")) {
            order.getPaymentDetails().setPaymentId(paymentId);
            order.getPaymentDetails().setStatus(PaymentStatus.SUCCESS);
            order.setOrderStatus(OrderStatus.PLACED);
            orderRepository.save(order);

            // ✅ Clear cart on successful payment
            cartService.clearCart(order.getUser().getId());
        }

        ApiResponse res = new ApiResponse("Order placed Successfully", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/orders/cod")
    public ResponseEntity<Order> placeOrderCOD(@RequestBody Address address,
                                               @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        Order order = orderService.createPendingOrder(user, address);
        order.setOrderStatus(OrderStatus.PLACED);
        order.getPaymentDetails().setStatus(PaymentStatus.COD);

        Order saved = orderRepository.save(order);
        cartService.clearSelectedItems(user.getId());

        return ResponseEntity.ok(saved);
    }

}
