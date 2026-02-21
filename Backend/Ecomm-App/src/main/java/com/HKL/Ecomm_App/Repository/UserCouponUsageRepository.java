package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Coupon;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Model.UserCouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCouponUsageRepository extends JpaRepository<UserCouponUsage, Long> {

    /**
     * Count how many times a user has used a specific coupon
     */
    long countByUserAndCoupon(User user, Coupon coupon);

    /**
     * Count total usage of a coupon across all users
     */
    long countByCoupon(Coupon coupon);
}