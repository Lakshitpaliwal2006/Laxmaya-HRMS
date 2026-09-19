import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock3,
  LogIn,
  LogOut,
  Building2,
  Wifi,
  RefreshCw,
  Timer,
  CalendarDays,
  Activity,
  CheckCircle2,
  CircleDot,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

const CheckInOutManager = () => {
  const { showToast } = useToast();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [workMode, setWorkMode] = useState("Office");
  const [remarks, setRemarks] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // =====================================================
  // TODAY DATE
  // =====================================================
  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }, []);

  // =====================================================
  // GET TODAY'S ATTENDANCE
  // =====================================================
  const fetchTodayAttendance = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/attendance/today");
      const data = response?.data;

      const currentAttendance = data?.attendance || null;

      setAttendance(currentAttendance);

      // Keep frontend work mode synced with backend
      if (currentAttendance?.workMode) {
        setWorkMode(currentAttendance.workMode);
      }
    } catch (error) {
      console.error("Manager attendance fetch error:", error);

      showToast?.(
        error?.response?.data?.message ||
          "Unable to load today's attendance",
        "error"
      );

      setAttendance(null);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  // =====================================================
  // ATTENDANCE STATES
  // =====================================================
  const isCheckedIn =
    Boolean(attendance?.checkIn) && !attendance?.checkOut;

  const isCompleted =
    Boolean(attendance?.checkIn) && Boolean(attendance?.checkOut);

  // =====================================================
  // LIVE TIMER
  // =====================================================
  useEffect(() => {
    if (!attendance?.checkIn || attendance?.checkOut) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      const start = new Date(attendance.checkIn).getTime();
      const now = Date.now();

      const diff = Math.max(
        0,
        Math.floor((now - start) / 1000)
      );

      setElapsedSeconds(diff);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [attendance]);

  // =====================================================
  // FORMAT LIVE DURATION
  // =====================================================
  const formatLiveDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================
  const formatTime = (value) => {
    if (!value) return "--:--";

    try {
      return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--:--";
    }
  };

  // =====================================================
  // FORMAT TOTAL HOURS
  // =====================================================
  const formatTotalHours = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "00h 00m";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return `${value}`;
    }

    const hours = Math.floor(numericValue);
    const minutes = Math.round(
      (numericValue - hours) * 60
    );

    return `${String(hours).padStart(2, "0")}h ${String(
      minutes
    ).padStart(2, "0")}m`;
  };

  // =====================================================
  // SESSION PROGRESS
  // Frontend-only visual indicator
  // =====================================================
  const sessionProgress = useMemo(() => {
    if (!isCheckedIn) {
      if (isCompleted && attendance?.totalHours) {
        return Math.min(
          (Number(attendance.totalHours) / 8) * 100,
          100
        );
      }

      return 0;
    }

    // Visual 8-hour workday reference
    return Math.min(
      (elapsedSeconds / (8 * 60 * 60)) * 100,
      100
    );
  }, [
    isCheckedIn,
    isCompleted,
    attendance,
    elapsedSeconds,
  ]);

  // =====================================================
  // CHECK IN
  // =====================================================
  const handleCheckIn = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      const response = await api.post(
        "/attendance/check-in",
        {
          workMode,
          remarks: remarks.trim(),
        }
      );

      const data = response?.data;

      if (data?.attendance) {
        setAttendance(data.attendance);

        if (data.attendance.workMode) {
          setWorkMode(data.attendance.workMode);
        }
      }

      setRemarks("");

      showToast?.(
        data?.message || "Manager check-in successful",
        "success"
      );

      await fetchTodayAttendance();
    } catch (error) {
      console.error("Manager check-in error:", error);

      showToast?.(
        error?.response?.data?.message ||
          "Unable to check in",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CHECK OUT
  // =====================================================
  const handleCheckOut = async () => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      const response = await api.post(
        "/attendance/check-out",
        {
          remarks: remarks.trim(),
        }
      );

      const data = response?.data;

      if (data?.attendance) {
        setAttendance(data.attendance);
      }

      setRemarks("");

      showToast?.(
        data?.message || "Manager check-out successful",
        "success"
      );

      await fetchTodayAttendance();
    } catch (error) {
      console.error("Manager check-out error:", error);

      showToast?.(
        error?.response?.data?.message ||
          "Unable to check out",
        "error"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================
  const statusInfo = useMemo(() => {
    if (isCompleted) {
      return {
        label: "Day Completed",
        small: "Attendance submitted",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500",
      };
    }

    if (isCheckedIn) {
      return {
        label: "Currently Working",
        small: "Live attendance session",
        className:
          "bg-blue-50 text-blue-700 border-blue-100",
        dot: "bg-blue-500",
      };
    }

    return {
      label: "Not Checked In",
      small: "Start today's session",
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
      dot: "bg-slate-400",
    };
  }, [isCheckedIn, isCompleted]);

  // =====================================================
  // LOADING VIEW
  // =====================================================
  if (loading && !attendance) {
    return (
      <section className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="animate-pulse p-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-64 rounded bg-slate-100" />

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="h-64 rounded-2xl bg-slate-100" />
              <div className="h-64 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <section className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* =================================================
            TOP HEADER
        ================================================== */}
        <div className="relative overflow-hidden border-b border-slate-100 px-4 py-4 sm:px-5">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-100/70 blur-2xl" />
          <div className="absolute bottom-0 right-28 h-16 w-16 rounded-full bg-blue-100/40 blur-2xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <BriefcaseBusiness size={17} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">
                    Manager Attendance
                  </h1>

                  <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:inline-flex">
                    Manager
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <CalendarDays size={11} />
                  {todayLabel}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchTodayAttendance}
              disabled={loading || actionLoading}
              title="Refresh attendance"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* =================================================
            MAIN AREA
        ================================================== */}
        <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[1.18fr_0.82fr]">

          {/* =================================================
              LEFT: SESSION OVERVIEW
          ================================================== */}
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${statusInfo.dot}`}
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Work Session
                  </span>
                </div>

                <h2 className="mt-1.5 text-base font-bold">
                  {statusInfo.label}
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  {statusInfo.small}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Activity size={15} className="text-slate-200" />
              </div>
            </div>

            {/* LIVE CLOCK */}
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                  {isCheckedIn
                    ? "Live Duration"
                    : "Today's Duration"}
                </span>

                {isCheckedIn && (
                  <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
                    <CircleDot size={9} />
                    LIVE
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-end justify-between">
                <div className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
                  {isCheckedIn
                    ? formatLiveDuration(elapsedSeconds)
                    : isCompleted
                    ? formatTotalHours(attendance?.totalHours)
                    : "00:00:00"}
                </div>

                <Timer
                  size={18}
                  className="mb-1 text-slate-500"
                />
              </div>

              {/* SESSION PROGRESS */}
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[8px] text-slate-500">
                  <span>Session progress</span>
                  <span>
                    {Math.round(sessionProgress)}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                    style={{
                      width: `${sessionProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* TIME CARDS */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-500">
                  Check In
                </p>

                <p className="mt-1 text-sm font-bold text-slate-100">
                  {formatTime(attendance?.checkIn)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-500">
                  Check Out
                </p>

                <p className="mt-1 text-sm font-bold text-slate-100">
                  {formatTime(attendance?.checkOut)}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-500">
                  Mode
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-100">
                  {attendance?.workMode ||
                    workMode ||
                    "Office"}
                </p>
              </div>
            </div>

            {/* SESSION NOTE */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <CheckCircle2
                size={14}
                className={
                  isCompleted
                    ? "text-emerald-400"
                    : "text-slate-500"
                }
              />

              <p className="text-[9px] leading-4 text-slate-400">
                {isCompleted
                  ? "Today's attendance has been completed successfully."
                  : isCheckedIn
                  ? "Your attendance session is active. Check out when your workday is complete."
                  : "Choose your work mode and start your attendance session."}
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT: MANAGER ACTION PANEL
          ================================================== */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">

            {/* PANEL HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Attendance Control
                </p>

                <h3 className="mt-1 text-sm font-bold text-slate-900">
                  Manage Today's Session
                </h3>
              </div>

              <div
                className={`rounded-full border px-2.5 py-1 text-[8px] font-bold ${statusInfo.className}`}
              >
                {isCompleted
                  ? "COMPLETED"
                  : isCheckedIn
                  ? "ACTIVE"
                  : "PENDING"}
              </div>
            </div>

            {/* WORK MODE */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-600">
                  Work Mode
                </p>

                <span className="text-[8px] text-slate-400">
                  Select before check-in
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWorkMode("Office")}
                  disabled={
                    isCheckedIn ||
                    isCompleted ||
                    actionLoading
                  }
                  className={`group flex h-10 items-center justify-center gap-2 rounded-xl border text-[11px] font-bold transition-all ${
                    workMode === "Office"
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  } ${
                    isCheckedIn || isCompleted
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                >
                  <Building2
                    size={14}
                    className={
                      workMode === "Office"
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />

                  Office
                </button>

                <button
                  type="button"
                  onClick={() => setWorkMode("Remote")}
                  disabled={
                    isCheckedIn ||
                    isCompleted ||
                    actionLoading
                  }
                  className={`group flex h-10 items-center justify-center gap-2 rounded-xl border text-[11px] font-bold transition-all ${
                    workMode === "Remote"
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  } ${
                    isCheckedIn || isCompleted
                      ? "cursor-not-allowed opacity-70"
                      : ""
                  }`}
                >
                  <Wifi
                    size={14}
                    className={
                      workMode === "Remote"
                        ? "text-white"
                        : "text-slate-400"
                    }
                  />

                  Remote
                </button>
              </div>
            </div>

            {/* QUICK DETAILS */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock3 size={11} />
                  <span className="text-[8px] font-semibold uppercase tracking-wider">
                    Start
                  </span>
                </div>

                <p className="mt-1 text-xs font-bold text-slate-800">
                  {formatTime(attendance?.checkIn)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ArrowUpRight size={11} />
                  <span className="text-[8px] font-semibold uppercase tracking-wider">
                    Total
                  </span>
                </div>

                <p className="mt-1 text-xs font-bold text-slate-800">
                  {isCheckedIn
                    ? formatLiveDuration(elapsedSeconds)
                    : formatTotalHours(
                        attendance?.totalHours
                      )}
                </p>
              </div>
            </div>

            {/* REMARKS */}
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-600">
                  Remarks
                </p>

                <span className="text-[8px] text-slate-400">
                  Optional
                </span>
              </div>

              <textarea
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
                disabled={isCompleted || actionLoading}
                rows={3}
                maxLength={250}
                placeholder={
                  isCompleted
                    ? "Attendance completed"
                    : "Add a short work-session remark..."
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] leading-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              />

              {!isCompleted && (
                <div className="mt-1 text-right text-[8px] text-slate-400">
                  {remarks.length}/250
                </div>
              )}
            </div>

            {/* ACTION */}
            <div className="mt-3">
              {!isCompleted ? (
                <button
                  type="button"
                  onClick={
                    isCheckedIn
                      ? handleCheckOut
                      : handleCheckIn
                  }
                  disabled={
                    loading || actionLoading
                  }
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-bold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    isCheckedIn
                      ? "bg-red-600 hover:bg-red-700 active:scale-[0.99]"
                      : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99]"
                  }`}
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : isCheckedIn ? (
                    <>
                      <LogOut size={14} />
                      Check Out
                    </>
                  ) : (
                    <>
                      <LogIn size={14} />
                      Start Manager Session
                    </>
                  )}
                </button>
              ) : (
                <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 size={14} />
                  Today's attendance completed
                </div>
              )}
            </div>

            {/* FOOTER INFO */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[8px] text-slate-400">
              <Clock3 size={10} />
              Attendance is synced with the HRMS server
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckInOutManager;
