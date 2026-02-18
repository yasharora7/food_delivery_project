import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Resturant from "../models/resturant.js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const addResturant = TryCatch(async(req: AuthenticatedRequest,res)=>{
    const user = req.user;
    if(!user){
        return res.status(401).json({
            message:"Unauthorized",
        });
    }
    const existingResturant = await Resturant.findOne({
        ownerId: user._id,

    });

    if(existingResturant){
        return res.status(400).json({
            message: "you already have a resturant",
        });
    }

    const { name, description, latitude, longitude, formattedAddress, phone} = req.body;

    if(!name || latitude==null || longitude==null){
        return res.status(400).json({
            message: "Please give all details",
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

    const resturant = await Resturant.create({
        name,
        description,
        phone,
        image: uploadResult.url,
        ownerId: user._id,
        autoLocation:{
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress,
        },
        isVerified:false,
    });

    return res.status(201).json({
        message: "Resturant created Successfully",
        resturant,
    });
});

export const fetchMyResturant = TryCatch(async(req: AuthenticatedRequest,res)=>{
    if(!req.user){
        return res.status(401).json({
            message: "Please Login",
        });
    }

 const resturant = await Resturant.findOne({ownerId: req.user._id});
  if(!resturant){
    return res.status(400).json({
        message: "No resturant found",
    });
  }
  if(!req.user.resturantId){
    const token = jwt.sign(
    {
        user:{
            ...req.user,
            resturantId: resturant._id,
        },
    },
    process.env.JWT_SEC as string,
    {
        expiresIn: "15d",
    }
    );
    return res.json({resturant, token})
  }

  res.json({resturant});
}
);

export const updateStatusResturant = TryCatch(
    async (req:AuthenticatedRequest, res)=>{
        if(!req.user){
            return res.status(403).json({
                message: "Please Login",
            });
        }

        const {status}=req.body;

        if(typeof status !== "boolean"){
            return res.status(400).json({
                message: "Status must be boolean",
            });
        }

        const resturant = await Resturant.findOneAndUpdate({
            ownerId: req.user._id,
        },
        {isOpen: status},
        {new:true}
        );

        if(!resturant){
            return res.status(404).json({
                message: "Resturant not found",
            });
        }

        res.json({
            message: "Resturant status Updated",
        });
    }
);

export const updateResturant = TryCatch(async(req: AuthenticatedRequest, res)=>{
    if(!req.user){
        return res.status(403).json({
            message: "Please Login",
        });
    }

    const {name , description}=req.body;

    const resturant = await Resturant.findOneAndUpdate(
        {ownerId: req.user._id },
        {name: name, description: description},
        {new : true}
    )

    if(!resturant){
        return res.status(404).json({
            message: "Resturant not found",
        });
    }

    res.json({
        message: "Resturant Updated",
    });

})
