const Attendance = require("../models/Attendance");
const User = require("../models/User");

const {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} = require("date-fns");

// ============================================================
// HELPER
// ============================================================

const getTodayDateStr = () => {
  return format(new Date(), "yyyy-MM-dd");
};

// ============================================================
// CHECK-IN
// ============================================================

// @desc    Check-in for today
// @route   POST /api/attendance/check-in
// @access  Private
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayDateStr();

    const { workMode = "Office", remarks = "" } = req.body;

    // Check if attendance already exists today
    let attendance = await Attendance.findOne({
      userId,
      date: todayStr,
    });

    // Already checked in
    if (attendance && attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: `You have already checked in today at ${format(
          new Date(attendance.checkIn),
          "hh:mm a",
        )}`,
      });
    }

    // Create new attendance
    if (!attendance) {
      attendance = new Attendance({
        userId,
        date: todayStr,
        checkIn: new Date(),
        workMode,
        remarks: remarks || "Checked in on time",
        status: "Present",
      });
    } else {
      // Existing record but no check-in
      attendance.checkIn = new Date();
      attendance.workMode = workMode;
      attendance.status = "Present";

      if (remarks) {
        attendance.remarks = remarks;
      }
    }

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: `Punch-in recorded successfully at ${format(
        attendance.checkIn,
        "hh:mm a",
      )} (${workMode})`,
      attendance,
    });
  } catch (error) {
    console.error("CheckIn Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record check-in",
      error: error.message,
    });
  }
};

// ============================================================
// CHECK-OUT
// ============================================================

// @desc    Check-out for today
// @route   POST /api/attendance/check-out
// @access  Private
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const todayStr = getTodayDateStr();

    const { remarks } = req.body;

    const attendance = await Attendance.findOne({
      userId,
      date: todayStr,
    });

    // Not checked in
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "You have not checked in today. Please check in first.",
      });
    }

    // Already checked out
    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: `You have already checked out today at ${format(
          new Date(attendance.checkOut),
          "hh:mm a",
        )}`,
      });
    }

    const checkOutTime = new Date();

    attendance.checkOut = checkOutTime;

    // Calculate working hours
    const durationMs = checkOutTime - new Date(attendance.checkIn);

    const hours = Math.max(0, durationMs / (1000 * 60 * 60));

    attendance.totalHours = parseFloat(hours.toFixed(2));

    // Determine status
    if (attendance.totalHours >= 7.5) {
      attendance.status = "Present";
    } else if (attendance.totalHours >= 4.0) {
      attendance.status = "Half-day";
    } else {
      attendance.status = "Half-day";
    }

    // Add checkout remarks
    if (remarks) {
      attendance.remarks = attendance.remarks
        ? `${attendance.remarks} | ${remarks}`
        : remarks;
    }

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: `Punch-out recorded successfully at ${format(
        checkOutTime,
        "hh:mm a",
      )}. Total hours: ${attendance.totalHours} hrs`,
      attendance,
    });
  } catch (error) {
    console.error("CheckOut Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record check-out",
      error: error.message,
    });
  }
};

// ============================================================
// TODAY STATUS
// ============================================================

// @desc    Get today's attendance status
// @route   GET /api/attendance/today
// @access  Private
const getTodayStatus = async (req, res) => {
  try {
    const userId =
      req.user.role === "admin" && req.query.userId
        ? req.query.userId
        : req.user._id;

    const todayStr = getTodayDateStr();

    const attendance = await Attendance.findOne({
      userId,
      date: todayStr,
    });

    return res.status(200).json({
      success: true,
      date: todayStr,
      attendance: attendance || null,
      isCheckedIn: !!(attendance && attendance.checkIn),
      isCheckedOut: !!(attendance && attendance.checkOut),
    });
  } catch (error) {
    console.error("Today Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today attendance status",
      error: error.message,
    });
  }
};

// ============================================================
// MY ATTENDANCE HISTORY
// ============================================================

// @desc    Get personal attendance history
// @route   GET /api/attendance/my-history
// @access  Private
const getMyAttendanceHistory = async (req, res) => {
  try {
    const userId =
      req.user.role === "admin" && req.query.userId
        ? req.query.userId
        : req.user._id;

    const { month, year, limit = 30 } = req.query;

    const query = {
      userId,
    };

    if (month && year) {
      const monthStr = String(month).padStart(2, "0");

      query.date = {
        $regex: `^${year}-${monthStr}`,
      };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit, 10));

    // Statistics
    const totalRecords = records.length;

    const presentCount = records.filter((r) => r.status === "Present").length;

    const halfDayCount = records.filter((r) => r.status === "Half-day").length;

    const leaveCount = records.filter((r) => r.status === "Leave").length;

    const totalHoursWorked = records.reduce(
      (acc, curr) => acc + (curr.totalHours || 0),
      0,
    );

    const avgDailyHours =
      totalRecords > 0 ? (totalHoursWorked / totalRecords).toFixed(1) : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalRecords,
        presentCount,
        halfDayCount,
        leaveCount,
        totalHoursWorked: totalHoursWorked.toFixed(1),
        avgDailyHours,
      },

      records,
    });
  } catch (error) {
    console.error("Attendance History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance history",
      error: error.message,
    });
  }
};

// ============================================================
// WEEKLY ATTENDANCE
// ============================================================

// @desc    Get current week attendance
// @route   GET /api/attendance/my-weekly
// @access  Private
const getMyWeeklyView = async (req, res) => {
  try {
    const userId =
      req.user.role === "admin" && req.query.userId
        ? req.query.userId
        : req.user._id;

    const today = new Date();

    const weekStart = startOfWeek(today, {
      weekStartsOn: 1,
    });

    const weekEnd = endOfWeek(today, {
      weekStartsOn: 1,
    });

    const days = eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    });

    const dateStrings = days.map((d) => format(d, "yyyy-MM-dd"));

    const records = await Attendance.find({
      userId,
      date: {
        $in: dateStrings,
      },
    });

    const recordMap = {};

    records.forEach((r) => {
      recordMap[r.date] = r;
    });

    const weeklyDays = days.map((d) => {
      const dateStr = format(d, "yyyy-MM-dd");

      const isPastOrToday = d <= today;

      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      const record = recordMap[dateStr];

      let status = "Upcoming";

      if (record) {
        status = record.status;
      } else if (isPastOrToday) {
        status = isWeekend ? "Weekend" : "Absent";
      }

      return {
        date: dateStr,

        dayName: format(d, "EEEE"),

        shortDay: format(d, "EEE"),

        dayNumber: format(d, "d"),

        isToday: dateStr === getTodayDateStr(),

        status,

        checkIn: record?.checkIn || null,

        checkOut: record?.checkOut || null,

        totalHours: record?.totalHours || 0,

        workMode: record?.workMode || (isWeekend ? "Weekend" : "Office"),

        remarks: record?.remarks || "",
      };
    });

    return res.status(200).json({
      success: true,

      weekStart: format(weekStart, "yyyy-MM-dd"),

      weekEnd: format(weekEnd, "yyyy-MM-dd"),

      weeklyDays,
    });
  } catch (error) {
    console.error("Weekly View Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve weekly attendance view",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL ATTENDANCE
// ADMIN + SUPER ADMIN
// ============================================================

// @desc    Get attendance records
// @route   GET /api/attendance/all
// @access  Private (Admin / Super Admin)
// ============================================================
// GET ALL ATTENDANCE
// ADMIN + SUPER ADMIN
// ============================================================

// @desc    Get attendance records
// @route   GET /api/attendance/all
// @access  Private (Admin / Super Admin)

const getAllAttendance = async (req, res) => {
  try {
    const { date, department, status, search, role } = req.query;

    // ========================================================
    // BASE QUERY
    // ========================================================

    const query = {
      date: date || getTodayDateStr(),
    };

    // ========================================================
    // STATUS FILTER
    // ========================================================

    if (status && status !== "All") {
      query.status = status;
    }

    // ========================================================
    // ROLE FILTER
    // IMPORTANT:
    // Find User IDs first, then query Attendance.
    // This guarantees Manager records are included.
    // ========================================================

    let roleUsers = null;

    if (role && role !== "All" && role !== "all") {
      const users = await User.find({
        role: role,
      }).select("_id");

      const userIds = users.map((user) => user._id);

      query.userId = {
        $in: userIds,
      };
    }

    // ========================================================
    // GET ATTENDANCE
    // ========================================================

    let records = await Attendance.find(query)
      .populate(
        "userId",
        "name email employeeId department designation avatar status role",
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    // ========================================================
    // DEPARTMENT FILTER
    // ========================================================

    if (department && department !== "All") {
      records = records.filter(
        (record) => record.userId && record.userId.department === department,
      );
    }

    // ========================================================
    // SEARCH FILTER
    // ========================================================

    if (search) {
      const searchText = search.toLowerCase().trim();

      records = records.filter((record) => {
        if (!record.userId) {
          return false;
        }

        const name = record.userId.name?.toLowerCase() || "";

        const email = record.userId.email?.toLowerCase() || "";

        const employeeId = record.userId.employeeId?.toLowerCase() || "";

        const departmentName = record.userId.department?.toLowerCase() || "";

        const designation = record.userId.designation?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          employeeId.includes(searchText) ||
          departmentName.includes(searchText) ||
          designation.includes(searchText)
        );
      });
    }

    // ========================================================
    // STATISTICS
    // ========================================================

    const totalPresent = records.filter(
      (record) => record.status === "Present",
    ).length;

    const totalHalfDay = records.filter(
      (record) => record.status === "Half-day",
    ).length;

    const totalLeave = records.filter(
      (record) => record.status === "Leave",
    ).length;

    const totalAbsent = records.filter(
      (record) => record.status === "Absent",
    ).length;

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,

      date: query.date,

      role: role && role !== "All" ? role : "All",

      count: records.length,

      stats: {
        totalPresent,
        totalHalfDay,
        totalLeave,
        totalAbsent,
      },

      records,
    });
  } catch (error) {
    console.error("Get All Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve company attendance",
      error: error.message,
    });
  }
};
// ============================================================
// UPDATE ATTENDANCE RECORD
// ============================================================

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Admin / Super Admin)
const updateAttendanceRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const { checkIn, checkOut, status, workMode, remarks } = req.body;

    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    // ========================================================
    // CHECK-IN
    // ========================================================

    if (checkIn !== undefined) {
      attendance.checkIn = checkIn ? new Date(checkIn) : null;
    }

    // ========================================================
    // CHECK-OUT
    // ========================================================

    if (checkOut !== undefined) {
      attendance.checkOut = checkOut ? new Date(checkOut) : null;
    }

    // ========================================================
    // STATUS
    // ========================================================

    if (status !== undefined) {
      attendance.status = status;
    }

    // ========================================================
    // WORK MODE
    // ========================================================

    if (workMode !== undefined) {
      attendance.workMode = workMode;
    }

    // ========================================================
    // REMARKS
    // ========================================================

    if (remarks !== undefined) {
      attendance.remarks = remarks;
    }

    // ========================================================
    // RECALCULATE HOURS
    // ========================================================

    if (attendance.checkIn && attendance.checkOut) {
      const difference =
        new Date(attendance.checkOut).getTime() -
        new Date(attendance.checkIn).getTime();

      attendance.totalHours = Number(
        (difference / (1000 * 60 * 60)).toFixed(2),
      );
    } else {
      attendance.totalHours = 0;
    }

    await attendance.save();

    // ========================================================
    // RETURN UPDATED RECORD
    // ========================================================

    const updatedAttendance = await Attendance.findById(id).populate(
      "userId",
      "name email employeeId department designation avatar status role",
    );

    return res.status(200).json({
      success: true,

      message: "Attendance updated successfully",

      attendance: updatedAttendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

const getManagerAttendance = async (req, res) => {
  try {
    const { date, status, search } = req.query;

    const query = {
      // IMPORTANT:
      // We do not accept role from frontend.
      // Backend will always return manager attendance.
    };

    query.date = date || getTodayDateStr();

    if (status && status !== "All") {
      query.status = status;
    }

    let records = await Attendance.find(query)
      .populate(
        "userId",
        "name email employeeId department designation avatar status role",
      )
      .sort({
        createdAt: -1,
      });

    // =========================================
    // IMPORTANT SECURITY FILTER
    // =========================================
    // Only Manager records are allowed.
    records = records.filter(
      (record) => record.userId && record.userId.role === "manager",
    );

    // =========================================
    // SEARCH
    // =========================================
    if (search) {
      const searchText = search.toLowerCase().trim();

      records = records.filter((record) => {
        if (!record.userId) return false;

        const name = record.userId.name?.toLowerCase() || "";

        const email = record.userId.email?.toLowerCase() || "";

        const employeeId = record.userId.employeeId?.toLowerCase() || "";

        const department = record.userId.department?.toLowerCase() || "";

        const designation = record.userId.designation?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          employeeId.includes(searchText) ||
          department.includes(searchText) ||
          designation.includes(searchText)
        );
      });
    }

    // =========================================
    // STATS
    // =========================================
    const totalPresent = records.filter(
      (record) => record.status === "Present",
    ).length;

    const totalHalfDay = records.filter(
      (record) => record.status === "Half-day",
    ).length;

    const totalLeave = records.filter(
      (record) => record.status === "Leave",
    ).length;

    const totalAbsent = records.filter(
      (record) => record.status === "Absent",
    ).length;

    return res.status(200).json({
      success: true,
      date: query.date,

      // Clearly tells frontend this endpoint is manager-only
      role: "manager",

      count: records.length,

      stats: {
        totalPresent,
        totalHalfDay,
        totalLeave,
        totalAbsent,
      },

      records,
    });
  } catch (error) {
    console.error("Get Manager Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve manager attendance",
      error: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendanceHistory,
  getMyWeeklyView,
  getAllAttendance,
  getManagerAttendance,
  updateAttendanceRecord,
};