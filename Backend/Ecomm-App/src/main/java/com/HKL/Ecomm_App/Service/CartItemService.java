package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.Product;


public interface CartItemService {
    CartItem createCartItem(CartItem cartItem);
    CartItem updateCartItem(Long userId,Long id,CartItem cartItem)throws CartItemException, UserException;
    CartItem isCartItemExist(Cart cart, Product product,String size,Long userId);
    void removeCartItem(Long userId,Long cartItemId) throws  CartItemException,UserException;
    CartItem findCartItemById(Long cartItemId) throws  CartItemException;
}
