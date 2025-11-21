package com.HKL.Ecomm_App.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RatingDTO {
    private Long id;
    private String username;
    private Long productId;
    private double rating;
    private LocalDateTime createdAt;
}
