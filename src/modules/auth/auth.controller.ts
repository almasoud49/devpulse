import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";


const loginUser = async(req:Request, res:Response)=>{
 const { email, password } = req.body;
try {
    const result = await authService.lonignUserIntoDB({ email, password } );
    sendResponse(res,{
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result  
    });
    
} catch (error:any) {
    sendResponse(res,{
    statusCode: 500,
    success: false,
    message: error.message,
    error: error
    });
}
}

export const authController = {
    loginUser
}