import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  category: 'vip' | 'regular' | 'plus_one';
  position: number;
  created_at: string;
}

export const useWaitlist = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addToWaitlist = async (
    eventId: string,
    guestData: { name: string; email: string; category?: string }
  ) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-waitlist', {
        body: {
          action: 'add_to_waitlist',
          eventId,
          guestData
        }
      });

      if (error) throw error;

      toast({
        title: "Added to Waitlist",
        description: `${guestData.name} is #${data.position} on the waitlist.`,
      });

      await getWaitlist(eventId);
      return data.position;

    } catch (error) {
      console.error('Waitlist error:', error);
      toast({
        title: "Error",
        description: "Failed to add to waitlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const promoteFromWaitlist = async (eventId: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-waitlist', {
        body: {
          action: 'promote_from_waitlist',
          eventId
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Guest Promoted",
          description: `${data.promotedGuest.name} has been moved from waitlist to confirmed guests.`,
        });
        await getWaitlist(eventId);
      } else {
        toast({
          title: "Cannot Promote",
          description: data.message,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Promotion error:', error);
      toast({
        title: "Error",
        description: "Failed to promote guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWaitlist = async (eventId: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('manage-waitlist', {
        body: {
          action: 'get_waitlist',
          eventId
        }
      });

      if (error) throw error;
      setWaitlist(data.waitlist || []);

    } catch (error) {
      console.error('Get waitlist error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    waitlist,
    isLoading,
    addToWaitlist,
    promoteFromWaitlist,
    getWaitlist
  };
};