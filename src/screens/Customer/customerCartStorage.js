import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "customerCartItems";

export const getCartItems = async () => {
  const raw = await AsyncStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const saveCartItems = async (items) => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addProductToCart = async (product) => {
  const items = await getCartItems();
  const existing = items.find((item) => item.product._id === product._id);

  if (!existing) {
    items.push({ product, quantity: 1 });
    await saveCartItems(items);
  }

  return items;
};

export const clearCartItems = async () => {
  await AsyncStorage.removeItem(CART_KEY);
};

export const getProductImageUrl = (product, apiUrl) => {
  if (!product) return null;
  const image = product.image;
  if (image && !String(image).startsWith("file://")) {
    if (String(image).startsWith("http://") || String(image).startsWith("https://")) {
      return image;
    }
    return `${apiUrl}${String(image).startsWith("/") ? image : `/${image}`}`;
  }
  return null;
};
