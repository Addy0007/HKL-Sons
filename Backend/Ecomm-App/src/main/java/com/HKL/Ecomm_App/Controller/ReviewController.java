package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Review;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.ReviewRequest;
import com.HKL.Ecomm_App.Service.ReviewService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest reviewRequest, @RequestHeader("Authorization") String jwt)
            throws UserException, ProductException {
        User user = userService.findUserProfileByJwt(jwt);
        Review createdReview = reviewService.createReview(reviewRequest, user);
        return ResponseEntity.ok(createdReview);
    }
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId, @RequestHeader("Authorization") String jwt)
            throws ProductException, UserException {
        User user = userService.findUserProfileByJwt(jwt);
        List<Review> reviews = reviewService.getAllReview(productId);
        return ResponseEntity.ok(reviews);
    }
}
