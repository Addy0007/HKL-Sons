package com.HKL.Ecomm_App.Request;

import com.HKL.Ecomm_App.DTO.AddressDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private AddressDTO address;
    private String couponCode;

    public boolean hasCoupon() {
        return couponCode != null && !couponCode.trim().isEmpty();
    }

    public String getCouponCode() {
        return couponCode != null ? couponCode.trim().toUpperCase() : null;
    }
}