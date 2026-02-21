package com.HKL.Ecomm_App.Exception;


/**
 * Custom exception for coupon-related errors
 */
public class CouponException extends Exception {

    public CouponException(String message) {
        super(message);
    }

    public CouponException(String message, Throwable cause) {
        super(message, cause);
    }
}