import { SAVE_CHECKOUT_ADDRESS, CLEAR_CHECKOUT_ADDRESS } from "./ActionType";

// ✅ Load from localStorage on initialization
const loadAddressFromStorage = () => {
  try {
    const savedAddress = localStorage.getItem("checkoutAddress");
    return savedAddress ? JSON.parse(savedAddress) : null;
  } catch (error) {
    console.error("Error loading checkout address:", error);
    return null;
  }
};

const initialState = {
  address: loadAddressFromStorage(), // ✅ Initialize from localStorage
};

export const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CHECKOUT_ADDRESS:
      // ✅ Save to localStorage whenever address is saved
      try {
        localStorage.setItem("checkoutAddress", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving checkout address:", error);
      }
      return { ...state, address: action.payload };
      
    case CLEAR_CHECKOUT_ADDRESS:
      // ✅ Clear from localStorage when clearing
      try {
        localStorage.removeItem("checkoutAddress");
      } catch (error) {
        console.error("Error clearing checkout address:", error);
      }
      return { ...state, address: null };
      
    default:
      return state;
  }
};