// src/middlewares/auth.ts
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index";
import { pool } from "../db/index";
import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../types";


const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Check if the token exists
      const token = req.headers.authorization;
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized Access!"
        });
        return;
      }

      // 2. Verify the token
      const decoded = jwt.verify(
        token as string,
        config.access_token_secret as string
      ) as JwtPayload;

      // 3. Find the user in database
      const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
      `, [decoded.email]);

      const user = userData.rows[0];
      
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User Not Found"
        });
        return;
      }

      // 4. Check if user is active
      if (user?.open=== false) {
        res.status(403).json({
          success: false,
          message: "Forbidden: Account is deactivated"
        });
        return;
      }

      // 5. Role based validation
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!!, This role is not found!"
        });
        return;
      }

      // Attach user to request
      req.user = decoded;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;