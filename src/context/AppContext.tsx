import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, User, Receipt } from '../data/MockData';
import { mockUsers } from '../data/MockData';

interface AppContextType {
  cart: CartItem[];
  user: User | null;
  receipts: Receipt[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  simulateMemberApproach: () => void;
  addReceipt: (receipt: Receipt) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if same product with same size already exists
      const existing = prev.find(
        (i) => i.product.id === item.product.id && i.selectedSize === item.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === item.product.id && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => {
      if (size) {
        return prev.filter(
          (item) => !(item.product.id === productId && item.selectedSize === size)
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (size) {
          return item.product.id === productId && item.selectedSize === size
            ? { ...item, quantity }
            : item;
        }
        return item.product.id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const simulateMemberApproach = () => {
    // Simulate recognizing a member (Quang - Gold Member)
    const member = mockUsers.find((u) => u.membershipLevel === 'gold');
    if (member) {
      setUser(member);
    }
  };

  const addReceipt = (receipt: Receipt) => {
    setReceipts((prev) => [...prev, receipt]);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        user,
        receipts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setUser,
        simulateMemberApproach,
        addReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

