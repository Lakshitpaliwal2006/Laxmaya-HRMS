import React, { useState, useEffect } from 'react';
import {
  Clock3,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Building2,
  Laptop,
  Search,
  Filter,
  Edit3,
  X,
  Save,
  Users,
  UserCheck,
  BriefcaseBusiness,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';
import { format } from 'date-fns';

const EmpAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const [department, setDepartment] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [records, setRecords] = useState([]);

  const [stats, setStats] = useState({
    totalPresent: 0,
    totalHalfDay: 0,
    totalLeave: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  // ==========================================
  // FETCH EMPLOYEE ATTENDANCE
  // ==========================================
  const fetchEmployeeAttendance = async () => {
    try {
      setLoading(true);

      const params = {
        date: selectedDate,
        role: "employee",

      };

      if (department !== 'All') {
        params.department = department;
      }

      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get('/attendance/all', {
        params,
      });

      if (res.data.success) {
        setRecords(res.data.records || []);

        if (res.data.stats) {
          setStats(res.data.stats);
        }
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Employee attendance error:', error);
      toast.error('Failed to load employee attendance');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DATE / FILTER CHANGE
  // ==========================================
  useEffect(() => {
    fetchEmployeeAttendance();
  }, [selectedDate, department, statusFilter]);

  // ==========================================
  // SEARCH
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployeeAttendance();
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // UPDATE ATTENDANCE
  // ==========================================
  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    if (!selectedRecord) return;

    setSaving(true);

    try {
      const res = await api.put(
        `/attendance/${selectedRecord._id}`,
        {
          status: selectedRecord.status,
          totalHours: selectedRecord.totalHours,
          workMode: selectedRecord.workMode,
          remarks: selectedRecord.remarks,
        }
      );

      if (res.data.success) {
        toast.success('Employee attendance updated successfully');

        setEditModalOpen(false);
        setSelectedRecord(null);

        fetchEmployeeAttendance();
      }
    } catch (error) {
      console.error('Update attendance error:', error);

      toast.error(
        error.response?.data?.message ||
          'Failed to update attendance'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================
  const getStatusBadge = (status) => {
    const styles = {
      Present: {
        className:
          'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
      },

      'Half-day': {
        className:
          'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock3,
      },

      Leave: {
        className:
          'bg-blue-50 text-blue-700 border-blue-200',
        icon: CalendarDays,
      },

      Absent: {
        className:
          'bg-red-50 text-red-700 border-red-200',
        icon: AlertCircle,
      },
    };

    const config = styles[status] || {
      className:
        'bg-gray-50 text-gray-600 border-gray-200',
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[8px] sm:text-[9px] font-black uppercase whitespace-nowrap ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 lg:p-5 font-sans">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">

        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* TITLE */}
            <div className="flex items-start gap-3">

              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#153B50] flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#153B50] bg-[#EAF3F9] px-2 py-1 rounded-md">
                    Employee Records
                  </span>
                </div>

                <h1 className="text-lg sm:text-xl font-black text-slate-800">
                  Employee Attendance
                </h1>

                <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">
                  View and manage attendance records of employees .
                </p>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">

              <CalendarDays className="w-4 h-4 text-[#153B50]" />

              <div>
                <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                  Attendance Date
                </p>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  className="bg-transparent text-[10px] font-bold text-[#153B50] outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* EMPLOYEE ONLY INDICATOR */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#EAF3F9]/50 flex items-center gap-2">

          <Users className="w-3.5 h-3.5 text-[#153B50]" />

          <p className="text-[8px] sm:text-[9px] font-bold text-[#153B50]">
            Showing attendance for
            <span className="font-black ml-1">
              Employees
            </span>
          </p>

          <span className="ml-auto text-[7px] font-black uppercase bg-white border border-[#C3D8E6] text-[#153B50] px-2 py-1 rounded-full">
            Employee Role
          </span>
        </div>
      </div>

      {/* ==========================================
          STAT CARDS
      ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">

        {/* TOTAL */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                Employees Recorded
              </p>

              <p className="text-2xl font-black text-[#153B50] mt-1">
                {records.length}
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-[#EAF3F9] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#153B50]" />
            </div>
          </div>
        </div>

        {/* PRESENT */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                Present
              </p>

              <p className="text-2xl font-black text-emerald-600 mt-1">
                {stats.totalPresent}
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* HALF DAY */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                Half Day
              </p>

              <p className="text-2xl font-black text-amber-600 mt-1">
                {stats.totalHalfDay}
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock3 className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>

        {/* LEAVE */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
                On Leave
              </p>

              <p className="text-2xl font-black text-blue-600 mt-1">
                {stats.totalLeave}
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-4">

        <div className="flex flex-col lg:flex-row gap-2.5">

          {/* SEARCH */}
          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search employee name or ID..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-medium outline-none focus:bg-white focus:border-[#153B50]"
            />
          </div>

          {/* DEPARTMENT */}
          <div className="flex items-center gap-2">

            <Filter className="w-3.5 h-3.5 text-[#153B50]" />

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="w-full lg:w-40 px-2.5 py-2.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-[#153B50] outline-none"
            >
              <option value="All">
                All Departments
              </option>

              <option value="Engineering">
                Engineering
              </option>

              <option value="Product Design">
                Product Design
              </option>

              <option value="Sales & Marketing">
                Sales & Marketing
              </option>

              <option value="Human Resources">
                Human Resources
              </option>

              <option value="Finance">
                Finance
              </option>
            </select>
          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full lg:w-36 px-2.5 py-2.5 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-[#153B50] outline-none"
          >
            <option value="All">
              All Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="Half-day">
              Half-day
            </option>

            <option value="Leave">
              Leave
            </option>

            <option value="Absent">
              Absent
            </option>
          </select>
        </div>
      </div>

      {/* ==========================================
          TABLE
      ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-14">

            <div className="w-7 h-7 border-2 border-slate-200 border-t-[#153B50] rounded-full animate-spin" />

            <p className="text-[9px] font-bold text-slate-400 mt-2">
              Loading employee attendance...
            </p>
          </div>
        ) : records.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-14 px-4">

            <div className="w-11 h-11 rounded-xl bg-[#EAF3F9] flex items-center justify-center">
              <BriefcaseBusiness className="w-5 h-5 text-[#153B50]" />
            </div>

            <p className="text-[11px] font-black text-[#153B50] mt-3">
              No employee attendance found
            </p>

            <p className="text-[9px] text-slate-400 mt-1 text-center">
              There are no employee attendance records for {selectedDate}.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Employee
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Check-In
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Check-Out
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Hours
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Mode
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-3 py-3 text-[8px] font-black uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {records.map((r) => (

                  <tr
                    key={r._id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    {/* EMPLOYEE */}
                    <td className="px-3 py-2.5">

                      <div className="flex items-center gap-2">

                        <img
                          src={
                            r.userId?.avatar ||
                            demoAvatars.generic(
                              r.userId?.name?.slice(0, 2)
                            )
                          }
                          alt={
                            r.userId?.name ||
                            'Employee'
                          }
                          className="w-8 h-8 rounded-lg object-cover border border-slate-100"
                        />

                        <div className="min-w-0">

                          <p className="text-[10px] font-black text-[#153B50] truncate max-w-[140px]">
                            {r.userId?.name ||
                              'Employee'}
                          </p>

                          <p className="text-[8px] text-slate-400 mt-0.5">
                            {r.userId?.employeeId ||
                              '—'}
                          </p>

                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-3 py-2.5">

                      <p className="text-[9px] font-bold text-[#153B50]">
                        {r.userId?.department ||
                          '—'}
                      </p>

                      <p className="text-[8px] text-slate-400 mt-0.5">
                        {r.userId?.designation ||
                          '—'}
                      </p>
                    </td>

                    {/* CHECK IN */}
                    <td className="px-3 py-2.5">

                      <span className="text-[9px] font-bold text-[#153B50] whitespace-nowrap">

                        {r.checkIn
                          ? format(
                              new Date(r.checkIn),
                              'hh:mm:ss a'
                            )
                          : '—'}

                      </span>
                    </td>

                    {/* CHECK OUT */}
                    <td className="px-3 py-2.5">

                      <span className="text-[9px] font-bold text-[#153B50] whitespace-nowrap">

                        {r.checkOut
                          ? format(
                              new Date(r.checkOut),
                              'hh:mm:ss a'
                            )
                          : '—'}

                      </span>
                    </td>

                    {/* HOURS */}
                    <td className="px-3 py-2.5">

                      <span className="text-[9px] font-black text-[#153B50] whitespace-nowrap">

                        {r.totalHours
                          ? `${r.totalHours} hrs`
                          : r.checkIn
                          ? 'In Progress'
                          : '—'}

                      </span>
                    </td>

                    {/* MODE */}
                    <td className="px-3 py-2.5">

                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[#153B50] text-[8px] font-black uppercase">

                        {r.workMode === 'Remote' ? (
                          <Laptop className="w-3 h-3" />
                        ) : (
                          <Building2 className="w-3 h-3" />
                        )}

                        {r.workMode || 'Office'}

                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-3 py-2.5">
                      {getStatusBadge(r.status)}
                    </td>

                    {/* ACTION */}
                    <td className="px-3 py-2.5">

                      <button
                        type="button"
                        title="Edit Employee Attendance"
                        onClick={() => {
                          setSelectedRecord(
                            JSON.parse(
                              JSON.stringify(r)
                            )
                          );

                          setEditModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#153B50] text-white text-[8px] font-black uppercase hover:bg-[#0f2d3d] transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==========================================
          EDIT MODAL
      ========================================== */}
      {editModalOpen && selectedRecord && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-3">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#153B50] text-white">

              <div>

                <h2 className="text-sm font-black">
                  Edit Employee Attendance
                </h2>

                <p className="text-[8px] text-white/60 mt-1">
                  {selectedRecord.userId?.name}
                  {' • '}
                  {selectedRecord.date}
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedRecord(null);
                }}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdateRecord}
              className="p-4 space-y-3"
            >

              {/* STATUS */}
              <div>

                <label className="block text-[8px] font-black uppercase text-[#153B50] mb-1">
                  Status
                </label>

                <select
                  value={
                    selectedRecord.status || ''
                  }
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-2.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Half-day">
                    Half-day
                  </option>

                  <option value="Leave">
                    Leave
                  </option>

                  <option value="Absent">
                    Absent
                  </option>
                </select>
              </div>

              {/* HOURS */}
              <div>

                <label className="block text-[8px] font-black uppercase text-[#153B50] mb-1">
                  Total Hours Worked
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={
                    selectedRecord.totalHours ??
                    ''
                  }
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      totalHours:
                        e.target.value === ''
                          ? null
                          : parseFloat(
                              e.target.value
                            ),
                    })
                  }
                  className="w-full px-2.5 py-2.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                />
              </div>

              {/* WORK MODE */}
              <div>

                <label className="block text-[8px] font-black uppercase text-[#153B50] mb-1">
                  Work Mode
                </label>

                <select
                  value={
                    selectedRecord.workMode ||
                    'Office'
                  }
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      workMode: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-2.5 rounded-lg border border-slate-200 text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                >
                  <option value="Office">
                    Office
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>
              </div>

              {/* REMARKS */}
              <div>

                <label className="block text-[8px] font-black uppercase text-[#153B50] mb-1">
                  Remarks
                </label>

                <input
                  type="text"
                  value={
                    selectedRecord.remarks || ''
                  }
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Add remarks..."
                  className="w-full px-2.5 py-2.5 rounded-lg border border-slate-200 text-[10px] text-[#153B50] outline-none focus:border-[#153B50]"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedRecord(null);
                  }}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-slate-200 text-[#153B50] text-[9px] font-black uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-[#153B50] text-white text-[9px] font-black uppercase disabled:opacity-60 flex items-center justify-center gap-1.5"
                >

                  {saving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      Save Changes
                    </>
                  )}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpAttendancePage;