import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import Cart from "../models/Cart.js";

export const addToCart = TryCatch(async(req: AuthenticatedRequest, res)=>{
    if(!req.user){
        return res.status(401).json({
            message:"Please Login",
        });
    }
    
    const userId = req.user._id;

    const { resturantId, itemId} = req.body;

    if(
        !mongoose.Types.ObjectId.isValid(resturantId) ||
        !mongoose.Types.ObjectId.isValid(itemId)
    ){
        return res.status(400).json({
            message: "Invalid resturant and item id",
        });
    }
    const cartFormDifferentResturant = await Cart.findOne({
        userId,
        resturantId:{$ne: resturantId},
    });

    if(cartFormDifferentResturant){
        return res.status(400).json({
            message: "You can order from only one resturant at a time. Please clear your cart first to add items from this resturant",
        });
    }
    const cartItems = await Cart.findOneAndUpdate(
        {userId, resturantId, itemId},
        {
            $inc: {quantity: 1},
            $setOnInsert: { userId, resturantId, itemId},
        },
        {upsert: true, returnDocument: "after", setDefaultsOnInsert: true}
    );
    return res.json({
        message: "Item added to cart",
        cart: cartItems,
    });
});

export const fetchMyCart= TryCatch(async (req: AuthenticatedRequest,res)=>{
    if(!req.user){
        return res.status(401).json({
            message: "Please Login",
        });
    }

    const userId = req.user._id;

    const cartItems = await Cart.find({ userId }).populate("itemId").populate("resturantId");

    let subtotal=0;
    let cartLength=0;

    for (const cartItem of cartItems) {
    const item: any = cartItem.itemId;

    if (!item) continue;  // prevent crash

    subtotal += item.price * cartItem.quantity;
    cartLength += cartItem.quantity;
}

    return res.json({
        success: true,
        cartLength,
        subtotal,
        cart: cartItems,
    });
});

export const incrementCartItem = TryCatch(
    async (req: AuthenticatedRequest, res)=>{
        const userId = req.user?._id;

        const { itemId }=req.body;

        if(!userId || !itemId){
            return res.status(400).json({
                message: "Invalid request",
            });
        }

        const cartItem = await Cart.findOneAndUpdate(
            {userId, itemId},
            {$inc:{quantity:1}},
            {returnDocument: "after"},
        );

        if(!cartItem){
            return res.status(404).json({
                message: "Item not Found",
            });
        }

        return res.json({
            message: "Quantity Increased",
            cartItem,
        })
    }
)

export const decrementCartItem = TryCatch(
    async (req: AuthenticatedRequest, res)=>{
        const userId = req.user?._id;

        const { itemId }=req.body;

        if(!userId || !itemId){
            return res.status(400).json({
                message: "Invalid request",
            });
        }

        const cartItem = await Cart.findOne(
            {userId, itemId},
        );

        if(!cartItem){
            return res.status(404).json({
                message: "Item not Found",
            });
        }

        if(cartItem.quantity === 1){
            await Cart.deleteOne({userId, itemId});

            return res.json({
                message: "Item removed form cart",
            });
        }

        cartItem.quantity-=1;
        await cartItem.save();

        return res.json({
            message: "Quantity Decreased",
            cartItem,
        })
    }
)

export const clearCart = TryCatch(async(req:AuthenticatedRequest, res)=>{
    const userId = req.user?._id;
    if(!userId){
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    await Cart.deleteMany({userId});
    res.json({
        message: "Cart Deleted Successfully",
    })
})