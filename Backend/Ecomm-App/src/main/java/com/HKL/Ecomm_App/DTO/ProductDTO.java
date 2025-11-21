package com.HKL.Ecomm_App.DTO;

import com.HKL.Ecomm_App.Model.Size;
import lombok.Data;

import java.util.Set;

@Data
public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private int quantity;
    private String color;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String brand;
    private String imageUrl;
    private Set<Size> sizes;
    private int numRatings;
}
