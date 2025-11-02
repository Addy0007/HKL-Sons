package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating,Long> {

    List<Rating> findAllByProductId(Long productId);
}
