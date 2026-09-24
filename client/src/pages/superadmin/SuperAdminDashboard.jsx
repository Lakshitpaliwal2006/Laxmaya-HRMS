import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Building2,
  Users,
  Activity,
  IndianRupee,
  ShieldAlert,
  TrendingUp,
  Server,
} from "lucide-react";
import AddDepartmentModal from "./AddDepartmentModal.jsx";

const today = new Date();
const dateLabel = today.toLocaleDateString("en-IN", {
  weekday: "long",
  month: "short",
  day: "numeric",
});
const monthLabel = today.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

const orgsByTier = [
  { tier: "Enterprise", count: 18, pct: 36, color: "from-violet-500 to-indigo-500", hex: "#8b5cf6" },
  { tier: "Business", count: 14, pct: 28, color: "from-blue-500 to-cyan-500", hex: "#3b82f6" },
  { tier: "Pro", count: 11, pct: 22, color: "from-amber-500 to-orange-500", hex: "#f59e0b" },
  { tier: "Free", count: 7, pct: 14, color: "from-slate-400 to-slate-500", hex: "#94a3b8" },
];

const systemEvents = [
  { label: "API latency spike — eu-west-1", severity: "warn", time: "12 min ago" },
  { label: "New enterprise org provisioned — Nordic Freight", severity: "info", time: "48 min ago" },
  { label: "Failed payment retry — org #1042", severity: "critical", time: "1 hr ago" },
  { label: "Scheduled backup completed", severity: "info", time: "3 hr ago" },
];

const severityDot = {
  warn: "bg-amber-500",
  info: "bg-slate-400",
  critical: "bg-rose-500",
};

const tabs = ["Organizations", "Departments"];

// Seed data for the departments table. In a real app this would come from your API.
const initialDepartments = [
  { name: "Inventory", hod: "Mitchum Daniel", totalMembers: "06", createdOn: "24 Dec 2024", status: "Active" },
  { name: "Human Resources", hod: "Susan Lopez", totalMembers: "10", createdOn: "10 Dec 2024", status: "Active" },
  { name: "Admin", hod: "Robert Grossman", totalMembers: "05", createdOn: "27 Nov 2024", status: "Active" },
  { name: "Sales", hod: "Janet Hembre", totalMembers: "10", createdOn: "18 Nov 2024", status: "Active" },
  { name: "Marketing", hod: "Russell Belle", totalMembers: "06", createdOn: "06 Nov 2024", status: "Active" },
  { name: "Quality Assurance", hod: "Edward Muniz", totalMembers: "12", createdOn: "25 Oct 2024", status: "Active" },
  { name: "Finance", hod: "Susan Moore", totalMembers: "08", createdOn: "14 Oct 2024", status: "Active" },
  { name: "Maintenance", hod: "Travis Marcotte", totalMembers: "07", createdOn: "03 Oct 2024", status: "Active" },
  { name: "R&D", hod: "Travis Marcotte", totalMembers: "10", createdOn: "20 Sep 2024", status: "Active" },
  { name: "IT Support", hod: "Malinda Ruiz", totalMembers: "10", createdOn: "10 Sep 2024", status: "Inactive" },
];

// People eligible to be picked as Head of Department in the modal's dropdown.
// In a real app, fetch this from your users/employees API.
const hodOptions = [
  { id: 1, name: "Mitchum Daniel" },
  { id: 2, name: "Susan Lopez" },
  { id: 3, name: "Robert Grossman" },
  { id: 4, name: "Janet Hembre" },
  { id: 5, name: "Russell Belle" },
  { id: 6, name: "Edward Muniz" },
  { id: 7, name: "Susan Moore" },
  { id: 8, name: "Travis Marcotte" },
  { id: 9, name: "Malinda Ruiz" },
];

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("Organizations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departments, setDepartments] = useState(initialDepartments);

  const totalOrgs = orgsByTier.reduce((sum, t) => sum + t.count, 0);
  const totalUsers = 8412;
  const activeSessions = 1936;
  const mrr = 4218500;
  const uptime = 99.97;
  const criticalAlerts = systemEvents.filter((e) => e.severity === "critical").length;

  const handleAddDepartment = ({ name, hod, assistantHod, description }) => {
    const hodName = hodOptions.find((p) => String(p.id) === String(hod))?.name ?? "Unassigned";
    const assistantHodName = hodOptions.find((p) => String(p.id) === String(assistantHod))?.name ?? "";

    const newDept = {
      name,
      hod: hodName,
      assistantHod: assistantHodName,
      description,
      totalMembers: "00",
      createdOn: today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Active",
    };

    setDepartments((prev) => [newDept, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F0D] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl p-6 overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-gradient-to-b before:from-violet-500 before:to-indigo-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-serif font-semibold text-2xl text-slate-900 dark:text-white">
                Super Admin Console — {dateLabel}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Platform-wide visibility across every organization, user, and system
              </p>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-serif font-semibold text-xl text-slate-900 dark:text-white tabular-nums">
                  {totalOrgs}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Organizations</div>
              </div>
              <div>
                <div className="font-serif font-semibold text-xl text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {totalUsers.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Total users</div>
              </div>
              <div>
                <div className="font-serif font-semibold text-xl text-rose-600 dark:text-rose-400 tabular-nums">
                  {criticalAlerts}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Critical alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-200 dark:divide-white/10">
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Organizations</span>
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-400/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-violet-600 dark:text-violet-400" strokeWidth={2} />
                </div>
              </div>
              <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
                {totalOrgs}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 3 new this month
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Active sessions</span>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-400/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
                </div>
              </div>
              <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
                {activeSessions.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Across {totalUsers.toLocaleString("en-IN")} registered users
              </div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">System uptime</span>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-400/10 flex items-center justify-center">
                  <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                </div>
              </div>
              <div className="font-serif font-semibold text-[28px] leading-tight text-slate-900 dark:text-white tabular-nums">
                {uptime}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Last 30 days, all regions</div>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">MRR — {monthLabel}</span>
                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-400/10 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-rose-700 dark:text-rose-400" strokeWidth={2} />
                </div>
              </div>
              <div className="font-serif font-semibold text-[24px] leading-tight text-slate-900 dark:text-white tabular-nums">
                ₹{mrr.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Recurring revenue, all tiers</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-white/10">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-slate-900 dark:text-white font-medium"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-slate-900 dark:bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Departments" && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-[#132a43] dark:text-white">Departments</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dashboard <span className="mx-1">›</span>{" "}
                  <span className="text-[#1d7089] font-medium">Departments</span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
              >
                + Add Department
              </button>
            </div>

            {/* Table card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative w-full max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-[#132a43] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d7089]/30"
                  />
                </div>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Status ▾
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/60 text-left text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      <th className="px-5 py-3 w-10">
                        <input type="checkbox" className="rounded border-slate-300" />
                      </th>
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3">HOD</th>
                      <th className="px-5 py-3">Members</th>
                      <th className="px-5 py-3">Total Members ↑</th>
                      <th className="px-5 py-3">Created On ↑</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr
                        key={dept.name}
                        className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-950/40 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[#132a43] dark:text-white">
                          {dept.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#eaf1f5] dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-[#132a43] dark:text-slate-300">
                              {dept.hod
                                .split(" ")
                                .map((w) => w[0])
                                .join("")}
                            </div>
                            <span className="text-slate-600 dark:text-slate-300">{dept.hod}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center -space-x-2">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900"
                              />
                            ))}
                            <div className="w-6 h-6 rounded-full bg-[#132a43] text-white text-[9px] font-semibold flex items-center justify-center border-2 border-white dark:border-slate-900">
                              +{dept.totalMembers}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                          {dept.totalMembers}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{dept.createdOn}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                              dept.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20"
                            }`}
                          >
                            {dept.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1d7089]">
                              ✎
                            </button>
                            <button className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-rose-500">
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  Row Per Page
                  <select className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  Entries
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
                    ‹
                  </button>
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      className={`w-7 h-7 rounded-md flex items-center justify-center font-semibold ${
                        n === 1
                          ? "bg-[#132a43] text-white"
                          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="px-1">…</span>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    15
                  </button>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab content */}
        {activeTab === "Organizations" && (
          <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-[#132a43] dark:text-white">Organisation</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dashboard <span className="mx-1">›</span>{" "}
                  <span className="text-[#1d7089] font-medium">Organisation</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <h2 className="font-serif font-semibold text-base text-slate-900 dark:text-white">
                  Organizations by plan tier
                </h2>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{totalOrgs} total</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-56 h-56 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orgsByTier}
                      dataKey="count"
                      nameKey="tier"
                      innerRadius={62}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {orgsByTier.map((row) => (
                        <Cell key={row.tier} fill={row.hex} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} orgs`, name]}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-serif font-semibold text-2xl text-slate-900 dark:text-white tabular-nums">
                    {totalOrgs}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">orgs</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                {orgsByTier.map((row) => (
                  <div key={row.tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: row.hex }} />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{row.tier}</span>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                      {row.count} orgs ({row.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "User Activity" && (
          <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-2 text-center">
            <Activity className="w-6 h-6 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Session and login activity across organizations will show here.
            </p>
          </div>
        )}

        {activeTab === "Billing & Plans" && (
          <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-2 text-center">
            <IndianRupee className="w-6 h-6 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Plan changes, upgrades, and billing disputes will show here.
            </p>
          </div>
        )}

        {activeTab === "System Events" && (
          <div className="bg-white dark:bg-[#171D19] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h2 className="font-serif font-semibold text-base text-slate-900 dark:text-white">
                Recent system events
              </h2>
            </div>
            <div className="space-y-4">
              {systemEvents.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${severityDot[event.severity]}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-200">{event.label}</span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">
                    {event.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Department modal — lives once at the bottom of the page, opened by the button above */}
      <AddDepartmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hodOptions={hodOptions}
        onSubmit={handleAddDepartment}
      />
    </div>
  );
}