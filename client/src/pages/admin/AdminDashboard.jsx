import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  Building,
  ArrowRight,
  TrendingUp,
  Check,
  X,
  Sparkles,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { format } from 'date-fns';
// Assumed Meeting component exists
// import Meetings from '../meetings/Meetings'; 

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [activeBox, setActiveBox] = useState("department");
  const [attendanceStats, setAttendanceStats] = useState({ totalPresent: 0, totalHalfDay: 0, totalLeave: 0 });
  const [todayRecords, setTodayRecords] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [payrollStats, setPayrollStats] = useState({ totalDisbursed: 0, totalGross: 0, paidCount: 0 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Faking API data for structural demonstration
      // const [attRes, usersRes, leavesRes, payRes] = await Promise.all([
      //   api.get('/attendance/all'),
      //   api.get('/users'),
      //   api.get('/leaves/all?status=Pending'),
      //   api.get('/salaries/all?month=8&year=2026'),
      // ]);

      // Simulation of successful API response
      const fakedData = {
        attendance: { success: true, stats: { totalPresent: 18, totalHalfDay: 2, totalLeave: 1 }, records: [{ _id: '1', userId: { name: 'Alice Smith', department: 'Engineering', avatar: null }, checkIn: new Date(), workMode: 'Office' }, { _id: '2', userId: { name: 'Bob Jones', department: 'Sales', avatar: null }, checkIn: new Date(), workMode: 'Remote' }] },
        users: { success: true, employees: [{ _id: '1', status: 'Active', department: 'Engineering' }, { _id: '2', status: 'Active', department: 'Engineering' }, { _id: '3', status: 'Active', department: 'Product Design' }, { _id: '4', status: 'Active', department: 'Sales' }, { _id: '5', status: 'Inactive', department: 'Sales' }] },
        leaves: { success: true, leaves: [{ _id: '1', userId: { name: 'Charlie Day', department: 'Product Design', avatar: null }, leaveType: 'Sick', startDate: '2026-08-15', endDate: '2026-08-16', daysCount: 2, reason: 'Flu' }], stats: { total: 5, pending: 1, approved: 3, rejected: 1 } },
        payroll: { success: true, stats: { totalDisbursed: 750000, totalGross: 800000, paidCount: 20 } }
      };

      if (fakedData.attendance.success) {
        setAttendanceStats(fakedData.attendance.stats);
        setTodayRecords(fakedData.attendance.records);
      }
      if (fakedData.users.success) setEmployees(fakedData.users.employees);
      if (fakedData.leaves.success) setPendingLeaves(fakedData.leaves.leaves);
      if (fakedData.payroll.success) setPayrollStats(fakedData.payroll.stats);

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickDecision = async (leaveId, status) => {
    try {
      // Mocked API call
      // await api.put(`/leaves/${leaveId}/status`, { status, adminComment: `Processed via dashboard` });
      toast.success(`Leave request ${status.toLowerCase()}!`);
      // Re-fetch to update
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to process leave decision');
    }
  };

  const totalEmployees = employees.length || 1; // Prevent division by zero
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const presentRate = totalEmployees > 0 ? Math.min(100, Math.round((attendanceStats.totalPresent / totalEmployees) * 100)) : 0;

  const deptCounts = employees.reduce((acc, emp) => {
    const dept = emp.department || 'General';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Themed department colors (shades of blue)
  const departmentColors = {
    Engineering: 'from-[#2C5282] to-[#1A365D]', // Deep Blue
    'Product Design': 'from-[#4299E1] to-[#2B6CB0]', // Mid Blue
    'Sales & Marketing': 'from-[#63B3ED] to-[#3182CE]', // Light-Mid Blue
    'Human Resources': 'from-[#90CDF4] to-[#4299E1]', // Lighter Blue
    Finance: 'from-[#A0AEC0] to-[#718096]', // Grayish Blue
  };

  const monthLabel = format(new Date(), 'MMMM yyyy');

  const navItems = [
    { id: "department", label: "Department" },
    { id: "attendence", label: "Attendance Activity" },
    { id: "time", label: "Time Off Approvals" },
    // { id: "meetings", label: "Events & Meetings" }, // Placeholder for Meeting component
  ];

  if (loading) return <div className="p-10 text-center text-[#173752]">Loading...</div>;
// console.log('Hello This is admin Dashboard')
  return (
    // Main background: Pale, pale blue/white from reference image
    <div className="space-y-6 sm:space-y-8 p-6 bg-[#F2F9FF] min-h-screen">
      
      {/* 1. Workforce Summary Banner */}
      {/* White container with blue accents and pattern */}
      <div className="relative px-6 py-5 rounded-2xl bg-white border border-[#D3E9FA] shadow-sm overflow-hidden">
        {/* Blue decorative line */}
        <div className="absolute left-0 top-0 h-full w-1.5 bg-[#2B6CB0]" />
        
        {/* Dot pattern matching the software theme */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #173752 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-4">
          <div>
            {/* Title in Deep Blue */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#173752] leading-tight">
              Workforce Snapshot — {format(new Date(), 'EEEE, MMM d')}
            </h2>
            <p className="text-sm text-[#4A5568] mt-1">
              Real-time summary of staff, attendance, and approvals
            </p>
          </div>

          <div className="flex items-center gap-5 sm:gap-8 pl-0 sm:border-l sm:border-[#D3E9FA] sm:pl-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#173752]">{totalEmployees}</p>
              <p className="text-[11px] text-[#718096] uppercase tracking-wide font-medium">Total Staff</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#2F855A]">{attendanceStats.totalPresent}</p> {/* Keep some semantic color */}
              <p className="text-[11px] text-[#718096] uppercase tracking-wide font-medium">Present Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C05621]">{pendingLeaves.length}</p> {/* Keep some semantic color */}
              <p className="text-[11px] text-[#718096] uppercase tracking-wide font-medium">Pending Leaves</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Cards Grid */}
      {/* White main container with blue border */}
      <div className="bg-white border border-[#D3E9FA] rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#D3E9FA]">
          {/* Card 1: Attendance */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#718096]">Roll call</span>
              {/* Icon Container with light blue background */}
              <div className="w-9 h-9 rounded-full bg-[#EBF8FF] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#2B6CB0]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="font-sans font-extrabold text-3xl leading-tight text-[#173752] tabular-nums">
              {attendanceStats.totalPresent}
              <span className="text-base font-medium text-[#718096] ml-1.5">/ {totalEmployees}</span>
            </div>
            <div className="text-xs text-[#2F855A] flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> {presentRate}% present today
            </div>
          </div>

          {/* Card 2: Leaves */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#718096]">Approvals</span>
              <div className="w-9 h-9 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C05621]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="font-sans font-extrabold text-3xl leading-tight text-[#173752] tabular-nums">
              {pendingLeaves.length}
            </div>
            <div className="text-xs text-[#718096]">
              {pendingLeaves.length > 0 ? 'Awaiting action' : 'All clear'}
            </div>
          </div>

          {/* Card 3: Workforce */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#718096]">Workforce</span>
              <div className="w-9 h-9 rounded-full bg-[#EBF8FF] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2B6CB0]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="font-sans font-extrabold text-3xl leading-tight text-[#173752] tabular-nums">
              {activeEmployees}
              <span className="text-base font-medium text-[#718096] ml-1.5">active</span>
            </div>
            <div className="text-xs text-[#718096]">
              Across {Object.keys(deptCounts).length} departments
            </div>
          </div>

          {/* Card 4: Payroll */}
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#718096]">Payroll — {format(new Date(), 'MMM yy')}</span>
              <div className="w-9 h-9 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#C53030]" strokeWidth={2.5} />
              </div>
            </div>
            <div className="font-sans font-extrabold text-2xl leading-tight text-[#173752] tabular-nums">
              ₹{(payrollStats.totalDisbursed || 0).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#718096]">Net disbursement</div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      {/* Light blue bar, darker active indicator */}
      <nav className="h-12 flex items-center justify-start px-4 border border-[#D3E9FA] bg-white rounded-xl shadow-inner-sm">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none h-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveBox(item.id)}
              className={`h-full px-1.5 text-sm font-semibold relative transition-colors duration-150 ease-in-out ${activeBox === item.id
                ? "text-[#173752] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#173752]"
                : "text-[#718096] hover:text-[#173752]"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* 4. Tab Content Area */}
      <div className="space-y-6">
        
        {/* DEPARTMENT distribution */}
        {activeBox === "department" && (
          <div className="rounded-2xl bg-white border border-[#D3E9FA] p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D3E9FA] pb-4">
              <h3 className="text-sm font-bold text-[#173752] uppercase tracking-wider flex items-center gap-2.5">
                <Building className="w-5 h-5 text-[#2B6CB0]" strokeWidth={2} />
                Workforce Distribution by Department
              </h3>
              <span className="text-xs text-[#718096] font-mono bg-[#F2F9FF] px-3 py-1 rounded-full border border-[#D3E9FA]">
                {totalEmployees} Total Staff
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const pct = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                const gradient = departmentColors[dept] || 'from-[#4299E1] to-[#2B6CB0]'; // Default to themed blue
                return (
                  <div key={dept} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#173752]">{dept}</span>
                      <span className="text-[#718096]">
                        {count} {count === 1 ? 'member' : 'members'} ({pct}%)
                      </span>
                    </div>
                    {/* Progress Bar with Blue Theme */}
                    <div className="w-full h-3 rounded-full bg-[#F2F9FF] overflow-hidden border border-[#D3E9FA]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ATTENDANCE Feed & Status */}
        {activeBox === "attendence" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Status Breakdown */}
            <div className="rounded-2xl bg-white border border-[#D3E9FA] p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#D3E9FA] pb-4">
                <h3 className="text-sm font-bold text-[#173752] uppercase tracking-wider flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-[#2B6CB0]" strokeWidth={2} />
                  Today's Attendance Status
                </h3>
                <span className="text-xs text-[#2F855A] font-bold bg-[#F0FFF4] px-3 py-1 rounded-full border border-[#C6F6D5]">
                  {presentRate}% Present
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {[
                  { label: "Present", value: attendanceStats.totalPresent, color: "#2F855A" },
                  { label: "Half-Day", value: attendanceStats.totalHalfDay, color: "#C05621" },
                  { label: "On Leave", value: attendanceStats.totalLeave, color: "#805AD5" },
                  { label: "Absent / Off", value: Math.max(0, totalEmployees - (attendanceStats.totalPresent + attendanceStats.totalHalfDay + attendanceStats.totalLeave)), color: "#C53030" }
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wide">{item.label}</span>
                      <div className="text-2xl font-extrabold text-[#173752] mt-1 tabular-nums">{item.value}</div>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#EBF8FF] border border-[#BEE3F8] text-xs text-[#2C5282] flex items-center gap-2.5 font-medium">
                <Sparkles className="w-5 h-5 text-[#3182CE] shrink-0" />
                <span>Attendance records are synchronized instantly upon employee punch-in or punch-out events.</span>
              </div>
            </div>

            {/* Live Feed */}
            <div className="rounded-2xl bg-white border border-[#D3E9FA] p-7 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#D3E9FA] pb-4">
                <h3 className="text-sm font-bold text-[#173752] uppercase tracking-wider flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#2B6CB0]" strokeWidth={2} />
                  Live Attendance Feed
                </h3>
                <Link to="/admin/attendance" className="text-xs text-[#2B6CB0] hover:text-[#1A365D] font-bold flex items-center gap-1.5 transition-colors">
                  <span>View All Logs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {todayRecords.length === 0 ? (
                <div className="p-10 text-center text-[#718096] text-sm bg-[#F7FAFC] rounded-xl border border-[#E2E8F0]">
                  No punch-in events recorded for today yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {todayRecords.slice(0, 4).map((r) => (
                    <div key={r._id} className="p-4 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 transition-hover hover:border-[#CBD5E0]">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={r.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userId?.name || 'User')}&background=D3E9FA&color=173752`} // Faked dynamic avatar
                          alt={r.userId?.name || "Employee"}
                          className="w-10 h-10 rounded-xl object-cover border border-[#CBD5E0]"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#173752]">{r.userId?.name}</div>
                          <div className="text-xs text-[#718096] font-medium">
                            {r.userId?.department} • <span className="font-bold text-[#4A5568]">{r.workMode}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-[#2B6CB0] bg-[#EBF8FF] px-2 py-0.5 rounded">
                          {r.checkIn ? format(new Date(r.checkIn), "hh:mm a") : "—"}
                        </div>
                        <span className="text-[11px] font-semibold text-[#A0AEC0] mt-1 block">
                          {r.totalHours ? `${r.totalHours} hrs logged` : "Currently Working..."}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LEAVE Requests */}
        {activeBox === "time" && (
          <div className="rounded-2xl bg-white border border-[#D3E9FA] p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D3E9FA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] text-[#C05621] border border-[#FEEBC8] flex items-center justify-center shadow-inner-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#173752] uppercase tracking-wider">
                    Pending Leave Approvals Queue
                  </h3>
                  <p className="text-xs text-[#718096] mt-0.5">Quick review and decisioning panel</p>
                </div>
              </div>
              <Link to="/admin/leaves" className="text-xs text-[#2B6CB0] hover:text-[#1A365D] font-bold flex items-center gap-1.5 transition-colors">
                <span>View Full Leave Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-10 text-center text-[#718096] text-sm rounded-xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <CheckCircle2 className="w-10 h-10 text-[#2F855A] mx-auto mb-3 opacity-90" />
                <p className="font-bold text-[#2D3748]">All Leave Requests Processed</p>
                <p className="text-xs text-[#718096] mt-1">There are no pending employee leave requests requiring your review at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.slice(0, 3).map((l) => (
                  <div key={l._id} className="p-4 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-hover hover:border-[#CBD5E0]">
                    <div className="flex items-center gap-4">
                      <img
                        src={l.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(l.userId?.name || 'User')}&background=D3E9FA&color=173752`}
                        alt={l.userId?.name}
                        className="w-11 h-11 rounded-xl object-cover border border-[#CBD5E0]"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#173752]">
                          {l.userId?.name}{' '}
                          <span className="text-xs text-[#718096] font-medium ml-1">({l.userId?.department})</span>
                        </div>
                        <div className="text-xs text-[#4A5568] mt-1 font-medium">
                          <span className="font-bold text-[#2B6CB0]">{l.leaveType} Leave</span>: {format(new Date(l.startDate), 'MMM d')} to {format(new Date(l.endDate), 'MMM d, yyyy')} ({l.daysCount} days)
                        </div>
                        <div className="text-xs text-[#718096] italic mt-1 bg-white px-2 py-1 rounded border border-[#E2E8F0] inline-block">
                          “{l.reason}”
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      {/* Brand themed blue button for approve */}
                      <button
                        onClick={() => handleQuickDecision(l._id, 'Approved')}
                        className="px-4 py-2 rounded-lg bg-[#2B6CB0] text-white hover:bg-[#1A365D] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      {/* Lighter blue with red accent for reject */}
                      <button
                        onClick={() => handleQuickDecision(l._id, 'Rejected')}
                        className="px-4 py-2 rounded-lg bg-white text-[#C53030] hover:bg-[#FFF5F5] border border-[#FC8181] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* meetings Placeholder */}
        {/* {activeBox === "meetings" && <><Meetings />
        </>} */}
      </div>

    </div>
  );
};

export default AdminDashboard;