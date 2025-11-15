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

    // ✅ Get all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ Confirm order
    @PutMapping("/{orderId}/confirmed")
    public ResponseEntity<Order> confirmOrderHandler(@PathVariable Long orderId)
            throws OrderException {
        return ResponseEntity.ok(orderService.confirmOrder(orderId));
    }

    // ✅ Mark as shipped
    @PutMapping("/{orderId}/shipped")
    public ResponseEntity<Order> shippedOrderHandler(@PathVariable Long orderId)
            throws OrderException {
        return ResponseEntity.ok(orderService.shippedOrder(orderId));
    }

    // ✅ Mark as delivered
    @PutMapping("/{orderId}/delivered")
    public ResponseEntity<Order> deliveredOrderHandler(@PathVariable Long orderId)
            throws OrderException {
        return ResponseEntity.ok(orderService.deliveredOrder(orderId));
    }

    // ✅ Cancel order
    @PutMapping("/{orderId}/cancelled")
    public ResponseEntity<Order> cancelledOrderHandler(@PathVariable Long orderId)
            throws OrderException {
        return ResponseEntity.ok(orderService.cancelledOrder(orderId));
    }
}