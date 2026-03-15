import {
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  SET_SELECTED_PRODUCT,
  CLEAR_SELECTED_PRODUCT,
} from "./ActionType";

const initialState = {
  loading: false,
  error: null,
  product: null,
  selectedProduct: null,   // ← product to edit
  deletedProductId: null,
};

export const adminProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_PRODUCT_SUCCESS:
    case UPDATE_PRODUCT_SUCCESS:
      return { ...state, loading: false, product: action.payload, error: null };

    case DELETE_PRODUCT_SUCCESS:
      return { ...state, loading: false, deletedProductId: action.payload.productId, error: null };

    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case DELETE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── Select product for editing ──────────────────────────────────────────
    case SET_SELECTED_PRODUCT:
      return { ...state, selectedProduct: action.payload };

    case CLEAR_SELECTED_PRODUCT:
      return { ...state, selectedProduct: null };

    default:
      return state;
  }
};