import mongoose, {Document, Schema} from "mongoose";

export interface IMenuItem extends Document{
    resturantId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string;
    price: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const schema = new Schema<IMenuItem>({
    resturantId: {
        type: Schema.Types.ObjectId,
        ref: "Resturant",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
    }
},{
    timestamps:true,
}

)


export default mongoose.model<IMenuItem>("MenuItem",schema);