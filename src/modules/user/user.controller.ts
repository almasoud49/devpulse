import type { Request, Response } from "express";
import { userService } from "./user.service";

const signupUser = async(req: Request, res:Response)=>{
    const {name, email, password,role} = req.body;
    try {

        const result = await userService.signupUserIntoDB(req.body)
        console.log("User Registration",result)
        
        res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
    });
        
    } catch (error:any) {
        res.status(500).json({
            message: error.message,
            error:error
        })
        
    }
}

export const userController = {
    signupUser
}