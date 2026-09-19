import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

// --------------------------------------------------
// DATE HELPERS
// --------------------------------------------------

const pad = (value) => String(value).padStart(2, "0");

const formatDateForAPI = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return "Select Date";

  const parts = dateString.split("-");

  if (parts.length !== 3) return "Select Date";

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return "Select Date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTodayString = () => {
  return formatDateForAPI(new Date());
};

const getSafeDate = (value) => {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

// --------------------------------------------------
// CALENDAR
// --------------------------------------------------

const buildCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month
  for (let i = startDay - 1; i >= 0; i--) {
    const day = previousMonthDays - i;

    days.push({
      date: new Date(year, month - 1, day),
      currentMonth: false,
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
  }

  // Next month
  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      date: new Date(year, month + 1, nextDay),
      currentMonth: false,
    });

    nextDay++;
  }

  return days;
};

// --------------------------------------------------
// STATUS
// --------------------------------------------------

const normalizeStatus = (status) => {
  if (!status) return "Unknown";

  const value = String(status).toLowerCase();

  if (value.includes("present")) return "Present";
  if (value.includes("absent")) return "Absent";
  if (value.includes("late")) return "Late";
  if (value.includes("leave")) return "Leave";
  if (value.includes("half")) return "Half Day";
  if (value.includes("pending")) return "Pending";

  return status;
};

const getStatusClass = (status) => {
  const value = normalizeStatus(status).toLowerCase();

  if (value === "present") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  if (value === "absent") {
    return "bg-red-50 text-red-700 border-red-100";
  }

  if (value === "late") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (value === "leave") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (value === "half day") {
    return "bg-purple-50 text-purple-700 border-purple-100";
  }

  return "bg-gray-50 text-gray-600 border-gray-100";
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

const MyAttendance = () => {
  const { showToast } = useToast();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [selectedDate, setSelectedDate] = useState(
    formatDateForAPI(new Date()),
  );

  const [showCalendar, setShowCalendar] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Calendar button reference
  const calendarButtonRef = useRef(null);

  // Calendar position
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    right: 0,
  });

  // --------------------------------------------------
  // TODAY
  // --------------------------------------------------

  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

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

      const response = await api.get("/attendance/my-history?limit=100");

      console.log("ATTENDANCE HISTORY RESPONSE:", response?.data);

      const records = response?.data?.records || [];

      console.log("ATTENDANCE HISTORY RECORDS:", records);

      setAttendance(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error("Attendance fetch error:", error?.response?.data || error);

      setAttendance([]);

      showToast?.(
        error?.response?.data?.message || "Unable to load attendance history",
        "error",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // --------------------------------------------------
  // CALENDAR POSITION
  // --------------------------------------------------

  const updateCalendarPosition = () => {
    if (!calendarButtonRef.current) return;

    const rect = calendarButtonRef.current.getBoundingClientRect();

    const calendarWidth = 270;
    const gap = 8;

    let left = rect.right - calendarWidth;

    // Keep calendar inside viewport horizontally
    if (left < 10) {
      left = 10;
    }

    if (left + calendarWidth > window.innerWidth - 10) {
      left = window.innerWidth - calendarWidth - 10;
    }

    setCalendarPosition({
      top: rect.bottom + gap,
      right: window.innerWidth - (left + calendarWidth),
    });
  };

  useEffect(() => {
    if (!showCalendar) return;

    updateCalendarPosition();

    const handleResize = () => {
      updateCalendarPosition();
    };

    const handleScroll = () => {
      updateCalendarPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showCalendar]);

  // --------------------------------------------------
  // CALENDAR DAYS
  // --------------------------------------------------

  const calendarDays = useMemo(() => {
    return buildCalendarDays(calendarYear, calendarMonth);
  }, [calendarYear, calendarMonth]);

  // --------------------------------------------------
  // MONTH NAVIGATION
  // --------------------------------------------------

  const previousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
    );

    const nextMonthStart = new Date(calendarYear, calendarMonth + 1, 1);

    if (nextMonthStart > currentMonthStart) {
      return;
    }

    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // --------------------------------------------------
  // SELECT DATE
  // --------------------------------------------------

  const handleDateSelect = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return;
    }

    const clickedDate = new Date(date);

    clickedDate.setHours(0, 0, 0, 0);

    // Future date cannot be selected
    if (clickedDate > today) {
      return;
    }

    const formattedDate = formatDateForAPI(clickedDate);

    if (!formattedDate) {
      return;
    }

    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  // --------------------------------------------------
  // FILTER ATTENDANCE
  // --------------------------------------------------

  const selectedDateAttendance = useMemo(() => {
    if (!selectedDate) return [];

    const selected = selectedDate.split("-");

    if (selected.length !== 3) return [];

    const selectedYear = Number(selected[0]);
    const selectedMonth = Number(selected[1]);

    // ------------------------------------------
    // SHOW COMPLETE SELECTED MONTH
    // ------------------------------------------
    let result = attendance.filter((item) => {
      const itemDate =
        item?.date ||
        item?.attendanceDate ||
        item?.checkInDate ||
        item?.createdAt;

      if (!itemDate) return false;

      const parsedDate = getSafeDate(itemDate);

      if (!parsedDate) return false;

      return (
        parsedDate.getFullYear() === selectedYear &&
        parsedDate.getMonth() + 1 === selectedMonth
      );
    });

    // ------------------------------------------
    // STATUS FILTER
    // ------------------------------------------
    if (statusFilter !== "All Status") {
      result = result.filter(
        (item) =>
          normalizeStatus(
            item?.status || item?.attendanceStatus,
          ).toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    // ------------------------------------------
    // SEARCH
    // ------------------------------------------
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((item) => {
        const status = String(
          item?.status || item?.attendanceStatus || "",
        ).toLowerCase();

        const remarks = String(item?.remarks || "").toLowerCase();

        const workMode = String(
          item?.workMode || item?.mode || "",
        ).toLowerCase();

        return (
          status.includes(query) ||
          remarks.includes(query) ||
          workMode.includes(query)
        );
      });
    }

    // ------------------------------------------
    // SORT BY DATE - OLDEST TO NEWEST
    // ------------------------------------------
    result.sort((a, b) => {
      const dateA = getSafeDate(
        a?.date || a?.attendanceDate || a?.checkInDate || a?.createdAt,
      );

      const dateB = getSafeDate(
        b?.date || b?.attendanceDate || b?.checkInDate || b?.createdAt,
      );

      if (!dateA || !dateB) return 0;

      return dateA - dateB;
    });

    return result;
  }, [attendance, selectedDate, statusFilter, search]);

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  const summary = useMemo(() => {
    const total = attendance.length;

    const present = attendance.filter(
      (item) =>
        normalizeStatus(
          item?.status || item?.attendanceStatus,
        ).toLowerCase() === "present",
    ).length;

    const absent = attendance.filter(
      (item) =>
        normalizeStatus(
          item?.status || item?.attendanceStatus,
        ).toLowerCase() === "absent",
    ).length;

    const late = attendance.filter(
      (item) =>
        normalizeStatus(
          item?.status || item?.attendanceStatus,
        ).toLowerCase() === "late",
    ).length;

    return {
      total,
      present,
      absent,
      late,
    };
  }, [attendance]);

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  const formatTime = (value) => {
    if (!value) return "--";

    const date = getSafeDate(value);

    if (!date) return "--";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --------------------------------------------------
  // FORMAT HOURS
  // --------------------------------------------------

  const formatHours = (item) => {
    // Check-in ho chuka hai but checkout nahi hua
    if (item?.checkIn && !item?.checkOut) {
      return "In Progress";
    }

    if (item?.workingHours !== undefined && item?.workingHours !== null) {
      return `${item.workingHours}h`;
    }

    if (item?.totalHours !== undefined && item?.totalHours !== null) {
      return `${item.totalHours}h`;
    }

    if (item?.duration !== undefined && item?.duration !== null) {
      return String(item.duration);
    }

    return "--";
  };

  // --------------------------------------------------
  // MONTH NAME
  // --------------------------------------------------

  const monthName = new Date(calendarYear, calendarMonth, 1).toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    },
  );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="w-full space-y-4 p-4 md:p-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            My Attendance
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            View and track your personal attendance history
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAttendance(true)}
          disabled={refreshing}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* RECORDS */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">Records</p>

              <p className="mt-1 text-xl font-semibold text-gray-900">
                {summary.total}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <CalendarDays size={15} />
            </div>
          </div>
        </div>

        {/* PRESENT */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">Present</p>

              <p className="mt-1 text-xl font-semibold text-emerald-600">
                {summary.present}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={15} />
            </div>
          </div>
        </div>

        {/* ABSENT */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">Absent</p>

              <p className="mt-1 text-xl font-semibold text-red-600">
                {summary.absent}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <XCircle size={15} />
            </div>
          </div>
        </div>

        {/* LATE */}
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-500">Late</p>

              <p className="mt-1 text-xl font-semibold text-amber-600">
                {summary.late}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock3 size={15} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search attendance..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:bg-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 outline-none focus:border-gray-300"
          >
            <option>All Status</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
            <option>Leave</option>
            <option>Half Day</option>
            <option>Pending</option>
          </select>

          {/* DATE PICKER */}
          <div>
            <button
              ref={calendarButtonRef}
              type="button"
              onClick={() => {
                updateCalendarPosition();
                setShowCalendar((prev) => !prev);
              }}
              className="flex h-9 min-w-[150px] items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <CalendarDays size={14} />

                {formatDisplayDate(selectedDate)}
              </span>

              <span className="text-gray-400">▾</span>
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
            FIXED CALENDAR
            This is outside normal layout flow.
            It will NOT create another page scrollbar.
        -------------------------------------------------- */}

      {showCalendar && (
        <div
          className="fixed z-[9999] w-[270px] rounded-xl border border-gray-200 bg-white p-3 shadow-2xl"
          style={{
            top: `${calendarPosition.top}px`,
            right: `${calendarPosition.right}px`,
          }}
        >
          {/* CALENDAR HEADER */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ChevronLeft size={15} />
            </button>

            <p className="text-xs font-semibold text-gray-900">{monthName}</p>

            <button
              type="button"
              onClick={nextMonth}
              disabled={
                calendarYear === today.getFullYear() &&
                calendarMonth >= today.getMonth()
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* WEEK DAYS */}
          <div className="mb-1 grid grid-cols-7">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="flex h-7 items-center justify-center text-[10px] font-semibold text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* DATES */}
          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((item, index) => {
              const dayDate = item.date;

              const compareDate = new Date(dayDate);
              compareDate.setHours(0, 0, 0, 0);

              const isFuture = compareDate > today;

              const dateValue = formatDateForAPI(dayDate);

              const isSelected = selectedDate === dateValue;

              const isToday = dateValue === getTodayString();

              return (
                <button
                  key={`${dateValue}-${index}`}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleDateSelect(dayDate)}
                  style={
                    isSelected
                      ? {
                          backgroundColor: "#111827",
                          color: "#ffffff",
                        }
                      : undefined
                  }
                  className={`
                      relative mx-auto flex h-8 w-8
                      items-center justify-center rounded-lg
                      text-[11px] font-medium transition

                      ${
                        isFuture
                          ? "cursor-not-allowed text-gray-300 opacity-40"
                          : item.currentMonth
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-gray-300 hover:bg-gray-50"
                      }

                      ${isSelected ? "font-semibold hover:bg-gray-900" : ""}
                    `}
                >
                  {dayDate.getDate()}

                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gray-900" />
                  )}
                </button>
              );
            })}
          </div>

          {/* TODAY */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={() => {
                const currentDate = new Date();

                setSelectedDate(formatDateForAPI(currentDate));

                setCalendarMonth(currentDate.getMonth());

                setCalendarYear(currentDate.getFullYear());

                setShowCalendar(false);
              }}
              className="w-full rounded-lg bg-gray-50 py-2 text-[11px] font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Go to Today
            </button>
          </div>
        </div>
      )}

      {/* ATTENDANCE HISTORY */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Attendance History
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              {new Date(
                Number(selectedDate.split("-")[0]),
                Number(selectedDate.split("-")[1]) - 1,
                1,
              ).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
            {selectedDateAttendance.length} record
            {selectedDateAttendance.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <RefreshCw size={15} className="animate-spin" />
              Loading attendance...
            </div>
          </div>
        ) : selectedDateAttendance.length === 0 ? (
          /* EMPTY */
          <div className="flex min-h-[200px] flex-col items-center justify-center px-4 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <CalendarDays size={18} />
            </div>

            <p className="text-sm font-medium text-gray-700">
              No attendance record
            </p>

            <p className="mt-1 max-w-xs text-[11px] text-gray-400">
              No attendance history is available for{" "}
              {new Date(
                Number(selectedDate.split("-")[0]),
                Number(selectedDate.split("-")[1]) - 1,
                1,
              ).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </div>
        ) : (
          /* TABLE */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Check In
                  </th>

                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Check Out
                  </th>

                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Duration
                  </th>

                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Mode
                  </th>

                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {selectedDateAttendance.map((item, index) => {
                  const itemDate =
                    item?.date ||
                    item?.attendanceDate ||
                    item?.checkInDate ||
                    item?.createdAt;

                  const status = normalizeStatus(
                    item?.status || item?.attendanceStatus,
                  );

                  return (
                    <tr
                      key={item?._id || item?.id || `${selectedDate}-${index}`}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                    >
                      {/* DATE */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-800">
                          {formatDisplayDate(
                            formatDateForAPI(getSafeDate(itemDate)),
                          )}
                        </span>
                      </td>

                      {/* CHECK IN */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Clock3 size={13} className="text-gray-400" />

                          {formatTime(item?.checkIn || item?.checkInTime)}
                        </div>
                      </td>

                      {/* CHECK OUT */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                          <Clock3 size={13} className="text-gray-400" />

                          {formatTime(item?.checkOut || item?.checkOutTime)}
                        </div>
                      </td>

                      {/* HOURS */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-700">
                          {formatHours(item)}
                        </span>
                      </td>

                      {/* MODE */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">
                          {item?.workMode || item?.mode || "--"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;