require('dotenv').config();

const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

const { env } = require('../src/config/env');
const { connectDb } = require('../src/config/db');
const { Product } = require('../src/models/Product');

const TOTAL = Number(process.env.SEED_COUNT ?? 50000);
const BATCH_SIZE = 1000;

const CATEGORIES = [
  'electronics',
  'audio',
  'apparel',
  'home',
  'beauty',
  'sports',
  'office',
  'toys',
  'grocery',
  'automotive'
];

function generateProduct(i) {
  const category = faker.helpers.arrayElement(CATEGORIES);

  const cost = faker.number.float({ min: 2, max: 450, fractionDigits: 2 });
  const price = faker.number.float({ min: cost, max: Math.max(cost * 1.65, cost + 1), fractionDigits: 2 });

  const stockQuantity = faker.number.int({ min: 0, max: 800 });
  const reorderLevel = faker.number.int({ min: 5, max: 80 });

  const sku = `${faker.string.alpha({ length: 3, casing: 'upper' })}-${faker.number.int({
    min: 100000,
    max: 999999
  })}-${i}`;

  return {
    productName: faker.commerce.productName(),
    sku,
    category,
    price,
    cost,
    stockQuantity,
    reorderLevel,
    lastUpdated: faker.date.recent({ days: 30 })
  };
}

async function seed() {
  const shouldDrop = process.argv.includes('--drop');

  await connectDb({ mongoUri: env.mongoUri, nodeEnv: env.nodeEnv });

  if (shouldDrop) {
    await Product.deleteMany({});
  }

  // Insert in batches to keep memory stable.
  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const batch = [];
    const end = Math.min(i + BATCH_SIZE, TOTAL);
    for (let j = i; j < end; j += 1) {
      batch.push(generateProduct(j));
    }

    // ordered:false continues past any unexpected duplicates
    // (SKU is designed to be unique already).
    // eslint-disable-next-line no-await-in-loop
    await Product.insertMany(batch, { ordered: false });
    // eslint-disable-next-line no-console
    console.log(`Seeded ${end}/${TOTAL}`);
  }

  await Product.syncIndexes();

  // eslint-disable-next-line no-console
  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
