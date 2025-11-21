package com.HKL.Ecomm_App.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private String username;
    private Long productId;
    private String review;
    private LocalDateTime createdAt;
}
