import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Compass,
  FolderKanban,
  BookImage,
  CalendarDays,
  Wallet,
  User,
  Users,
  FilePlus2,
  MessageSquare,
  BarChart3,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  /** Shown in the mobile bottom bar (keep this list short). */
  primary?: boolean;
}

export const hustlerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/hustler", icon: LayoutDashboard, primary: true },
  { label: "Discover Work", href: "/dashboard/hustler", icon: Compass, disabled: true, primary: true },
  { label: "My Projects", href: "/projects/hustler", icon: FolderKanban, primary: true },
  { label: "Portfolio", href: "/dashboard/hustler", icon: BookImage, disabled: true, primary: true },
  { label: "Calendar", href: "/dashboard/hustler", icon: CalendarDays, disabled: true },
  { label: "Income", href: "/dashboard/hustler", icon: Wallet, disabled: true },
  { label: "Profile", href: "/profile/hustler", icon: User, primary: true },
];

export const ownerNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard, primary: true },
  { label: "Find Hustlers", href: "/dashboard/owner", icon: Users, disabled: true, primary: true },
  { label: "Post a Project", href: "/dashboard/owner", icon: FilePlus2, disabled: true, primary: true },
  { label: "My Projects", href: "/dashboard/owner", icon: FolderKanban, disabled: true },
  { label: "Applications", href: "/dashboard/owner", icon: BarChart3, disabled: true },
  { label: "Messages", href: "/dashboard/owner", icon: MessageSquare, disabled: true, primary: true },
  { label: "Profile", href: "/profile/owner", icon: User, primary: true },
];