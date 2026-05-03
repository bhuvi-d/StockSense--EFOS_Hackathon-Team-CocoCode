import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';

const dbPath = join(process.cwd(), 'stocksense.db');
const db = new DatabaseSync(dbPath);

const positiveTemplates = [
    "Absolutely love this product! It works exactly as described.",
    "Best purchase I've made this year. Highly recommended.",
    "The quality is exceptional for the price.",
    "Exceeded my expectations. I use it every single day.",
    "Very impressed with the build quality and performance.",
    "Works perfectly. I haven't had any issues at all.",
    "The design is sleek and it feels very premium.",
    "Great value for money. Will definitely buy again.",
    "Five stars! It has made my life so much easier.",
    "Fast delivery and the product is fantastic."
];

const products = db.prepare('SELECT * FROM products').all();
const reviews = db.prepare('SELECT * FROM reviews').all();

const highSentimentProducts = products.map(p => {
  const pReviews = reviews.filter(r => r.product_id === p.id).map(r => r.review);
  const positiveCount = pReviews.filter(r => positiveTemplates.includes(r)).length;
  const sentimentRatio = positiveCount / pReviews.length;
  return {
    name: p.name,
    sentiment: sentimentRatio,
    reviewCount: pReviews.length
  };
}).filter(p => p.sentiment > 0.6); // Threshold for sentiment > 0.5 in the agent logic

console.log(JSON.stringify(highSentimentProducts, null, 2));
