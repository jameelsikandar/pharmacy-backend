import { Router } from "express";
import { addSale, getSale, listSales } from "../../controllers/v1/sale.controller";
import { authGuard } from "../../middlewares/v1/auth.guard";

const router = Router();

// list sales
router.route("/list").get(authGuard, listSales);

// add sale
router.route("/").post(authGuard, addSale);

// get sale by id
router.route("/sale/:saleID").get(authGuard, getSale);

export default router;
