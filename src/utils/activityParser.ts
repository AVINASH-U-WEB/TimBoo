import { Activity, ActivityCategory, ProductivityLevel } from '../types';
import { defaultCategories } from '../data/categories';

export class ActivityParser {
  private categories: ActivityCategory[] = defaultCategories;

  parseInput(input: string): Activity[] {
    const activities: Activity[] = [];
    
    // Split input into sentences and clean them
    const sentences = input
      .split(/[.!?;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const sentence of sentences) {
      const activity = this.parseActivity(sentence);
      if (activity) {
        activities.push(activity);
      }
    }

    return activities;
  }

  private parseActivity(text: string): Activity | null {
    if (text.length < 5) return null;

    const category = this.categorizeActivity(text);
    const estimatedTime = this.estimateTime(text);
    const productivity = this.assessProductivity(text, category);
    const tags = this.extractTags(text);

    return {
      id: this.generateId(),
      description: text,
      category,
      estimatedTime,
      productivityLevel: productivity,
      timestamp: new Date(),
      tags
    };
  }

  private categorizeActivity(text: string): ActivityCategory {
    const lowerText = text.toLowerCase();
    
    // Work-related keywords
    if (this.containsKeywords(lowerText, ['meeting', 'call', 'email', 'project', 'deadline', 'presentation', 'report', 'coding', 'programming', 'development'])) {
      return this.categories.find(c => c.id === 'work')!;
    }
    
    // Learning keywords
    if (this.containsKeywords(lowerText, ['learned', 'studied', 'reading', 'course', 'tutorial', 'research', 'documentation', 'book'])) {
      return this.categories.find(c => c.id === 'learning')!;
    }
    
    // Exercise keywords
    if (this.containsKeywords(lowerText, ['workout', 'gym', 'running', 'exercise', 'walking', 'yoga', 'fitness'])) {
      return this.categories.find(c => c.id === 'exercise')!;
    }
    
    // Social keywords
    if (this.containsKeywords(lowerText, ['chatted', 'talked', 'called', 'friend', 'family', 'social', 'dinner', 'lunch'])) {
      return this.categories.find(c => c.id === 'social')!;
    }
    
    // Distraction keywords
    if (this.containsKeywords(lowerText, ['scrolling', 'instagram', 'facebook', 'youtube', 'tiktok', 'netflix', 'tv', 'procrastinated', 'browsing'])) {
      return this.categories.find(c => c.id === 'distraction')!;
    }
    
    // Creative keywords
    if (this.containsKeywords(lowerText, ['designed', 'drawing', 'writing', 'creative', 'art', 'music', 'painting'])) {
      return this.categories.find(c => c.id === 'creative')!;
    }
    
    // Break keywords
    if (this.containsKeywords(lowerText, ['break', 'coffee', 'tea', 'rest', 'relaxed', 'nap'])) {
      return this.categories.find(c => c.id === 'break')!;
    }
    
    // Default to personal
    return this.categories.find(c => c.id === 'personal')!;
  }

  private estimateTime(text: string): number {
    const lowerText = text.toLowerCase();
    
    // Look for explicit time mentions
    const timeRegex = /(\d+)\s*(hour|hr|minute|min|h|m)/gi;
    const matches = lowerText.match(timeRegex);
    
    if (matches) {
      let totalMinutes = 0;
      for (const match of matches) {
        const [, number, unit] = match.match(/(\d+)\s*(hour|hr|minute|min|h|m)/i) || [];
        const num = parseInt(number);
        if (unit.toLowerCase().includes('hour') || unit.toLowerCase() === 'h') {
          totalMinutes += num * 60;
        } else {
          totalMinutes += num;
        }
      }
      return Math.min(totalMinutes, 480); // Cap at 8 hours
    }
    
    // Estimate based on activity keywords
    if (this.containsKeywords(lowerText, ['quick', 'briefly', 'short'])) {
      return 15;
    }
    
    if (this.containsKeywords(lowerText, ['long', 'extended', 'deep', 'thorough'])) {
      return 120;
    }
    
    if (this.containsKeywords(lowerText, ['meeting', 'call', 'workout', 'lunch', 'dinner'])) {
      return 60;
    }
    
    // Default estimation based on text length
    const wordCount = text.split(' ').length;
    return Math.max(15, Math.min(90, wordCount * 3));
  }

  private assessProductivity(text: string, category: ActivityCategory): ProductivityLevel {
    const lowerText = text.toLowerCase();
    
    // Positive productivity indicators
    const highProductivityWords = ['completed', 'finished', 'achieved', 'accomplished', 'focused', 'productive', 'efficient', 'successful'];
    const mediumProductivityWords = ['worked', 'tried', 'attempted', 'started', 'continued'];
    const lowProductivityWords = ['struggled', 'distracted', 'procrastinated', 'wasted', 'unfocused', 'lazy'];
    
    if (this.containsKeywords(lowerText, highProductivityWords)) {
      return 'high';
    }
    
    if (this.containsKeywords(lowerText, lowProductivityWords)) {
      return 'low';
    }
    
    // Category-based defaults
    if (category.id === 'distraction') return 'low';
    if (category.id === 'work' || category.id === 'learning') return 'medium';
    if (category.id === 'break' || category.id === 'exercise') return 'high';
    
    return 'medium';
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];
    const lowerText = text.toLowerCase();
    
    // Common action tags
    if (lowerText.includes('meeting')) tags.push('meeting');
    if (lowerText.includes('email')) tags.push('email');
    if (lowerText.includes('coding') || lowerText.includes('programming')) tags.push('coding');
    if (lowerText.includes('reading')) tags.push('reading');
    if (lowerText.includes('planning')) tags.push('planning');
    
    return tags;
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}