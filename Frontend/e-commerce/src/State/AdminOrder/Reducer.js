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

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const adminOrderReducer = (state = initialState, action) => {
  switch (action.type) {

    // ----------------------------
    // GET ALL ORDERS
    // ----------------------------
    case GET_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };

    case GET_ORDERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ----------------------------
    // UPDATE ORDERS (Confirm / Ship / Deliver / Cancel)
    // ----------------------------
    case CONFIRMED_ORDER_REQUEST:
    case SHIP_ORDER_REQUEST:
    case DELIVERED_ORDER_REQUEST:
    case CANCELLED_ORDER_REQUEST:
      return { ...state, loading: true, error: null };

    case CONFIRMED_ORDER_SUCCESS:
    case SHIP_ORDER_SUCCESS:
    case DELIVERED_ORDER_SUCCESS:
    case CANCELLED_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };

    case CONFIRMED_ORDER_FAILURE:
    case SHIP_ORDER_FAILURE:
    case DELIVERED_ORDER_FAILURE:
    case CANCELLED_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ----------------------------
    // DELETE ORDER
    // ----------------------------
    case DELETE_ORDER_REQUEST:
      return { ...state, loading: true };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    case DELETE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
