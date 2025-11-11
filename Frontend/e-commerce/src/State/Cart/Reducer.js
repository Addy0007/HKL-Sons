import {
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  ADD_ITEM_TO_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  TOGGLE_CART_ITEM_SELECTION_REQUEST,
  TOGGLE_CART_ITEM_SELECTION_SUCCESS,
  TOGGLE_CART_ITEM_SELECTION_FAILURE,
  CLEAR_CART
} from "./ActionType";

const initialState = {
  cart: null,
  cartItems: [],
  loading: false,
  error: null
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_CART_REQUEST:
    case ADD_ITEM_TO_CART_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
    case TOGGLE_CART_ITEM_SELECTION_REQUEST:
      return { ...state, loading: true };

    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload?.cartItems || action.payload || [],
        error: null
      };

    case ADD_ITEM_TO_CART_SUCCESS:
    case REMOVE_CART_ITEM_SUCCESS:
    case UPDATE_CART_ITEM_SUCCESS:
    case TOGGLE_CART_ITEM_SELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cart: action.payload || state.cart,
        cartItems: action.payload?.cartItems || state.cartItems
      };

    case GET_CART_FAILURE:
    case ADD_ITEM_TO_CART_FAILURE:
    case REMOVE_CART_ITEM_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
    case TOGGLE_CART_ITEM_SELECTION_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_CART:
      console.log("🗑️ CART CLEARED");
      return { ...state, cartItems: [], loading: false };

    default:
      return state;
  }
};