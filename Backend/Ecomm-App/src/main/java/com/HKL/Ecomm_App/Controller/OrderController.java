package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.CreateOrderRequest;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // ✅ Changed from "/api/orders/" to "/api/orders" (removed trailing slash)
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest req, @RequestHeader("Authorization") String jwt) throws UserException {
        System.out.println("📦 Creating order...");
        System.out.println("📍 Address received: " + req.getAddress());

        User user = userService.findUserProfileByJwt(jwt);
        System.out.println("👤 User: " + user.getEmail());

        Order createdOrder = orderService.createOrder(user, req.getAddress());
        System.out.println("✅ Order created with ID: " + createdOrder.getId());

        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistory(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Order> orders = orderService.userOrderHistory(user.getId());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> findOrderById(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws OrderException {
        Order order = orderService.findOrderById(id);
        return ResponseEntity.ok(order);
    }
}