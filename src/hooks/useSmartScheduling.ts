import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface SchedulingSuggestion {
  date: string;
  time: string;
  confidence: number;
  reasoning: string;
}

export const useSmartScheduling = () => {
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSuggestions = async (
    eventType: string,
    duration: number,
    expectedAttendees: number,
    preferences?: string
  ) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('smart-scheduling', {
        body: {
          eventType,
          duration,
          expectedAttendees,
          preferences
        }
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
      
      toast({
        title: "Smart Suggestions Generated",
        description: `Found ${data.suggestions.length} optimal time slots for your event.`,
      });

    } catch (error) {
      console.error('Smart scheduling error:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    generateSuggestions
  };
};