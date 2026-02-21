package com.HKL.Ecomm_App.Response;

import com.HKL.Ecomm_App.Model.OrderItem;
import lombok.Data;

@Data
public class OrderItemResponse {

    private Long id;
    private Long productId;   // ← ADDED
    private String productName;
    private String imageUrl;
    private String size;
    private int quantity;
    private double price;

    public static OrderItemResponse fromOrderItem(OrderItem item) {
        OrderItemResponse res = new OrderItemResponse();

        res.setId(item.getId());
        res.setProductId(item.getProduct().getId());   // ← ADDED
        res.setProductName(item.getProduct().getTitle());
        res.setImageUrl(item.getProduct().getImageUrl());
        res.setSize(item.getSize());
        res.setQuantity(item.getQuantity());
        res.setPrice(item.getPrice());

        return res;
    }
}