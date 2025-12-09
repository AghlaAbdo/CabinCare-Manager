'use client';

import { useState } from 'react';
import { XMarkIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface MaintenanceTask {
  id: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Complete';
  createdAt: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: MaintenanceTask | null;
  onUpdate: (taskId: string, updates: { priority?: string; status?: string }) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
}: EditTaskModalProps) {
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>(task?.priority || 'Medium');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Complete'>(task?.status || 'Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !task) return null;

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(task.id, { priority, status });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(task.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'Low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-60">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-500 mb-1">Task Description</p>
          <p className="text-slate-900 font-medium">{task.description}</p>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {(['High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors text-slate-500 cursor-pointer ${
                  priority === p
                    ? 'border-[#137fec] bg-[#137fec]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(p)}`}></div>
                <span className="font-medium text-sm">{p}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Pending' | 'In Progress' | 'Complete')}
            className="w-full text-slate-500 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/90 transition-colors font-bold disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Updating...' : 'Update Task'}
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-bold cursor-pointer"
            >
              <TrashIcon className="w-5 h-5" />
              Delete Task
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 mb-3">Are you sure you want to delete this task?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
