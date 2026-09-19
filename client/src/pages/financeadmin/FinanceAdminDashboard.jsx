
import React from "react";
import {
  Wallet,
  Users,
  Clock,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  FileText,
  PlusCircle,
  CreditCard,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Payroll chart data
const payrollData = [
  { month: "Apr", payroll: 18.5 },
  { month: "May", payroll: 21 },
  { month: "Jun", payroll: 22.5 },
  { month: "Jul", payroll: 23 },
  { month: "Aug", payroll: 24 },
  { month: "Sep", payroll: 24.5 },
];

// Expense breakdown
const expenseData = [
  { name: "Salaries", value: 65 },
  { name: "Reimbursements", value: 15 },
  { name: "Benefits", value: 12 },
  { name: "Other", value: 8 },
];

const expenseColors = [
  "#2b91b0",
  "#438b87",
  "#8ba6b5",
  "#527f99",
];

// Recent transactions
const transactions = [
  {
    id: 1,
    title: "Monthly Salary Processing",
    date: "Sep 18, 2026",
    amount: "₹12,50,000",
    status: "Completed",
    type: "credit",
  },
  {
    id: 2,
    title: "Employee Reimbursement",
    date: "Sep 17, 2026",
    amount: "₹25,000",
    status: "Pending",
    type: "debit",
  },
  {
    id: 3,
    title: "Tax Deduction",
    date: "Sep 16, 2026",
    amount: "₹3,20,000",
    status: "Completed",
    type: "debit",
  },
  {
    id: 4,
    title: "Salary Adjustment",
    date: "Sep 15, 2026",
    amount: "₹18,500",
    status: "Pending",
    type: "credit",
  },
];

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
  trendType,
}) => {
  return (
    <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm transition hover:shadow-md dark:border-[#36566a] dark:bg-[#203f52]">
      <div className="flex items-center justify-between">
        <div
          className={`rounded-xl p-3 ${iconColor}`}
        >
          <Icon size={22} />
        </div>

        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              trendType === "up"
                ? "text-[#438b87]"
                : "text-[#b66d73]"
            }`}
          >
            {trendType === "up" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-[#6d8797] dark:text-[#a9c0cc]">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-[#19344d] dark:text-[#f4f8fa]">
        {value}
      </h3>

      <p className="mt-1 text-xs text-[#6d8797] dark:text-[#a9c0cc]">
        {subtitle}
      </p>
    </div>
  );
};

const FinanceAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#eaf3f7] p-4 text-[#19344d] sm:p-6 lg:p-8 dark:bg-[#142b3d] dark:text-[#f4f8fa]">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Finance Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#6d8797] dark:text-[#a9c0cc]">
            Welcome back, Finance Admin 👋
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="rounded-xl border border-[#c4d6df] bg-[#ffffff] px-3 py-2 text-sm outline-none dark:border-[#36566a] dark:bg-[#203f52]"
            defaultValue="September 2026"
          >
            <option>September 2026</option>
            <option>August 2026</option>
            <option>July 2026</option>
          </select>

          <button
            className="flex items-center gap-2 rounded-xl bg-[#246b8f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1b526f]"
            type="button"
            onClick={() => alert("Report export feature coming soon")}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Payroll"
          value="₹24.5L"
          subtitle="Monthly salary expenses"
          icon={Wallet}
          iconColor="bg-[#d9edf5] text-[#246b8f] dark:bg-[#2b91b0]/20 dark:text-[#8ac9df]"
          trend="+8.2%"
          trendType="up"
        />

        <StatCard
          title="Employees on Payroll"
          value="248"
          subtitle="Active employees"
          icon={Users}
          iconColor="bg-[#dcebf2] text-[#2f7295] dark:bg-[#2f7295]/20 dark:text-[#8abbd0]"
          trend="+12"
          trendType="up"
        />

        <StatCard
          title="Pending Payroll"
          value="28"
          subtitle="Payments to be processed"
          icon={Clock}
          iconColor="bg-[#e9edf0] text-[#607f91] dark:bg-[#607f91]/20 dark:text-[#b4c9d3]"
          trend="Pending"
          trendType="down"
        />

        <StatCard
          title="Expense Claims"
          value="₹45K"
          subtitle="Pending approval"
          icon={Receipt}
          iconColor="bg-[#dceaf0] text-[#356d8b] dark:bg-[#356d8b]/20 dark:text-[#8dbbd0]"
          trend="Review"
          trendType="down"
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Payroll Chart */}
        <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm xl:col-span-2 dark:border-[#36566a] dark:bg-[#203f52]">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Monthly Payroll Trends
              </h2>
              <p className="text-sm text-[#6d8797] dark:text-[#a9c0cc]">
                Salary expenses (in lakhs)
              </p>
            </div>

            <TrendingUp className="text-[#2b91b0]" size={22} />
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#c4d6df"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${value}L`,
                    "Payroll",
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                  }}
                />

                <Bar
                  dataKey="payroll"
                  fill="#2b91b0"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm dark:border-[#36566a] dark:bg-[#203f52]">

          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Expense Breakdown
            </h2>
            <p className="text-sm text-[#6d8797] dark:text-[#a9c0cc]">
              Financial distribution
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={expenseColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `${value}%`}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Payroll Status */}
        <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm dark:border-[#36566a] dark:bg-[#203f52]">

          <h2 className="mb-5 text-lg font-semibold">
            Payroll Processing Status
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-[#438b87]" size={20} />
                <span className="text-sm">Processed</span>
              </div>

              <span className="font-semibold">220</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="text-[#607f91]" size={20} />
                <span className="text-sm">Pending</span>
              </div>

              <span className="font-semibold">28</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="text-[#b66d73]" size={20} />
                <span className="text-sm">Failed</span>
              </div>

              <span className="font-semibold">0</span>
            </div>

          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-[#6d8797]">
              <span>Payroll completion</span>
              <span>88.7%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#d3e2e9] dark:bg-[#36566a]">
              <div
                className="h-full rounded-full bg-[#438b87]"
                style={{ width: "88.7%" }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm dark:border-[#36566a] dark:bg-[#203f52]">

          <h2 className="mb-5 text-lg font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => alert("Add payroll feature coming soon")}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#c4d6df] p-4 text-center text-sm transition hover:border-[#4b9dbb] hover:bg-[#e2f1f6] dark:border-[#36566a] dark:hover:bg-[#e2f1f6]0/10"
            >
              <PlusCircle className="text-[#2b91b0]" size={24} />
              Add Payroll
            </button>

            <button
              type="button"
              onClick={() => alert("Expense review feature coming soon")}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#c4d6df] p-4 text-center text-sm transition hover:border-[#4b9dbb] hover:bg-[#e2f1f6] dark:border-[#36566a] dark:hover:bg-[#e2f1f6]0/10"
            >
              <Receipt className="text-[#438b87]" size={24} />
              Review Expenses
            </button>

            <button
              type="button"
              onClick={() => alert("Report generation feature coming soon")}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#c4d6df] p-4 text-center text-sm transition hover:border-[#4b9dbb] hover:bg-[#e2f1f6] dark:border-[#36566a] dark:hover:bg-[#e2f1f6]0/10"
            >
              <FileText className="text-[#607f91]" size={24} />
              Generate Report
            </button>

            <button
              type="button"
              onClick={() => alert("Payment management feature coming soon")}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#c4d6df] p-4 text-center text-sm transition hover:border-[#4b9dbb] hover:bg-[#e2f1f6] dark:border-[#36566a] dark:hover:bg-[#e2f1f6]0/10"
            >
              <CreditCard className="text-purple-500" size={24} />
              Payments
            </button>

          </div>
        </div>

        {/* Upcoming Payroll */}
        <div className="rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm dark:border-[#36566a] dark:bg-[#203f52]">

          <h2 className="mb-5 text-lg font-semibold">
            Upcoming Payroll
          </h2>

          <div className="rounded-xl bg-[#e2f1f6] p-4 dark:bg-[#e2f1f6]0/10">
            <p className="text-sm text-[#6d8797] dark:text-[#a9c0cc]">
              Next payroll date
            </p>

            <h3 className="mt-1 text-2xl font-bold text-[#246b8f] dark:text-[#8ac9df]">
              30 Sep
            </h3>

            <p className="mt-1 text-xs text-[#6d8797]">
              Monthly salary processing
            </p>
          </div>

          <div className="mt-5 space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="text-[#6d8797]">Employees</span>
              <span className="font-semibold">248</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6d8797]">Estimated payroll</span>
              <span className="font-semibold">₹24.5L</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6d8797]">Status</span>
              <span className="font-semibold text-[#607f91]">
                Scheduled
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-6 rounded-2xl border border-[#c4d6df] bg-[#ffffff] p-5 shadow-sm dark:border-[#36566a] dark:bg-[#203f52]">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Recent Transactions
            </h2>

            <p className="text-sm text-[#6d8797] dark:text-[#a9c0cc]">
              Latest financial activities
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert("View all transactions feature coming soon")}
            className="text-sm font-semibold text-[#246b8f] hover:underline dark:text-[#8ac9df]"
          >
            View All
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">

            <thead>
              <tr className="border-b border-[#c4d6df] text-xs uppercase text-[#6d8797] dark:border-[#36566a]">
                <th className="px-3 py-3 font-medium">Transaction</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-100 last:border-0 dark:border-[#36566a]/60"
                >
                  <td className="px-3 py-4 font-medium">
                    {transaction.title}
                  </td>

                  <td className="px-3 py-4 text-[#6d8797]">
                    {transaction.date}
                  </td>

                  <td className="px-3 py-4 font-semibold">
                    {transaction.amount}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={
                        transaction.type === "credit"
                          ? "text-[#438b87]"
                          : "text-[#b66d73]"
                      }
                    >
                      {transaction.type === "credit"
                        ? "Credit"
                        : "Debit"}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-[#dceeea] text-[#356f6a] dark:bg-[#438b87]/10 dark:text-[#8fc9bf]"
                          : "bg-[#e9edf0] text-amber-700 dark:bg-[#607f91]/10 dark:text-[#b4c9d3]"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};

export default FinanceAdminDashboard;