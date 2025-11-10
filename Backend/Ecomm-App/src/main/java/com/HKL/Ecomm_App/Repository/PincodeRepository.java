package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Pincode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PincodeRepository extends JpaRepository<Pincode, Long> {
    List<Pincode> findByDistrict_DistrictName(String districtName);
    Optional<Pincode> findByPincode(String pincode);
}
