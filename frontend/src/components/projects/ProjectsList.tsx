'use client'

import { Project } from '@/types'
import { ProjectCard } from './ProjectCard' // Este lo crearemos a continuación

interface ProjectsListProps {
  projects: Project[];
  loading: boolean;
  onUpdate: () => void; // Para recargar proyectos después de una acción
  onEdit: (project: Project) => void; // Add onEdit prop for editing projects
  searchQuery: string; // Add searchQuery prop for filtering
}

export function ProjectsList({ projects, loading, onUpdate, onEdit, searchQuery }: ProjectsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No hay proyectos disponibles. ¡Crea uno para empezar!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} onUpdate={onUpdate} onEdit={onEdit} />
      ))}
    </div>
  );
} 