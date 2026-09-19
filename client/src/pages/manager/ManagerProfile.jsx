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
  CheckCircle2,
  CalendarDays,
  FileText,
  Clock,
  Users,
  ChevronRight,
  Briefcase,
  Layers,
  ArrowUpRight,
  DollarSign,
  UserCheck,
  PlaneTakeoff,
  Award,
  Sparkles,
} from "lucide-react";

export default function ManagerProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [delegationActive, setDelegationActive] = useState(false);

  // Manager Personal State
  const [formData, setFormData] = useState({
    name: "Vikram Malhotra",
    email: "vikram.m@dayflowhrms.com",
    phone: "+91 98450 11234",
    department: "Engineering & Platform",
    designation: "Engineering Manager (L5)",
    status: "Active",
    location: "Bangalore HQ - Floor 4, Bay C",
    joiningDate: "14 Feb, 2022",
    reportsTo: {
      name: "Priya Nair",
      designation: "VP of Engineering",
      email: "priya.n@dayflowhrms.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
    address: {
      street: "74 Indiranagar, 100ft Road",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560038",
    },
    emergencyContact: {
      name: "Anjali Malhotra",
      relation: "Spouse",
      phone: "+91 98450 99887",
    },
  });

  // Direct Reports (Team Data)
  const teamMembers = [
    {
      id: "EMP-1042",
      name: "Rahul Sharma",
      role: "Frontend Engineer (React)",
      status: "Present",
      statusColor: "bg-emerald-500",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "EMP-1105",
      name: "Amit Patel",
      role: "Backend Lead (Node/Java)",
      status: "Present",
      statusColor: "bg-emerald-500",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "EMP-1218",
      name: "Neha Roy",
      role: "QA Automation Engineer",
      status: "On Leave",
      statusColor: "bg-rose-500",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "EMP-1330",
      name: "Ananya Deshmukh",
      role: "UI/UX Product Designer",
      status: "WFH",
      statusColor: "bg-blue-500",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  ];

  // Manager Approval Authority Scope
  const approvalScope = [
    { label: "Expense Approval Limit", value: "Up to ₹75,000 / claim", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Leave Approval Authority", value: "Max 15 Consecutive Days", icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
    // { label: "Attendance Regularization", value: "Full Team Sign-off", icon: UserCheck, color: "text-violet-600 bg-violet-50" },
    // { label: "Hardware & Asset Approvals", value: "Tier 1 & Tier 2 Devices", icon: Layers, color: "text-amber-600 bg-amber-50" },
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* ================= TOP STICKY NAVIGATION ================= */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex justify-evenly max-w-full items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {[
            ["profile", "Overview"],
            ["my-team", "My Team (Direct Reports)"],
            ["approval-limits", "Approval Authority"],
            ["reporting-tree", "Organization Hierarchy"],
            ["personal-info", "Personal & Contact"],
          ].map(([id, label]) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`relative py-4 text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* ================= PAGE HEADER & METRICS ================= */}
        <div id="profile" className="scroll-mt-24">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            <Briefcase size={14} /> People Manager Dashboard
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-700 sm:text-4xl">
            Manager Profile & Team Center
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Manage your personal profile, review team status, and control workflow delegation.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Reports</p>
                <p className="mt-1 text-2xl font-bold text-slate-600">4 Members</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Team Today</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-600">3 / 4 Present</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UserCheck size={20} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Approvals</p>
                <p className="mt-1 text-2xl font-extrabold text-amber-600">3 Awaiting</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= HERO PROFILE SECTION ================= */}
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* AVATAR */}
            <div className="flex shrink-0 justify-center lg:w-48">
              <div className="relative group">
                <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full ring-4 ring-white shadow-xl bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                    alt={formData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-white bg-emerald-500 shadow-sm" />
              </div>
            </div>

            {/* HERO CARD */}
            <div className="min-w-0 flex-1">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-800">
                      {formData.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                      <Award size={16} /> {formData.designation} • {formData.department}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {formData.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Manager ID</p>
                    <p className="mt-1 text-sm font-bold text-slate-800 font-mono">MGR-104</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reporting Head</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{formData.reportsTo.name}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Joining Date</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{formData.joiningDate}</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => alert("Upload photo feature")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
                >
                  <Camera size={16} className="text-blue-600" />
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

        {/* ================= SECTION 1: MY TEAM (DIRECT REPORTS) ================= */}
        <section id="my-team" className="scroll-mt-24">
          <SectionHeading
            eyebrow="TEAM LEADERSHIP"
            title="My Direct Reports (Engineering Unit)"
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${member.statusColor}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{member.name}</h4>
                    <p className="text-[11px] font-mono text-slate-400">{member.id}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 truncate max-w-[130px]">
                    {member.role}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= SECTION 2: APPROVAL AUTHORITY & DELEGATION ================= */}
        <section id="approval-limits" className="scroll-mt-24">
          <SectionHeading
            eyebrow="OPERATIONAL LIMITS"
            title="Managerial Approval Authority & Scope"
            icon={Shield}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {approvalScope.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className={`rounded-xl p-3 shadow-2xs ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Out-Of-Office Delegation Feature */}
            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700 mt-0.5">
                  <PlaneTakeoff size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Out-Of-Office Approval Delegation</h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                    Enable auto-forwarding of all pending workflow requests to peer manager when going on planned leave.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDelegationActive(!delegationActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shadow-2xs ${
                  delegationActive
                    ? "bg-rose-600 text-white hover:bg-rose-700"
                    : "bg-amber-600 text-white hover:bg-amber-700"
                }`}
              >
                {delegationActive ? "Disable Delegation" : "Configure Delegate"}
              </button>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: REPORTING TREE ================= */}
        <section id="reporting-tree" className="scroll-mt-24">
          <SectionHeading
            eyebrow="ORGANIZATIONAL HIERARCHY"
            title="Reporting Relationship"
            icon={Layers}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Direct Supervisor (Reports Upward To)</p>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <img
                  src={formData.reportsTo.avatar}
                  alt={formData.reportsTo.name}
                  className="h-12 w-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{formData.reportsTo.name}</h4>
                  <p className="text-xs font-semibold text-blue-600">{formData.reportsTo.designation}</p>
                </div>
              </div>
              <a
                href={`mailto:${formData.reportsTo.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Mail size={14} /> Contact
              </a>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: PERSONAL & CONTACT ================= */}
        <section id="personal-info" className="scroll-mt-24">
          <SectionHeading
            eyebrow="PERSONAL & CONTACT"
            title="Contact & Emergency Info"
            icon={MapPin}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-rose-500" /> Workplace & Residential Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Street</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.address.street}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">City / State</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.address.city}, {formData.address.state}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Desk Location</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.location}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Work Phone</p>
                  <p className="text-sm font-semibold text-slate-800">{formData.phone}</p>
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
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emergency Phone</p>
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