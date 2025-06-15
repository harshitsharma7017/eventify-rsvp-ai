
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Guest } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useGuests = () => {
  return useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Guest[]
    }
  })
}

export const useCreateGuest = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (guestData: Omit<Guest, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('guests')
        .insert([guestData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: "Guest Added",
        description: "Guest has been added successfully!",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive"
      })
      console.error('Error creating guest:', error)
    }
  })
}

export const useUpdateGuest = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Guest> & { id: string }) => {
      const { data, error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: "Guest Updated",
        description: "Guest has been updated successfully!",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update guest. Please try again.",
        variant: "destructive"
      })
      console.error('Error updating guest:', error)
    }
  })
}

export const useDeleteGuest = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: "Guest Removed",
        description: "Guest has been removed successfully!",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove guest. Please try again.",
        variant: "destructive"
      })
      console.error('Error deleting guest:', error)
    }
  })
}
