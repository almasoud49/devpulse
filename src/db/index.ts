import {Pool} from "pg";
import config from "../config";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async()=>{
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS USERS(
            id SERIAL PRIMARY KEY,
            name  VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) DEFAULT 'contributor',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
    console.log("DevPulse Database Connected Successfully!") ;
    } catch (error) {
        console.log(error)
    }
}

