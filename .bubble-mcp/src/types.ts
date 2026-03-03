// Bubble API Types based on /meta endpoint

export interface BubbleField {
  id: string;
  display: string;
  type: string;
}

export interface BubbleDataType {
  display: string;
  fields: BubbleField[];
}

export interface BubbleEndpointParameter {
  key: string;
  value: string;
  optional: boolean;
  param_in: 'body' | 'query';
}

export interface BubbleEndpoint {
  endpoint: string;
  parameters: BubbleEndpointParameter[];
  method: 'get' | 'post';
  auth_unecessary: boolean;
  return_btype: Record<string, string>;
}

export interface BubbleSchema {
  get: string[];
  post: BubbleEndpoint[];
  types: Record<string, BubbleDataType>;
  app_data: {
    appname: string;
    favicon: string;
    app_version: string;
    use_captions_for_get: boolean;
    domain: string;
  };
}

// Data type interfaces based on BCR schema
export interface Organization {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  email_address?: string;
  phone_number?: string;
  chain?: boolean;
  branches?: string[]; // list of branch IDs
  contacts?: string[]; // list of contact IDs
  status?: string;
  [key: string]: any;
}

export interface Branch {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  duration?: number;
  monthly_recurring?: boolean;
  status?: string;
  [key: string]: any;
}

export interface Form {
  _id: string;
  name: string;
  branch?: string;
  customer?: string;
  date?: Date;
  status?: string;
  state?: string;
  total_score?: number;
  [key: string]: any;
}

export interface User {
  _id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  branches?: string[];
  [key: string]: any;
}
