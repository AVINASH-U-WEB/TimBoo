import { ActivityCategory } from '../types';

export const defaultCategories: ActivityCategory[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6', // blue-500
    icon: 'briefcase'
  },
  {
    id: 'learning',
    name: 'Learning',
    color: '#10B981', // emerald-500
    icon: 'book-open'
  },
  {
    id: 'break',
    name: 'Break',
    color: '#8B5CF6', // violet-500
    icon: 'coffee'
  },
  {
    id: 'exercise',
    name: 'Exercise',
    color: '#F59E0B', // amber-500
    icon: 'activity'
  },
  {
    id: 'social',
    name: 'Social',
    color: '#EC4899', // pink-500
    icon: 'users'
  },
  {
    id: 'distraction',
    name: 'Distraction',
    color: '#EF4444', // red-500
    icon: 'smartphone'
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#06B6D4', // cyan-500
    icon: 'user'
  },
  {
    id: 'creative',
    name: 'Creative',
    color: '#F97316', // orange-500
    icon: 'palette'
  }
];