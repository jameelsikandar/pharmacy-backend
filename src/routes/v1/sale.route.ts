import { Router } from "express";
import { addSale } from "../../controllers/v1/sale.controller";
import { authGuard } from "../../middlewares/v1/auth.guard";

const router = Router();

router.route("/").post(authGuard, addSale);

export default router;
