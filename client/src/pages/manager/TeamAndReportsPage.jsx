import React, { useState, useEffect, useMemo } from "react";
import {
  Users, UserCheck, CalendarOff, Home, Search, LayoutGrid, List, Clock,
  Mail, MessageSquare, ClipboardList, UserCircle2, AlertCircle, ChevronDown,
  X, Send, Briefcase, CheckCircle2, Filter, Target, CalendarDays, Phone,
  Network, RotateCcw, Trash2, Plus, Info, UserPlus, Edit2, Eye, Save, Check,
  SlidersHorizontal, ChevronLeft, ChevronRight, FileText
} from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import demoAvatars from "../../utils/avatars";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEmployeeInspection } from "../../context/EmployeeInspectionContext";

// eslint-disable-next-line no-unused-vars
/* ---------- LOCKED THEME COLORS ----------
   LIGHT: bg #EAF3F7 | card #FFFFFF | navy #20384D | teal #2B89A3
          hover #236F86 | light fill #DCEBF0 | muted #6B8795 | border #C4D9E1
   DARK:  bg #0D1B26 | card #152A3A | inner #132433 | text #E8F2F7
          muted #8AA6B5 | border #24455C / #2A4A63 | accent text #8FC8D9
   NOTE: No red / green / amber anywhere. Only navy + teal tones.
------------------------------------------ */

const TEAM_SCOPES = ['Direct Reports', 'Extended Team'];
const SHIFTS = ['All Shifts', 'General Shift', 'Night Shift', 'Rotational'];
const SKILLS = ['All Skills', 'Frontend', 'Backend', 'QA', 'DevOps', 'UI/UX'];
const STATUS_TABS = ['All', 'Present', 'WFH', 'On Leave'];

const STATUS_STYLE = {
  Present: {
    dot: 'bg-[#2B89A3]',
    badge: 'bg-[#2B89A3] text-white border border-[#2B89A3]',
    icon: UserCheck,
  },
  WFH: {
    dot: 'bg-[#5FA8C0]',
    badge:
      'bg-[#DCEBF0] text-[#20384D] border border-[#A9C8D4] dark:bg-[#2B89A3]/15 dark:text-[#8FC8D9] dark:border-[#2B89A3]/30',
    icon: Home,
  },
  'On Leave': {
    dot: 'bg-[#8AA6B5]',
    badge:
      'bg-[#E8F0F3] text-[#5B7482] border border-[#C4D6DE] dark:bg-white/5 dark:text-[#8AA6B5] dark:border-[#2A4A63]',
    icon: CalendarOff,
  },
};

// ---- MOCK TEAM DATA ----
const INITIAL_TEAM = [
  {
    _id: 't1', empId: 'WZ-1042', name: 'Elena Rostova', designation: 'Senior React Developer',
    email: 'elena.rostova@workzen.io', phone: '+919822041122', skill: 'Frontend', shift: 'General Shift',
    scope: 'Direct Reports', status: 'Present', punchIn: '09:14 AM', leaveType: '',
    leaveBalance: { pl: 8, cl: 4 }, pendingAction: 'Leave request pending approval',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't2', empId: 'WZ-1077', name: 'Kabir Sethi', designation: 'Backend Engineer II',
    email: 'kabir.sethi@workzen.io', phone: '+919811177320', skill: 'Backend', shift: 'General Shift',
    scope: 'Direct Reports', status: 'Present', punchIn: '09:02 AM', leaveType: '',
    leaveBalance: { pl: 11, cl: 6 }, pendingAction: '',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't3', empId: 'WZ-1090', name: 'Priya Kapoor', designation: 'QA Automation Analyst',
    email: 'priya.kapoor@workzen.io', phone: '+919930055418', skill: 'QA', shift: 'Night Shift',
    scope: 'Direct Reports', status: 'On Leave', punchIn: '', leaveType: 'Sick Leave',
    leaveBalance: { pl: 5, cl: 2 }, pendingAction: 'Attendance regularization pending',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't4', empId: 'WZ-1103', name: 'Marcus Vance', designation: 'Product Designer',
    email: 'marcus.vance@workzen.io', phone: '+919740012200', skill: 'UI/UX', shift: 'General Shift',
    scope: 'Direct Reports', status: 'WFH', punchIn: '09:45 AM', leaveType: '',
    leaveBalance: { pl: 9, cl: 5 }, pendingAction: '',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't5', empId: 'WZ-1118', name: 'Siddharth Nair', designation: 'DevOps Engineer',
    email: 'siddharth.nair@workzen.io', phone: '+919004488210', skill: 'DevOps', shift: 'Rotational',
    scope: 'Direct Reports', status: 'Present', punchIn: '08:55 AM', leaveType: '',
    leaveBalance: { pl: 14, cl: 7 }, pendingAction: '',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't6', empId: 'WZ-1126', name: 'Ananya Sharma', designation: 'Frontend Developer',
    email: 'ananya.sharma@workzen.io', phone: '+919876532109', skill: 'Frontend', shift: 'General Shift',
    scope: 'Direct Reports', status: 'Present', punchIn: '09:20 AM', leaveType: '',
    leaveBalance: { pl: 6, cl: 3 }, pendingAction: 'Leave request pending approval',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't7', empId: 'WZ-1134', name: 'Rhea Sengupta', designation: 'Junior QA Engineer',
    email: 'rhea.sengupta@workzen.io', phone: '+919311066408', skill: 'QA', shift: 'Night Shift',
    scope: 'Extended Team', status: 'Present', punchIn: '10:02 PM', leaveType: '',
    leaveBalance: { pl: 4, cl: 5 }, pendingAction: '',
    avatar: '', tasks: [], notes: [], messages: [],
  },
  {
    _id: 't8', empId: 'WZ-1141', name: 'Devika Menon', designation: 'Associate Backend Dev',
    email: 'devika.menon@workzen.io', phone: '+919633074125', skill: 'Backend', shift: 'General Shift',
    scope: 'Extended Team', status: 'WFH', punchIn: '09:33 AM', leaveType: '',
    leaveBalance: { pl: 7, cl: 4 }, pendingAction: '',
    avatar: '', tasks: [], notes: [], messages: [],
  },
];

const MyTeamPage = () => {
  const toast = useToast();

  const [allTeam, setAllTeam] = useState(INITIAL_TEAM);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [scope, setScope] = useState('Direct Reports');
  const [viewMode, setViewMode] = useState('grid');
  const [statusTab, setStatusTab] = useState('All');
  const [shiftFilter, setShiftFilter] = useState('All Shifts');
  const [skillFilter, setSkillFilter] = useState('All Skills');
  const [search, setSearch] = useState('');

  // Drawer + panels
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview | tasks | notes | chat
  const [taskText, setTaskText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [msgText, setMsgText] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedMember = useMemo(
    () => allTeam.find((m) => m._id === selectedId) || null,
    [allTeam, selectedId]
  );

  const scopedTeam = useMemo(
    () =>
      scope === 'Direct Reports'
        ? allTeam.filter((m) => m.scope === 'Direct Reports')
        : allTeam,
    [allTeam, scope]
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...scopedTeam];
      if (statusTab !== 'All') filtered = filtered.filter((m) => m.status === statusTab);
      if (shiftFilter !== 'All Shifts') filtered = filtered.filter((m) => m.shift === shiftFilter);
      if (skillFilter !== 'All Skills') filtered = filtered.filter((m) => m.skill === skillFilter);
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        filtered = filtered.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.empId.toLowerCase().includes(q) ||
            m.designation.toLowerCase().includes(q)
        );
      }
      setTeam(filtered);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [scopedTeam, statusTab, shiftFilter, skillFilter, search]);

  const metrics = useMemo(
    () => ({
      total: scopedTeam.length,
      present: scopedTeam.filter((m) => m.status === 'Present').length,
      onLeave: scopedTeam.filter((m) => m.status === 'On Leave').length,
      wfh: scopedTeam.filter((m) => m.status === 'WFH').length,
    }),
    [scopedTeam]
  );

  const statusCounts = useMemo(
    () => ({
      All: scopedTeam.length,
      Present: scopedTeam.filter((m) => m.status === 'Present').length,
      WFH: scopedTeam.filter((m) => m.status === 'WFH').length,
      'On Leave': scopedTeam.filter((m) => m.status === 'On Leave').length,
    }),
    [scopedTeam]
  );

  const pendingCount = useMemo(
    () => scopedTeam.filter((m) => m.pendingAction).length,
    [scopedTeam]
  );

  const filtersActive =
    statusTab !== 'All' || shiftFilter !== 'All Shifts' || skillFilter !== 'All Skills' || search.trim();

  /* ---------- ACTIONS (all wired) ---------- */
  const updateMember = (id, updater) =>
    setAllTeam((prev) => prev.map((m) => (m._id === id ? { ...m, ...updater(m) } : m)));

  const openDrawer = (member, tab = 'overview') => {
    setSelectedId(member._id);
    setActiveTab(tab);
    setTaskText('');
    setNoteText('');
    setMsgText('');
    setHint('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setHint('');
  };

  const resetFilters = () => {
    setStatusTab('All');
    setShiftFilter('All Shifts');
    setSkillFilter('All Skills');
    setSearch('');
    toast.success('Filters cleared');
  };

  const sendEmail = (member) => {
    window.location.href = `mailto:${member.email}?subject=${encodeURIComponent('Quick check-in')}`;
    toast.success(`Email draft opened for ${member.name}`);
  };

  const callMember = (member) => {
    window.location.href = `tel:${member.phone}`;
    toast.success(`Calling ${member.name}`);
  };

  const assignTask = () => {
    if (!taskText.trim()) return setHint('Please enter a task title first.');
    setBusy(true);
    setTimeout(() => {
      updateMember(selectedMember._id, (m) => ({
        tasks: [
          { id: Date.now(), title: taskText.trim(), done: false, at: new Date().toISOString() },
          ...m.tasks,
        ],
      }));
      setTaskText('');
      setHint('');
      setBusy(false);
      toast.success('Task assigned successfully');
    }, 300);
  };

  const toggleTask = (taskId) =>
    updateMember(selectedMember._id, (m) => ({
      tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    }));

  const deleteTask = (taskId) => {
    updateMember(selectedMember._id, (m) => ({ tasks: m.tasks.filter((t) => t.id !== taskId) }));
    toast.success('Task removed');
  };

  const saveNote = () => {
    if (!noteText.trim()) return setHint('Please write a note before saving.');
    setBusy(true);
    setTimeout(() => {
      updateMember(selectedMember._id, (m) => ({
        notes: [{ id: Date.now(), text: noteText.trim(), at: new Date().toISOString() }, ...m.notes],
      }));
      setNoteText('');
      setHint('');
      setBusy(false);
      toast.success('1-on-1 note saved');
    }, 300);
  };

  const deleteNote = (noteId) => {
    updateMember(selectedMember._id, (m) => ({ notes: m.notes.filter((n) => n.id !== noteId) }));
    toast.success('Note deleted');
  };

  const sendMessage = () => {
    if (!msgText.trim()) return setHint('Type a message to send.');
    updateMember(selectedMember._id, (m) => ({
      messages: [...m.messages, { id: Date.now(), text: msgText.trim(), at: new Date().toISOString() }],
    }));
    setMsgText('');
    setHint('');
    toast.success('Message sent');
  };

  const resolvePending = (member) => {
    updateMember(member._id, () => ({ pendingAction: '' }));
    toast.success(`Pending item resolved for ${member.name}`);
  };

  /* ---------- SHARED CLASSES ---------- */
  const selectClass =
    'h-10 pl-3 pr-8 bg-[#F5FAFC] dark:bg-[#132433] rounded-xl text-xs font-semibold text-[#20384D] dark:text-[#E8F2F7] border border-[#C4D9E1] dark:border-[#2A4A63] focus:outline-none focus:ring-2 focus:ring-[#2B89A3]/25 appearance-none cursor-pointer transition-colors duration-300';
  const ghostBtn =
    'rounded-xl flex items-center justify-center text-[#20384D] dark:text-[#8FC8D9] bg-white dark:bg-[#1A3247] border border-[#C4D9E1] dark:border-[#2A4A63] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50] active:scale-95 transition-all';

  return (
    <div className="relative space-y-6 min-h-screen bg-[#EAF3F7] dark:bg-[#0D1B26] -m-4 sm:-m-6 p-4 sm:p-6 text-[#20384D] dark:text-[#E8F2F7] transition-colors duration-300">
      <div className="absolute -top-16 right-10 w-96 h-96 bg-[#2B89A3]/10 dark:bg-[#2B89A3]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/3 w-80 h-80 bg-[#20384D]/5 dark:bg-[#2B89A3]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 rounded-full bg-[#2B89A3]" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">My Team</h2>
            <p className="text-[#6B8795] dark:text-[#8AA6B5] text-sm mt-0.5">
              Track real-time availability, attendance and work status of your reporting team.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 h-10 rounded-xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] text-xs font-semibold text-[#496A7A] dark:text-[#A9C4D2]">
            <CalendarDays className="w-3.5 h-3.5 text-[#2B89A3]" />
            {format(new Date(), 'EEE, dd MMM yyyy')}
          </div>
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => { setStatusTab('All'); toast.success(`${pendingCount} member(s) need your action`); }}
              className="flex items-center gap-1.5 px-3 h-10 rounded-xl bg-[#DCEBF0] dark:bg-[#1E3A50] border border-[#A9C8D4] dark:border-[#2A4A63] text-xs font-bold text-[#20384D] dark:text-[#8FC8D9] hover:bg-[#C4DDE5] dark:hover:bg-[#264B66] active:scale-95 transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {pendingCount} Pending Action{pendingCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* ---------- A. DAILY ROSTER SNAPSHOT (clickable) ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { key: 'All', label: 'Total Team Strength', sub: 'Members', value: metrics.total, Icon: Users, solid: true },
          { key: 'Present', label: 'Present Today', sub: 'In shift / Punched in', value: metrics.present, Icon: UserCheck, solid: false },
          { key: 'On Leave', label: 'On Leave / Planned Off', sub: 'CL / SL / PL', value: metrics.onLeave, Icon: CalendarOff, solid: false },
          { key: 'WFH', label: 'Remote / WFH', sub: 'WFH / On-duty', value: metrics.wfh, Icon: Home, solid: false },
        ].map(({ key, label, sub, value, Icon, solid }) => {
          const active = statusTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setStatusTab(key)}
              className={`text-left relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#152A3A] border shadow-sm hover:shadow-md active:scale-[0.98] transition-all ${
                active
                  ? 'border-[#2B89A3] ring-2 ring-[#2B89A3]/20'
                  : 'border-[#C4D9E1] dark:border-[#24455C] hover:border-[#2B89A3]/60'
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${solid ? 'bg-[#20384D] dark:bg-[#3D6E8C]' : 'bg-[#2B89A3]'}`} />
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  solid
                    ? 'bg-[#20384D] dark:bg-[#3D6E8C] text-white'
                    : active
                    ? 'bg-[#2B89A3] text-white'
                    : 'bg-[#DCEBF0] dark:bg-[#1E3A50] text-[#20384D] dark:text-[#8FC8D9]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-[#6B8795] dark:text-[#8AA6B5] font-bold uppercase tracking-wider">{label}</span>
              <div className="flex items-end gap-2 mt-1">
                <div className="text-3xl font-black">{value}</div>
                <span className="text-[11px] font-semibold text-[#6B8795] dark:text-[#8AA6B5] mb-1.5">{sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ---------- B. VIEW CONTROLS & TABS ---------- */}
      <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4 space-y-4 shadow-sm transition-colors duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-[#D9E7EC] dark:border-[#24455C]">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#2B89A3]" />
            <div className="flex items-center p-1 rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63]">
              {TEAM_SCOPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  className={`px-3.5 h-8 rounded-lg text-xs font-bold active:scale-95 transition-all ${
                    scope === s
                      ? 'bg-[#2B89A3] text-white shadow-sm'
                      : 'text-[#496A7A] dark:text-[#A9C4D2] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#6B8795] dark:text-[#8AA6B5]">
              <Filter className="w-3.5 h-3.5" /> Filters
            </div>

            <div className="relative">
              <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className={selectClass}>
                {SHIFTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#527080] dark:text-[#8AA6B5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className={selectClass}>
                {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#527080] dark:text-[#8AA6B5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {filtersActive && (
              <button type="button" onClick={resetFilters} title="Reset filters" className={`${ghostBtn} h-10 px-3 gap-1.5 text-xs font-bold`}>
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}

            <div className="flex items-center p-1 rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63]">
              <button
                type="button" onClick={() => setViewMode('grid')} title="Grid view"
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-all ${
                  viewMode === 'grid' ? 'bg-[#2B89A3] text-white' : 'text-[#496A7A] dark:text-[#A9C4D2] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button" onClick={() => setViewMode('table')} title="Table view"
                className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-all ${
                  viewMode === 'table' ? 'bg-[#2B89A3] text-white' : 'text-[#496A7A] dark:text-[#A9C4D2] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_TABS.map((tab) => {
              const isActive = statusTab === tab;
              const TabIcon = STATUS_STYLE[tab]?.icon;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusTab(tab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border active:scale-95 transition-all ${
                    isActive
                      ? 'bg-[#20384D] dark:bg-[#2B89A3] text-white border-[#20384D] dark:border-[#2B89A3] shadow-sm'
                      : 'bg-white dark:bg-[#1A3247] text-[#496A7A] dark:text-[#A9C4D2] border-[#B8D0DA] dark:border-[#2A4A63] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]'
                  }`}
                >
                  {TabIcon && <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#2B89A3] dark:text-[#6FB9CD]'}`} />}
                  <span>{tab === 'All' ? 'All Members' : tab}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#DCEBF0] dark:bg-[#2B89A3]/20 text-[#20384D] dark:text-[#8FC8D9]'
                  }`}>
                    {statusCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-[#6B8795] dark:text-[#8AA6B5] absolute inset-y-0 left-4 my-auto" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, employee ID or designation..."
              className="w-full h-11 pl-11 pr-10 bg-[#F5FAFC] dark:bg-[#132433] rounded-xl text-sm placeholder-[#78929F] dark:placeholder-[#5F8093] border border-[#C4D9E1] dark:border-[#2A4A63] focus:outline-none focus:ring-2 focus:ring-[#2B89A3]/25 transition-colors duration-300"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[#6B8795] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- C. CARDS / TABLE ---------- */}
      {loading ? (
        <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-16 flex flex-col items-center gap-3 text-[#6B8795] dark:text-[#8AA6B5] shadow-sm">
          <div className="w-7 h-7 border-2 border-[#2B89A3] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading today's team roster...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-16 flex flex-col items-center gap-3 shadow-sm">
          <span className="text-xs font-medium text-[#6B8795] dark:text-[#8AA6B5]">No team members match the selected filters.</span>
          <button type="button" onClick={resetFilters} className="h-9 px-4 rounded-xl bg-[#2B89A3] hover:bg-[#236F86] text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all">
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.map((m) => {
            const st = STATUS_STYLE[m.status];
            const StatusIcon = st.icon;
            return (
              <div
                key={m._id}
                onClick={() => openDrawer(m)}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] shadow-sm hover:shadow-lg hover:border-[#2B89A3]/60 transition-all cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#2B89A3]" />

                <div className="p-5 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img src={m.avatar || demoAvatars.generic(m.name?.slice(0, 2))} alt={m.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#2B89A3] ring-offset-2 ring-offset-white dark:ring-offset-[#152A3A]" />
                      <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-[#152A3A] ${st.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold leading-tight truncate">{m.name}</h3>
                      <p className="text-[11px] text-[#496A7A] dark:text-[#A9C4D2] font-semibold mt-0.5 truncate">{m.designation}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#DCEBF0] dark:bg-[#1E3A50] text-[#20384D] dark:text-[#8FC8D9]">{m.empId}</span>
                        <span className="text-[10px] font-semibold text-[#6B8795] dark:text-[#8AA6B5]">{m.skill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${st.badge}`}>
                      <StatusIcon className="w-3 h-3" />
                      {m.status === 'On Leave' ? m.leaveType || 'On Leave' : m.status}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#6B8795] dark:text-[#8AA6B5]">
                      <Clock className="w-3 h-3" />
                      {m.punchIn ? `Punched in ${m.punchIn}` : 'No punch today'}
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63] px-3 py-2">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Paid Leave</span>
                    <span className="text-sm font-black">{m.leaveBalance.pl}<span className="text-[10px] font-semibold text-[#6B8795] dark:text-[#8AA6B5]"> left</span></span>
                  </div>
                  <div className="rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63] px-3 py-2">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Casual Leave</span>
                    <span className="text-sm font-black">{m.leaveBalance.cl}<span className="text-[10px] font-semibold text-[#6B8795] dark:text-[#8AA6B5]"> left</span></span>
                  </div>
                </div>

                {(m.tasks.length > 0 || m.notes.length > 0) && (
                  <div className="px-5 pb-3 flex items-center gap-2">
                    {m.tasks.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DCEBF0] dark:bg-[#1E3A50] text-[#20384D] dark:text-[#8FC8D9]">
                        <ClipboardList className="w-2.5 h-2.5" /> {m.tasks.filter((t) => !t.done).length} open task(s)
                      </span>
                    )}
                    {m.notes.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63] text-[#496A7A] dark:text-[#A9C4D2]">
                        {m.notes.length} note(s)
                      </span>
                    )}
                  </div>
                )}

                {m.pendingAction && (
                  <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl bg-[#DCEBF0] dark:bg-[#1E3A50] border border-[#A9C8D4] dark:border-[#2A4A63] px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <AlertCircle className="w-3.5 h-3.5 text-[#2B89A3] dark:text-[#6FB9CD] mt-0.5 shrink-0" />
                    <span className="flex-1 text-[10px] font-semibold text-[#20384D] dark:text-[#8FC8D9] leading-snug">{m.pendingAction}</span>
                    <button type="button" onClick={() => resolvePending(m)} title="Mark resolved"
                      className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#2B89A3] hover:bg-[#236F86] text-white active:scale-95 transition-all">
                      Resolve
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-1.5 px-5 py-3 border-t border-[#D9E7EC] dark:border-[#24455C] bg-[#F5FAFC] dark:bg-[#132433]" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => openDrawer(m, 'overview')}
                    className="flex-1 h-9 rounded-xl bg-[#2B89A3] hover:bg-[#236F86] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                    <UserCircle2 className="w-3.5 h-3.5" /> 1:1 Profile
                  </button>
                  <button type="button" title="Message" onClick={() => openDrawer(m, 'chat')} className={`${ghostBtn} w-9 h-9`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" title="Email" onClick={() => sendEmail(m)} className={`${ghostBtn} w-9 h-9`}>
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" title="Assign task" onClick={() => openDrawer(m, 'tasks')} className={`${ghostBtn} w-9 h-9`}>
                    <ClipboardList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] overflow-hidden shadow-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#20384D] dark:bg-[#1A3247] text-white uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">Designation</th>
                  <th className="px-4 py-3.5">Shift / Skill</th>
                  <th className="px-4 py-3.5">Today's Status</th>
                  <th className="px-4 py-3.5">Leave Balance</th>
                  <th className="px-4 py-3.5">Pending Action</th>
                  <th className="px-6 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E7EC] dark:divide-[#24455C] font-medium">
                {team.map((m) => {
                  const st = STATUS_STYLE[m.status];
                  const StatusIcon = st.icon;
                  return (
                    <tr key={m._id} onClick={() => openDrawer(m)} className="hover:bg-[#F0F7F9] dark:hover:bg-[#1A3247]/60 transition-colors cursor-pointer">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img src={m.avatar || demoAvatars.generic(m.name?.slice(0, 2))} alt={m.name}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#2B89A3] ring-offset-2 ring-offset-white dark:ring-offset-[#152A3A]" />
                            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#152A3A] ${st.dot}`} />
                          </div>
                          <div>
                            <div className="text-sm font-bold leading-tight">{m.name}</div>
                            <div className="text-[10px] font-mono text-[#78929F] dark:text-[#8AA6B5] mt-0.5">{m.empId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#496A7A] dark:text-[#A9C4D2] font-semibold">{m.designation}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DCEBF0] dark:bg-[#1E3A50] text-[#20384D] dark:text-[#8FC8D9]">
                            <Clock className="w-2.5 h-2.5" /> {m.shift}
                          </span>
                          <span className="inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5FAFC] dark:bg-[#132433] text-[#496A7A] dark:text-[#A9C4D2] border border-[#C4D9E1] dark:border-[#2A4A63]">
                            <Briefcase className="w-2.5 h-2.5" /> {m.skill}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${st.badge}`}>
                          <StatusIcon className="w-3 h-3" />
                          {m.status === 'On Leave' ? m.leaveType || 'On Leave' : m.status}
                        </span>
                        <div className="text-[10px] font-mono text-[#6B8795] dark:text-[#8AA6B5] mt-1">
                          {m.punchIn ? `Punched in ${m.punchIn}` : 'No punch today'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63]">PL {m.leaveBalance.pl}</span>
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63]">CL {m.leaveBalance.cl}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        {m.pendingAction ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#DCEBF0] dark:bg-[#1E3A50] text-[#20384D] dark:text-[#8FC8D9] border border-[#A9C8D4] dark:border-[#2A4A63]">
                              <AlertCircle className="w-3 h-3" /> {m.pendingAction}
                            </span>
                            <button type="button" onClick={() => resolvePending(m)}
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-[#2B89A3] hover:bg-[#236F86] text-white active:scale-95 transition-all">
                              Resolve
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6B8795] dark:text-[#8AA6B5]">
                            <CheckCircle2 className="w-3 h-3 text-[#2B89A3]" /> No pending items
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" title="1:1 Profile" onClick={() => openDrawer(m, 'overview')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2B89A3] text-white hover:bg-[#236F86] active:scale-95 transition-all">
                            <UserCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" title="Message" onClick={() => openDrawer(m, 'chat')} className={`${ghostBtn} w-8 h-8`}>
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" title="Email" onClick={() => sendEmail(m)} className={`${ghostBtn} w-8 h-8`}>
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" title="Assign task" onClick={() => openDrawer(m, 'tasks')} className={`${ghostBtn} w-8 h-8`}>
                            <ClipboardList className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- DRAWER ---------- */}
      <div onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-[#20384D]/55 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} />

      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#F5FAFC] dark:bg-[#132433] shadow-2xl transform transition-all duration-300 ease-out flex flex-col ${
        drawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {selectedMember && (
          <>
            <div className="relative bg-[#20384D] dark:bg-[#1A3247] px-6 pt-6 pb-5 shrink-0">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2B89A3]" />
              <button onClick={closeDrawer} className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-[#BFD7E0] uppercase tracking-wider">Team Member Profile</span>
              <div className="flex items-center gap-3 mt-3">
                <div className="relative shrink-0">
                  <img src={selectedMember.avatar || demoAvatars.generic(selectedMember.name?.slice(0, 2))} alt={selectedMember.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-[#70B4C6]" />
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#20384D] dark:border-[#1A3247] ${STATUS_STYLE[selectedMember.status].dot}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white leading-tight truncate">{selectedMember.name}</h3>
                  <p className="text-xs text-[#BFD7E0] truncate">{selectedMember.designation}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-[#BFD7E0]">{selectedMember.empId}</span>
                </div>
              </div>

              {/* Drawer tabs */}
              <div className="flex items-center gap-1 mt-4 p-1 rounded-xl bg-white/10">
                {[
                  { k: 'overview', l: 'Overview' },
                  { k: 'tasks', l: `Tasks (${selectedMember.tasks.length})` },
                  { k: 'notes', l: `Notes (${selectedMember.notes.length})` },
                  { k: 'chat', l: 'Message' },
                ].map((t) => (
                  <button key={t.k} type="button" onClick={() => { setActiveTab(t.k); setHint(''); }}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-bold active:scale-95 transition-all ${
                      activeTab === t.k ? 'bg-[#2B89A3] text-white' : 'text-[#BFD7E0] hover:bg-white/10'
                    }`}>
                    {t.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {hint && (
                <div className="flex items-center gap-2 rounded-xl bg-[#DCEBF0] dark:bg-[#1E3A50] border border-[#A9C8D4] dark:border-[#2A4A63] px-3 py-2">
                  <Info className="w-3.5 h-3.5 text-[#2B89A3] dark:text-[#6FB9CD] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#20384D] dark:text-[#8FC8D9]">{hint}</span>
                </div>
              )}

              {/* OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Current Day Status</span>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLE[selectedMember.status].badge}`}>
                        {React.createElement(STATUS_STYLE[selectedMember.status].icon, { className: 'w-3 h-3' })}
                        {selectedMember.status === 'On Leave' ? selectedMember.leaveType || 'On Leave' : selectedMember.status}
                      </span>
                      <span className="text-[11px] font-mono text-[#6B8795] dark:text-[#8AA6B5]">
                        {selectedMember.punchIn ? `Punched in ${selectedMember.punchIn}` : 'No punch today'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63] px-3 py-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Shift</span>
                        <span className="text-xs font-bold">{selectedMember.shift}</span>
                      </div>
                      <div className="rounded-xl bg-[#F5FAFC] dark:bg-[#132433] border border-[#C4D9E1] dark:border-[#2A4A63] px-3 py-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Skill</span>
                        <span className="text-xs font-bold">{selectedMember.skill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Leave Balance Summary</span>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="rounded-xl bg-[#DCEBF0] dark:bg-[#1E3A50] px-3 py-2.5">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#20384D] dark:text-[#8FC8D9]">Paid Leave (PL)</span>
                        <span className="text-lg font-black">{selectedMember.leaveBalance.pl}</span>
                      </div>
                      <div className="rounded-xl bg-[#DCEBF0] dark:bg-[#1E3A50] px-3 py-2.5">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#20384D] dark:text-[#8FC8D9]">Casual Leave (CL)</span>
                        <span className="text-lg font-black">{selectedMember.leaveBalance.cl}</span>
                      </div>
                    </div>
                  </div>

                  {selectedMember.pendingAction && (
                    <div className="rounded-2xl bg-[#DCEBF0] dark:bg-[#1E3A50] border border-[#A9C8D4] dark:border-[#2A4A63] p-4">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-[#2B89A3] dark:text-[#6FB9CD] mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#20384D] dark:text-[#8FC8D9]">Pending Action Alert</span>
                          <p className="text-xs font-semibold mt-1">{selectedMember.pendingAction}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => resolvePending(selectedMember)}
                        className="w-full h-9 mt-3 rounded-xl bg-[#2B89A3] hover:bg-[#236F86] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Resolved
                      </button>
                    </div>
                  )}

                  <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">Contact</span>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-[#496A7A] dark:text-[#A9C4D2]">
                        <Mail className="w-3.5 h-3.5 text-[#2B89A3]" /> {selectedMember.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#496A7A] dark:text-[#A9C4D2]">
                        <Phone className="w-3.5 h-3.5 text-[#2B89A3]" /> {selectedMember.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button type="button" onClick={() => setActiveTab('chat')} className={`${ghostBtn} flex-1 h-9 gap-1.5 text-xs font-semibold`}>
                        <MessageSquare className="w-3.5 h-3.5" /> Message
                      </button>
                      <button type="button" onClick={() => sendEmail(selectedMember)} className={`${ghostBtn} flex-1 h-9 gap-1.5 text-xs font-semibold`}>
                        <Mail className="w-3.5 h-3.5" /> Email
                      </button>
                      <button type="button" onClick={() => callMember(selectedMember)} className={`${ghostBtn} w-9 h-9`} title="Call">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TASKS */}
              {activeTab === 'tasks' && (
                <>
                  <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4 space-y-2.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">
                      <Target className="w-3.5 h-3.5 text-[#2B89A3]" /> Assign New Task
                    </span>
                    <input type="text" value={taskText} onChange={(e) => { setTaskText(e.target.value); setHint(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && assignTask()}
                      placeholder="e.g. Complete sprint API integration"
                      className="w-full h-10 px-3 bg-[#F5FAFC] dark:bg-[#0D1B26] rounded-xl text-xs placeholder-[#78929F] dark:placeholder-[#5F8093] font-medium border border-[#A9C8D4] dark:border-[#2A4A63] focus:outline-none focus:ring-2 focus:ring-[#2B89A3]/30 transition-colors" />
                    <button type="button" onClick={assignTask} disabled={busy}
                      className="w-full h-10 rounded-xl bg-[#2B89A3] hover:bg-[#236F86] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#2B89A3]/20 disabled:opacity-50 active:scale-95 transition-all">
                      {busy ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Assign Task
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedMember.tasks.length === 0 ? (
                      <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-8 text-center text-[11px] font-medium text-[#6B8795] dark:text-[#8AA6B5]">
                        No tasks assigned yet.
                      </div>
                    ) : (
                      selectedMember.tasks.map((t) => (
                        <div key={t.id} className="flex items-start gap-2.5 rounded-xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] px-3 py-2.5">
                          <button type="button" onClick={() => toggleTask(t.id)}
                            className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center active:scale-90 transition-all ${
                              t.done ? 'bg-[#2B89A3] border-[#2B89A3] text-white' : 'border-[#A9C8D4] dark:border-[#2A4A63] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50]'
                            }`}>
                            {t.done && <CheckCircle2 className="w-3 h-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold leading-snug ${t.done ? 'line-through text-[#6B8795] dark:text-[#8AA6B5]' : ''}`}>{t.title}</p>
                            <span className="text-[10px] font-mono text-[#6B8795] dark:text-[#8AA6B5]">{format(new Date(t.at), 'dd MMM, hh:mm a')}</span>
                          </div>
                          <button type="button" onClick={() => deleteTask(t.id)} title="Delete"
                            className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-[#6B8795] dark:text-[#8AA6B5] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50] active:scale-90 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* NOTES */}
              {activeTab === 'notes' && (
                <>
                  <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4 space-y-2.5">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">
                      <ClipboardList className="w-3.5 h-3.5 text-[#2B89A3]" /> New 1-on-1 Note
                    </span>
                    <textarea rows={4} value={noteText} onChange={(e) => { setNoteText(e.target.value); setHint(''); }}
                      placeholder="Write discussion points, feedback or goals for the next 1:1 meeting..."
                      className="w-full px-3 py-2.5 bg-[#F5FAFC] dark:bg-[#0D1B26] rounded-xl text-xs placeholder-[#78929F] dark:placeholder-[#5F8093] font-medium border border-[#A9C8D4] dark:border-[#2A4A63] focus:outline-none focus:ring-2 focus:ring-[#2B89A3]/30 resize-none transition-colors" />
                    <button type="button" onClick={saveNote} disabled={busy}
                      className="w-full h-10 rounded-xl bg-[#20384D] dark:bg-[#2B89A3] hover:bg-[#182C3D] dark:hover:bg-[#236F86] text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-all">
                      {busy ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Save Note
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedMember.notes.length === 0 ? (
                      <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-8 text-center text-[11px] font-medium text-[#6B8795] dark:text-[#8AA6B5]">
                        No 1-on-1 notes recorded yet.
                      </div>
                    ) : (
                      selectedMember.notes.map((n) => (
                        <div key={n.id} className="relative rounded-xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] px-3 py-2.5 pr-9">
                          <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{n.text}</p>
                          <span className="block mt-1.5 text-[10px] font-mono text-[#6B8795] dark:text-[#8AA6B5]">{format(new Date(n.at), 'dd MMM yyyy, hh:mm a')}</span>
                          <button type="button" onClick={() => deleteNote(n.id)} title="Delete note"
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center text-[#6B8795] dark:text-[#8AA6B5] hover:bg-[#DCEBF0] dark:hover:bg-[#1E3A50] active:scale-90 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* CHAT */}
              {activeTab === 'chat' && (
                <div className="rounded-2xl bg-white dark:bg-[#152A3A] border border-[#C4D9E1] dark:border-[#24455C] p-4 space-y-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6B8795] dark:text-[#8AA6B5]">
                    <MessageSquare className="w-3.5 h-3.5 text-[#2B89A3]" /> Direct Message
                  </span>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {selectedMember.messages.length === 0 ? (
                      <div className="py-8 text-center text-[11px] font-medium text-[#6B8795] dark:text-[#8AA6B5]">
                        No messages yet. Start the conversation.
                      </div>
                    ) : (
                      selectedMember.messages.map((msg) => (
                        <div key={msg.id} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#2B89A3] text-white px-3 py-2">
                          <p className="text-xs font-medium leading-snug">{msg.text}</p>
                          <span className="block mt-1 text-[9px] font-mono text-white/70 text-right">{format(new Date(msg.at), 'hh:mm a')}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input type="text" value={msgText} onChange={(e) => { setMsgText(e.target.value); setHint(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`Message ${selectedMember.name.split(' ')[0]}...`}
                      className="flex-1 h-10 px-3 bg-[#F5FAFC] dark:bg-[#0D1B26] rounded-xl text-xs placeholder-[#78929F] dark:placeholder-[#5F8093] font-medium border border-[#A9C8D4] dark:border-[#2A4A63] focus:outline-none focus:ring-2 focus:ring-[#2B89A3]/30 transition-colors" />
                    <button type="button" onClick={sendMessage}
                      className="w-10 h-10 shrink-0 rounded-xl bg-[#2B89A3] hover:bg-[#236F86] text-white flex items-center justify-center active:scale-95 transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};



/* ---------- THEME ----------
   Primary  : #204A65  (navy blue)
   Hover    : #1A3D54
   Fill soft: #204A65/10
   Grey bg L: #F3F4F6 | Grey bg D: #1F2937
   Grey text: #6B7280 | Border L: #E5E7EB | Border D: #374151
---------------------------- */

const DEPARTMENTS = [
  "Engineering",
  "Product Design",
  "Sales & Marketing",
  "Human Resources",
  "Finance",
];

const STATUSES = ["All", "Active", "Inactive"];

const PAGE_SIZE = 10;

const emptyEmployee = () => ({
  name: "",
  email: "",
  password: "employee123",
  role: "employee",
  department: "Engineering",
  designation: "",
  phone: "+91 ",
  joiningDate: format(new Date(), "yyyy-MM-dd"),
  leaveBalance: { paid: 14, sick: 7, unpaid: 0 },
  address: { street: "", city: "Bengaluru", state: "Karnataka", zip: "" },
  emergencyContact: { name: "", relation: "", phone: "+91 " },
});

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#204A65] focus:outline-none";

const EmployeeDirectoryPage = () => {
  const navigate = useNavigate();
  const { selectEmployee } = useEmployeeInspection();
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDepts, setSelectedDepts] = useState([]); // [] === All
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile rail

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (selectedDepts.length === 1) params.department = selectedDepts[0];

      const res = await api.get("/users", { params });
      if (res.data.success) {
        setEmployees(res.data.employees);
        if (res.data.departments) setDepartments(res.data.departments);
      }
    } catch (error) {
      toast.error("Could not load the directory. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedStatus, selectedDepts.join("|")]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus, selectedDepts.length]);

  const toggleDept = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedDepts([]);
    setSelectedStatus("All");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) || selectedDepts.length > 0 || selectedStatus !== "All";

  const visible = useMemo(() => {
    if (selectedDepts.length <= 1) return employees;
    return employees.filter((e) => selectedDepts.includes(e.department));
  }, [employees, selectedDepts]);

  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const activeCount = visible.filter((e) => e.status === "Active").length;
  const deptTotal = departments.length || DEPARTMENTS.length;

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.designation) {
      toast.error("Name, work email and designation are required.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post("/users", newEmployee);
      if (res.data.success) {
        toast.success(res.data.message);
        setShowAddModal(false);
        setNewEmployee(emptyEmployee());
        fetchEmployees();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not add the employee.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const saveEmployee = async (id, payload, successMessage) => {
    const res = await api.put(`/users/${id}`, payload);
    if (res.data.success) {
      toast.success(successMessage);
      fetchEmployees();
    }
    return res;
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await saveEmployee(
        selectedEmployee._id,
        selectedEmployee,
        "Employee updated",
      );
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save changes.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (employee) => {
    const nextStatus = employee.status === "Active" ? "Inactive" : "Active";
    try {
      await saveEmployee(
        employee._id,
        { ...employee, status: nextStatus },
        `${employee.name} is now ${nextStatus.toLowerCase()}`,
      );
    } catch (error) {
      toast.error("Could not change the status.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ───────────── LEFT RAIL: FILTERS ───────────── */}
      <aside
        className={`w-full lg:w-60 shrink-0 lg:sticky lg:top-6 ${
          filtersOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              Filters
            </div>
            {hasActiveFilters && (
              <span className="text-[11px] font-semibold text-[#204A65] dark:text-[#7BA8C4]">
                {selectedDepts.length +
                  (selectedStatus !== "All" ? 1 : 0) +
                  (search ? 1 : 0)}{" "}
                on
              </span>
            )}
          </div>

          {/* Department */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">
              Department
            </div>
            <div className="space-y-0.5">
              <label className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <input
                  type="checkbox"
                  checked={selectedDepts.length === 0}
                  onChange={() => setSelectedDepts([])}
                  className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                />
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 flex-1">
                  All departments
                </span>
                <span className="text-[11px] text-gray-400 tabular-nums">
                  {employees.length}
                </span>
              </label>

              {DEPARTMENTS.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(dept)}
                    onChange={() => toggleDept(dept)}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate">
                    {dept}
                  </span>
                  <span className="text-[11px] text-gray-400 tabular-nums">
                    {deptCounts[dept] ?? 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">
              Status
            </div>
            <div className="space-y-0.5">
              {STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <input
                    type="radio"
                    name="status-filter"
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus(status)}
                    className="w-3.5 h-3.5 border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {status === "All" ? "Any status" : status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        </div>
      </aside>

      {/* ───────────── MAIN COLUMN ───────────── */}
      <div className="flex-1 min-w-0 w-full space-y-4">
        {/* Search + primary action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 shrink-0"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, employee ID or designation"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs focus:ring-2 focus:ring-[#204A65] focus:outline-none shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white text-xs font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Onboard employee</span>
          </button>
        </div>

        {/* Inline stat strip */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>
            <strong className="text-gray-900 dark:text-gray-100 font-bold tabular-nums">
              {visible.length}
            </strong>{" "}
            total
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>
            <strong className="text-[#204A65] dark:text-[#7BA8C4] font-bold tabular-nums">
              {activeCount}
            </strong>{" "}
            active
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>
            <strong className="text-[#204A65] dark:text-[#7BA8C4] font-bold tabular-nums">
              {selectedDepts.length || deptTotal}
            </strong>{" "}
            {(selectedDepts.length || deptTotal) === 1
              ? "department"
              : "departments"}
          </span>
          {hasActiveFilters && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <button
                onClick={resetFilters}
                className="text-[#204A65] dark:text-[#7BA8C4] font-semibold hover:underline"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-[#204A65] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading the directory</span>
          </div>
        ) : paged.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
            <AlertCircle className="w-7 h-7 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              No one matches these filters
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Widen the department or status filter, or clear the search.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((emp) => (
              <div
                key={emp._id}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-[#204A65]/40 dark:hover:border-[#204A65]/60 transition-all p-4 flex flex-col gap-3 group"
              >
                {/* Header: avatar, name, status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        emp.avatar || demoAvatars.generic(emp.name?.slice(0, 2))
                      }
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#204A65] dark:group-hover:text-[#7BA8C4] transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(emp)}
                    title={`Set to ${emp.status === "Active" ? "Inactive" : "Active"}`}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      emp.status === "Active"
                        ? "bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] border border-[#204A65]/25 hover:bg-[#204A65]/20"
                        : "bg-gray-200/70 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        emp.status === "Active"
                          ? "bg-[#204A65] dark:bg-[#7BA8C4]"
                          : "bg-gray-400"
                      }`}
                    />
                    {emp.status}
                  </button>
                </div>

                {/* ID, role */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    {emp.employeeId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      emp.role === "admin"
                        ? "bg-[#204A65] text-white"
                        : "bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] border border-[#204A65]/25"
                    }`}
                  >
                    {emp.role === "admin" ? "Admin" : "Employee"}
                  </span>
                </div>

                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-semibold text-gray-900 dark:text-gray-200 mt-2">
                    {emp.department}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {emp.designation}
                  </div>
                </div>

                {/* Leave balance */}
                <div className="flex items-center gap-4 text-[11px] text-gray-600 dark:text-gray-300 tabular-nums">
                  <span>
                    <strong className="text-[#204A65] dark:text-[#7BA8C4]">
                      {emp.leaveBalance?.paid || 0}
                    </strong>{" "}
                    paid
                  </span>
                  <span>
                    <strong className="text-[#204A65] dark:text-[#7BA8C4]">
                      {emp.leaveBalance?.sick || 0}
                    </strong>{" "}
                    sick
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-2 mt-auto border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      selectEmployee(emp, "dashboard");
                      navigate("/admin/employee-view");
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#204A65]/10 hover:bg-[#204A65] text-[#204A65] dark:text-[#7BA8C4] hover:text-white border border-[#204A65]/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Context
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setShowViewModal(true);
                    }}
                    title="Quick view"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
                  >
                    <Users className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(JSON.parse(JSON.stringify(emp)));
                      setShowEditModal(true);
                    }}
                    title="Edit details"
                    className="p-2 rounded-lg bg-[#204A65]/15 hover:bg-[#204A65] text-[#204A65] dark:text-[#7BA8C4] hover:text-white transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && visible.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, visible.length)} of{" "}
              {visible.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1,
                )
                .map((n, i, arr) => (
                  <React.Fragment key={n}>
                    {i > 0 && arr[i - 1] !== n - 1 && (
                      <span className="px-1 text-gray-400 text-[11px]">…</span>
                    )}
                    <button
                      onClick={() => setPage(n)}
                      className={`min-w-[26px] h-[26px] px-1.5 rounded-lg text-[11px] font-semibold tabular-nums transition-colors ${
                        n === currentPage
                          ? "bg-[#204A65] text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───────────── MODAL: ADD ───────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Onboard employee
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    They'll be able to sign in as soon as you save.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    placeholder="Ramesh Patel"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    placeholder="ramesh@workzen.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                    className={fieldClass}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin / HR</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.designation}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        designation: e.target.value,
                      })
                    }
                    placeholder="Backend Engineer"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────── MODAL: EDIT ───────────── */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Edit {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEmployee.employeeId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        name: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    value={selectedEmployee.email}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        email: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={selectedEmployee.department}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        department: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.designation}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        designation: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedEmployee.status}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        status: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.phone || ""}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        phone: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────── MODAL: QUICK VIEW ───────────── */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedEmployee.avatar ||
                    demoAvatars.generic(selectedEmployee.name?.slice(0, 2))
                  }
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEmployee.employeeId} ·{" "}
                    {selectedEmployee.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Department
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5">
                    {selectedEmployee.department}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Work email
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5 break-all">
                    {selectedEmployee.email}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Phone
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5">
                    {selectedEmployee.phone || "Not on file"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Status
                  </span>
                  <div
                    className={`font-semibold mt-0.5 ${
                      selectedEmployee.status === "Active"
                        ? "text-[#204A65] dark:text-[#7BA8C4]"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {selectedEmployee.status}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Paid leave
                  </span>
                  <div className="text-lg font-bold text-[#204A65] dark:text-[#7BA8C4]">
                    {selectedEmployee.leaveBalance?.paid || 0} days
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Sick leave
                  </span>
                  <div className="text-lg font-bold text-[#204A65] dark:text-[#7BA8C4]">
                    {selectedEmployee.leaveBalance?.sick || 0} days
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Total
                  </span>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {(selectedEmployee.leaveBalance?.paid || 0) +
                      (selectedEmployee.leaveBalance?.sick || 0)}{" "}
                    days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  selectEmployee(selectedEmployee, "dashboard");
                  navigate("/admin/employee-view");
                }}
                className="px-5 py-2 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Full context
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const TeamAndReportsPage = () => {
  const [activeNavigation, setActiveNavigation] = useState("my-team");

  return (
    <div className="min-h-screen space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: "my-team", label: "My Team", icon: Users },
            { id: "reports", label: "Reports", icon: FileText },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = activeNavigation === id;
            return (
              <button key={id} type="button" onClick={() => setActiveNavigation(id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${isActive ? "text-[#204A65] dark:text-[#7BA8C4]" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"}`}>
                <Icon className="h-4 w-4" />{label}
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isActive ? "bg-[#204A65] dark:bg-[#7BA8C4]" : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>
      </div>
      {activeNavigation === "my-team" ? <MyTeamPage /> : <EmployeeDirectoryPage />}
    </div>
  );
};

export default TeamAndReportsPage;
