import * as repo from "../repositories/order.repository.js";

export const createOrder = (userId, items) => repo.createOrder(userId, items);

export const getOrders = (user) => repo.findOrders(user);

export const payOrder = async (orderId) => {
  const order = await repo.findById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };

  if (order.status === "paid") return order;           // idempotent
  if (order.status === "cancelled") throw { status: 409, message: "Cannot pay a cancelled order" };

  return repo.updateOrder(orderId, { status: "paid" });
};

export const cancelOrder = async (orderId) => {
  const session = await repo.Order.startSession();
  session.startTransaction();

  try {
    const order = await repo.findById(orderId).session(session);
    if (!order) throw { status: 404, message: "Order not found" };

    if (order.status === "cancelled") return order;
    if (order.status === "paid") throw { status: 409, message: "Cannot cancel a paid order" };

    // Restore stock
    for (const item of order.items) {
      const product = await repo.Product.findById(item.productId).session(session);
      if (product) {
        product.stock += item.quantity;
        await product.save({ session });
      }
    }

    const updatedOrder = await repo.updateOrder(orderId, { status: "cancelled" });
    await session.commitTransaction();
    session.endSession();

    return updatedOrder;
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};
