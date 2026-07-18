import type { RequestHandler } from 'express';
import type { z } from 'zod';
import Category from '#models/Category';
import { type CategoryInput, categoryOutputSchema, type UpdateCategoryInput } from '#schemas/categorySchema';
import type { IdParams } from '#schemas/idParamSchema';

type CategoryOutputDTO = z.infer<typeof categoryOutputSchema>;

// Get category
export const getCategories: RequestHandler<unknown, CategoryOutputDTO[]> = async (req, res) => {
  const categories = await Category.find();
  res.json(categories.map((category) => categoryOutputSchema.parse(category)));
};

// Get category by id
export const getCategoryById: RequestHandler<IdParams, CategoryOutputDTO> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) throw new Error('Category not found', { cause: { status: 404 } });

  res.json(categoryOutputSchema.parse(category));
};

// Create category
export const createCategory: RequestHandler<unknown, CategoryOutputDTO, CategoryInput> = async (req, res) => {
  const category = await Category.create(req.body satisfies CategoryInput);
  res.status(201).json(categoryOutputSchema.parse(category));
};


// Update category
export const updateCategory: RequestHandler<IdParams, CategoryOutputDTO, UpdateCategoryInput> = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  const category = await Category.findByIdAndUpdate(id, update, { returnDocument: 'after' });

  if (!category) throw new Error('Category not found', { cause: { status: 404 } });

  res.json(categoryOutputSchema.parse(category));
};


// Delete category
export const deleteCategory: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) throw new Error('Category not found', { cause: { status: 404 } });

  res.json({ message: 'Category deleted' });
};
