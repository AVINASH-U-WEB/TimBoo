import React from 'react';
import { TimeBlock } from '../types';
import * as Icons from 'lucide-react';

interface TimeBreakdownProps {
  timeBlocks: TimeBlock[];
}

const TimeBreakdown: React.FC<TimeBreakdownProps> = ({ timeBlocks }) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    }
    if (hours > 0) {
      return `${hours}h`;
    }
    return `${mins}m`;
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Circle;
    return IconComponent;
  };

  return (
    <div className="space-y-3">
      {timeBlocks.length > 0 ? (
        timeBlocks
          .sort((a, b) => b.totalTime - a.totalTime)
          .map((block) => {
            const IconComponent = getIcon(block.category.icon);
            return (
              <div key={block.category.id} className="bg-slate-50 p-3 rounded-xl flex items-center gap-4 border border-slate-100">
                {/* Thematic Icon */}
                <div 
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md"
                  style={{ backgroundColor: block.category.color }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  {/* Category Name & Time */}
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-800">{block.category.name}</span>
                    <span className="text-sm font-semibold text-slate-600">{formatTime(block.totalTime)}</span>
                  </div>
                  
                  {/* Chunky Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        backgroundColor: block.category.color,
                        width: `${block.percentage}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
      ) : (
        <div className="text-center text-slate-500 py-16 bg-slate-50 rounded-2xl">
          <Icons.Blocks className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Your Ingredient Mix is Empty!</h3>
          <p className="text-sm mt-1">Describe your day to see what you blended.</p>
        </div>
      )}
    </div>
  );
};

export default TimeBreakdown;