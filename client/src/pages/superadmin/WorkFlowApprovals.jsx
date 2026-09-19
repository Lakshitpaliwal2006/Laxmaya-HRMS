import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Check, 
  X, 
  FileText, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Briefcase
} from 'lucide-react';

// Practical HRMS Dummy Data
const dummyApprovalsData = [
  {
    id: 'REQ-101',
    name: 'Rahul Sharma',
    empId: 'EMP-1042',
    department: 'Engineering',
    type: 'Sick Leave',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    duration: '18 Sep - 19 Sep (2 Days)',
    reason: 'Suffering from high fever and doctor advised 2 days bed rest.',
    status: 'Pending',
    doc: { name: 'Medical_Prescription.pdf', type: 'pdf' },
  },
  {
    id: 'REQ-102',
    name: 'Priya Verma',
    empId: 'EMP-0921',
    department: 'Design UI/UX',
    type: 'Attendance',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    duration: '15 Sep (Missed Punch)',
    reason: 'Biometric fingerprint scanner glitch at Reception-A during morning login.',
    status: 'Pending',
    doc: null,
  },
  {
    id: 'REQ-103',
    name: 'Amit Patel',
    empId: 'EMP-1105',
    department: 'Sales',
    type: 'Expense',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    duration: '₹ 3,450',
    reason: 'Cab reimbursement & lunch expenses for Delhi client demonstration meeting.',
    status: 'Pending',
    doc: { name: 'Uber_Receipt_ClientMeet.jpg', type: 'image' },
  },
  {
    id: 'REQ-104',
    name: 'Neha Roy',
    empId: 'EMP-1218',
    department: 'Product',
    type: 'Casual Leave',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    duration: '22 Sep (1 Day)',
    reason: 'Attending sibling graduation ceremony out of town.',
    status: 'Pending',
    doc: null,
  },
  {
    id: 'REQ-105',
    name: 'Vikram Singh',
    empId: 'EMP-0883',
    department: 'QA / Testing',
    type: 'Overtime',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    duration: '4 Hours (Night Shift)',
    reason: 'Production deployment sign-off & hotfix verification for v2.4 launch.',
    status: 'Pending',
    doc: null,
  },
  {
    id: 'REQ-106',
    name: 'Ananya Deshmukh',
    empId: 'EMP-1330',
    department: 'Marketing',
    type: 'WFH Request',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    duration: '21 Sep - 23 Sep (3 Days)',
    reason: 'Home renovation work and broadband repair schedule.',
    status: 'Pending',
    doc: null,
  },
  {
    id: 'REQ-107',
    name: 'Karan Mehra',
    empId: 'EMP-0754',
    department: 'DevOps',
    type: 'Expense',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    duration: '₹ 12,999',
    reason: 'Annual AWS Certified Solutions Architect Professional exam voucher fee.',
    status: 'Pending',
    doc: { name: 'AWS_Exam_Invoice.pdf', type: 'pdf' },
  }
];

export default function WorkflowApprovals() {
  const [requests, setRequests] = useState(dummyApprovalsData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [statusCounts, setStatusCounts] = useState({
    pending: dummyApprovalsData.length,
    approved: 5,
    rejected: 1
  });

  // Select / Unselect Single Checkbox
  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select / Unselect All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredRequests.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Single Actions (Removes item from list and updates counts)
  const handleApprove = (id) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setStatusCounts((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      approved: prev.approved + 1
    }));
  };

  const handleReject = (id) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setStatusCounts((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      rejected: prev.rejected + 1
    }));
  };

  // Bulk Actions
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setRequests((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setStatusCounts((prev) => ({
      ...prev,
      pending: prev.pending - count,
      approved: prev.approved + count
    }));
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setRequests((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setStatusCounts((prev) => ({
      ...prev,
      pending: prev.pending - count,
      rejected: prev.rejected + count
    }));
  };

  // Real-time Search & Type Filter
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      selectedType === 'All' || 
      req.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Approvals Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and take action on employee workflow requests across your team.
          </p>
        </div>

        {/* 1. Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{statusCounts.pending}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Approved Today</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{statusCounts.approved}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Rejected Today</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{statusCounts.rejected}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2. Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Employee Name, ID, or Department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">Request Type: All</option>
              <option value="Leave">Leave Requests</option>
              <option value="Attendance">Attendance</option>
              <option value="Expense">Expenses</option>
              <option value="Overtime">Overtime</option>
              <option value="WFH">Work From Home</option>
            </select>

            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="pending">Status: Pending</option>
              <option value="approved">Status: Approved</option>
              <option value="rejected">Status: Rejected</option>
            </select>

            <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="all">Date: All Time</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
        </div>

        {/* 3. Bulk Actions Toolbar */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={
                filteredRequests.length > 0 &&
                selectedIds.length === filteredRequests.length
              }
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="selectAll" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
              Select All Shown ({selectedIds.length} Selected)
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkApprove}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Check className="w-4 h-4" /> Bulk Approve
            </button>
            <button
              onClick={handleBulkReject}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <X className="w-4 h-4" /> Bulk Reject
            </button>
          </div>
        </div>

        {/* 4. Table / Request List */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-12"></th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Request Type</th>
                <th className="py-3 px-4">Date / Duration</th>
                <th className="py-3 px-4 max-w-xs">Reason</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/75 transition">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(req.id)}
                        onChange={() => handleSelectOne(req.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{req.name}</div>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <span>{req.empId}</span> • <span>{req.department}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${req.badgeClass}`}>
                        {req.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                      {req.duration}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {req.doc ? (
                        <a
                          href="#download"
                          onClick={(e) => { e.preventDefault(); alert(`Viewing file: ${req.doc.name}`); }}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded hover:text-blue-600 hover:border-blue-300 transition"
                        >
                          {req.doc.type === 'pdf' ? (
                            <FileText className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          <span className="max-w-[120px] truncate">{req.doc.name}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">--</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="p-1.5 rounded-md text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition"
                          title="Quick Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="p-1.5 rounded-md text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white transition"
                          title="Quick Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Details for: ${req.name}\nReason: ${req.reason}`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No requests match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredRequests.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{requests.length}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button className="px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50">
              2
            </button>
            <button className="px-2.5 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}