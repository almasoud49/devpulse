
import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { issueStatuses, issueTypes } from "../../types/index";

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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    
    const validSortValues = ['newest', 'oldest'];
    const sortValue = sort as string;
    if (sort && !validSortValues.includes(sortValue)) {
      res.status(400).json({
        success: false,
        message: `Invalid sort parameter. Must be one of: ${validSortValues.join(", ")}`,
      });
      return;
    }
    
    const typeValue = type as string;
    if (type && !issueTypes.includes(typeValue as any)) {
      res.status(400).json({
        success: false,
        message: `Invalid type parameter. Must be one of: ${issueTypes.join(", ")}`,
      });
      return;
    }
 
    const statusValue = status as string;
    if (status && !issueStatuses.includes(statusValue as any)) {
      res.status(400).json({
        success: false,
        message: `Invalid status parameter. Must be one of: ${issueStatuses.join(", ")}`,
      });
      return;
    }
    
    const queryParams = {
      sort: sortValue || 'newest',
      type: typeValue as any,
      status: statusValue as any,
    };
    
    const issues = await issueService.getAllIssues(queryParams);
      
    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error: any) {
    console.error("Get all issues error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
};