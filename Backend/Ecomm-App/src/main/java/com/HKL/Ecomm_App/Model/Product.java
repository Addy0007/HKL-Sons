package com.HKL.Ecomm_App.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Column(length = 2000) // ✅ Increased length for detailed descriptions
    private String description;

    private int quantity;
    private String color;
    private int price;

    @Column(name="discounted_price")
    private int discountedPrice;

    @Column(name="discount_percent")
    private int discountPercent;

    private String brand;

    // ✅ BACKWARD COMPATIBLE: Keep this for existing code
    @Column(name="image_url")
    private String imageUrl; // This will be the MAIN image

    // ✅ NEW: Multiple images with ordering
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    // ✅ NEW: Additional product details
    @Column(length = 1000)
    private String highlights; // Comma-separated or JSON string

    @Column(name = "material")
    private String material; // e.g., "Cotton", "Polyester"

    @Column(name = "care_instructions", length = 500)
    private String careInstructions; // e.g., "Machine wash cold"

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    @Column(name = "manufacturer")
    private String manufacturer;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    private Set<Size> sizes = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @Column(name="num_ratings")
    private int numRatings;

    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // ✅ Helper method to get all image URLs (backward compatible)
    public List<String> getAllImageUrls() {
        List<String> urls = new ArrayList<>();

        // Add main image first (for backward compatibility)
        if (imageUrl != null && !imageUrl.isEmpty()) {
            urls.add(imageUrl);
        }

        // Add additional images
        if (images != null) {
            images.stream()
                    .filter(img -> !img.getImageUrl().equals(imageUrl))
                    .forEach(img -> urls.add(img.getImageUrl()));
        }

        return urls;
    }

    // ADD THESE FIELDS TO YOUR EXISTING Product.java entity

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "featured_order")
    private Integer featuredOrder = 0;


}