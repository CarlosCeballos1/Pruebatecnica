'use client'

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations/project';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { Project } from '@/types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

type ProjectFormData = { 
  name: string; 
  description: string; 
  status: string; 
  members: string[]; 
  deadline: string | null; 
};

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { createProject, updateProject } = useProjects();
  const { users } = useUsers();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      members: [],
      deadline: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: project?.name || '',
        description: project?.description || '',
        status: project?.status || 'active',
        members: project?.members?.map(member => (typeof member === 'object' ? member.id : member)) || [],
        deadline: project?.deadline ? new Date(project.deadline).toISOString().split('T')[0] : null,
      });
    } else {
      reset(); // Reset form when modal closes
    }
  }, [isOpen, project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSaving(true);
      const projectDataToSend = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
        members: data.members || [],
      };

      if (project) {
        await updateProject(project.id, projectDataToSend);
      } else {
        await createProject(projectDataToSend);
      }
      onClose();
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
      console.error('Error al guardar el proyecto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormField = (label: string, name: keyof ProjectFormData, type: string = 'text', isTextArea: boolean = false) => (
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

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 text-left align-middle shadow-2xl transition-all text-white sm:my-8 sm:w-full sm:max-w-xl">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-white mb-6 flex justify-between items-center"
                  >
                    {project ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
                    {renderFormField('Nombre', 'name')}
                    {renderFormField('Descripción', 'description', 'text', true)}

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-white/80 mb-2">
                        Estado
                      </label>
                      <select
                        id="status"
                        {...register('status')}
                        className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      >
                        <option value="active">Activo</option>
                        <option value="completed">Completado</option>
                        <option value="paused">Pausado</option>
                      </select>
                      {errors.status && (
                        <p className="mt-1 text-sm text-red-400">{errors.status.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="members" className="block text-sm font-medium text-white/80 mb-2">
                        Miembros
                      </label>
                      <select
                        id="members"
                        {...register('members')}
                        multiple
                        className="block w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all h-32"
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                      {errors.members && (
                        <p className="mt-1 text-sm text-red-400">{errors.members.message}</p>
                      )}
                    </div>

                    {renderFormField('Fecha Límite', 'deadline', 'date')}

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
                        {isSaving ? 'Guardando...' : project ? 'Guardar Cambios' : 'Crear Proyecto'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 