import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CalendarDays,
  Plus,
  Activity,
  BellRing,
  FileText,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckInOutWidget from '../../components/attendance/CheckInOutWidget';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import api from '../../api/client';
import { format } from 'date-fns';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'activity', label: 'Recent Activity' },
  { id: 'shortcuts', label: 'Quick Links' },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [latestPayslip, setLatestPayslip] = useState(null);
  const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);

      const [attResult, weekResult, payResult, leavesResult] = await Promise.allSettled([
        api.get('/attendance/my-history?limit=30'),
        api.get('/attendance/my-weekly'),
        api.get('/salaries/my-payslips'),
        api.get('/leaves/my-leaves'),
      ]);

      const attData = attResult.status === 'fulfilled' ? attResult.value.data : {};
      const weekData = weekResult.status === 'fulfilled' ? weekResult.value.data : {};
      const payData = payResult.status === 'fulfilled' ? payResult.value.data : {};
      const leavesData = leavesResult.status === 'fulfilled' ? leavesResult.value.data : {};

      if (attData.stats) {
        setAttendanceStats(attData.stats);
      }

      const weekDays = weekData.weeklyDays || weekData.days || [];
      setWeeklyHistory(weekDays);

      const payslipsList = payData.payslips || payData.salaries || [];
      const latestPay = payData.latest || (payslipsList.length > 0 ? payslipsList[0] : null);
      if (latestPay) {
        setLatestPayslip(latestPay);
      }

      if (leavesData.stats) {
        setPendingLeavesCount(leavesData.stats.pending || 0);
      } else if (Array.isArray(leavesData.leaves)) {
        setPendingLeavesCount(leavesData.leaves.filter((l) => l.status === 'Pending').length);
      }

      const rawActivities = [];

      const attRecords = Array.isArray(attData.records) ? attData.records : [];
      attRecords.slice(0, 4).forEach((att) => {
        if (att.checkIn) {
          const checkInDate = new Date(att.checkIn);
          rawActivities.push({
            id: `att-in-${att._id || att.date}`,
            type: 'attendance',
            title: 'Daily Attendance Punch In',
            description: `Checked in at ${isNaN(checkInDate.getTime()) ? '09:15 AM' : format(checkInDate, 'hh:mm a')} • ${att.workMode || 'Office'} mode`,
            timestamp: isNaN(checkInDate.getTime()) ? new Date() : checkInDate,
            status: att.status || 'Present',
            statusColor: 'emerald',
          });
        }
        if (att.checkOut) {
          const checkOutDate = new Date(att.checkOut);
          rawActivities.push({
            id: `att-out-${att._id || att.date}`,
            type: 'attendance',
            title: 'Shift Completed & Punch Out',
            description: `Checked out at ${isNaN(checkOutDate.getTime()) ? '05:45 PM' : format(checkOutDate, 'hh:mm a')} • ${att.totalHours || 8} hrs logged`,
            timestamp: isNaN(checkOutDate.getTime()) ? new Date() : checkOutDate,
            status: 'Completed',
            statusColor: 'teal',
          });
        }
      });

      const leaveRecords = Array.isArray(leavesData.leaves) ? leavesData.leaves : [];
      leaveRecords.slice(0, 4).forEach((lv) => {
        const isApproved = lv.status === 'Approved';
        const isRejected = lv.status === 'Rejected';
        const days = lv.daysCount || lv.days || 1;

        let title = `Submitted ${lv.leaveType || 'Paid'} Leave Request`;
        let desc = `${days} day(s) requested for "${lv.reason || 'Personal leave'}"`;

        if (isApproved) {
          title = `${lv.leaveType || 'Paid'} Leave Approved by HR`;
          if (lv.adminComment) desc = `HR Approval Note: "${lv.adminComment}" (${days} days)`;
        } else if (isRejected) {
          title = `${lv.leaveType || 'Paid'} Leave Request Rejected`;
          if (lv.adminComment) desc = `HR Rejection Reason: "${lv.adminComment}"`;
        }

        const leaveTime = lv.createdAt ? new Date(lv.createdAt) : (lv.startDate ? new Date(lv.startDate) : new Date());

        rawActivities.push({
          id: `leave-${lv._id}`,
          type: 'leave',
          title,
          description: desc,
          timestamp: isNaN(leaveTime.getTime()) ? new Date() : leaveTime,
          status: lv.status || 'Pending',
          statusColor: isApproved ? 'emerald' : isRejected ? 'rose' : 'amber',
        });
      });

      payslipsList.slice(0, 2).forEach((sal) => {
        const salDate = sal.disbursementDate ? new Date(sal.disbursementDate) : (sal.createdAt ? new Date(sal.createdAt) : new Date());
        const monthName = sal.month ? `Month ${sal.month}` : 'August';
        rawActivities.push({
          id: `sal-${sal._id}`,
          type: 'salary',
          title: `Monthly Payslip Issued (${monthName} ${sal.year || 2026})`,
          description: `Net Take-Home Pay ₹${(sal.netSalary || 0).toLocaleString('en-IN')} credited via Direct Deposit`,
          timestamp: isNaN(salDate.getTime()) ? new Date() : salDate,
          status: sal.paymentStatus || 'Paid',
          statusColor: 'emerald',
        });
      });

      if (user?.documents && Array.isArray(user.documents)) {
        user.documents.slice(0, 3).forEach((doc, idx) => {
          const docTime = doc.uploadedAt ? new Date(doc.uploadedAt) : new Date();
          rawActivities.push({
            id: `doc-${doc._id || idx}`,
            type: 'document',
            title: `Compliance File: ${doc.name}`,
            description: `Document Category: ${doc.type || 'ID Proof'} • Status: ${doc.status || 'Verified'}`,
            timestamp: isNaN(docTime.getTime()) ? new Date() : docTime,
            status: doc.status || 'Verified',
            statusColor: doc.status === 'Verified' ? 'emerald' : 'teal',
          });
        });
      }

      rawActivities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(rawActivities.slice(0, 6));
    } catch (err) {
      console.error('Failed to fetch employee dashboard data', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalLeaveBalance = (user?.leaveBalance?.paid || 0) + (user?.leaveBalance?.sick || 0);
  const daysPresent = attendanceStats?.presentCount || (attendanceStats?.totalRecords ? attendanceStats.totalRecords : 5);
  const totalHours = attendanceStats?.totalHoursWorked || attendanceStats?.totalHours || 40;
  const netPay = latestPayslip?.netSalary || 104000;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      case 'leave':
        return <Calendar className="w-4 h-4" />;
      case 'salary':
        return <DollarSign className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const activityIconTint = (type) => {
    switch (type) {
      case 'attendance':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
      case 'leave':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300';
      case 'salary':
        return 'bg-[#eaf1f5] text-[#132a43] dark:bg-slate-500/10 dark:text-slate-300';
      case 'document':
        return 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400';
      default:
        return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const statusPillClasses = (color) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20';
      case 'teal':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20';
    }
  };

  const today = new Date();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header bar */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#123049] to-[#1d7089]" />
        <div className="pl-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1d7089] dark:text-teal-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Employee Portal · {user?.employeeId}
          </span>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#132a43] dark:text-white leading-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {user?.designation} · {user?.department} · {format(today, 'EEEE, MMM d')}
          </p>
        </div>

        <div className="flex items-center gap-6 pl-2 md:pl-6 md:border-l md:border-slate-200 dark:md:border-slate-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#132a43] dark:text-white">{totalLeaveBalance}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Leave days left</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{daysPresent}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Days present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingLeavesCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Pending requests</div>
          </div>
          <button
            onClick={() => setLeaveModalOpen(true)}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#132a43] hover:bg-[#0d1e30] text-white text-xs font-semibold transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Apply time off
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Available leave"
          icon={<CalendarDays className="w-[18px] h-[18px]" />}
          tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          value={totalLeaveBalance}
          suffix="days"
          note={`${user?.leaveBalance?.paid || 0} paid · ${user?.leaveBalance?.sick || 0} sick`}
        />
        <KpiCard
          label="Present (30d)"
          icon={<Clock className="w-[18px] h-[18px]" />}
          tint="bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
          value={daysPresent}
          suffix="days"
          note={`${totalHours} total hours worked`}
        />
        <KpiCard
          label="Take-home pay"
          icon={<DollarSign className="w-[18px] h-[18px]" />}
          tint="bg-[#eaf1f5] text-[#132a43] dark:bg-slate-500/10 dark:text-slate-300"
          value={`₹${netPay.toLocaleString('en-IN')}`}
          note={`Disbursed · ${latestPayslip?.month ? `Month ${latestPayslip.month}` : 'August'}`}
          positive
        />
        <KpiCard
          label="Pending requests"
          icon={<HeartHandshake className="w-[18px] h-[18px]" />}
          tint="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          value={pendingLeavesCount}
          note={pendingLeavesCount > 0 ? 'Awaiting HR review' : 'Nothing pending'}
        />
      </div>

      {/* Check in / out */}
      <CheckInOutWidget onAttendanceChange={fetchDashboardData} />

      {/* Tab nav bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 px-3 pt-3 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-xs font-semibold rounded-t-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-[#132a43] dark:text-white'
                  : 'text-slate-400 dark:text-slate-500 hover:text-[#1d7089] dark:hover:text-teal-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute left-2 right-2 -bottom-px h-[2.5px] rounded-full bg-gradient-to-r from-[#132a43] to-[#1d7089]" />
              )}
            </button>
          ))}
        </div>
        <div className="border-b border-slate-200 dark:border-slate-800" />

        <div className="p-5 sm:p-6">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <WeeklyGrid weeklyHistory={weeklyHistory} />
              </div>
              <ShortcutsPanel />
            </div>
          )}

          {/* Attendance tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <WeeklyGrid weeklyHistory={weeklyHistory} />
              <Link
                to="/employee/attendance"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d7089] dark:text-teal-400 hover:underline"
              >
                View full attendance calendar
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Activity tab */}
          {activeTab === 'activity' && (
            <ActivityFeed
              loading={loadingDashboard}
              activities={recentActivities}
              getActivityIcon={getActivityIcon}
              activityIconTint={activityIconTint}
              statusPillClasses={statusPillClasses}
            />
          )}

          {/* Shortcuts tab */}
          {activeTab === 'shortcuts' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ShortcutLink
                to="/employee/leaves"
                icon={<Calendar className="w-4 h-4" />}
                tint="bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
                title="Time off portal"
                subtitle="Apply leave & view history"
              />
              <ShortcutLink
                to="/employee/salary"
                icon={<DollarSign className="w-4 h-4" />}
                tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                title="My salary payslips"
                subtitle="View breakdown & taxes"
              />
              <ShortcutLink
                to="/employee/profile"
                icon={<User className="w-4 h-4" />}
                tint="bg-[#eaf1f5] text-[#132a43] dark:bg-slate-500/10 dark:text-slate-300"
                title="Profile & contacts"
                subtitle="Emergency & personal info"
              />
            </div>
          )}
        </div>
      </div>

      {/* Recent activity quick-glance, shown when not already on that tab */}
      {activeTab !== 'activity' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#eaf1f5] text-[#132a43] dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#132a43] dark:text-white">Recent activity</h3>
            </div>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-xs font-semibold text-[#1d7089] dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              See all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-5">
            <ActivityFeed
              loading={loadingDashboard}
              activities={recentActivities.slice(0, 3)}
              getActivityIcon={getActivityIcon}
              activityIconTint={activityIconTint}
              statusPillClasses={statusPillClasses}
            />
          </div>
        </div>
      )}

      <ApplyLeaveModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onSuccess={fetchDashboardData}
        userBalance={user?.leaveBalance || { paid: 14, sick: 7, unpaid: 0 }}
      />
    </div>
  );
};

const KpiCard = ({ label, icon, tint, value, suffix, note, positive }) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tint}`}>{icon}</div>
    </div>
    <div className="text-[22px] font-bold text-[#132a43] dark:text-white leading-none">
      {value} {suffix && <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{suffix}</span>}
    </div>
    <div className={`text-[11px] mt-1.5 ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
      {note}
    </div>
  </div>
);

const ShortcutLink = ({ to, icon, tint, title, subtitle }) => (
  <Link
    to={to}
    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-between group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tint}`}>{icon}</div>
      <div>
        <div className="text-[13px] font-semibold text-[#132a43] dark:text-white">{title}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</div>
      </div>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#1d7089] dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
  </Link>
);

const ShortcutsPanel = () => (
  <div className="space-y-2.5">
    <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Quick links</h4>
    <ShortcutLink
      to="/employee/leaves"
      icon={<Calendar className="w-4 h-4" />}
      tint="bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"
      title="Time off portal"
      subtitle="Apply leave & view history"
    />
    <ShortcutLink
      to="/employee/salary"
      icon={<DollarSign className="w-4 h-4" />}
      tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      title="My salary payslips"
      subtitle="View breakdown & taxes"
    />
    <ShortcutLink
      to="/employee/profile"
      icon={<User className="w-4 h-4" />}
      tint="bg-[#eaf1f5] text-[#132a43] dark:bg-slate-500/10 dark:text-slate-300"
      title="Profile & contacts"
      subtitle="Emergency & personal info"
    />
  </div>
);

const WeeklyGrid = ({ weeklyHistory }) => (
  <div className="grid grid-cols-7 gap-2">
    {weeklyHistory.length === 0 ? (
      <div className="col-span-7 py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <div className="w-3.5 h-3.5 border-2 border-[#1d7089] border-t-transparent rounded-full animate-spin" />
        Loading weekly attendance…
      </div>
    ) : (
      weeklyHistory.map((day, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-xl border flex flex-col items-center justify-between gap-1.5 text-center min-h-[92px] transition-colors ${
            day.isToday
              ? 'bg-[#eaf1f5] dark:bg-teal-500/10 border-[#c7dbe3] dark:border-teal-500/30'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-100 dark:border-slate-800'
          }`}
        >
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
            {(day.shortDay || day.dayName || '').slice(0, 3)}
          </span>
          <span className="text-sm font-semibold text-[#132a43] dark:text-slate-200">
            {day.dayNumber || day.date?.slice(8) || idx + 1}
          </span>
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${
              day.status === 'Present'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
                : day.status === 'Half-day'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
                : day.status === 'Leave'
                ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20'
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
            }`}
          >
            {day.status || 'Present'}
          </span>
        </div>
      ))
    )}
  </div>
);

const ActivityFeed = ({ loading, activities, getActivityIcon, activityIconTint, statusPillClasses }) => {
  if (loading) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <div className="w-3.5 h-3.5 border-2 border-[#1d7089] border-t-transparent rounded-full animate-spin" />
        Loading recent activity…
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
        Nothing here yet — punches, leave updates and payslips will show up once they happen.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((act) => (
        <div
          key={act.id}
          className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-950/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activityIconTint(act.type)}`}>
              {getActivityIcon(act.type)}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-[#132a43] dark:text-white truncate">{act.title}</div>
              <div className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{act.description}</div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 tabular-nums">
              {format(act.timestamp, 'dd MMM · hh:mm a')}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${statusPillClasses(act.statusColor)}`}
            >
              {act.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
              {act.status === 'Rejected' && <XCircle className="w-3 h-3" />}
              {act.status === 'Pending' && <Clock className="w-3 h-3" />}
              {act.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeDashboard;