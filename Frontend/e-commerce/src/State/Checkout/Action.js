import { SAVE_CHECKOUT_ADDRESS, CLEAR_CHECKOUT_ADDRESS } from "./ActionType";

export const saveCheckoutAddress = (address) => ({
  type: SAVE_CHECKOUT_ADDRESS,
  payload: address,
});

export const clearCheckoutAddress = () => ({
  type: CLEAR_CHECKOUT_ADDRESS,
});
