import { api } from "../../Config/apiConfig";
import { clearCheckoutAddress } from "../Checkout/Action";
import { GET_CART_REQUEST } from "../Cart/ActionType"; // Import if you want to refresh cart
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
} from "./ActionType";

// Create Order
export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    console.log("📦 Sending order request...");
    console.log("📍 Address data:", reqData.address);
    
    // ✅ Send only the address in the request body
    const { data } = await api.post(`/api/orders`, {
      address: reqData.address
    });

    console.log("✅ Order Created:", data);

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

    if (data?.id) {
      // ✅ Clear checkout address after successful order
      dispatch(clearCheckoutAddress());
      
      // ✅ Navigate to order details page (this route exists in your CustomerRoutes)
      reqData.navigate(`/account/order/${data.id}`);
      
      // Optional: Refresh cart to get updated state from backend
      // dispatch({ type: GET_CART_REQUEST });
    }

  } catch (error) {
    console.error("❌ Order Error:", error);
    console.error("❌ Error response:", error.response?.data);
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    
    // ✅ Show error to user
    alert("Failed to create order. Please try again.");
  }
};

// Get Order by ID
export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });

  try {
    const { data } = await api.get(`/api/orders/${orderId}`);
    console.log("Order fetched:", data);
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    console.log("Get order error:", error);
    dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: error.message });
  }
};