package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Response.OrderResponse;
import com.HKL.Ecomm_App.Service.OrderService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody Address shippingAddress,
            @RequestHeader("Authorization") String jwt) throws UserException {

        System.out.println("📦 Creating order...");
        System.out.println("📍 Address received: " + shippingAddress);

        User user = userService.findUserProfileByJwt(jwt);
        System.out.println("👤 User: " + user.getEmail());

        Order order = orderService.createOrder(user, shippingAddress);

        System.out.println("✅ Order created with ID: " + order.getId());

        // Return a simple DTO to avoid serialization issues
        OrderResponse response = OrderResponse.fromOrder(order);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> findOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) throws UserException, OrderException {

        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.findOrderById(orderId);

        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<?> userOrderHistory(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(orderService.usersOrderHistory(user.getId()), HttpStatus.OK);
    }
}