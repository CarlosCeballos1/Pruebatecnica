'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { ProjectsList } from '@/components/projects/ProjectsList'
import { apiClientInstance } from '@/lib/api'
import toast from 'react-hot-toast'
import { Project } from '@/types'

export default function ProjectsPage() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [reloadProjectsCounter, setReloadProjectsCounter] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const loadProjects = async () => {
    setLoading(true)
    try {
      const fetchedProjects = await apiClientInstance.getProjects()
      setProjects(fetchedProjects)
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      toast.error('Error al cargar los proyectos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [reloadProjectsCounter])

  const handleProjectUpdate = () => {
    setReloadProjectsCounter(prev => prev + 1)
    setIsProjectModalOpen(false)
    setEditingProject(undefined)
  }

  const handleOpenNewProjectModal = () => {
    setEditingProject(undefined)
    setIsProjectModalOpen(true)
  }

  const handleOpenEditProjectModal = (project: Project) => {
    setEditingProject(project)
    setIsProjectModalOpen(true)
  }

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false)
    setEditingProject(undefined)
  }

  return (
    <MainLayout
      onNewTaskClick={() => { /* Esto es un no-op para la página de proyectos */ }}
      onNewProjectClick={handleOpenNewProjectModal}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="p-6">
        <ProjectsList 
          projects={projects}
          loading={loading}
          onUpdate={handleProjectUpdate}
          onEdit={handleOpenEditProjectModal}
          searchQuery={searchQuery}
        />
      </div>
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        project={editingProject}
      />
    </MainLayout>
  )
} 