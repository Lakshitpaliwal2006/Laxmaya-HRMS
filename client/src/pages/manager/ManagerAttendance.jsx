import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  XCircle,
} from "lucide-react";

import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

const ManagerAttendance = () => {
  const { showToast } = useToast();

  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalHalfDay: 0,
    totalLeave: 0,
    totalAbsent: 0,
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================================
  // FETCH MANAGER ATTENDANCE
  // =========================================
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

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      // IMPORTANT:
      // We DO NOT send role from frontend.
      // Backend endpoint itself is manager-only.
      const response = await api.get("/attendance/manager", { params });

      const data = response?.data;

      if (data?.success) {
        setRecords(data.records || []);

        setStats(
          data.stats || {
            totalPresent: 0,
            totalHalfDay: 0,
            totalLeave: 0,
            totalAbsent: 0,
          },
        );
      }
    } catch (error) {
      console.error(
        "Manager attendance error:",
        error?.response?.data || error,
      );

      setRecords([]);

      showToast?.(
        error?.response?.data?.message || "Unable to load manager attendance",
        "error",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, statusFilter]);

  // =========================================
  // SEARCH DEBOUNCE
  // =========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================================
  // FORMAT TIME
  // =========================================
  const formatTime = (value) => {
    if (!value) return "--:--";

    try {
      return new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  // =========================================
  // FORMAT HOURS
  // =========================================
  const formatHours = (record) => {
    if (record?.checkIn && !record?.checkOut) {
      return "Working";
    }

    if (record?.totalHours !== undefined && record?.totalHours !== null) {
      return `${record.totalHours}h`;
    }

    return "--";
  };

  // =========================================
  // STATUS STYLE
  // =========================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "Half-day":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "Leave":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Absent":
        return "bg-red-50 text-red-700 border-red-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5">
      <div className="space-y-3">
        {/* =====================================
            HEADER
        ====================================== */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Clock3 size={18} />
              </div>

              <div>
                <h1 className="text-sm font-bold text-slate-900">
                  Manager Attendance
                </h1>

                <p className="text-[10px] text-slate-500">
                  Attendance overview for managers
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* DATE */}
              <div className="flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5">
                <CalendarDays size={13} className="text-slate-500" />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-[11px] font-medium text-slate-700 outline-none"
                />
              </div>

              {/* REFRESH */}
              <button
                type="button"
                onClick={() => fetchAttendance(true)}
                disabled={loading || refreshing}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* =====================================
    STATS
====================================== */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* PRESENT */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-emerald-100/50" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                    Present
                  </p>
                </div>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
                  {stats.totalPresent}
                </p>

                <p className="mt-0.5 text-[8px] font-medium text-emerald-600/70">
                  Present today
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">
                <CheckCircle2 size={17} className="text-emerald-600" />
              </div>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full w-[78%] rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* HALF DAY */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-amber-100/50" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-amber-600">
                    Half Day
                  </p>
                </div>

                <p className="mt-2 text-2xl font-bold tracking-tight text-amber-700">
                  {stats.totalHalfDay}
                </p>

                <p className="mt-0.5 text-[8px] font-medium text-amber-600/70">
                  Partial attendance
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100 bg-white shadow-sm">
                <Clock3 size={17} className="text-amber-600" />
              </div>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-amber-100">
              <div className="h-full w-[42%] rounded-full bg-amber-500" />
            </div>
          </div>

          {/* LEAVE */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-blue-100/50" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
                    Leave
                  </p>
                </div>

                <p className="mt-2 text-2xl font-bold tracking-tight text-blue-700">
                  {stats.totalLeave}
                </p>

                <p className="mt-0.5 text-[8px] font-medium text-blue-600/70">
                  Leave records
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white shadow-sm">
                <CalendarDays size={17} className="text-blue-600" />
              </div>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-[28%] rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
        {/* =====================================
            FILTER BAR
        ====================================== */}
        <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search manager name, ID, department..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[11px] font-medium text-slate-600 outline-none"
            >
              <option value="All">All Status</option>

              <option value="Present">Present</option>

              <option value="Half-day">Half Day</option>

              <option value="Leave">Leave</option>

              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* =====================================
            TABLE
        ====================================== */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-slate-800">
                  Manager Attendance Records
                </h2>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Only manager attendance is displayed
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold text-indigo-600">
                Manager
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Manager
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Department
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Check In
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Check Out
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Hours
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Mode
                  </th>

                  <th className="px-4 py-2.5 text-left text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center">
                      <RefreshCw
                        size={18}
                        className="mx-auto animate-spin text-indigo-500"
                      />

                      <p className="mt-2 text-[10px] text-slate-400">
                        Loading manager attendance...
                      </p>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center">
                      <XCircle size={20} className="mx-auto text-slate-300" />

                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        No manager attendance found
                      </p>

                      <p className="mt-1 text-[9px] text-slate-400">
                        Try another date or search.
                      </p>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => {
                    const user = record.userId;

                    return (
                      <tr
                        key={record._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                      >
                        {/* MANAGER */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                              {user?.name?.charAt(0)?.toUpperCase() || "M"}
                            </div>

                            <div>
                              <p className="text-[11px] font-bold text-slate-800">
                                {user?.name || "Unknown"}
                              </p>

                              <p className="text-[9px] text-slate-400">
                                {user?.employeeId || "--"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-4 py-3">
                          <p className="text-[10px] font-medium text-slate-700">
                            {user?.department || "--"}
                          </p>

                          <p className="text-[9px] text-slate-400">
                            {user?.designation || "Manager"}
                          </p>
                        </td>

                        {/* CHECK IN */}
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-semibold text-slate-700">
                            {formatTime(record.checkIn)}
                          </span>
                        </td>

                        {/* CHECK OUT */}
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-semibold text-slate-700">
                            {formatTime(record.checkOut)}
                          </span>
                        </td>

                        {/* HOURS */}
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold ${
                              record.checkIn && !record.checkOut
                                ? "text-indigo-600"
                                : "text-slate-700"
                            }`}
                          >
                            {formatHours(record)}
                          </span>
                        </td>

                        {/* WORK MODE */}
                        <td className="px-4 py-3">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
                            {record.workMode || "--"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full border px-2 py-1 text-[9px] font-bold ${getStatusStyle(
                              record.status,
                            )}`}
                          >
                            {record.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagerAttendance;