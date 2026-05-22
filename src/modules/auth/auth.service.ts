import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type Secret } from "jsonwebtoken"
import config from "../../config";

const lonignUserIntoDB = async(payload: {
        email: string, 
        password: string})=>{
    const {email ,password} = payload;

    const result = await pool.query(`
        SELECT * FROM "users" WHERE "email"=$1
        `,[email]);
    const userData = result.rows[0];
    // console.log(user)

    if(userData.rows?.length === 0){
        throw new Error("Invalid Credentials! User not Found.")
    }

    const matchPassword = await bcrypt.compare(password, userData.password);

    if(!matchPassword){
        throw new Error("Not Matched! Invalid Credentials!")
    }

    const jwtpayload = {
        id:userData.id,
        name: userData.name,
        role: userData.role,
        email: userData.email
    }

    const token = jwt.sign(jwtpayload, config.access_token_secret as Secret, {
        expiresIn: "1d"
    });

    const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };

    return {token, user};

}


export const authService = {
    lonignUserIntoDB
}