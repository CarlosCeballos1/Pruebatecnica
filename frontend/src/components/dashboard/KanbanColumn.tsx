import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, User } from '@/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';

interface KanbanColumnProps {
  id: string;
  title: string;
  indicatorColor: string;
  tasks: Task[];
  animationDelay: string;
  onUpdate: () => void;
  users: User[];
}

export function KanbanColumn({ id, title, indicatorColor, tasks, animationDelay, onUpdate, users }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-xl"
      style={{ animationDelay }}
    >
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: indicatorColor }}></div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-2xl text-xs font-semibold">{tasks.length}</div>
      </div>
      <div className="tasks-container flex flex-col gap-4 min-h-[400px]">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onUpdate={onUpdate} users={users} />)
        )}
      </div>
    </div>
  );
} 