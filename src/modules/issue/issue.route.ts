import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";


const router = Router();

router.post("/", auth("contributor"), issueController.createIssue);

router.get("/", issueController.getAllIssues);

export const issueRoutes = router;