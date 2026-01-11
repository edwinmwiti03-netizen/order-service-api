import * as service from "../services/product.service.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validation.js";

export const create = async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await service.createProduct(data);
    res.status(201).json(product);
  } catch (e) { next(e); }
};

export const list = async (req, res, next) => {
  try {
    res.json(await service.getProducts());
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const data = updateProductSchema.parse(req.body);
    res.json(await service.updateProduct(req.params.id, data));
  } catch (e) { next(e); }
};
