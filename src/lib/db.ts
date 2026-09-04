import fs from "fs";
import path from "path";
import { Order, OrderStatus, Product, Review } from "./types";
import { seedProducts } from "./products-data";

// ---------------------------------------------------------------------------
// Development data store.
//
// This project ships with a tiny JSON-file "database" so the site runs
// immediately with `npm run dev` and no external services. It is intentionally
// isolated behind the functions below so swapping in Prisma + Postgres for
// production is a matter of rewriting these functions — every call site
// elsewhere in the app stays the same. See prisma/schema.prisma for the
// production schema these shapes map onto.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

function ensureFile(file: string, fallback: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
}

function readJson<T>(file: string, fallback: T): T {
  ensureFile(file, fallback);
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  ensureFile(file, data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
// Seeded once from the brand's catalog (src/lib/products-data.ts) into
// data/products.json. From then on this file is the source of truth, so
// admin edits (price, stock, images, active status, new products) persist
// across restarts. Delete data/products.json to reset to the original seed.

export function getAllProducts(): Product[] {
  return readJson<Product[]>(PRODUCTS_FILE, seedProducts);
}

export function getActiveProducts(): Product[] {
  return getAllProducts().filter((p) => p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getActiveProducts().filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return getActiveProducts().filter((p) => p.isFeatured);
}

export function createProduct(input: Omit<Product, "id">): Product {
  const items = getAllProducts();
  const product: Product = { ...input, id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` };
  items.push(product);
  writeJson(PRODUCTS_FILE, items);
  return product;
}

export function updateProduct(id: string, patch: Partial<Omit<Product, "id">>): Product | undefined {
  const items = getAllProducts();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...patch };
  writeJson(PRODUCTS_FILE, items);
  return items[idx];
}

export function deleteProduct(id: string): void {
  const items = getAllProducts();
  writeJson(PRODUCTS_FILE, items.filter((p) => p.id !== id));
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function getAllOrders(): Order[] {
  return readJson<Order[]>(ORDERS_FILE, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getAllOrders().find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase());
}

export function getOrderByNumberAndPhone(orderNumber: string, phone: string): Order | undefined {
  const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
  return getAllOrders().find(
    (o) =>
      o.orderNumber.toLowerCase() === orderNumber.toLowerCase() &&
      o.phone.replace(/\D/g, "").slice(-10) === normalizedPhone
  );
}

export function getOrderById(id: string): Order | undefined {
  return getAllOrders().find((o) => o.id === id);
}

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const existingToday = getAllOrders().filter((o) => o.orderNumber.includes(`${y}${m}${d}`)).length;
  const seq = String(existingToday + 1).padStart(4, "0");
  return `SM-${y}${m}${d}-${seq}`;
}

export function createOrder(input: Omit<Order, "id" | "orderNumber" | "status" | "statusHistory" | "createdAt" | "updatedAt">): Order {
  const orders = readJson<Order[]>(ORDERS_FILE, []);
  const now = new Date().toISOString();
  const order: Order = {
    ...input,
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    orderNumber: generateOrderNumber(),
    status: "PENDING",
    statusHistory: [{ status: "PENDING", note: "Order placed by customer", createdAt: now }],
    createdAt: now,
    updatedAt: now,
  };
  orders.push(order);
  writeJson(ORDERS_FILE, orders);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus, note?: string): Order | undefined {
  const orders = readJson<Order[]>(ORDERS_FILE, []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  orders[idx].status = status;
  orders[idx].updatedAt = now;
  orders[idx].statusHistory.push({ status, note, createdAt: now });
  writeJson(ORDERS_FILE, orders);
  return orders[idx];
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export function getApprovedReviews(): Review[] {
  return readJson<Review[]>(REVIEWS_FILE, []).filter((r) => r.isApproved);
}

export function getAllReviews(): Review[] {
  return readJson<Review[]>(REVIEWS_FILE, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createReview(input: Omit<Review, "id" | "isApproved" | "createdAt">): Review {
  const reviews = readJson<Review[]>(REVIEWS_FILE, []);
  const review: Review = {
    ...input,
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    isApproved: false,
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  writeJson(REVIEWS_FILE, reviews);
  return review;
}

export function setReviewApproval(id: string, isApproved: boolean): Review | undefined {
  const reviews = readJson<Review[]>(REVIEWS_FILE, []);
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  reviews[idx].isApproved = isApproved;
  writeJson(REVIEWS_FILE, reviews);
  return reviews[idx];
}

export function deleteReview(id: string): void {
  const reviews = readJson<Review[]>(REVIEWS_FILE, []);
  writeJson(REVIEWS_FILE, reviews.filter((r) => r.id !== id));
}
