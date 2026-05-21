
export const role = ["contributor", "maintainer"] as const;
export type Role = typeof role[number];

export interface User {
  id: number;                
  name: string;              
  email: string;           
  password: string;          
  role: Role;            
  created_at: Date;          
  updated_at: Date;          
}

export type RUser = Omit<User, "id" | "created_at" | "updated_at" | "password"> & {
  role?: Role;
};

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


export type CreateIssue = Omit<Issue, "id" | "created_at" | "updated_at"> & {
  status?: IssueStatus; 
};