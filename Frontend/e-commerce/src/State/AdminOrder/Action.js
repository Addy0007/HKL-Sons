import {
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,

  CONFIRMED_ORDER_REQUEST,
  CONFIRMED_ORDER_SUCCESS,
  CONFIRMED_ORDER_FAILURE,

  CANCELLED_ORDER_REQUEST,
  CANCELLED_ORDER_SUCCESS,
  CANCELLED_ORDER_FAILURE,

  DELIVERED_ORDER_REQUEST,
  DELIVERED_ORDER_SUCCESS,
  DELIVERED_ORDER_FAILURE,

  SHIP_ORDER_REQUEST,
  SHIP_ORDER_SUCCESS,
  SHIP_ORDER_FAILURE,

  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
} from "./ActionType";

import { api } from "../../Config/apiConfig";

// ---------------------------------------
// GET ALL ORDERS
// ---------------------------------------
export const getAllOrders = () => async (dispatch) => {
  dispatch({ type: GET_ORDERS_REQUEST });
  try {
    const { data } = await api.get("/api/admin/orders");
    dispatch({ type: GET_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ORDERS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ---------------------------------------
// CONFIRM ORDER
// ---------------------------------------
export const confirmOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CONFIRMED_ORDER_REQUEST });
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/confirmed`);
    dispatch({ type: CONFIRMED_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CONFIRMED_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ---------------------------------------
// SHIP ORDER
// ---------------------------------------
export const shipOrder = (orderId) => async (dispatch) => {
  dispatch({ type: SHIP_ORDER_REQUEST });
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/shipped`);
    dispatch({ type: SHIP_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SHIP_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ---------------------------------------
// DELIVERED ORDER
// ---------------------------------------
export const deliverOrder = (orderId) => async (dispatch) => {
  dispatch({ type: DELIVERED_ORDER_REQUEST });
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/delivered`);
    dispatch({ type: DELIVERED_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DELIVERED_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ---------------------------------------
// CANCEL ORDER
// ---------------------------------------
export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CANCELLED_ORDER_REQUEST });
  try {
    const { data } = await api.put(`/api/admin/orders/${orderId}/cancelled`);
    dispatch({ type: CANCELLED_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CANCELLED_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ---------------------------------------
// DELETE ORDER (If needed in future)
// ---------------------------------------
export const deleteOrder = (orderId) => async (dispatch) => {
  dispatch({ type: DELETE_ORDER_REQUEST });
  try {
    await api.delete(`/api/admin/orders/${orderId}`);
    dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
