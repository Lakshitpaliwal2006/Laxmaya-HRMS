// src/pages/manager/ManagerDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  CalendarDays,
  TrendingUp,
  Video,
  Briefcase,
  Inbox,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
  Coffee,
} from 'lucide-react';
import api from '../../api/client';
import { format } from 'date-fns';

/* ---------- Config ---------- */
const TABS = [
  { id: 'department', label: 'Department', icon: Building2 },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'approvals', label: 'Approvals', icon: Clock },
  { id: 'events', label: 'Events', icon: CalendarDays },
];

const DEPT_GRADIENTS = [
  'from-[#1d7089] to-[#0f4c5c]',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-sky-500 to-blue-600',
];

/* ---------- Main Component ---------- */
const ManagerDashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [events, setEvents] = useState([]);
  const [payrollTotal, setPayrollTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('department');
  const [actingOn, setActingOn] = useState(null);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const [summaryRes, deptRes, attRes, leavesRes, eventsRes, payrollRes] =
        await Promise.allSettled([
          api.get('/admin/workforce-summary'),
          api.get('/admin/departments'),
          api.get('/attendance/today'),
          api.get('/leaves/pending'),
          api.get('/events/upcoming'),
          api.get('/salaries/summary'),
        ]);

      const s = summaryRes.status === 'fulfilled' ? summaryRes.value.data : {};
      setSummary({
        totalStaff: s.totalStaff ?? 6,
        presentToday: s.presentToday ?? 6,
        pendingLeaves: s.pendingLeaves ?? 1,
      });

      const d = deptRes.status === 'fulfilled' ? deptRes.value.data : {};
      setDepartments(
        d.departments || d.data || [
          { name: 'Engineering', count: 2 },
          { name: 'Finance', count: 1 },
          { name: 'Sales & Marketing', count: 1 },
          { name: 'Product Design', count: 1 },
          { name: 'Operations', count: 1 },
        ]
      );

      const a = attRes.status === 'fulfilled' ? attRes.value.data : {};
      setAttendanceToday(a.records || a.attendance || []);

      const l = leavesRes.status === 'fulfilled' ? leavesRes.value.data : {};
      setPendingApprovals(l.leaves || l.data || []);

      const e = eventsRes.status === 'fulfilled' ? eventsRes.value.data : {};
      setEvents(e.events || e.data || []);

      const p = payrollRes.status === 'fulfilled' ? payrollRes.value.data : {};
      setPayrollTotal(p.netDisbursement ?? p.total ?? 622000);
    } catch (err) {
      console.error('Failed to fetch manager dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, []);

  const totalDeptMembers = useMemo(
    () => departments.reduce((sum, d) => sum + (d.count || 0), 0) || 1,
    [departments]
  );

  const handleApprove = async (id) => {
    try {
      setActingOn(id);
      await api.post(`/leaves/${id}/approve`);
      setPendingApprovals((prev) => prev.filter((l) => (l._id || l.id) !== id));
    } catch (err) {
      console.error('Approve failed', err);
    } finally {
      setActingOn(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActingOn(id);
      await api.post(`/leaves/${id}/reject`);
      setPendingApprovals((prev) => prev.filter((l) => (l._id || l.id) !== id));
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setActingOn(null);
    }
  };

  const today = new Date();
  const presentPct = summary
    ? Math.round((summary.presentToday / Math.max(summary.totalStaff, 1)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#eaf1f5] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ==================== HERO BANNER ==================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#132a43] via-[#1d4a63] to-[#1d7089] p-6 sm:p-8 shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" />
                Manager Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Good {getGreeting()}, {user?.name?.split(' ')[0] || 'Rohan Nair'} 👋
              </h1>
              <p className="text-white/70 text-sm mt-2 max-w-xl">
                Here's your workforce pulse for {format(today, 'EEEE, MMMM d, yyyy')}.
                You have <span className="text-white font-semibold">{pendingApprovals.length}</span> pending
                approval{pendingApprovals.length === 1 ? '' : 's'} waiting.
              </p>
            </div>

            {/* Hero stats */}
            <div className="flex items-center gap-6 sm:gap-8">
              <HeroStat value={summary?.totalStaff ?? '—'} label="Total Staff" />
              <div className="w-px h-12 bg-white/20" />
              <HeroStat
                value={summary?.presentToday ?? '—'}
                label="Present"
                accent="text-emerald-300"
              />
              <div className="w-px h-12 bg-white/20" />
              <HeroStat
                value={summary?.pendingLeaves ?? '—'}
                label="Pending"
                accent="text-amber-300"
              />
            </div>
          </div>
        </div>

        {/* ==================== KPI CARDS ==================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Roll Call"
            icon={<UserCheck className="w-5 h-5" />}
            tint="from-emerald-500 to-teal-600"
            value={`${summary?.presentToday ?? 0}/${summary?.totalStaff ?? 0}`}
            note={`${presentPct}% present today`}
            trend="up"
          />
          <KpiCard
            label="Approvals"
            icon={<Clock className="w-5 h-5" />}
            tint="from-amber-500 to-orange-500"
            value={pendingApprovals.length}
            note="Needs your review"
          />
          <KpiCard
            label="Workforce"
            icon={<Users className="w-5 h-5" />}
            tint="from-[#1d7089] to-[#132a43]"
            value={summary?.totalStaff ?? 0}
            suffix="active"
            note={`${departments.length} departments`}
          />
          <KpiCard
            label={`Payroll · ${format(today, 'MMM yyyy')}`}
            icon={<DollarSign className="w-5 h-5" />}
            tint="from-rose-500 to-pink-600"
            value={`₹${((payrollTotal ?? 0) / 1000).toFixed(0)}K`}
            note="Net disbursement"
          />
        </div>

        {/* ==================== MAIN GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* -------- Left: Tabbed Panel (2/3) -------- */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-3 pt-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-xl whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-[#132a43] dark:text-white bg-slate-50 dark:bg-slate-800/50'
                        : 'text-slate-400 dark:text-slate-500 hover:text-[#1d7089] dark:hover:text-teal-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {isActive && (
                      <span className="absolute left-3 right-3 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-[#132a43] to-[#1d7089]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-5 sm:p-6 min-h-[420px]">
              {/* ---------- Department ---------- */}
              {activeTab === 'department' && (
                <div>
                  <SectionHeader
                    icon={<Building2 className="w-4 h-4" />}
                    title="Workforce Distribution"
                    badge={`${totalDeptMembers} total`}
                  />
                  {loading ? (
                    <LoadingState label="Loading departments…" />
                  ) : departments.length === 0 ? (
                    <EmptyState
                      icon={<Building2 className="w-6 h-6" />}
                      label="No department data available"
                    />
                  ) : (
                    <div className="space-y-4">
                      {departments.map((dept, idx) => {
                        const pct = Math.round(((dept.count || 0) / totalDeptMembers) * 100);
                        const grad = DEPT_GRADIENTS[idx % DEPT_GRADIENTS.length];
                        return (
                          <div key={dept.name} className="group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-7 h-7 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[10px] font-bold`}
                                >
                                  {dept.name.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-[#132a43] dark:text-white">
                                  {dept.name}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {dept.count} {dept.count === 1 ? 'member' : 'members'} · {pct}%
                              </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-700 ease-out`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ---------- Attendance ---------- */}
              {activeTab === 'attendance' && (
                <div>
                  <SectionHeader
                    icon={<UserCheck className="w-4 h-4" />}
                    title="Today's Attendance"
                    badge={`${attendanceToday.length} records`}
                  />
                  {loading ? (
                    <LoadingState label="Loading attendance…" />
                  ) : attendanceToday.length === 0 ? (
                    <EmptyState
                      icon={<Coffee className="w-6 h-6" />}
                      label="No punches recorded yet today"
                    />
                  ) : (
                    <div className="space-y-2">
                      {attendanceToday.map((rec, idx) => (
                        <div
                          key={rec._id || idx}
                          className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#1d7089]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={rec.name} />
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-[#132a43] dark:text-white truncate">
                                {rec.name || 'Employee'}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                IN {fmtTime(rec.checkIn)} · OUT {fmtTime(rec.checkOut, 'active')}
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={rec.status || 'Present'} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---------- Approvals ---------- */}
              {activeTab === 'approvals' && (
                <div>
                  <SectionHeader
                    icon={<Clock className="w-4 h-4" />}
                    title="Pending Time Off"
                    badge={`${pendingApprovals.length} waiting`}
                  />
                  {loading ? (
                    <LoadingState label="Loading requests…" />
                  ) : pendingApprovals.length === 0 ? (
                    <EmptyState
                      icon={<Inbox className="w-6 h-6" />}
                      label="All caught up — nothing to review"
                    />
                  ) : (
                    <div className="space-y-3">
                      {pendingApprovals.map((lv) => {
                        const id = lv._id || lv.id;
                        return (
                          <div
                            key={id}
                            className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-[#1d7089]/40 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <Avatar name={lv.employeeName || lv.name} />
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold text-[#132a43] dark:text-white truncate">
                                    {lv.employeeName || lv.name || 'Employee'}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {lv.leaveType || 'Paid'} leave · {lv.daysCount || lv.days || 1} day(s)
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                                PENDING
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-3 pl-12">
                              "{lv.reason || 'Personal leave'}"
                            </p>
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleReject(id)}
                                disabled={actingOn === id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                              <button
                                onClick={() => handleApprove(id)}
                                disabled={actingOn === id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#132a43] to-[#1d7089] hover:opacity-90 text-white text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ---------- Events ---------- */}
              {activeTab === 'events' && (
                <div>
                  <SectionHeader
                    icon={<CalendarDays className="w-4 h-4" />}
                    title="Upcoming Events"
                    badge={`${events.length} scheduled`}
                  />
                  {loading ? (
                    <LoadingState label="Loading events…" />
                  ) : events.length === 0 ? (
                    <EmptyState
                      icon={<CalendarDays className="w-6 h-6" />}
                      label="Nothing scheduled yet"
                    />
                  ) : (
                    <div className="space-y-2.5">
                      {events.map((ev) => {
                        const isMeeting = ev.type === 'meeting';
                        return (
                          <div
                            key={ev._id || ev.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#1d7089]/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isMeeting
                                  ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400'
                                  : 'bg-[#eaf1f5] text-[#1d7089] dark:bg-teal-500/10 dark:text-teal-400'
                              }`}
                            >
                              {isMeeting ? <Video className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-[#132a43] dark:text-white truncate">
                                {ev.title}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {ev.date ? format(new Date(ev.date), 'EEE, dd MMM') : ''}
                                {ev.time ? ` · ${ev.time}` : ''}
                              </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* -------- Right: Sidebar (1/3) -------- */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#132a43] dark:text-white">Quick Actions</h3>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Approve Requests', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { label: 'Team Directory', icon: Users, color: 'text-[#1d7089]', bg: 'bg-[#eaf1f5] dark:bg-teal-500/10' },
                  { label: 'Schedule Meeting', icon: Video, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-500/10' },
                  { label: 'View Reports', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.bg} ${action.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-[#132a43] dark:text-white flex-1 text-left">
                        {action.label}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#1d7089] transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Team Pulse */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm p-5">
              <h3 className="text-sm font-bold text-[#132a43] dark:text-white mb-4">Team Pulse</h3>
              <div className="space-y-4">
                <PulseRow
                  icon={<UserCheck className="w-4 h-4" />}
                  label="Present Today"
                  value={`${summary?.presentToday ?? 0}/${summary?.totalStaff ?? 0}`}
                  pct={presentPct}
                  color="bg-emerald-500"
                />
                <PulseRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Pending Leaves"
                  value={pendingApprovals.length}
                  pct={Math.min(pendingApprovals.length * 20, 100)}
                  color="bg-amber-500"
                />
                <PulseRow
                  icon={<Building2 className="w-4 h-4" />}
                  label="Departments"
                  value={departments.length}
                  pct={Math.min(departments.length * 15, 100)}
                  color="bg-[#1d7089]"
                />
              </div>
            </div>

            {/* Today's Note */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1d7089] to-[#132a43] p-5 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                  Manager Tip
                </span>
              </div>
              <p className="text-sm leading-relaxed opacity-95">
                Review pending approvals before end of day to keep the workforce moving smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Helper Functions ---------- */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

const fmtTime = (iso, fallback = '—') => {
  if (!iso) return fallback;
  try {
    return format(new Date(iso), 'hh:mm a');
  } catch {
    return fallback;
  }
};

/* ---------- Sub-components ---------- */

const HeroStat = ({ value, label, accent = 'text-white' }) => (
  <div className="text-center">
    <div className={`text-2xl sm:text-3xl font-bold ${accent}`}>{value}</div>
    <div className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">{label}</div>
  </div>
);

const KpiCard = ({ label, icon, tint, value, suffix, note, trend }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${tint} opacity-5 group-hover:opacity-10 transition-opacity -mr-8 -mt-8`} />
    <div className="relative flex items-start justify-between mb-3">
      <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tint} text-white flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
    </div>
    <div className="relative text-2xl font-bold text-[#132a43] dark:text-white leading-none">
      {value}
      {suffix && (
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1.5">{suffix}</span>
      )}
    </div>
    <div
      className={`relative text-[11px] mt-2 flex items-center gap-1 font-medium ${
        trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
      }`}
    >
      {trend === 'up' && <TrendingUp className="w-3 h-3" />}
      {note}
    </div>
  </div>
);

const SectionHeader = ({ icon, title, badge }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#eaf1f5] text-[#1d7089] dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-[#132a43] dark:text-white">{title}</h3>
    </div>
    {badge && (
      <span className="text-[10.5px] font-mono font-semibold text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
        {badge}
      </span>
    )}
  </div>
);

const Avatar = ({ name }) => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1d7089] to-[#132a43] flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm">
    {(name || 'NA').slice(0, 2).toUpperCase()}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === 'Present'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20'
      : status === 'Late'
      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
      : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wide ${styles}`}>
      {status}
    </span>
  );
};

const PulseRow = ({ icon, label, value, pct, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-xs font-bold text-[#132a43] dark:text-white">{value}</span>
    </div>
    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const LoadingState = ({ label }) => (
  <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
    <div className="w-8 h-8 border-[3px] border-[#1d7089] border-t-transparent rounded-full animate-spin" />
    {label}
  </div>
);

const EmptyState = ({ icon, label }) => (
  <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-600 shadow-sm">
      {icon}
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
  </div>
);

export default ManagerDashboard;