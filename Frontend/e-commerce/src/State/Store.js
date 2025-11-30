import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { customerProductsReducer } from "./Product/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { orderReducer } from "./Order/Reducer";
import { checkoutReducer } from "./Checkout/Reducer";
import { adminProductReducer } from "./Admin/Reducer"; // ✅ ADD THIS

const rootReducers = combineReducers({
  auth: authReducer,
  product: customerProductsReducer,
  cart: cartReducer,
  order: orderReducer,
  checkout: checkoutReducer,
  adminProduct: adminProductReducer, // ✅ ADD THIS
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));