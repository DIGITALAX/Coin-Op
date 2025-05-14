const CART_ITEM_STORAGE = "cartItemsCoinOp";

export const removeCartItemsLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_ITEM_STORAGE);
  }
};

export const getCartItemsLocalStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CART_ITEM_STORAGE);

    if (!data) return null;

    return JSON.parse(data);
  }
};

export const setCartItemsLocalStorage = (cartItems: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ITEM_STORAGE, cartItems);
    return;
  }
};
