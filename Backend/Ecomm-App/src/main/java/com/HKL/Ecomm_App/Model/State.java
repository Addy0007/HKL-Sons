package com.HKL.Ecomm_App.Model;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "states")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class State
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String stateName;
}