package com.HKL.Ecomm_App.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code; // e.g., "FIRST20", "WELCOME10", "NEWYEAR25"

    @Column(nullable = false)
    private String description; // e.g., "20% off for first-time buyers"

    @Column(nullable = false)
    private Double discountPercentage; // e.g., 20.0 for 20%

    private Double maxDiscountAmount; // e.g., 500.0 (max discount cap in rupees)

    private Double minOrderAmount; // e.g., 500.0 (minimum order value to apply coupon)

    @Column(nullable = false)
    private Boolean isActive = true; // can be disabled by admin

    @Column(nullable = false)
    private Boolean isFirstOrderOnly = false; // true for first-time user coupons

    private LocalDateTime validFrom;

    private LocalDateTime validUntil;

    private Integer maxUsagePerUser = 1; // how many times a user can use this coupon

    private Integer totalUsageLimit; // total times this coupon can be used across all users (null = unlimited)

    @Column(nullable = false)
    private Integer currentUsageCount = 0; // track how many times it's been used

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}