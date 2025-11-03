package com.HKL.Ecomm_App.Service;

import com.HKL.Ecomm_App.Exception.OrderException;
import com.HKL.Ecomm_App.Model.Address;
import com.HKL.Ecomm_App.Model.User;
import com.HKL.Ecomm_App.Model.Order;
import java.util.List;

public interface OrderService {

    Order createOrder(User user, Address shippingAddress);
    Order findOrderById(Long orderId) throws OrderException;
    List<Order> usersOrderHistory(Long userId);
    Order placedOrder(Long orderId) throws OrderException;
    Order confirmOrder(Long orderId) throws OrderException;
    Order shippedOrder(Long orderId) throws OrderException;
    Order deliveredOrder(Long orderId) throws OrderException;
    Order cancelledOrder(Long orderId) throws OrderException;

    List<Order> getAllOrders();

    List<Order> userOrderHistory(Long id);
}
