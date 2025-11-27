package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Service.PasswordResetService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    // ------------------- REQUEST RESET TOKEN -------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {

        passwordResetService.createResetToken(request.getEmail());

        // SECURITY: Do not reveal if email exists or not
        return ResponseEntity.ok(
                "If this email is registered, a reset link has been sent."
        );
    }

    // ------------------- RESET PASSWORD -------------------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }
}
