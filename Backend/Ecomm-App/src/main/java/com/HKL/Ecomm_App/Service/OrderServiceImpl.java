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

    // ====================================================
    // 🔥 ORDER ID GENERATOR
    // ====================================================
    private String generateOrderId(User user) {
        return "ORD-" + user.getId() + "-" + System.currentTimeMillis();
    }

    @Override
    @Transactional(readOnly = true)
    public Order findOrderById(Long orderId) throws OrderException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found with id: " + orderId));
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
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.PLACED);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order confirmOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order shippedOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.SHIPPED);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order deliveredOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.DELIVERED);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelledOrder(Long orderId) throws OrderException {
        Order order = findOrderById(orderId);
        order.setOrderStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> userOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // =====================================================================================
    // 🟦 CREATE ORDER (Full cart checkout)
    // =====================================================================================
    @Override
    @Transactional
    public Order createOrder(User user, Address shippingAddress) throws UserException {

        shippingAddress.setUser(user);
        Address savedAddress = addressRepository.save(shippingAddress);
        entityManager.flush();

        if (!user.getAddress().contains(savedAddress)) {
            user.getAddress().add(savedAddress);
            userRepository.save(user);
            entityManager.flush();
        }

        Cart cart = cartService.findUserCart(user.getId());

        if (cart == null || cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new UserException("Cart is empty. Cannot create order.");
        }

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : new ArrayList<>(cart.getCartItems())) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setDiscountedPrice(cartItem.getDiscountedPrice());
            orderItems.add(orderItem);
        }

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

        // 🔥 Set ORDER ID here
        createdOrder.setOrderId(generateOrderId(user));

        Order savedOrder = orderRepository.save(createdOrder);
        entityManager.flush();

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        // clear cart
        List<CartItem> deleteItems = cartItemRepository.findByCartId(cart.getId());
        if (!deleteItems.isEmpty()) {
            cartItemRepository.deleteAll(deleteItems);
            cartItemRepository.flush();
        }

        Cart fresh = cartRepository.findById(cart.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        fresh.setTotalPrice(0);
        fresh.setTotalDiscountedPrice(0);
        fresh.setTotalItem(0);
        fresh.setDiscount(0);

        cartRepository.save(fresh);

        return savedOrder;
    }

    // =====================================================================================
    // 🟩 CREATE PENDING ORDER (selected items checkout)
    // =====================================================================================
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

        // 🔥 Set ORDER ID here
        order.setOrderId(generateOrderId(user));

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        return savedOrder;
    }

    // =====================================================================================
    // 🟧 CREATE ORDER (selected items only)
    // =====================================================================================
    @Override
    @Transactional
    public Order createOrderFromSelectedCartItems(User user, Address shippingAddress) throws UserException {

        Cart cart = cartService.findUserCart(user.getId());

        List<CartItem> selectedItems = cart.getCartItems()
                .stream()
                .filter(CartItem::isSelected)
                .toList();

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No selected items found in cart.");
        }

        double totalPrice = selectedItems.stream()
                .mapToDouble(CartItem::getDiscountedPrice)
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(shippingAddress);
        order.setOrderStatus(OrderStatus.PENDING);
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(totalPrice);
        order.setTotalItem(selectedItems.size());

        // 🔥 Set ORDER ID here
        order.setOrderId(generateOrderId(user));

        Order savedOrder = orderRepository.save(order);

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
