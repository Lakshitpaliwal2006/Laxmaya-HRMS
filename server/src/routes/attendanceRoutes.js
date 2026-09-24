const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendanceHistory,
  getMyWeeklyView,
  getAllAttendance,
  getManagerAttendance,
  updateAttendanceRecord,
} = require("../controllers/attendanceController");
// Employee actions & personal logs
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/today", getTodayStatus);
router.get("/my-history", getMyAttendanceHistory);
router.get("/my-weekly", getMyWeeklyView);
router.get("/weekly-view", getMyWeeklyView);

// Admin oversight & management
router.get("/all",getAllAttendance);
router.get("/manager", getManagerAttendance);
router.put("/:id",updateAttendanceRecord);

module.exports = router;