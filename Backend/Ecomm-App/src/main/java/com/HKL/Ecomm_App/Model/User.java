package com.HKL.Ecomm_App.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String firstName;
    private String lastName;
    private String password;

    @Column(unique = true)
    private String email;

    private String role;
    private String mobile;

    @OneToMany(mappedBy ="user",cascade = CascadeType.ALL)
    private List<Address> address =new ArrayList<>();

    @Embedded
    @ElementCollection
    @CollectionTable(name="payment_information",joinColumns = @JoinColumn(name="user_id"))
    private List<PaymentInformation> paymentInformations=new ArrayList<>();

    @OneToMany(mappedBy = "user",cascade=CascadeType.ALL)
    @JsonIgnore
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "user",cascade=CascadeType.ALL)
    @JsonIgnore
    private List<Review> reviews=new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;



}
