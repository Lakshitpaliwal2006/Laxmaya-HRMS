import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Users2,
  Clock,
  CalendarDays,
  DollarSign,
  UserCircle,
  LogOut,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Workflow,
  FileBarChart2,
  Wallet,
  Receipt,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { LaxmayaLogoText } from "../common/HLetterLogo";

// Role -> nav items mapping
const navConfig = {
  admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Employee Directory", path: "/admin/employees", icon: Users },
    { label: "All Attendance", path: "/admin/attendance", icon: Clock },
    { label: "Time Off Approvals", path: "/admin/approvals", icon: CalendarDays },
    { label: "Reports & analytics", path: "/admin/reports", icon: DollarSign },
    { label: "My Profile", path: "/admin/profile", icon: UserCircle },
  ],
  employee: [
    { label: "Dashboard", path: "/employee", icon: LayoutDashboard, exact: true },
    { label: "My Attendance", path: "/employee/attendance", icon: Clock },
    { label: "My Time Off", path: "/employee/timeoff", icon: CalendarDays },
    { label: "My Payslips", path: "/employee/Payslips", icon: DollarSign },
    { label: "My Profile", path: "/employee/profile", icon: UserCircle },
  ],
  superadmin: [
    { label: "Dashboard", path: "/superadmin", icon: LayoutDashboard, exact: true },
    { label: "Employee Management", path: "/superadmin/employees", icon: Users },
    { label: "Attendance & Time", path: "/superadmin/attendance", icon: Clock },
    { label: "Workflow & Approvals", path: "/superadmin/approvals", icon: Workflow },
    { label: "Profile", path: "/superadmin/profile", icon: UserCircle },
  ],
  manager: [
    { label: "Dashboard", path: "/manager", icon: LayoutDashboard, exact: true },
    { label: "My Team & reports", path: "/manager/teamdetail", icon: Users2 },
    { label: "Attendance & Time", path: "/manager/attendance", icon: Clock },
    { label: "Profile", path: "/manager/profile", icon: UserCircle },
  ],
  financeadmin: [
    { label: "Dashboard", path: "/financeadmin", icon: LayoutDashboard, exact: true },
    { label: "Payroll Management", path: "/financeadmin/payroll", icon: Wallet },
    { label: "Employee Compensation", path: "/financeadmin/compensation", icon: DollarSign },
    { label: "Payment History", path: "/financeadmin/payment-history", icon: Receipt },
    { label: "Profile", path: "/financeadmin/profile", icon: UserCircle },
  ],
};

const roleLabels = {
  admin: "Admin Operations",
  employee: "Employee Workspace",
  superadmin: "Super Admin Console",
  manager: "Manager Workspace",
  financeadmin: "Finance Workspace",
};

const roleBadgeStyles = {
  admin: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20",
  employee: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20",
  superadmin: "bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20",
  manager: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20",
  financeadmin: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20",
};

const roleDesignationFallback = {
  admin: "HR Admin",
  employee: "Employee",
  superadmin: "Super Admin",
  manager: "Manager",
  financeadmin: "Finance Admin",
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);


  const currentPath = location.pathname.toLowerCase();

  let activeRole = "";

  if (currentPath.startsWith("/superadmin")) {
    activeRole = "superadmin";
  } else if (currentPath.startsWith("/financeadmin")) {
    activeRole = "financeadmin";
  } else if (currentPath.startsWith("/manager")) {
    activeRole = "manager";
  } else if (currentPath.startsWith("/admin")) {
    activeRole = "admin";
  } else if (currentPath.startsWith("/employee")) {
    activeRole = "employee";
  } else {
    // Agar path kisi role route se start nahi hota, to user.role fallback use karein
    const rawRole = String(user?.role || "")
      .trim()
      .toLowerCase()
      .replace(/[-_ ]/g, "");

    const roleMap = {
      admin: "admin",
      employee: "employee",
      superadmin: "superadmin",
      manager: "manager",
      financeadmin: "financeadmin",
    };

    activeRole = roleMap[rawRole] || "employee";
  }


  const handleLogout = async () => {
    await logout();
    toast.info("Logged out of Laxmaya");
    navigate("/login");
  };

  // Improved Role Normalization Logic
  const role = activeRole;
  const navItems = navConfig[role] || navConfig.employee;
  const subtitle = roleLabels[role] || "Workspace";
  const badgeStyle = roleBadgeStyles[role] || roleBadgeStyles.employee;
  const designationFallback = roleDesignationFallback[role] || "Team Member";

  return (
    <>
      
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}


      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          bg-white/95 dark:bg-slate-900/95
          border-r border-slate-200 dark:border-slate-800/80
          flex flex-col justify-between
          transition-all duration-300 ease-in-out
          w-72
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* HEADER / BRANDING */}
          <div
            className={`
              border-b border-slate-200 dark:border-slate-800/60
              flex items-center
              ${isCollapsed ? "justify-center p-4" : "justify-between p-6"}
            `}
          >
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  setIsCollapsed(false);
                }}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
                title="Open Sidebar"
                aria-label="Open Sidebar"
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
                  <LaxmayaLogoText size={20} />
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <PanelLeftOpen className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </span>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-black font-display">
                        <LaxmayaLogoText size={42} />
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                        HRMS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="hidden lg:flex shrink-0 items-center justify-center p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden shrink-0 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* NAVIGATION */}
          <nav className={`${isCollapsed ? "p-3" : "p-4"} space-y-1.5`}>
            {!isCollapsed && (
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Navigation
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => onClose?.()}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-3.5"} py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                      ? "bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${isActive
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                            }`}
                        />
                        {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                      </div>
                      {!isCollapsed && isActive && <ChevronRight className="w-4 h-4 text-white/70 shrink-0" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER SECTION */}
        <div className={`border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 ${isCollapsed ? "p-3" : "p-4"}`}>
          <div
            className={`rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center ${isCollapsed ? "justify-center p-2" : "justify-between p-3 mb-3"
              }`}
          >
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 min-w-0"}`}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || "User"}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <UserCircle className="w-5 h-5 text-slate-500" />
                </div>
              )}

              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.designation || designationFallback}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${badgeStyle}`}>
                {user?.role}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            aria-label="Sign Out"
            className={`w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-semibold flex items-center ${isCollapsed ? "justify-center" : "justify-center gap-2"
              } transition-all group shadow-sm`}
          >
            <LogOut className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;