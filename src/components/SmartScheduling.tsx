import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSmartScheduling } from '@/hooks/useSmartScheduling';

interface SmartSchedulingProps {
  onSelectDateTime?: (date: string, time: string) => void;
}

const SmartScheduling: React.FC<SmartSchedulingProps> = ({ onSelectDateTime }) => {
  const [eventType, setEventType] = useState('');
  const [duration, setDuration] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState('');
  const [preferences, setPreferences] = useState('');
  
  const { suggestions, isLoading, generateSuggestions } = useSmartScheduling();

  const handleGenerate = async () => {
    if (!eventType || !duration || !expectedAttendees) return;
    
    await generateSuggestions(
      eventType,
      parseInt(duration),
      parseInt(expectedAttendees),
      preferences
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  return (
    <Card className="bg-slate-900/60 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-200">
          <Sparkles className="w-5 h-5" />
          Smart Scheduling Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Event Type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="corporate">Corporate Meeting</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="party">Party</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Duration (hours)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2"
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Expected Attendees</Label>
            <Input
              type="number"
              value={expectedAttendees}
              onChange={(e) => setExpectedAttendees(e.target.value)}
              placeholder="e.g., 50"
              className="bg-slate-800 border-slate-700 text-slate-200"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-300">Additional Preferences (Optional)</Label>
          <Textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., Prefer weekdays, avoid holidays, morning sessions..."
            className="bg-slate-800 border-slate-700 text-slate-200"
          />
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !eventType || !duration || !expectedAttendees}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          {isLoading ? (
            'Generating AI Suggestions...'
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Generate Smart Suggestions
            </>
          )}
        </Button>
        
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-200 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              AI Recommendations
            </h3>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium text-slate-200">
                              {formatDate(suggestion.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span className="font-medium text-slate-200">
                              {formatTime(suggestion.time)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-400 mb-3">
                          {suggestion.reasoning}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${getConfidenceColor(suggestion.confidence)} text-white`}
                          >
                            {suggestion.confidence}% Confidence
                          </Badge>
                        </div>
                      </div>
                      
                      {onSelectDateTime && (
                        <Button
                          size="sm"
                          onClick={() => onSelectDateTime(suggestion.date, suggestion.time)}
                          className="ml-4 bg-cyan-600 hover:bg-cyan-700"
                        >
                          Select
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartScheduling;