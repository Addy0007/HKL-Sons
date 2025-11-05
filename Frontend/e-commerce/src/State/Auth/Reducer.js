import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
  } from "./ActionType";
  
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    jwt: null,
  };
  
  export const authReducer = (state = initialState, action) => {
    switch (action.type) {
      // ================= REQUESTS =================
      case REGISTER_REQUEST:
      case LOGIN_REQUEST:
      case GET_USER_REQUEST:
        return {
          ...state,
          isLoading: true,
          error: null,
        };
  
      // ================= SUCCESS =================
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoading: false,
          error: null,
          jwt: action.payload.jwt || null,
          user: action.payload.user || null,
        };
  
      case GET_USER_SUCCESS:
        return {
          ...state,
          isLoading: false,
          error: null,
          user: action.payload,
        };
  
      // ================= FAILURES =================
      case REGISTER_FAILURE:
      case LOGIN_FAILURE:
      case GET_USER_FAILURE:
        return {
          ...state,
          isLoading: false,
          error: action.payload,
        };
  
      // ================= LOGOUT =================
      case LOGOUT:
        localStorage.removeItem("jwt");
        return {
          ...initialState,
        };
  
      // ================= DEFAULT =================
      default:
        return state;
    }
  };
  