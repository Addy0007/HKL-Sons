package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.*;
import com.HKL.Ecomm_App.Repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    private final CartService cartService;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderItemService orderItemService;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public OrderServiceImpl(CartService cartService, OrderRepository orderRepository,
                            AddressRepository addressRepository, UserRepository userRepository,
                            OrderItemService orderItemService, OrderItemRepository orderItemRepository,
                            CartItemRepository cartItemRepository,
                            CartRepository cartRepository) {
        this.cartService = cartService;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.orderItemService = orderItemService;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }


    @Override
    @Transactional(readOnly = true)
    public Order findOrderById(Long orderId) throws OrderException {
        System.out.println("🔍 Finding order with ID: " + orderId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found with id: " + orderId));

        System.out.println("✅ Order found: " + order.getId() + " | Status: " + order.getOrderStatus());
        return order;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }


    @Override
    @Transactional
    public Order placedOrder(Long orderId) throws OrderException {
        System.out.println("📦 Placing order: " + orderId);
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.PLACED);
        Order saved = orderRepository.save(order);
        System.out.println("✅ Order placed successfully");
        return saved;
    }

    @Override
    @Transactional
    public Order confirmOrder(Long orderId) throws OrderException {
        System.out.println("✅ Confirming order: " + orderId);
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        Order saved = orderRepository.save(order);
        System.out.println("✅ Order confirmed successfully");
        return saved;
    }

    @Override
    @Transactional
    public Order shippedOrder(Long orderId) throws OrderException {
        System.out.println("🚚 Shipping order: " + orderId);
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.SHIPPED);
        Order saved = orderRepository.save(order);
        System.out.println("✅ Order shipped successfully");
        return saved;
    }

    @Override
    @Transactional
    public Order deliveredOrder(Long orderId) throws OrderException {
        System.out.println("📬 Delivering order: " + orderId);
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.DELIVERED);
        Order saved = orderRepository.save(order);
        System.out.println("✅ Order delivered successfully");
        return saved;
    }

    @Override
    @Transactional
    public Order cancelledOrder(Long orderId) throws OrderException {
        System.out.println("❌ Cancelling order: " + orderId);
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        System.out.println("✅ Order cancelled successfully");
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        System.out.println("📋 Fetching all orders");
        List<Order> orders = orderRepository.findAll();
        System.out.println("✅ Found " + orders.size() + " total orders");
        return orders;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> userOrderHistory(Long userId) {
        return usersOrderHistory(userId);
    }

    @Override
    @Transactional
    public Order createOrder(User user, Address shippingAddress) throws UserException {
        System.out.println("📦 ========== ORDER CREATION STARTED ==========");
        System.out.println("👤 User ID: " + user.getId() + " | Email: " + user.getEmail());
        System.out.println("📍 Shipping Address: " + shippingAddress.getFirstName() + " " +
                shippingAddress.getLastName() + ", " + shippingAddress.getCity());

        // ====== STEP 1: Save Shipping Address ======
        shippingAddress.setUser(user);
        Address savedAddress = addressRepository.save(shippingAddress);
        entityManager.flush();
        System.out.println("✅ Address saved with ID: " + savedAddress.getId());

        // ====== STEP 2: Add address to user's address list ======
        if (!user.getAddress().contains(savedAddress)) {
            user.getAddress().add(savedAddress);
            userRepository.save(user);
            entityManager.flush();
            System.out.println("✅ Address linked to user");
        }

        // ====== STEP 3: Get user's cart ======
        Cart cart = cartService.findUserCart(user.getId());

        if (cart == null) {
            throw new UserException("Cart not found for user: " + user.getId());
        }

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new UserException("Cart is empty. Cannot create order.");
        }

        System.out.println("🛒 Cart ID: " + cart.getId() + " | Items: " + cart.getCartItems().size());

        // ====== STEP 4: Create Order Items from Cart Items ======
        List<OrderItem> orderItems = new ArrayList<>();

        // Create a copy of cart items to avoid concurrent modification
        List<CartItem> cartItemsCopy = new ArrayList<>(cart.getCartItems());

        for (CartItem cartItem : cartItemsCopy) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setDiscountedPrice(cartItem.getDiscountedPrice());

            orderItems.add(orderItem);

            System.out.println("  📦 OrderItem prepared: " + cartItem.getProduct().getTitle() +
                    " | Qty: " + cartItem.getQuantity() +
                    " | Size: " + cartItem.getSize() +
                    " | Price: ₹" + cartItem.getDiscountedPrice());
        }

        System.out.println("✅ Created " + orderItems.size() + " order items from cart");

        // ====== STEP 5: Create and Save Order ======
        Order createdOrder = new Order();
        createdOrder.setUser(user);
        createdOrder.setOrderItems(orderItems);
        createdOrder.setTotalPrice(cart.getTotalPrice());
        createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
        createdOrder.setDiscount(cart.getDiscount());
        createdOrder.setTotalItem(cart.getTotalItem());
        createdOrder.setShippingAddress(savedAddress);
        createdOrder.setOrderDate(LocalDateTime.now());
        createdOrder.setOrderStatus(OrderStatus.PENDING);
        createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        createdOrder.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(createdOrder);
        entityManager.flush();

        System.out.println("✅ Order saved with ID: " + savedOrder.getId());
        System.out.println("💰 Order Total: ₹" + savedOrder.getTotalDiscountedPrice() +
                " (Items: " + savedOrder.getTotalItem() + ")");

        // ====== STEP 6: Save Order Items with Order Reference ======
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            OrderItem savedItem = orderItemRepository.save(item);
            System.out.println("  ✅ OrderItem saved with ID: " + savedItem.getId());
        }

        entityManager.flush();
        System.out.println("✅ All " + orderItems.size() + " order items saved");

        // ====== STEP 7: Clear cart manually (with orphanRemoval removed from Cart entity) ======
        try {
            System.out.println("🗑️ Clearing cart after order creation...");

            final Long cartId = cart.getId();

            // First, manually delete all cart items from the database
            List<CartItem> itemsToDelete = cartItemRepository.findByCartId(cartId);

            System.out.println("🗑️ Found " + itemsToDelete.size() + " cart items to delete");

            if (!itemsToDelete.isEmpty()) {
                // Delete each cart item
                cartItemRepository.deleteAll(itemsToDelete);
                cartItemRepository.flush();

                System.out.println("✅ Deleted " + itemsToDelete.size() + " cart items from database");
            }

            // Clear the EntityManager to remove stale references
            entityManager.clear();

            // Now fetch a fresh cart and update its totals
            Cart freshCart = cartRepository.findById(cartId)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            // Reset totals
            freshCart.setTotalPrice(0);
            freshCart.setTotalDiscountedPrice(0);
            freshCart.setTotalItem(0);
            freshCart.setDiscount(0);

            cartRepository.save(freshCart);

            System.out.println("✅ Cart cleared successfully");

        } catch (Exception e) {
            System.err.println("⚠️ Warning: Failed to clear cart: " + e.getMessage());
            e.printStackTrace();
            // Don't throw exception - order was created successfully
        }

        System.out.println("📦 ========== ORDER CREATION COMPLETED ==========");
        System.out.println("✅ Order ID: " + savedOrder.getId() + " | Status: " + savedOrder.getOrderStatus());

        return savedOrder;
    }
    @Override
    @Transactional
    public Order createPendingOrder(User user, Address shippingAddress) throws UserException {

        shippingAddress.setUser(user);
        Address savedAddress = addressRepository.save(shippingAddress);

        if (!user.getAddress().contains(savedAddress)) {
            user.getAddress().add(savedAddress);
            userRepository.save(user);
        }

        Cart cart = cartService.findUserCart(user.getId());

        List<CartItem> selectedItems = cart.getCartItems()
                .stream()
                .filter(CartItem::isSelected)
                .toList();

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No items selected for checkout.");
        }

        int totalItems = selectedItems.size();
        double totalDiscounted = selectedItems.stream().mapToDouble(CartItem::getDiscountedPrice).sum();
        double totalPrice = selectedItems.stream().mapToDouble(CartItem::getPrice).sum();
        double discount = totalPrice - totalDiscounted;

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : selectedItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setDiscountedPrice(cartItem.getDiscountedPrice());
            orderItems.add(orderItem);
        }

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(savedAddress);
        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setTotalDiscountedPrice(totalDiscounted);
        order.setTotalItem(totalItems);
        order.setDiscount(discount);
        order.setOrderStatus(OrderStatus.PENDING);
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        return savedOrder;
    }

    @Override
    @Transactional
    public Order createOrderFromSelectedCartItems(User user, Address shippingAddress) throws UserException {

        // ✅ Load user cart
        Cart cart = cartService.findUserCart(user.getId());

        // ✅ Get only selected cart items
        List<CartItem> selectedItems = cart.getCartItems()
                .stream()
                .filter(CartItem::isSelected)
                .toList();

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No selected items found in cart.");
        }

        // ✅ Calculate totals
        double totalPrice = selectedItems.stream()
                .mapToDouble(CartItem::getDiscountedPrice)
                .sum();

        // ✅ Create order
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setOrderStatus(OrderStatus.PENDING);
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(totalPrice);
        order.setTotalItem(selectedItems.size());

        Order savedOrder = orderRepository.save(order);

        // ✅ Convert selected cart items → order items
        for (CartItem cartItem : selectedItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setDiscountedPrice(cartItem.getDiscountedPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItemService.saveOrderItem(orderItem);
        }

        return savedOrder;
    }


}