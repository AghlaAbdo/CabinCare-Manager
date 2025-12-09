'use client';

import { useState } from 'react';
import { XMarkIcon, MapPinIcon, PencilIcon } from '@heroicons/react/24/outline';
import EditTaskModal from './EditTaskModal';

interface MaintenanceTask {
  id: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Complete';
  createdAt: string;
}

interface CabinDetails {
  id: string;
  name: string;
  location: string;
  description?: string;
  maintenanceTasks: MaintenanceTask[];
}

interface CabinDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinDetails: CabinDetails | null;
  isLoading: boolean;
  onTaskUpdate?: () => void;
}

export default function CabinDetailsModal({
  isOpen,
  onClose,
  cabinDetails,
  isLoading,
  onTaskUpdate,
}: CabinDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);

  if (!isOpen) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openEditModal = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async (taskId: string, updates: { priority?: string; status?: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      onTaskUpdate?.();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      onTaskUpdate?.();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cabin Details</h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <p className="text-slate-500">Loading details...</p>
            ) : cabinDetails ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {cabinDetails.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 mb-4">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{cabinDetails.location}</span>
                  </div>
                  {cabinDetails.description && (
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">
                      {cabinDetails.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    All Maintenance Tasks ({cabinDetails.maintenanceTasks?.length || 0})
                  </h4>
                  {cabinDetails.maintenanceTasks?.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">
                      No tasks found for this cabin.
                    </p>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                      {[...cabinDetails.maintenanceTasks]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((task) => (
                        <div
                          key={task.id}
                          className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-slate-900 font-medium mb-2">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(task.priority)}`}
                                  ></div>
                                  <span className="text-sm text-slate-500">
                                    {task.priority}
                                  </span>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(task.status)}`}
                                >
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => openEditModal(task)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                            >
                              <PencilIcon className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500">No details available.</p>
            )}
          </div>

          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-slate-700 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
