package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.PasswordResetToken;
import com.HKL.Ecomm_App.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
}
