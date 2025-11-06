import {
  FIND_PRODUCTS_REQUEST,
  FIND_PRODUCTS_SUCCESS,
  FIND_PRODUCTS_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
} from "./ActionType";

const initialState = {
  products: {
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  },
  product: null,
  loading: false,
  error: null,
};

export const customerProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FIND_PRODUCTS_REQUEST:
    case FIND_PRODUCT_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };

    case FIND_PRODUCTS_SUCCESS:
      // ✅ Handle nested page object from backend
      { const responseData = action.payload;
      
      return {
        ...state,
        loading: false,
        products: {
          content: responseData.content || [],
          totalPages: responseData.page?.totalPages || responseData.totalPages || 0,
          totalElements: responseData.page?.totalElements || responseData.totalElements || 0,
          number: responseData.page?.number ?? responseData.number ?? 0,
        },
      }; }

    case FIND_PRODUCT_BY_ID_SUCCESS:
      return { ...state, loading: false, product: action.payload };

    case FIND_PRODUCTS_FAILURE:
    case FIND_PRODUCT_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};