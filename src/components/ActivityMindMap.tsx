import React, { useMemo } from 'react';
import { Activity } from '../types';
import * as Icons from 'lucide-react';
import { Flame, Zap, Leaf } from 'lucide-react'; // For the legend

interface ActivityMindMapProps {
  activities: Activity[];
}

const ActivityMindMap: React.FC<ActivityMindMapProps> = ({ activities }) => {
  const mindMapData = useMemo(() => {
    if (activities.length === 0) return [];

    const categoryGroups = activities.reduce((groups, activity) => {
      const categoryId = activity.category.id;
      if (!groups[categoryId]) {
        groups[categoryId] = {
          category: activity.category,
          activities: [],
          totalTime: 0
        };
      }
      groups[categoryId].activities.push(activity);
      groups[categoryId].totalTime += activity.estimatedTime;
      return groups;
    }, {} as Record<string, { category: any; activities: Activity[]; totalTime: number }>);

    return Object.values(categoryGroups).sort((a, b) => b.totalTime - a.totalTime);
  }, [activities]);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Circle;
    return IconComponent;
  };

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

  const getProductivityStyle = (level: string) => {
    switch (level) {
      case 'high': return 'bg-teal-400 border-teal-500'; // High energy
      case 'medium': return 'bg-amber-400 border-amber-500'; // Medium energy
      case 'low': return 'bg-rose-400 border-rose-500'; // Low energy
      default: return 'bg-slate-400 border-slate-500';
    }
  };
  
  const maxTime = useMemo(() => Math.max(...mindMapData.map(group => group.totalTime), 1), [mindMapData]);

  return (
    <div className="w-full">
      {mindMapData.length > 0 ? (
        <div className="space-y-10">
          {/* Bubbles Container */}
          <div className="flex flex-wrap justify-center items-end gap-6 md:gap-8 p-4">
            {mindMapData.map((group, index) => {
              const IconComponent = getIcon(group.category.icon);
              const timeRatio = group.totalTime / maxTime;
              const bubbleHeight = 160 + 240 * timeRatio; // min-h: 160px, max-h: 400px
              const randomRotation = useMemo(() => Math.random() * 4 - 2, []); // -2 to 2 degrees

              return (
                <div
                  key={group.category.id}
                  className="w-[280px] rounded-3xl shadow-xl flex flex-col transition-all duration-300 hover:!rotate-0 hover:scale-105 hover:shadow-2xl"
                  style={{ 
                    height: `${bubbleHeight}px`,
                    backgroundColor: group.category.color,
                    transform: `rotate(${randomRotation}deg)`
                  }}
                >
                  {/* Bubble Header */}
                  <div className="p-4 text-white flex items-center space-x-3 border-b-2 border-white/20">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex-shrink-0 flex items-center justify-center">
                       <IconComponent className="w-7 h-7" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-lg truncate">{group.category.name}</h4>
                      <p className="font-medium text-sm bg-black/20 px-2 py-0.5 rounded-full inline-block">
                        {formatTime(group.totalTime)}
                      </p>
                    </div>
                  </div>

                  {/* Activities List */}
                  <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-b-3xl p-3 overflow-y-auto space-y-2">
                    {group.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="bg-white/80 rounded-lg p-2.5 shadow-sm flex items-center justify-between"
                      >
                        <p className="text-sm text-slate-800 flex-1 leading-snug">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 ml-2">
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${getProductivityStyle(activity.productivityLevel)}`}
                            title={`${activity.productivityLevel} energy`}
                          />
                          <span className="text-xs text-slate-600 font-semibold w-10 text-right">
                            {formatTime(activity.estimatedTime)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="bg-slate-100 rounded-2xl p-4 max-w-md mx-auto transform -rotate-1">
            <h5 className="font-bold text-slate-700 mb-3 text-center">Energy Meter</h5>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-teal-400 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-slate-600 font-medium">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-slate-600 font-medium">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center">
                  <Leaf className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-slate-600 font-medium">Low</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 py-16 bg-slate-50 rounded-3xl">
          <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6 transform -rotate-12">
            <Icons.Beaker className="w-10 h-10 text-yellow-700" />
          </div>
          <h3 className="text-2xl font-bold text-slate-700">Your blend is empty!</h3>
          <p className="text-md mt-2">Describe your day to mix up a beautiful activity chart.</p>
        </div>
      )}
    </div>
  );
};

export default ActivityMindMap;