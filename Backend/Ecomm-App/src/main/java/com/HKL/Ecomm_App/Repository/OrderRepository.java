package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders by user ID
     */
    List<Order> findByUserId(Long userId);

    /**
     * Count total orders by user ID
     * Used for checking if user is first-time buyer
     */
    long countByUserId(Long userId);

    /**
     * Count total orders by user object
     * Alternative method for consistency
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user = :user")
    long countByUser(@Param("user") User user);
}