import type { RequestHandler } from 'express';
import type { z } from 'zod';
import Category from '#models/Category';
import Product from '#models/Product';
import type { IdParams } from '#schemas/idParamSchema';
import { type ProductInput, productOutputSchema, type UpdateProductInput } from '#schemas/productSchema';

type ProductOutputDTO = z.infer<typeof productOutputSchema>;

// NOTE: Get all products
// FR020: GET /products supports an optional ?categoryId= filter
export const getProducts: RequestHandler<unknown, ProductOutputDTO[], unknown, { categoryId?: string }> = async (
  req,
  res,
) => {
  const { categoryId } = req.query;
  const products = await Product.find(categoryId ? { categoryId } : {});
  res.json(products.map((product) => productOutputSchema.parse(product)));
};

// NOTE: Get a product by id
export const getProductById: RequestHandler<IdParams, ProductOutputDTO> = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) throw new Error('Product not found', { cause: { status: 404 } });

  res.json(productOutputSchema.parse(product));
};

// NOTE: Create a product
export const createProduct: RequestHandler<unknown, ProductOutputDTO, ProductInput> = async (req, res) => {
  const { categoryId } = req.body;

  // FR016: Create/Update Product must fail if categoryId does not reference an existing Category
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found', { cause: { status: 400 } });

  const product = await Product.create(req.body satisfies ProductInput);
  res.status(201).json(productOutputSchema.parse(product));
};

// NOTE: Update a product
export const updateProduct: RequestHandler<IdParams, ProductOutputDTO, UpdateProductInput> = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  if (update.categoryId) {
    // FR016 applies on update too, but only if categoryId is one of the fields being changed
    const category = await Category.findById(update.categoryId);
    if (!category) throw new Error('Category not found', { cause: { status: 400 } });
  }

  const product = await Product.findByIdAndUpdate(id, update, { returnDocument: 'after' });

  if (!product) throw new Error('Product not found', { cause: { status: 404 } });

  res.json(productOutputSchema.parse(product));
};

// NOTE: Delete a product
export const deleteProduct: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) throw new Error('Product not found', { cause: { status: 404 } });

  res.json({ message: 'Product deleted' });
};
