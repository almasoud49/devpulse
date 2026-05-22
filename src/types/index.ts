export const USER_ROLE = {
  CONTRIBUTOR: 'contributor',
  MAINTAINER: 'maintainer',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export interface User {
  id: number;                
  name: string;              
  email: string;           
  password: string;          
  role: UserRole;            
  created_at: Date;          
  updated_at: Date;          
}

export type RUser = Omit<User, "id" | "created_at" | "updated_at" | "password"> & {
  role?: UserRole;
};


export const issueTypes = ["bug", "feature_request"] as const;
export type IssueType = typeof issueTypes[number];

export const issueStatuses = ["open", "in_progress", "closed"] as const;
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
  role: UserRole;
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