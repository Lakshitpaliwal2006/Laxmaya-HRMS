import { useState } from "react";
import { X, Building2, User, FileText, ChevronDown } from "lucide-react";

/**
 * AddDepartmentModal
 *
 * Usage:
 *   <AddDepartmentModal
 *     open={isOpen}
 *     onClose={() => setIsOpen(false)}
 *     hodOptions={[{ id: 1, name: "Mitchum Daniel" }, ...]}
 *     onSubmit={(data) => console.log(data)}
 *   />
 */
export default function AddDepartmentModal({
  open,
  onClose,
  hodOptions = [],
  onSubmit,
}) {
  const [name, setName] = useState("");
  const [hod, setHod] = useState("");
  const [assistantHod, setAssistantHod] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const handleSubmit = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Department name is required";
    if (!hod) newErrors.hod = "HOD is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.({ name, hod, assistantHod, description });
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setHod("");
    setAssistantHod("");
    setDescription("");
    setErrors({});
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add Department</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Department Name */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">
            Department Name <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-teal-500/30 ${
              errors.name ? "border-red-400" : "border-slate-300"
            }`}
          >
            <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
              }}
              placeholder="Enter department name"
              className="w-full text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* HOD */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">
            HOD (Head of Department) <span className="text-red-500">*</span>
          </label>
          <div
            className={`group flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm transition-colors focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/30 hover:border-teal-400 ${
              errors.hod ? "border-red-400" : "border-slate-300"
            }`}
          >
            <User className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-teal-600" />
            <select
              value={hod}
              onChange={(e) => {
                setHod(e.target.value);
                if (errors.hod) setErrors((p) => ({ ...p, hod: undefined }));
              }}
              className={`w-full cursor-pointer appearance-none bg-transparent text-sm outline-none ${
                hod ? "text-slate-800" : "text-slate-400"
              }`}
            >
              <option value="" disabled className="text-slate-400">
                Select HOD
              </option>
              {hodOptions.map((person) => (
                <option key={person.id} value={person.id} className="text-slate-800">
                  {person.name}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-teal-600" />
          </div>
          {errors.hod && (
            <p className="mt-1 text-xs text-red-500">{errors.hod}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">
            Description
          </label>
          <div className="flex items-start gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-teal-500/30">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter department description (optional)"
              rows={3}
              className="w-full resize-y text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            + Add Department
          </button>
        </div>
      </div>
    </div>
  );
}