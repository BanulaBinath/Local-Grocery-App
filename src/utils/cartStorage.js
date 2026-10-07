import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "@local_grocery_cart";

/**
 * Load current cart from AsyncStorage
 * Format: { [productId]: quantity }
 */
export const getCart = async () => {
  try {
    const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading cart from storage:", error);
    return {};
  }
};

/**
 * Save cart to AsyncStorage
 */
export const saveCart = async (cart) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

/**
 * Update quantity of a product in the cart
 */
export const updateCartItem = async (productId, delta, maxStock = 999) => {
  try {
    const currentCart = await getCart();
    const currentQty = currentCart[productId] || 0;
    const nextQty = currentQty + delta;

    if (nextQty <= 0) {
      delete currentCart[productId];
    } else {
      currentCart[productId] = Math.min(nextQty, maxStock);
    }

    await saveCart(currentCart);
    return currentCart;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return {};
  }
};

/**
 * Set exact quantity of a product
 */
export const setCartItemQuantity = async (productId, quantity, maxStock = 999) => {
  try {
    const currentCart = await getCart();
    if (quantity <= 0) {
      delete currentCart[productId];
    } else {
      currentCart[productId] = Math.min(quantity, maxStock);
    }
    await saveCart(currentCart);
    return currentCart;
  } catch (error) {
    console.error("Error setting cart item quantity:", error);
    return {};
  }
};

/**
 * Remove an item completely from cart
 */
export const removeCartItem = async (productId) => {
  try {
    const currentCart = await getCart();
    delete currentCart[productId];
    await saveCart(currentCart);
    return currentCart;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return {};
  }
};

/**
 * Clear the entire cart
 */
export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
    return {};
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {};
  }
};
