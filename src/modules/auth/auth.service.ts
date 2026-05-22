import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import config from "../../config";

const lonignUserIntoDB = async(payload: {
        email: string, 
        password: string})=>{
    const {email ,password} = payload;

    const result = await pool.query(`
        SELECT * FROM "users" WHERE "email"=$1
        `,[email]);
    const user = result.rows[0];
    // console.log(user)

    if(user.rows?.length === 0){
        throw new Error("Invalid Credentials! User not Found.")
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword){
        throw new Error("Not Matched! Invalid Credentials!")
    }

    const jwtpayload = {
        id:user.id,
        name: user.name,
        role: user.role,
        email: user.email
    }

    const accessToken = jwt.sign(jwtpayload, config.access_token_secret as Secret, {
        expiresIn: "1d"
    })

    return accessToken;

}


export const authService = {
    lonignUserIntoDB
}