import { createClient } from '@supabase/supabase-js';
import { Product, Order } from '../types';
import { PRODUCTS } from '../data';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are set and are not default placeholder values
export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  !supabaseUrl.includes('your-supabase') && 
  !supabaseAnonKey.includes('your-supabase');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * LocalStorage fallback keys for products if Supabase is not connected
 */
const STORAGE_KEY = 'doo_store_products';

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Map Supabase snake_case fields to React camelCase fields
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          nameAr: item.name_ar,
          description: item.description,
          descriptionAr: item.description_ar,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          category: item.category,
          image: item.image,
          benefits: item.benefits || [],
          benefitsAr: item.benefits_ar || [],
          stock: Number(item.stock),
          rating: Number(item.rating),
          reviewsCount: Number(item.reviews_count),
          priceOnRequest: Boolean(item.price_on_request)
        }));
      }
      
      // If table exists but empty, seed it with initial PRODUCTS
      const seeded = await seedInitialProducts();
      if (seeded.length > 0) return seeded;
    } catch (e) {
      console.warn('Supabase products fetch failed, falling back to local storage:', e);
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS));
  return PRODUCTS;
}

/**
 * Seed initial products to Supabase if empty
 */
async function seedInitialProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const records = PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      name_ar: p.nameAr,
      description: p.description,
      description_ar: p.descriptionAr,
      price: p.price,
      original_price: p.originalPrice || null,
      category: p.category,
      image: p.image,
      benefits: p.benefits,
      benefits_ar: p.benefitsAr,
      stock: p.stock,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      price_on_request: p.priceOnRequest || false
    }));

    const { error } = await supabase.from('products').insert(records);
    if (!error) {
      return PRODUCTS;
    }
  } catch (e) {
    console.error('Failed to seed initial products:', e);
  }
  return [];
}

/**
 * Create a new product
 */
export async function createProductInDb(product: Product): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const record = {
        id: product.id,
        name: product.name,
        name_ar: product.nameAr,
        description: product.description,
        description_ar: product.descriptionAr,
        price: product.price,
        original_price: product.originalPrice || null,
        category: product.category,
        image: product.image,
        benefits: product.benefits,
        benefits_ar: product.benefitsAr,
        stock: product.stock,
        rating: product.rating,
        reviews_count: product.reviewsCount,
        price_on_request: product.priceOnRequest || false
      };

      const { error } = await supabase.from('products').insert([record]);
      if (!error) return true;
      throw error;
    } catch (e) {
      console.error('Failed to save product to Supabase:', e);
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(STORAGE_KEY);
  const currentList: Product[] = saved ? JSON.parse(saved) : PRODUCTS;
  const newList = [...currentList, product];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return true;
}

/**
 * Update product fields
 */
export async function updateProductInDb(id: string, fields: Partial<Product>): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      // Map React camelCase to Supabase snake_case fields
      const updateData: any = {};
      if (fields.name !== undefined) updateData.name = fields.name;
      if (fields.nameAr !== undefined) updateData.name_ar = fields.nameAr;
      if (fields.description !== undefined) updateData.description = fields.description;
      if (fields.descriptionAr !== undefined) updateData.description_ar = fields.descriptionAr;
      if (fields.price !== undefined) updateData.price = fields.price;
      if (fields.originalPrice !== undefined) updateData.original_price = fields.originalPrice;
      if (fields.category !== undefined) updateData.category = fields.category;
      if (fields.image !== undefined) updateData.image = fields.image;
      if (fields.benefits !== undefined) updateData.benefits = fields.benefits;
      if (fields.benefitsAr !== undefined) updateData.benefits_ar = fields.benefitsAr;
      if (fields.stock !== undefined) updateData.stock = fields.stock;
      if (fields.rating !== undefined) updateData.rating = fields.rating;
      if (fields.reviewsCount !== undefined) updateData.reviews_count = fields.reviewsCount;
      if (fields.priceOnRequest !== undefined) updateData.price_on_request = fields.priceOnRequest;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (!error) return true;
      throw error;
    } catch (e) {
      console.error(`Failed to update product ${id} in Supabase:`, e);
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(STORAGE_KEY);
  const currentList: Product[] = saved ? JSON.parse(saved) : PRODUCTS;
  const newList = currentList.map(p => {
    if (p.id === id) {
      return { ...p, ...fields };
    }
    return p;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return true;
}

/**
 * Delete product
 */
export async function deleteProductFromDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (!error) return true;
      throw error;
    } catch (e) {
      console.error(`Failed to delete product ${id} from Supabase:`, e);
    }
  }

  // Fallback to local storage
  const saved = localStorage.getItem(STORAGE_KEY);
  const currentList: Product[] = saved ? JSON.parse(saved) : PRODUCTS;
  const newList = currentList.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return true;
}

/**
 * Upload image to Supabase Product Images Storage Bucket
 * If not connected, returns a base64 Data URL or the object file itself simulated.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      // 2. Upload file
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);

      if (data && data.publicUrl) {
        return data.publicUrl;
      }
    } catch (e) {
      console.error('Supabase image upload failed:', e);
      throw e;
    }
  }

  // Fallback: Read file as Base64 Data URL for instant in-browser preview persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to map database order records to Order interface types
 */
export function mapOrderRow(item: any): Order {
  return {
    id: item.id,
    customerName: item.customer_name,
    email: item.email,
    discordUsername: item.discord_username,
    items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
    total: Number(item.total),
    paymentMethod: item.payment_method,
    paymentDetails: typeof item.payment_details === 'string' ? JSON.parse(item.payment_details) : item.payment_details,
    status: item.status,
    date: item.date,
    timestamp: item.timestamp,
    trackingCode: item.tracking_code,
    alerts: typeof item.alerts === 'string' ? JSON.parse(item.alerts) : item.alerts || []
  };
}

/**
 * Get all orders from Supabase
 */
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Supabase orders fetch error:', error);
      } else if (data) {
        return data.map((item: any) => mapOrderRow(item));
      }
    } catch (e) {
      console.error('Supabase orders fetch failed:', e);
    }
  }
  return [];
}

/**
 * Save/Upsert an order to Supabase
 */
export async function saveOrder(order: Order): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const record = {
        id: order.id,
        customer_name: order.customerName,
        email: order.email,
        discord_username: order.discordUsername,
        items: JSON.stringify(order.items),
        total: order.total,
        payment_method: order.paymentMethod,
        payment_details: JSON.stringify(order.paymentDetails),
        status: order.status,
        date: order.date,
        timestamp: order.timestamp || order.date,
        tracking_code: order.trackingCode || null,
        alerts: JSON.stringify(order.alerts || [])
      };

      const { error } = await supabase.from('orders').upsert([record]);
      if (!error) return true;
      console.error('Failed to upsert order to Supabase:', error);
    } catch (e) {
      console.error('Failed to save order to Supabase:', e);
    }
  }
  return false;
}

/**
 * Update an order in Supabase
 */
export async function updateOrderInDb(id: string, updates: Partial<Order>): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const updateData: any = {};
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.discordUsername !== undefined) updateData.discord_username = updates.discordUsername;
      if (updates.items !== undefined) updateData.items = JSON.stringify(updates.items);
      if (updates.total !== undefined) updateData.total = updates.total;
      if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
      if (updates.paymentDetails !== undefined) updateData.payment_details = JSON.stringify(updates.paymentDetails);
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp;
      if (updates.trackingCode !== undefined) updateData.tracking_code = updates.trackingCode;
      if (updates.alerts !== undefined) updateData.alerts = JSON.stringify(updates.alerts);

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id);

      if (!error) return true;
      console.error('Failed to update order in Supabase:', error);
    } catch (e) {
      console.error(`Failed to update order ${id} in Supabase:`, e);
    }
  }
  return false;
}

/**
 * Delete an order from Supabase
 */
export async function deleteOrderFromDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (!error) return true;
      console.error(`Failed to delete order ${id} from Supabase:`, error);
    } catch (e) {
      console.error(`Failed to delete order ${id} from Supabase:`, e);
    }
  }
  return false;
}
