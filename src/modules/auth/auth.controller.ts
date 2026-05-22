import type { Request, Response } from "express";
import { authService } from "./auth.service";


const loginUser = async(req:Request, res:Response)=>{
 const { email, password } = req.body;
try {

    const result = await authService.lonignUserIntoDB({ email, password } );
    const {token, user} = result;   
      
    res.status(200).json({
    success: true,
    message: "Login successful",
    data: {token, user}
    
    
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