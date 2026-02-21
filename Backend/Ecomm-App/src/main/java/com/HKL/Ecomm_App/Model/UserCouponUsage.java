package com.HKL.Ecomm_App.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_coupon_usage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCouponUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // which order used this coupon

    @Column(nullable = false)
    private Double discountApplied; // actual discount amount in rupees

    @Column(nullable = false)
    private LocalDateTime usedAt = LocalDateTime.now();
}