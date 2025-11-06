import { api } from "../../Config/apiConfig"; // ✅ Use shared axios instance
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
} from "./ActionType";

// REGISTER
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { data } = await api.post("/auth/signup", userData);

    // ✅ Save JWT
    localStorage.setItem("jwtToken", data.jwt);

    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// LOGIN
export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await api.post("/auth/signin", credentials);

    // ✅ Save JWT
    localStorage.setItem("jwtToken", data.jwt);

    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// GET USER DETAILS
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  try {
    const { data } = await api.get("/api/users/profile");
    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_USER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// LOGOUT
export const logout = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  dispatch({ type: LOGOUT });
};
