import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'stocksense.db');
const db = new DatabaseSync(dbPath);

const products = db.prepare('SELECT * FROM products').all();
const reviews = db.prepare('SELECT * FROM reviews').all();

const productData = products.map(p => {
  const pReviews = reviews.filter(r => r.product_id === p.id).map(r => r.review);
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    reviewCount: pReviews.length,
    reviews: pReviews
  };
});

console.log(JSON.stringify(productData, null, 2));
