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
  email: string;
  phone: string;
  password: string;
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

// Body part types for virtual try-on
export type BodyPart = 'head' | 'top' | 'bottom' | 'feet' | 'accessory';

// Mock Products
export const mockProducts: Product[] = [
  // HEAD - Hats & Caps
  {
    id: 'head-1',
    name: 'Classic Baseball Cap',
    price: 24.99,
    category: 'unisex',
    size: ['S', 'M', 'L'],
    image: '🧢',
    description: 'Casual cotton baseball cap',
    inStock: true,
    season: 'All Season',
    brand: 'Fashion Store',
    clothingType: 'Hat',
  },
  {
    id: 'head-2',
    name: 'Elegant Sun Hat',
    price: 34.99,
    category: 'women',
    size: ['One Size'],
    image: '👒',
    description: 'Wide brim summer hat',
    inStock: true,
    season: 'Summer',
    brand: 'Designer',
    clothingType: 'Hat',
  },
  {
    id: 'head-3',
    name: 'Winter Beanie',
    price: 19.99,
    category: 'unisex',
    size: ['One Size'],
    image: '🧶',
    description: 'Warm knitted beanie',
    inStock: true,
    season: 'Winter',
    brand: 'Fashion Store',
    clothingType: 'Hat',
  },
  // TOP - Shirts, T-Shirts, Jackets
  {
    id: 'top-1',
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
    id: 'top-2',
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
    id: 'top-3',
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
    id: 'top-4',
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
    id: 'top-5',
    name: 'Cozy Sweater',
    price: 59.99,
    category: 'unisex',
    size: ['S', 'M', 'L', 'XL'],
    image: '🧣',
    description: 'Warm knitted sweater',
    inStock: true,
    season: 'Winter',
    brand: 'Fashion Store',
    clothingType: 'Sweater',
  },
  // BOTTOM - Pants, Jeans, Shorts
  {
    id: 'bottom-1',
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
    id: 'bottom-2',
    name: 'Casual Shorts',
    price: 29.99,
    category: 'unisex',
    size: ['S', 'M', 'L', 'XL'],
    image: '🩳',
    description: 'Comfortable summer shorts',
    inStock: true,
    season: 'Summer',
    brand: 'Fashion Store',
    clothingType: 'Shorts',
  },
  {
    id: 'bottom-3',
    name: 'Elegant Skirt',
    price: 49.99,
    category: 'women',
    size: ['XS', 'S', 'M', 'L'],
    image: '🩱',
    description: 'Stylish midi skirt',
    inStock: true,
    season: 'All Season',
    brand: 'Designer',
    clothingType: 'Skirt',
  },
  // FEET - Shoes
  {
    id: 'feet-1',
    name: 'Classic Sneakers',
    price: 89.99,
    category: 'unisex',
    size: ['38', '39', '40', '41', '42', '43', '44'],
    image: '👟',
    description: 'Comfortable everyday sneakers',
    inStock: true,
    season: 'All Season',
    brand: 'Fashion Store',
    clothingType: 'Shoes',
  },
  {
    id: 'feet-2',
    name: 'Elegant High Heels',
    price: 129.99,
    category: 'women',
    size: ['36', '37', '38', '39', '40'],
    image: '👠',
    description: 'Stylish high heel shoes',
    inStock: true,
    season: 'All Season',
    brand: 'Designer',
    clothingType: 'Shoes',
  },
  {
    id: 'feet-3',
    name: 'Leather Boots',
    price: 159.99,
    category: 'unisex',
    size: ['38', '39', '40', '41', '42', '43', '44'],
    image: '👢',
    description: 'Classic leather boots',
    inStock: true,
    season: 'Winter',
    brand: 'Premium',
    clothingType: 'Shoes',
  },
  {
    id: 'feet-4',
    name: 'Casual Sandals',
    price: 39.99,
    category: 'unisex',
    size: ['38', '39', '40', '41', '42', '43'],
    image: '🩴',
    description: 'Comfortable summer sandals',
    inStock: true,
    season: 'Summer',
    brand: 'Fashion Store',
    clothingType: 'Shoes',
  },
  // ACCESSORY - Bags, Watches, etc.
  {
    id: 'acc-1',
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
  {
    id: 'acc-2',
    name: 'Classic Watch',
    price: 149.99,
    category: 'unisex',
    size: ['One Size'],
    image: '⌚',
    description: 'Elegant wristwatch',
    inStock: true,
    season: 'All Season',
    brand: 'Premium',
    clothingType: 'Accessory',
  },
  {
    id: 'acc-3',
    name: 'Stylish Sunglasses',
    price: 79.99,
    category: 'unisex',
    size: ['One Size'],
    image: '🕶️',
    description: 'UV protection sunglasses',
    inStock: true,
    season: 'Summer',
    brand: 'Designer',
    clothingType: 'Accessory',
  },
  {
    id: 'acc-4',
    name: 'Leather Belt',
    price: 44.99,
    category: 'unisex',
    size: ['S', 'M', 'L', 'XL'],
    image: '🎀',
    description: 'Premium leather belt',
    inStock: true,
    season: 'All Season',
    brand: 'Classic',
    clothingType: 'Accessory',
  },
  {
    id: 'acc-5',
    name: 'Sport Backpack',
    price: 69.99,
    category: 'unisex',
    size: ['One Size'],
    image: '🎒',
    description: 'Durable sport backpack',
    inStock: true,
    season: 'All Season',
    brand: 'Fashion Store',
    clothingType: 'Accessory',
  },
];

// Get products by body part
export const getProductsByBodyPart = (bodyPart: BodyPart): Product[] => {
  return mockProducts.filter(p => p.id.startsWith(bodyPart));
};

// Default products for each body part
export const defaultBodyPartProducts: Record<BodyPart, string> = {
  head: 'head-1',
  top: 'top-2',
  bottom: 'bottom-1',
  feet: 'feet-1',
  accessory: 'acc-2',
};

// Get default product for a body part
export const getDefaultProductForBodyPart = (bodyPart: BodyPart): Product | undefined => {
  const productId = defaultBodyPartProducts[bodyPart];
  return mockProducts.find(p => p.id === productId);
};

// Mock User Profiles
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Quang',
    email: 'quang@example.com',
    phone: '+84123456789',
    password: 'password123',
    membershipLevel: 'gold',
    faceIdEnrolled: true,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
    phone: '+84987654321',
    password: 'password123',
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

