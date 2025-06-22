import React from 'react';
import { DailyLog } from '../types';
import { TimBooPersonality } from '../utils/timBooPersonality';
// Funky, thematic icons for the summary!
import { Sparkles, Heart, Rocket, Coffee, Lightbulb } from 'lucide-react';

interface TimBooSummaryProps {
  dailyLog: DailyLog;
}

const TimBooSummary: React.FC<TimBooSummaryProps> = ({ dailyLog }) => {
  const timBoo = new TimBooPersonality();
  
  const moodReflection = timBoo.generateMoodReflection(
    dailyLog.activities, 
    dailyLog.totalTime, 
    dailyLog.overallProductivity
  );
  
  const tomorrowSuggestions = timBoo.generateTomorrowSuggestions(
    dailyLog.activities, 
    []
  );

  const getTop3Activities = () => {
    return dailyLog.activities
      .sort((a, b) => b.estimatedTime - a.estimatedTime)
      .slice(0, 3);
  };
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };
  
  const getProductivityStyle = (level: string) => {
    switch (level) {
      case 'high': return 'text-teal-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-white h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0 transform -rotate-12 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Your Daily Blend Breakdown</h2>
          <p className="text-slate-600">The chef's notes on today's mix! 👨‍🍳</p>
        </div>
      </div>

      {/* Flavor Profile (Mood Reflection) */}
      <div className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <Heart className="w-8 h-8 text-rose-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-rose-800">Today's Flavor Profile</h3>
            <p className="text-lg text-slate-700 italic">"{moodReflection}"</p>
          </div>
        </div>
      </div>
      
      {/* Top 3 Ingredients */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3">🏆 Your Top 3 Ingredients</h3>
        <div className="space-y-3">
          {getTop3Activities().map((activity, index) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-md flex-shrink-0 transform -rotate-6">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium leading-snug">
                  {activity.description}
                </p>
                <p className="text-sm text-slate-500">
                  {activity.category.name} • {formatTime(activity.estimatedTime)}
                </p>
              </div>
              <div className={`text-sm font-bold ${getProductivityStyle(activity.productivityLevel)}`}>
                {activity.productivityLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Next Time's Recipe */}
      {tomorrowSuggestions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">💡 Next Time's Recipe</h3>
          <div className="space-y-2">
            {tomorrowSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 text-sm font-medium">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimBooSummary;