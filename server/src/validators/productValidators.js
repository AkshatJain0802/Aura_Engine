const { z } = require('zod');

const baseProductSchema = z.object({
  productName: z.string().trim().min(1, { message: 'Product name is required' }),
  sku: z.string().trim().min(1, { message: 'SKU is required' }),
  category: z.string().trim().min(1, { message: 'Category is required' }),
  price: z.number({ invalid_type_error: 'Price must be a number' }).min(0, { message: 'Price cannot be negative' }),
  cost: z.number({ invalid_type_error: 'Cost must be a number' }).min(0, { message: 'Cost cannot be negative' }),
  stockQuantity: z
    .number({ invalid_type_error: 'Stock quantity must be a number' })
    .int({ message: 'Stock quantity must be an integer' })
    .min(0, { message: 'Stock quantity cannot be negative' }),
  reorderLevel: z
    .number({ invalid_type_error: 'Reorder level must be a number' })
    .int({ message: 'Reorder level must be an integer' })
    .min(0, { message: 'Reorder level cannot be negative' })
});

const createProductBodySchema = baseProductSchema.refine((data) => data.price >= data.cost, {
  message: 'Price cannot be lower than cost',
  path: ['price']
});

const updateProductBodySchema = baseProductSchema.partial().superRefine((data, ctx) => {
  // If both are provided, enforce the rule here.
  if (typeof data.price === 'number' && typeof data.cost === 'number' && data.price < data.cost) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price cannot be lower than cost', path: ['price'] });
  }
});

module.exports = { createProductBodySchema, updateProductBodySchema };
