import * as repo from "../repositories/product.repository.js";

export const createProduct = (data) => repo.create(data);
export const getProducts = () => repo.findAll();
export const updateProduct = async (id, data) => {
  const product = await repo.findById(id);
  if (!product) throw { status: 404, message: "Product not found" };
  return repo.update(id, data);
};
