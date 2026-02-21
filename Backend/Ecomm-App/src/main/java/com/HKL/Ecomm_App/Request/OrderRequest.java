package com.HKL.Ecomm_App.Request;


import com.HKL.Ecomm_App.Model.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private Address address;
    private String couponCode; // Optional - can be null

    public boolean hasCoupon() {
        return couponCode != null && !couponCode.trim().isEmpty();
    }

    public String getCouponCode() {
        return couponCode != null ? couponCode.trim().toUpperCase() : null;
    }
}