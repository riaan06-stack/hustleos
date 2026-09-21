"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppUser,
  HustlerProfile,
  HustlerProject,
  OwnerProfile,
  ProjectIdea,
  RegisterInput,
  UserRole,
} from "@/types";

/**
 * MOCK AUTH LAYER
 * -----------------------------------------------------------------------
 * This is a frontend-only, local stand-in for a real authentication
 * backend. Credentials are kept in a separate map from user profile data
 * (never merged into `AppUser`) so that swapping this store for real API
 * calls later does not require touching any UI component — every screen
 * only ever talks to the actions below (register/login/logout/save*).
 *
 * `hashPassword` is NOT cryptographically secure. It exists only so raw
 * passwords are never persisted verbatim in localStorage during local
 * development. Replace this entire file with real API calls when a
 * backend is introduced (see README.md).
 * -----------------------------------------------------------------------
 */

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `mock_${Math.abs(hash)}_${password.length}`;
}

interface AuthState {
  users: AppUser[];
  credentials: Record<string, string>;
  hustlerProfiles: Record<string, HustlerProfile>;
  ownerProfiles: Record<string, OwnerProfile>;
  hustlerProjects: Record<string, HustlerProject[]>;
  hustlerIdeas: Record<string, ProjectIdea[]>;
  currentUserId: string | null;
  pendingRole: UserRole | null;
  hasSeenIntro: boolean;

  setPendingRole: (role: UserRole) => void;
  markIntroSeen: () => void;
  register: (
    input: RegisterInput
  ) => { success: true } | { success: false; error: string };
  login: (
    email: string,
    password: string
  ) => { success: true } | { success: false; error: string };
  logout: () => void;
  saveHustlerProfile: (data: Omit<HustlerProfile, "userId">) => void;
  saveOwnerProfile: (data: Omit<OwnerProfile, "userId">) => void;
  clearHustlerProfile: () => void;
  clearOwnerProfile: () => void;
  addHustlerProject: (
    data: Omit<HustlerProject, "id" | "userId" | "createdAt">
  ) => void;
  updateHustlerProject: (
    id: string,
    data: Omit<HustlerProject, "id" | "userId" | "createdAt">
  ) => void;
  deleteHustlerProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  addHustlerIdea: (data: Omit<ProjectIdea, "id" | "userId" | "createdAt">) => void;
  deleteHustlerIdea: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      credentials: {},
      hustlerProfiles: {},
      ownerProfiles: {},
      hustlerProjects: {},
      hustlerIdeas: {},
      currentUserId: null,
      pendingRole: null,
      hasSeenIntro: false,

      setPendingRole: (role) => set({ pendingRole: role }),
      markIntroSeen: () => set({ hasSeenIntro: true }),

      register: (input) => {
        const { users, pendingRole } = get();
        const email = input.email.trim().toLowerCase();

        if (!pendingRole) {
          return { success: false, error: "Choose an account type first." };
        }
        if (users.some((u) => u.email.toLowerCase() === email)) {
          return {
            success: false,
            error: "An account with this email already exists.",
          };
        }

        const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const newUser: AppUser = {
          id,
          role: pendingRole,
          name: input.name.trim(),
          age: input.age,
          gender: input.gender,
          email,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
          credentials: {
            ...state.credentials,
            [email]: hashPassword(input.password),
          },
          currentUserId: id,
        }));

        return { success: true };
      },

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const { users, credentials } = get();
        const user = users.find((u) => u.email.toLowerCase() === normalized);

        if (!user) {
          return { success: false, error: "No account found with that email." };
        }
        if (credentials[normalized] !== hashPassword(password)) {
          return { success: false, error: "Incorrect password. Try again." };
        }

        set({ currentUserId: user.id });
        return { success: true };
      },

      logout: () => set({ currentUserId: null, pendingRole: null }),

      saveHustlerProfile: (data) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          hustlerProfiles: {
            ...state.hustlerProfiles,
            [currentUserId]: { userId: currentUserId, ...data },
          },
        }));
      },

      saveOwnerProfile: (data) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          ownerProfiles: {
            ...state.ownerProfiles,
            [currentUserId]: { userId: currentUserId, ...data },
          },
        }));
      },

      clearHustlerProfile: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => {
          const next = { ...state.hustlerProfiles };
          delete next[currentUserId];
          return { hustlerProfiles: next };
        });
      },

      clearOwnerProfile: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => {
          const next = { ...state.ownerProfiles };
          delete next[currentUserId];
          return { ownerProfiles: next };
        });
      },

      addHustlerProject: (data) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        const project: HustlerProject = {
          id: `project_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          userId: currentUserId,
          createdAt: new Date().toISOString(),
          ...data,
        };
        set((state) => ({
          hustlerProjects: {
            ...state.hustlerProjects,
            [currentUserId]: [...(state.hustlerProjects[currentUserId] ?? []), project],
          },
        }));
      },

      updateHustlerProject: (id, data) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          hustlerProjects: {
            ...state.hustlerProjects,
            [currentUserId]: (state.hustlerProjects[currentUserId] ?? []).map((p) =>
              p.id === id ? { ...p, ...data } : p
            ),
          },
        }));
      },

      deleteHustlerProject: (id) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          hustlerProjects: {
            ...state.hustlerProjects,
            [currentUserId]: (state.hustlerProjects[currentUserId] ?? []).filter(
              (p) => p.id !== id
            ),
          },
        }));
      },

      toggleProjectMilestone: (projectId, milestoneId) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          hustlerProjects: {
            ...state.hustlerProjects,
            [currentUserId]: (state.hustlerProjects[currentUserId] ?? []).map((p) =>
              p.id !== projectId
                ? p
                : {
                    ...p,
                    milestones: p.milestones.map((m) =>
                      m.id === milestoneId ? { ...m, completed: !m.completed } : m
                    ),
                  }
            ),
          },
        }));
      },

      addHustlerIdea: (data) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        const idea: ProjectIdea = {
          id: `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          userId: currentUserId,
          createdAt: new Date().toISOString(),
          ...data,
        };
        set((state) => ({
          hustlerIdeas: {
            ...state.hustlerIdeas,
            [currentUserId]: [...(state.hustlerIdeas[currentUserId] ?? []), idea],
          },
        }));
      },

      deleteHustlerIdea: (id) => {
        const { currentUserId } = get();
        if (!currentUserId) return;
        set((state) => ({
          hustlerIdeas: {
            ...state.hustlerIdeas,
            [currentUserId]: (state.hustlerIdeas[currentUserId] ?? []).filter(
              (i) => i.id !== id
            ),
          },
        }));
      },
    }),
    {
      name: "hustleos-auth",
      partialize: (state) => ({
        users: state.users,
        credentials: state.credentials,
        hustlerProfiles: state.hustlerProfiles,
        ownerProfiles: state.ownerProfiles,
        hustlerProjects: state.hustlerProjects,
        hustlerIdeas: state.hustlerIdeas,
        currentUserId: state.currentUserId,
        hasSeenIntro: state.hasSeenIntro,
      }),
    }
  )
);

export function useCurrentUser(): AppUser | null {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const users = useAuthStore((s) => s.users);
  return users.find((u) => u.id === currentUserId) ?? null;
}

export function useHustlerProfile(): HustlerProfile | null {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const profiles = useAuthStore((s) => s.hustlerProfiles);
  if (!currentUserId) return null;
  return profiles[currentUserId] ?? null;
}

export function useOwnerProfile(): OwnerProfile | null {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const profiles = useAuthStore((s) => s.ownerProfiles);
  if (!currentUserId) return null;
  return profiles[currentUserId] ?? null;
}

export function useHustlerProjects(): HustlerProject[] {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const projects = useAuthStore((s) => s.hustlerProjects);
  if (!currentUserId) return [];
  return projects[currentUserId] ?? [];
}

export function useHustlerIdeas(): ProjectIdea[] {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const ideas = useAuthStore((s) => s.hustlerIdeas);
  if (!currentUserId) return [];
  return ideas[currentUserId] ?? [];
}