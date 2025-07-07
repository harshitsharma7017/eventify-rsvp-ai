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
    const { eventType, duration, expectedAttendees, preferences } = await req.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get historical data for similar events
    const { data: historicalEvents } = await supabase
      .from('events')
      .select('date, time, registered, capacity, event_type')
      .eq('event_type', eventType)
      .gte('date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const prompt = `As an AI scheduling assistant, suggest optimal dates and times for an event with these details:
- Event Type: ${eventType}
- Expected Duration: ${duration} hours
- Expected Attendees: ${expectedAttendees}
- Preferences: ${preferences || 'None specified'}

Historical data from similar events:
${historicalEvents?.map(e => `${e.event_type}: ${e.date} ${e.time}, ${e.registered}/${e.capacity} attended`).join('\n') || 'No historical data available'}

Consider these factors:
1. Day of the week preferences for ${eventType} events
2. Time of day optimization for ${expectedAttendees} attendees
3. Seasonal considerations
4. Common scheduling conflicts
5. Historical attendance patterns

Provide 3-5 specific date/time suggestions with confidence scores (0-100) and reasoning for each.
Format as JSON: {"suggestions": [{"date": "YYYY-MM-DD", "time": "HH:MM", "confidence": 85, "reasoning": "explanation"}]}`;

    if (!openAIApiKey) {
      // Fallback suggestions based on event type
      const fallbackSuggestions = generateFallbackSuggestions(eventType);
      return new Response(JSON.stringify({ suggestions: fallbackSuggestions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in smart-scheduling function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackSuggestions(eventType: string) {
  const now = new Date();
  const suggestions = [];
  
  // Basic rule-based suggestions
  const timeSlots = eventType === 'corporate' || eventType === 'workshop' 
    ? ['09:00', '14:00'] 
    : eventType === 'party' 
    ? ['19:00', '20:00'] 
    : ['10:00', '15:00'];
  
  for (let i = 7; i < 35; i += 7) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    suggestions.push({
      date: date.toISOString().split('T')[0],
      time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      confidence: 70,
      reasoning: `Optimal ${eventType} timing based on industry standards`
    });
  }
  
  return suggestions.slice(0, 3);
}