package com.HKL.Ecomm_App.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pincodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pincode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "district_id")
    private District district;

    @Column(nullable = false)
    private String pincode;

    @Column(nullable = false)
    private Boolean deliverable; // true = deliverable, false = not deliverable
}
