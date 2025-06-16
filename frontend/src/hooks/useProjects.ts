import { useState, useEffect } from 'react';
import { apiClientInstance } from '@/lib/api';
import { Project } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const fetchedProjects = await apiClientInstance.getProjects();
      setProjects(fetchedProjects);
    } catch (error: any) {
      console.error('Error al cargar proyectos:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        toast.error('Error al cargar los proyectos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: Partial<Project>) => {
    try {
      const newProject = await apiClientInstance.createProject(data);
      toast.success('Proyecto creado correctamente');
      loadProjects();
      return newProject;
    } catch (error: any) {
      console.error('Error al crear proyecto:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        toast.error('Error al crear el proyecto.');
      }
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      const updatedProject = await apiClientInstance.updateProject(id, data);
      toast.success('Proyecto actualizado correctamente');
      loadProjects();
      return updatedProject;
    } catch (error: any) {
      console.error('Error al actualizar proyecto:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        toast.error('Error al actualizar el proyecto.');
      }
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiClientInstance.deleteProject(id);
      toast.success('Proyecto eliminado correctamente');
      loadProjects();
    } catch (error: any) {
      console.error('Error al eliminar proyecto:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        toast.error('Error al eliminar el proyecto.');
      }
      throw error;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return { projects, loading, loadProjects, createProject, updateProject, deleteProject };
} 