import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
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
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-8">
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
      {/* TaskModal is now rendered in DashboardPage */}
      {/* <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onUpdate={handleTaskUpdate}
      /> */}
    </div>
  );
} 