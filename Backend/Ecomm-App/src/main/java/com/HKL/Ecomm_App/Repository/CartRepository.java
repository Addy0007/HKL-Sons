package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query(value = "SELECT c.* FROM cart c WHERE c.user_id = :userId", nativeQuery = true)
    Cart findByUserIdNative(@Param("userId") Long userId);

    // Keep the original for backwards compatibility
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems WHERE c.user.id = :userId")
    Cart findByUserId(@Param("userId") Long userId);
}