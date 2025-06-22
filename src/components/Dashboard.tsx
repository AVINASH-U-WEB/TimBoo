import React from 'react';
import { DailyLog, TimeBlock } from '../types';
import { defaultCategories } from '../data/categories';
import { Clock, TrendingUp, Activity, Brain } from 'lucide-react';
import TimeBreakdown from './TimeBreakdown';
import ProductivityChart from './ProductivityChart';
import ActivityMindMap from './ActivityMindMap';
import InsightsPanel from './InsightsPanel';
import TimBooSummary from './TimBooSummary';

interface DashboardProps {
  dailyLog: DailyLog;
}

const Dashboard: React.FC<DashboardProps> = ({ dailyLog }) => {
  const timeBlocks: TimeBlock[] = defaultCategories.map(category => {
    const categoryActivities = dailyLog.activities.filter(a => a.category.id === category.id);
    const totalTime = categoryActivities.reduce((sum, a) => sum + a.estimatedTime, 0);
    
    return {
      category,
      totalTime,
      activities: categoryActivities,
      percentage: dailyLog.totalTime > 0 ? (totalTime / dailyLog.totalTime) * 100 : 0
    };
  }).filter(block => block.totalTime > 0);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const averageProductivity = dailyLog.activities.length > 0 
    ? dailyLog.activities.reduce((sum, a) => {
        const score = a.productivityLevel === 'high' ? 3 : a.productivityLevel === 'medium' ? 2 : 1;
        return sum + score;
      }, 0) / dailyLog.activities.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* TimBoo's Personal Summary */}
      <TimBooSummary dailyLog={dailyLog} />

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Time Logged</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(dailyLog.totalTime)}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activities Logged</p>
              <p className="text-2xl font-bold text-gray-800">{dailyLog.activities.length}</p>
            </div>
            <Activity className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productivity Score</p>
              <p className="text-2xl font-bold text-gray-800">{(averageProductivity * 33.33).toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories Used</p>
              <p className="text-2xl font-bold text-gray-800">{timeBlocks.length}</p>
            </div>
            <Brain className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Time Breakdown</h3>
          <TimeBreakdown timeBlocks={timeBlocks} />
        </div>

        {/* Productivity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Productivity Levels</h3>
          <ProductivityChart activities={dailyLog.activities} />
        </div>
      </div>

      {/* Mind Map */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Activity Flow</h3>
        <ActivityMindMap activities={dailyLog.activities} />
      </div>

      {/* Insights */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Deep Dive Insights</h3>
        <InsightsPanel dailyLog={dailyLog} />
      </div>
    </div>
  );
};

export default Dashboard;