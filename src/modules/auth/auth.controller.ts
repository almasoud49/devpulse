import type { Request, Response } from "express";
import { authService } from "./auth.service";


const loginUser = async(req:Request, res:Response)=>{

try {

    const result = await authService.lonignUserIntoDB(req.body)
      
    res.status(200).json({
    success: true,
    message: "User Logdin Successfully",
    data: result
    
    });
    
} catch (error:any) {
    res.status(500).json({
    message: error.message,
    error: error
    })
}
}

export const authController = {
    loginUser
}