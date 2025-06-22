import { Activity, DailyLog, ProductivityInsight, TimeBlock } from '../types';

export class InsightsGenerator {
  generateInsights(dailyLog: DailyLog): ProductivityInsight[] {
    const insights: ProductivityInsight[] = [];
    
    insights.push(...this.analyzeProductiveTime(dailyLog));
    insights.push(...this.analyzeTimeWaste(dailyLog));
    insights.push(...this.analyzeTaskSwitching(dailyLog));
    insights.push(...this.analyzeCategoryBalance(dailyLog));
    
    return insights.sort((a, b) => b.score - a.score);
  }

  private analyzeProductiveTime(dailyLog: DailyLog): ProductivityInsight[] {
    const highProductivityActivities = dailyLog.activities.filter(a => a.productivityLevel === 'high');
    const totalHighProductivityTime = highProductivityActivities.reduce((sum, a) => sum + a.estimatedTime, 0);
    const productivityPercentage = (totalHighProductivityTime / dailyLog.totalTime) * 100;
    
    const insights: ProductivityInsight[] = [];
    
    if (productivityPercentage > 60) {
      insights.push({
        type: 'productive_time',
        title: 'Excellent Productivity!',
        description: `You spent ${Math.round(productivityPercentage)}% of your day in high-productivity activities.`,
        score: 95,
        recommendation: 'Keep up the great work! Try to identify what made today so productive.'
      });
    } else if (productivityPercentage > 30) {
      insights.push({
        type: 'productive_time',
        title: 'Good Productivity Balance',
        description: `${Math.round(productivityPercentage)}% of your time was highly productive.`,
        score: 70,
        recommendation: 'Consider what you could adjust to increase your productive time.'
      });
    } else {
      insights.push({
        type: 'productive_time',
        title: 'Room for Improvement',
        description: `Only ${Math.round(productivityPercentage)}% of your time was highly productive.`,
        score: 40,
        recommendation: 'Focus on identifying and eliminating low-value activities.'
      });
    }
    
    return insights;
  }

  private analyzeTimeWaste(dailyLog: DailyLog): ProductivityInsight[] {
    const distractionActivities = dailyLog.activities.filter(a => a.category.id === 'distraction');
    const totalDistractionTime = distractionActivities.reduce((sum, a) => sum + a.estimatedTime, 0);
    const distractionPercentage = (totalDistractionTime / dailyLog.totalTime) * 100;
    
    const insights: ProductivityInsight[] = [];
    
    if (distractionPercentage < 10) {
      insights.push({
        type: 'wasted_time',
        title: 'Minimal Distractions',
        description: `Only ${Math.round(distractionPercentage)}% of your time was spent on distractions.`,
        score: 90,
        recommendation: 'Excellent focus! Maintain this discipline.'
      });
    } else if (distractionPercentage < 25) {
      insights.push({
        type: 'wasted_time',
        title: 'Manageable Distractions',
        description: `${Math.round(distractionPercentage)}% of your time included distractions.`,
        score: 60,
        recommendation: 'Try to reduce distractions by 5-10 minutes per day.'
      });
    } else {
      insights.push({
        type: 'wasted_time',
        title: 'High Distraction Level',
        description: `${Math.round(distractionPercentage)}% of your time was spent on distractions.`,
        score: 30,
        recommendation: 'Consider using focus techniques like the Pomodoro method.'
      });
    }
    
    return insights;
  }

  private analyzeTaskSwitching(dailyLog: DailyLog): ProductivityInsight[] {
    const categoryChanges = this.countCategoryChanges(dailyLog.activities);
    const switchingFrequency = categoryChanges / Math.max(1, dailyLog.activities.length - 1);
    
    const insights: ProductivityInsight[] = [];
    
    if (switchingFrequency < 0.3) {
      insights.push({
        type: 'task_switching',
        title: 'Good Focus Flow',
        description: 'You maintained good focus with minimal task switching.',
        score: 85,
        recommendation: 'Continue batching similar activities together.'
      });
    } else if (switchingFrequency < 0.6) {
      insights.push({
        type: 'task_switching',
        title: 'Moderate Task Switching',
        description: 'You switched between different types of tasks regularly.',
        score: 60,
        recommendation: 'Try to group similar activities to reduce context switching.'
      });
    } else {
      insights.push({
        type: 'task_switching',
        title: 'High Task Switching',
        description: 'You frequently switched between different types of activities.',
        score: 35,
        recommendation: 'Consider time-blocking to reduce context switching costs.'
      });
    }
    
    return insights;
  }

  private analyzeCategoryBalance(dailyLog: DailyLog): ProductivityInsight[] {
    const workTime = dailyLog.activities
      .filter(a => a.category.id === 'work')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const breakTime = dailyLog.activities
      .filter(a => a.category.id === 'break' || a.category.id === 'exercise')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const workBreakRatio = workTime > 0 ? breakTime / workTime : 0;
    
    const insights: ProductivityInsight[] = [];
    
    if (workBreakRatio > 0.15 && workBreakRatio < 0.4) {
      insights.push({
        type: 'category_balance',
        title: 'Good Work-Life Balance',
        description: 'You maintained a healthy balance between work and breaks.',
        score: 80,
        recommendation: 'Keep maintaining this healthy balance.'
      });
    } else if (workBreakRatio < 0.15 && workTime > 0) {
      insights.push({
        type: 'category_balance',
        title: 'Consider More Breaks',
        description: 'You might benefit from taking more breaks during work.',
        score: 50,
        recommendation: 'Try the 50/10 rule: 50 minutes work, 10 minutes break.'
      });
    }
    
    return insights;
  }

  private countCategoryChanges(activities: Activity[]): number {
    let changes = 0;
    for (let i = 1; i < activities.length; i++) {
      if (activities[i].category.id !== activities[i-1].category.id) {
        changes++;
      }
    }
    return changes;
  }
}