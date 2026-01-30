import { useState, useEffect, useCallback } from 'react';
import { db } from '@/integrations/supabase/db';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  order_number: string;
  title: string;
  title_ar?: string;
  description?: string;
  status: 'pending' | 'processing' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  total_amount?: number;
  currency?: string;
  customer_id?: string;
  service_id?: string;
  assigned_to?: string;
  due_date?: string;
  priority?: number;
  created_at?: string;
  updated_at?: string;
  // Joined data
  customer?: { full_name: string; email: string };
  service?: { name: string; name_ar?: string };
}

interface UseOrdersOptions {
  customerId?: string;
  status?: string;
  limit?: number;
}

export const useOrders = (options: UseOrdersOptions = {}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = db
        .from('orders')
        .select(`
          *,
          customer:profiles!orders_customer_id_fkey(full_name, email),
          service:services(name, name_ar)
        `)
        .order('created_at', { ascending: false });

      if (options.customerId) {
        query = query.eq('customer_id', options.customerId);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.customerId, options.status, options.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const { data, error } = await db
        .from('orders')
        .insert({
          ...orderData,
          customer_id: orderData.customer_id || user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'تم إنشاء الطلب',
        description: `رقم الطلب: ${data.order_number}`,
      });
      
      fetchOrders();
      return data;
    } catch (err) {
      console.error('Error creating order:', err);
      toast({
        title: 'خطأ في إنشاء الطلب',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const { data, error } = await db
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: 'تم تحديث الطلب',
      });
      
      fetchOrders();
      return data;
    } catch (err) {
      console.error('Error updating order:', err);
      toast({
        title: 'خطأ في تحديث الطلب',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await db
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: 'تم حذف الطلب',
      });
      
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      toast({
        title: 'خطأ في حذف الطلب',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};
