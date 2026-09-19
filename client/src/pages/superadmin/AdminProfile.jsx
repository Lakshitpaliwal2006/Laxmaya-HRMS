// import React, { useEffect, useState } from "react";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   HeartHandshake,
//   Edit3,
//   Save,
//   X,
//   Camera,
//   Shield,
//   Building2,
//   BadgeCheck,
//   CheckCircle2,
//   CalendarDays,
//   FileText,
//   Plus,
//   Trash2,
//   Clock,
//   Users,
//   ClipboardCheck,
//   Settings,
//   BarChart3,
//   UserCog,
//   KeyRound,
//   LockKeyhole,
//   ChevronRight,
// } from "lucide-react";

// import { useAuth } from '../../context/AuthContext';
// import { useToast } from '../../context/ToastContext';
// // import demoAvatars from '../utils/avatars';
// // import api from "../api";

// const AdminProfile = () => {
//   const { user, setUser } = useAuth();
//   const { showToast } = useToast();

//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [documents, setDocuments] = useState([]);
//   const [docLoading, setDocLoading] = useState(false);

//   const [showAvatarModal, setShowAvatarModal] = useState(false);
//   const [showAddDocModal, setShowAddDocModal] = useState(false);

//   // Existing backend-supported fields only
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     avatar: "",
//     department: "",
//     designation: "",
//     role: "",
//     status: "",

//     address: {
//       street: "",
//       city: "",
//       state: "",
//       zip: "",
//     },

//     emergencyContact: {
//       name: "",
//       relation: "",
//       phone: "",
//     },
//   });

//   const [newDoc, setNewDoc] = useState({
//     name: "",
//     type: "",
//     status: "Pending",
//   });

//   /*
//    * --------------------------------------------------
//    * DUMMY SUPER ADMIN DATA
//    * --------------------------------------------------
//    * Backend create hone ke baad in values ko API se
//    * replace kiya ja sakta hai.
//    */

//   const superAdminData = {
//     adminId: "ADM-001",
//     accountCreated: "January 12, 2026",

//     organization: "Dayflow HRMS",

//     accessLevel: "Super Administrator",

//     twoFactor: "Enabled",

//     lastLogin: "Today, 10:32 AM",

//     loginSessions: "Manage Sessions",

//     password: "••••••••",
//   };

//   /*
//    * ATS / Recruitment intentionally removed
//    */

//   const permissions = [
//     {
//       label: "Employee Management",
//       icon: Users,
//     },
//     {
//       label: "Attendance Management",
//       icon: ClipboardCheck,
//     },
//     {
//       label: "Leave Management",
//       icon: CalendarDays,
//     },
//     {
//       label: "Payroll Management",
//       icon: BadgeCheck,
//     },
//     {
//       label: "HRMS Settings",
//       icon: Settings,
//     },
//     {
//       label: "Reports & Analytics",
//       icon: BarChart3,
//     },
//     {
//       label: "User & Role Management",
//       icon: UserCog,
//     },
//   ];

//   /*
//    * Dummy Admin Activity
//    */

//   const adminActivity = [
//     {
//       text: "Updated employee record",
//       time: "10:32 AM",
//       icon: UserCog,
//     },
//     {
//       text: "Approved leave request",
//       time: "09:48 AM",
//       icon: ClipboardCheck,
//     },
//     {
//       text: "Added new employee",
//       time: "Yesterday",
//       icon: Users,
//     },
//     {
//       text: "Changed system settings",
//       time: "Yesterday",
//       icon: Settings,
//     },
//   ];

//   /*
//    * --------------------------------------------------
//    * FETCH DOCUMENTS
//    * --------------------------------------------------
//    */

//   const fetchDocuments = async () => {
//     if (!user?._id && !user?.id) return;

//     try {
//       setDocLoading(true);

//       const response = await api.get(
//         `/users/${user._id || user.id}/documents`
//       );

//       setDocuments(response.data || []);
//     } catch (error) {
//       console.error("Failed to fetch documents:", error);
//     } finally {
//       setDocLoading(false);
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * LOAD USER DATA
//    * --------------------------------------------------
//    */

//   useEffect(() => {
//     if (!user) return;

//     setFormData({
//       name: user.name || "",
//       email: user.email || "",
//       phone: user.phone || "",

//       avatar: user.avatar || "",

//       department: user.department || "",
//       designation: user.designation || "",
//       role: user.role || "",
//       status: user.status || "Active",

//       address: {
//         street: user.address?.street || "",
//         city: user.address?.city || "",
//         state: user.address?.state || "",
//         zip: user.address?.zip || "",
//       },

//       emergencyContact: {
//         name: user.emergencyContact?.name || "",
//         relation: user.emergencyContact?.relation || "",
//         phone: user.emergencyContact?.phone || "",
//       },
//     });

//     fetchDocuments();
//   }, [user?._id, user?.id]);

//   /*
//    * --------------------------------------------------
//    * INPUT CHANGE
//    * --------------------------------------------------
//    */

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];

//       setFormData((prev) => ({
//         ...prev,

//         address: {
//           ...prev.address,
//           [field]: value,
//         },
//       }));

//       return;
//     }

//     if (name.startsWith("emergencyContact.")) {
//       const field = name.split(".")[1];

//       setFormData((prev) => ({
//         ...prev,

//         emergencyContact: {
//           ...prev.emergencyContact,
//           [field]: value,
//         },
//       }));

//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /*
//    * --------------------------------------------------
//    * SAVE PROFILE
//    * --------------------------------------------------
//    */

//   const handleSave = async () => {
//     if (!user?._id && !user?.id) return;

//     try {
//       setLoading(true);

//       const response = await api.put(
//         `/users/${user._id || user.id}`,
//         formData
//       );

//       if (response.data) {
//         setUser(response.data);
//       }

//       showToast?.(
//         "Profile updated successfully",
//         "success"
//       );

//       setIsEditing(false);
//     } catch (error) {
//       console.error("Failed to update profile:", error);

//       showToast?.(
//         error?.response?.data?.message ||
//           "Failed to update profile",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * CHANGE AVATAR
//    * --------------------------------------------------
//    */

//   const handleSelectAvatar = async (avatar) => {
//     if (!user?._id && !user?.id) return;

//     try {
//       await api.put(
//         `/users/${user._id || user.id}`,
//         {
//           avatar,
//         }
//       );

//       setFormData((prev) => ({
//         ...prev,
//         avatar,
//       }));

//       setUser((prev) => ({
//         ...prev,
//         avatar,
//       }));

//       showToast?.(
//         "Profile photo updated successfully",
//         "success"
//       );

//       setShowAvatarModal(false);
//     } catch (error) {
//       console.error(
//         "Failed to update avatar:",
//         error
//       );

//       showToast?.(
//         "Failed to update profile photo",
//         "error"
//       );
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * ADD DOCUMENT
//    * --------------------------------------------------
//    */

//   const handleAddDocument = async (e) => {
//     e.preventDefault();

//     if (!user?._id && !user?.id) return;

//     try {
//       const response = await api.post(
//         `/users/${user._id || user.id}/documents`,
//         newDoc
//       );

//       setDocuments((prev) => [
//         ...prev,
//         response.data,
//       ]);

//       setShowAddDocModal(false);

//       setNewDoc({
//         name: "",
//         type: "",
//         status: "Pending",
//       });

//       showToast?.(
//         "Document added successfully",
//         "success"
//       );
//     } catch (error) {
//       console.error(
//         "Failed to add document:",
//         error
//       );

//       showToast?.(
//         "Failed to add document",
//         "error"
//       );
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * DELETE DOCUMENT
//    * --------------------------------------------------
//    */

//   const handleDeleteDocument = async (
//     documentId
//   ) => {
//     try {
//       await api.delete(
//         `/documents/${documentId}`
//       );

//       setDocuments((prev) =>
//         prev.filter(
//           (document) =>
//             document._id !== documentId
//         )
//       );

//       showToast?.(
//         "Document deleted successfully",
//         "success"
//       );
//     } catch (error) {
//       console.error(
//         "Failed to delete document:",
//         error
//       );

//       showToast?.(
//         "Failed to delete document",
//         "error"
//       );
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * VERIFY DOCUMENT
//    * --------------------------------------------------
//    */

//   const handleVerifyDocument = async (
//     documentId
//   ) => {
//     try {
//       const response = await api.put(
//         `/documents/${documentId}`,
//         {
//           status: "Verified",
//         }
//       );

//       setDocuments((prev) =>
//         prev.map((document) =>
//           document._id === documentId
//             ? response.data
//             : document
//         )
//       );

//       showToast?.(
//         "Document verified successfully",
//         "success"
//       );
//     } catch (error) {
//       console.error(
//         "Failed to verify document:",
//         error
//       );

//       showToast?.(
//         "Failed to verify document",
//         "error"
//       );
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * SMOOTH NAVIGATION
//    * --------------------------------------------------
//    */

//   const scrollToSection = (id) => {
//     document
//       .getElementById(id)
//       ?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//   };

//   /*
//    * --------------------------------------------------
//    * DISPLAY VALUES
//    * --------------------------------------------------
//    */

//   const displayName =
//     user?.name ||
//     formData.name ||
//     "Manish Kumar Sharma";

//   const displayEmail =
//     user?.email ||
//     formData.email ||
//     "admin@dayflowhrms.com";

//   const displayPhone =
//     user?.phone ||
//     formData.phone ||
//     "+91 98765 43210";

//   const displayAvatar =
//     formData.avatar ||
//     user?.avatar ||
//     demoAvatars?.[0] ||
//     "https://i.pravatar.cc/300?img=12";

//   const displayStatus =
//     user?.status ||
//     formData.status ||
//     "Active";

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-800">

//       {/* =================================================
//           NAVIGATION
//       ================================================= */}

//       <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

//         <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">

//           {[
//             ["profile", "Profile"],
//             ["about", "About"],
//             ["administration", "Administration"],
//             ["security", "Security"],
//             ["documents", "Documents"],
//           ].map(([id, label]) => (
//             <button
//               key={id}
//               type="button"
//               onClick={() =>
//                 scrollToSection(id)
//               }
//               className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
//             >
//               {label}
//             </button>
//           ))}

//         </div>

//       </div>

//       <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">

//         {/* =================================================
//             PAGE HEADER
//         ================================================= */}

//         <div
//           id="profile"
//           className="mb-8 scroll-mt-24"
//         >

//           <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
//             Profile
//           </p>

//           <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//             Super Admin Profile
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             View and manage your administrative
//             profile and system access.
//           </p>

//         </div>

//         {/* =================================================
//             HERO
//         ================================================= */}

//         <section className="scroll-mt-24">

//           <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

//             {/* PROFILE IMAGE */}

//             <div className="flex shrink-0 justify-center lg:w-48">

//               <div className="relative">

//                 <div className="h-32 w-32 overflow-hidden rounded-full border-[6px] border-white bg-slate-100 shadow-lg sm:h-36 sm:w-36">

//                   <img
//                     src={displayAvatar}
//                     alt={displayName}
//                     className="h-full w-full object-cover"
//                   />

//                 </div>

//                 <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />

//               </div>

//             </div>

//             {/* HERO CONTENT */}

//             <div className="min-w-0 flex-1">

//               <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">

//                 <p className="text-sm font-medium text-slate-500">
//                   Hello,
//                 </p>

//                 <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                   {displayName}
//                 </h2>

//                 <p className="mt-1 text-base font-semibold text-slate-700">
//                   Super Administrator
//                 </p>

//                 <p className="mt-1 text-sm text-slate-500">
//                   System Administration • Super Admin
//                 </p>

//                 {/* STATUS */}

//                 <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

//                   <span className="h-2 w-2 rounded-full bg-emerald-500" />

//                   {displayStatus}

//                 </div>

//                 {/* ADMIN INFO */}

//                 <div className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">

//                   <div>

//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                       Admin ID
//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-800">
//                       {superAdminData.adminId}
//                     </p>

//                   </div>

//                   <div>

//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                       Account Created
//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-800">
//                       {superAdminData.accountCreated}
//                     </p>

//                   </div>

//                 </div>

//                 <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
//                   Full system access and
//                   administrative control over
//                   the HRMS platform.
//                 </p>

//               </div>

//               {/* BUTTONS */}

//               <div className="mt-4 flex flex-wrap gap-3">

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setShowAvatarModal(true)
//                   }
//                   className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
//                 >
//                   <Camera size={17} />
//                   Change Photo
//                 </button>

//                 {!isEditing ? (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setIsEditing(true)
//                     }
//                     className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
//                   >
//                     <Edit3 size={17} />
//                     Edit Profile
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={handleSave}
//                       disabled={loading}
//                       className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
//                     >
//                       <Save size={17} />

//                       {loading
//                         ? "Saving..."
//                         : "Save Changes"}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         setIsEditing(false)
//                       }
//                       className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       <X size={17} />
//                       Cancel
//                     </button>
//                   </>
//                 )}

//               </div>

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             ABOUT
//         ================================================= */}

//         <section
//           id="about"
//           className="mt-12 scroll-mt-24"
//         >

//           <SectionHeading
//             eyebrow="ABOUT"
//             title="Personal Information"
//             icon={User}
//           />

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <div className="grid gap-6 md:grid-cols-3">

//               <InfoField
//                 icon={User}
//                 label="Full Name"
//                 value={displayName}
//                 editing={isEditing}
//                 name="name"
//                 inputValue={formData.name}
//                 onChange={handleInputChange}
//               />

//               <InfoField
//                 icon={Mail}
//                 label="Work Email"
//                 value={displayEmail}
//                 editing={isEditing}
//                 name="email"
//                 inputValue={formData.email}
//                 onChange={handleInputChange}
//               />

//               <InfoField
//                 icon={Phone}
//                 label="Phone Number"
//                 value={displayPhone}
//                 editing={isEditing}
//                 name="phone"
//                 inputValue={formData.phone}
//                 onChange={handleInputChange}
//               />

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             ADMINISTRATION
//         ================================================= */}

//         <section
//           id="administration"
//           className="mt-12 scroll-mt-24"
//         >

//           <SectionHeading
//             eyebrow="ADMINISTRATION"
//             title="Administration Details"
//             icon={Shield}
//           />

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <div className="grid gap-6 md:grid-cols-3">

//               <InfoField
//                 icon={Shield}
//                 label="Admin ID"
//                 value={superAdminData.adminId}
//               />

//               <InfoField
//                 icon={BadgeCheck}
//                 label="Role / Access Level"
//                 value={superAdminData.accessLevel}
//               />

//               <InfoField
//                 icon={CheckCircle2}
//                 label="Account Status"
//                 value={displayStatus}
//                 valueClass="text-emerald-600"
//               />

//               <InfoField
//                 icon={Building2}
//                 label="Organization"
//                 value={superAdminData.organization}
//               />

//               <InfoField
//                 icon={Building2}
//                 label="Department"
//                 value="Administration"
//               />

//               <InfoField
//                 icon={UserCog}
//                 label="Designation"
//                 value="System Administrator"
//               />

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             CONTACT
//         ================================================= */}

//         <section
//           id="contact"
//           className="mt-12 scroll-mt-24"
//         >

//           <SectionHeading
//             eyebrow="CONTACT INFORMATION"
//             title="Contact & Emergency Details"
//             icon={MapPin}
//           />

//           <div className="grid gap-6 lg:grid-cols-2">

//             {/* ADDRESS */}

//             <ContactCard
//               title="Address"
//               icon={MapPin}
//               fields={[
//                 [
//                   "Street",
//                   formData.address.street,
//                   "address.street",
//                 ],
//                 [
//                   "City",
//                   formData.address.city,
//                   "address.city",
//                 ],
//                 [
//                   "State",
//                   formData.address.state,
//                   "address.state",
//                 ],
//                 [
//                   "ZIP",
//                   formData.address.zip,
//                   "address.zip",
//                 ],
//               ]}
//               editing={isEditing}
//               onChange={handleInputChange}
//             />

//             {/* EMERGENCY */}

//             <ContactCard
//               title="Emergency Contact"
//               icon={HeartHandshake}
//               fields={[
//                 [
//                   "Name",
//                   formData.emergencyContact.name,
//                   "emergencyContact.name",
//                 ],
//                 [
//                   "Relationship",
//                   formData.emergencyContact.relation,
//                   "emergencyContact.relation",
//                 ],
//                 [
//                   "Phone",
//                   formData.emergencyContact.phone,
//                   "emergencyContact.phone",
//                 ],
//               ]}
//               editing={isEditing}
//               onChange={handleInputChange}
//             />

//           </div>

//         </section>

//         {/* =================================================
//             SYSTEM ACCESS
//         ================================================= */}

//         <section className="mt-12">

//           <SectionHeading
//             eyebrow="SYSTEM ACCESS & PERMISSIONS"
//             title="Administrative Permissions"
//             icon={Shield}
//           />

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <div className="grid gap-3 sm:grid-cols-2">

//               {permissions.map(
//                 ({ label, icon: Icon }) => (
//                   <div
//                     key={label}
//                     className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                   >

//                     <div className="flex items-center gap-3">

//                       <div className="rounded-lg bg-white p-2 shadow-sm">

//                         <Icon
//                           size={17}
//                           className="text-slate-600"
//                         />

//                       </div>

//                       <span className="text-sm font-medium text-slate-700">
//                         {label}
//                       </span>

//                     </div>

//                     <CheckCircle2
//                       size={18}
//                       className="text-emerald-500"
//                     />

//                   </div>
//                 )
//               )}

//             </div>

//             <div className="mt-5 flex items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">

//               <span className="text-sm font-bold text-emerald-700">
//                 Full System Access
//               </span>

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             SECURITY
//         ================================================= */}

//         <section
//           id="security"
//           className="mt-12 scroll-mt-24"
//         >

//           <SectionHeading
//             eyebrow="SECURITY"
//             title="Account Security"
//             icon={LockKeyhole}
//           />

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <div className="grid gap-6 md:grid-cols-2">

//               <SecurityField
//                 icon={KeyRound}
//                 label="Password"
//                 value={superAdminData.password}
//               />

//               <SecurityField
//                 icon={Shield}
//                 label="Two-Factor Authentication"
//                 value={superAdminData.twoFactor}
//                 success
//               />

//               <SecurityField
//                 icon={Clock}
//                 label="Last Login"
//                 value={superAdminData.lastLogin}
//               />

//               <SecurityField
//                 icon={Users}
//                 label="Login Sessions"
//                 value={superAdminData.loginSessions}
//                 action
//               />

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             DOCUMENTS
//         ================================================= */}

//         <section
//           id="documents"
//           className="mt-12 scroll-mt-24"
//         >

//           <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

//             <SectionHeading
//               eyebrow="ADMIN DOCUMENTS"
//               title="Documents"
//               icon={FileText}
//               noMargin
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowAddDocModal(true)
//               }
//               className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
//             >
//               <Plus size={17} />
//               Add Document
//             </button>

//           </div>

//           <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             {docLoading ? (
//               <div className="py-10 text-center text-sm text-slate-500">
//                 Loading documents...
//               </div>
//             ) : documents.length === 0 ? (

//               /*
//                * Dummy documents because Super Admin backend
//                * is not created yet.
//                */

//               <div className="grid gap-4 md:grid-cols-3">

//                 <DummyDocument
//                   title="Government ID"
//                 />

//                 <DummyDocument
//                   title="Appointment Letter"
//                 />

//                 <DummyDocument
//                   title="Authorization Document"
//                 />

//               </div>

//             ) : (

//               <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

//                 {documents.map((doc) => (
//                   <DocumentCard
//                     key={doc._id}
//                     document={doc}
//                     onDelete={
//                       handleDeleteDocument
//                     }
//                     onVerify={
//                       handleVerifyDocument
//                     }
//                   />
//                 ))}

//               </div>

//             )}

//           </div>

//         </section>

//         {/* =================================================
//             RECENT ADMIN ACTIVITY
//         ================================================= */}

//         <section className="mt-12">

//           <SectionHeading
//             eyebrow="RECENT ADMIN ACTIVITY"
//             title="Administrative Activity"
//             icon={Clock}
//           />

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//             <div className="space-y-1">

//               {adminActivity.map(
//                 (
//                   {
//                     text,
//                     time,
//                     icon: Icon,
//                   },
//                   index
//                 ) => (

//                   <div
//                     key={`${text}-${index}`}
//                     className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-slate-50"
//                   >

//                     <div className="flex min-w-0 items-center gap-3">

//                       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">

//                         <Icon
//                           size={17}
//                           className="text-slate-600"
//                         />

//                       </div>

//                       <span className="truncate text-sm font-medium text-slate-700">
//                         {text}
//                       </span>

//                     </div>

//                     <span className="shrink-0 text-xs font-medium text-slate-400">
//                       {time}
//                     </span>

//                   </div>

//                 )
//               )}

//             </div>

//           </div>

//         </section>

//         {/* =================================================
//             INFO NOTE
//         ================================================= */}

//         <div className="mt-10 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">

//           <Shield
//             size={18}
//             className="mt-0.5 shrink-0 text-slate-500"
//           />

//           <p>
//             Super Admin security and activity
//             information is currently displayed
//             using dummy data. These values can be
//             connected to the Super Admin backend
//             when the backend is implemented.
//           </p>

//         </div>

//       </main>

//       {/* =================================================
//           AVATAR MODAL
//       ================================================= */}

//       {showAvatarModal && (

//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

//           <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

//             <div className="flex items-center justify-between">

//               <div>

//                 <h3 className="text-lg font-bold text-slate-900">
//                   Choose Profile Photo
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Select a profile avatar.
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowAvatarModal(false)
//                 }
//                 className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//               >
//                 <X size={19} />
//               </button>

//             </div>

//             <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">

//               {demoAvatars?.map(
//                 (avatar, index) => (

//                   <button
//                     key={`${avatar}-${index}`}
//                     type="button"
//                     onClick={() =>
//                       handleSelectAvatar(
//                         avatar
//                       )
//                     }
//                     className="group relative overflow-hidden rounded-full border-2 border-transparent transition hover:border-slate-900"
//                   >

//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="aspect-square w-full object-cover"
//                     />

//                     {displayAvatar === avatar && (
//                       <span className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
//                         <CheckCircle2
//                           className="text-white"
//                           size={24}
//                         />
//                       </span>
//                     )}

//                   </button>

//                 )
//               )}

//             </div>

//           </div>

//         </div>

//       )}

//       {/* =================================================
//           ADD DOCUMENT MODAL
//       ================================================= */}

//       {showAddDocModal && (

//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

//           <form
//             onSubmit={handleAddDocument}
//             className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
//           >

//             <div className="flex items-center justify-between">

//               <div>

//                 <h3 className="text-lg font-bold text-slate-900">
//                   Add Document
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Add an administrative document.
//                 </p>

//               </div>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowAddDocModal(false)
//                 }
//                 className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//               >
//                 <X size={19} />
//               </button>

//             </div>

//             <div className="mt-6 space-y-4">

//               <Input
//                 label="Document Name"
//                 value={newDoc.name}
//                 onChange={(e) =>
//                   setNewDoc((prev) => ({
//                     ...prev,
//                     name: e.target.value,
//                   }))
//                 }
//                 placeholder="e.g. Government ID"
//                 required
//               />

//               <Input
//                 label="Document Type"
//                 value={newDoc.type}
//                 onChange={(e) =>
//                   setNewDoc((prev) => ({
//                     ...prev,
//                     type: e.target.value,
//                   }))
//                 }
//                 placeholder="e.g. Identity"
//                 required
//               />

//             </div>

//             <div className="mt-6 flex justify-end gap-3">

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowAddDocModal(false)
//                 }
//                 className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
//               >
//                 Add Document
//               </button>

//             </div>

//           </form>

//         </div>

//       )}

//     </div>
//   );
// };

// /* =====================================================
//    SECTION HEADING
// ===================================================== */

// const SectionHeading = ({
//   eyebrow,
//   title,
//   icon: Icon,
//   noMargin = false,
// }) => (
//   <div className={noMargin ? "" : "mb-5"}>

//     <div className="flex items-center gap-2">

//       <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">

//         <Icon
//           size={16}
//           className="text-slate-600"
//         />

//       </span>

//       <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//         {eyebrow}
//       </p>

//     </div>

//     <h2 className="mt-2 text-xl font-bold text-slate-900">
//       {title}
//     </h2>

//   </div>
// );

// /* =====================================================
//    INFO FIELD
// ===================================================== */

// const InfoField = ({
//   icon: Icon,
//   label,
//   value,
//   editing = false,
//   name,
//   inputValue,
//   onChange,
//   valueClass = "text-slate-800",
// }) => (
//   <div>

//     <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">

//       <Icon size={14} />

//       {label}

//     </div>

//     {editing && name ? (

//       <input
//         type="text"
//         name={name}
//         value={inputValue || ""}
//         onChange={onChange}
//         className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
//       />

//     ) : (

//       <p
//         className={`text-sm font-semibold ${valueClass}`}
//       >
//         {value || "Not provided"}
//       </p>

//     )}

//   </div>
// );

// /* =====================================================
//    CONTACT CARD
// ===================================================== */

// const ContactCard = ({
//   title,
//   icon: Icon,
//   fields,
//   editing,
//   onChange,
// }) => (
//   <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

//     <div className="mb-5 flex items-center gap-3">

//       <div className="rounded-xl bg-slate-100 p-2.5">

//         <Icon
//           size={18}
//           className="text-slate-600"
//         />

//       </div>

//       <h3 className="font-bold text-slate-900">
//         {title}
//       </h3>

//     </div>

//     <div className="grid gap-5 sm:grid-cols-2">

//       {fields.map(
//         ([label, value, name]) => (

//           <div key={label}>

//             <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
//               {label}
//             </p>

//             {editing ? (

//               <input
//                 type="text"
//                 name={name}
//                 value={value || ""}
//                 onChange={onChange}
//                 className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
//               />

//             ) : (

//               <p className="text-sm font-semibold text-slate-700">
//                 {value || "Not provided"}
//               </p>

//             )}

//           </div>

//         )
//       )}

//     </div>

//   </div>
// );

// /* =====================================================
//    SECURITY FIELD
// ===================================================== */

// const SecurityField = ({
//   icon: Icon,
//   label,
//   value,
//   success = false,
//   action = false,
// }) => (
//   <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">

//     <div className="rounded-xl bg-white p-3 shadow-sm">

//       <Icon
//         size={18}
//         className="text-slate-600"
//       />

//     </div>

//     <div className="min-w-0">

//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//         {label}
//       </p>

//       <p
//         className={`mt-1 text-sm font-semibold ${
//           success
//             ? "text-emerald-600"
//             : "text-slate-800"
//         }`}
//       >
//         {value}

//         {action && (
//           <ChevronRight
//             size={15}
//             className="ml-1 inline-block text-slate-400"
//           />
//         )}

//       </p>

//     </div>

//   </div>
// );

// /* =====================================================
//    DUMMY DOCUMENT
// ===================================================== */

// const DummyDocument = ({ title }) => (
//   <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

//     <div className="flex items-start justify-between gap-3">

//       <div className="flex items-center gap-3">

//         <div className="rounded-lg bg-white p-2.5 shadow-sm">

//           <FileText
//             size={18}
//             className="text-slate-600"
//           />

//         </div>

//         <div>

//           <p className="text-sm font-semibold text-slate-800">
//             {title}
//           </p>

//           <p className="mt-1 text-xs text-slate-400">
//             Admin document
//           </p>

//         </div>

//       </div>

//       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">

//         <CheckCircle2 size={12} />

//         Verified

//       </span>

//     </div>

//   </div>
// );

// /* =====================================================
//    REAL DOCUMENT CARD
// ===================================================== */

// const DocumentCard = ({
//   document,
//   onDelete,
//   onVerify,
// }) => {

//   const isVerified =
//     document.status === "Verified";

//   return (
//     <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

//       <div className="flex items-start justify-between gap-3">

//         <div className="flex min-w-0 items-center gap-3">

//           <div className="rounded-lg bg-white p-2.5 shadow-sm">

//             <FileText
//               size={18}
//               className="text-slate-600"
//             />

//           </div>

//           <div className="min-w-0">

//             <p className="truncate text-sm font-semibold text-slate-800">
//               {document.name}
//             </p>

//             <p className="mt-1 text-xs text-slate-400">
//               {document.type || "Document"}
//             </p>

//           </div>

//         </div>

//         {isVerified ? (

//           <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">

//             <CheckCircle2 size={12} />

//             Verified

//           </span>

//         ) : (

//           <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">

//             <Clock size={12} />

//             Pending

//           </span>

//         )}

//       </div>

//       <div className="mt-4 flex gap-2">

//         {!isVerified && (

//           <button
//             type="button"
//             onClick={() =>
//               onVerify(document._id)
//             }
//             className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
//           >
//             Verify
//           </button>

//         )}

//         <button
//           type="button"
//           onClick={() =>
//             onDelete(document._id)
//           }
//           className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
//         >

//           <Trash2 size={13} />

//           Delete

//         </button>

//       </div>

//     </div>
//   );
// };

// /* =====================================================
//    INPUT
// ===================================================== */

// const Input = ({
//   label,
//   ...props
// }) => (
//   <div>

//     <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
//       {label}
//     </label>

//     <input
//       {...props}
//       className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
//     />

//   </div>
// );

// export default AdminProfile;













import React, { useEffect, useState } from "react";
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
  BadgeCheck,
  CheckCircle2,
  CalendarDays,
  FileText,
  Plus,
  Trash2,
  Clock,
  Users,
  ClipboardCheck,
  Settings,
  BarChart3,
  UserCog,
  KeyRound,
  LockKeyhole,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
// import demoAvatars from '../utils/avatars';
// import api from "../api";

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    department: "",
    designation: "",
    role: "",
    status: "",
    address: { street: "", city: "", state: "", zip: "" },
    emergencyContact: { name: "", relation: "", phone: "" },
  });

  const [newDoc, setNewDoc] = useState({
    name: "",
    type: "",
    status: "Pending",
  });

  const superAdminData = {
    adminId: "ADM-001",
    accountCreated: "January 12, 2026",
    organization: "Dayflow HRMS",
    accessLevel: "Super Administrator",
    twoFactor: "Enabled",
    lastLogin: "Today, 10:32 AM",
    loginSessions: "Manage Sessions",
    password: "••••••••",
  };

  const permissions = [
    { label: "Employee Management", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Attendance Management", icon: ClipboardCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Leave Management", icon: CalendarDays, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Payroll Management", icon: BadgeCheck, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { label: "HRMS Settings", icon: Settings, color: "text-slate-600 bg-slate-100 border-slate-200" },
    { label: "Reports & Analytics", icon: BarChart3, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "User & Role Management", icon: UserCog, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  const adminActivity = [
    { text: "Updated employee record", time: "10:32 AM", icon: UserCog, iconColor: "text-indigo-600 bg-indigo-50" },
    { text: "Approved leave request", time: "09:48 AM", icon: ClipboardCheck, iconColor: "text-emerald-600 bg-emerald-50" },
    { text: "Added new employee", time: "Yesterday", icon: Users, iconColor: "text-blue-600 bg-blue-50" },
    { text: "Changed system settings", time: "Yesterday", icon: Settings, iconColor: "text-slate-600 bg-slate-100" },
  ];

  const fetchDocuments = async () => {
    if (!user?._id && !user?.id) return;
    try {
      setDocLoading(true);
      const response = await api.get(`/users/${user._id || user.id}/documents`);
      setDocuments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setDocLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      department: user.department || "",
      designation: user.designation || "",
      role: user.role || "",
      status: user.status || "Active",
      address: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || "",
      },
      emergencyContact: {
        name: user.emergencyContact?.name || "",
        relation: user.emergencyContact?.relation || "",
        phone: user.emergencyContact?.phone || "",
      },
    });
    fetchDocuments();
  }, [user?._id, user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
      return;
    }
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value },
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?._id && !user?.id) return;
    try {
      setLoading(true);
      const response = await api.put(`/users/${user._id || user.id}`, formData);
      if (response.data) setUser(response.data);
      showToast?.("Profile updated successfully", "success");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast?.(error?.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = async (avatar) => {
    if (!user?._id && !user?.id) return;
    try {
      await api.put(`/users/${user._id || user.id}`, { avatar });
      setFormData((prev) => ({ ...prev, avatar }));
      setUser((prev) => ({ ...prev, avatar }));
      showToast?.("Profile photo updated successfully", "success");
      setShowAvatarModal(false);
    } catch (error) {
      showToast?.("Failed to update profile photo", "error");
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!user?._id && !user?.id) return;
    try {
      const response = await api.post(`/users/${user._id || user.id}/documents`, newDoc);
      setDocuments((prev) => [...prev, response.data]);
      setShowAddDocModal(false);
      setNewDoc({ name: "", type: "", status: "Pending" });
      showToast?.("Document added successfully", "success");
    } catch (error) {
      showToast?.("Failed to add document", "error");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      showToast?.("Document deleted successfully", "success");
    } catch (error) {
      showToast?.("Failed to delete document", "error");
    }
  };

  const handleVerifyDocument = async (documentId) => {
    try {
      const response = await api.put(`/documents/${documentId}`, { status: "Verified" });
      setDocuments((prev) => prev.map((doc) => (doc._id === documentId ? response.data : doc)));
      showToast?.("Document verified successfully", "success");
    } catch (error) {
      showToast?.("Failed to verify document", "error");
    }
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const displayName = user?.name || formData.name || "Manish Kumar Sharma";
  const displayEmail = user?.email || formData.email || "admin@dayflowhrms.com";
  const displayPhone = user?.phone || formData.phone || "+91 98765 43210";
  const displayAvatar = formData.avatar || user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";
  const displayStatus = user?.status || formData.status || "Active";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* ================= NAVIGATION WITH ACTIVE UNDERLINE ================= */}
      <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {[
            ["profile", "Profile Overview"],
            ["about", "Personal Info"],
            ["administration", "Administration"],
            ["contact", "Contact & Address"],
            ["security", "Security"],
            ["documents", "Documents"],
          ].map(([id, label]) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToSection(id)}
                className={`relative py-4 text-sm font-semibold tracking-tight transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.4)] transition-all" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {/* ================= PAGE HEADER ================= */}
        <div id="profile" className="mb-8 scroll-mt-24">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase">
            <ShieldCheck size={14} /> Master Portal
          </div>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-slate-900 sm:text-4xl">
            Super Administrator Profile
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Control platform configurations, manage system security and view personal credentials.
          </p>
        </div>

        {/* ================= HERO PROFILE ================= */}
        <section className="scroll-mt-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* AVATAR BOX */}
            <div className="flex shrink-0 justify-center lg:w-48">
              <div className="relative group">
                <div className="h-32 w-32 sm:h-36 sm:w-36 overflow-hidden rounded-full ring-4 ring-white shadow-xl bg-slate-100 transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-[3px] border-white bg-emerald-500 shadow" />
              </div>
            </div>

            {/* HERO INFO CARD */}
            <div className="min-w-0 flex-1">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      {displayName}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-blue-600 flex items-center gap-1.5">
                      <Award size={16} /> Super Administrator • Dayflow Central
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {displayStatus}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Admin ID</p>
                    <p className="mt-1 text-sm font-bold text-slate-800 font-mono">{superAdminData.adminId}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">Executive HQ</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Member Since</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{superAdminData.accountCreated}</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <Camera size={16} className="text-blue-600" />
                  Change Avatar
                </button>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <Edit3 size={16} className="text-amber-400" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60 shadow-sm"
                    >
                      <Save size={16} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <X size={16} className="text-rose-500" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT / PERSONAL ================= */}
        <section id="about" className="mt-12 scroll-mt-24">
          <SectionHeading
            eyebrow="PERSONAL INFORMATION"
            title="Account Holder Details"
            icon={User}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-3">
              <InfoField
                icon={User}
                iconColor="text-indigo-500"
                label="Full Name"
                value={displayName}
                editing={isEditing}
                name="name"
                inputValue={formData.name}
                onChange={handleInputChange}
              />
              <InfoField
                icon={Mail}
                iconColor="text-blue-500"
                label="Work Email"
                value={displayEmail}
                editing={isEditing}
                name="email"
                inputValue={formData.email}
                onChange={handleInputChange}
              />
              <InfoField
                icon={Phone}
                iconColor="text-emerald-500"
                label="Phone Number"
                value={displayPhone}
                editing={isEditing}
                name="phone"
                inputValue={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* ================= ADMINISTRATION DETAILS ================= */}
        <section id="administration" className="mt-12 scroll-mt-24">
          <SectionHeading
            eyebrow="SYSTEM ROLES"
            title="Administration Details"
            icon={Shield}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-3">
              <InfoField icon={Shield} iconColor="text-blue-500" label="Admin ID" value={superAdminData.adminId} />
              <InfoField icon={BadgeCheck} iconColor="text-violet-500" label="Access Role" value={superAdminData.accessLevel} />
              <InfoField icon={CheckCircle2} iconColor="text-emerald-500" label="Account State" value={displayStatus} valueClass="text-emerald-600 font-bold" />
              <InfoField icon={Building2} iconColor="text-amber-500" label="Organization" value={superAdminData.organization} />
              <InfoField icon={Building2} iconColor="text-cyan-500" label="Department" value="Administration HQ" />
              <InfoField icon={UserCog} iconColor="text-rose-500" label="Designation" value="Chief System Admin" />
            </div>
          </div>
        </section>

        {/* ================= CONTACT & EMERGENCY ================= */}
        <section id="contact" className="mt-12 scroll-mt-24">
          <SectionHeading
            eyebrow="LOCATION & EMERGENCY"
            title="Contact & Emergency Details"
            icon={MapPin}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <ContactCard
              title="Official Residential Address"
              icon={MapPin}
              iconColor="text-rose-500"
              iconBg="bg-rose-50"
              fields={[
                ["Street", formData.address.street, "address.street"],
                ["City", formData.address.city, "address.city"],
                ["State", formData.address.state, "address.state"],
                ["ZIP Code", formData.address.zip, "address.zip"],
              ]}
              editing={isEditing}
              onChange={handleInputChange}
            />
            <ContactCard
              title="Emergency SOS Contact"
              icon={HeartHandshake}
              iconColor="text-pink-500"
              iconBg="bg-pink-50"
              fields={[
                ["Contact Name", formData.emergencyContact.name, "emergencyContact.name"],
                ["Relationship", formData.emergencyContact.relation, "emergencyContact.relation"],
                ["SOS Phone", formData.emergencyContact.phone, "emergencyContact.phone"],
              ]}
              editing={isEditing}
              onChange={handleInputChange}
            />
          </div>
        </section>

        {/* ================= SYSTEM ACCESS & PERMISSIONS ================= */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="ACCESS CONTROL"
            title="Administrative Permissions"
            icon={ShieldCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {permissions.map(({ label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-2.5 border shadow-2xs ${color}`}>
                      <Icon size={17} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 tracking-tight">
                      {label}
                    </span>
                  </div>
                  <CheckCircle2 size={18} className="text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50/70 px-4 py-3">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 tracking-wide uppercase flex items-center gap-2">
                <CheckCircle2 size={16} /> All Granular Permissions Granted (Full Root Access)
              </span>
            </div>
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section id="security" className="mt-12 scroll-mt-24">
          <SectionHeading
            eyebrow="SECURITY PROTOCOLS"
            title="Account Security & Access"
            icon={LockKeyhole}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <SecurityField
                icon={KeyRound}
                iconColor="text-indigo-600"
                iconBg="bg-indigo-50"
                label="Master Password"
                value={superAdminData.password}
              />
              <SecurityField
                icon={ShieldCheck}
                iconColor="text-emerald-600"
                iconBg="bg-emerald-50"
                label="Two-Factor Authentication"
                value={superAdminData.twoFactor}
                success
              />
              <SecurityField
                icon={Clock}
                iconColor="text-blue-600"
                iconBg="bg-blue-50"
                label="Last Session Recorded"
                value={superAdminData.lastLogin}
              />
              <SecurityField
                icon={Users}
                iconColor="text-purple-600"
                iconBg="bg-purple-50"
                label="Active Login Sessions"
                value={superAdminData.loginSessions}
                action
              />
            </div>
          </div>
        </section>

        {/* ================= DOCUMENTS ================= */}
        <section id="documents" className="mt-12 scroll-mt-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="DOCUMENT VAULT"
              title="Verified Identification Documents"
              icon={FileText}
              iconBg="bg-cyan-50"
              iconColor="text-cyan-600"
              noMargin
            />
            <button
              type="button"
              onClick={() => setShowAddDocModal(true)}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
            >
              <Plus size={16} className="text-emerald-400" />
              Add Document
            </button>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            {docLoading ? (
              <div className="py-12 text-center text-sm font-medium text-slate-400">Loading vault documents...</div>
            ) : documents.length === 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                <DummyDocument title="Central Government ID" />
                <DummyDocument title="Board Appointment Letter" />
                <DummyDocument title="Root Authorization Token" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc._id}
                    document={doc}
                    onDelete={handleDeleteDocument}
                    onVerify={handleVerifyDocument}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}
        <section className="mt-12">
          <SectionHeading
            eyebrow="AUDIT TRAIL"
            title="Recent Activity Logs"
            icon={Clock}
            iconBg="bg-violet-50"
            iconColor="text-violet-600"
          />
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="divide-y divide-slate-100">
              {adminActivity.map(({ text, time, icon: Icon, iconColor }, index) => (
                <div
                  key={`${text}-${index}`}
                  className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <span className="truncate text-sm font-semibold text-slate-800">
                      {text}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-slate-400 font-mono">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= MODALS ================= */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Choose Profile Photo</h3>
                <p className="text-xs text-slate-500 mt-0.5">Select a pre-approved avatar</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddDocument}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Document</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upload verified record to the vault</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                label="Document Title"
                value={newDoc.name}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Identity Proof"
                required
              />
              <Input
                label="Category / Classification"
                value={newDoc.type}
                onChange={(e) => setNewDoc((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="e.g. KYC & Authorization"
                required
              />
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddDocModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Confirm & Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const SectionHeading = ({ eyebrow, title, icon: Icon, iconBg, iconColor, noMargin = false }) => (
  <div className={noMargin ? "" : "mb-5"}>
    <div className="flex items-center gap-2">
      <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={16} />
      </span>
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {eyebrow}
      </p>
    </div>
    <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
      {title}
    </h2>
  </div>
);

const InfoField = ({ icon: Icon, iconColor, label, value, editing = false, name, inputValue, onChange, valueClass = "text-slate-900" }) => (
  <div>
    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
      <Icon size={14} className={iconColor} />
      {label}
    </div>
    {editing && name ? (
      <input
        type="text"
        name={name}
        value={inputValue || ""}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    ) : (
      <p className={`text-sm font-semibold tracking-tight ${valueClass}`}>
        {value || "Not provided"}
      </p>
    )}
  </div>
);

const ContactCard = ({ title, icon: Icon, iconColor, iconBg, fields, editing, onChange }) => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <div className={`rounded-xl p-2.5 ${iconBg} ${iconColor}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([label, value, name]) => (
        <div key={label}>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          {editing ? (
            <input
              type="text"
              name={name}
              value={value || ""}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ) : (
            <p className="text-sm font-semibold text-slate-800">{value || "Not provided"}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const SecurityField = ({ icon: Icon, iconColor, iconBg, label, value, success = false, action = false }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
    <div className={`rounded-xl p-2.5 shadow-2xs ${iconBg} ${iconColor}`}>
      <Icon size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-0.5 text-sm font-bold tracking-tight ${success ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
        {action && <ChevronRight size={15} className="ml-1 inline-block text-slate-400" />}
      </p>
    </div>
  </div>
);

const DummyDocument = ({ title }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          <FileText size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-[11px] font-medium text-slate-400">System Certified Record</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
        <CheckCircle2 size={12} /> Verified
      </span>
    </div>
  </div>
);

const DocumentCard = ({ document, onDelete, onVerify }) => {
  const isVerified = document.status === "Verified";
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{document.name}</p>
            <p className="text-[11px] font-medium text-slate-400">{document.type || "Document"}</p>
          </div>
        </div>
        {isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            <CheckCircle2 size={12} /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
            <Clock size={12} /> Pending
          </span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        {!isVerified && (
          <button
            type="button"
            onClick={() => onVerify(document._id)}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
          >
            Verify
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(document._id)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

export default AdminProfile;