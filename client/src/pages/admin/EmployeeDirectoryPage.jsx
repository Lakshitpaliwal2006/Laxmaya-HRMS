import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  UserPlus,
  Edit2,
  Eye,
  Mail,
  X,
  Save,
  Check,
  AlertCircle,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import demoAvatars from "../../utils/avatars";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useEmployeeInspection } from "../../context/EmployeeInspectionContext";

/* ---------- THEME ----------
   Primary  : #204A65  (navy blue)
   Hover    : #1A3D54
   Fill soft: #204A65/10
   Grey bg L: #F3F4F6 | Grey bg D: #1F2937
   Grey text: #6B7280 | Border L: #E5E7EB | Border D: #374151
---------------------------- */

const DEPARTMENTS = [
  "Engineering",
  "Product Design",
  "Sales & Marketing",
  "Human Resources",
  "Finance",
];

const STATUSES = ["All", "Active", "Inactive"];

const PAGE_SIZE = 10;

const emptyEmployee = () => ({
  name: "",
  email: "",
  password: "employee123",
  role: "employee",
  department: "Engineering",
  designation: "",
  phone: "+91 ",
  joiningDate: format(new Date(), "yyyy-MM-dd"),
  leaveBalance: { paid: 14, sick: 7, unpaid: 0 },
  address: { street: "", city: "Bengaluru", state: "Karnataka", zip: "" },
  emergencyContact: { name: "", relation: "", phone: "+91 " },
});

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#204A65] focus:outline-none";

const EmployeeDirectoryPage = () => {
  const navigate = useNavigate();
  const { selectEmployee } = useEmployeeInspection();
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDepts, setSelectedDepts] = useState([]); // [] === All
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false); // mobile rail

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (selectedDepts.length === 1) params.department = selectedDepts[0];

      const res = await api.get("/users", { params });
      if (res.data.success) {
        setEmployees(res.data.employees);
        if (res.data.departments) setDepartments(res.data.departments);
      }
    } catch (error) {
      toast.error("Could not load the directory. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedStatus, selectedDepts.join("|")]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus, selectedDepts.length]);

  const toggleDept = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedDepts([]);
    setSelectedStatus("All");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(search) || selectedDepts.length > 0 || selectedStatus !== "All";

  const visible = useMemo(() => {
    if (selectedDepts.length <= 1) return employees;
    return employees.filter((e) => selectedDepts.includes(e.department));
  }, [employees, selectedDepts]);

  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const activeCount = visible.filter((e) => e.status === "Active").length;
  const deptTotal = departments.length || DEPARTMENTS.length;

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.designation) {
      toast.error("Name, work email and designation are required.");
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.post("/users", newEmployee);
      if (res.data.success) {
        toast.success(res.data.message);
        setShowAddModal(false);
        setNewEmployee(emptyEmployee());
        fetchEmployees();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not add the employee.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const saveEmployee = async (id, payload, successMessage) => {
    const res = await api.put(`/users/${id}`, payload);
    if (res.data.success) {
      toast.success(successMessage);
      fetchEmployees();
    }
    return res;
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setActionLoading(true);
    try {
      await saveEmployee(
        selectedEmployee._id,
        selectedEmployee,
        "Employee updated",
      );
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save changes.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (employee) => {
    const nextStatus = employee.status === "Active" ? "Inactive" : "Active";
    try {
      await saveEmployee(
        employee._id,
        { ...employee, status: nextStatus },
        `${employee.name} is now ${nextStatus.toLowerCase()}`,
      );
    } catch (error) {
      toast.error("Could not change the status.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ───────────── LEFT RAIL: FILTERS ───────────── */}
      <aside
        className={`w-full lg:w-60 shrink-0 lg:sticky lg:top-6 ${filtersOpen ? "block" : "hidden lg:block"
          }`}
      >
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              Filters
            </div>
            {hasActiveFilters && (
              <span className="text-[11px] font-semibold text-[#204A65] dark:text-[#7BA8C4]">
                {selectedDepts.length +
                  (selectedStatus !== "All" ? 1 : 0) +
                  (search ? 1 : 0)}{" "}
                on
              </span>
            )}
          </div>

          {/* Department */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">
              Department
            </div>
            <div className="space-y-0.5">
              <label className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <input
                  type="checkbox"
                  checked={selectedDepts.length === 0}
                  onChange={() => setSelectedDepts([])}
                  className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                />
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 flex-1">
                  All departments
                </span>
                <span className="text-[11px] text-gray-400 tabular-nums">
                  {employees.length}
                </span>
              </label>

              {DEPARTMENTS.map((dept) => (
                <label
                  key={dept}
                  className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(dept)}
                    onChange={() => toggleDept(dept)}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate">
                    {dept}
                  </span>
                  <span className="text-[11px] text-gray-400 tabular-nums">
                    {deptCounts[dept] ?? 0}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5">
              Status
            </div>
            <div className="space-y-0.5">
              {STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60"
                >
                  <input
                    type="radio"
                    name="status-filter"
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus(status)}
                    className="w-3.5 h-3.5 border-gray-300 dark:border-gray-600 text-[#204A65] focus:ring-2 focus:ring-[#204A65] bg-transparent"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {status === "All" ? "Any status" : status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="px-4 py-3">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        </div>
      </aside>

      {/* ───────────── MAIN COLUMN ───────────── */}
      <div className="flex-1 min-w-0 w-full space-y-4">
        {/* Search + primary action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 shrink-0"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, employee ID or designation"
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs focus:ring-2 focus:ring-[#204A65] focus:outline-none shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white text-xs font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Onboard employee</span>
          </button>
        </div>

        {/* Inline stat strip */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 px-1">
          <span>
            <strong className="text-gray-900 dark:text-gray-100 font-bold tabular-nums">
              {visible.length}
            </strong>{" "}
            total
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>
            <strong className="text-[#204A65] dark:text-[#7BA8C4] font-bold tabular-nums">
              {activeCount}
            </strong>{" "}
            active
          </span>
          <span className="text-gray-300 dark:text-gray-700">·</span>
          <span>
            <strong className="text-[#204A65] dark:text-[#7BA8C4] font-bold tabular-nums">
              {selectedDepts.length || deptTotal}
            </strong>{" "}
            {(selectedDepts.length || deptTotal) === 1
              ? "department"
              : "departments"}
          </span>
          {hasActiveFilters && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <button
                onClick={resetFilters}
                className="text-[#204A65] dark:text-[#7BA8C4] font-semibold hover:underline"
              >
                Clear
              </button>
            </>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
            <div className="w-7 h-7 border-2 border-[#204A65] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading the directory</span>
          </div>
        ) : paged.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-12 text-center">
            <AlertCircle className="w-7 h-7 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
              No one matches these filters
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Widen the department or status filter, or clear the search.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paged.map((emp) => (
              <div
                key={emp._id}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-[#204A65]/40 dark:hover:border-[#204A65]/60 transition-all p-4 flex flex-col gap-3 group"
              >
                {/* Header: avatar, name, status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        emp.avatar || demoAvatars.generic(emp.name?.slice(0, 2))
                      }
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#204A65] dark:group-hover:text-[#7BA8C4] transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(emp)}
                    title={`Set to ${emp.status === "Active" ? "Inactive" : "Active"}`}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold transition-all ${emp.status === "Active"
                        ? "bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] border border-[#204A65]/25 hover:bg-[#204A65]/20"
                        : "bg-gray-200/70 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${emp.status === "Active"
                          ? "bg-[#204A65] dark:bg-[#7BA8C4]"
                          : "bg-gray-400"
                        }`}
                    />
                    {emp.status}
                  </button>
                </div>

                {/* ID, role */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                    {emp.employeeId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${emp.role === "admin"
                        ? "bg-[#204A65] text-white"
                        : "bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] border border-[#204A65]/25"
                      }`}
                  >
                    {emp.role === "admin" ? "Admin" : "Employee"}
                  </span>
                </div>

                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-semibold text-gray-900 dark:text-gray-200 mt-2">
                    {emp.department}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {emp.designation}
                  </div>
                </div>

                {/* Leave balance */}
                <div className="flex items-center gap-4 text-[11px] text-gray-600 dark:text-gray-300 tabular-nums">
                  <span>
                    <strong className="text-[#204A65] dark:text-[#7BA8C4]">
                      {emp.leaveBalance?.paid || 0}
                    </strong>{" "}
                    paid
                  </span>
                  <span>
                    <strong className="text-[#204A65] dark:text-[#7BA8C4]">
                      {emp.leaveBalance?.sick || 0}
                    </strong>{" "}
                    sick
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 pt-2 mt-auto border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      selectEmployee(emp, "dashboard");
                      navigate("/admin/employee-view");
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#204A65]/10 hover:bg-[#204A65] text-[#204A65] dark:text-[#7BA8C4] hover:text-white border border-[#204A65]/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Context
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setShowViewModal(true);
                    }}
                    title="Quick view"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all"
                  >
                    <Users className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(JSON.parse(JSON.stringify(emp)));
                      setShowEditModal(true);
                    }}
                    title="Edit details"
                    className="p-2 rounded-lg bg-[#204A65]/15 hover:bg-[#204A65] text-[#204A65] dark:text-[#7BA8C4] hover:text-white transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && visible.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 tabular-nums">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, visible.length)} of{" "}
              {visible.length}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - currentPage) <= 1,
                )
                .map((n, i, arr) => (
                  <React.Fragment key={n}>
                    {i > 0 && arr[i - 1] !== n - 1 && (
                      <span className="px-1 text-gray-400 text-[11px]">…</span>
                    )}
                    <button
                      onClick={() => setPage(n)}
                      className={`min-w-[26px] h-[26px] px-1.5 rounded-lg text-[11px] font-semibold tabular-nums transition-colors ${n === currentPage
                          ? "bg-[#204A65] text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───────────── MODAL: ADD ───────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Onboard employee
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    They'll be able to sign in as soon as you save.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    placeholder="Ramesh Patel"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    placeholder="ramesh@workzen.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                    className={fieldClass}
                  >
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployee.designation}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        designation: e.target.value,
                      })
                    }
                    placeholder="Backend Engineer"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────── MODAL: EDIT ───────────── */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#204A65]/10 text-[#204A65] dark:text-[#7BA8C4] flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Edit {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEmployee.employeeId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        name: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    value={selectedEmployee.email}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        email: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    value={selectedEmployee.department}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        department: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.designation}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        designation: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={selectedEmployee.status}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        status: e.target.value,
                      })
                    }
                    className={fieldClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={selectedEmployee.phone || ""}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        phone: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white font-semibold shadow-lg shadow-[#204A65]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────── MODAL: QUICK VIEW ───────────── */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-[#204A65]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedEmployee.avatar ||
                    demoAvatars.generic(selectedEmployee.name?.slice(0, 2))
                  }
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedEmployee.employeeId} ·{" "}
                    {selectedEmployee.designation}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Department
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5">
                    {selectedEmployee.department}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Work email
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5 break-all">
                    {selectedEmployee.email}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Phone
                  </span>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold mt-0.5">
                    {selectedEmployee.phone || "Not on file"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Status
                  </span>
                  <div
                    className={`font-semibold mt-0.5 ${selectedEmployee.status === "Active"
                        ? "text-[#204A65] dark:text-[#7BA8C4]"
                        : "text-gray-500 dark:text-gray-400"
                      }`}
                  >
                    {selectedEmployee.status}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Paid leave
                  </span>
                  <div className="text-lg font-bold text-[#204A65] dark:text-[#7BA8C4]">
                    {selectedEmployee.leaveBalance?.paid || 0} days
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Sick leave
                  </span>
                  <div className="text-lg font-bold text-[#204A65] dark:text-[#7BA8C4]">
                    {selectedEmployee.leaveBalance?.sick || 0} days
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Total
                  </span>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {(selectedEmployee.leaveBalance?.paid || 0) +
                      (selectedEmployee.leaveBalance?.sick || 0)}{" "}
                    days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  selectEmployee(selectedEmployee, "dashboard");
                  navigate("/admin/employee-view");
                }}
                className="px-5 py-2 rounded-xl bg-[#204A65] hover:bg-[#1A3D54] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Full context
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectoryPage;