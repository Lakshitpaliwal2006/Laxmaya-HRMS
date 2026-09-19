
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Table as TableIcon } from 'lucide-react';
import PayrollOverview from './PayrollOverview';
import PayrollRecords from './PayrollRecords';

const PayrollManagementPage = () => {
  return (
    <div className=" min-h-screen bg-[#EAF3F9] p-3 sm:p-4 lg:p-5 xl:p-6 space-y-4 font-sans">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Payroll & Compensation
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage organization payroll, generate monthly payslips, and adjust statutory components.
        </p>
      </div>

      {/* Navbar - 2 options */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 w-fit">
        <NavLink
          to="overview"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r bg-[#153B50] border-2 border-[#153B50] rounded-xl text-white shadow-glow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }   
        > 
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </NavLink>

        <NavLink
          to="records"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r bg-[#153B50] border-2 border-[#153B50] rounded-xl text-white shadow-glow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <TableIcon className="w-4 h-4 " />
          Payroll Records
        </NavLink>
      </div>

      {/* Nested Routes - jab pehla option select hoga to Overview, second pe Records */}
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<PayrollOverview />} />
        <Route path="records" element={<PayrollRecords />} />
      </Routes>
    </div>
  );
};

export default PayrollManagementPage;