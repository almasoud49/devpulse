export const USER_ROLE = {
  contributor: 'contributor',
  maintainer: 'maintainer',
} as const;

export type ROLES = typeof USER_ROLE[keyof typeof USER_ROLE];

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: ROLES;
  open?: boolean;
  created_at: Date;
  updated_at: Date;
}

export type UserCredentials = {
        email: string, 
        password: string
      }

export const issueTypes = ["bug", "feature_request"] as const;
export type IssueType = typeof issueTypes[number];

export const issueStatuses = ["open", "in_progress", "resolved"] as const;
export type IssueStatus = typeof issueStatuses[number];

export interface Issue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  type: IssueType;
}

export interface GetIssuesQuery {
  sort?: 'newest' | 'oldest';
  type?: IssueType;
  status?: IssueStatus;
}

export interface ReporterInfo {
  id: number;
  name: string;
  role: ROLES;
}

export interface IssueWithReporter extends Omit<Issue, 'reporter_id'> {
  reporter: ReporterInfo;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
}