import { Router } from 'express';
import { Project } from '../models/Project';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Obtener todos los proyectos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// Crear un nuevo proyecto
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, status, members, deadline } = req.body;
    
    const project = await Project.create({
      name,
      description,
      status,
      members,
      deadline,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ message: 'Error al crear proyecto' });
  }
});

// Actualizar un proyecto
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, members, deadline } = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await project.update({
      name,
      description,
      status,
      members,
      deadline,
    });

    res.json(project);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar proyecto' });
  }
});

// Eliminar un proyecto
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    await project.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar proyecto' });
  }
});

export default router; 