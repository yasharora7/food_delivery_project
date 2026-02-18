import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { addMenuItem, deleteMenuItem, toggleMenuItemAvalibility } from "../controllers/menuitems.js";

const router = express.Router();

router.post("/new",isAuth, isSeller, addMenuItem);
router.post("/all/:id", isAuth, addMenuItem);
router.delete("/:id", isAuth, isSeller, deleteMenuItem);
router.delete("/status/:id", isAuth, isSeller, toggleMenuItemAvalibility);

export default router;
