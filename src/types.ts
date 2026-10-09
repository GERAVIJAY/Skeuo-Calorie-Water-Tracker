export type ActiveTab = 'today' | 'vault' | 'scan' | 'weekly' | 'settings';

export interface MacroNutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

export interface MealEntry {
  id: string;
  recipeNumber?: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Nightcap';
  time: string;
  title: string;
  subtitle: string;
  calories: number;
  macros: MacroNutrients;
  imageUrl?: string;
  isAiLogged?: boolean;
  isCompleted?: boolean;
  satietyIndex?: number; // 1-5
  calibreScore?: number; // e.g. 9.2
  caloricBreakdown?: {
    item1: { name: string; grams: number; kcal: number; pct: number };
    item2: { name: string; grams: number; kcal: number; pct: number };
    item3?: { name: string; grams: number; kcal: number; pct: number };
  };
}

export interface WaterLog {
  id: string;
  time: string;
  amount: number; // in ml
  label: string;
}

export interface DayLog {
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // e.g. 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
  dayNumber: number; // e.g. 24
  monthLabel: string; // e.g. 'OCT'
  targetCalories: number;
  targetWater: number;
  meals: MealEntry[];
  waterLogs: WaterLog[];
  fastingActive: boolean;
  fastingElapsedMinutes: number;
}

export interface UserSettings {
  targetCalories: number;
  targetWater: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}
