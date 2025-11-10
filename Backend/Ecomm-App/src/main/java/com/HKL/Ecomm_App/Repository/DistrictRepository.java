package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.District;
import com.HKL.Ecomm_App.Model.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District, Long> {
    Optional<District> findByDistrictNameAndState(String districtName, State state);
    List<District> findByState_StateName(String stateName);
}
