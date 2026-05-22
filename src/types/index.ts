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


export const issueTypes = ["bug", "feature"] as const;
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
