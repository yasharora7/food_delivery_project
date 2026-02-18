import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Resturant from "../models/resturant.js";
import MenuItems from "../models/MenuItems.js";

export const addMenuItem = TryCatch(async(req: AuthenticatedRequest, res)=>{
    if(!req.user){
        return res.status(401).json({
            message: "Please Login",
        });
    }
    const resturant = await Resturant.findOne({ ownerId: req.user._id});

    if(!resturant){
        return res.status(404).json({
            message: "No Resturant Found",
        })
    }

    const { name, description, price}= req.body;

    if(!name || !price){
        return res.status(400).json({
                message: "Name and Price are required",
        });
    }

    const file = req.file;
    
    if(!file){
        return res.status(400).json({
            message: "Please give all image",
        });
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer?.content){
        return res.status(500).json({
            message: "Failed to create file buffer",
        });
    }
    const {data: uploadResult}= await axios.post(`${process.env.UTILS_SERVICE}/api/upload`,{
        buffer: fileBuffer.content,
    });

    const item= await MenuItems.create({
        name,
        description,
        price,
        resturantId: resturant._id,
        image: uploadResult.url,
    })

    res.json({
        message: "Item Added Successfully",
        item,
    })
});

export const getAllItems = TryCatch(async(req: AuthenticatedRequest,res)=>{
    const {id}=req.params;
    if(!id){
        return res.status(400).json({
            message: "Id is required",
        })
    }

    const items = await MenuItems.find({resturant: id})
    res.json(items);
})

export const deleteMenuItem = TryCatch(async(req:AuthenticatedRequest, res)=>{
    if(!req.user){
        return res.status(401).json({
            message: "Please Login",
        });
    }

    const {itemId}=req.params;
    if(!itemId){
        return res.status(400).json({
            message: "Id is required",
        });
    }

    const item = await MenuItems.findById(itemId);

    if(!item){
        return res.status(404).json({
            message: "Np item found",
        });
    }

    const resturant= await Resturant.findOne({
        _id: item.resturantId,
        ownerId: req.user._id,
    });

    if(!resturant){
        return res.status(404).json({
            message: "Np resturant found",
        });
    }

    await item.deleteOne();

    res.json({
        message: "Menu Items deleted successfully",
    });
})

export const toggleMenuItemAvalibility= TryCatch(async(req: AuthenticatedRequest,res)=>{
    if(!req.user){
        return res.status(401).json({
            message: "Please Login",
        });
    }

    const {itemId}=req.params;
    if(!itemId){
        return res.status(400).json({
            message: "Id is required",
        });
    }

    const item = await MenuItems.findById(itemId);

    if(!item){
        return res.status(404).json({
            message: "Np item found",
        });
    }

    const resturant= await Resturant.findOne({
        _id: item.resturantId,
        ownerId: req.user._id,
    });

    if(!resturant){
        return res.status(404).json({
            message: "Np resturant found",
        });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
        message: `Item marked as ${
        item.isAvailable ? "available" : "unavailabe"}`,
        item,
    });
})