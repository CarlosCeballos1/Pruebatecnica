'use client'

import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Task, User, Project, BackendTaskStatus, FrontendTaskStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClientInstance } from '@/lib/api';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

// Mapeo de estados del backend a IDs de columnas (para la visualización en el modal si fuera necesario)
const statusMapping: Record<BackendTaskStatus, FrontendTaskStatus> = {
  'pending': 'todo',
  'in_progress': 'in-progress',
  'completed': 'completed',
  'cancelled': 'cancelled'
};

// Mapeo inverso para enviar al backend (para guardar/actualizar)
const reverseStatusMapping: Record<FrontendTaskStatus, BackendTaskStatus> = {
  'todo': 'pending',
  'in-progress': 'in_progress',
  'completed': 'completed',
  'cancelled': 'cancelled'
};

const taskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']), // Backend status expected
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // Make task optional
  onUpdate: () => void;
}

export function TaskModal({ isOpen, onClose, task, onUpdate }: TaskModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'pending',
      dueDate: null,
      assigneeId: null,
      projectId: null,
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingData(true);
      try {
        const fetchedUsers = await apiClientInstance.getUsers();
        setUsers(fetchedUsers);

        const fetchedProjects = await apiClientInstance.getProjects();
        setProjects(fetchedProjects);

        if (task) {
          setValue('title', task.title);
          setValue('description', task.description);
          setValue('priority', task.priority || 'MEDIUM');
          setValue('status', task.status as BackendTaskStatus);
          setValue('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null);
          setValue('assigneeId', typeof task.assignee === 'object' && task.assignee ? task.assignee.id : task.assignee || null);
          setValue('projectId', typeof task.project === 'object' && task.project ? task.project.id : task.project || null);
        } else {
          // For new tasks, set default assignee if user is logged in
          if (user) {
            setValue('assigneeId', user.id);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast.error('Error al cargar usuarios o proyectos.');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
      loadInitialData();
    } else {
      reset(); // Reset form when modal closes
    }
  }, [isOpen, user, task, setValue, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSaving(true);
      // Convert dueDate to ISO string if not null/empty
      const dueDateISO = data.dueDate ? new Date(data.dueDate).toISOString() : null;

      const taskDataToSend = {
        ...data,
        dueDate: dueDateISO,
        assigneeId: data.assigneeId || undefined, // Send undefined if null/empty
        projectId: data.projectId || undefined,   // Send undefined if null/empty
      };

      if (task) {
        await apiClientInstance.updateTask(task.id, taskDataToSend);
        toast.success('Tarea actualizada');
      } else {
        await apiClientInstance.createTask(taskDataToSend);
        toast.success('Tarea creada');
      }
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      toast.error('Error al guardar la tarea');
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormField = (label: string, name: keyof TaskFormData, type: string = 'text', isTextArea: boolean = false) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white/80 mb-2">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          {...register(name)}
          rows={3}
          className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-white/50"
        />
      ) : (
        <input
          id={name}
          type={type}
          {...register(name)}
          className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-white/50"
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-400">{errors[name]?.message}</p>
      )}
    </div>
  );

  if (isLoadingData) {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-left align-middle shadow-2xl transition-all flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-left align-middle shadow-2xl transition-all text-white">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-white mb-6 flex justify-between items-center"
                >
                  {task ? 'Editar Tarea' : 'Crear Nueva Tarea'}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
                  {renderFormField('Título', 'title')}
                  {renderFormField('Descripción', 'description', 'text', true)}

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-white/80 mb-2">
                      Prioridad
                    </label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="LOW">Baja</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                    </select>
                    {errors.priority && (
                      <p className="mt-1 text-sm text-red-400">{errors.priority.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-white/80 mb-2">
                      Estado
                    </label>
                    <select
                      id="status"
                      {...register('status')}
                      className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                    )}
                  </div>

                  {renderFormField('Fecha Límite', 'dueDate', 'date')}

                  <div>
                    <label htmlFor="assigneeId" className="block text-sm font-medium text-white/80 mb-2">
                      Asignado a
                    </label>
                    <select
                      id="assigneeId"
                      {...register('assigneeId')}
                      className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="">Sin asignar</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    {errors.assigneeId && (
                      <p className="mt-1 text-sm text-red-400">{errors.assigneeId.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-white/80 mb-2">
                      Proyecto
                    </label>
                    <select
                      id="projectId"
                      {...register('projectId')}
                      className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    >
                      <option value="">Sin proyecto</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.projectId && (
                      <p className="mt-1 text-sm text-red-400">{errors.projectId.message}</p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-white/20 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white font-semibold py-3 px-6 rounded-xl uppercase tracking-wide cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#ff6b6b]/30 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Guardando...' : task ? 'Guardar Cambios' : 'Crear Tarea'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 