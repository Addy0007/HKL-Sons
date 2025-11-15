package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.AddItemRequest;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findUserByEmail(email);
    }

    @GetMapping({"", "/"})
    public ResponseEntity<Cart> findUserCart() throws UserException {
        User user = getLoggedUser();
        Cart cart = cartService.findUserCart(user.getId());
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/add")
    public ResponseEntity<Cart> addCartItem(@RequestBody AddItemRequest req)
            throws UserException, ProductException, CartItemException {

        User user = getLoggedUser();
        cartService.addCartItem(user.getId(), req);
        Cart cart = cartService.findUserCart(user.getId());

        return ResponseEntity.ok(cart);
    }
}
