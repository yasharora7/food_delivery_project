import express from "express";
import { isAuth, isSeller} from "../middlewares/isAuth.js";
import { addResturant, fetchMyResturant, fetchSingleResturant, getNearbyResturant, updateResturant, updateStatusResturant } from "../controllers/resturant.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuth, isSeller, uploadFile,addResturant);
router.get("/my", isAuth, isSeller, fetchMyResturant);
router.put("/status", isAuth, isSeller, updateStatusResturant);
router.put("/edit", isAuth, isSeller, updateResturant);
router.get("/all",isAuth,getNearbyResturant);
router.get("/:id",isAuth,fetchSingleResturant);

export default router;