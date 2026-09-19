import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  HeartHandshake,
  MessageSquare,
  TrendingUp,
  FileText,
  ChevronRight
} from 'lucide-react';
import ApplyLeaveModal from '../../components/leave/ApplyLeaveModal';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_TOTAL_PAID = 14;
const DEFAULT_TOTAL_SICK = 7;

const CircularProgress = ({ percent, colorClass, size = 48, stroke = 5 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-[#EAF3F9]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
          className={colorClass}
        />
      </svg>
    </div>
  );
};

const MyLeavesPage = () => {
  const { user, updateUser } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(
    user?.leaveBalance || {
      paid: 14,
      sick: 7,
      unpaid: 0
    }
  );

  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);

      const res = await api.get('/leaves/my-leaves');

      if (res.data.success) {
        setLeaves(res.data.leaves || []);

        if (res.data.leaveBalance) {
          setLeaveBalance(res.data.leaveBalance);
          updateUser({
            leaveBalance: res.data.leaveBalance
          });
        }

        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (error) {
      toast.error('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const getStatusBadge = (status) => {
    const baseStyle =
      'inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase border rounded whitespace-nowrap';

    switch (status) {
      case 'Approved':
        return (
          <span
            className={`${baseStyle} bg-[#EAF3F9] text-[#204A65] border-[#204A65]`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );

      case 'Pending':
        return (
          <span
            className={`${baseStyle} bg-white text-[#3881A6] border-[#3881A6]`}
          >
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );

      case 'Rejected':
        return (
          <span
            className={`${baseStyle} bg-[#204A65] text-white border-[#204A65]`}
          >
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );

      default:
        return (
          <span
            className={`${baseStyle} bg-[#C3D8E6] text-[#204A65] border-[#C3D8E6]`}
          >
            {status}
          </span>
        );
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchesStatus =
      selectedStatus === 'All' || l.status === selectedStatus;

    const matchesSearch =
      !search ||
      l.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase()) ||
      l.startDate.includes(search);

    return matchesStatus && matchesSearch;
  });

  const paidTotal = leaveBalance?.totalPaid || DEFAULT_TOTAL_PAID;
  const sickTotal = leaveBalance?.totalSick || DEFAULT_TOTAL_SICK;

  const paidPct = Math.min(
    100,
    Math.round(((leaveBalance?.paid ?? 0) / paidTotal) * 100)
  );

  const sickPct = Math.min(
    100,
    Math.round(((leaveBalance?.sick ?? 0) / sickTotal) * 100)
  );

  return (
    <div className="min-h-screen bg-[#EAF3F9] p-3 sm:p-4 lg:p-5 space-y-4 font-sans">

      {/* ================= HEADER ================= */}
      <div className="bg-[#204A65] border-2 border-[#204A65] rounded-md px-4 py-4 sm:px-5 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-white bg-[#3881A6] px-2 py-0.5 uppercase tracking-widest border border-[#3881A6]">
            <FileText className="w-3 h-3" />
            HR Document Portal
          </span>

          <h2 className="text-xl sm:text-[22px] lg:text-2xl font-black text-white uppercase tracking-tight mt-2">
            Time Off & Leave Portal
          </h2>

          <p className="text-[#C3D8E6] text-[11px] sm:text-xs font-bold mt-1 max-w-xl leading-relaxed">
            Apply for planned time-off, track HR approvals, and seamlessly
            review your available leave quotas in one place.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full md:w-auto shrink-0 px-4 py-2 bg-[#3881A6] text-white border-2 border-[#3881A6] hover:bg-[#EAF3F9] hover:text-[#204A65] hover:border-[#204A65] text-[10px] sm:text-xs font-black uppercase flex items-center justify-center gap-1.5 rounded"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* ================= BALANCE CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* Paid */}
        <div className="bg-white px-3.5 py-3 border-2 border-[#C3D8E6] rounded-md flex items-center justify-between min-h-[100px]">

          <div className="min-w-0">
            <span className="text-[8px] text-[#3881A6] font-black uppercase tracking-wide block">
              Paid Leave Balance
            </span>

            <div className="text-2xl font-black text-[#204A65] leading-tight mt-0.5 flex items-baseline gap-1">
              {leaveBalance?.paid || 0}
              <span className="text-[9px] font-bold text-[#3881A6]">
                / {paidTotal} days
              </span>
            </div>

            <span className="text-[7px] text-[#204A65] mt-1 font-bold uppercase bg-[#EAF3F9] px-1.5 py-0.5 inline-block border border-[#C3D8E6]">
              Full pay compensation
            </span>
          </div>

          <div className="relative ml-2">
            <CircularProgress
              percent={paidPct}
              colorClass="text-[#3881A6]"
              size={44}
              stroke={5}
            />

            <CalendarDays className="w-3.5 h-3.5 text-[#204A65] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Sick */}
        <div className="bg-white px-3.5 py-3 border-2 border-[#C3D8E6] rounded-md flex items-center justify-between min-h-[100px]">

          <div className="min-w-0">
            <span className="text-[8px] text-[#3881A6] font-black uppercase tracking-wide block">
              Sick Leave Balance
            </span>

            <div className="text-2xl font-black text-[#204A65] leading-tight mt-0.5 flex items-baseline gap-1">
              {leaveBalance?.sick || 0}
              <span className="text-[9px] font-bold text-[#3881A6]">
                / {sickTotal} days
              </span>
            </div>

            <span className="text-[7px] text-[#204A65] mt-1 font-bold uppercase bg-[#EAF3F9] px-1.5 py-0.5 inline-block border border-[#C3D8E6]">
              Medical & health quota
            </span>
          </div>

          <div className="relative ml-2">
            <CircularProgress
              percent={sickPct}
              colorClass="text-[#3881A6]"
              size={44}
              stroke={5}
            />

            <HeartHandshake className="w-3.5 h-3.5 text-[#204A65] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white px-3.5 py-3 border-2 border-[#C3D8E6] rounded-md flex flex-col justify-between min-h-[100px]">

          <div className="flex items-start justify-between">

            <div>
              <span className="text-[8px] text-[#3881A6] font-black uppercase tracking-wide block">
                Pending Requests
              </span>

              <div className="text-2xl font-black text-[#204A65] mt-0.5">
                {stats.pending}
              </div>
            </div>

            <div className="w-8 h-8 bg-[#EAF3F9] border border-[#C3D8E6] text-[#204A65] flex items-center justify-center rounded">
              <Clock className="w-4 h-4" />
            </div>

          </div>

          <div className="mt-1.5 pt-1.5 border-t border-[#EAF3F9] flex items-center justify-between gap-1">

            <span className="text-[7px] font-bold text-[#3881A6] uppercase">
              Awaiting HR review
            </span>

            <span className="text-[7px] font-black text-[#204A65] uppercase flex items-center gap-0.5 bg-[#EAF3F9] px-1 py-0.5 border border-[#C3D8E6] whitespace-nowrap">
              <TrendingUp className="w-2.5 h-2.5" />
              {stats.totalApplications} Total
            </span>

          </div>
        </div>
      </div>

      {/* ================= FILTER + SEARCH ================= */}
      <div className="bg-white p-2.5 sm:p-3 border-2 border-[#C3D8E6] rounded-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">

        <div className="grid grid-cols-4 sm:flex items-center gap-1.5">

          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2.5 sm:px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-black uppercase border-2 ${selectedStatus === status
                  ? 'bg-[#204A65] text-white border-[#204A65]'
                  : 'bg-[#EAF3F9] text-[#204A65] border-[#C3D8E6] hover:border-[#3881A6]'
                }`}
            >
              {status}
            </button>
          ))}

        </div>

        <div className="relative w-full lg:w-64">

          <Search className="w-3.5 h-3.5 text-[#3881A6] absolute inset-y-0 left-3 my-auto" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reason or date..."
            className="w-full pl-9 pr-3 py-2 bg-[#EAF3F9] border-2 border-[#C3D8E6] text-[10px] sm:text-xs font-bold text-[#204A65] placeholder-[#3881A6] focus:outline-none focus:border-[#204A65] rounded"
          />

        </div>
      </div>

      {/* ================= LEAVE HISTORY ================= */}
      <div className="bg-white border-2 border-[#C3D8E6] rounded-md overflow-hidden">

        {loading ? (

          <div className="py-14 text-center flex flex-col items-center gap-2 text-[#204A65]">

            <div className="w-8 h-8 border-4 border-[#C3D8E6] border-t-[#204A65] rounded-full animate-spin"></div>

            <span className="text-[10px] font-black uppercase">
              Syncing leave records...
            </span>

          </div>

        ) : filteredLeaves.length === 0 ? (

          <div className="py-16 px-4 text-center flex flex-col items-center gap-2 text-[#3881A6]">

            <FileText className="w-9 h-9 text-[#3881A6]" />

            <h3 className="text-sm font-black text-[#204A65] uppercase">
              No Leaves Found
            </h3>

            <span className="text-[10px] font-bold max-w-sm">
              We couldn't find any leave applications matching your current
              filter criteria.
            </span>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left text-[10px] whitespace-nowrap">

              <thead className="bg-[#204A65] text-white">

                <tr>
                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    Leave Type
                  </th>

                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    Date Range
                  </th>

                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    Duration
                  </th>

                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    Reason
                  </th>

                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    Status
                  </th>

                  <th className="px-3 py-2.5 font-black uppercase text-[9px] tracking-wide">
                    HR Notes
                  </th>
                </tr>

              </thead>

              <tbody className="divide-y-2 divide-[#EAF3F9]">

                {filteredLeaves.map((l) => (

                  <tr
                    key={l._id}
                    className="hover:bg-[#EAF3F9]"
                  >

                    {/* Leave Type */}
                    <td className="px-3 py-2.5">

                      <span
                        className={`inline-flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 border rounded ${l.leaveType === 'Paid'
                            ? 'bg-white text-[#3881A6] border-[#3881A6]'
                            : l.leaveType === 'Sick'
                              ? 'bg-[#204A65] text-white border-[#204A65]'
                              : 'bg-[#C3D8E6] text-[#204A65] border-[#C3D8E6]'
                          }`}
                      >
                        {l.leaveType} Leave
                      </span>

                    </td>

                    {/* Date */}
                    <td className="px-3 py-2.5 font-bold text-[#204A65]">

                      <div className="flex items-center gap-1">

                        {l.startDate}

                        <ChevronRight className="w-2.5 h-2.5 text-[#3881A6]" />

                        {l.endDate}

                      </div>

                    </td>

                    {/* Duration */}
                    <td className="px-3 py-2.5">

                      <span className="font-black text-[#204A65] text-sm">
                        {l.daysCount}
                      </span>

                      <span className="text-[#3881A6] ml-1 text-[8px] font-bold uppercase">
                        {l.daysCount === 1 ? 'day' : 'days'}
                      </span>

                    </td>

                    {/* Reason */}
                    <td
                      className="px-3 py-2.5 text-[#204A65] font-bold max-w-[170px] truncate"
                      title={l.reason}
                    >
                      {l.reason}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5">
                      {getStatusBadge(l.status)}
                    </td>

                    {/* HR Notes */}
                    <td className="px-3 py-2.5">

                      {l.adminComment ? (

                        <div className="flex items-start gap-1 bg-white p-1.5 border border-[#C3D8E6] max-w-[190px] rounded">

                          <MessageSquare className="w-3 h-3 text-[#3881A6] shrink-0 mt-0.5" />

                          <div className="min-w-0">

                            <p
                              className="text-[8px] text-[#204A65] truncate font-black uppercase"
                              title={l.adminComment}
                            >
                              {l.adminComment}
                            </p>

                            {l.reviewedBy?.name && (
                              <span className="text-[7px] text-[#3881A6] block mt-0.5 font-bold uppercase">
                                BY {l.reviewedBy.name}
                              </span>
                            )}

                          </div>

                        </div>

                      ) : (

                        <span className="text-[#3881A6] text-[8px] font-bold uppercase">
                          Pending notes...
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= APPLY LEAVE MODAL ================= */}
      <ApplyLeaveModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchMyLeaves}
        userBalance={leaveBalance}
      />

    </div>
  );
};

export default MyLeavesPage;