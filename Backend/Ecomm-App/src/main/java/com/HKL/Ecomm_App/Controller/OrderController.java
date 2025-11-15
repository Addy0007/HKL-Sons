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

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody Address shippingAddress)
            throws UserException {

        User user = getLoggedUser();
        Order order = orderService.createOrder(user, shippingAddress);

        return new ResponseEntity<>(OrderResponse.fromOrder(order), HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> findOrderById(@PathVariable Long orderId)
            throws UserException, OrderException {

        User user = getLoggedUser();
        Order order = orderService.findOrderById(orderId);

        // SECURITY CHECK
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You cannot view someone else's order");
        }

        return ResponseEntity.ok(OrderResponse.fromOrder(order));
    }

    @GetMapping("/user")
    public ResponseEntity<?> userOrderHistory() throws UserException {
        User user = getLoggedUser();
        return ResponseEntity.ok(orderService.userOrderHistory(user.getId()));
    }
}
