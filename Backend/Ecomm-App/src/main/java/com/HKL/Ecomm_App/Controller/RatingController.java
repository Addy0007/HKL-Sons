package com.HKL.Ecomm_App.Controller;

import com.HKL.Ecomm_App.DTO.RatingDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.RatingRequest;
import com.HKL.Ecomm_App.Service.RatingService;
import com.HKL.Ecomm_App.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final UserService userService;
    private final RatingService ratingService;

    public RatingController(UserService userService, RatingService ratingService) {
        this.userService = userService;
        this.ratingService = ratingService;
    }

    private User getLoggedUser() throws UserException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.findUserByEmail(auth.getName());
    }

    @PostMapping("/create")
    public ResponseEntity<RatingDTO> createRating(@RequestBody RatingRequest ratingRequest)
            throws UserException, ProductException {

        User user = getLoggedUser();
        RatingDTO createdRating = ratingService.createRating(ratingRequest, user);

        return ResponseEntity.ok(createdRating);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RatingDTO>> getRatingsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.getProductRating(productId));
    }
}
