
import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { issueTypes,type IssueType, type IssueStatus } from "../../types/index";


const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    if (!title || !description || !type) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, type",
      });
      return;
    }

    if (title.length > 150) {
      res.status(400).json({
        success: false,
        message: "Title must be less than 150 characters",
      });
      return;
    }

    if (description.length < 20) {
      res.status(400).json({
        success: false,
        message: "Description must be at least 20 characters",
      });
      return;
    }

    if (!issueTypes.includes(type as any)) {
      res.status(400).json({
        success: false,
        message: `Invalid type. Must be: ${issueTypes.join(", ")}`,
      });
      return;
    }

    const newIssue = await issueService.createIssueIntoDB(userId, {
      title,
      description,
      type,
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: newIssue,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const issues = await issueService.getAllIssues({
      sort: sort as any,
      type: type as IssueType,
      status: status as IssueStatus,
    });

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);

    if (isNaN(issueId)) {
      res.status(400).json({
        success: false,
        message: "Invalid issue ID",
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);
    const userRole = req.user?.role;
    const { title, description, type, status } = req.body;

    if (userRole !== 'maintainer') {
      res.status(403).json({
        success: false,
        message: "Only maintainers can update issues",
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

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields to update",
      });
      return;
    }

    const result = await issueService.updateIssue(issueId, updates);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result?.updatedIssue,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);
    const userRole = req.user?.role;

    if (userRole !== 'maintainer') {
      res.status(403).json({
        success: false,
        message: "Only maintainers can delete issues",
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
    res.status(500).json({
      success: false,
      message: error.message,
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