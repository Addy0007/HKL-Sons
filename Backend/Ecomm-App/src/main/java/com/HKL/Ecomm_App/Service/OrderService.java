package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Exception.UserException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.Order;
import com.HKL.Ecomm_App.Model.User;

import java.util.List;

public interface OrderService {

    // Create order from full cart (with optional coupon)
    Order createOrder(User user, Address shippingAddress) throws UserException;

    Order createOrder(User user, Address shippingAddress, String couponCode) throws UserException;

    // Create pending order from selected items (with optional coupon)
    Order createPendingOrder(User user, Address shippingAddress) throws UserException;

    Order createPendingOrder(User user, Address shippingAddress, String couponCode) throws UserException;

    // Create order from selected cart items (with optional coupon)
    Order createOrderFromSelectedCartItems(User user, Address shippingAddress) throws UserException;

    Order createOrderFromSelectedCartItems(User user, Address shippingAddress, String couponCode) throws UserException;

    // Find order by ID
    Order findOrderById(Long orderId) throws OrderException;

    // Get user's order history
    List<Order> usersOrderHistory(Long userId);

    List<Order> userOrderHistory(Long userId);

    // Order status updates
    Order placedOrder(Long orderId) throws OrderException;

    Order confirmOrder(Long orderId) throws OrderException;

    Order shippedOrder(Long orderId) throws OrderException;

    Order deliveredOrder(Long orderId) throws OrderException;

    Order cancelledOrder(Long orderId) throws OrderException;

    // Get all orders (admin)
    List<Order> getAllOrders();
}