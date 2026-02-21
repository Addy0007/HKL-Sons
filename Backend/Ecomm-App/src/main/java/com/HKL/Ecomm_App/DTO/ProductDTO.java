package com.HKL.Ecomm_App.DTO;

import com.HKL.Ecomm_App.Model.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    // ==================== BASIC INFO ====================
    private Long id;
    private String title;
    private String description;
    private int quantity;
    private String color;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String brand;

    // ==================== IMAGES ====================
    private String imageUrl; // ✅ Main image (backward compatible)
    private List<String> images; // ✅ All images (main + additional)

    // ==================== ENHANCED DETAILS ====================
    private String highlights; // Comma-separated or array
    private String material;
    private String careInstructions;
    private String countryOfOrigin;
    private String manufacturer;

    // ==================== SIZES & RATINGS ====================
    private Set<Size> sizes;
    private int numRatings;

    // ==================== METADATA ====================
    private CategoryDTO category;
    private LocalDateTime createdAt;

    private Boolean isFeatured;
    private Integer featuredOrder;
}