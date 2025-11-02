package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Review;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.ReviewRequest;

import java.util.List;

public interface ReviewService {

    Review createReview(ReviewRequest req, User user) throws ProductException;
    List<Review> getAllReview(Long productId);
}
