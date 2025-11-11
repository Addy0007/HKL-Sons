package com.HKL.Ecomm_App.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentLinkResponse {
    private String payment_link_url;
    private String payment_link_id;
}
