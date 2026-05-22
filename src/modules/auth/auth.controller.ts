import type { Request, Response } from "express";
import { authService } from "./auth.service";


const loginUser = async(req:Request, res:Response)=>{

try {

    const result = await authService.lonignUserIntoDB(req.body)
    console.log("from controller", result)
      
    res.status(200).json({
    success: true,
    message: "User Logdin Successfully",
    data: result
    // data: {
    //     token: result.token,
    //     user: {
    //       id: result.user.id,
    //       name: result.user.name,
    //       email: result.user.email,
    //       role: result.user.role,
    //       created_at: result.user.created_at,
    //       updated_at: result.user.updated_at
    //     }
    //   }
    
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