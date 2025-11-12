package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address,Long> {
    List<Address> findByUserIdAndActiveTrue(Long userId);



}
