import { pool } from "../../db/index";
import type { CreateIssueRequest } from "../../types/index";

const createIssueIntoDB = async (
  reporterId: number,
  payload: CreateIssueRequest
) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING 
       id, 
       title, 
       description, 
       type, 
       status, 
       reporter_id, 
       created_at, 
       updated_at`,
    [title, description, type, "open", reporterId]
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
};