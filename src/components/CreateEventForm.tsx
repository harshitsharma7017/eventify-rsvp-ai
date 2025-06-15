
import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCreateEvent } from '@/hooks/useEvents';

interface CreateEventFormProps {
  onClose: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const createEvent = useCreateEvent();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    isVirtual: false
  });
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateAIInvite = async () => {
    setIsGeneratingInvite(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const invite = `🎉 You're Invited to ${formData.title}!

Dear Guest,

We're excited to invite you to ${formData.title}, taking place on ${formData.date} at ${formData.time}.

${formData.description}

📅 When: ${formData.date} at ${formData.time}
📍 Where: ${formData.location}
👥 Capacity: ${formData.capacity} attendees

This promises to be an incredible event, and we'd love to have you join us! Please RSVP at your earliest convenience.

Looking forward to seeing you there!

Best regards,
The EventHub Team`;

      setGeneratedInvite(invite);
      setIsGeneratingInvite(false);
      
      toast({
        title: "AI Invite Generated!",
        description: "Your personalized email invitation has been created.",
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create event object
    const eventData = {
      title: formData.title,
      description: formData.description || null,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      capacity: parseInt(formData.capacity) || 100,
      status: 'upcoming' as const
    };

    createEvent.mutate(eventData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Event
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event"
                  rows={3}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event location"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Max attendees"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* AI Invite Generation */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Email Invitation</h3>
                <Button
                  type="button"
                  onClick={generateAIInvite}
                  disabled={isGeneratingInvite || !formData.title}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingInvite ? 'Generating...' : 'Generate Invite'}
                </Button>
              </div>

              {generatedInvite && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <Label>Generated Email Invitation:</Label>
                  <Textarea
                    value={generatedInvite}
                    onChange={(e) => setGeneratedInvite(e.target.value)}
                    rows={8}
                    className="mt-2 font-mono text-sm"
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEvent.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createEvent.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventForm;
