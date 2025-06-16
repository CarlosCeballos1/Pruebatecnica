'use client'

import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { Task, BackendTaskStatus, FrontendTaskStatus } from '@/types';
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
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    console.log('Iniciando carga de tareas...');
    try {
      setLoading(true);
      console.log('Llamando a apiClientInstance.getTasks()...');
      const data = await apiClientInstance.getTasks();
      console.log('Tareas recibidas:', data);
      
      // Mapear los estados del backend a los IDs de columnas
      const mappedTasks = data.map(task => ({
        ...task,
        status: statusMapping[task.status as BackendTaskStatus]
      }));
      
      console.log('Tareas mapeadas:', mappedTasks);
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error detallado al cargar tareas:', error);
      toast.error('Error al cargar las tareas.');
    } finally {
      setLoading(false);
      console.log('Estado final de tareas:', tasks);
    }
  };

  useEffect(() => {
    console.log('KanbanBoard montado, iniciando carga de tareas...');
    loadTasks();
  }, [reloadTrigger]);

  const refreshTasks = () => {
    console.log('Refrescando tareas...');
    loadTasks();
  };

  const getTasksByColumn = (columnId: FrontendTaskStatus) => {
    const filteredTasks = tasks.filter((task) => {
      const matchesColumn = task.status === columnId;
      const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesColumn && matchesSearch;
    });
    console.log(`Tareas para columna ${columnId} (filtradas por búsqueda '${searchQuery}'):`, filteredTasks);
    return filteredTasks;
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const draggedTask = tasks.find((task) => task.id === active.id);
      if (!draggedTask) return;

      const originalTasks = tasks;
      const newColumnId = over.id as FrontendTaskStatus;
      const newBackendStatus = reverseStatusMapping[newColumnId];
      
      console.log(`Moviendo tarea ${draggedTask.id} a estado ${newBackendStatus}`);

      // Optimistic update con el estado mapeado para la UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === active.id ? { ...task, status: newColumnId } : task
        )
      );

      try {
        // Enviar al backend el estado original
        await apiClientInstance.updateTask(active.id, { status: newBackendStatus });
        toast.success(`Tarea '${draggedTask.title}' movida a '${columns.find(col => col.id === newColumnId)?.title || newColumnId}'.`);
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        toast.error(`Error al mover la tarea '${draggedTask.title}'.`);
        setTasks(originalTasks);
      }
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
          />
        ))}
      </div>
    </DndContext>
  );
}