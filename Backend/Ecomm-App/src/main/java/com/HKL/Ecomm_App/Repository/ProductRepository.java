package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory_Name(String categoryName);

    @Query("""
        SELECT p FROM Product p
        WHERE (:category IS NULL OR LOWER(p.category.name) = :category)
        AND (:minPrice IS NULL OR p.discountedPrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.discountedPrice <= :maxPrice)
        AND (:minDiscount IS NULL OR p.discountPercent >= :minDiscount)
    """)
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            Pageable pageable
    );
}
