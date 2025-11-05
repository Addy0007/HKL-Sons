package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Service.CartItemService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {
    private final CartItemService cartItemService;
    private final UserService userService;

    public CartItemController(CartItemService cartItemService, UserService userService) {
        this.cartItemService = cartItemService;
        this.userService = userService;
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long cartItemId,
                                                 @RequestHeader("Authorization") String jwt)
            throws UserException, CartItemException {

        User user = userService.findUserProfileByJwt(jwt);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        return ResponseEntity.ok("Cart item removed successfully");
    }


    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long cartItemId, @RequestBody CartItem cartItem,
                                                   @RequestHeader("Authorization") String jwt) throws UserException, CartItemException {
        User user =userService.findUserProfileByJwt(jwt);
        CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(),cartItemId, cartItem);
        return ResponseEntity.ok(updatedCartItem);
    }
}
