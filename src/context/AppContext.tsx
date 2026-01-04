import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, User, Receipt } from '../data/MockData';

interface AppContextType {
  cart: CartItem[];
  user: User | null;
  receipts: Receipt[];
  users: User[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  signIn: (phone: string, password: string) => User | null;
  signInWithFaceId: () => User | null;
  registerUser: (user: User) => void;
  addReceipt: (receipt: Receipt) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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

  const signIn = (phone: string, password: string): User | null => {
    const foundUser = users.find((u) => u.phone === phone && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  const signInWithFaceId = (): User | null => {
    // Find a user with faceIdEnrolled (simulating face recognition)
    const foundUser = users.find((u) => u.faceIdEnrolled === true);
    if (foundUser) {
      setUser(foundUser);
      return foundUser;
    }
    return null;
  };

  const registerUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
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
        users,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setUser,
        signIn,
        signInWithFaceId,
        registerUser,
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

