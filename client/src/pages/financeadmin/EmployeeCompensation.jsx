import React, { useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  FileText,
  Upload,
  Download,
  Wallet,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Search,
  Plus,
  X,
} from "lucide-react";


const INITIAL_ELEMENTS = [
  { id: "regular", name: "Regular Pay", category: "Salary", payment: 8000, reimbursement: 854.08, asset: 928.41, allowance: 490.51, deduction: 0 },
  { id: "bonus", name: "Performance Bonus", category: "Incentive", payment: 500, reimbursement: 630.44, asset: 328.85, allowance: 739.65, deduction: 0 },
  { id: "commission", name: "Commission", category: "Incentive", payment: 200, reimbursement: 778.35, asset: 219.78, allowance: 106.58, deduction: 0 },
  { id: "expense", name: "Business Expense", category: "Expenses", payment: 300, reimbursement: 105.55, asset: 473.85, allowance: 589.99, deduction: 0 },
  { id: "fitness", name: "Fitness Allowance", category: "Benefits", payment: 100, reimbursement: 948.55, asset: 779.58, allowance: 782.01, deduction: 0 },
  { id: "medical", name: "Medical PPO", category: "Benefits", payment: 200, reimbursement: 943.65, asset: 351.02, allowance: 275.43, deduction: 0 },
];

const INITIAL_DOCUMENTS = [
  { id: "d1", name: "Employment Contract", type: "Contract", date: "Jan 15, 2024", size: "1.2 MB" },
  { id: "d2", name: "Salary Revision Letter", type: "Compensation", date: "Feb 01, 2024", size: "850 KB" },
  { id: "d3", name: "Benefits Enrollment", type: "Benefits", date: "Feb 05, 2024", size: "640 KB" },
];

const EMPLOYER_CONTRIBUTIONS = 320;
const CATEGORIES = ["Salary", "Incentive", "Expenses", "Benefits"];
const DOCUMENT_TYPES = ["Contract", "Compensation", "Benefits", "Other"];

const categoryStyles = {
  Salary: "bg-green-50 text-green-700",
  Incentive: "bg-orange-50 text-orange-700",
  Expenses: "bg-purple-50 text-purple-700",
  Benefits: "bg-cyan-50 text-cyan-700",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const money = (value) => (value ? formatCurrency(value) : "-");

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const today = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#6c9ab9]";

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function CompensationStat({ icon: Icon, label, value, description, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#20364d]">
            {value}
          </h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={20} className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#20364d]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#20364d]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">{children}</div>

        <div className="mt-6 flex justify-end gap-2">{footer}</div>
      </div>
    </div>
  );
}

const cancelBtn =
  "rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50";
const primaryBtn =
  "rounded-lg bg-[#20364d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#294963] disabled:cursor-not-allowed disabled:opacity-50";

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function EmployeeCompensation() {
  const [elements, setElements] = useState(INITIAL_ELEMENTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [activeTab, setActiveTab] = useState("Pay Elements");
  const [searchTerm, setSearchTerm] = useState("");

  // modals
  const [showEdit, setShowEdit] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // edit salary form
  const [salaryDraft, setSalaryDraft] = useState("");
  const [salaryError, setSalaryError] = useState("");

  // add pay element form
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newAmount, setNewAmount] = useState("");
  const [addError, setAddError] = useState("");

  // upload form
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState(DOCUMENT_TYPES[0]);

  /* ---------- derived values (single source of truth) ---------- */

  const baseSalary = elements.find((e) => e.id === "regular")?.payment ?? 0;

  const totals = useMemo(() => {
    const t = { Salary: 0, Benefits: 0, Incentive: 0, Expenses: 0 };
    elements.forEach((e) => {
      t[e.category] += e.payment;
    });
    return t;
  }, [elements]);

  const totalCompensation =
    totals.Salary +
    totals.Benefits +
    totals.Incentive +
    totals.Expenses +
    EMPLOYER_CONTRIBUTIONS;

  const summaryItems = [
    { label: "Salary", value: totals.Salary, color: "bg-[#9abf7b]" },
    { label: "Benefit", value: totals.Benefits, color: "bg-[#2980b9]" },
    { label: "Incentive", value: totals.Incentive, color: "bg-[#f59b27]" },
    { label: "Expenses", value: totals.Expenses, color: "bg-[#bd72c4]" },
    { label: "Contributions", value: EMPLOYER_CONTRIBUTIONS, color: "bg-[#52b9b8]" },
  ];

  const filteredElements = elements.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  /* ---------- handlers ---------- */

  const openEdit = () => {
    setSalaryDraft(String(baseSalary));
    setSalaryError("");
    setShowEdit(true);
  };

  const saveSalary = () => {
    const value = Number(salaryDraft);
    if (salaryDraft === "" || !Number.isFinite(value) || value < 0) {
      setSalaryError("Enter a salary of 0 or more.");
      return;
    }
    setElements((prev) =>
      prev.map((e) => (e.id === "regular" ? { ...e, payment: value } : e))
    );
    setShowEdit(false);
  };

  const closeAdd = () => {
    setShowAddForm(false);
    setNewName("");
    setNewCategory(CATEGORIES[0]);
    setNewAmount("");
    setAddError("");
  };

  const addElement = () => {
    const amount = Number(newAmount);
    if (!newName.trim()) {
      setAddError("Enter an element name.");
      return;
    }
    if (newAmount === "" || !Number.isFinite(amount) || amount < 0) {
      setAddError("Enter a payment amount of 0 or more.");
      return;
    }
    setElements((prev) => [
      ...prev,
      {
        id: `el-${Date.now()}`,
        name: newName.trim(),
        category: newCategory,
        payment: amount,
        reimbursement: 0,
        asset: 0,
        allowance: 0,
        deduction: 0,
      },
    ]);
    closeAdd();
    setActiveTab("Pay Elements");
  };

  const removeElement = (item) => {
    if (item.id === "regular") return;
    if (window.confirm(`Remove "${item.name}"?`)) {
      setElements((prev) => prev.filter((e) => e.id !== item.id));
    }
  };

  const closeUpload = () => {
    setShowUpload(false);
    setUploadFile(null);
    setUploadType(DOCUMENT_TYPES[0]);
  };

  const uploadDocument = () => {
    if (!uploadFile) return;
    setDocuments((prev) => [
      {
        id: `doc-${Date.now()}`,
        name: uploadFile.name,
        type: uploadType,
        date: today(),
        size: formatSize(uploadFile.size),
        url: URL.createObjectURL(uploadFile),
      },
      ...prev,
    ]);
    closeUpload();
  };

  const downloadDocument = (doc) => {
    if (!doc.url) {
      // Seed documents are demo data with no file behind them.
      alert(`Connect a real file URL for "${doc.name}" to enable download.`);
      return;
    }
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.name;
    a.click();
  };

  /* ---------- render ---------- */

  return (
    <div className="min-h-screen w-full bg-[#edf4f8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Employees</span>
              <span>/</span>
              <span>Compensation</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#20364d] sm:text-3xl">
              Employee Compensation
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage salary, pay elements, benefits and compensation documents.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openEdit}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Pencil size={15} />
              Edit Compensation
            </button>

            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#20364d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#294963]"
            >
              <Plus size={16} />
              Add Pay Element
            </button>
          </div>
        </div>

        {/* EMPLOYEE PROFILE SUMMARY */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 p-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#dceaf3] text-xl font-bold text-[#245274]">
                LP
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#20364d]">Laksh Paliwal</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  EMP-001 · Software Developer
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">
                    Active Employee
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                    Engineering
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center sm:gap-10">
              <div>
                <p className="text-xs text-slate-400">Pay Frequency</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">Monthly</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Effective Date</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">Jan 26, 2024</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Currency</p>
                <p className="mt-1 text-sm font-semibold text-[#20364d]">USD ($)</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAY PERIOD SUMMARY */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-slate-400">Compensation Period</p>
              <h2 className="mt-1 text-base font-bold text-[#20364d]">
                Jan 26 to Feb 26, 2024
              </h2>
            </div>

            <div className="flex gap-2">
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                Previous
              </button>
              <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
            <div className="p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#91b87b]" />
                <span className="text-xs text-slate-500">Total Compensation</span>
              </div>
              <p className="text-base font-bold text-[#20364d]">
                {formatCurrency(totalCompensation)}
              </p>
            </div>

            {summaryItems.map(({ label, value, color }) => (
              <div key={label} className="p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
                <p className="text-base font-bold text-[#20364d]">
                  {formatCurrency(value)}
                </p>
              </div>
            ))}
          </div>

          {/* Proportional bar, computed from the same totals */}
          <div className="flex h-1.5 w-full bg-slate-100">
            {totalCompensation > 0 &&
              summaryItems.map(({ label, value, color }) => (
                <span
                  key={label}
                  className={color}
                  style={{ width: `${(value / totalCompensation) * 100}%` }}
                />
              ))}
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CompensationStat
            icon={Wallet}
            label="Base Salary"
            value={formatCurrency(baseSalary)}
            description="Monthly fixed salary"
            iconClass="bg-green-50 text-green-600"
          />
          <CompensationStat
            icon={TrendingUp}
            label="Total Benefits"
            value={formatCurrency(totals.Benefits)}
            description="Employee benefit value"
            iconClass="bg-blue-50 text-blue-600"
          />
          <CompensationStat
            icon={Receipt}
            label="Incentives"
            value={formatCurrency(totals.Incentive)}
            description="Bonuses and commissions"
            iconClass="bg-orange-50 text-orange-600"
          />
          <CompensationStat
            icon={ShieldCheck}
            label="Employer Contributions"
            value={formatCurrency(EMPLOYER_CONTRIBUTIONS)}
            description="Company contributions"
            iconClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* PAY ELEMENT TOTALS */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#e7eff5] p-2 text-[#315b7b]">
                <Receipt size={18} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#20364d]">Pay Element Totals</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Breakdown of employee compensation
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search pay elements..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-[#6c9ab9] sm:w-56"
                />
              </div>

              <button
                onClick={openEdit}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-6 overflow-x-auto border-b border-slate-100 px-5">
            {["Pay Elements", "Salary Breakdown", "Documents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 py-3 text-xs font-semibold transition ${
                  activeTab === tab
                    ? "border-[#315b7b] text-[#20364d]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* PAY ELEMENT TABLE */}
          {activeTab === "Pay Elements" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#e9eff3] text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    <th className="px-4 py-3">Pay Element</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Reimbursement</th>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3">Allowance</th>
                    <th className="px-4 py-3">Deduction</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredElements.map((item) => (
                    <tr
                      key={item.id}
                      className="text-xs text-slate-600 transition hover:bg-[#f7fafc]"
                    >
                      <td className="px-4 py-4 font-semibold text-[#20364d]">
                        {item.name}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${categoryStyles[item.category]}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {item.category}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#20364d]">
                        {formatCurrency(item.payment)}
                      </td>
                      <td className="px-4 py-4">{money(item.reimbursement)}</td>
                      <td className="px-4 py-4">{money(item.asset)}</td>
                      <td className="px-4 py-4">{money(item.allowance)}</td>
                      <td className="px-4 py-4">{money(item.deduction)}</td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => removeElement(item)}
                          disabled={item.id === "regular"}
                          title={
                            item.id === "regular"
                              ? "Regular Pay can't be removed"
                              : `Remove ${item.name}`
                          }
                          aria-label={`Remove ${item.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredElements.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-400">
                  No pay elements match "{searchTerm}".
                </div>
              )}
            </div>
          )}

          {/* SALARY BREAKDOWN */}
          {activeTab === "Salary Breakdown" && (
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-[#20364d]">Monthly Compensation</h3>

                <div className="mt-5 space-y-4">
                  {[
                    ["Base Salary", totals.Salary],
                    ["Benefits", totals.Benefits],
                    ["Incentives", totals.Incentive],
                    ["Expenses", totals.Expenses],
                    ["Employer Contributions", EMPLOYER_CONTRIBUTIONS],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-[#20364d]">
                        {formatCurrency(value)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#20364d]">Total Compensation</span>
                      <span className="font-bold text-[#315b7b]">
                        {formatCurrency(totalCompensation)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="font-bold text-[#20364d]">Annual Salary Projection</h3>

                <p className="mt-2 text-xs text-slate-400">
                  Based on current monthly base salary
                </p>

                <p className="mt-5 text-3xl font-bold text-[#20364d]">
                  {formatCurrency(baseSalary * 12)}
                </p>

                <p className="mt-2 text-xs text-slate-500">Annual base salary estimate</p>
              </div>
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === "Documents" && (
            <div className="space-y-4 p-5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#e7eff5] p-3 text-[#315b7b]">
                      {/* Fix: was <Icon />, which was never defined */}
                      <FileText size={20} className="shrink-0" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#20364d]">{doc.name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {doc.type} · {doc.date} · {doc.size}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadDocument(doc)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              ))}

              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#20364d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#294963]"
              >
                <Upload size={14} />
                Upload Document
              </button>
            </div>
          )}
        </div>

        {/* COMPENSATION DOCUMENTS OVERVIEW */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#20364d]">
                  Compensation Documents
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Manage important employee compensation files.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("Documents")}
                className="text-xs font-semibold text-[#315b7b] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 bg-[#f8fbfd] p-4"
                >
                  <FileText size={22} className="text-[#6c9ab9]" />
                  <p className="mt-3 truncate text-xs font-bold text-[#20364d]">
                    {doc.name}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {doc.type} · {doc.size}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-base font-bold text-[#20364d]">Compensation Status</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Salary Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Payroll Sync</span>
                <span className="font-semibold text-green-600">Synced</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-semibold text-[#20364d]">Feb 26, 2024</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#edf5f8] p-4">
              <p className="text-xs font-semibold text-[#315b7b]">
                Compensation records are organized
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Salary and employee documents can be reviewed and managed here.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT SALARY MODAL */}
      {showEdit && (
        <Modal
          title="Edit Compensation"
          onClose={() => setShowEdit(false)}
          footer={
            <>
              <button onClick={() => setShowEdit(false)} className={cancelBtn}>
                Cancel
              </button>
              <button onClick={saveSalary} className={primaryBtn}>
                Save Changes
              </button>
            </>
          }
        >
          <label htmlFor="base-salary" className="text-xs font-semibold text-slate-600">
            Monthly Base Salary
          </label>
          <input
            id="base-salary"
            type="number"
            min="0"
            value={salaryDraft}
            onChange={(e) => {
              setSalaryDraft(e.target.value);
              setSalaryError("");
            }}
            className={inputClass}
          />
          {salaryError && <p className="mt-2 text-xs text-red-600">{salaryError}</p>}
        </Modal>
      )}

      {/* ADD PAY ELEMENT MODAL */}
      {showAddForm && (
        <Modal
          title="Add Pay Element"
          onClose={closeAdd}
          footer={
            <>
              <button onClick={closeAdd} className={cancelBtn}>
                Cancel
              </button>
              <button onClick={addElement} className={primaryBtn}>
                Add Element
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="el-name" className="text-xs font-semibold text-slate-600">
                Element Name
              </label>
              <input
                id="el-name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setAddError("");
                }}
                placeholder="e.g. Travel Allowance"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="el-cat" className="text-xs font-semibold text-slate-600">
                Category
              </label>
              <select
                id="el-cat"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="el-amt" className="text-xs font-semibold text-slate-600">
                Payment Amount
              </label>
              <input
                id="el-amt"
                type="number"
                min="0"
                value={newAmount}
                onChange={(e) => {
                  setNewAmount(e.target.value);
                  setAddError("");
                }}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            {addError && <p className="text-xs text-red-600">{addError}</p>}
          </div>
        </Modal>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {showUpload && (
        <Modal
          title="Upload Document"
          onClose={closeUpload}
          footer={
            <>
              <button onClick={closeUpload} className={cancelBtn}>
                Cancel
              </button>
              <button onClick={uploadDocument} disabled={!uploadFile} className={primaryBtn}>
                Upload
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="doc-file" className="text-xs font-semibold text-slate-600">
                File
              </label>
              <input
                id="doc-file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                className="mt-2 w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#e7eff5] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#315b7b]"
              />
            </div>

            <div>
              <label htmlFor="doc-type" className="text-xs font-semibold text-slate-600">
                Document type
              </label>
              <select
                id="doc-type"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className={inputClass}
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}