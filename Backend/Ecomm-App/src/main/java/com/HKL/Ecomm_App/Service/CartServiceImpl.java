package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.CartItemException;
import com.HKL.Ecomm_App.Exception.ProductException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Cart;
import com.HKL.Ecomm_App.Model.CartItem;
import com.HKL.Ecomm_App.Model.Product;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Repository.CartItemRepository;
import com.HKL.Ecomm_App.Repository.CartRepository;
import com.HKL.Ecomm_App.Request.AddItemRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemService cartItemService;
    private final ProductService productService;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;

    @PersistenceContext
    private EntityManager entityManager;

    public CartServiceImpl(CartRepository cartRepository,
                           CartItemService cartItemService,
                           ProductService productService,
                           CartItemRepository cartItemRepository,
                           UserService userService) {
        this.cartItemService = cartItemService;
        this.cartRepository = cartRepository;
        this.productService = productService;
        this.cartItemRepository = cartItemRepository;
        this.userService = userService;
    }

    @Override
    @Transactional
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        Cart savedCart = cartRepository.save(cart);
        System.out.println("✅ New cart created with ID: " + savedCart.getId());
        return savedCart;
    }

    @Override
    @Transactional
    public String addCartItem(Long userId, AddItemRequest req)
            throws ProductException, CartItemException, UserException {

        System.out.println("🛒 Adding item to cart - UserId: " + userId +
                ", ProductId: " + req.getProductId() +
                ", Size: " + req.getSize() +
                ", Quantity: " + req.getQuantity());

        User user = userService.findUserById(userId);
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) {
            System.out.println("📦 Creating new cart for user: " + userId);
            cart = createCart(user);
            entityManager.flush();
        } else {
            System.out.println("✅ Found existing cart: " + cart.getId());
        }

        Product product = productService.findProductById(req.getProductId());
        System.out.println("🎁 Product found: " + product.getTitle());

        CartItem existing = cartItemService.isCartItemExist(cart, product, req.getSize());


        if (existing == null) {
            System.out.println("➕ Creating new cart item");

            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCart(cart);
            cartItem.setQuantity(req.getQuantity());
            cartItem.setSize(req.getSize());
            cartItem.setPrice(product.getPrice() * req.getQuantity());
            cartItem.setDiscountedPrice(product.getDiscountedPrice() * req.getQuantity());

            CartItem saved = cartItemRepository.saveAndFlush(cartItem);
            System.out.println("💾 New cart item saved with ID: " + saved.getId());

        } else {
            System.out.println("🔄 Updating existing cart item: " + existing.getId());

            int newQuantity = existing.getQuantity() + req.getQuantity();
            existing.setQuantity(newQuantity);
            existing.setPrice(product.getPrice() * newQuantity);
            existing.setDiscountedPrice(product.getDiscountedPrice() * newQuantity);

            cartItemRepository.saveAndFlush(existing);
            System.out.println("💾 Cart item updated - New quantity: " + newQuantity);
        }

        // Clear entity manager to avoid stale state
        entityManager.clear();
        System.out.println("🔄 Cleared entity manager cache");

        return "Item added to cart";
    }

    @Override
    @Transactional(readOnly = true)
    public Cart findUserCart(Long userId) {
        System.out.println("🔍 Finding cart for user: " + userId);

        Cart cart;
        try {
            cart = entityManager.createQuery(
                            "SELECT c FROM Cart c WHERE c.user.id = :userId", Cart.class)
                    .setParameter("userId", userId)
                    .getSingleResult();
        } catch (Exception e) {
            System.out.println("⚠️ No cart found for user: " + userId);
            return null;
        }

        System.out.println("✅ Cart found: " + cart.getId());

        // Fetch cart items in stable order
        List<CartItem> items = entityManager.createQuery(
                        "SELECT ci FROM CartItem ci WHERE ci.cart.id = :cartId ORDER BY ci.id ASC",
                        CartItem.class)
                .setParameter("cartId", cart.getId())
                .getResultList();

        cart.setCartItems(items);

        System.out.println("📦 Loaded " + items.size() + " cart items");

        // Calculate cart totals
        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for (CartItem item : items) {
            System.out.println("  📌 Item: " + item.getProduct().getTitle() +
                    " | Qty: " + item.getQuantity() +
                    " | Size: " + item.getSize());

            totalPrice += item.getPrice();
            totalDiscountedPrice += item.getDiscountedPrice();
            totalItem += item.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setTotalItem(totalItem);
        cart.setDiscount(totalPrice - totalDiscountedPrice);

        System.out.println("💰 Total: ₹" + totalDiscountedPrice + " (Items: " + totalItem + ")");

        return cart;
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        System.out.println("🗑️ Clearing cart for user: " + userId);

        Cart cart = cartRepository.findByUserId(userId);

        if (cart != null && !cart.getCartItems().isEmpty()) {
            // Delete all cart items
            cartItemRepository.deleteAll(cart.getCartItems());

            // Clear the collection
            cart.getCartItems().clear();

            // Reset totals
            cart.setTotalPrice(0);
            cart.setTotalDiscountedPrice(0);
            cart.setTotalItem(0);
            cart.setDiscount(0);

            cartRepository.save(cart);
            entityManager.flush();

            System.out.println("✅ Cart cleared successfully");
        } else {
            System.out.println("⚠️ Cart is already empty or doesn't exist");
        }
    }

    @Override
    @Transactional
    public void clearSelectedItems(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) return;

        Long cartId = cart.getId();

        // ✅ Physically delete selected items from DB
        cartItemRepository.deleteSelectedItems(cartId);

        // ✅ Clear selected items from memory list
        cart.getCartItems().removeIf(CartItem::isSelected);

        updateCartTotals(cart);

        cartRepository.save(cart);
    }

    private void updateCartTotals(Cart cart) {
        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        for (CartItem item : cart.getCartItems()) {
            totalPrice += item.getPrice();
            totalDiscountedPrice += item.getDiscountedPrice();
            totalItem += item.getQuantity();
        }

        cart.setTotalPrice(totalPrice);
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setTotalItem(totalItem);
        cart.setDiscount(totalPrice - totalDiscountedPrice);

        cartRepository.save(cart);
    }

}