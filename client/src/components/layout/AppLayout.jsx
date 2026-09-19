import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import EmployeeContextBanner from "../admin/EmployeeContextBanner";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const hideTopbar = location.pathname.startsWith("/admin/payroll");

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-slate-100
        flex
        selection:bg-brand-500
        selection:text-white
        transition-colors
        duration-200
        overflow-x-hidden
      "
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="
            absolute
            -top-28
            right-1/4
            w-[320px]
            sm:w-[450px]
            h-[320px]
            sm:h-[450px]
            bg-brand-500/5
            dark:bg-brand-600/10
            rounded-full
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            -bottom-28
            left-1/3
            w-[320px]
            sm:w-[450px]
            h-[320px]
            sm:h-[450px]
            bg-indigo-500/5
            dark:bg-indigo-600/10
            rounded-full
            blur-[110px]
          "
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div
        id="main-content"
        className="
          flex-1
          flex
          flex-col
          min-w-0
          relative
          z-10
          transition-[margin-left]
          duration-300
          ease-in-out
        "
      >
        {!hideTopbar && (
          <Topbar
            onMenuClick={() => setSidebarOpen(true)}
          />
        )}

        <EmployeeContextBanner />

        {/* Compact Page Container */}
        <main
          className="
            flex-1
            w-full
            min-w-0
            px-3
            py-3
            sm:px-5
            sm:py-5
            lg:px-6
            lg:py-6
          "
        >
          <div
            className="
              w-full
              max-w-[1440px]
              mx-auto
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;