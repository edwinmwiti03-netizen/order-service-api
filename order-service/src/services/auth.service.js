import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repository.js";

export const register = async (email, password) => {
  const exists = await userRepo.findByEmail(email);
  if (exists) throw { status: 409, message: "Email already exists" };

  const hash = await bcrypt.hash(password, 10);
  return userRepo.createUser({ email, passwordHash: hash });
};

export const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
