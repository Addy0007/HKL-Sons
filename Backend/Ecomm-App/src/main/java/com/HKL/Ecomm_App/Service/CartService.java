package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.AddItemRequest;

public interface CartService {
    Cart createCart(User user);
    String addCartItem(Long userId, AddItemRequest req) throws ProductException;
    Cart findUserCart(Long userId);
}
