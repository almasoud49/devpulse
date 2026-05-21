import express, { type Request, type Response } from "express"
import config from "./config";
import app from "./app";
import { initDB } from "./db";



app.use(express.json());

app.get('/', (req:Request, res:Response) => {
  res.send('Hello, Now, I am building Devpulse backend!');
});

const main =()=>{
initDB();
app.listen(config.port, () => {
  console.log(`DevPulse app listening on port ${config.port}`);
});
}

main();


