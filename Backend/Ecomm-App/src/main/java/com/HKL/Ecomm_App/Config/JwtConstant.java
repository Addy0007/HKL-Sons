package com.HKL.Ecomm_App.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConstant {

    @Value("${jwt.secret}")
    private String secretKey;

    public static final String JWT_HEADER = "Authorization";

    // Getter for secret key
    public String getSecretKey() {
        return secretKey;
    }
}