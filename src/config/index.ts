
import dotenv from 'dotenv';
import path from "path"

dotenv.config({
        path:path.join(process.cwd(), ".env")
    
})

const config = {
    connection_string: process.env.CONNECTIONSTRING as string,
    port: process.env.PORT,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
    access_token_expire_in: process.env.ACCESS_TOKEN_EXPIRE_IN ,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
    refresh_token_expire_in: process.env.REFRESH_TOKEN_EXPIRE_IN as string,
};

export default config;