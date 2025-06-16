'use client'

import { Project } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useProjects } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: Project;
  onUpdate: () => void;
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, onUpdate, onEdit }: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useProjects();

  console.log('Project in ProjectCard:', project);
  console.log('Project status in ProjectCard:', project?.status);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;

    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success('Proyecto eliminado correctamente');
      onUpdate(); // Trigger re-load in ProjectsList
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      toast.error('Error al eliminar el proyecto');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedStatus = project.status ? 
    project.status.charAt(0).toUpperCase() + project.status.slice(1) : 
    'Desconocido';

  return (
    <div className="project-card bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl p-5 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:bg-white/20 hover:shadow-lg text-white">
      {/* Project Card Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4]"></div>

      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1.5 leading-tight">{project.name}</h3>
          <p className="text-white/70 text-sm leading-snug mb-4">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit button clicked for project:', project.id);
              onEdit(project);
            }}
            className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-white/20 hover:scale-110 z-20"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete button clicked for project:', project.id);
              handleDelete();
            }}
            disabled={isDeleting}
            className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-sm transition-all hover:bg-white/20 hover:scale-110 disabled:opacity-50 z-20"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            getStatusColor(project.status || 'unknown')
          }`}
        >
          {formattedStatus}
        </span>
        {project.deadline && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white/80">
            Vencimiento: {new Date(project.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="text-sm text-white/60">
        Creado: {new Date(project.createdAt).toLocaleDateString()}
      </div>
      {/* Aquí podrías añadir miembros del proyecto si están disponibles en la prop Project */}
      {/* <div className="mt-2 text-sm text-gray-500">Miembros: {project.members.length}</div> */}
    </div>
  );
} 