package com.HKL.Ecomm_App.Response;

import com.HKL.Ecomm_App.Model.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {

    private Long id;
    private String orderId;

    private OrderStatus orderStatus;

    private double totalPrice;
    private double totalDiscountedPrice;
    private double discount;

    private int totalItem;

    private LocalDateTime orderDate;
    private LocalDateTime createdAt;
    private LocalDateTime deliveryDate;

    private Address shippingAddress;
    private List<OrderItemResponse> orderItems;

    private PaymentDetails paymentDetails;

    public static OrderResponse fromOrder(Order order) {
        OrderResponse res = new OrderResponse();

        res.setId(order.getId());
        res.setOrderId(order.getOrderId());
        res.setOrderStatus(order.getOrderStatus());

        res.setTotalPrice(order.getTotalPrice());
        res.setTotalDiscountedPrice(order.getTotalDiscountedPrice());
        res.setDiscount(order.getDiscount() != null ? order.getDiscount() : 0.0);

        res.setTotalItem(order.getTotalItem());
        res.setOrderDate(order.getOrderDate());
        res.setCreatedAt(order.getCreatedAt());
        res.setDeliveryDate(order.getDeliveryDate());

        res.setShippingAddress(order.getShippingAddress());
        res.setPaymentDetails(order.getPaymentDetails());

        // Convert each OrderItem → OrderItemResponse for clean JSON
        res.setOrderItems(
                order.getOrderItems().stream()
                        .map(OrderItemResponse::fromOrderItem)
                        .collect(Collectors.toList())
        );

        return res;
    }
}
