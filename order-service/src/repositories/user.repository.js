import User from "../models/User.js";

export const findByEmail = (email) => User.findOne({ email });
export const createUser = (data) => User.create(data);
export const findById = (id) => User.findById(id);
