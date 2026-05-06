import { api } from "../../Config/apiConfig";
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

// ---------- GUEST CART HELPERS ----------
const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem("guestCart")) || [];
  } catch {
    return [];
  }
};

const saveGuestCart = (cartItems) => {
  localStorage.setItem("guestCart", JSON.stringify(cartItems));
};

// ---------- GET CART ----------
export const getCart = () => async (dispatch, getState) => {
  dispatch({ type: GET_CART_REQUEST });

  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    const guestCart = loadGuestCart();
    dispatch({ type: GET_CART_SUCCESS, payload: { cartItems: guestCart } });
    return;
  }

  try {
    const { data } = await api.get("/api/cart");
    dispatch({ type: GET_CART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CART_FAILURE, payload: error.message });
  }
};

// ---------- ADD ----------
export const addItemToCart = (reqData) => async (dispatch, getState) => {
  dispatch({ type: ADD_ITEM_TO_CART_REQUEST });

  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    return dispatch({
      type: ADD_ITEM_TO_CART_FAILURE,
      payload: { message: "AUTH_REQUIRED" }
    });
  }

  try {
    await api.put("/api/cart/add", reqData);
    dispatch(getCart());
    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS });
  } catch (error) {
    dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
  }
};

// ---------- REMOVE ----------
export const removeCartItem = (cartItemId) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });

  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    const guestCart = loadGuestCart().filter((i) => i.id !== cartItemId);
    saveGuestCart(guestCart);
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: { cartItems: guestCart } });
    dispatch(getCart());
    return;
  }

  try {
    const { data } = await api.delete(`/api/cart-items/${cartItemId}`);
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: data });
    dispatch(getCart());
  } catch (error) {
    dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
  }
};

// ---------- UPDATE ----------
export const updateCartItem = (cartItemId, quantity) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });

  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    let guestCart = loadGuestCart();
    const item = guestCart.find((i) => i.id === cartItemId);
    if (item) item.quantity = quantity;
    saveGuestCart(guestCart);

    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: { cartItems: guestCart } });
    dispatch(getCart());
    return;
  }

  try {
    const { data } = await api.put(`/api/cart-items/${cartItemId}`, { quantity });
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
    dispatch(getCart());
  } catch (error) {
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
  }
};

// ---------- TOGGLE SELECTION ----------
export const toggleCartItemSelection = (cartItemId) => async (dispatch, getState) => {
  dispatch({ type: TOGGLE_CART_ITEM_SELECTION_REQUEST });

  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    let guestCart = loadGuestCart();
    const item = guestCart.find((i) => i.id === cartItemId);
    if (item) {
      item.selected = item.selected === false ? true : false;
    }
    saveGuestCart(guestCart);
    dispatch({ type: TOGGLE_CART_ITEM_SELECTION_SUCCESS, payload: { cartItems: guestCart } });
    return;
  }

  try {
    const { data } = await api.patch(`/api/cart-items/${cartItemId}/toggle-selection`);
    console.log("Toggle response:", data);
    dispatch({ type: TOGGLE_CART_ITEM_SELECTION_SUCCESS });
    await dispatch(getCart());
  } catch (error) {
    console.error("Toggle selection error:", error);
    dispatch({ type: TOGGLE_CART_ITEM_SELECTION_FAILURE, payload: error.message });
  }
};

// ---------- CLEAR CART (after successful order) ----------
/**
 * Clears all cart items after a successful payment.
 *
 * For authenticated users:
 *   - The backend already calls cartService.clearSelectedItems() on payment success,
 *     so we just dispatch CLEAR_CART to wipe Redux state immediately without
 *     making redundant API calls.
 *   - Then we re-fetch the cart to confirm the server state.
 *
 * For guests:
 *   - Wipes localStorage guest cart.
 */
export const clearCart = () => async (dispatch, getState) => {
  const { isAuthenticated } = getState().auth;

  if (!isAuthenticated) {
    localStorage.removeItem("guestCart");
    dispatch({ type: CLEAR_CART });
    return;
  }

  // Wipe Redux state immediately so the cart UI clears right away
  dispatch({ type: CLEAR_CART });

  // Re-fetch from backend to confirm server-side cart is empty
  // (backend clears it via cartService.clearSelectedItems on payment success)
  try {
    await dispatch(getCart());
  } catch (error) {
    console.error("clearCart: failed to re-sync cart from server:", error);
  }
};

// ---------- CLEAR LOCAL ONLY (guest logout etc.) ----------
export const clearCartLocal = () => (dispatch) => {
  localStorage.removeItem("guestCart");
  dispatch({ type: CLEAR_CART });
};