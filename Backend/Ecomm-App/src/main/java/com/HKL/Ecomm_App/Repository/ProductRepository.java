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

    List<Product> findByCategory_NameIgnoreCase(String categoryName);

    // ✅ FIX 1: All filtering done in DB, including color/size/stock
    // Pagination is now handled at DB level — no more Integer.MAX_VALUE
    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN p.sizes sz
        WHERE (:category IS NULL OR p.category.name = :category)
        AND (:minPrice IS NULL OR p.discountedPrice >= :minPrice)
        AND (:maxPrice IS NULL OR p.discountedPrice <= :maxPrice)
        AND (:minDiscount IS NULL OR p.discountPercent >= :minDiscount)
        AND (:color IS NULL OR LOWER(p.color) = LOWER(:color))
        AND (:size IS NULL OR (sz.name = :size AND sz.quantity > 0))
        AND (
            :stock IS NULL
            OR (:stock = 'in_stock'  AND (p.quantity > 0 OR sz.quantity > 0))
            OR (:stock = 'out_stock' AND (p.quantity = 0 AND (sz IS NULL OR sz.quantity = 0)))
        )
    """)
    Page<Product> filterProducts(
            @Param("category") String category,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            @Param("color") String color,       // pass null if list is empty
            @Param("size") String size,         // pass null if list is empty
            @Param("stock") String stock,
            Pageable pageable                   // real pagination — no MAX_VALUE
    );

    // ✅ FIX 2: Fetch sizes eagerly in the same query to avoid N+1
    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN FETCH p.sizes
        LEFT JOIN FETCH p.images
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