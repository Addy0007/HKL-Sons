package com.HKL.Ecomm_App.Request;

import com.HKL.Ecomm_App.Model.Address;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private Address address;
}