import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, eventId, guestEmail, guestName, conversationId } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      conversation = data;
    } else {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          event_id: eventId,
          guest_email: guestEmail,
          guest_name: guestName
        })
        .select()
        .single();
      
      if (error) throw error;
      conversation = data;
    }

    // Get event details for context
    const { data: event } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender: 'user',
        message: message
      });

    // Prepare context for AI
    const eventContext = `Event: ${event.title}
Date: ${event.date} at ${event.time}
Location: ${event.location}
Capacity: ${event.capacity}
Currently registered: ${event.registered}
Description: ${event.description || 'No description provided'}`;

    const conversationHistory = messages?.map(m => 
      `${m.sender === 'user' ? 'Guest' : 'Assistant'}: ${m.message}`
    ).join('\n') || '';

    const systemPrompt = `You are an AI assistant for Eventify, helping guests with RSVP and event-related questions.

Event Details:
${eventContext}

You can help with:
- RSVP confirmations and changes
- Event details and logistics
- Special requests (dietary restrictions, accessibility needs)
- Waitlist management
- Plus-one registrations
- General event questions

Be helpful, professional, and concise. If you need to perform actions like updating RSVPs, ask for confirmation first.

Previous conversation:
${conversationHistory}`;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save AI response
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender: 'ai',
        message: aiResponse
      });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: conversation.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});