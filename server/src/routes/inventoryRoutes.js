const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { validateBody } = require('../middleware/validate');
const { createProductBodySchema, updateProductBodySchema } = require('../validators/productValidators');
const { createProduct, getInventory, updateProduct } = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', asyncHandler(getInventory));
router.post('/', validateBody(createProductBodySchema), asyncHandler(createProduct));
router.put('/:id', validateBody(updateProductBodySchema), asyncHandler(updateProduct));

module.exports = { inventoryRoutes: router };
