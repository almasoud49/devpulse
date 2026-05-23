
import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { issueTypes,type IssueType, type IssueStatus } from "../../types/index";
import sendResponse from "../../utility/sendResponse";


const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res,{
        statusCode:401,
        success: false,
        message:"User not authenticated"
      });      
      return;
    }

    if (!title || !description || !type) {
      sendResponse(res,{
        statusCode:400,
        success: false,
        message:"Missing required fields: title, description, type"
      }); 
      return;
    }

    if (title.length > 150) {
        sendResponse(res,{
        statusCode:400,
        success: false,
        message:"Title must be less than 150 characters"
      });
      return;
    }

    if (description.length < 20) {
      sendResponse(res,{
        statusCode:400,
        success: false,
        message:"Description must be at least 20 characters"
      });
      return;
    }

    if (!issueTypes.includes(type as any)) {
        sendResponse(res,{
        statusCode:400,
        success: false,
        message:`Invalid type. Must be: ${issueTypes.join(", ")}`
      });
      return;
    }

    const newIssue = await issueService.createIssueIntoDB(userId, {
      title,
      description,
      type,
    });

    sendResponse(res,{
    statusCode:201,
    success: true,
    message:"Issue created successfully",
    data: newIssue,
    });

  } catch (error: any) {
    sendResponse(res,{
    statusCode:500,
    success: false,
    message:error.message,
    data: error,
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

    sendResponse(res,{
      statusCode: 200,
      success: true,
      data: issues
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode:500,
      success: false,
      message:error.message,
      error:error
    });    
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);

    if (isNaN(issueId)) {
       sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue ID"
      });
      return;
    }

    const issue = await issueService.getSingleIssue(issueId);

    if (!issue) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: `Issue with ID ${issueId} not found`
      });
      return;
    }
    sendResponse(res,{
      statusCode: 200,
      success: true,
      data: issue
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode:500,
      success: false,
      message:error.message,
      error:error
    });  
  }
};


const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);
    const userRole = req.user?.role;
    const { title, description, type, status } = req.body;

    if (userRole !== 'maintainer') {
      sendResponse(res, {
      statusCode:403,
      success: false,
      message:"Only maintainers can update issues"    
    }); 
      return;
    }

    const issue = await issueService.getSingleIssue(issueId);

    if (!issue) {
      sendResponse(res, {
      statusCode:404,
      success: false,
      message:`Issue with ID ${issueId} not found`    
    }); 
      return;
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      sendResponse(res, {
      statusCode:400,
      success: false,
      message:"No fields to update",      
    }); 
      return;
    }

    const result = await issueService.updateIssue(issueId, updates);
    sendResponse(res, {
      statusCode:200,
      success: true,
      message:"Issue updated successfully",
      data: result?.updatedIssue,
    }); 
    
  } catch (error: any) {
    sendResponse(res, {
      statusCode:500,
      success: false,
      message:error.message,
      error:error
    });  
  }
};


const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = parseInt(req.params.id as string);
    const userRole = req.user?.role;

    if (userRole !== 'maintainer') {
      sendResponse(res, {
        statusCode:403,
        success: false,
        message: "Only maintainers can delete issues"
      });
      return;
    }

    const result = await issueService.deleteIssue(issueId);

    if (!result.success) {
        sendResponse(res, {
        statusCode:404,
        success: false,
        message: result.message
      });
      return;
    }
    sendResponse(res,{
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error: any) {
    sendResponse(res,{
      statusCode: 500,
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