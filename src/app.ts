import express, { type Application } from "express"
import { userRoutes } from "./modules/user/user.route";

const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", userRoutes);






export default app;