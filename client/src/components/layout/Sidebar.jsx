
import React, { useState, useEffect } from "react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { LaxmayaLogoText } from "../common/HLetterLogo.jsx";

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
  Wallet,
  Receipt,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

// =====================================================
// ROLE NAVIGATION CONFIGURATION
// =====================================================

const navConfig = {
  admin: [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Employee Directory",
      path: "/admin/employees",
      icon: Users,
    },
    {
      label: "All Attendance",
      path: "/admin/attendance",
      icon: Clock,
    },
    {
      label: "Time Off Approvals",
      path: "/admin/approvals",
      icon: CalendarDays,
    },
    {
      label: "Reports & Analytics",
      path: "/admin/reports",
      icon: DollarSign,
    },
    {
      label: "My Profile",
      path: "/admin/profile",
      icon: UserCircle,
    },
  ],

  employee: [
    {
      label: "Dashboard",
      path: "/employee",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Attendance",
      path: "/employee/attendance",
      icon: Clock,
    },
    {
      label: "My Time Off",
      path: "/employee/timeoff",
      icon: CalendarDays,
    },
    {
      label: "My Payslips",
      path: "/employee/Payslips",
      icon: DollarSign,
    },
    {
      label: "My Profile",
      path: "/employee/profile",
      icon: UserCircle,
    },
  ],

  superadmin: [
    {
      label: "Dashboard",
      path: "/superadmin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Employee Management",
      path: "/superadmin/employees",
      icon: Users,
    },
    {
      label: "Attendance & Time",
      path: "/superadmin/attendance",
      icon: Clock,
    },
    {
      label: "Workflow & Approvals",
      path: "/superadmin/approvals",
      icon: Workflow,
    },
    {
      label: "Profile",
      path: "/superadmin/profile",
      icon: UserCircle,
    },
  ],

  manager: [
    {
      label: "Dashboard",
      path: "/manager",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Team & Reports",
      path: "/manager/teamdetail",
      icon: Users2,
    },
    {
      label: "Attendance & Time",
      path: "/manager/attendance",
      icon: Clock,
    },
    {
      label: "Profile",
      path: "/manager/profile",
      icon: UserCircle,
    },
  ],

  financeadmin: [
    {
      label: "Dashboard",
      path: "/financeadmin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Payroll Management",
      path: "/financeadmin/payroll",
      icon: Wallet,
    },
    {
      label: "Employee Compensation",
      path: "/financeadmin/compensation",
      icon: DollarSign,
    },
    {
      label: "Payment History",
      path: "/financeadmin/payment-history",
      icon: Receipt,
    },
    {
      label: "Profile",
      path: "/financeadmin/profile",
      icon: UserCircle,
    },
  ],
};

// =====================================================
// ROLE LABELS
// =====================================================

const roleLabels = {
  admin: "Admin Operations",
  employee: "Employee Workspace",
  superadmin: "Super Admin Console",
  manager: "Manager Workspace",
  financeadmin: "Finance Workspace",
};

// =====================================================
// ROLE BADGE STYLES
// =====================================================

const roleBadgeStyles = {
  admin:
    "bg-[#3881A6] text-white border-2 border-[#3881A6]",

  employee:
    "bg-[#EAF3F9] text-[#204A65] border-2 border-[#C3D8E6]",

  superadmin:
    "bg-[#204A65] text-white border-2 border-[#204A65]",

  manager:
    "bg-[#3881A6] text-white border-2 border-[#3881A6]",

  financeadmin:
    "bg-[#C3D8E6] text-[#204A65] border-2 border-[#C3D8E6]",
};

// =====================================================
// ROLE DESIGNATION FALLBACK
// =====================================================

const roleDesignationFallback = {
  admin: "HR Admin",
  employee: "Employee",
  superadmin: "Super Admin",
  manager: "Manager",
  financeadmin: "Finance Admin",
};

// =====================================================
// ROLE NORMALIZATION
// =====================================================

const normalizeRole = (value) =>
  String(value || "")
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

// =====================================================
// SIDEBAR COMPONENT
// =====================================================

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // ===================================================
  // DESKTOP SIDEBAR -> MAIN CONTENT ALIGNMENT
  // ===================================================

  useEffect(() => {
    const applyMargin = () => {
      const mainContent =
        document.getElementById("main-content");

      if (!mainContent) return;

      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop) {
        mainContent.style.marginLeft = isCollapsed
          ? "5rem"
          : "18rem";
      } else {
        mainContent.style.marginLeft = "0";
      }
    };

    applyMargin();

    window.addEventListener("resize", applyMargin);

    return () => {
      window.removeEventListener("resize", applyMargin);
    };
  }, [isCollapsed]);

  // ===================================================
  // MOBILE SIDEBAR OPEN
  // ===================================================

  useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen]);

  // ===================================================
  // ROLE DETECTION
  // ===================================================

  const currentPath = location.pathname.toLowerCase();

  const getRoleFromPath = (path) => {
    if (path.startsWith("/superadmin")) {
      return "superadmin";
    }

    if (path.startsWith("/financeadmin")) {
      return "financeadmin";
    }

    if (path.startsWith("/manager")) {
      return "manager";
    }

    if (path.startsWith("/admin")) {
      return "admin";
    }

    if (path.startsWith("/employee")) {
      return "employee";
    }

    return null;
  };

  const activeRole =
    getRoleFromPath(currentPath) ||
    roleMap[normalizeRole(user?.role)] ||
    "employee";

  // ===================================================
  // ROLE BASED DATA
  // ===================================================

  const role = activeRole;

  const navItems =
    navConfig[role] || navConfig.employee;

  const subtitle =
    roleLabels[role] || "Workspace";

  const badgeStyle =
    roleBadgeStyles[role] ||
    roleBadgeStyles.employee;

  const designationFallback =
    roleDesignationFallback[role] ||
    "Team Member";

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    await logout();

    toast.info("Logged out of Laxmaya");

    navigate("/login");
  };

  // ===================================================
  // CLOSE AND COLLAPSE
  // ===================================================

  const handleCloseAndCollapse = () => {
    onClose?.();

    setIsCollapsed(true);
  };

  // ===================================================
  // RETURN UI
  // ===================================================

  return (
    <>
      {/* ===========================================
          MOBILE OVERLAY
      =========================================== */}

      {isOpen && (
        <div
          onClick={handleCloseAndCollapse}
          className="
            fixed inset-0
            bg-[#204A65]/80
            z-40
            lg:hidden
          "
        />
      )}

      {/* ===========================================
          SIDEBAR
      =========================================== */}

      <aside
        className={`
          fixed
          top-0
          bottom-0
          left-0
          z-50

          bg-[#204A65]

          border-r-2
          border-[#C3D8E6]

          flex
          flex-col
          justify-between

          transition-all
          duration-300
          ease-in-out

          w-[270px]
          max-w-[85vw]

          lg:translate-x-0

          ${isCollapsed
            ? "lg:w-20"
            : "lg:w-72"
          }

          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* =========================================
            TOP SECTION
        ========================================= */}

        <div>
          {/* =======================================
              HEADER
          ======================================= */}

          <div
            className={`
              border-b-2
              border-[#C3D8E6]
              bg-[#204A65]

              flex
              items-center

              h-[66px]

              ${isCollapsed
                ? "justify-center"
                : "justify-between px-5"
              }
            `}
          >
            {isCollapsed ? (
              /* ===================================
                 COLLAPSED HEADER
              =================================== */

              <button
                type="button"
                onClick={() => {
                  onClose?.();

                  setIsCollapsed(false);
                }}
                className="
                  relative
                  w-10
                  h-10

                  flex
                  items-center
                  justify-center

                  rounded-xl

                  hover:bg-slate-100
                  dark:hover:bg-slate-800

                  transition-all
                  duration-200

                  group
                "
                title="Open Sidebar"
                aria-label="Open Sidebar"
              >
                <span
                  className="
                    absolute
                    inset-0

                    flex
                    items-center
                    justify-center

                    opacity-100
                    group-hover:opacity-0

                    transition-opacity
                    duration-200

                    pointer-events-none
                  "
                >
                  <LaxmayaLogoText size={20} />
                </span>

                <span
                  className="
                    absolute
                    inset-0

                    flex
                    items-center
                    justify-center

                    opacity-0
                    group-hover:opacity-100

                    transition-opacity
                    duration-200

                    pointer-events-none
                  "
                >
                  <PanelLeftOpen
                    className="
                      w-6
                      h-6
                      text-slate-600
                      dark:text-slate-300
                    "
                  />
                </span>
              </button>
            ) : (
              /* ===================================
                 EXPANDED HEADER
              =================================== */

              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="
                          text-3xl
                          font-black
                          tracking-tight
                          text-slate-900
                          dark:text-black
                          font-display
                        "
                      >
                        <LaxmayaLogoText size={42} />
                      </span>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          px-2
                          py-0.5

                          rounded-md

                          bg-[#3881A6]
                          text-white

                          dark:text-rose-300

                          uppercase
                          tracking-wider
                        "
                      >
                        HRMS
                      </span>
                    </div>

                    {/* DYNAMIC ROLE LABEL */}

                    <p
                      className="
                        text-[11px]
                        text-slate-500
                        dark:text-slate-400
                        font-medium
                      "
                    >
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* DESKTOP COLLAPSE */}

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="
                    hidden
                    lg:flex

                    text-[#C3D8E6]
                    hover:text-white
                  "
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-4.5 h-4.5" />
                </button>

                {/* MOBILE CLOSE */}

                <button
                  type="button"
                  onClick={handleCloseAndCollapse}
                  className="
                    lg:hidden

                    text-[#C3D8E6]
                    hover:text-white
                  "
                  title="Close Sidebar"
                  aria-label="Close Sidebar"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </>
            )}
          </div>

          {/* =======================================
              NAVIGATION
          ======================================= */}

          <nav
            className={`
              ${isCollapsed
                ? "p-2.5"
                : "p-3"
              }

              space-y-1
            `}
          >
            {/* NAVIGATION TITLE */}

            {!isCollapsed && (
              <div
                className="
                  px-2.5
                  py-1.5

                  text-[9px]
                  font-black

                  text-[#C3D8E6]

                  uppercase
                  tracking-wider
                "
              >
                Navigation
              </div>
            )}

            {/* DYNAMIC ROLE NAVIGATION */}

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => onClose?.()}
                  title={
                    isCollapsed
                      ? item.label
                      : undefined
                  }
                  className={({ isActive }) =>
                    `
                      flex
                      items-center

                      ${isCollapsed
                      ? "justify-center px-2"
                      : "justify-between px-3"
                    }

                      py-2.5

                      text-[12px]
                      font-bold

                      transition-none

                      ${isActive
                      ? "bg-[#3881A6] text-white border-l-4 border-white"
                      : "text-[#C3D8E6] hover:bg-[#3881A6]/50 hover:text-white border-l-4 border-transparent"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`
                          flex
                          items-center

                          ${isCollapsed
                            ? "justify-center"
                            : "gap-2.5"
                          }
                        `}
                      >
                        <Icon
                          className={`
                            w-4
                            h-4
                            shrink-0

                            ${isActive
                              ? "text-white"
                              : "text-[#C3D8E6]"
                            }
                          `}
                        />

                        {!isCollapsed && (
                          <span className="whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && isActive && (
                        <ChevronRight
                          className="
                            w-3.5
                            h-3.5

                            text-white
                            shrink-0
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* =========================================
            BOTTOM USER SECTION
        ========================================= */}

        <div
          className={`
            border-t-2
            border-[#C3D8E6]

            bg-[#204A65]

            ${isCollapsed
              ? "p-2.5"
              : "p-3"
            }
          `}
        >
          {/* =======================================
              USER CARD
          ======================================= */}

          <div
            className={`
              bg-[#EAF3F9]

              border-2
              border-[#C3D8E6]

              flex
              items-center

              ${isCollapsed
                ? "justify-center p-1.5"
                : "justify-between p-2.5 mb-2.5"
              }
            `}
          >
            <div
              className={`
                flex
                items-center

                ${isCollapsed
                  ? "justify-center"
                  : "gap-2.5 min-w-0"
                }
              `}
            >
              {/* AVATAR */}

              <div
                className="
                  w-8
                  h-8

                  rounded-full
                  overflow-hidden

                  border-2
                  border-[#204A65]

                  shrink-0

                  bg-[#C3D8E6]

                  flex
                  items-center
                  justify-center
                "
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || "User"}
                    className="
                      w-full
                      h-full
                      object-cover
                      scale-[1.35]
                    "
                  />
                ) : (
                  <UserCircle
                    className="
                      w-4.5
                      h-4.5
                      text-[#204A65]
                    "
                  />
                )}
              </div>

              {/* USER DETAILS */}

              {!isCollapsed && (
                <div className="truncate min-w-0">
                  <div
                    className="
                      text-[10px]
                      font-black
                      text-[#204A65]
                      truncate
                    "
                  >
                    {user?.name || "User"}
                  </div>

                  <div
                    className="
                      text-[9px]
                      font-bold
                      text-[#3881A6]
                      truncate
                    "
                  >
                    {user?.designation ||
                      designationFallback}
                  </div>
                </div>
              )}
            </div>

            {/* ROLE BADGE */}

            {!isCollapsed && (
              <span
                className={`
                  shrink-0

                  text-[8px]
                  font-bold

                  px-1.5
                  py-0.5

                  uppercase

                  ${badgeStyle}
                `}
              >
                {user?.role || role}
              </span>
            )}
          </div>

          {/* =======================================
              LOGOUT BUTTON
          ======================================= */}

          <button
            type="button"
            onClick={handleLogout}
            title={
              isCollapsed
                ? "Sign Out"
                : undefined
            }
            aria-label="Sign Out"
            className={`
              w-full

              py-2
              px-2.5

              bg-[#EAF3F9]

              border-2
              border-[#C3D8E6]

              text-[#204A65]

              hover:bg-[#3881A6]
              hover:text-white
              hover:border-[#3881A6]

              text-[10px]
              font-black

              flex
              items-center

              ${isCollapsed
                ? "justify-center"
                : "justify-center gap-1.5"
              }

              transition-none
            `}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />

            {!isCollapsed && (
              <span>Sign Out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;