package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(
            @RequestHeader("Authorization") String jwt) throws UserException {

        System.out.println("📍 GET /api/users/profile called");

        User user = userService.findUserProfileByJwt(jwt);

        System.out.println("👤 Found user: " + user.getEmail());
        System.out.println("   Role: " + user.getRole());

        // ✅ CRITICAL: Include ALL user fields including role
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getFirstName() + " " + user.getLastName());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("phone", user.getMobile());
        response.put("role", user.getRole()); // ✅ MUST INCLUDE THIS!

        System.out.println("✅ Returning response with role: " + response.get("role"));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) throws UserException {
        User user = userService.findUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}