export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserRequest {
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  driverId?: number;
}

export interface UserLog {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  action: string;
  createdAt: string;
}

export interface Role {
  id: number;
  roleName: string;
  description?: string;
  userCount?: number;
}