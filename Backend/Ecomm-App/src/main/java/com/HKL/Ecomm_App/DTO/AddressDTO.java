package com.HKL.Ecomm_App.DTO;

import lombok.Data;

@Data
public class AddressDTO {
    private String firstName;
    private String lastName;
    private String streetAddress;
    private String city;
    private String district;
    private String state;
    private String zipCode;
    private String mobile;
}