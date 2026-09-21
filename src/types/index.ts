export type UserRole = "hustler" | "owner";

export interface AppUser {
  id: string;
  role: UserRole;
  name: string;
  age: string;
  gender: string;
  email: string;
  createdAt: string;
}

export interface HustlerProfile {
  userId: string;
  occupation: string;
  field: string;
  designation: string;
  skills: string[];
  experience: string;
  services: string;
  bio: string;
  availability: string;
  expectedRate: string;
  /** "student" | "graduate" | "self-taught" — optional so old/skipped profiles stay valid. */
  educationStatus?: string;
  cgpa?: string;
  /** Just the file name — no real upload/storage backend yet (mock phase). */
  resumeFileName?: string;
}

export interface OwnerProfile {
  userId: string;
  companyName: string;
  industry: string;
  designation: string;
  description: string;
  website?: string;
  freelancerRequirements: string;
}

export interface RegisterInput {
  name: string;
  age: string;
  gender: string;
  email: string;
  password: string;
}

export type ProjectStatus = "active" | "pending" | "completed";

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface HustlerProject {
  id: string;
  userId: string;
  title: string;
  clientName: string;
  status: ProjectStatus;
  deadline?: string;
  budget?: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Manual 0–100 progress the Hustler sets themselves. */
  progress: number;
  milestones: ProjectMilestone[];
  createdAt: string;
}

export interface ProjectIdea {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: string;
}