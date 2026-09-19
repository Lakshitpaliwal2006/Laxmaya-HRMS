import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Check,
  X,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';

const LeaveApprovalPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [department, setDepartment] = useState('All');
  const [search, setSearch] = useState('');

  // Decision Modal state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decisionType, setDecisionType] = useState('Approved');
  const [adminComment, setAdminComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (department !== 'All') params.department = department;
      if (search) params.search = search;

      const res = await api.get('/leaves/all', { params });
      if (res.data.success) {
        setLeaves(res.data.leaves || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (error) {
      toast.error('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, department]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeaves();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openDecisionModal = (leave, type) => {
    setSelectedLeave(leave);
    setDecisionType(type);
    setAdminComment(
      type === 'Approved'
        ? 'Approved. Have a good time off!'
        : 'Unfortunately, your request cannot be accommodated due to current deliverables.'
    );
    setShowModal(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    setActionLoading(true);
    try {
      const res = await api.put(`/leaves/${selectedLeave._id}/status`, {
        status: decisionType,
        adminComment,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowModal(false);
        fetchLeaves();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update leave status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/25">
            <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className='flex flex-col gap-4'>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Leave Approvals
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review employee leave requests, approve quotas, and add administrative remarks.
        </p>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Pending Review', stats.pending, 'text-amber-600 dark:text-amber-400', Clock],
          ['Approved Leaves', stats.approved, 'text-emerald-600 dark:text-emerald-400', CheckCircle2],
          ['Rejected', stats.rejected, 'text-rose-600 dark:text-rose-400', XCircle],
          ['Total Requests', stats.total, 'text-brand-600 dark:text-brand-400', CalendarDays],
        ].map(([label, value, color, Icon]) => (
          <div key={label} className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card flex items-center justify-between">
            <div className='flex justify-between items-center gap-4'>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">{label}</span>
              <div className={`text-2xl font-black ${color} mt-1 bg-gray-100 rounded-[50%] h-10 w-10 text-center flex justify-center items-center`}>{value}</div>
            </div>
            {/* <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Icon className={`w-5 h-5 ${color}`} />
            </div> */}
          </div>
        ))}
      </div>

      {/* Existing Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-10 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
          {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status}
              {status === 'Pending' && stats.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-400 text-slate-950 font-black">
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between">
          
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 left-3.5 my-auto" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or reason..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Option 2: Employee Leave Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading leave requests...</span>
        </div>
      ) : leaves.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} leave requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {leaves.map((l) => (
            <div
              key={l._id}
              className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-card overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={l.userId?.avatar || demoAvatars.generic(l.userId?.name?.slice(0, 2))}
                      alt={l.userId?.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {l.userId?.name || 'Staff Member'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {l.userId?.department} • <span className="font-mono">{l.userId?.employeeId}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(l.status)}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    l.leaveType === 'Paid'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
                      : l.leaveType === 'Sick'
                      ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25'
                      : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/25'
                  }`}>
                    {l.leaveType} Leave
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {l.daysCount} {l.daysCount === 1 ? 'Day' : 'Days'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Start Date</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{l.startDate}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">End Date</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{l.endDate}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Reason</div>
                  <p className="text-xs leading-5 text-slate-700 dark:text-slate-300">{l.reason}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Leave Balance</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {l.leaveType === 'Paid'
                      ? `${l.userId?.leaveBalance?.paid || 0}d`
                      : l.leaveType === 'Sick'
                      ? `${l.userId?.leaveBalance?.sick || 0}d`
                      : 'N/A'}
                  </div>
                </div>

                {l.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDecisionModal(l, 'Approved')}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => openDecisionModal(l, 'Rejected')}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block line-clamp-2">
                      {l.adminComment ? `"${l.adminComment}"` : 'Reviewed'}
                    </span>
                    <button
                      onClick={() => openDecisionModal(l, l.status === 'Approved' ? 'Rejected' : 'Approved')}
                      className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline mt-2"
                    >
                      Change Decision
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Modal - unchanged functionality */}
      {showModal && selectedLeave && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {decisionType === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedLeave.userId?.name} • {selectedLeave.daysCount} days ({selectedLeave.leaveType} Leave)
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                  <span>Duration:</span>
                  <span className="text-right text-slate-900 dark:text-white font-bold">
                    {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.daysCount} days)
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                  <span>Reason:</span>
                  <span className="text-right text-slate-800 dark:text-slate-200">{selectedLeave.reason}</span>
                </div>
                {decisionType === 'Approved' && selectedLeave.leaveType !== 'Unpaid' && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Approving will automatically deduct {selectedLeave.daysCount} days from employee&apos;s {selectedLeave.leaveType} balance.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  HR Administrator Remarks / Comment
                </label>
                <textarea
                  rows={3}
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Enter comments visible to employee..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5 shadow-glow disabled:opacity-50 ${
                    decisionType === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {actionLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : decisionType === 'Approved' ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  Confirm {decisionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
};

export default LeaveApprovalPage;