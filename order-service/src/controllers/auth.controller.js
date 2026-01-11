import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

export const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    await authService.register(data.email, data.password);
    res.status(201).json({ message: "Registered" });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const token = await authService.login(data.email, data.password);
    res.json({ token });
  } catch (e) { next(e); }
};
