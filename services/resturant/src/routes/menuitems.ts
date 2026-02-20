import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { addMenuItem, deleteMenuItem, getAllItems, toggleMenuItemAvalibility } from "../controllers/menuitems.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new",isAuth, isSeller, uploadFile, addMenuItem);
router.get("/all/:id", isAuth, getAllItems);
router.delete("/:itemId", isAuth, isSeller, deleteMenuItem);
router.put("/status/:itemId", isAuth, isSeller, toggleMenuItemAvalibility);

export default router;
