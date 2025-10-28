package com.HKL.Ecomm_App.Request;

import com.HKL.Ecomm_App.Model.Size;
import lombok.Data;
import jakarta.validation.constraints.*;

import java.util.HashSet;
import java.util.Set;

@Data
public class CreateProductRequest {

    @NotBlank
    private String title;

    private String description;

    @Positive
    private int price;

    @PositiveOrZero
    private int discountedPrice;

    @Min(0)
    @Max(100)
    private int discountPercent;

    @Min(0)
    private int quantity;

    @NotBlank
    private String brand;

    @NotBlank
    private String color;

    private Set<Size> size = new HashSet<>();

    private String imageUrl;

    @NotBlank
    private String topLevelCategory;

    @NotBlank
    private String secondLevelCategory;

    @NotBlank
    private String thirdLevelCategory;
}
