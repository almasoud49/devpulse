import { pool } from "../../db/index";
import type { CreateIssueRequest, GetIssuesQuery, IssueWithReporter } from "../../types/index";

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

const getAllIssues = async (queryParams: GetIssuesQuery) => {
  const { sort = 'newest', type, status } = queryParams;
  
  let sqlQuery = `
    SELECT 
      id, 
      title, 
      description, 
      type, 
      status, 
      reporter_id, 
      created_at, 
      updated_at
    FROM issues
    WHERE 1=1
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
  
  if (sort === 'newest') {
    sqlQuery += ` ORDER BY created_at DESC`;
  } else if (sort === 'oldest') {
    sqlQuery += ` ORDER BY created_at ASC`;
  }
  
  const result = await pool.query(sqlQuery, queryValues);
  const issues = result.rows;
  
  if (issues.length === 0) {
    return [];
  }
  
  const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))];
  
  const reportersResult = await pool.query(`
    SELECT id, name, role 
    FROM users 
    WHERE id = ANY($1::int[])
  `, [reporterIds]);
  
  const reporterMap = new Map();
  reportersResult.rows.forEach((reporter: any) => {
    reporterMap.set(reporter.id, {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role
    });
  });
  
  const issuesWithReporter: IssueWithReporter[] = issues.map((issue: any) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    reporter: reporterMap.get(issue.reporter_id) || {
      id: issue.reporter_id,
      name: 'Unknown User',
      role: 'contributor'
    }
  }));
  
  return issuesWithReporter;
};

const getSingleIssue = async (issueId: number): Promise<IssueWithReporter | null> => {
  
  const issueResult = await pool.query(`
    SELECT 
      id, 
      title, 
      description, 
      type, 
      status, 
      reporter_id, 
      created_at, 
      updated_at
    FROM issues
    WHERE id = $1
  `, [issueId]);
  
  const issue = issueResult.rows[0];
  
  if (!issue) {
    return null;
  }
  
  const reporterResult = await pool.query(`
    SELECT id, name, role 
    FROM users 
    WHERE id = $1
  `, [issue.reporter_id]);
  
  const reporter = reporterResult.rows[0];
  
  const issueWithReporter: IssueWithReporter = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,    
    reporter: {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
  
  return issueWithReporter;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssues,
  getSingleIssue
}

