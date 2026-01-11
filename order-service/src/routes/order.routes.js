import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Create order (customer only)
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body; // items = [{ productId, quantity }]

    if (!items || items.length === 0) throw new Error('No items');

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (item.quantity <= 0) throw new Error('Quantity must be > 0');
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      // store price at purchase time
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        unitPrice: product.price
      });

      total += product.price * item.quantity;

      // decrease stock
      product.stock -= item.quantity;
      await product.save({ session });
    }

    const order = await Order.create([{ userId: req.user.userId, items: orderItems, total }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});

export default router;
// Get orders
router.get('/', auth, async (req, res) => {
  const { role, userId } = req.user;
  const orders = role === 'admin'
    ? await Order.find().populate('items.productId')
    : await Order.find({ userId }).populate('items.productId');

  res.json(orders);
});
// Pay
router.post('/:id/pay', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (order.status === 'paid') return res.json(order);
  if (order.status === 'cancelled') return res.status(409).json({ error: 'Order cancelled' });

  order.status = 'paid';
  await order.save();
  res.json(order);
});

// Cancel
router.post('/:id/cancel', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) throw new Error('Order not found');

    if (order.status === 'cancelled') {
      await session.commitTransaction();
      session.endSession();
      return res.json(order);
    }
    if (order.status === 'paid') {
      await session.commitTransaction();
      session.endSession();
      return res.status(409).json({ error: 'Order already paid' });
    }

    // restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId).session(session);
      product.stock += item.quantity;
      await product.save({ session });
    }

    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
});
