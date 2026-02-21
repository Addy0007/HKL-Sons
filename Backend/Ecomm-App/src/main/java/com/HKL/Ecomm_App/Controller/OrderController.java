package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.OrderRequest;
import com.HKL.Ecomm_App.Response.OrderResponse;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findUserByEmail(email);
    }

    /**
     * Create order from full cart (checkout all items)
     * POST /api/orders
     * Body: { "address": {...}, "couponCode": "FIRST20" (optional) }
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest orderRequest)
            throws UserException {

        User user = getLoggedUser();

        Order order;
        if (orderRequest.hasCoupon()) {
            order = orderService.createOrder(user, orderRequest.getAddress(), orderRequest.getCouponCode());
        } else {
            order = orderService.createOrder(user, orderRequest.getAddress());
        }

        return new ResponseEntity<>(OrderResponse.fromOrder(order), HttpStatus.CREATED);
    }

    /**
     * Create pending order from selected cart items
     * POST /api/orders/pending
     * Body: { "address": {...}, "couponCode": "FIRST20" (optional) }
     */
    @PostMapping("/pending")
    public ResponseEntity<OrderResponse> createPendingOrder(@RequestBody OrderRequest orderRequest)
            throws UserException {

        User user = getLoggedUser();

        Order order;
        if (orderRequest.hasCoupon()) {
            order = orderService.createPendingOrder(user, orderRequest.getAddress(), orderRequest.getCouponCode());
        } else {
            order = orderService.createPendingOrder(user, orderRequest.getAddress());
        }

        return new ResponseEntity<>(OrderResponse.fromOrder(order), HttpStatus.CREATED);
    }

    /**
     * Get order by ID
     * GET /api/orders/{orderId}
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> findOrderById(@PathVariable Long orderId)
            throws UserException, OrderException {

        User user = getLoggedUser();
        Order order = orderService.findOrderById(orderId);

        // SECURITY CHECK - Users can only view their own orders
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot view someone else's order");
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    /**
     * Get user's order history
     * GET /api/orders/user
     */
    @GetMapping("/user")
    public ResponseEntity<?> userOrderHistory() throws UserException {
        User user = getLoggedUser();
        return ResponseEntity.ok(orderService.userOrderHistory(user.getId()));
    }

    /**
     * Update order status - Placed (after payment confirmation)
     * PUT /api/orders/{orderId}/placed
     */
    @PutMapping("/{orderId}/placed")
    public ResponseEntity<?> markOrderAsPlaced(@PathVariable Long orderId)
            throws UserException, OrderException {

        User user = getLoggedUser();
        Order order = orderService.findOrderById(orderId);

        // Security check - Users can only update their own orders
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot update someone else's order");
        }

        Order updatedOrder = orderService.placedOrder(orderId);
        return ResponseEntity.ok(OrderResponse.fromOrder(updatedOrder));
    }

    /**
     * Cancel order (User can cancel their own order)
     * PUT /api/orders/{orderId}/cancelled
     */
    @PutMapping("/{orderId}/cancelled")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId)
            throws UserException, OrderException {

        User user = getLoggedUser();
        Order order = orderService.findOrderById(orderId);

        // Security check - Users can only cancel their own orders
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot cancel someone else's order");
        }

        Order cancelledOrder = orderService.cancelledOrder(orderId);
        return ResponseEntity.ok(OrderResponse.fromOrder(cancelledOrder));
    }
}