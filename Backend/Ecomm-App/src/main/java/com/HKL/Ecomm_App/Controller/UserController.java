package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Service.UserService;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // ── helper: get logged-in user from Security Context ─────────────────────
    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.findUserByEmail(auth.getName());
    }

    // ── GET /api/users/profile ───────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getFirstName() + " " + user.getLastName());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("mobile", user.getMobile());
        response.put("phone", user.getMobile()); // kept for backwards compat
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());
        response.put("address", user.getAddress());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // ── PUT /api/users/profile (update name + mobile) ───────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request) throws UserException {

        User user = getLoggedUser();

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName().trim());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }

        if (request.getMobile() != null) {
            user.setMobile(request.getMobile().trim());
        }

        userService.saveUser(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("mobile", user.getMobile());
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    // ── PUT /api/users/change-password ───────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) throws UserException {

        User user = getLoggedUser();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Current password is incorrect."));
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "New password must be at least 6 characters."));
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.saveUser(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    // ── GET /api/users/{userId} ──────────────────────────────────────────────
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) throws UserException {
        User user = userService.findUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // ── Request DTOs ─────────────────────────────────────────────────────────
    @Data
    static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String mobile;
    }

    @Data
    static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}
