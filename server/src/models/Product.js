const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, required: true, min: 0 },
    lastUpdated: { type: Date, required: true, default: Date.now }
  },
  {
    versionKey: false
  }
);

// Required indexes (per technical handoff)
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ productName: 1 });

// Optimized search across large catalogs
ProductSchema.index(
  { productName: 'text', sku: 'text', category: 'text' },
  { weights: { sku: 5, productName: 3, category: 1 }, name: 'product_text_search' }
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
