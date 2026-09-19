import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  HeartHandshake,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Building2,
  CalendarDays,
  FileText,
  DollarSign,
  Landmark,
  CreditCard,
  Receipt,
  FileSpreadsheet,
  BadgeCheck,
  ShieldCheck,
  Award,
  Wallet,
  TrendingUp,
  Scale,
  FileCheck2,
  Banknote,
  Hash,
} from "lucide-react";

export default function FinanceProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Professional Finance Specialist Profile State
  const [formData, setFormData] = useState({
    name: "Sneha Kulkarni, CA",
    email: "sneha.k@dayflowhrms.com",
    phone: "+91 98230 45678",
    designation: "Lead Payroll & Financial Controller",
    department: "Corporate Finance & Taxation",
    status: "Active (Verified)",
    financeId: "FIN-IND-008",
    entity: "Dayflow Technologies Private Limited",
    cin: "U72200KA2021PTC145892",
    costCenter: "CC-FIN-204 (Corporate & R&D Payroll)",
    joiningDate: "10 August, 2021",
    qualification: "Chartered Accountant (ICAI #409218) • B.Com (Hons)",
    tanNumber: "BLRD08219E",
    panNumber: "ABCDE1234F",
    epfoCode: "PY/BOM/0019283/000",
    esicCode: "31000456780001001",
    address: {
      street: "B-402, Prestige Tech Vista, Kadubeesanahalli, ORR",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560103",
    },
    emergencyContact: {
      name: "Rohan Kulkarni",
      relation: "Spouse",
      phone: "+91 98230 99881",
    },
  });

  // Enterprise Payroll Configuration
  const payrollConfig = {
    batchCycle: "Monthly (1st to 30th / 31st)",
    payoutDate: "Last Working Day (Cutoff: 25th)",
    employeeCount: "480 Active Employees across 4 Entities",
    taxSystem: "Section 115BAC (New) & Slabs (Old Regime)",
    payslipMethod: "AES-256 Encrypted PDF via Self-Serve Portal",
    bankPartner: "HDFC CMS Gateway & ICICI Bulk Upload",
    grossMonthlyDisbursed: "₹ 4.85 Crore / month",
    fyAuditStatus: "KPMG Internal Audit Cleared (Clean Report)",
  };

  // Finance Operational Modules
  const financeModules = [
    {
      label: "Monthly Payroll & Net-Salary Batching",
      desc: "Gross-to-net computation, deductions (LOP, OT, Arrears), & bank bulk payment clearance.",
      tag: "Core Payroll",
      icon: Wallet,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Corporate Reimbursements & Expense Audit",
      desc: "GST compliance verification on travel, fuel, client entertainment & hardware bills.",
      tag: "Vetting & Claims",
      icon: Receipt,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "EPFO & ESIC Statutory Remittances",
      desc: "Monthly ECR file generation, challan verification, and electronic bank clearance.",
      tag: "Labor Compliance",
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "TDS 24Q Filing & Form 16 Sign-off",
      desc: "Quarterly e-TDS return filing, TRACES reconciliation & digital Form-16 Part A/B issuance.",
      tag: "Direct Taxation",
      icon: FileSpreadsheet,
      color: "text-violet-600 bg-violet-50 border-violet-100",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* ================= TOP NAVIGATION WITH ACTIVE UNDERLINE ================= */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex justify-evenly max-w-7xl items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {[
            ["profile", "Profile Overview"],
            ["tax-legal", "Tax & Legal Credentials"],
            ["financial-authority", "Payroll Desk Engine"],
            ["modules", "Core Responsibilities"],
            ["personal-info", "Official Contact"],
          ].map(([id, label]) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`relative py-4 text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-emerald-600 shadow-[0_2px_8px_rgba(16,185,129,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 space-y-12">
        {/* ================= PAGE HEADER & METRICS ================= */}
        <div id="profile" className="scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase border border-emerald-100">
                <Landmark size={14} /> Corporate Finance & Treasury Division
              </div>
              <h1 className="mt-2 text-2xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                Lead Payroll & Financial Operations Profile
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Audit fiscal parameters, corporate tax identifiers, bank settlement channels, and statutory timelines.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200">
                <Scale size={14} className="text-emerald-600" /> FY 2026-27 Compliant
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Monthly Disbursal</p>
                <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">₹ 4.85 Cr</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Banknote size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Payroll Run</p>
                <p className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-600">Cycle Locked</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Claims Audited</p>
                <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">84 Vetted</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Receipt size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Annual Audit</p>
                <p className="mt-1 text-xl sm:text-2xl font-extrabold text-indigo-600">Unqualified (Clear)</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileCheck2 size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= HERO PROFILE ================= */}
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* AVATAR */}
            <div className="flex shrink-0 justify-center lg:w-48">
              <div className="relative group">
                <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full ring-4 ring-white shadow-xl bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-white bg-emerald-500 shadow-sm" />
              </div>
            </div>

            {/* HERO CONTENT */}
            <div className="min-w-0 flex-1">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                      {formData.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                      <Award size={16} /> {formData.designation} • {formData.qualification}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {formData.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Finance ID</p>
                    <p className="mt-1 text-sm font-bold text-slate-800 font-mono">{formData.financeId}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cost Center</p>
                    <p className="mt-1 text-sm font-bold text-slate-800 font-mono">CC-FIN-204</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Signing Band</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">Tier-2 Signatory</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tenure Date</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{formData.joiningDate}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building2 size={14} className="text-slate-400" />
                    {formData.entity} (CIN: {formData.cin})
                  </span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    TAN: {formData.tanNumber}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => alert("Upload photo feature")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
                >
                  <Camera size={16} className="text-emerald-600" />
                  Change Avatar
                </button>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-slate-800"
                  >
                    <Edit3 size={16} className="text-amber-400" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <X size={16} className="text-rose-500" /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 1: TAX & LEGAL CREDENTIALS ================= */}
        <section id="tax-legal" className="scroll-mt-24">
          <SectionHeading
            eyebrow="LEGAL IDENTIFIERS"
            title="Corporate Tax & Statutory Registrations"
            icon={Scale}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AuthorityCard
                icon={Hash}
                iconColor="text-blue-600 bg-blue-50"
                label="Company TAN (TDS Number)"
                value={formData.tanNumber}
              />
              <AuthorityCard
                icon={Hash}
                iconColor="text-emerald-600 bg-emerald-50"
                label="Corporate PAN ID"
                value={formData.panNumber}
              />
              <AuthorityCard
                icon={ShieldCheck}
                iconColor="text-violet-600 bg-violet-50"
                label="EPFO Establishment Code"
                value={formData.epfoCode}
              />
              <AuthorityCard
                icon={Shield}
                iconColor="text-amber-600 bg-amber-50"
                label="ESIC Corporate Code"
                value={formData.esicCode}
              />
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: PAYROLL DESK ENGINE ================= */}
        <section id="financial-authority" className="scroll-mt-24">
          <SectionHeading
            eyebrow="PAYROLL ARCHITECTURE"
            title="Salary & Payroll Engine Parameters"
            icon={Landmark}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AuthorityCard
                icon={CalendarDays}
                iconColor="text-blue-600 bg-blue-50"
                label="Payroll Calculation Cycle"
                value={payrollConfig.batchCycle}
              />
              <AuthorityCard
                icon={DollarSign}
                iconColor="text-emerald-600 bg-emerald-50"
                label="Credit Disbursal Schedule"
                value={payrollConfig.payoutDate}
              />
              <AuthorityCard
                icon={User}
                iconColor="text-violet-600 bg-violet-50"
                label="Headcount Under Coverage"
                value={payrollConfig.employeeCount}
              />
              <AuthorityCard
                icon={BadgeCheck}
                iconColor="text-amber-600 bg-amber-50"
                label="Tax Deduction Formula"
                value={payrollConfig.taxSystem}
              />
              <AuthorityCard
                icon={FileText}
                iconColor="text-indigo-600 bg-indigo-50"
                label="Payslip Delivery Mode"
                value={payrollConfig.payslipMethod}
              />
              <AuthorityCard
                icon={CreditCard}
                iconColor="text-rose-600 bg-rose-50"
                label="Settlement Clearing Bank"
                value={payrollConfig.bankPartner}
              />
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: CORE RESPONSIBILITIES ================= */}
        <section id="modules" className="scroll-mt-24">
          <SectionHeading
            eyebrow="PORTFOLIO RESPONSIBILITIES"
            title="Assigned Fiscal Portfolios & Workflow Governance"
            icon={FileSpreadsheet}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {financeModules.map(({ label, desc, tag, icon: Icon, color }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition"
              >
                <div className={`rounded-2xl p-3.5 border shadow-2xs ${color}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 mb-1.5">
                    {tag}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">{label}</h4>
                  <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 4: PERSONAL & CONTACT ================= */}
        <section id="personal-info" className="scroll-mt-24">
          <SectionHeading
            eyebrow="OFFICIAL COMMUNICATIONS"
            title="Workstation & Emergency Coordinates"
            icon={MapPin}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-rose-500" /> Work Desk & Registered Communication Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Corporate Email</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Desk Extension / Phone</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Residential Address</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.zip}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake size={16} className="text-pink-500" /> Emergency SOS Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contact Person</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Relationship</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.emergencyContact.relation}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emergency Mobile</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Section Header Helper
function SectionHeading({ eyebrow, title, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={16} />
        </span>
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{eyebrow}</p>
      </div>
      <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
    </div>
  );
}

// Authority Card Helper
function AuthorityCard({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className={`rounded-xl p-3 shadow-2xs ${iconColor}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  );
}