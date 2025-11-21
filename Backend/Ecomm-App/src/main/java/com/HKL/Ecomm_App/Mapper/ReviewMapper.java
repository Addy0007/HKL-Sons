package com.HKL.Ecomm_App.Mapper;

import com.HKL.Ecomm_App.DTO.ReviewDTO;
import com.HKL.Ecomm_App.Model.Review;

public class ReviewMapper {

    public static ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();

        dto.setId(review.getId());
        dto.setReview(review.getReview());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setProductId(review.getProduct().getId());

        if (review.getUser() != null) {
            dto.setUsername(review.getUser().getFirstName());
        }

        return dto;
    }
}
