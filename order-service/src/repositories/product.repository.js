import Product from "../models/Product.js";

export const create = (data) => Product.create(data);
export const findAll = () => Product.find();
export const findById = (id) => Product.findById(id);
export const update = (id, data) => Product.findByIdAndUpdate(id, data, { new: true });
