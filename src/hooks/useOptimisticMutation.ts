/**
 * useOptimisticMutation Hook
 * Provides instant UI feedback before server confirmation
 * Rolls back on error automatically
 */

import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from '@/components/v3/feedback/ModernToast';

interface OptimisticMutationOptions<TData, TVariables> {
  // The query key to update optimistically
  queryKey: QueryKey;
  
  // The actual mutation function
  mutationFn: (variables: TVariables) => Promise<TData>;
  
  // Transform the current data with the new variables
  optimisticUpdate: (currentData: TData | undefined, variables: TVariables) => TData;
  
  // Success message (Arabic)
  successMessage?: string;
  
  // Error message (Arabic)
  errorMessage?: string;
  
  // Callback on success
  onSuccess?: (data: TData, variables: TVariables) => void;
  
  // Callback on error
  onError?: (error: Error, variables: TVariables) => void;
}

export function useOptimisticMutation<TData, TVariables>({
  queryKey,
  mutationFn,
  optimisticUpdate,
  successMessage = 'تم الحفظ بنجاح',
  errorMessage = 'حدث خطأ، يرجى المحاولة مرة أخرى',
  onSuccess,
  onError,
}: OptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    
    // Optimistic update - happens immediately
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => 
        optimisticUpdate(old, variables)
      );

      // Return context with the previous value
      return { previousData };
    },

    // On error, rollback to the previous value
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      toast.error(errorMessage, error instanceof Error ? error.message : undefined);
      onError?.(error as Error, variables);
    },

    // On success, show success message
    onSuccess: (data, variables) => {
      toast.success(successMessage);
      onSuccess?.(data, variables);
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

/**
 * useOptimisticList Hook
 * Specialized for list operations (add, update, delete)
 */

interface ListItem {
  id: string;
  [key: string]: any;
}

interface OptimisticListOptions<TItem extends ListItem> {
  queryKey: QueryKey;
  
  // Add item to list
  addFn?: (item: Omit<TItem, 'id'>) => Promise<TItem>;
  
  // Update item in list
  updateFn?: (item: TItem) => Promise<TItem>;
  
  // Delete item from list
  deleteFn?: (id: string) => Promise<void>;
}

export function useOptimisticList<TItem extends ListItem>({
  queryKey,
  addFn,
  updateFn,
  deleteFn,
}: OptimisticListOptions<TItem>) {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addFn!,
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData<TItem[]>(queryKey);
      
      // Add with temporary ID
      const tempItem = { 
        ...newItem, 
        id: `temp-${Date.now()}`,
      } as unknown as TItem;
      
      queryClient.setQueryData<TItem[]>(queryKey, (old = []) => [tempItem, ...old]);
      return { previousItems };
    },
    onError: (err, _, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error('فشل في الإضافة');
    },
    onSuccess: () => {
      toast.success('تمت الإضافة بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFn!,
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData<TItem[]>(queryKey);
      
      queryClient.setQueryData<TItem[]>(queryKey, (old = []) =>
        old.map((item) => item.id === updatedItem.id ? updatedItem : item)
      );
      
      return { previousItems };
    },
    onError: (err, _, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error('فشل في التحديث');
    },
    onSuccess: () => {
      toast.success('تم التحديث بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn!,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData<TItem[]>(queryKey);
      
      queryClient.setQueryData<TItem[]>(queryKey, (old = []) =>
        old.filter((item) => item.id !== id)
      );
      
      return { previousItems };
    },
    onError: (err, _, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error('فشل في الحذف');
    },
    onSuccess: () => {
      toast.success('تم الحذف بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    add: addFn ? addMutation.mutate : undefined,
    update: updateFn ? updateMutation.mutate : undefined,
    remove: deleteFn ? deleteMutation.mutate : undefined,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPending: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

/**
 * useOptimisticToggle Hook
 * For instant toggle operations (like, bookmark, etc.)
 */

interface OptimisticToggleOptions {
  queryKey: QueryKey;
  toggleFn: (id: string, currentState: boolean) => Promise<boolean>;
  getId: (data: any) => string;
  getState: (data: any) => boolean;
  setState: (data: any, newState: boolean) => any;
}

export function useOptimisticToggle({
  queryKey,
  toggleFn,
  getId,
  getState,
  setState,
}: OptimisticToggleOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, currentState }: { id: string; currentState: boolean }) =>
      toggleFn(id, currentState),
    
    onMutate: async ({ id, currentState }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (Array.isArray(old)) {
          return old.map((item) =>
            getId(item) === id ? setState(item, !currentState) : item
          );
        }
        return setState(old, !currentState);
      });

      return { previousData };
    },

    onError: (err, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
