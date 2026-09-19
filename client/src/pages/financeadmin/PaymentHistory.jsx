import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  CalendarDays,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Receipt,
  MoreHorizontal,
} from "lucide-react";

const paymentHistory = [
  {
    id: "PAY-2024-001",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "February 2024",
    paymentDate: "Feb 26, 2024",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 650,
    netSalary: 7350,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PAY-2024-002",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "January 2024",
    paymentDate: "Jan 26, 2024",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 650,
    netSalary: 7350,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PAY-2023-012",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "December 2023",
    paymentDate: "Dec 26, 2023",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 600,
    netSalary: 7400,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PAY-2023-011",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "November 2023",
    paymentDate: "Nov 26, 2023",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 600,
    netSalary: 7400,
    status: "Pending",
    method: "Bank Transfer",
  },
  {
    id: "PAY-2023-010",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "October 2023",
    paymentDate: "Oct 26, 2023",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 600,
    netSalary: 7400,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "PAY-2023-009",
    employee: "Laksh Paliwal",
    employeeId: "EMP-001",
    period: "September 2023",
    paymentDate: "Sep 26, 2023",
    paymentType: "Monthly Salary",
    grossSalary: 8000,
    deductions: 600,
    netSalary: 7400,
    status: "Failed",
    method: "Bank Transfer",
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const statusStyles = {
  Paid: "bg-green-50 text-green-700 border-green-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Failed: "bg-red-50 text-red-700 border-red-100",
};

const StatusIcon = ({ status }) => {
  if (status === "Paid") {
    return <CheckCircle2 size={13} width={13} height={13} />;
  }

  if (status === "Pending") {
    return <Clock size={13} width={13} height={13} />;
  }

  return <XCircle size={13} width={13} height={13} />;
};

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    const matchesPeriod =
      periodFilter === "All" ||
      payment.period.toLowerCase().includes(periodFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const paidPayments = paymentHistory.filter(
    (payment) => payment.status === "Paid"
  );

  const totalPaid = paidPayments.reduce(
    (sum, payment) => sum + payment.netSalary,
    0
  );

  const pendingPayments = paymentHistory.filter(
    (payment) => payment.status === "Pending"
  );

  const pendingAmount = pendingPayments.reduce(
    (sum, payment) => sum + payment.netSalary,
    0
  );

  const totalGross = paymentHistory.reduce(
    (sum, payment) => sum + payment.grossSalary,
    0
  );

  const handleDownload = (payment) => {
    alert(`Download receipt: ${payment.id}`);
  };

  return (
    <section className="w-full bg-[#edf4f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Employees</span>
              <span>/</span>
              <span>Compensation</span>
              <span>/</span>
              <span>Payment History</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#20364d] sm:text-3xl">
              Payment History
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage employee salary payment records.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => alert("Export payment history")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Download size={15} width={15} height={15} />
              Export History
            </button>

            <button
              onClick={() => alert("Generate payment report")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#20364d] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#294963]"
            >
              <Receipt size={15} width={15} height={15} />
              Payment Report
            </button>
          </div>
        </div>

        {/* EMPLOYEE SUMMARY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dceaf3] text-lg font-bold text-[#245274]">
                LP
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#20364d]">
                  Laksh Paliwal
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  EMP-001 · Software Developer
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                    Active
                  </span>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                    Monthly Payroll
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:flex sm:gap-10">
              <div>
                <p className="text-xs text-slate-400">Pay Frequency</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">
                  Monthly
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Payment Method</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">
                  Bank Transfer
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Currency</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">
                  USD ($)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL PAID */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Paid
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#20364d]">
                  {formatCurrency(totalPaid)}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Across paid records
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <Wallet size={20} width={20} height={20} />
              </div>
            </div>
          </div>

          {/* TOTAL GROSS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Gross Payroll
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#20364d]">
                  {formatCurrency(totalGross)}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Total recorded gross pay
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Receipt size={20} width={20} height={20} />
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pending Payments
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#20364d]">
                  {formatCurrency(pendingAmount)}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {pendingPayments.length} pending record(s)
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={20} width={20} height={20} />
              </div>
            </div>
          </div>

          {/* PAYMENT COUNT */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Payment Records
                </p>

                <h3 className="mt-2 text-2xl font-bold text-[#20364d]">
                  {paymentHistory.length}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Total payment records
                </p>
              </div>

              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <CalendarDays size={20} width={20} height={20} />
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT HISTORY TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-[#20364d]">
                Payment Records
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Track employee salary payments and transaction status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                  setPeriodFilter("All");
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-[#f8fbfd] p-4 lg:flex-row lg:items-center">

            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={15}
                width={15}
                height={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search payment ID or period..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-600 outline-none transition focus:border-[#6c9ab9]"
              />
            </div>

            {/* STATUS FILTER */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium text-slate-600 outline-none focus:border-[#6c9ab9] lg:w-36"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>

              <ChevronDown
                size={14}
                width={14}
                height={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            {/* PERIOD FILTER */}
            <div className="relative">
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-xs font-medium text-slate-600 outline-none focus:border-[#6c9ab9] lg:w-36"
              >
                <option value="All">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>

              <ChevronDown
                size={14}
                width={14}
                height={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="bg-[#e9eff3] text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Pay Period</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Payment Type</th>
                  <th className="px-4 py-3">Gross Salary</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net Salary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="text-xs text-slate-600 transition hover:bg-[#f7fafc]"
                  >
                    {/* PAYMENT ID */}
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#315b7b]">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {payment.employeeId}
                      </p>
                    </td>

                    {/* PERIOD */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-[#20364d]">
                        {payment.period}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {payment.paymentDate}
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {payment.paymentType}
                      </span>
                    </td>

                    {/* GROSS */}
                    <td className="px-4 py-4 font-semibold text-[#20364d]">
                      {formatCurrency(payment.grossSalary)}
                    </td>

                    {/* DEDUCTIONS */}
                    <td className="px-4 py-4 text-slate-500">
                      {formatCurrency(payment.deductions)}
                    </td>

                    {/* NET SALARY */}
                    <td className="px-4 py-4 font-bold text-[#20364d]">
                      {formatCurrency(payment.netSalary)}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                          statusStyles[payment.status]
                        }`}
                      >
                        <StatusIcon status={payment.status} />
                        {payment.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View Payment"
                          onClick={() => setSelectedPayment(payment)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#315b7b]"
                        >
                          <Eye size={15} width={15} height={15} />
                        </button>

                        <button
                          title="Download Receipt"
                          onClick={() => handleDownload(payment)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#315b7b]"
                        >
                          <Download size={15} width={15} height={15} />
                        </button>

                        <button
                          title="More Actions"
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#315b7b]"
                        >
                          <MoreHorizontal size={15} width={15} height={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPayments.length === 0 && (
              <div className="p-10 text-center">
                <Receipt
                  size={28}
                  width={28}
                  height={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-500">
                  No payment records found
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>

          {/* TABLE FOOTER */}
          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center">
            <p>
              Showing {filteredPayments.length} of {paymentHistory.length} payments
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-300"
              >
                Previous
              </button>

              <span className="rounded-lg bg-[#20364d] px-3 py-2 font-semibold text-white">
                1
              </span>

              <button
                disabled
                className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* PAYMENT DETAILS MODAL */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20364d]/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#20364d]">
                    Payment Details
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {selectedPayment.id}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <XIcon />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pay Period</span>
                  <span className="font-semibold text-[#20364d]">
                    {selectedPayment.period}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Date</span>
                  <span className="font-semibold text-[#20364d]">
                    {selectedPayment.paymentDate}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Gross Salary</span>
                  <span className="font-semibold text-[#20364d]">
                    {formatCurrency(selectedPayment.grossSalary)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Deductions</span>
                  <span className="font-semibold text-[#20364d]">
                    {formatCurrency(selectedPayment.deductions)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#20364d]">
                      Net Salary
                    </span>

                    <span className="font-bold text-[#315b7b]">
                      {formatCurrency(selectedPayment.netSalary)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-semibold text-[#20364d]">
                    {selectedPayment.method}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[selectedPayment.status]
                    }`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDownload(selectedPayment)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#20364d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#294963]"
                >
                  <Download size={14} width={14} height={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}