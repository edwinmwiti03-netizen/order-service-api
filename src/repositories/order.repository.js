import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Create order within a transaction
export const createOrder = async (userId, items) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let total = 0;

    // Validate stock & compute total
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw { status: 400, message: `Product ${item.productId} not found` };
      if (product.stock < item.quantity) throw { status: 400, message: `Insufficient stock for ${product.name}` };

      total += item.quantity * product.price;

      // Decrease stock
      product.stock -= item.quantity;
      await product.save({ session });

      item.unitPrice = product.price; // Store unit price at purchase
    }

    const order = await Order.create([{ userId, items, total }], { session });

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

export const findOrders = (user) => {
  if (user.role === "admin") return Order.find();
  return Order.find({ userId: user.id });
};

export const findById = (id) => Order.findById(id);
export const updateOrder = (id, data) => Order.findByIdAndUpdate(id, data, { new: true });
