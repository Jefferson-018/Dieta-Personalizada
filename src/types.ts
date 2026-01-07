// src/types.ts

export interface UserData {
  name: string;
  goal: 'loss' | 'maintain' | 'mass';
  weight: number | '';
  height: number | '';
  age: number | '';
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
}

export interface FoodItem {
  id?: number;
  name: string;
  calories: number;
  macros?: { P: number; C: number; G: number };
  tags?: string[];
  obs?: string;
  displayPortion?: string;
}

export interface Meal {
  name: string;
  time: string;
  calories: number;
  items: FoodItem[];
  requiredCals?: number;
}

export interface Exercise {
  name: string;
  sets: string;
}

export interface WorkoutSession {
  title: string;
  exercises: Exercise[];
}

export interface MacroDistribution {
  p: number;
  c: number;
  f: number;
}

export interface DietResult {
  calories: number;
  macros: MacroDistribution;
  meals: Meal[];
  workoutPlan: WorkoutSession[];
}