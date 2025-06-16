'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { useAuth } from '@/context/AuthContext'
import { TaskModal } from '@/components/dashboard/TaskModal'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [reloadTasksCounter, setReloadTasksCounter] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleTaskUpdate = () => {
    setReloadTasksCounter(prev => prev + 1)
    setIsNewTaskModalOpen(false)
  }

  return (
    <MainLayout
      onNewTaskClick={() => setIsNewTaskModalOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="p-6">
        <KanbanBoard reloadTrigger={reloadTasksCounter} searchQuery={searchQuery} />
      </div>
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onUpdate={handleTaskUpdate}
      />
    </MainLayout>
  )
} 