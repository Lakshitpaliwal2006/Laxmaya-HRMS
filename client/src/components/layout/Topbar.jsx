import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Shield, User, Users, Wallet, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { format } from 'date-fns';
import AdminEmployeeSwitcher from '../admin/AdminEmployeeSwitcher';

const roleBasePath = {
  admin: '/admin',
  employee: '/employee',
  superadmin: '/superadmin',
  manager: '/manager',
  financeadmin: '/finance',
};

const roleBadgeConfig = {
  admin: { icon: Shield, label: 'HR admin', color: 'text-amber-500' },
  employee: { icon: User, label: 'Employee', color: 'text-indigo-500' },
  superadmin: { icon: Shield, label: 'Super Admin', color: 'text-rose-500' },
  manager: { icon: Users, label: 'Manager', color: 'text-sky-500' },
  financeadmin: { icon: Wallet, label: 'Finance Admin', color: 'text-emerald-500' },
};

const Topbar = ({ onMenuClick }) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;

    // Specific paths pehle check karo
    if (path === '/superadmin/approvals') return 'Workflow & Approvals';
    if (path === '/manager/team') return 'My Team';
    if (path === '/manager/reports') return 'Team Report';
    if (path === '/finance/compensation') return 'Employee Compensation';
    if (path === '/finance/reports') return 'Payment & Financial Reports';
    if (path === '/superadmin/employees') return 'Employee Management';

    if (path.includes('/employee-view')) return 'Employee Context Inspection';
    if (['/admin', '/employee', '/superadmin', '/manager', '/finance'].includes(path)) return 'Dashboard Overview';
    if (path.includes('/employees')) return 'Employee Directory & Onboarding';
    if (path.includes('/attendance')) return isAdmin || isSuperAdmin ? 'Company Attendance Feed' : 'My Daily Attendance';
    if (path.includes('/leaves')) return isAdmin ? 'Leave Management & Approvals' : 'Time Off & Leave Portal';
    if (path.includes('/payroll') || path.includes('/salary')) return isAdmin ? 'Payroll Management' : 'My Monthly Payslips';
    if (path.includes('/profile')) return 'My Personal & Work Profile';
    return 'Laxmaya Portal';
  };

  const role = user?.role || 'employee';

  const profilePaths = {
    admin: '/admin/profile',
    employee: '/employee/profile',
    superadmin: '/superadmin/profile',
    manager: '/manager/profile',
    financeadmin: '/financeadmin/profile',
  };

  const profilePath = profilePaths[role] || '/employee/profile';

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Laxmaya</span>
            <span>•</span>
            <span className="capitalize font-medium">{user?.role} Workspace</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5">
        {(isAdmin || isSuperAdmin) && <AdminEmployeeSwitcher />}

        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
          <span>{format(currentTime, 'EEE, dd MMM • HH:mm:ss')}</span>
        </div>

        {/* <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center shadow-sm"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 animate-in fade-in" />
          )}
        </button> */}

        {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
          <BadgeIcon className={`w-3.5 h-3.5 ${badgeConfig.color}`} />
          <span className="capitalize">{badgeConfig.label}</span>
        </div> */}

        {/* <Link
          to={profilePath}
          className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all group"
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
              {user?.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{user?.department}</div>
          </div>
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-xl object-cover border border-slate-300 dark:border-slate-700 group-hover:border-brand-500 transition-colors shrink-0"
          />
        </Link> */}
      </div>
    </header>
  );
};

export default Topbar;