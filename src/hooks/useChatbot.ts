import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const sendMessage = async (
    message: string, 
    eventId: string, 
    guestEmail?: string, 
    guestName?: string
  ) => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message,
          eventId,
          guestEmail,
          guestName,
          conversationId
        }
      });

      if (error) throw error;

      setConversationId(data.conversationId);
      
      // Add AI response to UI
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: data.response,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  };
};