export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "READY_FOR_PICKUP"
  | "DELIVERED"
  | "CANCELLED";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "CANCELLED",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  READY_FOR_PICKUP: "Ready for Pickup",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export type DeliveryMethod = "HOME_DELIVERY" | "STORE_PICKUP";
export type PaymentMethod = "UPI" | "BANK_TRANSFER";

export interface Category {
  id: string;
  name: string;
  slug: string;
  blurb: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categorySlug: string;
  variantLabel?: string;
  stock: number;
  isFeatured?: boolean;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface OrderItemInput {
  productId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  pincode?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paymentScreenshotUrl?: string;
  items: OrderItemInput[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  variant?: string;
  price: number;
  quantity: number;
  image?: string;
  maxStock: number;
}
