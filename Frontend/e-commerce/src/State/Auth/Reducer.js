import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
} from "./ActionType";

const getInitialState = () => {
  const jwt = localStorage.getItem("jwt");
  return {
    user: null,
    jwt: jwt || null,
    isAuthenticated: !!jwt,
    isLoading: !!jwt, // Will load user if jwt exists
    error: null,
  };
};

const initialState = getInitialState();

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log("✅ Auth Success - Storing in Redux:", action.payload);
      
      if (action.payload.jwt) {
        localStorage.setItem("jwt", action.payload.jwt);
      }
      
      return {
        ...state,
        isLoading: false,
        error: null,
        jwt: action.payload.jwt || state.jwt,
        user: action.payload.user || state.user, // ✅ Store user with role
        isAuthenticated: true,
      };

    case GET_USER_SUCCESS:
      console.log("✅ User Profile Loaded:", action.payload);
      
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload, // ✅ User includes role
        isAuthenticated: true,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      console.error("❌ Auth Failure:", action.payload);
      localStorage.removeItem("jwt");
      
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        jwt: null,
        user: null,
      };

    case LOGOUT_SUCCESS:
      localStorage.removeItem("jwt");
      return {
        user: null,
        isLoading: false,
        error: null,
        jwt: null,
        isAuthenticated: false,
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};