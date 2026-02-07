import { useState, useEffect, useCallback } from 'react';
import { db } from '@/integrations/supabase/db';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  full_name_ar?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  preferred_language?: string;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
  // Joined data
  roles?: { role: string }[];
}

interface UseUsersOptions {
  tenantId?: string;
  isActive?: boolean;
  limit?: number;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build profile query
      let query = db
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (options.tenantId) {
        query = query.eq('tenant_id', options.tenantId);
      }

      if (options.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const userIds = profilesData?.map(p => p.id) || [];
      
      let usersWithRoles: UserProfile[] = profilesData || [];
      
      if (userIds.length > 0) {
        const { data: rolesData } = await db
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        // Map roles to users
        usersWithRoles = (profilesData || []).map(profile => ({
          ...profile,
          roles: (rolesData || [])
            .filter(r => r.user_id === profile.id)
            .map(r => ({ role: r.role }))
        }));
      }

      setUsers(usersWithRoles);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.tenantId, options.isActive, options.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await db
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'تم تحديث المستخدم',
      });
      
      fetchUsers();
      return data;
    } catch (err) {
      console.error('Error updating user:', err);
      toast({
        title: 'خطأ في تحديث المستخدم',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const assignRole = async (userId: string, role: string) => {
    try {
      const { error } = await db
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
        });

      if (error) throw error;
      
      toast({
        title: 'تم تعيين الدور',
      });
      
      fetchUsers();
    } catch (err) {
      console.error('Error assigning role:', err);
      toast({
        title: 'خطأ في تعيين الدور',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    assignRole,
  };
};
