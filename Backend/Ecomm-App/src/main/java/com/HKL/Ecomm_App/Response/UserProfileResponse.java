package com.HKL.Ecomm_App.Response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
}
