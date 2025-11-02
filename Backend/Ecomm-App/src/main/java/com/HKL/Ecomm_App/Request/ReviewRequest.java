package com.HKL.Ecomm_App.Request;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long productId;
    private String review;
}
