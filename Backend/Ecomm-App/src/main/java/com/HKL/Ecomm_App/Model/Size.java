package com.HKL.Ecomm_App.Model;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class Size {

    private String name;
    private int Quantity;
}
