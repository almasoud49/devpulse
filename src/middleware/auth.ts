import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";
import { pool } from "../db/index";
import type { JwtPayload } from "jsonwebtoken";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      
      if (!token) {
        sendResponse(res,{
          statusCode: 401,
          success: false,
          message: "Unauthorized Access!"
        });
        return;
      }

      const decoded = jwt.verify(
        token as string,
        config.access_token_secret as string
      ) as JwtPayload;

      const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
      `, [decoded.email]);

      const user = userData.rows[0];
      
      if (userData.rows.length === 0) {
        sendResponse(res,{
          statusCode:404,
          success: false,
          message: "User Not Found"
        });
        return;
      }

      if (roles.length && !roles.includes(user.role)) {
        sendResponse(res, {
          statusCode: 403,
           success: false,
           message: "Forbidden!!, This role is not found!"
        });
        return;
      }

      req.user = decoded;

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;