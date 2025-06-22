export interface Activity {
  id: string;
  description: string;
  category: ActivityCategory;
  estimatedTime: number; // in minutes
  productivityLevel: ProductivityLevel;
  timestamp: Date;
  tags: string[];
}

export interface DailyLog {
  id: string;
  date: string;
  rawInput: string;
  activities: Activity[];
  totalTime: number;
  overallProductivity: number;
  insights: string[];
  createdAt: Date;
}

export interface ActivityCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TimeBlock {
  category: ActivityCategory;
  totalTime: number;
  activities: Activity[];
  percentage: number;
}

export interface ProductivityInsight {
  type: 'productive_time' | 'wasted_time' | 'task_switching' | 'category_balance';
  title: string;
  description: string;
  score: number;
  recommendation: string;
}

export type ProductivityLevel = 'high' | 'medium' | 'low';

export interface MindMapNode {
  id: string;
  name: string;
  category: ActivityCategory;
  time: number;
  productivity: ProductivityLevel;
  children: MindMapNode[];
  x?: number;
  y?: number;
}