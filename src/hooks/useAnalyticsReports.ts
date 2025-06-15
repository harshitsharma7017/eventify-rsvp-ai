
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type AnalyticsReport = {
  id: string;
  created_at: string;
  name: string;
  snapshot: any;
};

export const useAnalyticsReports = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics_reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_reports')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as AnalyticsReport[];
    },
  });
  return { data, isLoading, error, refetch };
};

export const useCreateAnalyticsReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, snapshot }: { name: string; snapshot: any }) => {
      const { data, error } = await supabase
        .from('analytics_reports')
        .insert([{ name, snapshot }])
        .select()
        .single();
      if (error) throw error;
      return data as AnalyticsReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics_reports'] });
    },
  });
};

export const useDeleteAnalyticsReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('analytics_reports')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics_reports'] });
    },
  });
};

export const useUpdateAnalyticsReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('analytics_reports')
        .update({ name })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as AnalyticsReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics_reports'] });
    },
  });
};
