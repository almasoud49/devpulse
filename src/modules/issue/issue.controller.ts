
import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { issueTypes } from "../../types/index";

const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const userId = req.user?.id;

    // Validate required fields
    if (!title || !description || !type) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, type",
      });
      return;
    }

    // Validate title length 
    if (title.length > 150) {
      res.status(400).json({
        success: false,
        message: "Title must be less than 150 characters",
      });
      return;
    }

    // Validate description length 
    if (description.length < 20) {
      res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
      return;
    }

    // Validate issue type
    if (!issueTypes.includes(type as any)) {
      res.status(400).json({
        success: false,
        message: `Invalid issue type. Must be one of: ${issueTypes.join(", ")}`,
      });
      return;
    }

    // Create issue
    const newIssue = await issueService.createIssueIntoDB(userId as number, {
      title,
      description,
      type,
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: newIssue,
    });
  } catch (error: any) {
    console.error("Create issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create issue",
    });
  }
};

export const issueController = {
  createIssue,
};