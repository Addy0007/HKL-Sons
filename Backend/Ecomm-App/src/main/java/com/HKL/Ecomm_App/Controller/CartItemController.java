package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.UpdateCartItemRequest;
import com.HKL.Ecomm_App.Service.CartItemService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findUserByEmail(email);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable Long cartItemId)
            throws UserException, CartItemException {

        User user = getLoggedUser();
        cartItemService.removeCartItem(user.getId(), cartItemId);

        return ResponseEntity.ok("Cart item removed successfully");
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartItemRequest req
    ) throws UserException, CartItemException {

        User user = getLoggedUser();

        CartItem temp = new CartItem();
        temp.setQuantity(req.getQuantity());

        CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, temp);

        return ResponseEntity.ok(updatedCartItem);
    }

    @PatchMapping("/{cartItemId}/toggle-selection")
    public ResponseEntity<CartItem> toggleSelection(@PathVariable Long cartItemId)
            throws UserException, CartItemException {

        User user = getLoggedUser();
        CartItem updatedItem = cartItemService.toggleSelection(user.getId(), cartItemId);

        return ResponseEntity.ok(updatedItem);
    }
}
