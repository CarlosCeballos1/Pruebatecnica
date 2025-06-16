'use client'

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TaskModal } from './TaskModal';
import toast from 'react-hot-toast';
import { apiClientInstance } from '@/lib/api';
import { Task, User, Project } from '@/types';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  users: User[];
}

export function TaskCard({ task, onUpdate, users }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef, isDragging } = useDraggable({
    id: task.id,
    delay: 150,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      setIsDeleting(true);
      try {
        await apiClientInstance.deleteTask(task.id);
        toast.success('Tarea eliminada correctamente');
        onUpdate();
      } catch (error) {
        toast.error('Error al eliminar la tarea');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  // Función para obtener la inicial del nombre del usuario
  const getAssigneeInitial = (assignee: User | string | undefined) => {
    if (!assignee) return '?';
    if (typeof assignee === 'string') {
      return assignee.charAt(0).toUpperCase();
    }
    return assignee.firstName.charAt(0).toUpperCase();
  };

  // Función para obtener el nombre del usuario
  const getAssigneeName = (assignee: User | string | undefined) => {
    if (!assignee) return 'Sin asignar';
    if (typeof assignee === 'string') {
      return assignee;
    }
    return `${assignee.firstName} ${assignee.lastName}`;
  };

  // Función para obtener el nombre del proyecto
  const getProjectName = (project: Project | string | undefined) => {
    if (!project) return 'Sin proyecto';
    if (typeof project === 'string') {
      return project;
    }
    return project.name;
  };

  const assignedUser = task.assignedTo ? users.find(user => user.id === task.assignedTo) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5 transition-all relative overflow-hidden hover:translate-y-[-2px] hover:bg-white/20 hover:shadow-lg ${isDragging ? 'opacity-50 border-purple-400 shadow-xl' : ''}`}
    >
      {/* Task Card Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4]"></div>

      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1.5 leading-tight">{task.title}</h4>
          <p className="text-white/70 text-sm leading-snug mb-4">{task.description}</p>
        </div>
        <div className="flex gap-2">
          {/* Drag Handle */}
          <div ref={setActivatorNodeRef} {...listeners} {...attributes} className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center cursor-grab opacity-50 hover:opacity-100 transition-opacity z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
          </div>
          <button
            onClick={handleEdit}
            className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-white/20 hover:scale-110 z-20"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-50 z-20"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <div className="w-6 h-6 bg-gradient-to-br from-[#4ecdc4] to-[#ff6b6b] rounded-full flex items-center justify-center text-xs font-semibold">
            {getAssigneeInitial(assignedUser)}
          </div>
          <span>{getAssigneeName(assignedUser)}</span>
        </div>
        <div className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-md">
          {getProjectName(task.project)}
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </div>
  );
} 