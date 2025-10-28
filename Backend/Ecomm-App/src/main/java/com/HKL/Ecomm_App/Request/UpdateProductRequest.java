package com.HKL.Ecomm_App.Request;

import lombok.Data;

@Data
public class UpdateProductRequest {
    private String title;
    private String description;
    private Integer price;
    private Integer discountedPrice;
    private Integer discountPercent;
    private Integer quantity;
    private String brand;
    private String color;
    private String imageUrl;
}
