import { pool } from "../../db/index";
import type { CreateIssueRequest, GetIssuesQuery, IssueWithReporter, UpdateIssueRequest } from "../../types/index";

const createIssueIntoDB = async (reporterId: number, payload: CreateIssueRequest) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [title, description, type, "open", reporterId]
  );

  return result.rows[0];
};

const getAllIssues = async (queryParams: GetIssuesQuery) => {
  const { sort = "newest", type, status } = queryParams;

  let sqlQuery = `
    SELECT id, title, description, type, status, reporter_id, created_at, updated_at
    FROM issues WHERE 1=1
  `;

  const queryValues: any[] = [];
  let paramCounter = 1;

  if (type) {
    sqlQuery += ` AND type = $${paramCounter}`;
    queryValues.push(type);
    paramCounter++;
  }

  if (status) {
    sqlQuery += ` AND status = $${paramCounter}`;
    queryValues.push(status);
    paramCounter++;
  }

  sqlQuery += sort === "newest" ? " ORDER BY created_at DESC" : " ORDER BY created_at ASC";

  const issuesResult = await pool.query(sqlQuery, queryValues);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds]
  );

  const reporterMap = new Map();
  reportersResult.rows.forEach((reporter) => {
    reporterMap.set(reporter.id, {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role,
    });
  });

  const issuesWithReporter: IssueWithReporter[] = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterMap.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return issuesWithReporter;
};

const getSingleIssue = async (issueId: number): Promise<IssueWithReporter | null> => {
  const issueResult = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at
     FROM issues WHERE id = $1`,
    [issueId]
  );

  if (issueResult.rows.length === 0) return null;

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssue = async (issueId: number, updates: UpdateIssueRequest) => {
  const existingIssue = await pool.query(
    `SELECT id, title, status, reporter_id FROM issues WHERE id = $1`,
    [issueId]
  );

  if (existingIssue.rows.length === 0) return null;

  const result = await pool.query(
    `UPDATE issues 
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         status = COALESCE($4, status),
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [updates.title, updates.description, updates.type, updates.status, issueId]
  );

  return {
    updatedIssue: result.rows[0],
    existingIssue: existingIssue.rows[0],
  };
};

const deleteIssue = async (issueId: number) => {
  const existingIssue = await pool.query(
    `SELECT id, title, status, reporter_id FROM issues WHERE id = $1`,
    [issueId]
  );

  if (existingIssue.rows.length === 0) {
    return { success: false, message: "Issue not found" };
  }

  await pool.query(`DELETE FROM issues WHERE id = $1`, [issueId]);

  return {
    success: true,
    message: "Issue deleted successfully",
  };
};

export const issueService = {
  createIssueIntoDB,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};




