package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    // Find all images for a specific product
    List<ProductImage> findByProductId(Long productId);

    // Delete all images for a product
    void deleteByProductId(Long productId);
}