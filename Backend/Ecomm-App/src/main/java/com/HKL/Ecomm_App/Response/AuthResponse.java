// Response/AuthResponse.java
package com.HKL.Ecomm_App.Response;

import com.HKL.Ecomm_App.Model.User;

public class AuthResponse {
    private String jwt;
    private String message;
    private User user; // ✅ This is critical!

    // Default constructor
    public AuthResponse() {}

    // Constructor with all fields
    public AuthResponse(String jwt, String message, User user) {
        this.jwt = jwt;
        this.message = message;
        this.user = user;
    }

    // Getters and Setters
    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}