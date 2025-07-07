import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const { action, eventId, guestData } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case 'add_to_waitlist':
        // Get current waitlist position
        const { count } = await supabase
          .from('waitlist')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId);

        const { data: waitlistEntry, error: waitlistError } = await supabase
          .from('waitlist')
          .insert({
            event_id: eventId,
            name: guestData.name,
            email: guestData.email,
            category: guestData.category || 'regular',
            position: (count || 0) + 1
          })
          .select()
          .single();

        if (waitlistError) throw waitlistError;

        return new Response(JSON.stringify({ 
          success: true, 
          position: waitlistEntry.position 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'promote_from_waitlist':
        // Get event capacity info
        const { data: event } = await supabase
          .from('events')
          .select('capacity, registered')
          .eq('id', eventId)
          .single();

        if (!event || event.registered >= event.capacity) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'Event is still at capacity' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Get next person on waitlist
        const { data: nextInWaitlist } = await supabase
          .from('waitlist')
          .select('*')
          .eq('event_id', eventId)
          .is('promoted_at', null)
          .order('position', { ascending: true })
          .limit(1)
          .single();

        if (!nextInWaitlist) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'No one on waitlist' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Promote to guest list
        const { error: guestError } = await supabase
          .from('guests')
          .insert({
            event_id: eventId,
            name: nextInWaitlist.name,
            email: nextInWaitlist.email,
            status: 'confirmed',
            category: nextInWaitlist.category,
            event_title: event.title || 'Event'
          });

        if (guestError) throw guestError;

        // Update waitlist entry
        await supabase
          .from('waitlist')
          .update({ promoted_at: new Date().toISOString() })
          .eq('id', nextInWaitlist.id);

        // Update event registration count
        await supabase
          .from('events')
          .update({ registered: event.registered + 1 })
          .eq('id', eventId);

        return new Response(JSON.stringify({ 
          success: true,
          promotedGuest: nextInWaitlist
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_waitlist':
        const { data: waitlist } = await supabase
          .from('waitlist')
          .select('*')
          .eq('event_id', eventId)
          .is('promoted_at', null)
          .order('position', { ascending: true });

        return new Response(JSON.stringify({ waitlist }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in manage-waitlist function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});