import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Proyectos', href: '/projects', icon: '📁' },
  { name: 'Mis Tareas', href: '/my-tasks', icon: '✅' },
  { name: 'Calendario', href: '/calendar', icon: '📅' },
  { name: 'Equipos', href: '/teams', icon: '👥' },
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="w-72 bg-white/10 backdrop-blur-xl border-r border-white/10 p-8 relative">
      {/* Sidebar Glow */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      <div className="pb-12 border-b border-white/10 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] rounded-xl flex items-center justify-center text-2xl shadow-lg">
            📋
          </div>
          <div className="text-xl font-bold text-white">Task Management</div>
        </div>
      </div>

      <nav className="px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 p-4 mb-2 rounded-xl text-white/70 no-underline transition-all relative overflow-hidden
                ${isActive
                  ? 'bg-white/20 shadow-lg text-white translate-x-2'
                  : 'hover:bg-white/15 hover:text-white hover:translate-x-2'
                }`}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span>{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 hover:translate-x-full"></div>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-4 right-4 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#4ecdc4] to-[#ff6b6b] rounded-full flex items-center justify-center font-semibold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-0.5">{user?.name || 'Administrador'}</h4>
            <p className="text-xs text-white/60">{user?.role === 'admin' ? 'En línea' : 'Miembro'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 