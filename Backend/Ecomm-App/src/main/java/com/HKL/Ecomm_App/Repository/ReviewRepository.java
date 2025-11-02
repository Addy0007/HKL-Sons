package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
     List<Review> findAllByProductId(Long productId);
}
