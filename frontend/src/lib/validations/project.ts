import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'paused']),
  members: z.array(z.string().uuid('Cada miembro debe ser un UUID válido')).optional(),
  deadline: z.string().optional(),
}); 