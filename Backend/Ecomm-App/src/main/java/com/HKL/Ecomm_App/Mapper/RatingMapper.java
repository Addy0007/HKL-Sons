package com.HKL.Ecomm_App.Mapper;

import com.HKL.Ecomm_App.DTO.RatingDTO;
import com.HKL.Ecomm_App.Model.Rating;

public class RatingMapper {

    public static RatingDTO toDTO(Rating rating) {
        RatingDTO dto = new RatingDTO();

        dto.setId(rating.getId());
        dto.setRating(rating.getRating());
        dto.setCreatedAt(rating.getCreatedAt());
        dto.setProductId(rating.getProduct().getId());

        if (rating.getUser() != null) {
            dto.setUsername(rating.getUser().getFirstName());
        }

        return dto;
    }
}
