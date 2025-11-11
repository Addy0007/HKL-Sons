package com.HKL.Ecomm_App.Response;

import com.HKL.Ecomm_App.Model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderId;
    private OrderStatus orderStatus;
    private Integer totalDiscountedPrice;
    private Integer totalItem;
    private LocalDateTime orderDate;
    private LocalDateTime createdAt;

    public static OrderResponse fromOrder(com.HKL.Ecomm_App.Model.Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderId(order.getOrderId());
        response.setOrderStatus(order.getOrderStatus());
        response.setTotalDiscountedPrice(order.getTotalDiscountedPrice());
        response.setTotalItem(order.getTotalItem());
        response.setOrderDate(order.getOrderDate());
        response.setCreatedAt(order.getCreatedAt());
        return response;
    }
}