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
    isLoading: !!jwt, // load profile if jwt exists
    error: null,
  };
};


const initialState = getInitialState();

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
      // ✅ Store JWT in localStorage
      if (action.payload.jwt) {
        localStorage.setItem("jwt", action.payload.jwt);
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        jwt: action.payload.jwt || state.jwt,
        user: action.payload.user || state.user,
        isAuthenticated: true,
      };

    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: action.payload,
        isAuthenticated: true,
      };

    // ================= FAILURES =================
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      // ✅ Clear JWT from localStorage on auth failure
      localStorage.removeItem("jwt");
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
        jwt: null,
        user: null,
      };

    // ================= LOGOUT =================
    case LOGOUT_SUCCESS:
      // ✅ Clear JWT from localStorage
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

    // ================= DEFAULT =================
    default:
      return state;
  }
};