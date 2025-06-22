import React from 'react';
import { DailyLog } from '../types';
import { InsightsGenerator } from '../utils/insightsGenerator';
// Funky icons for a funky panel!
import { Zap, Lightbulb, Sparkles, AlertTriangle, PartyPopper, Clock, Award } from 'lucide-react';

interface InsightsPanelProps {
  dailyLog: DailyLog;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ dailyLog }) => {
  const insightsGenerator = new InsightsGenerator();
  const insights = insightsGenerator.generateInsights(dailyLog);

  const getInsightStyle = (type: string, score: number) => {
    // Default to a neutral style
    let style = {
      icon: Lightbulb,
      color: 'amber',
      gradient: 'from-amber-400 to-orange-500',
    };

    if (score >= 80) {
      style = { icon: Zap, color: 'teal', gradient: 'from-teal-400 to-cyan-500' };
    } else if (score < 50) {
      style = { icon: AlertTriangle, color: 'rose', gradient: 'from-rose-500 to-red-600' };
    }

    // Override for specific types for more thematic icons
    if (type === 'productive_time') style.icon = Award;
    if (type === 'category_balance') style.icon = Sparkles;

    return {
      Icon: style.icon,
      colors: {
        bg: `bg-${style.color}-50`,
        text: `text-${style.color}-700`,
        border: `border-${style.color}-200`,
        progress: `bg-${style.color}-500`,
        gradient: style.gradient
      }
    };
  };

  return (
    <div className="space-y-6">
      {dailyLog.activities.length > 0 ? (
        <>
          {/* Main Insights as Fun Cards */}
          <div className="space-y-4">
            {insights.slice(0, 4).map((insight, index) => {
              const { Icon, colors } = getInsightStyle(insight.type, insight.score);
              
              return (
                <div
                  key={index}
                  className={`${colors.bg} ${colors.border} border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-rotate-1`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-extrabold text-lg ${colors.text}`}>
                        {insight.title}
                      </h4>
                      <p className="text-slate-600 text-sm mt-1">
                        {insight.description}
                      </p>
                      
                      {/* Recommendation */}
                      <div className="mt-4 bg-white/70 rounded-lg p-3 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 font-medium italic">
                          {insight.recommendation}
                        </p>
                      </div>

                      {/* Impact Meter */}
                      <div className="mt-4 flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-500">IMPACT</span>
                         <div className="flex items-center space-x-2 w-1/2">
                           <div className="w-full bg-slate-200 rounded-full h-3">
                             <div
                               className={`h-3 rounded-full transition-all duration-500 ${colors.progress}`}
                               style={{ width: `${insight.score}%` }}
                             />
                           </div>
                           <span className="text-sm text-slate-600 font-bold w-10 text-right">
                             {insight.score}
                           </span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Encouragement Card */}
          <div className="bg-gradient-to-r from-amber-400 to-rose-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-extrabold text-2xl text-white mb-1">
              Keep on Blending!
            </h4>
            <p className="text-white/90 text-sm">
              Awesome job checking out your daily recipe. Every mix you log makes the next day even tastier!
            </p>
          </div>
        </>
      ) : (
        <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl">
          <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Tasting Notes Yet!</h3>
          <p className="text-sm mt-1">Blend your day first to get some delicious, personalized tips.</p>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;