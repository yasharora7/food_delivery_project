import {Request ,Response , NextFunction} from 'express';
import jwt , {JwtPayload}from 'jsonwebtoken';


export interface IUser{
    _id:string; 
    name:string;
    email:string;
    image:string;
    role:string;
    resturantId:string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({
                message: "Please Login - No Auth Header"
            })
            return;
        }
        const token= authHeader.split(" ")[1];

        if(!token){
            res.status(401).json({
                message: "Please Login -No Token",
            })
            return;
        }

        const decoded= jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload;

        if(!decoded || !decoded.user){
            res.status(401).json({
                message: "Please Login - Invalid Token",
            })
            return;
        }

        req.user = decoded.user;
        next();
    } catch (error: any) {
        res.status(401).json({
            message: "please login - jwt error",
            error: error.message,
        })
    }
}

export const isSeller = async(
    req : AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    const user = req.user;

    if(user && user.role!== "seller"){
        res.status(401).json({
            message: "you are not authorized seller",
        });
        return ;
    }
    next();
}