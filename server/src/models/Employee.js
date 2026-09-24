const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },
  department: {
    type: String,
    required: true,
    default: "General",
  },
  role: {
    type: String,
    enum: ["admin", "employee", "superadmin", "manager", "financeadmin"],
    default: "employee",
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;