// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

let dbInstance: any = null;

function getDb() {
  if (dbInstance) return dbInstance;
  
  const dbPath = join(process.cwd(), 'stocksense.db');
  // @ts-ignore
  dbInstance = new DatabaseSync(dbPath);
  return dbInstance;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  reviewCount?: number;
}

export interface ProductWithReviews extends Product {
  reviews: string[];
}

export function getAllProducts(): Product[] {
  const db = getDb();
  const query = db.prepare(`
    SELECT p.id, p.name, p.category, COUNT(r.id) as reviewCount 
    FROM products p 
    LEFT JOIN reviews r ON p.id = r.product_id 
    GROUP BY p.id
  `);
  return query.all() as Product[];
}

export function getProductWithReviews(productId: string): ProductWithReviews | null {
  const db = getDb();
  const productQuery = db.prepare('SELECT id, name, category FROM products WHERE id = ?');
  const product = productQuery.get(productId) as Product | undefined;
  
  if (!product) return null;
  
  const reviewsQuery = db.prepare('SELECT review FROM reviews WHERE product_id = ?');
  const reviews = (reviewsQuery.all(productId) as { review: string }[]).map(r => r.review);
  
  return {
    ...product,
    reviews
  };
}
