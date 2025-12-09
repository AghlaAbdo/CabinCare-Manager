'use client';

import { useEffect, useState } from 'react';
import { PlusIcon, MapPinIcon, EyeIcon } from '@heroicons/react/24/outline';
import CreateCabinModal from '@/components/CreateCabinModal';
import CreateTaskModal from '@/components/CreateTaskModal';
import CabinDetailsModal from '@/components/CabinDetailsModal';

interface CabinSummary {
  id: string;
  name: string;
  location: string;
  description?: string;
  pendingHighPriority: number;
  pendingMediumPriority: number;
  pendingLowPriority: number;
  totalPendingTasks: number;
}

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
  createdAt: string;
  maintenanceTasks: MaintenanceTask[];
}

interface CreateTaskForm {
  cabinId: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Complete';
}

interface CreateCabinForm {
  name: string;
  location: string;
  description: string;
}

export default function Dashboard() {
  const [cabins, setCabins] = useState<CabinSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCabinModal, setShowCabinModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCabinId, setSelectedCabinId] = useState<string | null>(null);
  const [cabinDetails, setCabinDetails] = useState<CabinDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [taskForm, setTaskForm] = useState<CreateTaskForm>({
    cabinId: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
  });
  const [cabinForm, setCabinForm] = useState<CreateCabinForm>({
    name: '',
    location: '',
    description: '',
  });

  const fetchCabins = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cabins/summary`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch cabins');
      }
      const data = await response.json();
      setCabins(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCabinDetails = async (cabinId: string) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cabins/${cabinId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch cabin details');
      }
      const data = await response.json();
      setCabinDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cabin details');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, []);

  const handleCreateCabin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cabins`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cabinForm),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create cabin');
      }
      setCabinForm({ name: '', location: '', description: '' });
      setShowCabinModal(false);
      await fetchCabins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cabin');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCabinId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cabinId: selectedCabinId,
            description: taskForm.description,
            priority: taskForm.priority,
            status: taskForm.status,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      setTaskForm({ cabinId: '', description: '', priority: 'Medium', status: 'Pending' });
      setShowTaskModal(false);
      await fetchCabins();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const openTaskModal = (cabinId: string) => {
    setSelectedCabinId(cabinId);
    setTaskForm({ ...taskForm, cabinId });
    setShowTaskModal(true);
  };

  const openDetailsModal = async (cabinId: string) => {
    setSelectedCabinId(cabinId);
    setShowDetailsModal(true);
    await fetchCabinDetails(cabinId);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setCabinDetails(null);
  };

  const handleTaskUpdate = async () => {
    if (selectedCabinId) {
      await fetchCabinDetails(selectedCabinId);
    }
    await fetchCabins();
  };

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f7f8] p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500">Loading cabins...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          </div>
          <button
            onClick={() => setShowCabinModal(true)}
            className="flex items-center gap-2 bg-sky-blue text-white px-6 py-2.5 rounded-lg hover:bg-sky-blue/90 transition-colors font-bold cursor-pointer"
          >
            <PlusIcon className="w-5 h-5" />
            New Cabin
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {cabins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-slate-500 mb-6 text-lg">No cabins registered yet.</p>
            <button
              onClick={() => setShowCabinModal(true)}
              className="inline-flex items-center gap-2 bg-[#137fec] text-white px-6 py-3 rounded-lg hover:bg-[#137fec]/90 transition-colors font-bold"
            >
              <PlusIcon className="w-5 h-5" />
              Create First Cabin
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cabins.map((cabin) => (
              <div
                key={cabin.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                <div className="flex flex-col gap-3 p-6">
                  <p className="text-slate-900 text-xl font-black leading-tight tracking-tight">
                    {cabin.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-slate-500 shrink-0" />
                    <p className="text-slate-500 text-sm font-normal leading-normal">
                      {cabin.location}
                    </p>
                  </div>
                </div>

                <div className="px-6">
                  <hr className="border-slate-200" />
                </div>

                <div className="grow">
                  <h3 className="text-slate-900 text-base font-bold leading-tight tracking-tight px-6 pb-2 pt-4">
                    Pending tasks
                  </h3>
                  <div className="p-6 pt-2 grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 shrink-0"></div>
                      <div className="flex flex-col">
                        <p className="text-slate-500 text-sm font-normal leading-normal">
                          High priority
                        </p>
                        <p className="text-slate-900 text-sm font-bold leading-normal">
                          {cabin.pendingHighPriority}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500 shrink-0"></div>
                      <div className="flex flex-col">
                        <p className="text-slate-500 text-sm font-normal leading-normal">
                          Medium priority
                        </p>
                        <p className="text-slate-900 text-sm font-bold leading-normal">
                          {cabin.pendingMediumPriority}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></div>
                      <div className="flex flex-col">
                        <p className="text-slate-500 text-sm font-normal leading-normal">
                          Low priority
                        </p>
                        <p className="text-slate-900 text-sm font-bold leading-normal">
                          {cabin.pendingLowPriority}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between px-6 py-4 bg-slate-50 mt-auto">
                  <button
                    onClick={() => openDetailsModal(cabin.id)}
                    className="flex items-center justify-center rounded-lg py-3 px-3 bg-slate-200 text-slate-700 gap-2 text-base font-bold leading-normal hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    <EyeIcon className="w-5 h-5" />
                    Details
                  </button>
                  <button
                    onClick={() => openTaskModal(cabin.id)}
                    className="flex  cursor-pointer items-center justify-center overflow-hidden rounded-lg py-3 px-3 bg-sky-blue text-white gap-2 text-base font-bold leading-normal tracking-wide hover:bg-sky-blue/90 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="truncate">New task</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateCabinModal
        isOpen={showCabinModal}
        onClose={() => setShowCabinModal(false)}
        onSubmit={handleCreateCabin}
        cabinForm={cabinForm}
        setCabinForm={setCabinForm}
      />

      <CreateTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleCreateTask}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
      />

      <CabinDetailsModal
        isOpen={showDetailsModal}
        onClose={closeDetailsModal}
        cabinDetails={cabinDetails}
        isLoading={detailsLoading}
        onTaskUpdate={handleTaskUpdate}
      />
    </main>
  );
}
