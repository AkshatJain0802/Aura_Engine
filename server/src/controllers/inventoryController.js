const { Product } = require('../models/Product');

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

function clampInt(value, { min, max, fallback }) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function parseSort(sortParam) {
  if (!sortParam) return { lastUpdated: -1 };

  const raw = String(sortParam);
  const direction = raw.startsWith('-') ? -1 : 1;
  const field = raw.replace(/^[-+]/, '');

  const allowed = new Set([
    'productName',
    'sku',
    'category',
    'price',
    'cost',
    'stockQuantity',
    'reorderLevel',
    'lastUpdated'
  ]);

  if (!allowed.has(field)) {
    const error = new Error(`Invalid sort field: ${field}`);
    error.statusCode = 400;
    throw error;
  }

  return { [field]: direction };
}

async function getInventory(req, res) {
  const page = clampInt(req.query.page, { min: 1, max: Number.MAX_SAFE_INTEGER, fallback: 1 });
  const limit = clampInt(req.query.limit, { min: 1, max: MAX_LIMIT, fallback: DEFAULT_LIMIT });

  const search = String(req.query.search ?? '').trim();
  const category = String(req.query.category ?? '').trim();
  const sort = parseSort(req.query.sort ?? '-lastUpdated');

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [data, totalRecords] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limit);

  res.json({
    data,
    pagination: {
      totalRecords,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages
    }
  });
}

async function createProduct(req, res) {
  const payload = req.body;

  const created = await Product.create({
    ...payload,
    lastUpdated: new Date()
  });

  res.status(201).json({ data: created });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const updates = req.body;

  const existing = await Product.findById(id);
  if (!existing) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const nextCost = typeof updates.cost === 'number' ? updates.cost : existing.cost;
  const nextPrice = typeof updates.price === 'number' ? updates.price : existing.price;

  if (nextPrice < nextCost) {
    return res.status(400).json({ message: 'Price cannot be lower than cost' });
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    { ...updates, lastUpdated: new Date() },
    { new: true, runValidators: true }
  );

  res.json({ data: updated });
}

module.exports = { getInventory, createProduct, updateProduct };
