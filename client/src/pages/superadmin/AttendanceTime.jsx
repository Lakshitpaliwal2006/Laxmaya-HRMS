import React, { useEffect, useMemo, useState } from "react";
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
  BriefcaseBusiness,
  UserCog,
  RefreshCw,
} from "lucide-react";

import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import demoAvatars from "../../utils/avatars";
import { format } from "date-fns";

const AttendanceTime = () => {
  const { showToast } = useToast();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [selectedRole, setSelectedRole] = useState("all");

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const [statusFilter, setStatusFilter] = useState("All");

  const [search, setSearch] = useState("");

  const [records, setRecords] = useState([]);

  const [stats, setStats] = useState({
    totalPresent: 0,
    totalHalfDay: 0,
    totalLeave: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // ROLE CONFIG
  // --------------------------------------------------

  const roleConfig = {
    all: {
      title: "All Staff",
      subtitle: "All attendance records",
      icon: Users,
      bg: "bg-slate-50",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      active: "border-[#153B50] bg-slate-50",
    },

    manager: {
      title: "Managers",
      subtitle: "Manager attendance",
      icon: BriefcaseBusiness,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      active: "border-blue-700 bg-blue-50",
    },

    admin: {
      title: "HR Admin",
      subtitle: "HR Admin attendance",
      icon: UserCog,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      active: "border-purple-700 bg-purple-50",
    },

    employee: {
      title: "Employees",
      subtitle: "Employee attendance",
      icon: Users,
      bg: "bg-gray-50",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
      active: "border-gray-700 bg-gray-50",
    },
  };

  const currentRole = roleConfig[selectedRole];

  // --------------------------------------------------
  // FETCH ATTENDANCE
  // --------------------------------------------------

  const fetchAttendance = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = {
        date: selectedDate,
      };

      if (selectedRole !== "all") {
        params.role = selectedRole;
      }

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/attendance/all", {
        params,
      });

      const data = response?.data;

      if (data?.success) {
        setRecords(data.records || []);

        setStats(
          data.stats || {
            totalPresent: 0,
            totalHalfDay: 0,
            totalLeave: 0,
          },
        );
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Attendance fetch error:", error?.response?.data || error);

      setRecords([]);

      showToast?.(
        error?.response?.data?.message || "Failed to load attendance",
        "error",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --------------------------------------------------
  // FETCH WHEN FILTER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    fetchAttendance();
  }, [selectedRole, selectedDate, statusFilter]);

  // --------------------------------------------------
  // SEARCH DELAY
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  const getStatusBadge = (status) => {
    const styles = {
      Present: {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      },

      "Half-day": {
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },

      Leave: {
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CalendarDays,
      },

      Absent: {
        className: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle,
      },
    };

    const config = styles[status] || {
      className: "bg-gray-50 text-gray-600 border-gray-200",
      icon: AlertCircle,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[8px] font-black uppercase whitespace-nowrap ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {status || "Unknown"}
      </span>
    );
  };

  // --------------------------------------------------
  // FILTERED RECORDS
  // --------------------------------------------------

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;

    const query = search.toLowerCase();

    return records.filter((record) => {
      const name = String(record?.userId?.name || "").toLowerCase();

      const employeeId = String(record?.userId?.employeeId || "").toLowerCase();

      const department = String(record?.userId?.department || "").toLowerCase();

      const designation = String(
        record?.userId?.designation || "",
      ).toLowerCase();

      return (
        name.includes(query) ||
        employeeId.includes(query) ||
        department.includes(query) ||
        designation.includes(query)
      );
    });
  }, [records, search]);

  // --------------------------------------------------
  // UPDATE RECORD
  // --------------------------------------------------

  const handleUpdateRecord = async (e) => {
    e.preventDefault();

    if (!selectedRecord) return;

    setSaving(true);

    try {
      const response = await api.put(`/attendance/${selectedRecord._id}`, {
        status: selectedRecord.status,
        totalHours: selectedRecord.totalHours,
        workMode: selectedRecord.workMode,
        remarks: selectedRecord.remarks,
      });

      if (response?.data?.success) {
        showToast?.("Attendance updated successfully", "success");

        setEditModalOpen(false);
        setSelectedRecord(null);

        fetchAttendance();
      }
    } catch (error) {
      showToast?.(
        error?.response?.data?.message || "Failed to update attendance",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // CARD COUNTS
  // --------------------------------------------------

  const roleCount = records.length;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen w-full space-y-4 bg-gray-50 p-3 font-sans sm:p-4 lg:p-5">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="rounded-2xl bg-[#153B50] p-4 text-white shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/10 px-2 py-1">
              <Clock className="h-3 w-3" />

              <span className="text-[8px] font-bold uppercase tracking-wider">
                Super Admin
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Attendance & Time
            </h1>

            <p className="mt-1 text-[10px] text-white/65 sm:text-[11px]">
              Monitor attendance across managers, HR admins and employees.
            </p>
          </div>

          {/* DATE */}

          <div className="rounded-xl bg-white p-2">
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <Calendar className="h-4 w-4 text-[#153B50]" />

              <div>
                <p className="text-[8px] font-bold uppercase text-gray-400">
                  Attendance Date
                </p>

                <input
                  type="date"
                  value={selectedDate}
                  max={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-0.5 bg-transparent text-[11px] font-bold text-[#153B50] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          ROLE CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {Object.entries(roleConfig).map(([role, config]) => {
          const Icon = config.icon;
          const isActive = selectedRole === role;

          return (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role);
                setSearch("");
                setStatusFilter("All");
              }}  
              className={`group rounded-xl border bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive ? config.active : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {config.title}
                    </p>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-[#153B50]">
                    {isActive ? roleCount : "—"}
                  </p>

                  <p className="text-[8px] font-semibold uppercase text-gray-400">
                    Records
                  </p>
                </div>
              </div>

              {isActive && (
                <div className="mt-3 border-t border-gray-100 pt-2">
                  <p className="text-[9px] font-semibold text-[#153B50]">
                    Viewing {config.title.toLowerCase()} attendance
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
            Total Recorded
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-[#153B50]">
              {records.length}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* PRESENT */}

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
            Present
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-emerald-600">
              {stats.totalPresent || 0}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* HALF DAY */}

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
            Half Day
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-amber-600">
              {stats.totalHalfDay || 0}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </div>

        {/* LEAVE */}

        <div className="rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
            On Leave
          </p>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalLeave || 0}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* SEARCH */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${currentRole.title.toLowerCase()}...`}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-[11px] font-medium text-gray-700 outline-none transition focus:border-[#153B50] focus:bg-white"
            />
          </div>

          {/* STATUS */}

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#153B50]" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-[11px] font-semibold text-gray-700 outline-none"
            >
              <option value="All">All Status</option>

              <option value="Present">Present</option>

              <option value="Half-day">Half-day</option>

              <option value="Leave">Leave</option>

              <option value="Absent">Absent</option>
            </select>
          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={() => fetchAttendance(true)}
            disabled={refreshing}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-[10px] font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ==================================================
          TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {currentRole.title} Attendance
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {format(new Date(selectedDate), "dd MMM yyyy")}
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[9px] font-bold text-gray-600">
            {filteredRecords.length} Records
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center">
            <RefreshCw className="h-5 w-5 animate-spin text-[#153B50]" />

            <p className="mt-2 text-[10px] font-medium text-gray-400">
              Loading attendance...
            </p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
              <CalendarDays className="h-5 w-5 text-gray-400" />
            </div>

            <p className="mt-3 text-sm font-semibold text-gray-700">
              No attendance records
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              No {currentRole.title.toLowerCase()} attendance found for{" "}
              {selectedDate}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#153B50] text-white">
                <tr>
                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Name
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Department
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Check In
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Check Out
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Hours
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Work Mode
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Status
                  </th>

                  <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {/* NAME */}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            record.userId?.avatar ||
                            demoAvatars.generic(
                              record.userId?.name?.slice(0, 2),
                            )
                          }
                          alt={record.userId?.name || "Staff Member"}
                          className="h-8 w-8 rounded-lg object-cover"
                        />

                        <div>
                          <p className="max-w-[150px] truncate text-[10px] font-bold text-[#153B50]">
                            {record.userId?.name || "Staff Member"}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-400">
                            {record.userId?.employeeId || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}

                    <td className="px-3 py-2.5">
                      <p className="text-[9px] font-semibold text-gray-700">
                        {record.userId?.department || "—"}
                      </p>

                      <p className="mt-0.5 text-[8px] text-gray-400">
                        {record.userId?.designation || "—"}
                      </p>
                    </td>

                    {/* CHECK IN */}

                    <td className="px-3 py-2.5">
                      <span className="whitespace-nowrap text-[9px] font-semibold text-gray-700">
                        {record.checkIn
                          ? format(new Date(record.checkIn), "hh:mm:ss a")
                          : "—"}
                      </span>
                    </td>

                    {/* CHECK OUT */}

                    <td className="px-3 py-2.5">
                      <span className="whitespace-nowrap text-[9px] font-semibold text-gray-700">
                        {record.checkOut
                          ? format(new Date(record.checkOut), "hh:mm:ss a")
                          : "—"}
                      </span>
                    </td>

                    {/* HOURS */}

                    <td className="px-3 py-2.5">
                      {record.checkIn && !record.checkOut ? (
                        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[8px] font-bold text-amber-700">
                          In Progress
                        </span>
                      ) : (
                        <span className="whitespace-nowrap text-[9px] font-bold text-[#153B50]">
                          {record.totalHours ? `${record.totalHours} hrs` : "—"}
                        </span>
                      )}
                    </td>

                    {/* WORK MODE */}

                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-[8px] font-bold uppercase text-gray-700">
                        {record.workMode === "Remote" ? (
                          <Laptop className="h-3 w-3" />
                        ) : (
                          <Building className="h-3 w-3" />
                        )}

                        {record.workMode || "Office"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-2.5">
                      {getStatusBadge(record.status)}
                    </td>

                    {/* EDIT */}

                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(JSON.parse(JSON.stringify(record)));

                          setEditModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-[#153B50] px-2 py-1 text-[8px] font-bold uppercase text-white transition hover:bg-[#0f2d3d]"
                      >
                        <Edit3 className="h-3 w-3" />
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

      {/* ==================================================
          EDIT MODAL
      ================================================== */}

      {editModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between bg-[#153B50] px-4 py-3 text-white">
              <div>
                <h2 className="text-sm font-bold">Edit Attendance</h2>

                <p className="mt-0.5 text-[8px] text-white/60">
                  {selectedRecord.userId?.name} • {selectedRecord.date}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedRecord(null);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleUpdateRecord} className="space-y-3 p-4">
              {/* STATUS */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase text-[#153B50]">
                  Status
                </label>

                <select
                  value={selectedRecord.status || "Present"}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-semibold outline-none"
                >
                  <option value="Present">Present</option>

                  <option value="Half-day">Half-day</option>

                  <option value="Leave">Leave</option>

                  <option value="Absent">Absent</option>
                </select>
              </div>

              {/* HOURS */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase text-[#153B50]">
                  Total Hours
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={selectedRecord.totalHours ?? ""}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      totalHours:
                        e.target.value === "" ? 0 : Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-semibold outline-none"
                />
              </div>

              {/* WORK MODE */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase text-[#153B50]">
                  Work Mode
                </label>

                <select
                  value={selectedRecord.workMode || "Office"}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      workMode: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-semibold outline-none"
                >
                  <option value="Office">Office</option>

                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* REMARKS */}

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase text-[#153B50]">
                  Remarks
                </label>

                <input
                  type="text"
                  value={selectedRecord.remarks || ""}
                  onChange={(e) =>
                    setSelectedRecord({
                      ...selectedRecord,
                      remarks: e.target.value,
                    })
                  }
                  placeholder="Add remarks..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[10px] outline-none"
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
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-[9px] font-bold uppercase text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#153B50] py-2 text-[9px] font-bold uppercase text-white hover:bg-[#0f2d3d] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
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

export default AttendanceTime;