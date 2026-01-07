package com.HKL.Ecomm_App.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder; // 0 = main image, 1,2,3 = additional images

    @Column(name = "alt_text")
    private String altText; // For accessibility

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    public ProductImage(String imageUrl, Integer displayOrder, Product product) {
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.product = product;
    }
}