'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute rounded-full bg-white/10 w-20 h-20 top-1/5 left-[10%] animate-float"></div>
        <div className="absolute rounded-full bg-white/10 w-32 h-32 top-3/5 right-[10%] animate-float delay-2s"></div>
        <div className="absolute rounded-full bg-white/10 w-16 h-16 top-4/5 left-[20%] animate-float delay-4s"></div>
      </div>

      <div className="relative z-20 flex items-center justify-center min-h-screen p-5">
        <div className="login-card bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-12 w-full max-w-md shadow-2xl relative overflow-hidden animate-slideUp">
          {/* Card Inner Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Acceso al Sistema</h1>
            <p className="text-white/80">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all focus:translate-y-[-2px]"
                placeholder="Ingresa tu email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all focus:translate-y-[-2px]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                >
                  {showPassword ? '👁' : '🙈'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/20 bg-white/10 text-[#4ecdc4] focus:ring-[#4ecdc4]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                  Recordar sesión
                </label>
              </div>
              <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white font-semibold rounded-xl uppercase tracking-wider hover:shadow-lg hover:shadow-[#ff6b6b]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 