package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.AddItemRequest;
import com.HKL.Ecomm_App.Service.CartService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
//@Tag(name="Cart Management", description="find user cart,add item to cart")
public class CartController {
    private final CartService cartService;
    private  final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }
    @GetMapping("/")
    //@Operation(description="find cart by userId")
    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt)throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Cart cart=cartService.findUserCart(user.getId());
        return ResponseEntity.ok(cart);
    }
//    @PutMapping("/add")
//    //@Operation(description="add item to cart")
//    public ResponseEntity<ApiResponse> addCartItem(@RequestHeader("Authorization") String jwt,
//                                                   @RequestBody AddItemRequest req) throws UserException, ProductException {
//        User user = userService.findUserProfileByJwt(jwt);
//        cartService.addCartItem(user.getId(), req);
//
//        ApiResponse res =new ApiResponse();
//        res.setMessage("Products created Successfully");
//        res.setStatus(true);
//        return new ResponseEntity<>(res, HttpStatus.OK);
//    }

}
