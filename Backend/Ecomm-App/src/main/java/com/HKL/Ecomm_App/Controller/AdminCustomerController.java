package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> customers = users.stream()
                // ✅ CHANGED: Show all users (you can filter later if needed)
                .map(user -> {
                    Map<String, Object> customer = new HashMap<>();
                    customer.put("id", user.getId());
                    customer.put("firstName", user.getFirstName());
                    customer.put("lastName", user.getLastName());
                    customer.put("email", user.getEmail());
                    customer.put("mobile", user.getMobile());
                    customer.put("role", user.getRole()); // ✅ Added role
                    customer.put("createdAt", user.getCreatedAt());
                    return customer;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(customers);
    }

    @GetMapping("/{customerId}/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getCustomerOrders(@PathVariable Long customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("customer", Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));

        // Note: You'll need to add the orders relationship to User entity
        // For now, return empty list
        response.put("orders", List.of());

        return ResponseEntity.ok(response);
    }
}