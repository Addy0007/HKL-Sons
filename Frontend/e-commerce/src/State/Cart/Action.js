import { api } from "../../Config/apiConfig";
import {
  ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, ADD_ITEM_TO_CART_FAILURE,
  GET_CART_REQUEST, GET_CART_SUCCESS, GET_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE
} from "./ActionType";

export const getCart = () => async (dispatch) => {
  dispatch({ type: GET_CART_REQUEST });
  try {
    const { data } = await api.get("/api/cart");
    dispatch({ type: GET_CART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CART_FAILURE, payload: error.message });
  }
};

export const addItemToCart = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
  try {
    await api.put("/api/cart/add", reqData);

    // ✅ Always refresh the cart after successful update
    dispatch(getCart());

    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS });
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
  }
};

export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  try {
    await api.delete(`/api/cart-items/${cartItemId}`);

    // ✅ Refresh cart
    dispatch(getCart());

    dispatch({ type: REMOVE_CART_ITEM_SUCCESS });
  } catch (error) {
    dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
  }
};

export const updateCartItem = (cartItemId, quantity) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    await api.put(`/api/cart-items/${cartItemId}`, { quantity });

    // ✅ Refresh cart
    dispatch(getCart());

    dispatch({ type: UPDATE_CART_ITEM_SUCCESS });
  } catch (error) {
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
  }
};
