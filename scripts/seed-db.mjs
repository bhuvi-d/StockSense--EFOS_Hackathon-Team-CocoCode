import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'stocksense.db');

const db = new DatabaseSync(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    review TEXT,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

const categories = ['Electronics', 'Fashion', 'Home', 'Beauty'];

const productTemplates = [
  { category: 'Electronics', names: ['UltraVision 4K Monitor', 'SonicBlast Wireless Speaker', 'ProTrack Fitness Watch', 'PixelFlow Tablet', 'GigaCore External SSD', 'LunaTab E-Reader', 'ApexGaming Mouse', 'CloudLink Router', 'VividStream Webcam', 'PowerPulse Power Bank', 'QuietTune Earbuds', 'SmartHome Hub', 'TitanLaptop Pro', 'NanoDrone X1', 'FocusBeam Projector'] },
  { category: 'Fashion', names: ['UrbanStride Sneakers', 'ClassicFit Denim Jacket', 'SilkSoft Scarf', 'WeatherProof Parka', 'LeatherCraft Wallet', 'ActiveWear Leggings', 'EliteTime Watch', 'VelvetNight Evening Bag', 'SunGlow Sunglasses', 'CozyKnit Sweater', 'FlexRun Running Shorts', 'BreezeLinen Shirt', 'RuggedTrek Boots', 'GoldLeaf Pendant', 'SportPace Cap'] },
  { category: 'Home', names: ['PureAir Purifier', 'ChefMaster Knife Set', 'ComfortCloud Pillow', 'EcoBright LED Lamp', 'SmartSip Water Filter', 'AromaDiffuser Pro', 'SteamClean Iron', 'VelvetTouch Towels', 'AutoBrew Coffee Maker', 'SleepTight Mattress Topper', 'FreshSeal Container Set', 'QuietBreeze Floor Fan', 'DeepClean Stick Vacuum', 'ModernArt Wall Clock', 'CozyFlame Electric Heater'] },
  { category: 'Beauty', names: ['GlowRoot Hair Serum', 'HydraPure Face Cream', 'VelvetMatte Lipstick', 'SilkFinish Foundation', 'OceanMist Perfume', 'EcoBrush Makeup Set', 'NailCure Polish Kit', 'RadiantEye Palette', 'SoftSkin Body Wash', 'PureDaily Cleanser', 'GentleExfoliator Scrub', 'LashLift Mascara', 'DewyGlow Primer', 'NatureInfused Shampoo', 'SmoothGlide Razor'] }
];

const reviewTemplates = {
  positive: [
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
  ],
  negative: [
    "Disappointed with the quality. It felt a bit cheap.",
    "Stopped working after a week. Not worth the money.",
    "The instructions were very confusing and hard to follow.",
    "Doesn't live up to the hype. Performance is mediocre.",
    "The battery life is much shorter than advertised.",
    "Arrived with some minor scratches. Poor quality control.",
    "It's okay, but I expected more for this price point.",
    "A bit louder than I expected. Kind of annoying.",
    "The connection drops occasionally. Frustrating experience.",
    "Not as good as the pictures made it look."
  ],
  neutral: [
    "It's decent for the price, but nothing special.",
    "Works as expected. No real complaints, but no praise either.",
    "Average product. It gets the job done eventually.",
    "The packaging was nice, but the product is just okay.",
    "A bit smaller than I anticipated, but it works.",
    "Middle of the road. There are better options available.",
    "It's fine for basic use, but not for heavy duty tasks.",
    "The color is slightly different from the website.",
    "Good enough for what I need it for right now.",
    "Fairly standard quality. Neither great nor terrible."
  ]
};

// Clear existing data
db.exec('DELETE FROM reviews');
db.exec('DELETE FROM products');

const insertProduct = db.prepare('INSERT INTO products (id, name, category) VALUES (?, ?, ?)');
const insertReview = db.prepare('INSERT INTO reviews (product_id, review) VALUES (?, ?)');

let count = 0;
for (const cat of productTemplates) {
  for (const name of cat.names) {
    const id = `prod_${Math.random().toString(36).substr(2, 9)}`;
    insertProduct.run(id, name, cat.category);

    // Generate 5-15 reviews
    const numReviews = Math.floor(Math.random() * 11) + 5;
    for (let i = 0; i < numReviews; i++) {
      const type = Math.random() > 0.4 ? (Math.random() > 0.3 ? 'positive' : 'neutral') : 'negative';
      const template = reviewTemplates[type];
      const reviewText = template[Math.floor(Math.random() * template.length)];
      insertReview.run(id, reviewText);
    }
    count++;
  }
}

console.log(`Successfully seeded ${count} products into the database.`);
