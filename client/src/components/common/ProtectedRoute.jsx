
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-slate-900 flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-3">
  //         <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>

  //         <span className="text-sm text-slate-400 font-medium">
  //           Authenticating Laxmaya session...
  //         </span>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <Navigate
  //       to="/login"
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }

  // const roleMap = {
  //   admin: "admin",
  //   employee: "employee",
  //   super_admin: "superadmin",
  //   superadmin: "superadmin",
  //   manager: "manager",
  //   finance_admin: "financeadmin",
  //   financeadmin: "financeadmin",
  // };

  // const rawRole = user?.role?.toLowerCase();
  // const role = roleMap[rawRole] || rawRole;

  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   const dashboardRoutes = {
  //     superadmin: "/superadmin",
  //     admin: "/admin",
  //     manager: "/manager",
  //     financeadmin: "/finance",
  //     employee: "/employee",
  //   };

  //   return (
  //     <Navigate
  //       to={dashboardRoutes[role] || "/login"}
  //       replace
  //     />
  //   );
  // }

  return <Outlet />;
};

export default ProtectedRoute;