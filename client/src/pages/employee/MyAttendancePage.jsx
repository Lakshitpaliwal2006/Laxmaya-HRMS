import React, { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import CheckInOutWidget from "../../components/attendance/CheckInOutWidget";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { format } from "date-fns";

const MyAttendancePage = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  const toast = useToast();

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);

      const [weeklyRes, historyRes] = await Promise.all([
        api.get("/attendance/my-weekly"),
        api.get("/attendance/my-history?limit=30"),
      ]);

      if (weeklyRes.data.success) {
        setWeeklyData(weeklyRes.data.weeklyDays || []);
      }

      if (historyRes.data.success) {
        setHistoryData(historyRes.data.records || []);
        setStats(historyRes.data.stats || null);
      }
    } catch (error) {
      toast.error("Failed to load attendance logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center gap-1 px-2 py-1 text-[9px] sm:text-[10px] font-black uppercase border-2 whitespace-nowrap";

    switch (status) {
      case "Present":
        return (
          <span
            className={
              base +
              " bg-[#EAF3F9] text-[#204A65] border-[#204A65]"
            }
          >
            <CheckCircle2 className="w-3 h-3" />
            Present
          </span>
        );

      case "Half-day":
        return (
          <span
            className={
              base +
              " bg-white text-[#3881A6] border-[#3881A6]"
            }
          >
            <Clock className="w-3 h-3" />
            Half-day
          </span>
        );

      case "Leave":
        return (
          <span
            className={
              base +
              " bg-[#C3D8E6] text-[#204A65] border-[#C3D8E6]"
            }
          >
            <CalendarDays className="w-3 h-3" />
            Leave
          </span>
        );

      case "Weekend":
        return (
          <span
            className={
              base +
              " bg-[#EAF3F9] text-[#3881A6] border-[#C3D8E6]"
            }
          >
            Weekend
          </span>
        );

      case "Absent":
        return (
          <span
            className={
              base +
              " bg-[#204A65] text-white border-[#204A65]"
            }
          >
            <AlertCircle className="w-3 h-3" />
            Absent
          </span>
        );

      default:
        return (
          <span
            className={
              base +
              " bg-white text-[#204A65] border-[#C3D8E6]"
            }
          >
            {status}
          </span>
        );
    }
  };

  const filteredHistory = historyData.filter((r) => {
    const matchesStatus =
      selectedStatus === "All" ||
      r.status === selectedStatus;

    const matchesSearch =
      !search ||
      r.date.includes(search) ||
      (r.remarks &&
        r.remarks.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div
      className="
        space-y-4
        sm:space-y-5
        bg-[#EAF3F9]
        min-h-screen
        p-3
        sm:p-4
        font-sans
      "
    >
      {/* TOP ATTENDANCE WIDGET */}
      <CheckInOutWidget
        onAttendanceChange={fetchAttendanceData}
      />

      {/* WEEKLY VIEW */}
      {/* WEEKLY VIEW */}
<div className="space-y-3">
  <div
    className="
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-2.5
    "
  >
    {/* Section Title */}
    <div className="flex items-center gap-2">
      <div
        className="
          w-8
          h-8
          flex
          items-center
          justify-center
          bg-[#EAF3F9]
          border-2
          border-[#C3D8E6]
        "
      >
        <Calendar className="w-4 h-4 text-[#3881A6]" />
      </div>

      <div>
        <h3
          className="
            text-sm
            font-black
            text-[#204A65]
            uppercase
            tracking-tight
          "
        >
          Current Week Schedule
        </h3>

        <p
          className="
            text-[9px]
            font-semibold
            text-[#3881A6]
            uppercase
            tracking-wide
            mt-0.5
          "
        >
          Weekly attendance overview
        </p>
      </div>
    </div>

    {/* Week Range */}
    <div
      className="
        self-start
        sm:self-auto
        flex
        items-center
        gap-2
        px-3
        py-2
        bg-white
        border-2
        border-[#C3D8E6]
      "
    >
      <CalendarDays className="w-3.5 h-3.5 text-[#3881A6]" />

      <div className="flex flex-col leading-none">
        <span
          className="
            text-[8px]
            font-bold
            text-[#3881A6]
            uppercase
            tracking-wider
          "
        >
          Week Range
        </span>

        <span
          className="
            text-[10px]
            font-black
            text-[#204A65]
            uppercase
            mt-1
          "
        >
          Mon <span className="text-[#3881A6]">–</span> Sun
        </span>
      </div>
    </div>
  </div>

  {/* Weekly Cards */}
  <div
    className="
      grid
      grid-cols-2
      sm:grid-cols-4
      lg:grid-cols-7
      gap-2
    "
  >
    {weeklyData.map((day) => (
      <div
        key={day.date}
        className={`
          p-3
          flex
          flex-col
          justify-between
          min-h-[115px]
          border-2
          transition-colors

          ${
            day.isToday
              ? "bg-[#204A65] border-[#204A65]"
              : day.status === "Weekend"
              ? "bg-[#EAF3F9] border-[#C3D8E6]"
              : "bg-white border-[#C3D8E6]"
          }
        `}
      >
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              className={`
                text-[10px]
                font-black
                uppercase
                ${
                  day.isToday
                    ? "text-[#C3D8E6]"
                    : "text-[#3881A6]"
                }
              `}
            >
              {day.shortDay}
            </span>

            {day.isToday && (
              <span
                className="
                  text-[8px]
                  uppercase
                  font-black
                  px-1.5
                  py-0.5
                  bg-[#3881A6]
                  text-white
                "
              >
                Today
              </span>
            )}
          </div>

          <div
            className={`
              text-xl
              font-black
              ${
                day.isToday
                  ? "text-white"
                  : "text-[#204A65]"
              }
            `}
          >
            {day.dayNumber}
          </div>
        </div>

        <div className="space-y-1.5 mt-2">
          <div>
            {getStatusBadge(day.status)}
          </div>

          <div
            className={`
              text-[9px]
              font-mono
              font-bold
              ${
                day.isToday
                  ? "text-[#C3D8E6]"
                  : "text-[#3881A6]"
              }
            `}
          >
            {day.totalHours > 0
              ? `${day.totalHours} hrs`
              : day.checkIn
              ? "In Progress"
              : "—"}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* MONTHLY METRICS */}
      {stats && (
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-2
            sm:gap-3
          "
        >
          <div className="p-3 sm:p-4 bg-white border-2 border-[#C3D8E6]">
            <span className="text-[9px] font-black text-[#3881A6] uppercase">
              Present Days
            </span>

            <div className="text-2xl font-black text-[#204A65] mt-0.5">
              {stats.presentCount}

              <span className="text-[10px] font-bold text-[#3881A6] ml-1">
                days
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-[#C3D8E6]">
            <span className="text-[9px] font-black text-[#3881A6] uppercase">
              Half-Days
            </span>

            <div className="text-2xl font-black text-[#204A65] mt-0.5">
              {stats.halfDayCount}

              <span className="text-[10px] font-bold text-[#3881A6] ml-1">
                days
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-[#C3D8E6]">
            <span className="text-[9px] font-black text-[#3881A6] uppercase">
              Total Hours
            </span>

            <div className="text-2xl font-black text-[#204A65] mt-0.5">
              {stats.totalHoursWorked}

              <span className="text-[10px] font-bold text-[#3881A6] ml-1">
                hrs
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white border-2 border-[#C3D8E6]">
            <span className="text-[9px] font-black text-[#3881A6] uppercase">
              Daily Average
            </span>

            <div className="text-2xl font-black text-[#204A65] mt-0.5">
              {stats.avgDailyHours}

              <span className="text-[10px] font-bold text-[#3881A6] ml-1">
                hrs/day
              </span>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY */}
      <div className="space-y-3">
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            justify-between
            gap-3
          "
        >
          <h3
            className="
              text-sm
              font-black
              text-[#204A65]
              uppercase
              flex items-center
              gap-1.5
            "
          >
            <Clock className="w-4 h-4 text-[#3881A6]" />

            Attendance History Log
          </h3>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            {/* SEARCH */}
            <div className="relative w-full sm:w-auto">
              <Search
                className="
                  w-3.5
                  h-3.5
                  text-[#3881A6]
                  absolute
                  inset-y-0
                  left-2.5
                  my-auto
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search date or remarks..."
                className="
                  w-full
                  sm:w-[220px]
                  pl-8
                  pr-3
                  py-2
                  bg-[#EAF3F9]
                  border-2
                  border-[#C3D8E6]
                  text-xs
                  font-bold
                  text-[#204A65]
                  focus:outline-none
                  focus:border-[#204A65]
                "
              />
            </div>

            {/* FILTER */}
            <div
              className="
                flex items-center
                gap-1
                bg-white
                border-2
                border-[#C3D8E6]
                p-1
              "
            >
              <Filter className="w-3.5 h-3.5 text-[#3881A6] ml-1" />

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
                className="
                  px-1.5
                  py-1
                  bg-white
                  text-xs
                  font-bold
                  text-[#204A65]
                  focus:outline-none
                "
              >
                <option value="All">
                  All Statuses
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
        </div>

        {/* TABLE */}
        <div
          className="
            bg-white
            border-2
            border-[#C3D8E6]
            overflow-hidden
          "
        >
          {loading ? (
            <div
              className="
                p-8
                text-center
                text-[#204A65]
                text-xs
                font-black
                uppercase
              "
            >
              Loading attendance history...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div
              className="
                p-8
                text-center
                text-[#3881A6]
                text-xs
                font-bold
                uppercase
              "
            >
              No attendance logs found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  text-left
                  text-xs
                  min-w-[850px]
                "
              >
                <thead className="bg-[#204A65] text-white">
                  <tr>
                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Date
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Check-In
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Check-Out
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Duration
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Work Mode
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Status
                    </th>

                    <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y-2 divide-[#EAF3F9]">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-[#EAF3F9]"
                    >
                      <td className="px-4 py-3 text-[#204A65] font-mono font-black">
                        {item.date}
                      </td>

                      <td className="px-4 py-3 text-[#3881A6] font-mono font-bold whitespace-nowrap">
                        {item.checkIn
                          ? format(
                              new Date(item.checkIn),
                              "hh:mm a"
                            )
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-[#3881A6] font-mono font-bold whitespace-nowrap">
                        {item.checkOut
                          ? format(
                              new Date(item.checkOut),
                              "hh:mm a"
                            )
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-[#204A65] font-black whitespace-nowrap">
                        {item.totalHours
                          ? `${item.totalHours} hrs`
                          : item.checkIn
                          ? "In Progress"
                          : "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1
                            text-[#204A65]
                            font-bold
                            text-[9px]
                            uppercase
                            bg-[#EAF3F9]
                            px-1.5
                            py-1
                            border-2
                            border-[#C3D8E6]
                            whitespace-nowrap
                          "
                        >
                          {item.workMode === "Remote" ? (
                            <Laptop className="w-3 h-3 text-[#3881A6]" />
                          ) : (
                            <Building className="w-3 h-3 text-[#3881A6]" />
                          )}

                          {item.workMode}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>

                      <td
                        className="
                          px-4
                          py-3
                          text-[#3881A6]
                          font-bold
                          max-w-[220px]
                          truncate
                        "
                        title={item.remarks}
                      >
                        {item.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAttendancePage;