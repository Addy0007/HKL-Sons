package com.HKL.Ecomm_App.Controller;


import com.HKL.Ecomm_App.Exception.CouponException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Coupon;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Service.CouponService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @Autowired
    private UserService userService;

    /**
     * Validate a coupon code and calculate discount
     * POST /api/coupons/validate
     * Body: { "couponCode": "FIRST20", "orderAmount": 1500 }
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String jwt
    ) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            String couponCode = (String) request.get("couponCode");
            double orderAmount = ((Number) request.get("orderAmount")).doubleValue();

            CouponService.CouponValidationResult result =
                    couponService.validateAndCalculateDiscount(couponCode, user, orderAmount);

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("discountAmount", result.getDiscountAmount());
            response.put("discountPercentage", result.getCoupon().getDiscountPercentage());
            response.put("message", result.getMessage());
            response.put("couponCode", result.getCoupon().getCode());

            return ResponseEntity.ok(response);

        } catch (CouponException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("message", e.getMessage());
            return ResponseEntity.ok(error); // Return 200 with valid=false
        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
    }

    /**
     * Get all available coupons for current user
     * GET /api/coupons/available?orderAmount=1500
     */
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableCoupons(
            @RequestParam(required = false, defaultValue = "0") double orderAmount,
            @RequestHeader("Authorization") String jwt
    ) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            List<Coupon> coupons = couponService.getAvailableCouponsForUser(user, orderAmount);
            return ResponseEntity.ok(coupons);
        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
    }

    /**
     * Check if user is a first-time buyer
     * GET /api/coupons/first-time-check
     */
    @GetMapping("/first-time-check")
    public ResponseEntity<?> checkFirstTimeUser(@RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserProfileByJwt(jwt);
            boolean isFirstTime = couponService.isFirstTimeUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("isFirstTimeUser", isFirstTime);
            if (isFirstTime) {
                response.put("message", "You're eligible for first-time buyer discounts!");
            }

            return ResponseEntity.ok(response);
        } catch (UserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
    }

    /**
     * Get all active coupons (public)
     * GET /api/coupons/all
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllActiveCoupons() {
        try {
            List<Coupon> coupons = couponService.getAllActiveCoupons();
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
    }
}