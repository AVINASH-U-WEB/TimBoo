import React, { useState } from 'react';
import { DailyLog, Activity } from './types';
import { ActivityParser } from './utils/activityParser';
import { InsightsGenerator } from './utils/insightsGenerator';
import ConversationalInput from './components/ConversationalInput';
import Dashboard from './components/Dashboard';
// Funky icons!
import { Beaker, ArrowLeft, Zap, Flame } from 'lucide-react';

function App() {
  const [currentLog, setCurrentLog] = useState<DailyLog | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const activityParser = new ActivityParser();
  const insightsGenerator = new InsightsGenerator();

  const handleInputSubmit = async (input: string) => {
    setIsProcessing(true);
    
    // Simulate a fun "blending" time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const activities: Activity[] = activityParser.parseInput(input);
      const totalTime = activities.reduce((sum, activity) => sum + activity.estimatedTime, 0);
      
      const dailyLog: DailyLog = {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        rawInput: input,
        activities,
        totalTime,
        overallProductivity: calculateOverallProductivity(activities),
        insights: insightsGenerator.generateInsights({
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          rawInput: input,
          activities,
          totalTime,
          overallProductivity: 0,
          insights: [],
          createdAt: new Date()
        } as DailyLog).map(insight => insight.title),
        createdAt: new Date()
      };
      
      setCurrentLog(dailyLog);
      setShowDashboard(true);
    } catch (error) {
      console.error('Error processing input:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateOverallProductivity = (activities: Activity[]): number => {
    if (activities.length === 0) return 0;
    
    const productivityScore = activities.reduce((sum, activity) => {
      const score = activity.productivityLevel === 'high' ? 3 : 
                   activity.productivityLevel === 'medium' ? 2 : 1;
      return sum + score;
    }, 0);
    
    return Math.round((productivityScore / (activities.length * 3)) * 100);
  };

  const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleStartNew = () => {
    setShowDashboard(false);
    setCurrentLog(null);
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Header */}
      <header className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-yellow-300 rounded-2xl flex items-center justify-center transform -rotate-12 shadow-md">
                <Beaker className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                TimBoo
              </h1>
              <p className="text-md text-slate-500 italic">Blend your day, see what's inside!</p>
            </div>
          </div>
          
          {showDashboard && (
            <button
              onClick={handleStartNew}
              className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold rounded-full hover:scale-105 hover:-rotate-3 transition-transform duration-200 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Blend Another Day</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showDashboard ? (
          <div className="space-y-12">
            {/* Welcome Section */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold transform -rotate-2">
                <Zap className="w-5 h-5" />
                <span>Time to get zesty!</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-800 leading-tight tracking-tighter">
                What's In Your Daily Mix?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Just spill the beans about your day. I’ll whizz it all up into a colorful chart, 
                pinpoint your power moments, and serve you some tasty insights!
              </p>
            </div>

            {/* Input Section */}
            <div className="max-w-4xl mx-auto text-center">
              {isProcessing && (
                <div className="mb-4 text-xl font-bold text-amber-600 animate-bounce">
                  Whizzing up your day... 🌪️
                </div>
              )}
              <ConversationalInput 
                onSubmit={handleInputSubmit} 
                isProcessing={isProcessing}
              />
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-16">
              <div className="bg-yellow-100 rounded-3xl p-8 text-center transform rotate-2 hover:rotate-0 hover:scale-105 transition-transform duration-300 shadow-lg border-2 border-yellow-200">
                <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white">
                  <Beaker className="w-8 h-8 text-yellow-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Effortless Entry</h3>
                <p className="text-slate-600">No boring forms! Just tell me your story, I'll figure out the deets.</p>
              </div>
              
              <div className="bg-teal-100 rounded-3xl p-8 text-center transform -rotate-1 hover:rotate-0 hover:scale-105 transition-transform duration-300 shadow-lg border-2 border-teal-200">
                <div className="w-16 h-16 bg-teal-300 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white">
                  <Zap className="w-8 h-8 text-teal-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Instant Insights</h3>
                <p className="text-slate-600">Discover your secret productivity sauce and get tips to make tomorrow even better.</p>
              </div>
              
              <div className="bg-rose-100 rounded-3xl p-8 text-center transform rotate-1 hover:rotate-0 hover:scale-105 transition-transform duration-300 shadow-lg border-2 border-rose-200">
                <div className="w-16 h-16 bg-rose-300 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white">
                  <Flame className="w-8 h-8 text-rose-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Vibrant Visuals</h3>
                <p className="text-slate-600">See your day like never before with groovy charts and colorful breakdowns.</p>
              </div>
            </div>
          </div>
        ) : (
          currentLog && (
            <div className="space-y-8">
              {/* Summary Header */}
              <div className="bg-gradient-to-br from-green-300 to-cyan-300 rounded-3xl shadow-2xl p-8 transform -rotate-1">
                <div className="text-center space-y-4 transform rotate-1">
                  <div className="inline-flex items-center space-x-2 bg-white/50 text-green-900 px-5 py-2 rounded-full text-md font-bold">
                    <Zap className="w-5 h-5" />
                    <span>Your Day-Mix is Ready!</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
                    Check Out This Delicious Blend!
                  </h2>
                  <p className="text-lg font-medium text-slate-700">
                    {new Date(currentLog.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Dashboard */}
              <Dashboard dailyLog={currentLog} />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-500">
            <p>Made with 🤪 and a bit of data magic ✨</p>
            <p className="text-sm mt-1">TimBoo © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;