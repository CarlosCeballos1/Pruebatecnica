import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// TaskModal and its state are now managed in DashboardPage
// import { TaskModal } from '@/components/dashboard/TaskModal';

interface MainLayoutProps {
  children: ReactNode;
  onNewTaskClick: () => void;
  onNewProjectClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MainLayout({ children, onNewTaskClick, onNewProjectClick, searchQuery, onSearchChange }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  // const [reloadTasksCounter, setReloadTasksCounter] = useState(0);

  // const handleTaskUpdate = () => {
  //   setReloadTasksCounter(prev => prev + 1);
  //   setIsNewTaskModalOpen(false);
  // };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute rounded-full bg-white/10 w-48 h-48 top-[10%] left-[85%] animate-float delay-[0s]"></div>
        <div className="absolute rounded-full bg-white/10 w-36 h-36 top-[70%] left-[5%] animate-float delay-[3s]"></div>
        <div className="absolute rounded-full bg-white/10 w-24 h-24 top-[30%] left-[70%] animate-float delay-[6s]"></div>
      </div>

      <div className="flex min-h-screen relative z-20">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-auto w-72`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay for small screens when sidebar is open */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar}></div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-0' : ''} md:ml-0`}>
          <Header 
            onNewTaskClick={onNewTaskClick}
            onNewProjectClick={onNewProjectClick}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto mt-8">
            {children}
          </main>
        </div>
      </div>

      {/* Floating Toggle Button for small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 left-4 md:hidden w-14 h-14 bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all transform hover:scale-110"
        aria-label={isSidebarOpen ? 'Cerrar Sidebar' : 'Abrir Sidebar'}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>

      {/* TaskModal is now rendered in DashboardPage */}
      {/* <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onUpdate={handleTaskUpdate}
      /> */}
    </div>
  );
} 