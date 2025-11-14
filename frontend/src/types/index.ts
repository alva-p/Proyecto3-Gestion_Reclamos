export type UserRole = 'cliente' | 'empleado' | 'administrador';

export type ClaimStatus = 
  | 'enviado' 
  | 'en_revision' 
  | 'asignado' 
  | 'en_proceso' 
  | 'solucionado' 
  | 'cerrado' 
  | 'cancelado';

export type ClaimPriority = 'baja' | 'media' | 'alta' | 'critica';

export type ClaimType = 
  | 'error' 
  | 'mejora' 
  | 'consulta' 
  | 'incidente' 
  | 'otro';

export type ProjectType = 
  | 'software' 
  | 'marketing' 
  | 'consultoria' 
  | 'soporte' 
  | 'otro';

export type RegistrationStatus = 'pendiente' | 'registrado' | 'rechazado';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  phone?: string;
  address?: string;
  area?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  description: string;
  clientId: string;
  createdAt: Date;
}

export interface Claim {
  id: string;
  number: string;
  title: string;
  description: string;
  type: ClaimType;
  priority: ClaimPriority;
  criticality: ClaimPriority;
  status: ClaimStatus;
  projectId: string;
  clientId: string;
  assignedTo?: string;
  assignedArea?: string;
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  ratingComment?: string;
}

export interface ClaimHistory {
  id: string;
  claimId: string;
  action: string;
  status?: ClaimStatus;
  previousStatus?: ClaimStatus;
  assignedTo?: string;
  assignedArea?: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: RegistrationStatus;
  createdAt: Date;
  processedAt?: Date;
  processedBy?: string;
}
