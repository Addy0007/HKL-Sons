package com.HKL.Ecomm_App.Config;

import com.HKL.Ecomm_App.Repository.CartItemRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@EnableScheduling
@Configuration
public class CartCleanupScheduler {

    private final CartItemRepository cartItemRepository;

    public CartCleanupScheduler(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Scheduled(fixedRate = 3600000) // every 1 hour
    public void cleanZeroQuantityItems() {
        cartItemRepository.deleteAll(
                cartItemRepository.findAll().stream()
                        .filter(item -> item.getQuantity() <= 0)
                        .toList()
        );
        System.out.println("🧹 Cleaned zero-quantity cart items");
    }
}
