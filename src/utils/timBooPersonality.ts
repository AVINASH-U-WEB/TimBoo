export class TimBooPersonality {
  generateMoodReflection(activities: any[], totalTime: number, productivityScore: number): string {
    const highProductivityCount = activities.filter(a => a.productivityLevel === 'high').length;
    const distractionTime = activities
      .filter(a => a.category.id === 'distraction')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const distractionPercentage = (distractionTime / totalTime) * 100;
    
    // High productivity day
    if (productivityScore > 75 && highProductivityCount >= 3) {
      const celebrations = [
        "You absolutely CRUSHED it today! 🔥💪",
        "Damn, look at you being all productive and stuff! 🌟",
        "Today was your day to shine, and boy did you deliver! ✨",
        "You're basically a productivity superhero today! 🦸‍♀️"
      ];
      return celebrations[Math.floor(Math.random() * celebrations.length)];
    }
    
    // Balanced day
    if (productivityScore > 50 && distractionPercentage < 30) {
      const balanced = [
        "Solid day, buddy! Good mix of work and chill time 😊",
        "You found that sweet spot between hustle and rest today! 🎯",
        "Nice balance today - you're getting the hang of this! 👌",
        "Steady progress, that's what I like to see! 🚀"
      ];
      return balanced[Math.floor(Math.random() * balanced.length)];
    }
    
    // Gentle/struggling day
    if (distractionPercentage > 40 || productivityScore < 40) {
      const gentle = [
        "Hey, we all have those days - tomorrow's a fresh start! 🌅",
        "Gentle day, but that's totally okay! Progress isn't always linear 💙",
        "Some days are for rest and reset - you're human! 🤗",
        "Not every day needs to be a productivity marathon, friend! 🌸"
      ];
      return gentle[Math.floor(Math.random() * gentle.length)];
    }
    
    // Default positive
    return "Another day in the books! Every day is a chance to learn something new about yourself 📚✨";
  }

  generateTomorrowSuggestions(activities: any[], insights: any[]): string[] {
    const suggestions: string[] = [];
    
    const distractionTime = activities
      .filter(a => a.category.id === 'distraction')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const workTime = activities
      .filter(a => a.category.id === 'work')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const creativeTime = activities
      .filter(a => a.category.id === 'creative')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    const breakTime = activities
      .filter(a => a.category.id === 'break' || a.category.id === 'exercise')
      .reduce((sum, a) => sum + a.estimatedTime, 0);

    // Distraction suggestions
    if (distractionTime > 90) {
      suggestions.push("Maybe try the 25-min focus, 5-min scroll rule tomorrow? Your future self will thank you! 📱⏰");
    }
    
    // Creative time suggestions
    if (creativeTime < 30 && workTime > 120) {
      suggestions.push("How about adding some creative time tomorrow? Even 20 mins of doodling can spark joy! 🎨✨");
    }
    
    // Break suggestions
    if (breakTime < 30 && workTime > 180) {
      suggestions.push("Your brain deserves more breaks, friend! Try the 50/10 rule - 50 min work, 10 min break 🧠💚");
    }
    
    // Learning suggestions
    const learningTime = activities
      .filter(a => a.category.id === 'learning')
      .reduce((sum, a) => sum + a.estimatedTime, 0);
    
    if (learningTime < 30) {
      suggestions.push("Maybe squeeze in some learning time tomorrow? Even 15 mins of reading counts! 📖🌱");
    }
    
    // Default encouraging suggestions
    if (suggestions.length === 0) {
      const defaultSuggestions = [
        "Keep riding that momentum tomorrow - you've got this! 🚀",
        "Tomorrow's another chance to be awesome - I believe in you! 💫",
        "Maybe try one tiny new thing tomorrow? Small changes, big impact! 🌟"
      ];
      suggestions.push(defaultSuggestions[Math.floor(Math.random() * defaultSuggestions.length)]);
    }
    
    return suggestions.slice(0, 2); // Return max 2 suggestions
  }

  generateProductivityScore(activities: any[]): { score: number; emoji: string; description: string } {
    if (activities.length === 0) {
      return { score: 0, emoji: "🤷‍♀️", description: "No data yet, buddy!" };
    }
    
    const avgProductivity = activities.reduce((sum, a) => {
      const score = a.productivityLevel === 'high' ? 3 : a.productivityLevel === 'medium' ? 2 : 1;
      return sum + score;
    }, 0) / activities.length;
    
    const score = Math.round((avgProductivity / 3) * 100);
    
    if (score >= 80) {
      return { 
        score, 
        emoji: "🔥", 
        description: "Absolute fire today!" 
      };
    } else if (score >= 65) {
      return { 
        score, 
        emoji: "⚡", 
        description: "Solid energy vibes!" 
      };
    } else if (score >= 50) {
      return { 
        score, 
        emoji: "🌊", 
        description: "Steady flow day!" 
      };
    } else if (score >= 35) {
      return { 
        score, 
        emoji: "🌱", 
        description: "Growing day by day!" 
      };
    } else {
      return { 
        score, 
        emoji: "🌙", 
        description: "Rest and reset mode!" 
      };
    }
  }

  generateActivityBreakdown(activities: any[]): string {
    if (activities.length === 0) return "No activities logged yet, buddy!";
    
    const categoryTimes = activities.reduce((acc, activity) => {
      const categoryName = activity.category.name;
      const tag = this.getCategoryTag(activity.category.id);
      
      if (!acc[categoryName]) {
        acc[categoryName] = { time: 0, tag, activities: [] };
      }
      acc[categoryName].time += activity.estimatedTime;
      acc[categoryName].activities.push(activity);
      return acc;
    }, {} as Record<string, { time: number; tag: string; activities: any[] }>);
    
    const sortedCategories = Object.entries(categoryTimes)
      .sort(([,a], [,b]) => b.time - a.time)
      .slice(0, 5); // Top 5 categories
    
    let breakdown = "Here's how you spent your time:\n\n";
    
    sortedCategories.forEach(([category, data]) => {
      const hours = Math.floor(data.time / 60);
      const minutes = data.time % 60;
      const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      breakdown += `${data.tag} **${category}**: ${timeStr}\n`;
      
      // Add top activity for this category
      const topActivity = data.activities.reduce((prev, current) => 
        (prev.estimatedTime > current.estimatedTime) ? prev : current
      );
      breakdown += `   └ Longest: ${topActivity.description.substring(0, 50)}${topActivity.description.length > 50 ? '...' : ''}\n\n`;
    });
    
    return breakdown;
  }

  private getCategoryTag(categoryId: string): string {
    const tags: Record<string, string> = {
      'work': '#Work',
      'creative': '#Creative', 
      'personal': '#Admin',
      'break': '#Break',
      'social': '#Social',
      'distraction': '#Distraction',
      'learning': '#Learning',
      'exercise': '#Exercise'
    };
    return tags[categoryId] || '#Other';
  }
}