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

    // ✅ Case-insensitive simple category match
    List<Product> findByCategory_NameIgnoreCase(String categoryName);

    // ✅ Advanced filter with case-safe category filtering
    @Query("""
    SELECT p FROM Product p
    WHERE (:category IS NULL OR p.category.name = :category)
    AND (:minPrice IS NULL OR p.discountedPrice >= :minPrice)
    AND (:maxPrice IS NULL OR p.discountedPrice <= :maxPrice)
    AND (:minDiscount IS NULL OR p.discountedPrice <= :maxPrice)
    AND (:minDiscount IS NULL OR p.discountPercent >= :minDiscount)
""")
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            Pageable pageable
    );

    // ✅ FULL HIERARCHY FILTER (Top → Second → Third)
    @Query("""
        SELECT p FROM Product p
        WHERE LOWER(p.category.name) = LOWER(:third)
        AND LOWER(p.category.parentCategory.name) = LOWER(:second)
        AND LOWER(p.category.parentCategory.parentCategory.name) = LOWER(:first)
    """)
    List<Product> findByFullHierarchy(
            @Param("first") String first,
            @Param("second") String second,
            @Param("third") String third
    );
    @Query("""
    SELECT p FROM Product p
    LEFT JOIN p.category c
    WHERE LOWER(p.title) LIKE %:q%
       OR LOWER(p.brand) LIKE %:q%
       OR LOWER(c.name) LIKE %:q%
    ORDER BY p.title ASC
    """)
    List<Product> searchByKeyword(@Param("q") String q);

    List<Product> findByIsFeaturedTrueOrderByFeaturedOrderAsc();
}
