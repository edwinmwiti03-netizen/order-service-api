import express from 'express';
import Product from '../models/Product.js';
import { auth, adminOnly } from '../middlewares/auth.js';

const router = express.Router();

// Public: list products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Admin only: create product
router.post('/', auth, adminOnly, async (req, res) => {
  const { name, price, stock } = req.body;
  const product = await Product.create({ name, price, stock });
  res.status(201).json(product);
});

// Admin only: update product
router.patch('/:id', auth, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

export default router;
