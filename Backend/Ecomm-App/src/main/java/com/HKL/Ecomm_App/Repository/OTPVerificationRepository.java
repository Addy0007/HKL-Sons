package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.OTPVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPVerificationRepository extends JpaRepository<OTPVerification,Long> {
    Optional<OTPVerification> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);

    @Modifying
    @Query("DELETE FROM OTPVerification o WHERE o.expiry < :time")
    void deleteExpired(LocalDateTime time);

    @Modifying
    @Query("DELETE FROM OTPVerification o WHERE o.email = :email AND o.verified = false")
    void deleteUnverifiedByEmail(String email);
}
