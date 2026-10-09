import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTab, MealEntry, UserSettings } from '../types';
import { playWaterDrop, playSwitchClick, setSoundEnabled as setAudioSoundEnabled } from '../utils/audio';

// Hotlinked photo assets provided in mockups
export const IMAGES = {
  appIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABu0pxwY9LihYIBOvkNwFivgiqbd1aqKVDUx7RNNz-7kvKTq8PS3fugMz-7NykmYyiTwctoLXIS0CzHK6K3dR3JPubFmQVjB586nqqLFlhTAcrUCwO8B8ff1tdtu6gbCzzStuvUfo3yKWyiwL1XVWJ3jPeOF8iwVta3GNY5fgghdyL6JTaPnirlAIXkrmmgGvW5LMR0vpk3-rCvJ-qz2t_u629Fdn34HMyeIih7Cy5La8WfVrnPKes0Q',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8oIRypb-TofM8cxzwQKgMTPC24q0v9oHxagfjJC2rJpBJDg8N88vziT4BAG5WyxPWvq0k3sV2CVkYLDbRxub2FAtubH-6UareK662Gr-JUoWR2_q8vUdttj9VID8PObAHWOTHIDsOmJGD4crDM_kogtW4rNI4R5II_acyeIjZLvIdNS6MKqip3D8_aE-dAqHuFcpG1OpGcmhA4sL80hyei7d_1NvgmyKQBlzTSEPW3QfmpvZuuanbvw',
  oats: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNNwFnPsxzaLE3hg9ypC6mLqiWrIsCQRTqAMXdoWCM7w_VDADItvexz9iubkzn6b0EgTUbWXj5SnLlZhVlxN2S8HKzQECkzus3E6TE9_qkmtyPd1mvCAfTqZosmirhhffy7osqy0oTEHlGdlnP6TRLh4k0dcLnRVONbPJ9BQ3H_dO7iIiighOshU26d8CmCnpG1imB29uhS644nOx1qYqqU-6SI__TUFrtmpXPWrxj-kxzbj9o9j1Zew',
  chickenQuinoa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEGrImFa8wfpqxwJhgM8ZVkWvocBMtRgsXrhExmtzD01yRpCiy5Yw2t7X_v8T1ypMidWnhpwG_y0e8jGEi3DnPpXO4286GnApRlCaDaLjEwr-fwXrWbUdduqFUCVcLgXVtGyB7RojH4lvxtZSLapsdLT5ki3VIXb5Eq5PZFM2QA61vE5XIvZBnD-CQ3fti0roxDWD6ewDMkqd0AHVWJ1caozQExTE3alVY5-Z55JJjz1yfIfEQyE4DkA',
  salmon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCF4mu81ukkj0izoQx_uRTWMPBxi0V1UVw4Um4T4cu-ImNiH9Ft0fK5mNlAsH7KnOC5RJHQGrbrgPhe4xqTZnqzBMOfi3N5-XU4vnmfxWfXD5B7-I_W0GxQ9-gFiBjC4qvVq-uTp6CbEGOO_NWv__wBqJMd-GNx_UtS6GG5oKt6pKn-3_o-D3W4ndW3U-ori2yPdACZtedOipWCKWdSHDNaaalxcRbEEsYiv0JiOiNKol1GLAZvsmsYQg',
  viewfinderSalmon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjDWnvUHGE7lLWqYULtCQbjOQ9TQVlKH6O1rMvWfyk6xXLIxMuPQCRpynlR6jmZa7qGItbv3W9NwFDIlFCYlahUHzj3H1XuyMAUprx-twLv7R7u3Rdj5shvZFzVn3232haiSFvM0o3Hu-z4MsGTIgUwC-PHr5kkBtIQruzFf2czPeNlI4dwrE6mLVTtHB4EtWQ_UG8qTWsRiVUT8ucLVdu4dtWTlcwtK7acTULatMI-2eLTbqtj0MyMg'
};

const INITIAL_MEALS: MealEntry[] = [
  {
    id: 'meal-1',
    recipeNumber: '01',
    category: 'Breakfast',
    time: '08:15 AM',
    title: 'Steel-Cut Oatmeal & Forest Berries',
    subtitle: 'With organic blueberries, chia seeds & raw honey',
    calories: 460,
    macros: { protein: 14, carbs: 62, fat: 18 },
    imageUrl: IMAGES.oats,
    isAiLogged: true,
    isCompleted: true,
  },
  {
    id: 'meal-2',
    recipeNumber: '02',
    category: 'Lunch',
    time: '01:30 PM',
    title: 'Grilled Herb Chicken & Quinoa Bowl',
    subtitle: 'Steamed greens, citrus tahini, roasted seeds',
    calories: 620,
    macros: { protein: 52, carbs: 58, fat: 18 },
    imageUrl: IMAGES.chickenQuinoa,
    isAiLogged: true,
    isCompleted: true,
    caloricBreakdown: {
      item1: { name: 'Chicken Breast 180g', grams: 180, kcal: 295, pct: 32 },
      item2: { name: 'Quinoa 150g', grams: 150, kcal: 222, pct: 44 },
      item3: { name: 'Greens & Tahini', grams: 85, kcal: 103, pct: 24 }
    }
  },
  {
    id: 'meal-3',
    recipeNumber: '03',
    category: 'Dinner',
    time: '07:30 PM',
    title: 'Pan-seared Salmon Fillet',
    subtitle: 'With grilled asparagus & lemon butter',
    calories: 590,
    macros: { protein: 42, carbs: 18, fat: 28 },
    imageUrl: IMAGES.salmon,
    isAiLogged: true,
    isCompleted: false, // Initially pending for dinner as shown on Screen 1!
    satietyIndex: 4.5,
    calibreScore: 9.2,
  },
  {
    id: 'meal-4',
    recipeNumber: '04',
    category: 'Snacks',
    time: '04:45 PM',
    title: 'Greek Yogurt with Crushed Almonds',
    subtitle: 'Rich probiotic blend with toasted raw almonds',
    calories: 340,
    macros: { protein: 20, carbs: 25, fat: 12 },
    isAiLogged: false,
    isCompleted: true,
  },
  {
    id: 'meal-5',
    category: 'Nightcap',
    time: '09:15 PM',
    title: 'Chamomile Tea & Raw Walnuts',
    subtitle: 'Magnesium & melatonin support (25g nuts)',
    calories: 150,
    macros: { protein: 6, carbs: 4, fat: 14 },
    isCompleted: false,
  }
];

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  daySelection: 'YEST' | 'TODAY' | 'TOM';
  setDaySelection: (day: 'YEST' | 'TODAY' | 'TOM') => void;
  selectedVaultDate: number;
  setSelectedVaultDate: (dayNumber: number) => void;
  meals: MealEntry[];
  waterAmount: number;
  addWater: (amount: number) => void;
  setWaterAmount: (amount: number) => void;
  fastingActive: boolean;
  toggleFasting: () => void;
  fastingElapsedHours: number;
  fastingElapsedMinutes: number;
  toggleMealCompleted: (mealId: string) => void;
  addMeal: (newMeal: Omit<MealEntry, 'id'>) => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toastMessage: { title: string; subtitle: string } | null;
  showToast: (title: string, subtitle: string) => void;
  // Computed values
  totalCaloriesConsumed: number;
  remainingCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [daySelection, setDaySelection] = useState<'YEST' | 'TODAY' | 'TOM'>('TODAY');
  const [selectedVaultDate, setSelectedVaultDate] = useState<number>(23); // 23 Wed
  const [meals, setMeals] = useState<MealEntry[]>(INITIAL_MEALS);
  const [waterAmount, setWaterAmount] = useState<number>(1750); // 1,750 ml
  const [fastingActive, setFastingActive] = useState<boolean>(true);
  const [fastingElapsedHours] = useState<number>(14);
  const [fastingElapsedMinutes] = useState<number>(22);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    targetCalories: 2100,
    targetWater: 2500,
    targetProtein: 140,
    targetCarbs: 210,
    targetFat: 65,
    soundEnabled: true,
    hapticEnabled: true,
  });

  useEffect(() => {
    setAudioSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const showToast = (title: string, subtitle: string) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 2800);
  };

  const addWater = (delta: number) => {
    playWaterDrop();
    setWaterAmount((prev) => Math.max(0, Math.min(4000, prev + delta)));
    showToast('Hydration Logged', `+${delta} ml added to daily cylinder.`);
  };

  const toggleFasting = () => {
    playSwitchClick();
    setFastingActive((prev) => !prev);
  };

  const toggleMealCompleted = (mealId: string) => {
    playSwitchClick();
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  const addMeal = (newMeal: Omit<MealEntry, 'id'>) => {
    const created: MealEntry = {
      ...newMeal,
      id: `meal-${Date.now()}`,
    };
    setMeals((prev) => [created, ...prev]);
    showToast('Intake Registered', `${created.title} (${created.calories} kcal) added to ledger.`);
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    showToast('Calibre Calibrated', 'Precision target parameters saved.');
  };

  // Completed or logged meals count towards today's total
  const completedMeals = meals.filter((m) => m.isCompleted);
  const totalCaloriesConsumed = completedMeals.reduce((acc, m) => acc + m.calories, 0);
  const remainingCalories = Math.max(0, settings.targetCalories - totalCaloriesConsumed);

  const consumedProtein = completedMeals.reduce((acc, m) => acc + m.macros.protein, 0);
  const consumedCarbs = completedMeals.reduce((acc, m) => acc + m.macros.carbs, 0);
  const consumedFat = completedMeals.reduce((acc, m) => acc + m.macros.fat, 0);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        daySelection,
        setDaySelection,
        selectedVaultDate,
        setSelectedVaultDate,
        meals,
        waterAmount,
        addWater,
        setWaterAmount,
        fastingActive,
        toggleFasting,
        fastingElapsedHours,
        fastingElapsedMinutes,
        toggleMealCompleted,
        addMeal,
        settings,
        updateSettings,
        toastMessage,
        showToast,
        totalCaloriesConsumed,
        remainingCalories,
        consumedProtein,
        consumedCarbs,
        consumedFat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
