'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateCabinForm {
  name: string;
  location: string;
  description: string;
}

interface CreateCabinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  cabinForm: CreateCabinForm;
  setCabinForm: (form: CreateCabinForm) => void;
}

export default function CreateCabinModal({
  isOpen,
  onClose,
  onSubmit,
  cabinForm,
  setCabinForm,
}: CreateCabinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Cabin</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Cabin Name *
            </label>
            <input
              type="text"
              required
              value={cabinForm.name}
              onChange={(e) =>
                setCabinForm({ ...cabinForm, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none text-slate-500"
              placeholder="e.g., Mountain Retreat"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={cabinForm.location}
              onChange={(e) =>
                setCabinForm({ ...cabinForm, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none text-slate-500"
              placeholder="e.g., Colorado, USA"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={cabinForm.description}
              onChange={(e) =>
                setCabinForm({ ...cabinForm, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none resize-none text-slate-500"
              rows={3}
              placeholder="Add cabin details..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/90 transition-colors font-bold cursor-pointer"
            >
              Create Cabin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
