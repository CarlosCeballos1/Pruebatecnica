import { useState, useEffect } from 'react';
import { apiClientInstance } from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const router = useRouter();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await apiClientInstance.getUsers();
      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      } else {
        toast.error('Error al cargar los usuarios.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading };
} 