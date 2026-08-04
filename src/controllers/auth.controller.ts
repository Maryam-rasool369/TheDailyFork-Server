import { Request,Response,NextFunction } from "express";
// import { signup } from "../services/auth.service";
export const signupController = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const {firstName,lastName,email,password} = req.body();
        
    } catch (error) {

    }
}

export const loginController = () => {
    console.log("Hello")

}