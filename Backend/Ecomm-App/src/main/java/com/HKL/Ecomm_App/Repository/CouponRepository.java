package com.HKL.Ecomm_App.Repository;


import com.HKL.Ecomm_App.Model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCode(String code);

    List<Coupon> findByIsActiveTrue();

    List<Coupon> findByIsActiveTrueAndValidFromBeforeAndValidUntilAfter(
            LocalDateTime now1, LocalDateTime now2
    );

    boolean existsByCode(String code);
}
