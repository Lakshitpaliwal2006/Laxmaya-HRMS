import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  HeartHandshake,
  Calendar,
  Edit3,
  Save,
  X,
  CalendarDays,
  Sparkles,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Camera,
  Check,
  Shield,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import demoAvatars from '../utils/avatars';
import api from '../api/client';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, updateUser, isAdmin } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'Government ID',
    fileSize: '1.2 MB',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    department: '',
    designation: '',
    role: 'employee',
    status: 'Active',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    emergencyContact: {
      name: '',
      relation: '',
      phone: '',
    },
  });

//  Smooth-Scrollin-function
  const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    // block: "start",
  });
};



  const fetchDocuments = async () => {
    if (!user?._id && !user?.id) return;
    try {
      setDocLoading(true);
      const res = await api.get(`/users/${user._id || user.id}/documents`);
      if (res.data.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setDocLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        department: user.department || '',
        designation: user.designation || '',
        role: user.role || 'employee',
        status: user.status || 'Active',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zip: user.address?.zip || '',
        },
        emergencyContact: {
          name: user.emergencyContact?.name || '',
          relation: user.emergencyContact?.relation || '',
          phone: user.emergencyContact?.phone || '',
        },
      });
      fetchDocuments();
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/users/${user._id || user.id}`, formData);
      if (res.data.success) {
        updateUser(res.data.employee);
        toast.success('Profile details saved successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = async (avatarUri) => {
    try {
      setFormData((prev) => ({ ...prev, avatar: avatarUri }));
      const res = await api.put(`/users/${user._id || user.id}`, { avatar: avatarUri });
      if (res.data.success) {
        updateUser(res.data.employee);
        toast.success('Profile picture updated successfully!');
        setShowAvatarModal(false);
      }
    } catch (err) {
      toast.error('Failed to update profile picture');
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.type) {
      toast.error('Please enter document title and select type');
      return;
    }

    try {
      const res = await api.post(`/users/${user._id || user.id}/documents`, newDoc);
      if (res.data.success) {
        toast.success('Document uploaded successfully!');
        setDocuments(res.data.documents || []);
        setShowAddDocModal(false);
        setNewDoc({ name: '', type: 'Government ID', fileSize: '1.2 MB' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add document');
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await api.delete(`/users/${user._id || user.id}/documents/${docId}`);
      if (res.data.success) {
        toast.success('Document removed successfully');
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  const handleVerifyDocument = async (docId, newStatus) => {
    try {
      const res = await api.put(`/users/${user._id || user.id}/documents/${docId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Document marked as ${newStatus}`);
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      toast.error('Failed to update document status');
    }
  };

  const avatarOptions = [
    { name: 'Ananya Sharma (Senior Engineer)', uri: demoAvatars.ananya, role: 'Engineering' },
    { name: 'Priya Iyer (HR Manager)', uri: demoAvatars.priya, role: 'Human Resources' },
    { name: 'Rohan Nair (Lead Designer)', uri: demoAvatars.rohan, role: 'UI/UX Design' },
    { name: 'Arjun Menon (Marketing Lead)', uri: demoAvatars.arjun, role: 'Marketing' },
    { name: 'Sneha Kulkarni (Finance Lead)', uri: demoAvatars.sneha, role: 'Finance' },
    { name: 'Karthik Reddy (DevOps Lead)', uri: demoAvatars.karthik, role: 'DevOps & Infra' },
  ];

  const formattedJoiningDate = user?.joiningDate
    ? format(new Date(user.joiningDate), 'MMMM dd, yyyy')
    : 'N/A';

  return (
    <>
    {/* Navbar */}
        <nav className='border border-gray-200 bg-white rounded-lg'>
          <div className='flex justify-evenly items-center text-gray-500 p-3'>
            <button onClick={() => scrollToSection('profile')} className='cursor-pointer h-10 w-[10%] hover:rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5'>
              <a href="#profile"></a>
              Profile
            </button>

            <button onClick={() => scrollToSection('profile-info')} className='cursor-pointer h-10 w-[10%] hover:rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5'>
              <a href="#profile-info"></a>
              About
            </button>

            <button onClick={() => scrollToSection('work-detail')} className='cursor-pointer h-10 w-[13%] hover:rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5'>
              <a href="#work-detail"></a>
              Employment
            </button>

            <button onClick={() => scrollToSection('contact')} className='cursor-pointer h-10 w-[10%] hover:rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5'>
              <a href="#contact"></a>
              Contact
            </button>

            <button onClick={() => scrollToSection('documents')} className='cursor-pointer h-10 w-[11%] hover:rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5'>
              <a href="#documents"></a>
              Document
            </button>
          </div>
        </nav>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-10 scroll-smooth">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 scroll-mt-24" id='profile'>

          {/* PAGE HEADING */}
          <div className="pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Employee Profile
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Profile
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              View and manage your personal and employment information.
            </p>
          </div>

          {/* PROFILE HERO - IMAGE 1 STYLE */}
        <section className="relative mb-8">

  {/* Background decorative glow */}
  <div className="absolute -left-10 top-10 w-56 h-56 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none" />
  <div className="absolute right-10 top-0 w-56 h-56 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

  <div className="relative flex flex-col lg:flex-row items-center lg:items-center gap-0 lg:gap-0">

    {/* ================= PROFILE IMAGE ================= */}
    <div className="relative z-20 shrink-0 lg:-mr-14">

      {/* Glow behind image */}
      <div className="absolute inset-0 rounded-full bg-indigo-400/30 blur-2xl scale-110" />

      {/* Profile Image */}
      <div className="relative group">

        <img
          src={
            formData.avatar ||
            demoAvatars.generic(user?.name?.slice(0, 2))
          }
          alt={user?.name || "Employee"}
          className="
            w-36 h-36
            sm:w-40 sm:h-40
            lg:w-44 lg:h-44
            rounded-full
            object-cover
            border-[7px]
            border-white
            shadow-2xl
            ring-1
            ring-indigo-100
          "
        />

        {/* Online Status */}
        <span
          className={`
            absolute
            right-3 bottom-5
            w-6 h-6
            rounded-full
            border-[3px]
            border-white
            shadow-lg
            ${
              user?.status === "Active"
                ? "bg-emerald-500"
                : "bg-rose-500"
            }
          `}
        />

        {/* Hover Change Photo */}
        <button
          type="button"
          onClick={() => setShowAvatarModal(true)}
          className="
            absolute inset-0
            rounded-full
            bg-slate-950/70
            opacity-0
            group-hover:opacity-100
            transition-all duration-300
            flex flex-col
            items-center
            justify-center
            text-white
            font-semibold
            text-sm
          "
        >
          <Camera className="w-7 h-7 mb-2" />
          Change Photo
        </button>

      </div>

      {/* Active Badge */}
      <div className="
        absolute
        -bottom-5
        left-1/2
        -translate-x-1/2
        whitespace-nowrap
        flex items-center gap-2
        px-4 py-2
        rounded-full
        bg-white
        shadow-xl
        border border-slate-100
        text-sm
        font-bold
        text-slate-800
      ">
        <span
          className={`
            w-2.5 h-2.5
            rounded-full
            ${
              user?.status === "Active"
                ? "bg-emerald-500"
                : "bg-rose-500"
            }
          `}
        />
        {user?.status || "Active"}
      </div>

    </div>


    {/* ================= INFORMATION CARD ================= */}
    <div className="
      relative
      w-full
      lg:flex-1
      lg:pl-20
      lg:max-w-[900px]
    ">

      <div className="
        relative
        overflow-hidden
        rounded-[26px]
        bg-white
        border border-slate-100
        shadow-[0_15px_45px_rgba(30,41,59,0.08)]
      ">

        {/* Card decorative gradient */}
        <div className="
          absolute
          -right-24
          -top-24
          w-56 h-56
          rounded-full
          bg-indigo-100/60
          blur-2xl
        " />

        <div className="
          absolute
          right-10
          bottom-0
          w-28 h-28
          rounded-full
          bg-blue-50
        " />

        <div className="relative p-6 sm:p-7 lg:p-7">

          {/* Top Content */}
          <div className="
            flex
            flex-col
            sm:flex-row
            sm:items-start
            sm:justify-between
            gap-5
          ">

            {/* Name + Designation */}
            <div>

              <p className="
                text-sm
                font-medium
                text-slate-400
                mb-1
              ">
                Hello,
              </p>

              <h1 className="
                text-2xl
                sm:text-3xl
                lg:text-[34px]
                font-black
                tracking-tight
                text-slate-900
              ">
                {user?.name || "Employee Name"}
              </h1>

              <p className="
                mt-2
                text-lg
                sm:text-xl
                font-semibold
                text-indigo-600
              ">
                {user?.designation || "Employee"}
              </p>

              <div className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-2
                text-sm
                text-slate-500
              ">
                <Building2 className="w-4 h-4 text-indigo-500" />

                <span>
                  {user?.department || "Department"}
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span>
                  {user?.role || "Employee"}
                </span>
              </div>

            </div>


            {/* Active Status */}
            <div className="
              self-start
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-emerald-50
              border border-emerald-100
              px-4 py-2
              text-sm
              font-bold
              text-emerald-700
            ">
              <span className="
                w-2.5 h-2.5
                rounded-full
                bg-emerald-500
              " />

              {user?.status || "Active"}
            </div>

          </div>


          {/* Introduction */}
          <div className="
            mt-5
            pt-5
            border-t
            border-slate-100
          ">

            <div className="flex gap-3">

              <span className="
                text-3xl
                leading-none
                font-serif
                text-indigo-200
              ">
                “
              </span>

              <p className="
                max-w-2xl
                text-sm
                leading-6
                italic
                text-slate-500
              ">
                Focused on building better experiences
                through clean code, modern technology
                and thoughtful design.
              </p>

            </div>

          </div>


          {/* Employee Information */}
          <div className="
            mt-5
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          ">

            {/* Employee ID */}
            <div className="flex items-center gap-3">

              <div className="
                w-10 h-10
                shrink-0
                rounded-xl
                bg-indigo-50
                flex items-center justify-center
              ">
                <BadgeCheck className="
                  w-5 h-5
                  text-indigo-600
                " />
              </div>

              <div>
                <p className="
                  text-xs
                  font-medium
                  text-slate-400
                ">
                  Employee ID
                </p>

                <p className="
                  mt-0.5
                  text-sm
                  font-bold
                  text-slate-800
                ">
                  {user?.employeeId || "EMP-ID"}
                </p>
              </div>

            </div>


            {/* Joining Date */}
            <div className="flex items-center gap-3">

              <div className="
                w-10 h-10
                shrink-0
                rounded-xl
                bg-blue-50
                flex items-center justify-center
              ">
                <Calendar className="
                  w-5 h-5
                  text-blue-600
                " />
              </div>

              <div>
                <p className="
                  text-xs
                  font-medium
                  text-slate-400
                ">
                  Joining Date
                </p>

                <p className="
                  mt-0.5
                  text-sm
                  font-bold
                  text-slate-800
                ">
                  {formattedJoiningDate}
                </p>
              </div>

            </div>


            {/* Email */}
            <div className="flex items-center gap-3">

              <div className="
                w-10 h-10
                shrink-0
                rounded-xl
                bg-violet-50
                flex items-center justify-center
              ">
                <Mail className="
                  w-5 h-5
                  text-violet-600
                " />
              </div>

              <div className="min-w-0">

                <p className="
                  text-xs
                  font-medium
                  text-slate-400
                ">
                  Work Email
                </p>

                <p className="
                  mt-0.5
                  text-sm
                  font-bold
                  text-slate-800
                  truncate
                ">
                  {user?.email || "Email"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ================= BUTTONS BELOW CARD ================= */}
      <div className="
        mt-4
        flex
        flex-col
        sm:flex-row
        items-stretch
        justify-center
        lg:justify-start
        gap-3
        lg:pl-4
      ">

        {/* Change Photo */}
        <button
          type="button"
          onClick={() => setShowAvatarModal(true)}
          className="
            inline-flex
            items-center
            justify-center
            gap-2.5
            rounded-xl
            bg-indigo-600
            px-5 py-2.5
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-indigo-200
            hover:bg-indigo-700
            hover:-translate-y-0.5
            transition-all
          "
        >
          <Camera className="w-4 h-4" />
          Change Photo
        </button>


        {/* Edit Profile */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`
            inline-flex
            items-center
            justify-center
            gap-2.5
            rounded-xl
            px-5 py-2.5
            text-sm
            font-bold
            transition-all
            border
            ${
              isEditing
                ? `
                  bg-slate-100
                  border-slate-200
                  text-slate-700
                  hover:bg-slate-200
                `
                : `
                  bg-white
                  border-slate-200
                  text-slate-700
                  hover:border-indigo-200
                  hover:text-indigo-600
                  hover:bg-indigo-50
                `
            }
          `}
        >
          {isEditing ? (
            <X className="w-4 h-4" />
          ) : (
            <Edit3 className="w-4 h-4" />
          )}

          {isEditing ? "Cancel Edit" : "Edit Profile"}
        </button>

      </div>

    </div>

  </div>

        </section>

          {/* QUICK OVERVIEW */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                label: 'Paid Leave',
                value: user?.leaveBalance?.paid || 0,
                icon: CalendarDays,
                tone: 'emerald',
              },
              {
                label: 'Sick Leave',
                value: user?.leaveBalance?.sick || 0,
                icon: HeartHandshake,
                tone: 'rose',
              },
              {
                label: 'Total Available',
                value: (user?.leaveBalance?.paid || 0) + (user?.leaveBalance?.sick || 0),
                icon: Sparkles,
                tone: 'indigo',
              },
              {
                label: 'Profile Status',
                value: 'Complete',
                icon: CheckCircle2,
                tone: 'violet',
              },
            ].map((item) => {
              const Icon = item.icon;
              const tones = {
                emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
                rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
                indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
                violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400',
              };
              return (
                <div
                  key={item.label}
                  className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                        {item.value}
                        {typeof item.value === 'number' && (
                          <span className="ml-1 text-xs font-semibold text-slate-400">days</span>
                        )}
                      </p>
                    </div>
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${tones[item.tone]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ABOUT ME */}
          <section id="profile-info" className="space-y-4 scroll-mt-20">
            <div id='about'>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                About Me
              </p>
              <h3 className="text-xl font-black mt-1">Personal Details</h3>
            </div>

            <form onSubmit={handleSave}>
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="px-5 sm:px-7 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Personal Information</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your basic contact details</p>
                  </div>
                </div>

                <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    ['Full Name', 'name', 'text', 'Manish Kumar Sharma'],
                    ['Work Email', 'email', 'email', 'manish@example.com'],
                    ['Phone Number', 'phone', 'text', '+91 98765 43210'],
                  ].map(([label, field, type, placeholder]) => (
                    <div key={field} className={field === 'phone' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</label>
                      <div className="relative">
                        {field === 'email' ? (
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        ) : field === 'phone' ? (
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        ) : (
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        )}
                        <input
                          type={type}
                          disabled={!isEditing || (isAdmin ? false : field !== 'phone')}
                          value={formData[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-65 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WORK DETAILS */}
              <div className="mt-7 space-y-4 scroll-mt-24" id='work-detail'>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                    Work Details
                  </p>
                  <h3 className="text-xl font-black mt-1">Employment Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ['Employee ID', user?.employeeId || 'N/A', BadgeCheck],
                    ['Department', formData.department || 'N/A', Building2],
                    ['Designation', formData.designation || 'N/A', Shield],
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Work</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5">{label}</p>
                      <p className="text-base font-black mt-1 truncate" title={String(value)}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="mt-7 space-y-4 scroll-mt-24" id='contact'>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                    Contact Information
                  </p>
                  <h3 className="text-xl font-black mt-1">Address & Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* ADDRESS */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold">Address</h4>
                        <p className="text-xs text-slate-500">Residential contact details</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Street Address</label>
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={formData.address.street}
                          onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                          placeholder="Street / Flat / Colony"
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-65"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          ['City', 'city', 'Jaipur'],
                          ['State', 'state', 'Rajasthan'],
                          ['ZIP', 'zip', '302001'],
                        ].map(([label, field, placeholder]) => (
                          <div key={field}>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</label>
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={formData.address[field]}
                              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, [field]: e.target.value } })}
                              placeholder={placeholder}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-65"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* EMERGENCY */}
                  <div className="rounded-2xl border border-rose-200/70 dark:border-rose-900/30 bg-gradient-to-br from-white to-rose-50/60 dark:from-slate-900 dark:to-rose-950/10 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold">Emergency Contact</h4>
                        <p className="text-xs text-slate-500">Person to contact in an emergency</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        ['Contact Name', 'name', 'Full Name'],
                        ['Relationship', 'relation', 'e.g. Parent, Spouse'],
                        ['Phone', 'phone', '+91 98765 43210'],
                      ].map(([label, field, placeholder]) => (
                        <div key={field}>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.emergencyContact[field]}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, [field]: e.target.value } })}
                            placeholder={placeholder}
                            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/70 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:opacity-65"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE */}
              {isEditing && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/70 dark:bg-brand-950/20 p-4">
                  <div className="flex items-center gap-2 text-xs text-brand-800 dark:text-brand-300 font-semibold">
                    <Save className="w-4 h-4" />
                    You have unsaved profile changes.
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50">
                      {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </form>
          </section>

          {/* DOCUMENTS */}
          <section id="documents" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                  Documents
                </p>
                <h3 className="text-xl font-black mt-1">Employee Documents</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Keep your official employee documents organized in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocModal(true)}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Attach Document
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {docLoading ? (
                <div className="py-14 flex justify-center items-center gap-2 text-sm text-slate-400">
                  <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  Loading documents...
                </div>
              ) : documents.length === 0 ? (
                <div className="py-14 px-6 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="mt-4 font-bold">No documents yet</h4>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Attach an Aadhaar, resume, certificate, or other official document.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {documents.map((doc) => (
                    <div key={doc._id} className="group p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm truncate">{doc.name}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-semibold">{doc.type}</span>
                            <span>•</span>
                            <span>{doc.fileSize || '1.2 MB'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                          doc.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50'
                            : doc.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50'
                        }`}>
                          {doc.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                          {doc.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                          {doc.status === 'Pending Verification' && <Clock className="w-3 h-3" />}
                          {doc.status}
                        </span>

                        {isAdmin && (
                          <>
                            {doc.status !== 'Verified' && (
                              <button type="button" onClick={() => handleVerifyDocument(doc._id, 'Verified')} title="Verify" className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {doc.status !== 'Rejected' && (
                              <button type="button" onClick={() => handleVerifyDocument(doc._id, 'Rejected')} title="Reject" className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}

                        <button type="button" onClick={() => handleDeleteDocument(doc._id)} title="Delete Document" className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* FOOTER NOTE */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <Shield className="w-3.5 h-3.5" />
            Employee information is protected and available only to authorized users.
          </div>
        </div>

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 my-8 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Profile Picture</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a high-resolution local fictional SVG avatar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {avatarOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAvatar(opt.uri)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 group ${
                    formData.avatar === opt.uri
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 ring-2 ring-brand-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-brand-400'
                  }`}
                >
                  <img
                    src={opt.uri}
                    alt={opt.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOCUMENT MODAL */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attach Dossier Document</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add metadata for employee compliance file</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  placeholder="e.g. Aadhaar_Government_ID.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Document Type *
                </label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="Offer Letter">Offer / Appointment Letter</option>
                  <option value="Government ID">Government ID (Aadhaar / PAN / Passport)</option>
                  <option value="Address Proof">Address Proof / Utility Bill</option>
                  <option value="Educational Certificate">Educational Degree / Certificate</option>
                  <option value="Experience Certificate">Previous Experience / Relieving Letter</option>
                  <option value="Tax Declaration">Tax Declaration / Form 16</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Simulated File Size
                </label>
                <input
                  type="text"
                  value={newDoc.fileSize}
                  onChange={(e) => setNewDoc({ ...newDoc, fileSize: e.target.value })}
                  placeholder="e.g. 1.5 MB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold flex items-center gap-2 shadow-glow"
                >
                  <Check className="w-4 h-4" />
                  Attach to Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </>
  );
};

export default ProfilePage;
