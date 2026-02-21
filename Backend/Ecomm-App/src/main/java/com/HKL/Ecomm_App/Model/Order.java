package com.HKL.Ecomm_App.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", unique = true)
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"password", "address", "paymentInformation", "ratings", "reviews"})
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"order"}) // ✅ Prevent circular reference
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shipping_address_id")
    @JsonIgnoreProperties({"user"})
    private Address shippingAddress;


    @Embedded
    private PaymentDetails paymentDetails = new PaymentDetails();

    private double totalPrice;
    private Double totalDiscountedPrice;
    private Double discount;



    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private int totalItem;

    @CreationTimestamp
    private LocalDateTime createdAt;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon appliedCoupon; // The coupon that was applied to this order

    @Column(name = "coupon_code")
    private String couponCode; // Store coupon code for reference even if coupon is deleted

    @Column(name = "coupon_discount")
    private Double couponDiscount = 0.0; // Discount amount from coupon in rupees

    @Column(name = "is_first_order")
    private Boolean isFirstOrder = false; // Track if this was user's first order

}