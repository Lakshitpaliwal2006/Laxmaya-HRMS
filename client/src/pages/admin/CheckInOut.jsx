import React, { useEffect, useState } from "react";
import {
    Clock3,
    LogIn,
    LogOut,
    Building2,
    Wifi,
    RefreshCw,
    Timer,
} from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";

const CheckInOut = () => {
    const { showToast } = useToast();

    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [workMode, setWorkMode] = useState("Office");
    const [remarks, setRemarks] = useState("");
    const [elapsed, setElapsed] = useState("00:00:00");

    // =========================
    // GET TODAY'S ATTENDANCE
    // =========================
    const fetchTodayAttendance = async () => {
        try {
            setLoading(true);

            const response = await api.get("/attendance/today");

            // Backend response:
            // {
            //   success: true,
            //   attendance: {...},
            //   isCheckedIn: true,
            //   isCheckedOut: false
            // }

            const data = response?.data;

            setAttendance(data?.attendance || null);
        } catch (error) {
            console.error("Today's attendance error:", error);

            showToast?.(
                error?.response?.data?.message ||
                "Unable to load today's attendance",
                "error"
            );

            setAttendance(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    // =========================
    // LIVE TIMER
    // =========================
    useEffect(() => {
        if (!attendance?.checkIn || attendance?.checkOut) {
            setElapsed("00:00:00");
            return;
        }

        const updateTimer = () => {
            const start = new Date(attendance.checkIn).getTime();
            const now = Date.now();

            const difference = Math.max(0, now - start);

            const hours = Math.floor(
                difference / (1000 * 60 * 60)
            );

            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) /
                (1000 * 60)
            );

            const seconds = Math.floor(
                (difference % (1000 * 60)) /
                1000
            );

            setElapsed(
                `${String(hours).padStart(2, "0")}:${String(
                    minutes
                ).padStart(2, "0")}:${String(seconds).padStart(
                    2,
                    "0"
                )}`
            );
        };

        updateTimer();

        const interval = setInterval(
            updateTimer,
            1000
        );

        return () => clearInterval(interval);
    }, [attendance]);

    // =========================
    // FORMAT TIME
    // =========================
    const formatTime = (value) => {
        if (!value) return "--:--";

        try {
            return new Date(value).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            );
        } catch {
            return "--:--";
        }
    };

    // =========================
    // CHECK IN
    // =========================
    const handleCheckIn = async () => {
        if (actionLoading) return;

        try {
            setActionLoading(true);

            const response = await api.post(
                "/attendance/check-in",
                {
                    workMode,
                    remarks,
                }
            );

            const data = response?.data;

            // IMPORTANT:
            // Store only actual attendance object
            if (data?.attendance) {
                setAttendance(data.attendance);
            }

            setRemarks("");

            showToast?.(
                data?.message ||
                "Check-in successful",
                "success"
            );

            // Refresh from backend
            await fetchTodayAttendance();
        } catch (error) {
            console.error(
                "Check-in error:",
                error
            );

            showToast?.(
                error?.response?.data?.message ||
                "Unable to check in",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // CHECK OUT
    // =========================
    const handleCheckOut = async () => {
        if (actionLoading) return;

        try {
            setActionLoading(true);

            const response = await api.post(
                "/attendance/check-out",
                {
                    remarks,
                }
            );

            const data = response?.data;

            // IMPORTANT:
            // Store updated attendance object
            if (data?.attendance) {
                setAttendance(data.attendance);
            }

            setRemarks("");

            showToast?.(
                data?.message ||
                "Check-out successful",
                "success"
            );

            // Refresh latest backend data
            await fetchTodayAttendance();
        } catch (error) {
            console.error(
                "Check-out error:",
                error
            );

            showToast?.(
                error?.response?.data?.message ||
                "Unable to check out",
                "error"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // =========================
    // STATES
    // =========================
    const isCheckedIn =
        Boolean(attendance?.checkIn) &&
        !attendance?.checkOut;

    const isCompleted =
        Boolean(
            attendance?.checkIn &&
            attendance?.checkOut
        );

    // =========================
    // UI
    // =========================
    return (
        <section className="px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <Clock3 size={17} />
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                My Attendance
                            </h2>

                            <p className="text-[10px] text-slate-500">
                                Today's attendance
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fetchTodayAttendance}
                        disabled={loading || actionLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>
                </div>

                <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[1fr_0.8fr]">

                    {/* Attendance Information */}
                    <div className="rounded-xl bg-slate-50 p-3">

                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    Today's Status
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">
                                    {isCompleted
                                        ? "Attendance Completed"
                                        : isCheckedIn
                                            ? "Currently Working"
                                            : "Not Checked In"}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${isCompleted
                                        ? "bg-emerald-100 text-emerald-700"
                                        : isCheckedIn
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                            >
                                {isCompleted
                                    ? "Completed"
                                    : isCheckedIn
                                        ? "Active"
                                        : "Pending"}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">

                            {/* Check In */}
                            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                                <p className="text-[9px] text-slate-400">
                                    Check In
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">
                                    {formatTime(
                                        attendance?.checkIn
                                    )}
                                </p>
                            </div>

                            {/* Check Out */}
                            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                                <p className="text-[9px] text-slate-400">
                                    Check Out
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">
                                    {formatTime(
                                        attendance?.checkOut
                                    )}
                                </p>
                            </div>

                            {/* Duration */}
                            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                                <p className="flex items-center gap-1 text-[9px] text-slate-400">
                                    <Timer size={9} />
                                    Duration
                                </p>

                                <p className="mt-1 text-sm font-bold text-slate-800">
                                    {isCheckedIn
                                        ? elapsed
                                        : attendance?.totalHours
                                            ? `${attendance.totalHours} hrs`
                                            : "00:00"}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="space-y-2.5">

                        {/* Work Mode */}
                        <div>
                            <p className="mb-1.5 text-[10px] font-semibold text-slate-500">
                                Work Mode
                            </p>

                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setWorkMode("Office")
                                    }
                                    disabled={
                                        isCheckedIn ||
                                        isCompleted ||
                                        actionLoading
                                    }
                                    className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition ${workMode === "Office"
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Building2 size={13} />
                                    Office
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setWorkMode("Remote")
                                    }
                                    disabled={
                                        isCheckedIn ||
                                        isCompleted ||
                                        actionLoading
                                    }
                                    className={`flex h-9 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition ${workMode === "Remote"
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Wifi size={13} />
                                    Remote
                                </button>

                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <p className="mb-1.5 text-[10px] font-semibold text-slate-500">
                                Remarks
                            </p>

                            <textarea
                                value={remarks}
                                onChange={(e) =>
                                    setRemarks(
                                        e.target.value
                                    )
                                }
                                disabled={isCompleted}
                                rows={2}
                                placeholder="Add a short remark..."
                                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-400 disabled:bg-slate-50"
                            />
                        </div>

                        {/* Action Button */}
                        {!isCompleted ? (
                            <button
                                type="button"
                                onClick={
                                    isCheckedIn
                                        ? handleCheckOut
                                        : handleCheckIn
                                }
                                disabled={
                                    loading ||
                                    actionLoading
                                }
                                className={`flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${isCheckedIn
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-emerald-600 hover:bg-emerald-700"
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
                                        Check In
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex h-9 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                                Today's attendance completed
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckInOut;