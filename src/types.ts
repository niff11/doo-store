export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  category: 'nitro' | 'boosts' | 'effects' | 'users_premium' | 'creations_custom' | 'old_accounts';
  image: string;
  benefits: string[];
  benefitsAr: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  priceOnRequest?: boolean;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  likes: number;
  productName?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string; // e.g. "3 months", "1 month"
  serverLink?: string;
  supporterName?: string;
  customImage?: string;
}

export interface OrderAlert {
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  discordUsername: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'credit_card' | 'stc_pay' | 'apple_pay' | 'bank_transfer';
  paymentDetails: {
    cardNumber?: string;
    stcNumber?: string;
    receiptUrl?: string;
    referenceNumber?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  timestamp?: string; // Automatic exact date and time
  trackingCode?: string;
  alerts?: OrderAlert[]; // Automated alerts for status updates
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'support' | 'system';
  text: string;
  timestamp: string;
}
