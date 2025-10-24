package com.HKL.Ecomm_App.Model;

import jakarta.persistence.*;
import lombok.*;

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
    private String description;
    private int quantity;
    private String color;
    private int price;
    @Column(name="discounted_price")
    private int discountedPrice;
    @Column(name="discount_percent")
    private int discountPercent;
    private String brand;
    @Column(name="image_url")
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    private Set<Size> sizes = new HashSet<>();

    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @Column(name="num_ratings")
    private int numRatings;

    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;
    private LocalDateTime createdAt;
}
