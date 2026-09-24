import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  UserCog,
  Users,
  Search,
  Plus,
  KeyRound,
  LogIn,
  CheckCircle2,
  Trash2,
  X,
  Save,
  Mail,
  ChevronDown,
  Edit3,
  Palmtree,
  PowerOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../context/ToastContext';
import demoAvatars from '../../utils/avatars';
import api from '../../api/client.js';

const ROLES = ['Employee', 'HR', 'Manager'];
const STATUSES = ['All', 'Active', 'Holiday', 'Inactive'];

const ROLE_LABELS = {
  Employee: 'Employees',
  HR: 'HR Team',
  Manager: 'Managers',
};

const STATUS_LABELS = {
  All: 'Total',
  Active: 'Active',
  Holiday: 'Holidays',
  Inactive: 'Inactive',
};

const ROLE_STYLE = {
  Employee: {
    badge:
      'bg-[#E8F2F6] text-[#19364D] border border-[#C8D9E1] dark:bg-[#17384A] dark:text-[#DDEEF4] dark:border-[#31576B]',
    ring: 'ring-[#286A8F] dark:ring-[#5BAFC1]',
    icon: Users,
  },
  HR: {
    badge:
      'bg-[#2D94A8] text-white border border-[#2D94A8] dark:bg-[#3D9FB3] dark:border-[#3D9FB3]',
    ring: 'ring-[#2D94A8] dark:ring-[#67BDCC]',
    icon: ShieldCheck,
  },
  Manager: {
    badge:
      'bg-white text-[#286A8F] border border-[#286A8F] dark:bg-[#102B3A] dark:text-[#9DD5DF] dark:border-[#4A8DA1]',
    ring: 'ring-[#286A8F] dark:ring-[#5BAFC1]',
    icon: UserCog,
  },
};

const STATUS_STYLE = {
  Active: {
    badge:
      'bg-[#2D94A8] text-white border border-[#2D94A8] dark:bg-[#3D9FB3] dark:border-[#3D9FB3]',
    filterIcon: 'text-[#2D94A8] dark:text-[#75C6D4]',
    icon: CheckCircle2,
  },
  Holiday: {
    badge:
      'bg-[#DCEAF0] text-[#286A8F] border border-[#AFC9D4] dark:bg-[#17384A] dark:text-[#9DD5DF] dark:border-[#3D6679]',
    filterIcon: 'text-[#286A8F] dark:text-[#75C6D4]',
    icon: Palmtree,
  },
  Inactive: {
    badge:
      'bg-white text-[#708D9B] border border-[#C8D9E1] dark:bg-[#102B3A] dark:text-[#9AB6C4] dark:border-[#31576B]',
    filterIcon: 'text-[#8EA5B2] dark:text-[#9AB6C4]',
    icon: PowerOff,
  },
};

const inputClass =
  'w-full h-11 px-3.5 rounded-xl font-medium border outline-none transition-all ' +
  'bg-[#E8F2F6] text-[#19364D] placeholder:text-[#8EA5B2] border-[#C8D9E1] ' +
  'focus:bg-white focus:border-[#286A8F] focus:ring-2 focus:ring-[#286A8F]/20 ' +
  'dark:bg-[#0D2533] dark:text-[#EDF7FA] dark:placeholder:text-[#7696A6] dark:border-[#31576B] ' +
  'dark:focus:bg-[#102D3D] dark:focus:border-[#5BAFC1] dark:focus:ring-[#5BAFC1]/20';

const labelClass =
  'block mb-1.5 text-[10px] font-bold uppercase tracking-wider ' +
  'text-[#708D9B] dark:text-[#9AB6C4]';

const secondaryDrawerButtonClass =
  'flex-1 h-10 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ' +
  'bg-[#E8F2F6] text-[#204A65] border-[#C8D9E1] hover:bg-[#DCEAF0] hover:border-[#286A8F] ' +
  'dark:bg-[#17384A] dark:text-[#CDE6ED] dark:border-[#31576B] dark:hover:bg-[#20485B] dark:hover:border-[#5BAFC1]';

const activeToggleClass =
  'border-[#286A8F] bg-white text-[#286A8F] hover:bg-[#E8F2F6] dark:border-[#5BAFC1] dark:bg-[#102B3A] dark:text-[#75C6D4] dark:hover:bg-[#17384A]';
const inactiveToggleClass =
  'border-[#2D94A8] bg-[#2D94A8] text-white hover:border-[#286A8F] hover:bg-[#286A8F] dark:border-[#3D9FB3] dark:bg-[#3D9FB3] dark:hover:border-[#5BAFC1] dark:hover:bg-[#286A8F]';

/* ---------- Helpers (outside the component) ---------- */

const normalizeRole = (value = '') => {
  const v = String(value).trim().toLowerCase();
  if (v === 'hr' || v === 'human resources') return 'HR';
  if (v === 'manager') return 'Manager';
  return 'Employee';
};

const normalizeStatus = (e) => {
  if (typeof e.isActive === 'boolean') return e.isActive ? 'Active' : 'Inactive';
  const v = String(e.status || '').trim().toLowerCase();
  if (v === 'active') return 'Active';
  if (['holiday', 'leave', 'on leave', 'vacation'].includes(v)) return 'Holiday';
  return 'Inactive';
};

const normalizeUser = (e = {}) => ({
  _id: e._id || e.id,
  name: e.name || e.fullName || '',
  email: e.email || '',
  role: normalizeRole(e.role),
  department: e.department || '',
  status: normalizeStatus(e),
  lastLogin: e.lastLogin || null,
  avatar: e.avatar || '',
});

// Avoids a crash when lastLogin is missing or not a valid date
const formatDate = (value, pattern) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : format(d, pattern);
};

const EMPTY_FORM = { name: '', email: '', role: '', department: '', status: '' };

const EmployeeDirectoryPage_su = () => {
  const toast = useToast();

  const [emp, setEmp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [statusFilter, setStatusFilter] = useState('All');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Load employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.employees || [];
        setEmp(list.map(normalizeUser));
      } catch (error) {
        console.error(
          'Error fetching employees:',
          error.response?.status,
          error.config?.url
        );
        toast.error(
          error.response?.data?.message ||
          'Could not load employees from the server'
        );
        setEmp([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock page scrolling and support Escape while drawer is open.
  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  // Filtered list (role + status + search)
  const users = useMemo(() => {
    const query = search.trim().toLowerCase();

    return emp.filter((user) => {
      if (selectedRole !== 'All' && user.role !== selectedRole) return false;
      if (statusFilter !== 'All' && user.status !== statusFilter) return false;
      if (!query) return true;

      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query)
      );
    });
  }, [emp, search, selectedRole, statusFilter]);

  const roleMetrics = useMemo(
    () => ({
      Employee: emp.filter((u) => u.role === 'Employee').length,
      HR: emp.filter((u) => u.role === 'HR').length,
      Manager: emp.filter((u) => u.role === 'Manager').length,
    }),
    [emp]
  );

  const statusMetrics = useMemo(() => {
    const roleUsers =
      selectedRole === 'All' ? emp : emp.filter((u) => u.role === selectedRole);
    return {
      All: roleUsers.length,
      Active: roleUsers.filter((u) => u.status === 'Active').length,
      Holiday: roleUsers.filter((u) => u.status === 'Holiday').length,
      Inactive: roleUsers.filter((u) => u.status === 'Inactive').length,
    };
  }, [emp, selectedRole]);

  const updateForm = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleRoleCardClick = (role) => {
    setSelectedRole(role);
    setStatusFilter('All');
  };

  const showAllRoles = () => {
    setSelectedRole('All');
    setStatusFilter('All');
  };

  const openCreateDrawer = () => {
    setEditingUser(null);
    setFormData({
      ...EMPTY_FORM,
      role: selectedRole === 'All' ? 'Employee' : selectedRole,
      status: 'Active',
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      status: user.status || 'Active',
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSaving(false);
  };

  // Create / update via backend
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingUser) {
        const res = await api.put(`/employees/${editingUser._id}`, formData);
        const updated = normalizeUser(res.data?.employee || res.data);
        // keep existing values if the API returns only a partial record
        setEmp((prev) =>
          prev.map((u) =>
            u._id === editingUser._id
              ? { ...u, ...formData, ...(updated._id ? updated : {}) }
              : u
          )
        );
        toast.success('Member updated successfully');
      } else {
        const res = await api.post('/employees', formData);
        const created = normalizeUser(res.data?.employee || res.data);
        setEmp((prev) => [...prev, { ...formData, ...created }]);
        toast.success(`${formData.name} added successfully`);
      }
      setDrawerOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save member');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';

    try {
      await api.put(`/employees/${user._id}`, { status: nextStatus });

      setEmp((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus } : u))
      );

      if (editingUser?._id === user._id) {
        setEditingUser((prev) => ({ ...prev, status: nextStatus }));
        setFormData((prev) => ({ ...prev, status: nextStatus }));
      }

      toast.success(`${user.name} status changed to ${nextStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not change status');
    }
  };

  // TODO: connect to a real backend endpoint
  const resetPassword = (user) => {
    toast.success(`Password reset link sent to ${user.email}`);
  };

  // TODO: connect to a real backend endpoint
  const impersonateUser = (user) => {
    toast.success(`Now viewing as ${user.name}`);
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This action cannot be undone.`)) return;

    try {
      await api.delete(`/employees/${user._id}`);
      setEmp((prev) => prev.filter((u) => u._id !== user._id));
      toast.success('Member deleted');
      setDrawerOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete member');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#E8F2F6] p-4 transition-colors duration-300 dark:bg-[#081923] dark:[color-scheme:dark] sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#2D94A8]/10 blur-3xl dark:bg-[#5BAFC1]/10" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#286A8F]/10 blur-3xl dark:bg-[#2D94A8]/10" />

      <div className="relative z-10 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#19364D] text-white shadow-md shadow-[#19364D]/20 dark:bg-[#2D94A8] dark:shadow-black/20">
                <Users className="h-[18px] w-[18px]" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#19364D] dark:text-[#EDF7FA]">
                Organization Directory
              </h2>
            </div>
            <p className="text-sm text-[#708D9B] dark:text-[#9AB6C4]">
              View and manage employees, human resources, and management teams.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateDrawer}
            className="flex items-center gap-2 rounded-xl bg-[#19364D] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#19364D]/25 transition-all hover:-translate-y-0.5 hover:bg-[#204A65] hover:shadow-lg dark:bg-[#2D94A8] dark:shadow-black/20 dark:hover:bg-[#3D9FB3]"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>

        {/* Employee, HR and Manager Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROLES.map((role) => {
            const roleStyle = ROLE_STYLE[role];
            const RoleIcon = roleStyle.icon;
            const selected = selectedRole === role;

            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleCardClick(role)}
                className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#286A8F] dark:focus-visible:ring-[#5BAFC1] ${selected
                    ? 'border-[#286A8F] bg-white shadow-lg shadow-[#286A8F]/15 ring-2 ring-[#286A8F]/15 dark:border-[#5BAFC1] dark:bg-[#102B3A] dark:shadow-black/25 dark:ring-[#5BAFC1]/15'
                    : 'border-[#C8D9E1] bg-white shadow-sm shadow-[#204A65]/5 hover:-translate-y-0.5 hover:border-[#286A8F] hover:shadow-md dark:border-[#294C5F] dark:bg-[#102B3A] dark:shadow-black/20 dark:hover:border-[#5BAFC1]'
                  }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${selected
                      ? 'bg-[#2D94A8] dark:bg-[#5BAFC1]'
                      : 'bg-[#DCEAF0] dark:bg-[#294C5F]'
                    }`}
                />

                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${selected
                        ? 'bg-[#19364D] text-white shadow-md shadow-[#19364D]/20 dark:bg-[#2D94A8] dark:shadow-black/20'
                        : 'bg-[#DCEAF0] text-[#286A8F] dark:bg-[#17384A] dark:text-[#75C6D4]'
                      }`}
                  >
                    <RoleIcon className="h-5 w-5" />
                  </div>

                  {selected && (
                    <span className="rounded-full bg-[#E8F2F6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#286A8F] dark:bg-[#17384A] dark:text-[#9DD5DF]">
                      Selected
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#8EA5B2] dark:text-[#9AB6C4]">
                  {ROLE_LABELS[role]}
                </span>

                <div className="mt-1 text-3xl font-black text-[#19364D] dark:text-[#EDF7FA]">
                  {roleMetrics[role]}
                </div>

                <p className="mt-2 text-[11px] text-[#8EA5B2] dark:text-[#7696A6]">
                  Click to view {ROLE_LABELS[role].toLowerCase()}
                </p>
              </button>
            );
          })}
        </div>

        {/* Status Overview and Search */}
        <div className="space-y-4 rounded-2xl border border-[#C8D9E1] bg-white p-4 shadow-sm shadow-[#204A65]/10 transition-colors dark:border-[#294C5F] dark:bg-[#102B3A] dark:shadow-black/20 sm:p-5">
          <div className="flex flex-col justify-between gap-4 border-b border-[#DCEAF0] pb-4 dark:border-[#294C5F] lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-[#19364D] dark:text-[#EDF7FA]">
                  {selectedRole === 'All'
                    ? 'All Members Status'
                    : `${ROLE_LABELS[selectedRole]} Status Overview`}
                </h3>

                {selectedRole !== 'All' && (
                  <button
                    type="button"
                    onClick={showAllRoles}
                    className="rounded-lg bg-[#E8F2F6] px-2 py-1 text-[10px] font-bold text-[#286A8F] transition-colors hover:bg-[#DCEAF0] dark:bg-[#17384A] dark:text-[#9DD5DF] dark:hover:bg-[#20485B]"
                  >
                    Show All Roles
                  </button>
                )}
              </div>

              <p className="mt-1 text-xs text-[#8EA5B2] dark:text-[#9AB6C4]">
                Filter members by their current status
              </p>
            </div>

            {/* Status filters */}
            <div className="flex flex-wrap items-center gap-2">
              {STATUSES.map((status) => {
                const selected = statusFilter === status;
                const count = statusMetrics[status] || 0;
                const statusStyle = STATUS_STYLE[status];
                const StatusIcon = statusStyle?.icon;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${selected
                        ? 'border-[#19364D] bg-[#19364D] text-white shadow-sm shadow-[#19364D]/20 dark:border-[#2D94A8] dark:bg-[#2D94A8] dark:shadow-black/20'
                        : 'border-[#C8D9E1] bg-white text-[#286A8F] hover:border-[#286A8F] hover:bg-[#E8F2F6] dark:border-[#31576B] dark:bg-[#102B3A] dark:text-[#9DD5DF] dark:hover:border-[#5BAFC1] dark:hover:bg-[#17384A]'
                      }`}
                  >
                    {StatusIcon && (
                      <StatusIcon
                        className={`h-3.5 w-3.5 ${selected ? 'text-white' : statusStyle.filterIcon
                          }`}
                      />
                    )}

                    <span>{STATUS_LABELS[status]}</span>

                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${selected
                          ? 'bg-white/15 text-white'
                          : 'bg-[#DCEAF0] text-[#204A65] dark:bg-[#20485B] dark:text-[#CDE6ED]'
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute inset-y-0 left-4 my-auto h-4 w-4 text-[#286A8F] dark:text-[#75C6D4]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${selectedRole === 'All'
                  ? 'members'
                  : ROLE_LABELS[selectedRole].toLowerCase()
                } by name, email or department...`}
              className="h-12 w-full rounded-xl border border-[#C8D9E1] bg-[#E8F2F6] pl-11 pr-4 text-sm font-medium text-[#19364D] outline-none transition-all placeholder:text-[#8EA5B2] focus:border-[#286A8F] focus:bg-white focus:ring-2 focus:ring-[#286A8F]/20 dark:border-[#31576B] dark:bg-[#0D2533] dark:text-[#EDF7FA] dark:placeholder:text-[#7696A6] dark:focus:border-[#5BAFC1] dark:focus:bg-[#102D3D] dark:focus:ring-[#5BAFC1]/20"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-hidden rounded-2xl border border-[#C8D9E1] bg-white shadow-sm shadow-[#204A65]/10 transition-colors dark:border-[#294C5F] dark:bg-[#102B3A] dark:shadow-black/20">
          {loading ? (
            <div className="flex flex-col items-center gap-3 p-14 text-center text-[#8EA5B2] dark:text-[#9AB6C4]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#286A8F] border-t-transparent dark:border-[#5BAFC1] dark:border-t-transparent" />
              <span className="text-xs font-medium">Loading directory records...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F2F6] text-[#286A8F] dark:bg-[#17384A] dark:text-[#75C6D4]">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#19364D] dark:text-[#EDF7FA]">
                  No members found
                </p>
                <p className="mt-1 text-xs text-[#8EA5B2] dark:text-[#9AB6C4]">
                  Try changing your search or filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[950px] w-full text-left text-xs">
                <thead className="bg-[#19364D] font-bold uppercase tracking-wider text-white dark:bg-[#0B2230]">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Department</th>
                    <th className="px-4 py-4">Last Login</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#DCEAF0] bg-white font-medium dark:divide-[#294C5F] dark:bg-[#102B3A]">
                  {users.map((user) => {
                    const roleStyle = ROLE_STYLE[user.role] || ROLE_STYLE.Employee;
                    const RoleIcon = roleStyle.icon;
                    const statusStyle = STATUS_STYLE[user.status] || STATUS_STYLE.Inactive;
                    const StatusIcon = statusStyle.icon;

                    return (
                      <tr
                        key={user._id}
                        onClick={() => openEditDrawer(user)}
                        className="cursor-pointer transition-colors hover:bg-[#E8F2F6] dark:hover:bg-[#17384A]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                user.avatar ||
                                demoAvatars.generic(user.name?.slice(0, 2))
                              }
                              alt={user.name}
                              className={`h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#102B3A] ${roleStyle.ring}`}
                            />

                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold leading-tight text-[#19364D] dark:text-[#EDF7FA]">
                                {user.name}
                              </div>
                              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#8EA5B2] dark:text-[#9AB6C4]">
                                <Mail className="h-3 w-3 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${roleStyle.badge}`}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {user.role}
                          </span>
                        </td>

                        <td className="px-4 py-4 font-semibold text-[#204A65] dark:text-[#CDE6ED]">
                          {user.department || '—'}
                        </td>

                        <td className="px-4 py-4 font-mono text-[#708D9B] dark:text-[#9AB6C4]">
                          {formatDate(user.lastLogin, 'dd MMM, hh:mm a') || 'Never'}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle.badge}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {STATUS_LABELS[user.status] || user.status}
                          </span>
                        </td>

                        <td
                          className="px-6 py-4 text-right"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="Reset password"
                              aria-label={`Reset password for ${user.name}`}
                              onClick={() => resetPassword(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#286A8F] transition-all hover:bg-[#DCEAF0] hover:text-[#19364D] dark:text-[#75C6D4] dark:hover:bg-[#20485B] dark:hover:text-white"
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              title="Impersonate"
                              aria-label={`Impersonate ${user.name}`}
                              onClick={() => impersonateUser(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#286A8F] transition-all hover:bg-[#DCEAF0] hover:text-[#19364D] dark:text-[#75C6D4] dark:hover:bg-[#20485B] dark:hover:text-white"
                            >
                              <LogIn className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                              aria-label={
                                user.status === 'Active'
                                  ? `Deactivate ${user.name}`
                                  : `Activate ${user.name}`
                              }
                              onClick={() => toggleStatus(user)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${user.status === 'Active'
                                  ? activeToggleClass
                                  : inactiveToggleClass
                                }`}
                            >
                              {user.status === 'Active' ? (
                                <PowerOff className="h-3.5 w-3.5" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              title="Edit member"
                              aria-label={`Edit ${user.name}`}
                              onClick={() => openEditDrawer(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#286A8F] text-white transition-all hover:bg-[#19364D] dark:bg-[#2D94A8] dark:hover:bg-[#3D9FB3]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Backdrop */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-[#19364D]/55 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/65 ${drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
      />

      {/* Add/Edit Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={editingUser ? 'Edit member' : 'Add member'}
        aria-hidden={!drawerOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition-all duration-300 ease-out dark:bg-[#102B3A] dark:shadow-black/50 ${drawerOpen
            ? 'translate-x-0 pointer-events-auto'
            : 'translate-x-full pointer-events-none'
          }`}
      >
        {/* Drawer Header */}
        <div className="relative shrink-0 overflow-hidden bg-[#19364D] px-6 pb-7 pt-6 dark:bg-[#0B2230]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#2D94A8]/25 dark:bg-[#5BAFC1]/20" />
          <div className="pointer-events-none absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-[#286A8F]/25 dark:bg-[#2D94A8]/20" />
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close drawer"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/65">
              {editingUser ? 'Member Details' : 'New Member'}
            </span>

            {editingUser ? (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={
                    editingUser.avatar ||
                    demoAvatars.generic(editingUser.name?.slice(0, 2))
                  }
                  alt={editingUser.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/40"
                />
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold leading-tight text-white">
                    {editingUser.name}
                  </h3>
                  <p className="mt-1 truncate text-xs text-white/70">
                    {editingUser.email}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Add to Organization
                </h3>
                <p className="mt-1 text-xs text-white/65">
                  Create a new member account and assign their role.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto bg-white p-6 transition-colors dark:bg-[#102B3A]">
          {editingUser && (
            <div className="mb-5 space-y-4">
              {/* Quick actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => resetPassword(editingUser)}
                  className={secondaryDrawerButtonClass}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Reset Pwd
                </button>

                <button
                  type="button"
                  onClick={() => impersonateUser(editingUser)}
                  className={secondaryDrawerButtonClass}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Impersonate
                </button>

                <button
                  type="button"
                  onClick={() => toggleStatus(editingUser)}
                  className={`flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-semibold transition-all ${editingUser.status === 'Active'
                      ? activeToggleClass
                      : inactiveToggleClass
                    }`}
                >
                  {editingUser.status === 'Active' ? (
                    <PowerOff className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {editingUser.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>

              <div className="rounded-xl border border-[#C8D9E1] bg-[#E8F2F6] px-3 py-2.5 font-mono text-[11px] text-[#708D9B] dark:border-[#31576B] dark:bg-[#0D2533] dark:text-[#9AB6C4]">
                Last login:{' '}
                <span className="font-semibold text-[#204A65] dark:text-[#CDE6ED]">
                  {formatDate(editingUser.lastLogin, 'dd MMM yyyy, hh:mm a') ||
                    'Never logged in'}
                </span>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="member-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="member-name"
                type="text"
                required
                value={formData.name}
                onChange={(event) => updateForm('name', event.target.value)}
                placeholder="e.g. Priya Kapoor"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="member-email" className={labelClass}>
                Email Address
              </label>
              <input
                id="member-email"
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateForm('email', event.target.value)}
                placeholder="priya@workzen.io"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="member-role" className={labelClass}>
                  Role
                </label>
                <div className="relative">
                  <select
                    id="member-role"
                    value={formData.role}
                    onChange={(event) => updateForm('role', event.target.value)}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#286A8F] dark:text-[#75C6D4]" />
                </div>
              </div>

              <div>
                <label htmlFor="member-status" className={labelClass}>
                  Status
                </label>
                <div className="relative">
                  <select
                    id="member-status"
                    value={formData.status}
                    onChange={(event) => updateForm('status', event.target.value)}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    <option value="Active">Active</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#286A8F] dark:text-[#75C6D4]" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="member-department" className={labelClass}>
                Department
              </label>
              <input
                id="member-department"
                type="text"
                value={formData.department}
                onChange={(event) => updateForm('department', event.target.value)}
                placeholder="e.g. Engineering"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-2 pt-3">
              <button
                type="submit"
                disabled={saving}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#19364D] font-semibold text-white shadow-md shadow-[#19364D]/25 transition-all hover:bg-[#204A65] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#2D94A8] dark:shadow-black/20 dark:hover:bg-[#3D9FB3]"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editingUser ? 'Save Changes' : 'Create Member'}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={() => deleteUser(editingUser)}
                  title="Delete member"
                  aria-label={`Delete ${editingUser.name}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C8D9E1] bg-[#E8F2F6] text-[#286A8F] transition-all hover:border-[#19364D] hover:bg-[#19364D] hover:text-white dark:border-[#31576B] dark:bg-[#17384A] dark:text-[#75C6D4] dark:hover:border-[#5BAFC1] dark:hover:bg-[#20485B] dark:hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default EmployeeDirectoryPage_su;