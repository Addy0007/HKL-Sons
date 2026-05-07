package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.DTO.AddressDTO;
import com.HKL.Ecomm_App.Exception.CouponException;
import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.*;
import com.HKL.Ecomm_App.Repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private CouponService couponService;

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
    // 🔑 HELPERS
    // ====================================================

    private String generateOrderId(User user) {
        return "ORD-" + user.getId() + "-" + System.currentTimeMillis();
    }

    /**
     * Always creates a FRESH Address entity from the DTO.
     * Never reuses an existing id — this is a point-in-time shipping snapshot.
     * The user link is set so the row is associated, but the old saved-address
     * row is never touched or merged.
     */
    private Address buildFreshAddress(AddressDTO dto, User user) {
        Address address = new Address();
        // ✅ No id set — JPA will INSERT, never UPDATE an existing row
        address.setFirstName(dto.getFirstName());
        address.setLastName(dto.getLastName());
        address.setStreetAddress(dto.getStreetAddress());
        address.setCity(dto.getCity());
        address.setDistrict(dto.getDistrict());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());
        address.setMobile(dto.getMobile());
        address.setUser(user);
        address.setActive(true);
        return address;
    }

    // ====================================================
    // 🔍 LOOKUPS / STATUS CHANGES
    // ====================================================

    @Override
    @Transactional(readOnly = true)
    public Order findOrderById(Long orderId) throws OrderException {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderException("Order not found with id: " + orderId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> usersOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
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

    // =====================================================================================
    // 🟦 CREATE ORDER (full cart checkout)
    // =====================================================================================

    @Override
    @Transactional
    public Order createOrder(User user, AddressDTO addressDTO) throws UserException {
        return createOrder(user, addressDTO, null);
    }

    @Override
    @Transactional
    public Order createOrder(User user, AddressDTO addressDTO, String couponCode) throws UserException {

        // ✅ Always save a brand-new address row — never merge an old one
        Address shippingAddress = buildFreshAddress(addressDTO, user);
        Address savedAddress = addressRepository.save(shippingAddress);
        entityManager.flush();

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
        createdOrder.setShippingAddress(savedAddress);         // ✅ always set
        createdOrder.setOrderDate(LocalDateTime.now());
        createdOrder.setOrderStatus(OrderStatus.PENDING);
        createdOrder.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        createdOrder.setCreatedAt(LocalDateTime.now());
        createdOrder.setOrderId(generateOrderId(user));

        boolean isFirstOrder = couponService.isFirstTimeUser(user);
        createdOrder.setIsFirstOrder(isFirstOrder);

        double couponDiscount = 0.0;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                CouponService.CouponValidationResult result =
                        couponService.validateAndCalculateDiscount(couponCode, user, cart.getTotalDiscountedPrice());
                if (result.isValid()) {
                    couponDiscount = result.getDiscountAmount();
                    createdOrder.setAppliedCoupon(result.getCoupon());
                    createdOrder.setCouponCode(couponCode.toUpperCase());
                    createdOrder.setCouponDiscount(couponDiscount);
                    double finalPrice = createdOrder.getTotalDiscountedPrice() - couponDiscount;
                    createdOrder.setTotalDiscountedPrice(Math.max(0, finalPrice));
                }
            } catch (CouponException e) {
                System.err.println("Coupon validation failed: " + e.getMessage());
            }
        }

        Order savedOrder = orderRepository.save(createdOrder);
        entityManager.flush();

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        if (savedOrder.getAppliedCoupon() != null) {
            couponService.applyCouponToOrder(savedOrder.getAppliedCoupon(), user, savedOrder, couponDiscount);
        }

        // Clear cart
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
    // 🟩 CREATE PENDING ORDER (selected items — used before Razorpay payment)
    // =====================================================================================

    @Override
    @Transactional
    public Order createPendingOrder(User user, AddressDTO addressDTO) throws UserException {
        return createPendingOrder(user, addressDTO, null);
    }

    @Override
    @Transactional
    public Order createPendingOrder(User user, AddressDTO addressDTO, String couponCode) throws UserException {

        // ✅ Fresh address snapshot — never touches the user's saved address rows
        Address shippingAddress = buildFreshAddress(addressDTO, user);
        Address savedAddress = addressRepository.save(shippingAddress);
        entityManager.flush();

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
        order.setShippingAddress(savedAddress);                // ✅ always set
        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setTotalDiscountedPrice(totalDiscounted);
        order.setTotalItem(totalItems);
        order.setDiscount(discount);
        order.setOrderStatus(OrderStatus.PENDING);
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderId(generateOrderId(user));

        boolean isFirstOrder = couponService.isFirstTimeUser(user);
        order.setIsFirstOrder(isFirstOrder);

        double couponDiscount = 0.0;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                CouponService.CouponValidationResult result =
                        couponService.validateAndCalculateDiscount(couponCode, user, totalDiscounted);
                if (result.isValid()) {
                    couponDiscount = result.getDiscountAmount();
                    order.setAppliedCoupon(result.getCoupon());
                    order.setCouponCode(couponCode.toUpperCase());
                    order.setCouponDiscount(couponDiscount);
                    double finalPrice = order.getTotalDiscountedPrice() - couponDiscount;
                    order.setTotalDiscountedPrice(Math.max(0, finalPrice));
                }
            } catch (CouponException e) {
                System.err.println("Coupon validation failed: " + e.getMessage());
            }
        }

        Order savedOrder = orderRepository.save(order);
        entityManager.flush();

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }

        if (savedOrder.getAppliedCoupon() != null) {
            couponService.applyCouponToOrder(savedOrder.getAppliedCoupon(), user, savedOrder, couponDiscount);
        }

        return savedOrder;
    }

    // =====================================================================================
    // 🟧 CREATE ORDER FROM SELECTED CART ITEMS (legacy / alternate flow)
    // =====================================================================================

    @Override
    @Transactional
    public Order createOrderFromSelectedCartItems(User user, AddressDTO addressDTO) throws UserException {
        return createOrderFromSelectedCartItems(user, addressDTO, null);
    }

    @Override
    @Transactional
    public Order createOrderFromSelectedCartItems(User user, AddressDTO addressDTO, String couponCode) throws UserException {

        Cart cart = cartService.findUserCart(user.getId());

        List<CartItem> selectedItems = cart.getCartItems()
                .stream()
                .filter(CartItem::isSelected)
                .toList();

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("No selected items found in cart.");
        }

        double totalPrice = selectedItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        double totalDiscountedPrice = selectedItems.stream()
                .mapToDouble(item -> item.getDiscountedPrice() * item.getQuantity())
                .sum();

        // ✅ Fresh address snapshot
        Address shippingAddress = buildFreshAddress(addressDTO, user);
        Address savedAddress = addressRepository.save(shippingAddress);

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(savedAddress);                // ✅ always set
        order.setOrderStatus(OrderStatus.PENDING);
        order.getPaymentDetails().setStatus(PaymentStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(totalPrice);
        order.setTotalDiscountedPrice(totalDiscountedPrice);
        order.setDiscount(totalPrice - totalDiscountedPrice);
        order.setTotalItem(selectedItems.size());
        order.setOrderId(generateOrderId(user));

        boolean isFirstOrder = couponService.isFirstTimeUser(user);
        order.setIsFirstOrder(isFirstOrder);

        double couponDiscount = 0.0;
        if (couponCode != null && !couponCode.trim().isEmpty()) {
            try {
                CouponService.CouponValidationResult result =
                        couponService.validateAndCalculateDiscount(couponCode, user, totalDiscountedPrice);
                if (result.isValid()) {
                    couponDiscount = result.getDiscountAmount();
                    order.setAppliedCoupon(result.getCoupon());
                    order.setCouponCode(couponCode.toUpperCase());
                    order.setCouponDiscount(couponDiscount);
                    double finalPrice = order.getTotalDiscountedPrice() - couponDiscount;
                    order.setTotalDiscountedPrice(Math.max(0, finalPrice));
                }
            } catch (CouponException e) {
                System.err.println("Coupon validation failed: " + e.getMessage());
            }
        }

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

        if (savedOrder.getAppliedCoupon() != null) {
            couponService.applyCouponToOrder(savedOrder.getAppliedCoupon(), user, savedOrder, couponDiscount);
        }

        return savedOrder;
    }
}