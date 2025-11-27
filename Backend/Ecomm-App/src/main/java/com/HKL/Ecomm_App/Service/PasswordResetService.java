package com.HKL.Ecomm_App.Service;

public interface PasswordResetService {
    public void createResetToken(String email);
    public void resetPassword(String token, String newPassword);
}


