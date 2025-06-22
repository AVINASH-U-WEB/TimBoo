import React from 'react';
import { Activity } from '../types';
import { Zap, Flame, Leaf } from 'lucide-react'; // Thematic icons!

interface ProductivityChartProps {
  activities: Activity[];
}

const ProductivityChart: React.FC<ProductivityChartProps> = ({ activities }) => {
  const productivityData = {
    high: activities.filter(a => a.productivityLevel === 'high'),
    medium: activities.filter(a => a.productivityLevel === 'medium'),
    low: activities.filter(a => a.productivityLevel === 'low')
  };

  const totalTime = activities.reduce((sum, a) => sum + a.estimatedTime, 0);
  
  const getPercentage = (level: keyof typeof productivityData) => {
    const time = productivityData[level].reduce((sum, a) => sum + a.estimatedTime, 0);
    return totalTime > 0 ? (time / totalTime) * 100 : 0;
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

  const levels = [
    { 
      key: 'high' as const, 
      label: 'Full Power', 
      Icon: Zap,
      gradient: 'from-teal-400 to-cyan-500',
      time: productivityData.high.reduce((sum, a) => sum + a.estimatedTime, 0)
    },
    { 
      key: 'medium' as const, 
      label: 'Steady Groove', 
      Icon: Flame,
      gradient: 'from-amber-400 to-orange-500',
      time: productivityData.medium.reduce((sum, a) => sum + a.estimatedTime, 0)
    },
    { 
      key: 'low' as const, 
      label: 'Chill & Recharge', 
      Icon: Leaf,
      gradient: 'from-rose-400 to-pink-500',
      time: productivityData.low.reduce((sum, a) => sum + a.estimatedTime, 0)
    }
  ];

  return (
    <div className="w-full">
      {activities.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {levels.map((level) => {
            const percentage = getPercentage(level.key);
            
            return (
              <div key={level.key} className="text-center">
                {/* Gauge Label */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <level.Icon className="w-5 h-5 text-slate-600" />
                  <h4 className="font-bold text-slate-700">{level.label}</h4>
                </div>
                
                {/* The Gauge */}
                <div className="relative w-full h-48 sm:h-56 bg-slate-100 rounded-2xl flex flex-col justify-end overflow-hidden shadow-inner border border-slate-200">
                  <div
                    className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${level.gradient} transition-all duration-1000 ease-out`}
                    style={{ height: `${percentage}%` }}
                  />
                  <div className="relative z-10 p-2 text-white">
                    <p className="font-bold text-xl sm:text-2xl drop-shadow-md">{percentage.toFixed(0)}%</p>
                  </div>
                </div>
                
                {/* Time Readout */}
                <div className="mt-3 font-semibold text-slate-600">
                  {formatTime(level.time)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-16 bg-slate-50 rounded-2xl">
          <Zap className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Your Energy Flow is Waiting!</h3>
          <p className="text-sm mt-1">Blend your day to see your energy levels.</p>
        </div>
      )}
    </div>
  );
};

export default ProductivityChart;