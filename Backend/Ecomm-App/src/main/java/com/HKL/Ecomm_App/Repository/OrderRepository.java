package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND (o.orderStatus = 'PENDING'" +
            " OR o.orderStatus = 'SHIPPING' OR o.orderStatus = 'DELIVERED' OR o.orderStatus = 'PLACED'" +
            " OR o.orderStatus = 'CONFIRMED' OR o.orderStatus = 'OUT_FOR_DELIVERY')")
    public List<Order> getUsersOrders(@Param("userId") Long userid);
}
