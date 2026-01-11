import jwt from "jsonwebtoken";

export const authGuard = (roles = []) => (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw { status: 401, message: "Missing token" };

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(payload.role)) throw { status: 403, message: "Forbidden" };

    req.user = payload;
    next();
  } catch (e) { next(e); }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
};
