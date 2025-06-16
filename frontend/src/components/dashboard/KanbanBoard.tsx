'use client'

import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { Task, BackendTaskStatus, FrontendTaskStatus, User } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { apiClientInstance } from '@/lib/api';
import toast from 'react-hot-toast';

// Mapeo de estados del backend a IDs de columnas
const statusMapping: Record<BackendTaskStatus, FrontendTaskStatus> = {
  'pending': 'todo',
  'in_progress': 'in-progress',
  'completed': 'completed',
  'cancelled': 'cancelled'
};

// Mapeo inverso para enviar al backend
const reverseStatusMapping: Record<FrontendTaskStatus, BackendTaskStatus> = {
  'todo': 'pending',
  'in-progress': 'in_progress',
  'completed': 'completed',
  'cancelled': 'cancelled'
};

const columns = [
  { id: 'todo' as FrontendTaskStatus, title: 'Por Hacer', indicatorColor: '#ffd93d' },
  { id: 'in-progress' as FrontendTaskStatus, title: 'En Progreso', indicatorColor: '#6bcf7f' },
  { id: 'completed' as FrontendTaskStatus, title: 'Completado', indicatorColor: '#4dabf7' },
  { id: 'cancelled' as FrontendTaskStatus, title: 'Cancelado', indicatorColor: '#ff8787' },
];

interface KanbanBoardProps {
  reloadTrigger?: number;
  searchQuery: string;
}

export function KanbanBoard({ reloadTrigger, searchQuery }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, usersData] = await Promise.all([
        apiClientInstance.getTasks(),
        apiClientInstance.getUsers()
      ]);
      
      // Mapear los estados del backend a los IDs de columnas
      const mappedTasks = tasksData.map(task => ({
        ...task,
        status: statusMapping[task.status as BackendTaskStatus]
      }));
      
      setTasks(mappedTasks);
      setUsers(usersData);
    } catch (error) {
      console.error('Error detallado al cargar datos:', error);
      toast.error('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reloadTrigger]);

  const refreshTasks = () => {
    loadData();
  };

  const getTasksByColumn = (columnId: FrontendTaskStatus) => {
    return tasks.filter((task) => {
      const matchesColumn = task.status === columnId;
      const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesColumn && matchesSearch;
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const draggedTask = tasks.find(task => task.id === draggableId);

    if (!draggedTask) return;

    const newBackendStatus = destination.droppableId as TaskStatus;
    
    try {
      const updatedTask = await apiClientInstance.updateTask(draggedTask.id, {
        ...draggedTask,
        status: newBackendStatus
      });

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
        <p className="ml-4 text-lg">Cargando tareas...</p>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            indicatorColor={column.indicatorColor}
            tasks={getTasksByColumn(column.id)}
            animationDelay={`animation-delay-${index * 0.1}s`}
            onUpdate={refreshTasks}
            users={users}
          />
        ))}
      </div>
    </DndContext>
  );
}