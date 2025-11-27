package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Model.PasswordResetToken;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.PasswordResetTokenRepository;
import com.HKL.Ecomm_App.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetServiceImpl(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepo,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public void createResetToken(String email) {

        User user = userRepository.findByEmail(email);

        // SECURITY: Do NOT reveal if email exists
        if (user == null) {
            // Pretend everything is okay
            return;
        }

        Optional<PasswordResetToken> existingTokenOpt = tokenRepo.findByUser(user);

        if (existingTokenOpt.isPresent()) {

            PasswordResetToken existing = existingTokenOpt.get();

            if (existing.getExpiry().isAfter(LocalDateTime.now())) {

                long minutesPassed = java.time.Duration
                        .between(existing.getCreatedAt(), LocalDateTime.now())
                        .toMinutes();

                if (minutesPassed < 5) {
                    return; // simply return silently for security
                }
            }

            tokenRepo.delete(existing);
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiry(LocalDateTime.now().plusMinutes(15));

        tokenRepo.save(resetToken);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken =
                tokenRepo.findByToken(token)
                        .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepo.delete(resetToken);
    }
}
