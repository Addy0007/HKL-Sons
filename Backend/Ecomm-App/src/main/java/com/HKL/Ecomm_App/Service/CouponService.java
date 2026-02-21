package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.CouponException;
import com.HKL.Ecomm_App.Model.Coupon;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Model.UserCouponUsage;
import com.HKL.Ecomm_App.Repository.CouponRepository;
import com.HKL.Ecomm_App.Repository.OrderRepository;
import com.HKL.Ecomm_App.Repository.UserCouponUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserCouponUsageRepository userCouponUsageRepository;

    @Autowired
    private OrderRepository orderRepository;

    // ============= VALIDATION RESULT DTO =============
    public static class CouponValidationResult {
        private boolean valid;
        private String message;
        private Coupon coupon;
        private Double discountAmount;

        public CouponValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public CouponValidationResult(boolean valid, String message, Coupon coupon, Double discountAmount) {
            this.valid = valid;
            this.message = message;
            this.coupon = coupon;
            this.discountAmount = discountAmount;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }

        public Coupon getCoupon() {
            return coupon;
        }

        public Double getDiscountAmount() {
            return discountAmount;
        }
    }

    // ============= USER-FACING METHODS =============

    /**
     * Validate and calculate discount for a coupon
     * Used by CouponController for validation endpoint
     */
    public Map<String, Object> validateCoupon(String couponCode, Double orderAmount, User user) {
        Map<String, Object> result = new HashMap<>();

        Coupon coupon = couponRepository.findByCode(couponCode.toUpperCase())
                .orElse(null);

        if (coupon == null) {
            result.put("valid", false);
            result.put("message", "Invalid coupon code");
            return result;
        }

        // Check if coupon is active
        if (!coupon.getIsActive()) {
            result.put("valid", false);
            result.put("message", "This coupon is no longer active");
            return result;
        }

        // Check validity dates
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            result.put("valid", false);
            result.put("message", "This coupon is not yet valid");
            return result;
        }

        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            result.put("valid", false);
            result.put("message", "This coupon has expired");
            return result;
        }

        // Check minimum order amount
        if (coupon.getMinOrderAmount() != null && orderAmount < coupon.getMinOrderAmount()) {
            result.put("valid", false);
            result.put("message", String.format("Minimum order amount of ₹%.2f required", coupon.getMinOrderAmount()));
            return result;
        }

        // Check if it's a first-order-only coupon
        if (coupon.getIsFirstOrderOnly()) {
            long completedOrders = orderRepository.countByUserId(user.getId());
            if (completedOrders > 0) {
                result.put("valid", false);
                result.put("message", "This coupon is only valid for first-time buyers");
                return result;
            }
        }

        // Check per-user usage limit
        long userUsageCount = userCouponUsageRepository.countByUserAndCoupon(user, coupon);
        if (coupon.getMaxUsagePerUser() != null && userUsageCount >= coupon.getMaxUsagePerUser()) {
            result.put("valid", false);
            result.put("message", "You have already used this coupon the maximum number of times");
            return result;
        }

        // Check total usage limit
        if (coupon.getTotalUsageLimit() != null && coupon.getCurrentUsageCount() >= coupon.getTotalUsageLimit()) {
            result.put("valid", false);
            result.put("message", "This coupon has reached its usage limit");
            return result;
        }

        // Calculate discount
        Double discountAmount = (orderAmount * coupon.getDiscountPercentage()) / 100.0;

        // Apply max discount cap if specified
        if (coupon.getMaxDiscountAmount() != null && discountAmount > coupon.getMaxDiscountAmount()) {
            discountAmount = coupon.getMaxDiscountAmount();
        }

        result.put("valid", true);
        result.put("message", "Coupon applied successfully");
        result.put("couponCode", coupon.getCode());
        result.put("discountPercentage", coupon.getDiscountPercentage());
        result.put("discountAmount", discountAmount);

        return result;
    }

    /**
     * Validate and calculate discount - returns CouponValidationResult
     * Used by OrderServiceImpl for order creation
     */
    public CouponValidationResult validateAndCalculateDiscount(String couponCode, User user, Double orderAmount)
            throws CouponException {

        Coupon coupon = couponRepository.findByCode(couponCode.toUpperCase())
                .orElseThrow(() -> new CouponException("Invalid coupon code"));

        // Check if coupon is active
        if (!coupon.getIsActive()) {
            throw new CouponException("This coupon is no longer active");
        }

        // Check validity dates
        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            throw new CouponException("This coupon is not yet valid");
        }

        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            throw new CouponException("This coupon has expired");
        }

        // Check minimum order amount
        if (coupon.getMinOrderAmount() != null && orderAmount < coupon.getMinOrderAmount()) {
            throw new CouponException(
                    String.format("Minimum order amount of ₹%.2f required", coupon.getMinOrderAmount())
            );
        }

        // Check if it's a first-order-only coupon
        if (coupon.getIsFirstOrderOnly()) {
            long completedOrders = orderRepository.countByUserId(user.getId());
            if (completedOrders > 0) {
                throw new CouponException("This coupon is only valid for first-time buyers");
            }
        }

        // Check per-user usage limit
        long userUsageCount = userCouponUsageRepository.countByUserAndCoupon(user, coupon);
        if (coupon.getMaxUsagePerUser() != null && userUsageCount >= coupon.getMaxUsagePerUser()) {
            throw new CouponException("You have already used this coupon the maximum number of times");
        }

        // Check total usage limit
        if (coupon.getTotalUsageLimit() != null && coupon.getCurrentUsageCount() >= coupon.getTotalUsageLimit()) {
            throw new CouponException("This coupon has reached its usage limit");
        }

        // Calculate discount
        Double discountAmount = (orderAmount * coupon.getDiscountPercentage()) / 100.0;

        // Apply max discount cap if specified
        if (coupon.getMaxDiscountAmount() != null && discountAmount > coupon.getMaxDiscountAmount()) {
            discountAmount = coupon.getMaxDiscountAmount();
        }

        return new CouponValidationResult(true, "Coupon applied successfully", coupon, discountAmount);
    }

    /**
     * Get available coupons for a user based on order amount
     * Used internally and by getAvailableCouponsForUser
     */
    public List<Coupon> getAvailableCoupons(User user, Double orderAmount) {
        List<Coupon> allActiveCoupons = couponRepository.findByIsActiveTrue();
        LocalDateTime now = LocalDateTime.now();

        return allActiveCoupons.stream()
                .filter(coupon -> {
                    // Check validity dates
                    if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
                        return false;
                    }
                    if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
                        return false;
                    }

                    // Check minimum order amount
                    if (coupon.getMinOrderAmount() != null && orderAmount < coupon.getMinOrderAmount()) {
                        return false;
                    }

                    // Check if it's first-order-only
                    if (coupon.getIsFirstOrderOnly()) {
                        long completedOrders = orderRepository.countByUserId(user.getId());
                        if (completedOrders > 0) {
                            return false;
                        }
                    }

                    // Check per-user usage limit
                    long userUsageCount = userCouponUsageRepository.countByUserAndCoupon(user, coupon);
                    if (coupon.getMaxUsagePerUser() != null && userUsageCount >= coupon.getMaxUsagePerUser()) {
                        return false;
                    }

                    // Check total usage limit
                    if (coupon.getTotalUsageLimit() != null && coupon.getCurrentUsageCount() >= coupon.getTotalUsageLimit()) {
                        return false;
                    }

                    return true;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get available coupons for a user based on order amount
     * Called by CouponController /api/coupons/available endpoint
     */
    public List<Coupon> getAvailableCouponsForUser(User user, Double orderAmount) {
        return getAvailableCoupons(user, orderAmount);
    }

    /**
     * Get all active coupons (without user-specific filtering)
     * Called by CouponController /api/coupons/all endpoint
     */
    public List<Coupon> getAllActiveCoupons() {
        return couponRepository.findByIsActiveTrue();
    }

    /**
     * Check if user is a first-time buyer
     */
    public boolean isFirstTimeUser(User user) {
        long orderCount = orderRepository.countByUserId(user.getId());
        return orderCount == 0;
    }

    /**
     * Apply coupon to an order (record usage)
     * Signature matches OrderServiceImpl usage
     */
    @Transactional
    public void applyCouponToOrder(Coupon coupon, User user, Order order, Double discountApplied) {
        // Record user coupon usage
        UserCouponUsage usage = new UserCouponUsage();
        usage.setUser(user);
        usage.setCoupon(coupon);
        usage.setOrder(order);
        usage.setDiscountApplied(discountApplied);
        usage.setUsedAt(LocalDateTime.now());
        userCouponUsageRepository.save(usage);

        // Increment coupon usage count
        coupon.setCurrentUsageCount(coupon.getCurrentUsageCount() + 1);
        couponRepository.save(coupon);
    }

    // ============= ADMIN METHODS =============

    /**
     * Create a new coupon (Admin only)
     */
    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        // Check if code already exists
        if (couponRepository.findByCode(coupon.getCode().toUpperCase()).isPresent()) {
            throw new RuntimeException("Coupon code already exists");
        }

        // Set defaults
        coupon.setCode(coupon.getCode().toUpperCase());
        if (coupon.getCurrentUsageCount() == null) {
            coupon.setCurrentUsageCount(0);
        }
        if (coupon.getIsActive() == null) {
            coupon.setIsActive(true);
        }
        if (coupon.getIsFirstOrderOnly() == null) {
            coupon.setIsFirstOrderOnly(false);
        }

        return couponRepository.save(coupon);
    }

    /**
     * Update an existing coupon (Admin only)
     */
    @Transactional
    public Coupon updateCoupon(Long id, Coupon couponDetails) {
        Coupon existingCoupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // Check if new code conflicts with another coupon
        if (!existingCoupon.getCode().equals(couponDetails.getCode().toUpperCase())) {
            if (couponRepository.findByCode(couponDetails.getCode().toUpperCase()).isPresent()) {
                throw new RuntimeException("Coupon code already exists");
            }
        }

        // Update fields
        existingCoupon.setCode(couponDetails.getCode().toUpperCase());
        existingCoupon.setDescription(couponDetails.getDescription());
        existingCoupon.setDiscountPercentage(couponDetails.getDiscountPercentage());
        existingCoupon.setMaxDiscountAmount(couponDetails.getMaxDiscountAmount());
        existingCoupon.setMinOrderAmount(couponDetails.getMinOrderAmount());
        existingCoupon.setIsActive(couponDetails.getIsActive());
        existingCoupon.setIsFirstOrderOnly(couponDetails.getIsFirstOrderOnly());
        existingCoupon.setValidFrom(couponDetails.getValidFrom());
        existingCoupon.setValidUntil(couponDetails.getValidUntil());
        existingCoupon.setMaxUsagePerUser(couponDetails.getMaxUsagePerUser());
        existingCoupon.setTotalUsageLimit(couponDetails.getTotalUsageLimit());

        return couponRepository.save(existingCoupon);
    }

    /**
     * Delete a coupon (Admin only)
     */
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        // Check if coupon has been used
        long usageCount = userCouponUsageRepository.countByCoupon(coupon);
        if (usageCount > 0) {
            throw new RuntimeException("Cannot delete coupon that has already been used. Consider deactivating it instead.");
        }

        couponRepository.delete(coupon);
    }

    /**
     * Get all coupons (Admin only)
     */
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    /**
     * Get coupon by ID (Admin only)
     */
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }
}