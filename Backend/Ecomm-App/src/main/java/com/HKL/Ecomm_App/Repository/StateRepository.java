package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StateRepository extends JpaRepository<State, Long> {
    Optional<State> findByStateName(String stateName);
}
