import { Router } from "express";
import * as controller from "../controllers/product.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/", authGuard(["admin"]), controller.create);
router.get("/", controller.list);
router.patch("/:id", authGuard(["admin"]), controller.update);

export default router;
