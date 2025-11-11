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
    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: REGISTER_SUCCESS, payload: data });
    dispatch(getUser()); // ✅ fetch user profile now
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

// ✅ LOGIN
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await api.post("/auth/signin", credentials);
    localStorage.setItem("jwt", data.jwt);
    dispatch({ type: LOGIN_SUCCESS, payload: data });
    dispatch(getUser()); // ✅ fetch user
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
  }
};

// ✅ GET USER
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const { data } = await api.get("/api/users/profile"); // token auto-set
    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_FAILURE, payload: error.response?.data?.message || error.message });
    localStorage.removeItem("jwt"); // token invalid? remove
  }
};

// ✅ LOGOUT
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("jwt");

    dispatch({ type: LOGOUT_SUCCESS });

    dispatch({ type: CLEAR_CART }); // ✅ Clear cart
    dispatch({ type: CLEAR_CHECKOUT_ADDRESS }); // ✅ Clear saved checkout address

  } catch (error) {
    dispatch({ type: LOGOUT_FAILURE, payload: error.message });
  }
};
