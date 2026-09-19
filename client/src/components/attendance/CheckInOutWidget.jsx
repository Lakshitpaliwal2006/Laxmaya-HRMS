import React, { useState, useEffect } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  Building,
  Laptop,
  CheckCircle2,
  Timer,
} from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { format } from "date-fns";

const CheckInOutWidget = ({ onAttendanceChange }) => {
  const [statusData, setStatusData] = useState({
    loading: true,
    isCheckedIn: false,
    isCheckedOut: false,
    attendance: null,
  });

  const [workMode, setWorkMode] = useState("Office");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const toast = useToast();

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get("/attendance/today");

      if (res.data.success) {
        setStatusData({
          loading: false,
          isCheckedIn: res.data.isCheckedIn,
          isCheckedOut: res.data.isCheckedOut,
          attendance: res.data.attendance,
        });

        if (res.data.attendance?.workMode) {
          setWorkMode(res.data.attendance.workMode);
        }
      }
    } catch (error) {
      console.error("Error fetching today attendance:", error);

      setStatusData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  useEffect(() => {
    let interval = null;

    if (
      statusData.isCheckedIn &&
      !statusData.isCheckedOut &&
      statusData.attendance?.checkIn
    ) {
      const updateTimer = () => {
        const diffMs =
          new Date() - new Date(statusData.attendance.checkIn);

        const totalSeconds = Math.max(
          0,
          Math.floor(diffMs / 1000)
        );

        const hrs = String(
          Math.floor(totalSeconds / 3600)
        ).padStart(2, "0");

        const mins = String(
          Math.floor((totalSeconds % 3600) / 60)
        ).padStart(2, "0");

        const secs = String(totalSeconds % 60).padStart(2, "0");

        setElapsedTime(`${hrs}:${mins}:${secs}`);
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [statusData]);

  const handleCheckIn = async () => {
    setSubmitting(true);

    try {
      const res = await api.post("/attendance/check-in", {
        workMode,
        remarks,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setRemarks("");
        await fetchTodayStatus();
        onAttendanceChange?.();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Check-in failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setSubmitting(true);

    try {
      const res = await api.post("/attendance/check-out", {
        remarks,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setRemarks("");
        await fetchTodayStatus();
        onAttendanceChange?.();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Check-out failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (statusData.loading) {
    return (
      <div className="p-4 bg-white border border-[#C3D8E6] flex flex-col items-center justify-center gap-2">
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 border-2 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-2 border-[#3881A6] border-t-transparent rounded-full animate-spin" />
        </div>

        <span className="text-[10px] font-semibold text-slate-500">
          Syncing today's punch status...
        </span>
      </div>
    );
  }

  const { isCheckedIn, isCheckedOut, attendance } = statusData;

  return (
    <div
      className="
        p-3
        sm:p-4
        bg-white
        border
        border-[#C3D8E6]
        shadow-sm
        font-sans
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-2.5
          border-b
          border-[#EAF3F9]
          pb-3
          mb-3
        "
      >
        <div className="flex items-center gap-2.5">
          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-[#EAF3F9]
              text-[#204A65]
              border
              border-[#C3D8E6]
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Clock className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-sm
                sm:text-[15px]
                font-extrabold
                text-[#204A65]
                tracking-tight
              "
            >
              Today's Attendance Punch
            </h3>

            <p className="text-[10px] font-medium text-[#3881A6] mt-0.5">
              {format(new Date(), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="shrink-0">
          {!isCheckedIn ? (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-full
                text-[9px]
                font-bold
                bg-[#EAF3F9]
                text-[#204A65]
                border
                border-[#C3D8E6]
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3881A6] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3881A6]" />
              </span>

              Not Checked In Yet
            </span>
          ) : !isCheckedOut ? (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-full
                text-[9px]
                font-bold
                bg-[#3881A6]
                text-white
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>

              Working ({workMode})
            </span>
          ) : (
            <span
              className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1
                rounded-full
                text-[9px]
                font-bold
                bg-[#204A65]
                text-white
              "
            >
              <CheckCircle2 className="w-3 h-3" />
              Punch Completed
            </span>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-2.5
          lg:gap-3
          items-stretch
        "
      >
        {/* TIME CARD */}
        <div
          className="
            space-y-2
            p-3
            bg-[#EAF3F9]
            border
            border-[#C3D8E6]
            flex
            flex-col
            justify-center
          "
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] font-bold text-[#3881A6] uppercase tracking-wide">
              Punch In Time
            </span>

            <span
              className="
                font-mono
                font-black
                text-[#204A65]
                text-[10px]
                bg-white
                px-1.5
                py-0.5
                border
                border-[#C3D8E6]
                whitespace-nowrap
              "
            >
              {attendance?.checkIn
                ? format(
                    new Date(attendance.checkIn),
                    "hh:mm:ss a"
                  )
                : "--:--:--"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] font-bold text-[#3881A6] uppercase tracking-wide">
              Punch Out Time
            </span>

            <span
              className="
                font-mono
                font-black
                text-[#204A65]
                text-[10px]
                bg-white
                px-1.5
                py-0.5
                border
                border-[#C3D8E6]
                whitespace-nowrap
              "
            >
              {attendance?.checkOut
                ? format(
                    new Date(attendance.checkOut),
                    "hh:mm:ss a"
                  )
                : "--:--:--"}
            </span>
          </div>

          <div className="w-full h-px bg-[#C3D8E6]" />

          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] font-bold text-[#3881A6] uppercase tracking-wide">
              Total Hours
            </span>

            <span className="font-black text-[10px] text-[#204A65]">
              {attendance?.totalHours
                ? `${attendance.totalHours} hrs`
                : isCheckedIn
                ? "In Progress"
                : "0.00 hrs"}
            </span>
          </div>
        </div>

        {/* TIMER */}
        <div
          className="
            p-3
            sm:p-4
            bg-[#204A65]
            border
            border-[#204A65]
            text-center
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <span
            className="
              text-[7px]
              uppercase
              tracking-widest
              text-white
              font-bold
              mb-1.5
              flex
              items-center
              gap-1
              bg-[#3881A6]
              px-2
              py-0.5
              rounded-full
            "
          >
            <Timer className="w-2.5 h-2.5" />

            {isCheckedIn && !isCheckedOut
              ? "Active Working Time"
              : "Today Working Duration"}
          </span>

          <div
            className="
              text-2xl
              sm:text-3xl
              lg:text-[34px]
              font-mono
              font-black
              tracking-wider
              text-white
              my-1
            "
          >
            {isCheckedIn && !isCheckedOut
              ? elapsedTime
              : attendance?.totalHours
              ? `${attendance.totalHours}h`
              : "00:00:00"}
          </div>

          {/* WORK MODE */}
          {!isCheckedIn && (
            <div
              className="
                flex
                items-center
                gap-0.5
                mt-2
                bg-[#143245]
                p-0.5
                rounded-md
                border
                border-[#143245]
                w-full
                max-w-[150px]
              "
            >
              <button
                type="button"
                onClick={() => setWorkMode("Office")}
                className={`
                  flex-1
                  py-1
                  rounded
                  text-[8px]
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-1
                  ${
                    workMode === "Office"
                      ? "bg-white text-[#204A65]"
                      : "text-[#C3D8E6] hover:text-white hover:bg-[#3881A6]"
                  }
                `}
              >
                <Building className="w-2.5 h-2.5" />
                Office
              </button>

              <button
                type="button"
                onClick={() => setWorkMode("Remote")}
                className={`
                  flex-1
                  py-1
                  rounded
                  text-[8px]
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-1
                  ${
                    workMode === "Remote"
                      ? "bg-white text-[#204A65]"
                      : "text-[#C3D8E6] hover:text-white hover:bg-[#3881A6]"
                  }
                `}
              >
                <Laptop className="w-2.5 h-2.5" />
                Remote
              </button>
            </div>
          )}
        </div>

        {/* ACTION */}
        <div className="flex flex-col justify-center gap-2">
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={submitting}
              className="
                w-full
                py-2.5
                px-3
                bg-[#3881A6]
                hover:bg-[#2a6482]
                text-white
                font-extrabold
                text-[10px]
                flex
                items-center
                justify-center
                gap-1.5
                disabled:opacity-50
              "
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Check In Now</span>
                </>
              )}
            </button>
          ) : !isCheckedOut ? (
            <button
              onClick={handleCheckOut}
              disabled={submitting}
              className="
                w-full
                py-2.5
                px-3
                bg-[#204A65]
                hover:bg-[#143245]
                text-white
                font-extrabold
                text-[10px]
                flex
                items-center
                justify-center
                gap-1.5
                disabled:opacity-50
              "
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check Out (End Day)</span>
                </>
              )}
            </button>
          ) : (
            <div
              className="
                p-3
                bg-[#EAF3F9]
                border
                border-[#C3D8E6]
                text-center
                flex
                flex-col
                justify-center
                min-h-[65px]
              "
            >
              <span
                className="
                  text-[10px]
                  font-extrabold
                  text-[#204A65]
                  flex
                  items-center
                  justify-center
                  gap-1
                "
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Shift Completed
              </span>

              <p
                className="
                  text-[8px]
                  font-bold
                  text-[#3881A6]
                  mt-1
                  uppercase
                  tracking-wide
                "
              >
                Status: {attendance?.status}
              </p>
            </div>
          )}

          {/* REMARKS */}
          {!isCheckedOut && (
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add optional notes/remarks..."
              className="
                w-full
                px-2.5
                py-2
                bg-[#EAF3F9]
                border
                border-[#C3D8E6]
                text-[10px]
                font-bold
                text-[#204A65]
                placeholder-[#3881A6]
                focus:outline-none
                focus:border-[#204A65]
              "
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInOutWidget;