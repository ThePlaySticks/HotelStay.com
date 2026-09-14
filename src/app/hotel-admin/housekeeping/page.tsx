'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { INITIAL_HOUSEKEEPING } from '@/lib/mockData';
import { HousekeepingTask } from '@/lib/types';
import { Brush, CheckCircle2, Clock, AlertTriangle, Plus, Check } from 'lucide-react';

export default function HousekeepingPage() {
  const { currentPersona } = useAuth();
  const { hotels, showToast } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0] || null;

  const [tasks, setTasks] = useState<HousekeepingTask[]>(
    INITIAL_HOUSEKEEPING.filter((t) => t.hotelId === currentHotelId)
  );

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      )
    );
    showToast({ title: 'Task Updated', description: 'Housekeeping status adjusted.', type: 'info' });
  };

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Facilities & Sanitization
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Housekeeping Operations
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Turnover inspections, deep sanitization, and daily refresh roster for {currentHotel?.name || 'Sanctuary'}.
          </p>
        </div>

        <button
          onClick={() => {
            const newTask: HousekeepingTask = {
              id: 'hk-' + Math.floor(100 + Math.random() * 900),
              hotelId: currentHotelId,
              roomNumber: 'Suite ' + Math.floor(100 + Math.random() * 20),
              taskType: 'Full Turnover',
              assignedTo: 'Beatrice Fontaine',
              priority: 'High',
              status: 'pending',
              dueDate: 'Today, 16:00',
              notes: 'Express VIP arrival turnover',
            };
            setTasks([newTask, ...tasks]);
            showToast({ title: 'Task Created', description: 'New housekeeping task queued.', type: 'success' });
          }}
          className="px-4 py-2 rounded-full bg-[#141413] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cleaning Task</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
            <tr>
              <th className="py-3.5 px-6 font-semibold">Room Key</th>
              <th className="py-3.5 px-6 font-semibold">Task Type</th>
              <th className="py-3.5 px-6 font-semibold">Assigned Housekeeper</th>
              <th className="py-3.5 px-6 font-semibold">Priority</th>
              <th className="py-3.5 px-6 font-semibold">Due Target</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-[#575650]">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#FAF8F5] transition-colors">
                <td className="py-4 px-6 font-bold text-[#141413]">{task.roomNumber}</td>
                <td className="py-4 px-6 font-semibold">{task.taskType}</td>
                <td className="py-4 px-6">{task.assignedTo}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : task.priority === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 px-6">{task.dueDate}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      task.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      task.status === 'completed'
                        ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {task.status === 'completed' ? 'Reopen' : '✓ Mark Done'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
