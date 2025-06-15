
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      console.log('Fetching analytics data...')
      
      // Get all events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError)
        throw eventsError
      }

      // Get all guests
      const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select('*')
      
      if (guestsError) {
        console.error('Error fetching guests:', guestsError)
        throw guestsError
      }

      console.log('Events:', events)
      console.log('Guests:', guests)

      // Calculate metrics
      const totalEvents = events?.length || 0
      const totalGuests = guests?.length || 0
      const confirmedGuests = guests?.filter(g => g.status === 'confirmed').length || 0
      const pendingGuests = guests?.filter(g => g.status === 'pending').length || 0
      const declinedGuests = guests?.filter(g => g.status === 'declined').length || 0
      
      // Calculate total capacity and registered
      const totalCapacity = events?.reduce((sum, event) => sum + (event.capacity || 0), 0) || 0
      const totalRegistered = events?.reduce((sum, event) => sum + (event.registered || 0), 0) || 0
      
      // Calculate attendance rate
      const attendanceRate = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0
      
      // Calculate conversion rate (confirmed / total guests)
      const conversionRate = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0
      
      // Calculate revenue (simple calculation: $50 per confirmed guest)
      const revenue = confirmedGuests * 50
      
      // Group events by month for trends
      const monthlyData = events?.reduce((acc, event) => {
        const date = new Date(event.date)
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
        
        if (!acc[monthKey]) {
          acc[monthKey] = { month: monthKey, events: 0, attendees: 0 }
        }
        
        acc[monthKey].events += 1
        acc[monthKey].attendees += event.registered || 0
        
        return acc
      }, {} as Record<string, { month: string; events: number; attendees: number }>) || {}
      
      const monthlyTrends = Object.values(monthlyData)
      
      // RSVP distribution
      const rsvpData = [
        { 
          name: 'Confirmed', 
          value: totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0, 
          color: '#10B981' 
        },
        { 
          name: 'Pending', 
          value: totalGuests > 0 ? Math.round((pendingGuests / totalGuests) * 100) : 0, 
          color: '#F59E0B' 
        },
        { 
          name: 'Declined', 
          value: totalGuests > 0 ? Math.round((declinedGuests / totalGuests) * 100) : 0, 
          color: '#EF4444' 
        }
      ]
      
      // Event types breakdown (based on event titles/descriptions)
      const eventTypes = [
        { type: 'All Events', count: totalEvents, percentage: 100 }
      ]

      return {
        totalEvents,
        totalGuests,
        confirmedGuests,
        pendingGuests,
        declinedGuests,
        totalCapacity,
        totalRegistered,
        attendanceRate,
        conversionRate,
        revenue,
        monthlyTrends,
        rsvpData,
        eventTypes
      }
    }
  })
}
