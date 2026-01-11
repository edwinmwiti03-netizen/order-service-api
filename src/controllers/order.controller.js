import * as service from "../services/order.service.js";
import { createOrderSchema } from "../validations/order.validation.js";

export const create = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await service.createOrder(req.user.id, data.items);
    res.status(201).json(order);
  } catch (e) { next(e); }
};

export const list = async (req, res, next) => {
  try {
    const orders = await service.getOrders(req.user);
    res.json(orders);
  } catch (e) { next(e); }
};

export const pay = async (req, res, next) => {
  try {
    const order = await service.payOrder(req.params.id);
    res.json(order);
  } catch (e) { next(e); }
};

export const cancel = async (req, res, next) => {
  try {
    const order = await service.cancelOrder(req.params.id);
    res.json(order);
  } catch (e) { next(e); }
};
