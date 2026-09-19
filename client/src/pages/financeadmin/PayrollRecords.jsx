import React, { useState, useEffect } from 'react';
import {
    Calendar,
    CreditCard,
    Plus,
    Edit2,
    Eye,
    Search,
    Filter,
    X,
    Check,
    Save,
    Sparkles,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';

const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
];

const PayrollRecords = () => {
    const [selectedMonth, setSelectedMonth] = useState(8);
    const [selectedYear, setSelectedYear] = useState(2026);
    const [department, setDepartment] = useState('All');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
    const [search, setSearch] = useState('');

    const [records, setRecords] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [newSalary, setNewSalary] = useState({
        userId: '',
        month: 8,
        year: 2026,
        basicSalary: 60000,
        hra: 20000,
        allowances: 10000,
        deductions: {
            tax: 6000,
            pf: 3500,
            unpaidLeaveDeduction: 0,
            other: 0,
        },
        paymentStatus: 'Paid',
        remarks: 'Monthly salary disbursement',
    });

    const toast = useToast();

    const fetchPayrollData = async () => {
        try {
            setLoading(true);

            const params = {
                month: selectedMonth,
                year: selectedYear,
            };

            if (department !== 'All') params.department = department;
            if (paymentStatusFilter !== 'All') {
                params.paymentStatus = paymentStatusFilter;
            }
            if (search) params.search = search;

            const [payRes, usersRes] = await Promise.all([
                api.get('/salaries/all', { params }),
                api.get('/users'),
            ]);

            if (payRes.data.success) {
                setRecords(payRes.data.records || []);
            }

            if (usersRes.data.success) {
                setEmployeesList(usersRes.data.employees || []);

                if (
                    !newSalary.userId &&
                    usersRes.data.employees?.length > 0
                ) {
                    setNewSalary((prev) => ({
                        ...prev,
                        userId: usersRes.data.employees[0]._id,
                    }));
                }
            }
        } catch (error) {
            toast.error('Failed to load payroll records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrollData();
    }, [
        selectedMonth,
        selectedYear,
        department,
        paymentStatusFilter,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPayrollData();
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleGeneratePayslip = async (e) => {
        e.preventDefault();

        if (!newSalary.userId || !newSalary.basicSalary) {
            toast.error(
                'Please select an employee and specify basic salary'
            );
            return;
        }

        setActionLoading(true);

        try {
            const res = await api.post('/salaries', newSalary);

            if (res.data.success) {
                toast.success(res.data.message);
                setShowGenerateModal(false);
                fetchPayrollData();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to generate payslip'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateSalary = async (e) => {
        e.preventDefault();

        if (!selectedRecord) return;

        setActionLoading(true);

        try {
            const res = await api.put(
                `/salaries/${selectedRecord._id}`,
                selectedRecord
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setShowEditModal(false);
                fetchPayrollData();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Failed to update salary'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const inputClass =
        'w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500';

    const labelClass =
        'block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1';

    return (
        <div className="space-y-4">

            {/* GENERATE BUTTON */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r  bg-[#153B50] border-2 border-[#153B50] text-white sm:text-[11px] font-semibold shadow-glow flex items-center gap-1.5 transition-all"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span >Generate Monthly Payslip</span>
                </button>
            </div>

            {/* FILTER BAR */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">

                    {/* CYCLE */}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />

                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Cycle:
                        </span>

                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(Number(e.target.value))
                            }
                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                            {months.map((m) => (
                                <option key={m.num} value={m.num}>
                                    {m.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(Number(e.target.value))
                            }
                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                            <option value={2026}>2026</option>
                            <option value={2025}>2025</option>
                        </select>
                    </div>

                    {/* DEPARTMENT */}
                    <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />

                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                            <option value="All">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Product Design">
                                Product Design
                            </option>
                            <option value="Sales & Marketing">
                                Sales & Marketing
                            </option>
                            <option value="Human Resources">
                                Human Resources
                            </option>
                            <option value="Finance">Finance</option>
                        </select>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="relative w-full lg:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute inset-y-0 left-2.5 my-auto" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search employee name or ID..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                </div>
            </div>

            {/* PAYROLL TABLE */}
            <div className="rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-card">

                {loading ? (
                    <div className="p-10 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                        <div className="w-7 h-7 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />

                        <span className="text-[10px]">
                            Loading company payroll records...
                        </span>
                    </div>
                ) : records.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-[10px]">
                        No salary records generated for this cycle. Click
                        "Generate Monthly Payslip" to create.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-[10px]">

                            <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-3 py-2.5">
                                        Employees
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Department
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Basic Pay
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Allowances
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Deductions
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Net Salary
                                    </th>
                                    <th className="px-3 py-2.5">
                                        Status
                                    </th>
                                    <th className="px-3 py-2.5 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                                {records.map((r) => (
                                    <tr
                                        key={r._id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                                    >
                                        {/* EMPLOYEE */}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={
                                                        r.userId?.avatar ||
                                                        demoAvatars.generic(
                                                            r.userId?.name?.slice(0, 2)
                                                        )
                                                    }
                                                    alt={r.userId?.name}
                                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                />

                                                <div className="min-w-0">
                                                    <div className="text-[10px] font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                                                        {r.userId?.name || 'Staff Member'}
                                                    </div>

                                                    <div className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">
                                                        {r.userId?.employeeId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DEPARTMENT */}
                                        <td className="px-3 py-2.5">
                                            <div className="text-[10px] text-slate-900 dark:text-slate-200 font-semibold">
                                                {r.userId?.department}
                                            </div>

                                            <div className="text-[8px] text-slate-500 dark:text-slate-400">
                                                {r.userId?.designation}
                                            </div>
                                        </td>

                                        {/* BASIC */}
                                        <td className="px-3 py-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                            ₹{r.basicSalary?.toLocaleString('en-IN')}
                                        </td>

                                        {/* ALLOWANCES */}
                                        <td className="px-3 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                            +₹
                                            {(
                                                (r.hra || 0) +
                                                (r.allowances || 0)
                                            ).toLocaleString('en-IN')}
                                        </td>

                                        {/* DEDUCTIONS */}
                                        <td className="px-3 py-2.5 font-mono text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                            -₹
                                            {(r.grossSalary - r.netSalary).toLocaleString(
                                                'en-IN'
                                            )}
                                        </td>

                                        {/* NET */}
                                        <td className="px-3 py-2.5 font-mono font-bold text-slate-900 dark:text-white text-[11px] whitespace-nowrap">
                                            ₹{r.netSalary?.toLocaleString('en-IN')}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-3 py-2.5">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold ${r.paymentStatus === 'Paid'
                                                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25'
                                                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25'
                                                    }`}
                                            >
                                                {r.paymentStatus}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-3 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1">

                                                <button
                                                    onClick={() => {
                                                        setSelectedRecord(r);
                                                        setShowViewModal(true);
                                                    }}
                                                    title="View Official Payslip"
                                                    className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedRecord(
                                                            JSON.parse(JSON.stringify(r))
                                                        );
                                                        setShowEditModal(true);
                                                    }}
                                                    title="Edit Salary Structure"
                                                    className="p-1.5 rounded-md bg-emerald-600/15 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white transition-all"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* =====================================================
          MODAL 1: GENERATE MONTHLY PAYSLIP
      ===================================================== */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl">

                        {/* HEADER */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Generate Monthly Payslip
                                    </h3>

                                    <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                        Create employee salary breakdown
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowGenerateModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleGeneratePayslip}
                            className="p-4 space-y-3 text-[10px]"
                        >

                            {/* EMPLOYEE */}
                            <div>
                                <label className={labelClass}>
                                    Select Employee *
                                </label>

                                <select
                                    required
                                    value={newSalary.userId}
                                    onChange={(e) =>
                                        setNewSalary({
                                            ...newSalary,
                                            userId: e.target.value,
                                        })
                                    }
                                    className={inputClass}
                                >
                                    {employeesList.map((emp) => (
                                        <option
                                            key={emp._id}
                                            value={emp._id}
                                        >
                                            {emp.name} ({emp.employeeId}) —{' '}
                                            {emp.department}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* MONTH + YEAR */}
                            <div className="grid grid-cols-2 gap-2.5">

                                <div>
                                    <label className={labelClass}>
                                        Pay Month
                                    </label>

                                    <select
                                        value={newSalary.month}
                                        onChange={(e) =>
                                            setNewSalary({
                                                ...newSalary,
                                                month: Number(e.target.value),
                                            })
                                        }
                                        className={inputClass}
                                    >
                                        {months.map((m) => (
                                            <option
                                                key={m.num}
                                                value={m.num}
                                            >
                                                {m.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Pay Year
                                    </label>

                                    <input
                                        type="number"
                                        value={newSalary.year}
                                        onChange={(e) =>
                                            setNewSalary({
                                                ...newSalary,
                                                year: Number(e.target.value),
                                            })
                                        }
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* EARNINGS */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

                                <span className="font-bold text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                                    Earnings Components
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                                    <div>
                                        <label className={labelClass}>
                                            Basic Salary (₹)
                                        </label>

                                        <input
                                            type="number"
                                            required
                                            value={newSalary.basicSalary}
                                            onChange={(e) =>
                                                setNewSalary({
                                                    ...newSalary,
                                                    basicSalary: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            HRA (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={newSalary.hra}
                                            onChange={(e) =>
                                                setNewSalary({
                                                    ...newSalary,
                                                    hra: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Allowances (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={newSalary.allowances}
                                            onChange={(e) =>
                                                setNewSalary({
                                                    ...newSalary,
                                                    allowances: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* DEDUCTIONS */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

                                <span className="font-bold text-[9px] text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2">
                                    Statutory Deductions
                                </span>

                                <div className="grid grid-cols-2 gap-2.5">

                                    <div>
                                        <label className={labelClass}>
                                            PF (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={newSalary.deductions.pf}
                                            onChange={(e) =>
                                                setNewSalary({
                                                    ...newSalary,
                                                    deductions: {
                                                        ...newSalary.deductions,
                                                        pf: Number(e.target.value),
                                                    },
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Tax / TDS (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={newSalary.deductions.tax}
                                            onChange={(e) =>
                                                setNewSalary({
                                                    ...newSalary,
                                                    deductions: {
                                                        ...newSalary.deductions,
                                                        tax: Number(e.target.value),
                                                    },
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* NET SALARY */}
                            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40 flex items-center justify-between gap-3">

                                <span className="text-[10px] text-brand-700 dark:text-brand-300 font-semibold">
                                    Estimated Net Take-Home:
                                </span>

                                <span className="text-base font-black text-slate-900 dark:text-white font-mono whitespace-nowrap">
                                    ₹
                                    {(
                                        Number(newSalary.basicSalary || 0) +
                                        Number(newSalary.hra || 0) +
                                        Number(newSalary.allowances || 0) -
                                        (Number(newSalary.deductions?.pf || 0) +
                                            Number(newSalary.deductions?.tax || 0))
                                    ).toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">

                                <button
                                    type="button"
                                    onClick={() => setShowGenerateModal(false)}
                                    className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-lg bg-[#153B50] border-2 border-[#153B50] text-white text-[10px] font-semibold flex items-center justify-center gap-1.5 shadow-glow disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Check className="w-3.5 h-3.5" />
                                    )}

                                    Save & Disburse Payslip
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
          MODAL 2: EDIT SALARY
      ===================================================== */}
            {showEditModal && selectedRecord && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl">

                        {/* HEADER */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <Edit2 className="w-4 h-4" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Edit Salary • {selectedRecord.userId?.name}
                                    </h3>

                                    <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                        Cycle: {selectedRecord.month}/
                                        {selectedRecord.year}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateSalary}
                            className="p-4 space-y-3 text-[10px]"
                        >

                            {/* EARNINGS */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

                                <span className="font-bold text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                                    Earnings
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                                    <div>
                                        <label className={labelClass}>
                                            Basic Salary (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={selectedRecord.basicSalary}
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    basicSalary: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            HRA (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={selectedRecord.hra}
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    hra: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Allowances (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={selectedRecord.allowances}
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    allowances: Number(e.target.value),
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* DEDUCTIONS */}
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

                                <span className="font-bold text-[9px] text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2">
                                    Deductions
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                                    <div>
                                        <label className={labelClass}>
                                            PF (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                selectedRecord.deductions?.pf || 0
                                            }
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    deductions: {
                                                        ...selectedRecord.deductions,
                                                        pf: Number(e.target.value),
                                                    },
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Tax / TDS (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                selectedRecord.deductions?.tax || 0
                                            }
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    deductions: {
                                                        ...selectedRecord.deductions,
                                                        tax: Number(e.target.value),
                                                    },
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Unpaid Leave Ded (₹)
                                        </label>

                                        <input
                                            type="number"
                                            value={
                                                selectedRecord.deductions
                                                    ?.unpaidLeaveDeduction || 0
                                            }
                                            onChange={(e) =>
                                                setSelectedRecord({
                                                    ...selectedRecord,
                                                    deductions: {
                                                        ...selectedRecord.deductions,
                                                        unpaidLeaveDeduction: Number(
                                                            e.target.value
                                                        ),
                                                    },
                                                })
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* PAYMENT STATUS */}
                            <div>
                                <label className={labelClass}>
                                    Payment Status
                                </label>

                                <select
                                    value={selectedRecord.paymentStatus}
                                    onChange={(e) =>
                                        setSelectedRecord({
                                            ...selectedRecord,
                                            paymentStatus: e.target.value,
                                        })
                                    }
                                    className={inputClass}
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">

                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold flex items-center justify-center gap-1.5 shadow-glow disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-3.5 h-3.5" />
                                    )}

                                    Save Adjustments
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
          MODAL 3: VIEW FORMAL PAYSLIP
      ===================================================== */}
            {showViewModal && selectedRecord && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">

                        {/* HEADER */}
                        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">

                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Employee Payslip Document
                                    </h3>

                                    <p className="text-[9px] text-slate-500 dark:text-slate-400">
                                        {selectedRecord.userId?.name} • Cycle{' '}
                                        {selectedRecord.month}/
                                        {selectedRecord.year}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowViewModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* PAYSLIP CONTENT */}
                        <div className="p-4 space-y-3 text-[10px]">

                            {/* EMPLOYEE INFO */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">

                                <div>
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase">
                                        Employee
                                    </span>

                                    <div className="text-[10px] text-slate-900 dark:text-white font-bold mt-0.5">
                                        {selectedRecord.userId?.name}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase">
                                        Employee ID
                                    </span>

                                    <div className="text-[9px] text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                                        {selectedRecord.userId?.employeeId}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase">
                                        Department
                                    </span>

                                    <div className="text-[9px] text-slate-800 dark:text-slate-200 mt-0.5">
                                        {selectedRecord.userId?.department}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 uppercase">
                                        Status
                                    </span>

                                    <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                                        {selectedRecord.paymentStatus}
                                    </div>
                                </div>

                            </div>

                            {/* EARNINGS + DEDUCTIONS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                                {/* EARNINGS */}
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5">

                                    <span className="font-bold text-[9px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block border-b border-slate-200 dark:border-slate-800 pb-1">
                                        Earnings
                                    </span>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>Basic:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {selectedRecord.basicSalary?.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>HRA:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {selectedRecord.hra?.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>Allowances:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {selectedRecord.allowances?.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                                        <span>Gross:</span>
                                        <span className="font-mono">
                                            ₹
                                            {selectedRecord.grossSalary?.toLocaleString(
                                                'en-IN'
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* DEDUCTIONS */}
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1.5">

                                    <span className="font-bold text-[9px] text-rose-600 dark:text-rose-400 uppercase tracking-wider block border-b border-slate-200 dark:border-slate-800 pb-1">
                                        Deductions
                                    </span>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>PF:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {(
                                                selectedRecord.deductions?.pf || 0
                                            ).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>Tax:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {(
                                                selectedRecord.deductions?.tax || 0
                                            ).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-slate-700 dark:text-slate-300">
                                        <span>Unpaid Leave:</span>
                                        <span className="font-mono font-semibold">
                                            ₹
                                            {(
                                                selectedRecord.deductions
                                                    ?.unpaidLeaveDeduction || 0
                                            ).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-[10px] text-rose-600 dark:text-rose-400 font-bold pt-1 border-t border-slate-200 dark:border-slate-800">
                                        <span>Total Deductions:</span>
                                        <span className="font-mono">
                                            ₹
                                            {(
                                                selectedRecord.grossSalary -
                                                selectedRecord.netSalary
                                            ).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* NET */}
                            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-500/30 flex justify-between items-center">

                                <span className="text-[10px] text-brand-700 dark:text-brand-300 font-bold">
                                    Net Salary Payable:
                                </span>

                                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                                    ₹
                                    {selectedRecord.netSalary?.toLocaleString(
                                        'en-IN'
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* CLOSE */}
                        <div className="px-4 pb-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowViewModal(false)}
                                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-semibold"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default PayrollRecords;