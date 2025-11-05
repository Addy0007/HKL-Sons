package com.HKL.Ecomm_App.Response;

import com.HKL.Ecomm_App.Model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private User user;

    public  AuthResponse(){

    }
    public AuthResponse(String jwt,String message,User user) {
        this.message = message;
        this.jwt = jwt;
        this.user=user;
    }
}
