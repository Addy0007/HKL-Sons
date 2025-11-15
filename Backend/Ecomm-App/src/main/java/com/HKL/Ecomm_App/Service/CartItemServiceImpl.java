package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Repository.CartItemRepository;
import com.HKL.Ecomm_App.Repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public CartItem createCartItem(CartItem cartItem) {
        calculateItemPrices(cartItem);
        CartItem saved = cartItemRepository.save(cartItem);
        System.out.println("✅ CartItem created with ID: " + saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public CartItem updateCartItem(Long userId, Long id, CartItem cartItem)
            throws CartItemException, UserException {

        CartItem item = findCartItemById(id);

        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new UserException("Unauthorized update request for cart item");
        }

     //   if (cartItem.getQuantity() <= 0) {
     //       cartItemRepository.delete(item);
      //      return null;
       // }

        item.setQuantity(cartItem.getQuantity());
        calculateItemPrices(item);

        return cartItemRepository.save(item);
    }

    @Override
    @Transactional(readOnly = true)
    public CartItem isCartItemExist(Cart cart, Product product, String size) {
        CartItem item = cartItemRepository.findExistingItem(cart, product, size);

        System.out.println("🔍 Checking if cart item exists: " + (item != null ? "YES (ID: " + item.getId() + ")" : "NO"));
        return item;
    }

    @Override
    @Transactional
    public void removeCartItem(Long userId, Long cartItemId)
            throws CartItemException, UserException {

        CartItem cartItem = findCartItemById(cartItemId);

        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new UserException("Cannot remove another user's cart item");
        }


        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    @Transactional(readOnly = true)
    public CartItem findCartItemById(Long cartItemId) throws CartItemException {
        return cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new CartItemException("CartItem not found with id " + cartItemId));
    }

    @Override
    @Transactional
    public CartItem toggleSelection(Long userId, Long cartItemId)
            throws CartItemException, UserException {

        System.out.println("🔄 Toggling selection for cart item: " + cartItemId + " (User: " + userId + ")");

        CartItem item = findCartItemById(cartItemId);

        // Security check: ensure user owns this cart item
        if (!item.getCart().getUser().getId().equals(userId)) {

            System.out.println("❌ Unauthorized toggle attempt - User " + userId + " doesn't own item " + cartItemId);
            throw new UserException("Unauthorized access to cart item");
        }

        // Toggle the selection state
        boolean newSelectionState = !item.isSelected();
        item.setSelected(newSelectionState);

        // Save and flush to ensure immediate persistence
        CartItem updated = cartItemRepository.saveAndFlush(item);

        System.out.println("✅ Cart item " + cartItemId + " selection toggled to: " + updated.isSelected());

        return updated;
    }

    private void calculateItemPrices(CartItem item) {
        item.setPrice(item.getProduct()
                .getPrice() * item.getQuantity());
        item.setDiscountedPrice(item.getProduct()
                .getDiscountedPrice() * item.getQuantity());
    }
}