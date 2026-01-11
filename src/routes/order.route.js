import { Router } from "express";
import * as controller from "../controllers/order.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authGuard(["customer"]), controller.create);
router.get("/", authGuard(), controller.list);
router.post("/:id/pay", authGuard(["customer"]), controller.pay);
router.post("/:id/cancel", authGuard(["customer"]), controller.cancel);

export default router;
