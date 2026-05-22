import express, { type Application } from "express"
import { userRoutes } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoutes } from "./modules/issue/issue.route";

const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoutes);






export default app;