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
    <header className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent whitespace-nowrap">{headerTitle}</h1>
        {isDashboardPage && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-white/50"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <button
          type="button"
          onClick={handleCreateButtonClick}
          className="bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white font-semibold py-3 px-6 rounded-xl uppercase tracking-wide cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#ff6b6b]/30 flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
        >
          {createButtonText}
        </button>
      </div>
    </header>
  );
} 