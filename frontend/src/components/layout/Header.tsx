'use client'

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onNewTaskClick: () => void;
  onNewProjectClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ onNewTaskClick, onNewProjectClick, searchQuery, onSearchChange }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isDashboardPage = pathname === '/dashboard';
  const headerTitle = isDashboardPage ? 'Dashboard' : 'Gestión de Proyectos';
  const createButtonText = isDashboardPage ? '➕ Crear Tarea' : '➕ Crear Proyecto';
  const handleCreateButtonClick = isDashboardPage ? onNewTaskClick : onNewProjectClick;

  return (
    <header className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 flex justify-between items-center mb-10">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{headerTitle}</h1>
        {isDashboardPage && (
          <div className="relative ml-8">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-white/50"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all relative hover:bg-white/20 hover:scale-105"
        >
          🔔
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6b6b] rounded-full text-xs flex items-center justify-center font-semibold">3</span>
        </button>
        <button
          type="button"
          onClick={handleCreateButtonClick}
          className="bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white font-semibold py-3 px-6 rounded-xl uppercase tracking-wide cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#ff6b6b]/30 flex items-center gap-2 text-sm"
        >
          {createButtonText}
        </button>
      </div>
    </header>
  );
} 