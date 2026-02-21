package com.HKL.Ecomm_App.Mapper;

import com.HKL.Ecomm_App.DTO.CategoryDTO;
import com.HKL.Ecomm_App.DTO.ProductDTO;
import com.HKL.Ecomm_App.Model.Category;
import com.HKL.Ecomm_App.Model.Product;

import java.util.ArrayList;
import java.util.List;

public class ProductMapper {

    public static ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();

        // ==================== BASIC INFO ====================
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setQuantity(product.getQuantity());
        dto.setColor(product.getColor());
        dto.setPrice(product.getPrice());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setBrand(product.getBrand());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setFeaturedOrder(product.getFeaturedOrder());

        // ==================== IMAGES ====================
        // ✅ BACKWARD COMPATIBLE: Keep imageUrl as main image
        dto.setImageUrl(product.getImageUrl());

        // ✅ NEW: Get all images using helper method
        dto.setImages(product.getAllImageUrls());

        // ==================== ENHANCED DETAILS ====================
        dto.setHighlights(product.getHighlights());
        dto.setMaterial(product.getMaterial());
        dto.setCareInstructions(product.getCareInstructions());
        dto.setCountryOfOrigin(product.getCountryOfOrigin());
        dto.setManufacturer(product.getManufacturer());

        // ==================== SIZES & RATINGS ====================
        dto.setSizes(product.getSizes());
        dto.setNumRatings(product.getNumRatings());

        // ==================== METADATA ====================
        dto.setCategory(toCategoryDTO(product.getCategory()));
        dto.setCreatedAt(product.getCreatedAt());

        return dto;
    }

    // Helper method to convert Category to CategoryDTO
    private static CategoryDTO toCategoryDTO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setLevel(category.getLevel());

        // Recursively map parent category
        if (category.getParentCategory() != null) {
            dto.setParentCategory(toCategoryDTO(category.getParentCategory()));
        }

        return dto;
    }
}