package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.RatingDTO;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Model.Rating;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Request.RatingRequest;

import java.util.List;

public interface RatingService {
    RatingDTO createRating(RatingRequest req, User user) throws ProductException;
    List<RatingDTO> getProductRating(Long productId);
}
