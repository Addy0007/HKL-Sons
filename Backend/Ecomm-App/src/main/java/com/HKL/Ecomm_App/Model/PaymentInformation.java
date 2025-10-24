package com.HKL.Ecomm_App.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDate;

@Data
@Embeddable
public class PaymentInformation {

    @Column(name="cardholder_name")
    private String cardholderName;

    @Column(name="card_number")
    private String cardNumber;

    @Column(name="expiration_date")
    private LocalDate expirationDate;

    @Column(name="cvv")
    private String cvv;

}
