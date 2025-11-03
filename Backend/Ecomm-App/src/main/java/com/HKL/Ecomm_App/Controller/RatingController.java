package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Rating;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.RatingRequest;
import com.HKL.Ecomm_App.Service.RatingService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.data.web.ReactiveOffsetScrollPositionHandlerMethodArgumentResolver;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final UserService userService;
    private final RatingService ratingService;

    public RatingController(UserService userService,RatingService ratingService){
        this.userService=userService;
        this.ratingService=ratingService;
    }

    @PostMapping("/create")
    public ResponseEntity<Rating> createRating(@RequestBody RatingRequest ratingRequest,
                                               @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User user = userService.findUserProfileByJwt(jwt);
        Rating createdRating = ratingService.createRating(ratingRequest, user);
        return ResponseEntity.ok(createdRating);
    }

    @GetMapping("product/{productId}")
    public ResponseEntity<List<Rating>> getRatingsByProductId(@PathVariable Long productId,@RequestHeader("Authorization") String jwt) throws ProductException, UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Rating> ratings = ratingService.getProductRating(productId);
        return ResponseEntity.ok(ratings);
    }
}
