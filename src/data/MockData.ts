export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women' | 'unisex';
  size: string[];
  image: string;
  description: string;
  inStock: boolean;
  isOnSale?: boolean;
  originalPrice?: number;
  discountPercentage?: number;
  season?: string;
  brand?: string;
  clothingType?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  membershipLevel: 'guest' | 'silver' | 'gold' | 'platinum';
  faceIdEnrolled: boolean;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod: string;
}

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    price: 39.99,
    originalPrice: 49.99,
    category: 'men',
    size: ['S', 'M', 'L', 'XL'],
    image: '👔',
    description: 'Premium cotton dress shirt',
    inStock: true,
    isOnSale: true,
    discountPercentage: 20,
    season: 'All Season',
    brand: 'Classic',
    clothingType: 'Shirt',
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 79.99,
    category: 'men',
    size: ['28', '30', '32', '34', '36'],
    image: '👖',
    description: 'Classic blue denim jeans',
    inStock: true,
    season: 'All Season',
    brand: 'Fashion Store',
    clothingType: 'Pants',
  },
  {
    id: '3',
    name: 'Elegant Black Dress',
    price: 97.49,
    originalPrice: 129.99,
    category: 'women',
    size: ['XS', 'S', 'M', 'L'],
    image: '👗',
    description: 'Sophisticated evening dress',
    inStock: true,
    isOnSale: true,
    discountPercentage: 25,
    season: 'Fall',
    brand: 'Designer',
    clothingType: 'Dress',
  },
  {
    id: '4',
    name: 'Wool Blazer',
    price: 199.99,
    category: 'unisex',
    size: ['S', 'M', 'L', 'XL'],
    image: '🧥',
    description: 'Professional wool blazer',
    inStock: true,
    season: 'Winter',
    brand: 'Premium',
    clothingType: 'Jacket',
  },
  {
    id: '5',
    name: 'Cotton T-Shirt',
    price: 19.99,
    originalPrice: 24.99,
    category: 'unisex',
    size: ['S', 'M', 'L', 'XL'],
    image: '👕',
    description: 'Comfortable everyday t-shirt',
    inStock: true,
    isOnSale: true,
    discountPercentage: 20,
    season: 'Summer',
    brand: 'Fashion Store',
    clothingType: 'T-Shirt',
  },
  {
    id: '6',
    name: 'Designer Handbag',
    price: 239.99,
    originalPrice: 299.99,
    category: 'women',
    size: ['One Size'],
    image: '👜',
    description: 'Luxury leather handbag',
    inStock: true,
    isOnSale: true,
    discountPercentage: 20,
    season: 'All Season',
    brand: 'Designer',
    clothingType: 'Accessory',
  },
];

// Mock User Profiles
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Quang',
    phone: '+84123456789',
    membershipLevel: 'gold',
    faceIdEnrolled: true,
  },
  {
    id: '2',
    name: 'Sarah',
    phone: '+84987654321',
    membershipLevel: 'silver',
    faceIdEnrolled: true,
  },
];

// Helper function to get random product
export const getRandomProduct = (): Product => {
  return mockProducts[Math.floor(Math.random() * mockProducts.length)];
};

// Helper function to get product recommendations based on membership
export const getRecommendations = (membershipLevel: string): Product[] => {
  if (membershipLevel === 'gold' || membershipLevel === 'platinum') {
    return mockProducts.filter(p => p.price > 100).slice(0, 3);
  }
  return mockProducts.slice(0, 3);
};

