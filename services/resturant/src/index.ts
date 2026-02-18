import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import resturantRoutes from "./routes/resturant.js";
import itemRoutes from "./routes/menuitems.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use("/api/resturant",resturantRoutes);
app.use("/api/iten",itemRoutes);

app.listen(PORT, ()=>{
    console.log(`Auth service is running on port ${PORT}`);
    connectDB();
})