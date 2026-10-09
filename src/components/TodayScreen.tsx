import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { playKnobTick, playSwitchClick, playWaterDrop } from '../utils/audio';

export const TodayScreen: React.FC = () => {
  const {
    daySelection,
    setDaySelection,
    meals,
    totalCaloriesConsumed,
    remainingCalories,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    settings,
    waterAmount,
    addWater,
    fastingActive,
    toggleFasting,
    fastingElapsedHours,
    fastingElapsedMinutes,
    toggleMealCompleted,
    setActiveTab,
    addMeal,
  } = useApp();

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customKcal, setCustomKcal] = useState('');
  const [customCategory, setCustomCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Dinner');

  // Calorie gauge needle angle (-135deg at 0% to +135deg at 100% or beyond)
  const calorieRatio = Math.min(1.2, totalCaloriesConsumed / settings.targetCalories);
  const needleAngle = -135 + calorieRatio * 270;

  // Arc path stroke dash calculations (circumference approx 355 for R=75 through 270 degrees)
  const maxDash = 355;
  const dashOffset = Math.max(0, maxDash - calorieRatio * maxDash);

  // Water percentage
  const waterPct = Math.min(100, Math.round((waterAmount / settings.targetWater) * 100));
  const remainingWater = Math.max(0, settings.targetWater - waterAmount);

  // Odometer 4 digits for remaining calories
  const remString = remainingCalories.toString().padStart(4, '0').slice(-4);
  const remDigits = remString.split('');

  // Macro needle angles
  const proteinRatio = Math.min(1, consumedProtein / settings.targetProtein);
  const carbsRatio = Math.min(1, consumedCarbs / settings.targetCarbs);
  const fatRatio = Math.min(1, consumedFat / settings.targetFat);

  const handleDaySelect = (day: 'YEST' | 'TODAY' | 'TOM') => {
    playKnobTick();
    setDaySelection(day);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customKcal) return;
    const kcal = parseInt(customKcal, 10) || 200;
    addMeal({
      category: customCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: customTitle,
      subtitle: 'Hand-calibrated custom field entry',
      calories: kcal,
      macros: {
        protein: Math.round(kcal * 0.05),
        carbs: Math.round(kcal * 0.12),
        fat: Math.round(kcal * 0.04),
      },
      isCompleted: true,
    });
    setCustomTitle('');
    setCustomKcal('');
    setIsAddingCustom(false);
  };

  const completedCount = meals.filter((m) => m.isCompleted).length;

  return (
    <div className="flex flex-col w-full pb-28">
      {/* 1. TOP HEADER & TACTILE STRIP */}
      <header className="px-4 pt-4 pb-2">
        {/* Embossed Calendar & Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Tactile Brass Stamp Badge */}
            <div
              onClick={() => playKnobTick()}
              className="size-11 rounded-lg bevel-brass flex items-center justify-center p-[2px] shadow-md cursor-pointer hover:rotate-1 transition-transform"
            >
              <div className="w-full h-full rounded bg-[#f6f3ec] flex flex-col items-center justify-center border border-[#dcc1b6]/50">
                <span className="font-label-caps text-[9px] text-[#994110] uppercase font-bold tracking-widest -mb-1">
                  OCT
                </span>
                <span className="font-display-hero text-lg font-extrabold text-[#1c1c18] leading-tight">
                  24
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-headline-sm text-lg text-[#1c1c18] tracking-tight font-bold">
                  {daySelection === 'YEST'
                    ? 'YESTERDAY, OCT 23'
                    : daySelection === 'TOM'
                    ? 'TOMORROW, OCT 25'
                    : 'TODAY, OCT 24'}
                </h1>
                <span className="inline-block size-2 rounded-full bg-[#006947] shadow-[0_0_6px_rgba(0,105,71,0.6)] animate-pulse" />
              </div>
              <p className="font-label-fine text-xs text-[#897269]">
                Combustion &amp; Balance Chamber
              </p>
            </div>
          </div>
          <button
            aria-label="Settings and Calibration"
            onClick={() => {
              playKnobTick();
              setActiveTab('settings');
            }}
            className="size-10 rounded-xl bevel-rim flex items-center justify-center text-[#56433a] hover:text-[#994110] transition-colors active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Recessed Mechanical Day Switcher */}
        <div className="p-1 rounded-xl recessed-chassis flex items-center gap-1 border border-[#dcc1b6]/40">
          <button
            type="button"
            onClick={() => handleDaySelect('YEST')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-meter text-xs tracking-wider transition-all ${
              daySelection === 'YEST'
                ? 'raised-pill text-[#994110] font-bold border border-[#dcc1b6]/30'
                : 'text-[#897269] font-semibold hover:text-[#1c1c18]'
            }`}
          >
            YEST
          </button>
          <button
            type="button"
            onClick={() => handleDaySelect('TODAY')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-label-meter text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              daySelection === 'TODAY'
                ? 'raised-pill text-[#994110] font-bold border border-[#dcc1b6]/30'
                : 'text-[#897269] font-semibold hover:text-[#1c1c18]'
            }`}
          >
            {daySelection === 'TODAY' && (
              <span className="size-1.5 rounded-full bg-[#994110] animate-pulse" />
            )}
            TODAY
          </button>
          <button
            type="button"
            onClick={() => handleDaySelect('TOM')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-meter text-xs tracking-wider transition-all ${
              daySelection === 'TOM'
                ? 'raised-pill text-[#994110] font-bold border border-[#dcc1b6]/30'
                : 'text-[#897269] font-semibold hover:text-[#1c1c18]'
            }`}
          >
            TOM
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="px-4 space-y-5 flex-1">
        {/* 2. PRIMARY HERO ANALOG GAUGE (CALORIE COMBUSTION DIAL) */}
        <section className="mt-1">
          <div className="relative w-full rounded-2xl bevel-rim p-3 border border-[#dcc1b6]/50">
            {/* Screw heads at four corners for industrial skeuomorphic charm */}
            <div className="absolute top-2 left-2 size-2.5 rounded-full bg-gradient-to-br from-[#dcc1b6] to-[#897269] border border-[#fcf9f2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-2 h-[1px] bg-[#dcc1b6] -rotate-45" />
            </div>
            <div className="absolute top-2 right-2 size-2.5 rounded-full bg-gradient-to-br from-[#dcc1b6] to-[#897269] border border-[#fcf9f2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-2 h-[1px] bg-[#dcc1b6] rotate-45" />
            </div>
            <div className="absolute bottom-2 left-2 size-2.5 rounded-full bg-gradient-to-br from-[#dcc1b6] to-[#897269] border border-[#fcf9f2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-2 h-[1px] bg-[#dcc1b6] rotate-12" />
            </div>
            <div className="absolute bottom-2 right-2 size-2.5 rounded-full bg-gradient-to-br from-[#dcc1b6] to-[#897269] border border-[#fcf9f2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center">
              <div className="w-2 h-[1px] bg-[#dcc1b6] -rotate-30" />
            </div>

            {/* Circular Dial Housing */}
            <div className="relative aspect-square max-w-[310px] mx-auto rounded-full bevel-brass p-2 shadow-xl">
              {/* Steel Bevel Ring */}
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#fcf9f2] via-[#dcc1b6] to-[#a38b80] p-2 shadow-inner">
                {/* Dial Face Plate */}
                <div className="w-full h-full rounded-full dial-face relative flex flex-col items-center justify-between p-4 overflow-hidden border border-[#d5cbbe]">
                  {/* Convex Glass Lens Highlight (3D Curved Glare) */}
                  <div className="absolute inset-0 rounded-full convex-lens-reflection pointer-events-none z-30" />

                  {/* Radial Gauge Ticks & Colored Arc (Pure Vector Skeuomorphic Dial Face) */}
                  <svg
                    className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none z-10"
                    viewBox="0 0 200 200"
                  >
                    <defs>
                      <linearGradient id="arcCopper" x1="0%" x2="100%" y1="100%" y2="0%">
                        <stop offset="0%" stopColor="#4edea3" />
                        <stop offset="50%" stopColor="#b95928" />
                        <stop offset="100%" stopColor="#994110" />
                      </linearGradient>
                      <filter height="150%" id="needleShadow" width="150%" x="-20%" y="-20%">
                        <feDropShadow
                          dx="2"
                          dy="4"
                          floodColor="#191310"
                          floodOpacity="0.4"
                          stdDeviation="2.5"
                        />
                      </filter>
                    </defs>

                    {/* Background Meter Track (270 degree arc) */}
                    <path
                      d="M 35 150 A 75 75 0 1 1 165 150"
                      fill="none"
                      stroke="#ded5c7"
                      strokeLinecap="round"
                      strokeWidth="9"
                    />

                    {/* Filled Target Arc */}
                    <path
                      d="M 35 150 A 75 75 0 1 1 165 150"
                      fill="none"
                      stroke="url(#arcCopper)"
                      strokeDasharray={maxDash}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      strokeWidth="9"
                      style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
                    />

                    {/* Calibration Tick Marks */}
                    {/* 0% */}
                    <line stroke="#897269" strokeWidth="2" x1="38" x2="48" y1="146" y2="140" />
                    {/* 25% */}
                    <line stroke="#897269" strokeWidth="2" x1="42" x2="52" y1="90" y2="94" />
                    {/* 50% */}
                    <line stroke="#994110" strokeWidth="3" x1="100" x2="100" y1="34" y2="46" />
                    {/* 75% */}
                    <line stroke="#897269" strokeWidth="2" x1="158" x2="148" y1="90" y2="94" />
                    {/* 100% */}
                    <line stroke="#ba1a1a" strokeWidth="2.5" x1="162" x2="152" y1="146" y2="140" />

                    {/* Secondary Micro Ticks */}
                    <circle
                      cx="100"
                      cy="100"
                      fill="none"
                      r="70"
                      stroke="#baa89b"
                      strokeDasharray="1 8"
                      strokeDashoffset="15"
                      strokeWidth="1"
                    />

                    {/* 3D Realistic Needle pivoted at center (100, 100) */}
                    <g
                      filter="url(#needleShadow)"
                      transform={`rotate(${needleAngle} 100 100)`}
                      style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      {/* Needle blade */}
                      <polygon fill="#994110" points="100,28 97,100 100,118 103,100" />
                      <line
                        opacity="0.8"
                        stroke="#ffb595"
                        strokeWidth="1"
                        x1="100"
                        x2="100"
                        y1="30"
                        y2="100"
                      />
                      {/* Counter-balance tail */}
                      <circle cx="100" cy="112" fill="#351000" r="5" />
                    </g>
                  </svg>

                  {/* Center Cap / Brass Pivot Nut */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-7 rounded-full bevel-brass z-20 flex items-center justify-center shadow-lg border border-[#fff2d6]">
                    <div className="size-3.5 rounded-full bg-gradient-to-br from-[#ffe7bd] via-[#8f5e2a] to-[#422606] shadow-inner" />
                  </div>

                  {/* Upper Title Inset on Dial */}
                  <div className="pt-5 text-center z-10">
                    <span className="font-label-caps text-[10px] tracking-widest text-[#897269] uppercase font-bold">
                      KILOCALORIE BURNDOWN
                    </span>
                    <div className="text-[12px] font-label-meter text-[#994110] font-bold tracking-tight">
                      COMBUSTION GAUGE
                    </div>
                  </div>

                  {/* Dial Reading Center-Lower */}
                  <div className="z-10 text-center -mt-1">
                    <div className="font-display-hero text-2xl font-black text-[#1c1c18] tracking-tight drop-shadow-sm leading-tight">
                      {totalCaloriesConsumed.toLocaleString()}
                    </div>
                    <div className="text-[11px] font-label-fine text-[#897269] font-semibold tracking-wide">
                      GOAL: {settings.targetCalories.toLocaleString()} KCAL
                    </div>
                  </div>

                  {/* Inset Mechanical Odometer Box (Remaining Counter) */}
                  <div className="mb-2 z-10 w-full max-w-[190px]">
                    <div className="odometer-drum rounded-md py-1 px-2.5 border border-[#483d37] flex items-center justify-between">
                      <span className="font-label-caps text-[9px] text-[#baa89b] tracking-wider uppercase">
                        REMAINING
                      </span>
                      <div className="flex items-center gap-0.5">
                        {remDigits.map((digit, idx) => (
                          <span
                            key={idx}
                            className="font-label-meter text-sm font-bold text-[#6ffbbe] tracking-wider bg-black/40 px-1 rounded shadow-inner"
                          >
                            {digit}
                          </span>
                        ))}
                        <span className="font-label-caps text-[10px] text-[#4edea3] ml-1">kcal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUB-METERS: 3 Miniature Macro Dial Gauges */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#dcc1b6]/40">
              {/* Mini Dial 1: Protein */}
              <div className="recessed-chassis rounded-xl p-2 flex flex-col items-center border border-[#dcc1b6]/30 text-center relative overflow-hidden">
                <div className="size-14 rounded-full bevel-brass p-1 shadow-inner relative flex items-center justify-center mb-1">
                  <div className="w-full h-full rounded-full dial-face relative flex items-center justify-center">
                    <svg className="w-full h-full p-1" viewBox="0 0 40 40">
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#ded5c7"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#ba1a1a"
                        strokeDasharray="66"
                        strokeDashoffset={66 - proteinRatio * 66}
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <line
                        stroke="#ba1a1a"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        x1="20"
                        y1="20"
                        x2={20 + 8 * Math.cos((-135 + proteinRatio * 270) * (Math.PI / 180))}
                        y2={20 + 8 * Math.sin((-135 + proteinRatio * 270) * (Math.PI / 180))}
                      />
                      <circle cx="20" cy="20" fill="#351000" r="2.5" />
                    </svg>
                    <div className="absolute inset-0 rounded-full convex-lens-reflection pointer-events-none" />
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-[#1c1c18] font-bold">PROTEIN</span>
                <span className="font-label-meter text-xs font-bold text-[#994110]">
                  {consumedProtein}g{' '}
                  <span className="text-[9px] font-normal text-[#897269]">
                    /{settings.targetProtein}
                  </span>
                </span>
              </div>

              {/* Mini Dial 2: Carbs */}
              <div className="recessed-chassis rounded-xl p-2 flex flex-col items-center border border-[#dcc1b6]/30 text-center relative overflow-hidden">
                <div className="size-14 rounded-full bevel-brass p-1 shadow-inner relative flex items-center justify-center mb-1">
                  <div className="w-full h-full rounded-full dial-face relative flex items-center justify-center">
                    <svg className="w-full h-full p-1" viewBox="0 0 40 40">
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#ded5c7"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#006591"
                        strokeDasharray="66"
                        strokeDashoffset={66 - carbsRatio * 66}
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <line
                        stroke="#006591"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        x1="20"
                        y1="20"
                        x2={20 + 8 * Math.cos((-135 + carbsRatio * 270) * (Math.PI / 180))}
                        y2={20 + 8 * Math.sin((-135 + carbsRatio * 270) * (Math.PI / 180))}
                      />
                      <circle cx="20" cy="20" fill="#002133" r="2.5" />
                    </svg>
                    <div className="absolute inset-0 rounded-full convex-lens-reflection pointer-events-none" />
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-[#1c1c18] font-bold">CARBS</span>
                <span className="font-label-meter text-xs font-bold text-[#006591]">
                  {consumedCarbs}g{' '}
                  <span className="text-[9px] font-normal text-[#897269]">
                    /{settings.targetCarbs}
                  </span>
                </span>
              </div>

              {/* Mini Dial 3: Fat */}
              <div className="recessed-chassis rounded-xl p-2 flex flex-col items-center border border-[#dcc1b6]/30 text-center relative overflow-hidden">
                <div className="size-14 rounded-full bevel-brass p-1 shadow-inner relative flex items-center justify-center mb-1">
                  <div className="w-full h-full rounded-full dial-face relative flex items-center justify-center">
                    <svg className="w-full h-full p-1" viewBox="0 0 40 40">
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#ded5c7"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <path
                        d="M 8 30 A 14 14 0 1 1 32 30"
                        fill="none"
                        stroke="#caa472"
                        strokeDasharray="66"
                        strokeDashoffset={66 - fatRatio * 66}
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <line
                        stroke="#9d6d35"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        x1="20"
                        y1="20"
                        x2={20 + 8 * Math.cos((-135 + fatRatio * 270) * (Math.PI / 180))}
                        y2={20 + 8 * Math.sin((-135 + fatRatio * 270) * (Math.PI / 180))}
                      />
                      <circle cx="20" cy="20" fill="#351000" r="2.5" />
                    </svg>
                    <div className="absolute inset-0 rounded-full convex-lens-reflection pointer-events-none" />
                  </div>
                </div>
                <span className="font-label-caps text-[10px] text-[#1c1c18] font-bold">
                  LIPIDS (FAT)
                </span>
                <span className="font-label-meter text-xs font-bold text-[#b95928]">
                  {consumedFat}g{' '}
                  <span className="text-[9px] font-normal text-[#897269]">/{settings.targetFat}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TACTILE WATER CYLINDER & HYDRATION TRACKER */}
        <section className="paper-tray rounded-2xl p-4 border border-[#dcc1b6]/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bevel-rim flex items-center justify-center text-[#006591] shadow-sm">
                <span className="material-symbols-outlined text-[19px]">water_drop</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Hydration Cylinder
                </h2>
                <p className="font-label-fine text-xs text-[#897269]">
                  Target {settings.targetWater.toLocaleString()} ml / day
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-meter text-sm font-bold text-[#006591]">
                {waterAmount.toLocaleString()}{' '}
                <span className="text-xs font-normal text-[#897269]">ml</span>
              </span>
              <span className="inline-block ml-1 font-label-caps text-[10px] text-[#006947] font-bold bg-[#6ffbbe]/30 px-1.5 py-0.5 rounded">
                {waterPct}%
              </span>
            </div>
          </div>

          {/* Glass Cylinder Chamber Layout */}
          <div className="flex items-center gap-4">
            {/* Skeuomorphic Vertical Glass Vessel */}
            <div className="relative w-16 h-48 rounded-2xl bg-[#ebe8e1]/60 p-1 border-2 border-[#dcc1b6]/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)] flex flex-col justify-end overflow-hidden">
              {/* Etched Laser Volume Measurement Ticks */}
              <div className="absolute inset-y-2 left-2 z-20 flex flex-col justify-between pointer-events-none text-[8px] font-label-meter text-[#56433a]/70">
                <span className="border-b border-[#1c1c18]/40 pr-1">3,000</span>
                <span className="border-b border-[#1c1c18]/40 pr-1 font-bold">2,500</span>
                <span className="border-b border-[#1c1c18]/40 pr-1">2,000</span>
                <span className="border-b border-[#1c1c18]/40 pr-1">1,500</span>
                <span className="border-b border-[#1c1c18]/40 pr-1">1,000</span>
                <span className="border-b border-[#1c1c18]/40 pr-1">500</span>
              </div>

              {/* Liquid Water Column */}
              <div
                className="w-full liquid-wave rounded-b-xl relative flex flex-col items-center transition-all duration-500"
                style={{ height: `${Math.min(95, Math.max(8, waterPct))}%` }}
              >
                {/* Meniscus lens effect at water surface */}
                <div className="absolute -top-1.5 inset-x-0 h-3 meniscus opacity-90 shadow-sm" />
                {/* Animated Bubbles */}
                <div className="absolute bottom-3 left-3 size-1.5 rounded-full bg-white/70 animate-bounce" />
                <div className="absolute bottom-8 right-2 size-2 rounded-full bg-white/50 animate-pulse" />
                <div className="absolute bottom-16 left-4 size-1 rounded-full bg-white/80" />
                {/* Inner Liquid Glow */}
                <div className="w-full h-full bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none" />
              </div>

              {/* Convex Cylindrical Glass Reflection Layer */}
              <div className="absolute inset-0 rounded-2xl glass-tube pointer-events-none z-30" />
            </div>

            {/* Action Buttons Strip */}
            <div className="flex-1 flex flex-col justify-between gap-2.5">
              <div className="bg-[#f6f3ec] rounded-xl p-2.5 border border-[#dcc1b6]/30 text-xs">
                <div className="flex justify-between items-center text-[#897269] mb-1 font-label-fine">
                  <span>REMAINING WATER</span>
                  <span className="font-label-meter font-bold text-[#1c1c18]">
                    {remainingWater} ml
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e5e2db] overflow-hidden p-0.5 border border-[#dcc1b6]/30">
                  <div
                    className="h-full rounded-full bg-[#006591] transition-all duration-300"
                    style={{ width: `${Math.min(100, waterPct)}%` }}
                  />
                </div>
              </div>

              {/* Tactile Push Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => addWater(250)}
                  className="push-button-tactile rounded-xl p-2.5 flex flex-col items-center justify-center border border-[#dcc1b6]/40 active:translate-y-0.5 group"
                >
                  <div className="size-7 rounded-full bg-[#c9e6ff]/50 flex items-center justify-center text-[#006591] mb-1 shadow-inner group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">local_cafe</span>
                  </div>
                  <span className="font-label-meter text-xs font-bold text-[#1c1c18]">+250 ml</span>
                  <span className="text-[9px] font-label-fine text-[#897269]">Tumbler</span>
                </button>

                <button
                  type="button"
                  onClick={() => addWater(500)}
                  className="push-button-tactile rounded-xl p-2.5 flex flex-col items-center justify-center border border-[#dcc1b6]/40 active:translate-y-0.5 group"
                >
                  <div className="size-7 rounded-full bg-[#39b8fd]/30 flex items-center justify-center text-[#006591] mb-1 shadow-inner group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">sports_bar</span>
                  </div>
                  <span className="font-label-meter text-xs font-bold text-[#1c1c18]">+500 ml</span>
                  <span className="text-[9px] font-label-fine text-[#897269]">Flask</span>
                </button>
              </div>

              {/* Fasting Physical Toggle Strip */}
              <div className="recessed-chassis rounded-xl px-3 py-2 border border-[#dcc1b6]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#994110] text-[18px]">timer</span>
                  <div>
                    <div className="font-label-caps text-[10px] text-[#1c1c18] font-bold">
                      FASTING TIMER
                    </div>
                    <div
                      className={`font-label-meter text-[11px] font-bold ${
                        fastingActive ? 'text-[#006947]' : 'text-[#897269]'
                      }`}
                    >
                      {fastingActive
                        ? `${fastingElapsedHours}h ${fastingElapsedMinutes}m Elapsed`
                        : 'Standby / Paused'}
                    </div>
                  </div>
                </div>

                {/* Physical Metal Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fastingActive}
                    onChange={toggleFasting}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#e5e2db] peer-focus:outline-none rounded-full peer peer-checked:bg-[#00855b] shadow-inner border border-[#dcc1b6]/50 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-b after:from-white after:to-[#ebe8e1] after:border after:border-[#dcc1b6] after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-md peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* 4. DAILY MEAL BREAKDOWN TRAY */}
        <section className="space-y-2.5 pb-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-headline-sm text-sm font-bold text-[#1c1c18] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#994110] text-[18px]">
                restaurant_menu
              </span>
              Intake Ledger
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-[10px] text-[#897269] font-bold tracking-wider">
                {completedCount} OF {meals.length} ENTRIES
              </span>
              <button
                type="button"
                onClick={() => setIsAddingCustom(!isAddingCustom)}
                className="size-6 rounded-md bg-[#f6f3ec] border border-[#dcc1b6] text-[#994110] flex items-center justify-center font-bold text-xs hover:bg-[#ffdbcc]"
                title="Add Custom Entry"
              >
                +
              </button>
            </div>
          </div>

          {/* Optional inline custom quick meal form */}
          {isAddingCustom && (
            <form
              onSubmit={handleCustomSubmit}
              className="paper-tray rounded-xl p-3 border border-[#994110]/40 flex flex-col gap-2.5 bg-[#fffdfa]"
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] text-[#994110] font-bold uppercase">
                  Log Custom Field Entry
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="text-xs text-[#897269] hover:text-[#1c1c18]"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="col-span-2 px-2.5 py-1.5 text-xs rounded-lg border border-[#dcc1b6] bg-white focus:outline-none focus:border-[#994110]"
                  required
                />
                <input
                  type="number"
                  placeholder="kcal"
                  value={customKcal}
                  onChange={(e) => setCustomKcal(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-[#dcc1b6] bg-white focus:outline-none focus:border-[#994110]"
                  required
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as typeof customCategory)}
                  className="text-xs px-2 py-1 rounded border border-[#dcc1b6] bg-white text-[#56433a]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
                <button
                  type="submit"
                  className="push-button-tactile px-3 py-1 rounded text-xs font-bold text-[#994110] border border-[#dcc1b6]"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          )}

          {/* Meals List */}
          {meals.map((meal) => {
            // Special rendered Pending dinner slot if uncompleted and category Dinner
            if (meal.category === 'Dinner' && !meal.isCompleted) {
              return (
                <div
                  key={meal.id}
                  className="recessed-chassis rounded-xl p-3.5 border-2 border-dashed border-[#897269]/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => toggleMealCompleted(meal.id)}
                      className="size-6 rounded-md bg-[#e5e2db] border border-[#dcc1b6]/60 flex items-center justify-center text-[#897269] cursor-pointer hover:bg-[#ffdbcc]"
                      title="Mark as completed or scan with AI"
                    >
                      <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-xs font-bold text-[#897269]">
                        {meal.title || 'Dinner'}
                      </h3>
                      <p className="text-xs text-[#56433a] font-body-sm">
                        {meal.subtitle || 'Pending logging for evening'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playKnobTick();
                      setActiveTab('scan');
                    }}
                    className="push-button-tactile px-3 py-1.5 rounded-lg border border-[#dcc1b6] text-xs font-bold text-[#994110] flex items-center gap-1 active:translate-y-0.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                    <span>+ Log AI</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={meal.id}
                className="paper-tray rounded-xl p-3 border border-[#dcc1b6]/50 flex items-center justify-between gap-3 relative hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {/* Vintage brass checkbox switch */}
                  <div
                    onClick={() => toggleMealCompleted(meal.id)}
                    className={`size-6 rounded-md bevel-brass flex items-center justify-center shadow-sm cursor-pointer border border-[#fbf3e0] transition-transform ${
                      meal.isCompleted ? 'scale-100' : 'opacity-40'
                    }`}
                  >
                    {meal.isCompleted && (
                      <span className="material-symbols-outlined text-[#351000] font-bold text-[16px]">
                        check
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-xs font-bold text-[#1c1c18]">
                        {meal.category}
                      </h3>
                      <span className="font-label-caps text-[9px] text-[#897269] bg-[#f1eee7] px-1 rounded">
                        {meal.time}
                      </span>
                    </div>
                    <p className="text-xs text-[#56433a] font-body-sm font-medium">
                      {meal.title}
                    </p>
                    {/* Macro pills */}
                    <div className="flex gap-1.5 mt-0.5">
                      <span className="text-[9px] font-label-meter text-[#994110]">
                        P {meal.macros.protein}g
                      </span>
                      <span className="text-[9px] font-label-meter text-[#006591]">
                        C {meal.macros.carbs}g
                      </span>
                      <span className="text-[9px] font-label-meter text-[#897269]">
                        F {meal.macros.fat}g
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-label-meter text-sm font-bold text-[#994110]">
                    {meal.calories}
                  </span>
                  <span className="font-label-caps text-[9px] text-[#897269] block">KCAL</span>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
