package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Repository.CartItemRepository;
import com.HKL.Ecomm_App.Repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final CartRepository cartRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository,
                               UserService userService,
                               CartRepository cartRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userService = userService;
    }

    @Override
    public CartItem createCartItem(CartItem cartItem) {
        cartItem.setQuantity(1);
        calculateItemPrices(cartItem);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem)
            throws CartItemException, UserException {

        CartItem item = findCartItemById(id);

        if (!item.getUserId().equals(userId)) {
            throw new UserException("Unauthorized update request for cart item");
        }

        item.setQuantity(cartItem.getQuantity());
        calculateItemPrices(item);

        return cartItemRepository.save(item);
    }

    @Override
    public CartItem isCartItemExist(Cart cart, Product product, String size, Long userId) {
        return cartItemRepository.isCartItemExist(cart, product, size, userId);
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId)
            throws CartItemException, UserException {

        CartItem cartItem = findCartItemById(cartItemId);

        if (!cartItem.getUserId().equals(userId)) {
            throw new UserException("Cannot remove another user's cart item");
        }

        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    @Transactional
    public CartItem findCartItemById(Long cartItemId) throws CartItemException {
        return cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new CartItemException("CartItem not found with id " + cartItemId));
    }

    private void calculateItemPrices(CartItem item) {
        item.setPrice(item.getProduct().getPrice() * item.getQuantity());
        item.setDiscountedPrice(item.getProduct().getDiscountedPrice() * item.getQuantity());
    }
}
