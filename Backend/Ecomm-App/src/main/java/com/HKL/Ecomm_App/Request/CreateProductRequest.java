package com.HKL.Ecomm_App.Request;

import com.HKL.Ecomm_App.Model.Size;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CreateProductRequest {


    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Positive(message = "Price must be positive")
    private int price;

    @PositiveOrZero(message = "Discounted price must be positive or zero")
    private int discountedPrice;

    @Min(value = 0, message = "Discount percent must be at least 0")
    @Max(value = 100, message = "Discount percent must be at most 100")
    private int discountPercent;

    @Min(value = 0, message = "Quantity must be at least 0")
    private int quantity;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Color is required")
    private String color;


    @NotBlank(message = "Main image URL is required")
    private String imageUrl;

    private List<String> additionalImages;


    private String highlights;

    private String material;

    private String careInstructions;

    private String countryOfOrigin;

    private String manufacturer;


    @NotBlank(message = "Top level category is required")
    private String topLevelCategory;

    @NotBlank(message = "Second level category is required")
    private String secondLevelCategory;

    @NotBlank(message = "Third level category is required")
    private String thirdLevelCategory;


    @NotEmpty(message = "At least one size is required")
    private Set<Size> size = new HashSet<>();

    private Boolean isFeatured;
    private Integer featuredOrder;
}
