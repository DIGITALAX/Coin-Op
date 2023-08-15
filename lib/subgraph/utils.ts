const CART_ITEM_STORAGE = "cartItemsCoinOp";
const FULFILLMENT_STORAGE = "fulfillmentDetailsCoinOp";
const LIT_LOGIN_STORAGE = "litLoginCoinOp";

export const setCartItemsLocalStorage = (cartItems: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ITEM_STORAGE, cartItems);
    return;
  }
};

export const setFulfillmentDetailsLocalStorage = (
  fulfillmentDetails: string
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FULFILLMENT_STORAGE, fulfillmentDetails);
    return;
  }
};

export const setLitLoginLocalStorage = (litLoginDetails: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LIT_LOGIN_STORAGE, litLoginDetails);
    return;
  }
};

export const getCartItemsLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CART_ITEM_STORAGE);

    if (!data) return null;

    return JSON.parse(data);
  }
};

export const getLitLoginLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(LIT_LOGIN_STORAGE);

    if (!data) return null;

    return JSON.parse(data);
  }
};

export const getFulfillmentDetailsLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(FULFILLMENT_STORAGE);

    if (!data) return null;

    return JSON.parse(data);
  }
};

export const removeCartItemsLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_ITEM_STORAGE);
  }
};

export const removeFulfillmentDetailsLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(FULFILLMENT_STORAGE);
  }
};

export const removeLitLoginLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LIT_LOGIN_STORAGE);
  }
};
