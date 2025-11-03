package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    @PutMapping("/{orderId}/confirmed")
    public ResponseEntity<Order> confirmOrderHandler(@PathVariable Long orderId,
                                                     @RequestHeader("Authorization")String jwt) throws OrderException {
        Order order = orderService.confirmOrder(orderId);
        return ResponseEntity.ok(order);
    }
    @PutMapping("/{orderId}/shipped")
    public ResponseEntity<Order> shippedOrderHandler(@PathVariable Long orderId,
                                                     @RequestHeader("Authorization")String jwt) throws OrderException {
        Order order = orderService.shippedOrder(orderId);
        return ResponseEntity.ok(order);
    }
    @PutMapping("/{orderId}/delivered")
    public ResponseEntity<Order> deliveredOrderHandler(@PathVariable Long orderId,
                                                     @RequestHeader("Authorization")String jwt) throws OrderException {
        Order order = orderService.deliveredOrder(orderId);
        return ResponseEntity.ok(order);
    }
    @PutMapping("/{orderId}/cancelled")
    public ResponseEntity<Order> cancelledOrderHandler(@PathVariable Long orderId,
                                                     @RequestHeader("Authorization")String jwt) throws OrderException {
        Order order = orderService.cancelledOrder(orderId);
        return ResponseEntity.ok(order);
    }
}
