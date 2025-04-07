export interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface IUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
