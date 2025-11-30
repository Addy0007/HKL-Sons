import { api } from "../../Config/apiConfig";
import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT_SUCCESS, LOGOUT_FAILURE,
} from "./ActionType";
import { CLEAR_CHECKOUT_ADDRESS } from "../Checkout/ActionType";
import { CLEAR_CART } from "../Cart/ActionType";

// ✅ REGISTER
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { data } = await api.post("/auth/signup", userData);
    
    console.log("📝 Register Response:", data);
    console.log("   JWT:", data.jwt);
    console.log("   User:", data.user);
    console.log("   User Role:", data.user?.role);
    
    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    dispatch(getUser());
  } catch (error) {
    console.error("❌ Register Error:", error.response?.data);
    dispatch({ type: REGISTER_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

// ✅ LOGIN - WITH DETAILED LOGGING
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await api.post("/auth/signin", credentials);
    
    console.log("🔐 Login Response:", data);
    console.log("   JWT:", data.jwt);
    console.log("   User:", data.user);
    console.log("   User Role:", data.user?.role);
    
    if (!data.user) {
      console.error("⚠️ WARNING: Backend did not return user object!");
    }
    
    if (!data.user?.role) {
      console.error("⚠️ WARNING: User object missing role field!");
    }
    
    localStorage.setItem("jwt", data.jwt);
    
    // ✅ Dispatch with full payload
    dispatch({ 
      type: LOGIN_SUCCESS, 
      payload: {
        jwt: data.jwt,
        user: data.user // ✅ This must contain role
      }
    });
    
    // ✅ Also fetch user profile to ensure consistency
    dispatch(getUser());
    
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data);
    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

// ✅ GET USER - WITH DETAILED LOGGING
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const { data } = await api.get("/api/users/profile");
    
    console.log("👤 Get User Response:", data);
    console.log("   User Role:", data.role);
    
    if (!data.role) {
      console.error("⚠️ WARNING: Profile endpoint did not return role!");
    }
    
    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    console.error("❌ Get User Error:", error.response?.data);
    dispatch({ type: GET_USER_FAILURE, payload: error.response?.data?.message || error.message });
    localStorage.removeItem("jwt");
  }
};

// ✅ LOGOUT
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("jwt");
    dispatch({ type: LOGOUT_SUCCESS });
    dispatch({ type: CLEAR_CART });
    dispatch({ type: CLEAR_CHECKOUT_ADDRESS });
  } catch (error) {
    dispatch({ type: LOGOUT_FAILURE, payload: error.message });
  }
};