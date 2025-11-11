package com.HKL.Ecomm_App.Repository;

import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT ci FROM CartItem ci WHERE ci.cart = :cart AND ci.product = :product AND ci.size = :size AND ci.userId = :userId")
    CartItem isCartItemExist(@Param("cart") Cart cart,
                             @Param("product") Product product,
                             @Param("size") String size,
                             @Param("userId") Long userId);
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId")
    List<CartItem> findByCartId(@Param("cartId") Long cartId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cart.id = :cartId AND c.selected = true")
    void deleteSelectedItems(@Param("cartId") Long cartId);


}
