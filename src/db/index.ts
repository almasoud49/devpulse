import {Pool} from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async()=>{
    try {
    console.log("DevPulse Database Connected Successfully!") ;
    } catch (error) {
        console.log(error)
    }
}