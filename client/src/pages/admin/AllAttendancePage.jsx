import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Building,
  Laptop,
  Search,
  Filter,
  CalendarDays,
  Edit3,
  X,
  Save,
  Users,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';
import { format } from 'date-fns';

const AllAttendancePage = () => {
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

  const fetchCompanyAttendance = async () => {
    try {
      setLoading(true);

      const params = { date: selectedDate };

      if (department !== 'All') params.department = department;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/attendance/all', { params });

      if (res.data.success) {
        setRecords(res.data.records || []);

        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (error) {
      toast.error('Failed to load company attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyAttendance();
  }, [selectedDate, department, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanyAttendance();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    if (!selectedRecord) return;

    setSaving(true);

    try {
      const res = await api.put(`/attendance/${selectedRecord._id}`, {
        status: selectedRecord.status,
        totalHours: selectedRecord.totalHours,
        workMode: selectedRecord.workMode,
        remarks: selectedRecord.remarks,
      });

      if (res.data.success) {
        toast.success('Attendance record regularized successfully');
        setEditModalOpen(false);
        fetchCompanyAttendance();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update record'
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Present: {
        className:
          'bg-[#EAF3F9] text-[#153B50] border-[#153B50]',
        icon: CheckCircle2,
      },
      'Half-day': {
        className:
          'bg-white text-[#153B50] border-[#153B50]',
        icon: Clock,
      },
      Leave: {
        className:
          'bg-[#C3D8E6] text-[#153B50] border-[#153B50]',
        icon: CalendarDays,
      },
    };

    const config = styles[status] || {
      className:
        'bg-[#153B50] text-white border-[#153B50]',
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase border rounded-md whitespace-nowrap ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#EAF3F9] p-3 sm:p-4 lg:p-5 xl:p-6 space-y-4 font-sans">

      {/* HEADER */}
      <div className="bg-[#153B50] border-2 border-[#153B50] rounded-xl p-4 sm:p-5 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 border border-white/20 mb-2">
              <Users className="w-3 h-3" />
              <span className="text-[8px] font-black uppercase tracking-wider">
                HR Document Management
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight leading-none">
              Company Attendance
            </h1>

            <p className="text-[10px] sm:text-[11px] text-white/70 mt-1.5 max-w-xl">
              Real-time workforce roll call, punch verification, and
              regularization portal.
            </p>
          </div>

          {/* DATE */}
          <div className="bg-white p-2 rounded-lg border border-white/20 w-full lg:w-auto">
            <div className="flex items-center gap-2 px-2.5 py-2 rounded-md bg-[#EAF3F9] border border-[#C3D8E6]">
              <Calendar className="w-4 h-4 text-[#153B50] shrink-0" />

              <div>
                <p className="text-[8px] font-black uppercase text-[#153B50] leading-none">
                  Select Date
                </p>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 bg-transparent text-[11px] font-bold text-[#153B50] outline-none cursor-pointer w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* TOTAL */}
        <div className="bg-white border border-[#C3D8E6] rounded-xl p-3.5 flex items-center justify-between min-h-[88px]">
          <div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wide text-gray-400">
              Total Recorded
            </p>

            <p className="text-2xl font-black text-[#153B50] mt-1 leading-none">
              {records.length}
            </p>
          </div>

          <div className="w-9 h-9 rounded-lg bg-[#EAF3F9] flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#153B50]" />
          </div>
        </div>

        {/* PRESENT */}
        <div className="bg-white border border-[#C3D8E6] rounded-xl p-3.5 flex items-center justify-between min-h-[88px]">
          <div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wide text-gray-400">
              Present
            </p>

            <p className="text-2xl font-black text-[#153B50] mt-1 leading-none">
              {stats.totalPresent}
            </p>
          </div>

          <div className="w-9 h-9 rounded-lg bg-[#EAF3F9] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-[#153B50]" />
          </div>
        </div>

        {/* HALF DAY */}
        <div className="bg-white border border-[#C3D8E6] rounded-xl p-3.5 flex items-center justify-between min-h-[88px]">
          <div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wide text-gray-400">
              Half-Day
            </p>

            <p className="text-2xl font-black text-[#153B50] mt-1 leading-none">
              {stats.totalHalfDay}
            </p>
          </div>

          <div className="w-9 h-9 rounded-lg bg-[#EAF3F9] flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#153B50]" />
          </div>
        </div>

        {/* LEAVE */}
        <div className="bg-white border border-[#C3D8E6] rounded-xl p-3.5 flex items-center justify-between min-h-[88px]">
          <div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-wide text-gray-400">
              On Leave
            </p>

            <p className="text-2xl font-black text-[#153B50] mt-1 leading-none">
              {stats.totalLeave}
            </p>
          </div>

          <div className="w-9 h-9 rounded-lg bg-[#EAF3F9] flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#153B50]" />
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-[#C3D8E6] rounded-xl p-2.5 sm:p-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">

          {/* SEARCH */}
          <div className="relative w-full lg:w-64 xl:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#C3D8E6] bg-[#EAF3F9]/40 text-[10px] sm:text-[11px] font-medium outline-none focus:border-[#153B50]"
            />
          </div>

          {/* DEPARTMENT */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#153B50] shrink-0" />

            <span className="text-[9px] font-black uppercase text-[#153B50]">
              Dept
            </span>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="flex-1 lg:w-44 px-2.5 py-2 rounded-lg border border-[#C3D8E6] bg-white text-[10px] sm:text-[11px] font-bold text-[#153B50] outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Sales & Marketing">
                Sales & Marketing
              </option>
              <option value="Human Resources">
                Human Resources
              </option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-[9px] font-black uppercase text-[#153B50]">
              Status
            </span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 lg:w-36 px-2.5 py-2 rounded-lg border border-[#C3D8E6] bg-white text-[10px] sm:text-[11px] font-bold text-[#153B50] outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Half-day">Half-day</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white border border-[#C3D8E6] rounded-xl overflow-hidden">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-[#C3D8E6] border-t-[#153B50] rounded-full animate-spin" />

            <p className="text-[10px] font-bold text-gray-500 mt-2">
              Loading records...
            </p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-10 h-10 rounded-full bg-[#EAF3F9] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#153B50]" />
            </div>

            <p className="text-[11px] font-black text-[#153B50] mt-2">
              No attendance records found
            </p>

            <p className="text-[9px] text-gray-400 mt-1 text-center">
              No records available for {selectedDate}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-[#153B50] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Employee
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Department
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Check-In
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Check-Out
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Total Hours
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Work Mode
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Status
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-black uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EAF3F9]">
                {records.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-[#EAF3F9]/40 transition-colors"
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
                          alt={r.userId?.name || 'Staff Member'}
                          className="w-8 h-8 rounded-lg object-cover border border-white shadow-sm shrink-0"
                        />

                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-[#153B50] truncate max-w-[130px]">
                            {r.userId?.name || 'Staff Member'}
                          </p>

                          <p className="text-[8px] text-gray-400 mt-0.5">
                            {r.userId?.employeeId || '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-3 py-2.5">
                      <p className="text-[9px] font-bold text-[#153B50]">
                        {r.userId?.department || '—'}
                      </p>

                      <p className="text-[8px] text-gray-400 mt-0.5">
                        {r.userId?.designation || '—'}
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

                    {/* TOTAL HOURS */}
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-black text-[#153B50] whitespace-nowrap">
                        {r.totalHours
                          ? `${r.totalHours} hrs`
                          : r.checkIn
                          ? 'In Progress'
                          : '—'}
                      </span>
                    </td>

                    {/* WORK MODE */}
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#EAF3F9] text-[#153B50] text-[8px] font-black uppercase whitespace-nowrap">
                        {r.workMode === 'Remote' ? (
                          <Laptop className="w-3 h-3" />
                        ) : (
                          <Building className="w-3 h-3" />
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
                        title="Regularize / Edit Attendance"
                        onClick={() => {
                          setSelectedRecord(
                            JSON.parse(JSON.stringify(r))
                          );
                          setEditModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#153B50] text-white text-[8px] font-black uppercase hover:bg-[#0f2d3d] transition-colors whitespace-nowrap"
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

      {/* EDIT MODAL */}
      {editModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#153B50]/80 p-3 sm:p-4">

          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#153B50] text-white">

              <div>
                <h2 className="text-sm sm:text-base font-black">
                  Regularize Attendance
                </h2>

                <p className="text-[8px] text-white/70 mt-1">
                  {selectedRecord.userId?.name} •{' '}
                  {selectedRecord.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdateRecord}
              className="p-4 sm:p-5 space-y-3"
            >
              {/* STATUS */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#153B50] mb-1">
                  Status
                </label>

                <select
                  value={selectedRecord.status || ''}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-lg border border-[#C3D8E6] text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                >
                  <option value="Present">Present</option>
                  <option value="Half-day">Half-day</option>
                  <option value="Leave">Leave</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* TOTAL HOURS */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#153B50] mb-1">
                  Total Hours Worked
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={selectedRecord.totalHours || ''}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      totalHours: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-lg border border-[#C3D8E6] text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                />
              </div>

              {/* WORK MODE */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#153B50] mb-1">
                  Work Mode
                </label>

                <select
                  value={selectedRecord.workMode || 'Office'}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      workMode: e.target.value,
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-lg border border-[#C3D8E6] text-[10px] font-bold text-[#153B50] outline-none focus:border-[#153B50]"
                >
                  <option value="Office">Office</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* REMARKS */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#153B50] mb-1">
                  Remarks / Note
                </label>

                <input
                  type="text"
                  value={selectedRecord.remarks || ''}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Add remarks..."
                  className="w-full px-2.5 py-2 rounded-lg border border-[#C3D8E6] text-[10px] font-medium text-[#153B50] outline-none focus:border-[#153B50]"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#C3D8E6] text-[#153B50] text-[9px] font-black uppercase hover:bg-[#EAF3F9] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#153B50] text-white text-[9px] font-black uppercase hover:bg-[#0f2d3d] transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
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

export default AllAttendancePage;