package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Exception.UserException;

public interface UserService {
    User findUserById(Long userId) throws UserException;
    User findUserProfileByJwt(String jwt) throws UserException;
    public User findUserByEmail(String email) throws UserException;
    User saveUser(User user);

}
