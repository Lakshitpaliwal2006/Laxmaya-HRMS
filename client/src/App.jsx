import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { EmployeeInspectionProvider } from './context/EmployeeInspectionContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDirectoryPage from './pages/admin/EmployeeDirectoryPage';
import AllAttendancePage from './pages/admin/AllAttendancePage';
import LeaveApprovalPage from './pages/admin/LeaveApprovalPage';
import EmployeeContextView from './pages/admin/EmployeeContextView';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyAttendancePage from './pages/employee/MyAttendancePage';
import MyLeavesPage from './pages/employee/MyLeavesPage';
import MySalaryPage from './pages/employee/MySalaryPage';
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard.jsx"
import FinanceAdminDashboard from './pages/financeadmin/FinanceAdminDashboard.jsx';
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import EmployeeCompensation from "./pages/financeadmin/EmployeeCompensation.jsx";
import PaymentHistory from './pages/financeadmin/PaymentHistory.jsx';
import WorkflowApprovals from "./pages/superadmin/WorkFlowApprovals.jsx"
import AdminProfile from "./pages/superadmin/AdminProfile.jsx"
import FinanceProfile from "./pages/financeadmin/FinanceProfile.jsx"
// import ReportsPage from "./pages/manager/ReportsPage.jsx";
import ManagerProfile from "./pages/manager/ManagerProfile.jsx";
import TeamAndReportsPage from "./pages/manager/TeamAndReportsPage.jsx"
import EmpAttendancePage from './pages/admin/EmpAttendancePage.jsx';
import CheckInOutManager from './pages/manager/CheckInOutManager.jsx';
import CheckInOut from "./pages/admin/CheckInOut.jsx";
import MyAttendance from './pages/admin/MyAttendance.jsx';
import AttendanceTime from './pages/superadmin/AttendanceTime.jsx';
import ManagerAttendance from './pages/manager/ManagerAttendance.jsx';
import PayrollManagementPage from './pages/financeadmin/PayrollManagementPage.jsx';

// Root redirect handler based on authentication status & role
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/employee" replace />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <EmployeeInspectionProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Role Protected Routes with Shared Layout */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route element={<AppLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/employees" element={<EmployeeDirectoryPage />} />
                    <Route path="/admin/attendance" element={<AllAttendancePage />} />
                    <Route path="/admin/approvals" element={<LeaveApprovalPage />} />
                    <Route path="/admin/reports" element={<EmployeeContextView />} />
                    <Route
                      path="/admin/emp-attendance"
                      element={<EmpAttendancePage />}
                    />
                    <Route
                      path="/admin/admin-attendance"
                      element={
                        <>
                          <CheckInOut />
                          <MyAttendance />
                        </>
                      }
                    />
                    <Route path="/admin/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Employee Role Protected Routes with Shared Layout */}
                <Route element={<ProtectedRoute allowedRoles={['employee', 'admin']} />}>
                  <Route element={<AppLayout />}>
                    <Route path="/employee" element={<EmployeeDashboard />} />
                    <Route path="/employee/attendance" element={<MyAttendancePage />} />
                    <Route path="/employee/timeoff" element={<MyLeavesPage />} />
                    <Route path="/employee/Payslips" element={<MySalaryPage />} />
                    <Route
                      path="/employee/attendance"
                      element={<MyAttendancePage />}
                    />
                    <Route path="/employee/leaves" element={<MyLeavesPage />} />
                    <Route path="/employee/salary" element={<MySalaryPage />} />
                    <Route path="/employee/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Super Admin Role Protected Routes with Shared Layout */}
                {/* element={<ProtectedRoute allowedRoles={['superadmin']} />} */}
                <Route >
                  <Route element={<AppLayout />}>
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/superadmin/approvals" element={<WorkflowApprovals />} />
                    <Route
                      path="/superadmin/employees"
                      element={<EmployeeDirectoryPage />}
                    />
                    <Route
                      path="/superadmin/attendance"
                      element={<AttendanceTime />}
                    />
                    <Route path="/superadmin/profile" element={<AdminProfile />} />
                  </Route>
                </Route>


                {/* FinanceAdmin Role Protected Routes with Shared Layout */}
                {/* element={<ProtectedRoute allowedRoles={['superadmin']} />} */}
                <Route>
                  <Route element={<AppLayout />}>
                    <Route
                      path="/financeadmin"
                      element={<FinanceAdminDashboard />}
                    />
                    <Route
                      path="/financeadmin/payroll/*"
                      element={<PayrollManagementPage />}
                    />
                    <Route
                      path="/financeadmin/compensation"
                      element={<EmployeeCompensation />}
                    />
                    <Route
                      path="/financeadmin/payment-history"
                      element={<PaymentHistory />}
                    />
                    <Route
                      path="/financeadmin/profile"
                      element={<FinanceProfile />}
                    />
                  </Route>
                </Route>

                {/* Manager Role Protected Routes with Shared Layout */}
                {/* element={<ProtectedRoute allowedRoles={['superadmin']} />} */}
                <Route >
                  <Route element={<AppLayout />}>
                    <Route path="/manager" element={<ManagerDashboard />} />
                    <Route path="/manager/teamdetail" element={<TeamAndReportsPage />} />
                    <Route
                      path="/manager/attendance"
                      element={<AllAttendancePage />}
                    />
                    <Route
                      path="/manager/manager-attendance"
                      element={<>
                        <ManagerAttendance />
                        <CheckInOutManager />
                      </>}
                    />
                    <Route path="/manager/profile" element={<ManagerProfile />} />
                  </Route>
                </Route>

                {/* Index and fallback redirects */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </EmployeeInspectionProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
