import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "copperleaf_cart";
const DELIVERY_FEE = 40;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.foodId === food._id);
      if (existing) {
        return prev.map((item) =>
          item.foodId === food._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: food.image,
          isVeg: food.isVeg,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (foodId) => {
    setItems((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const increaseQuantity = (foodId) => {
    setItems((prev) =>
      prev.map((item) => (item.foodId === foodId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (foodId) => {
    setItems((prev) =>
      prev
        .map((item) => (item.foodId === foodId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
