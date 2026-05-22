
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id);
    
    if (isNaN(issueId)) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID. Must be a valid number.",
      });
      return;
    }
    
   const issue = await issueService.getSingleIssue(issueId);
    
    if (!issue) {
      res.status(404).json({
        success: false,
        message: `Issue with ID ${issueId} not found`,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error: any) {
    console.error("Get single issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issue",
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { title, description, type, status } = req.body;
    
    if (isNaN(issueId)) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
      return;
    }
    
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }
    
   const updates: any = {};
    
    if (title !== undefined) {
      if (title.length === 0 || title.length > 150) {
        res.status(400).json({
          success: false,
          message: "Title must be between 1 and 150 characters",
        });
        return;
      }
      updates.title = title;
    }
    
    if (description !== undefined) {
      if (description.length < 20) {
        res.status(400).json({
          success: false,
          message: "Description must be at least 20 characters",
        });
        return;
      }
      updates.description = description;
    }
    
    if (type !== undefined) {
      if (!issueTypes.includes(type as any)) {
        res.status(400).json({
          success: false,
          message: `Invalid type. Must be: ${issueTypes.join(", ")}`,
        });
        return;
      }
      updates.type = type;
    }
    
    if (status !== undefined) {
      if (!issueStatuses.includes(status as any)) {
        res.status(400).json({
          success: false,
          message: `Invalid status. Must be: ${issueStatuses.join(", ")}`,
        });
        return;
      }
      updates.status = status;
    }
    
    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields to update",
      });
      return;
    }
    
   const result = await issueService.updateIssue(issueId, updates);
    
  if (!result) {
      res.status(404).json({
        success: false,
        message: `Issue with ID ${issueId} not found`,
      });
      return;
    }
    
    const isMaintainer = userRole === 'maintainer';
    const isOwner = result.existingIssue.reporter_id === userId;
    
    if (!isMaintainer && !isOwner) {
      res.status(403).json({
        success: false,
        message: "You don't have permission to update this issue",
      });
      return;
    }
   
    if (!isMaintainer && isOwner && result.existingIssue.status !== 'open') {
      res.status(403).json({
        success: false,
        message: "You can only update issues with 'open' status",
      });
      return;
    }
    
    if (status !== undefined && !isMaintainer) {
      res.status(403).json({
        success: false,
        message: "Only maintainers can update status",
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.updatedIssue,
    });
    
  } catch (error: any) {
    console.error("Update issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update issue",
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id);
    const userRole = req.user?.role;
    
    if (isNaN(issueId)) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID. Must be a valid number.",
      });
      return;
    }
    
    if (userRole !== 'maintainer') {
      res.status(403).json({
        success: false,
        message: "Forbidden: Only maintainers can delete issues",
      });
      return;
    }
    
   const result = await issueService.deleteIssue(issueId);
    
    if (!result.success) {
      res.status(404).json({
        success: false,
        message: result.message,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
    
  } catch (error: any) {
    console.error("Delete issue error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete issue",
    });
  }
};



export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};