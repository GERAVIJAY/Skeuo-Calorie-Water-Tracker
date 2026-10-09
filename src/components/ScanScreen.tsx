import React, { useState, useRef } from 'react';
import { useApp, IMAGES } from '../context/AppContext';
import { playKnobTick, playShutterSnap, playSwitchClick, playStampThud } from '../utils/audio';

export const ScanScreen: React.FC = () => {
  const { setActiveTab, addMeal, showToast } = useApp();

  const [cookMethod, setCookMethod] = useState<'GRILLED' | 'STEAMED' | 'PAN-FRIED'>('GRILLED');
  const [cookAdjustment, setCookAdjustment] = useState<number>(0);
  const [portionIndex, setPortionIndex] = useState<number>(1); // 1.0x
  const portionSteps = [0.8, 1.0, 1.25, 1.5];
  const portionMultiplier = portionSteps[portionIndex];

  const dressingLevels = [
    { label: 'Dry (0 kcal)', val: 0, pct: '10%' },
    { label: 'Light (+45)', val: 45, pct: '45%' },
    { label: 'Heavy (+110)', val: 110, pct: '88%' },
  ];
  const [dressingIndex, setDressingIndex] = useState<number>(1); // Light (+45)
  const dressingAdjustment = dressingLevels[dressingIndex].val;

  const baseCalories = 600;
  const currentTotalKcal = Math.round(
    (baseCalories + cookAdjustment + dressingAdjustment) * portionMultiplier
  );

  const [flashOn, setFlashOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedFocal, setSelectedFocal] = useState('50mm');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  // Scaled macros
  const proteinGrams = Math.round(42 * portionMultiplier);
  const carbsGrams = Math.round(38 * portionMultiplier);
  const fatGrams = Math.round((24 + dressingAdjustment / 9) * portionMultiplier);

  const handleKnobRotate = () => {
    playKnobTick();
    setPortionIndex((prev) => (prev + 1) % portionSteps.length);
  };

  const handleCookMethod = (method: 'GRILLED' | 'STEAMED' | 'PAN-FRIED', adj: number) => {
    playSwitchClick();
    setCookMethod(method);
    setCookAdjustment(adj);
  };

  const handleDressingClick = () => {
    playKnobTick();
    setDressingIndex((prev) => (prev + 1) % dressingLevels.length);
  };

  const handleToggleFlash = () => {
    playSwitchClick();
    setFlashOn(!flashOn);
  };

  const handleShutterCapture = () => {
    playShutterSnap();
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      showToast('Frame Analyzed', 'Spectral bio-metrics locked with 99.1% optical accuracy.');
    }, 280);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhotoUrl(url);
      playShutterSnap();
      showToast('Image Loaded', 'Spectral analysis initialized on imported frame.');
    }
  };

  const handleConfirmAndAdd = () => {
    playStampThud();
    addMeal({
      recipeNumber: '03',
      category: 'Dinner',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Pan-seared Salmon Fillet & Quinoa',
      subtitle: `${cookMethod.toLowerCase()} with avocado slices and greens`,
      calories: currentTotalKcal,
      macros: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fat: fatGrams,
      },
      imageUrl: customPhotoUrl || IMAGES.salmon,
      isAiLogged: true,
      isCompleted: true,
      satietyIndex: 4.5,
      calibreScore: 9.2,
    });
    setActiveTab('today');
  };

  return (
    <div className="flex flex-col w-full pb-28 relative">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#ebe8e1]/90 backdrop-blur-xl border-b border-[#dcc1b6]/40 shadow-[0_4px_16px_rgba(28,28,24,0.06)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Back"
              onClick={() => {
                playKnobTick();
                setActiveTab('today');
              }}
              className="w-10 h-10 rounded-xl bg-[#f1eee7] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-0.5 flex items-center justify-center text-[#1c1c18] hover:text-[#994110] transition-all"
            >
              <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
            </button>
            <div className="flex items-center gap-2">
              <img
                src={IMAGES.appIcon}
                alt="Calibre Icon"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <h1 className="font-headline-sm text-base text-[#1c1c18] font-bold">Ai Scan</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-[#ffdbcc] via-[#994110] to-[#7c2e00] shadow-[0_2px_5px_rgba(153,65,16,0.25),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center">
              <div className="rounded-full p-0.5 bg-[#ebe8e1]">
                <img
                  src={IMAGES.profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Scanner Body */}
      <main className="flex flex-col w-full px-4 pt-3 gap-4">
        {/* Mechanical Chassis Sub-header Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00855b] shadow-[0_0_8px_rgba(0,133,91,0.9),inset_0_1px_1px_rgba(255,255,255,0.7)] animate-pulse" />
            <span className="font-label-caps text-[11px] text-[#56433a] tracking-wider uppercase font-bold">
              SPECTRAL OPTIC ACTIVE // MK-IV
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#e5e2db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)]">
            <span className="font-label-fine text-[11px] text-[#56433a]">SENSOR:</span>
            <span className="font-label-caps text-[11px] text-[#994110] font-bold">
              BIO-VISION 4K
            </span>
          </div>
        </div>

        {/* VIEWFINDER APPARATUS */}
        <div className="relative rounded-2xl p-2.5 bg-gradient-to-b from-[#e5e2db] via-[#dcdad3] to-[#e5e2db] shadow-[0_12px_28px_rgba(28,28,24,0.22),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.35)]">
          {/* Metallic Knurling Band Rim */}
          <div className="relative rounded-xl p-2 bg-gradient-to-r from-[#dcdad3] via-[#f1eee7] to-[#dcdad3] shadow-[inset_0_2px_5px_rgba(0,0,0,0.45),0_1px_1px_rgba(255,255,255,0.9)]">
            {/* Screws on Corners */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-[#56433a]/70 rotate-45" />
            </div>
            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-[#56433a]/70 -rotate-45" />
            </div>
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-[#56433a]/70 -rotate-12" />
            </div>
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-[#56433a]/70 rotate-60" />
            </div>

            {/* Viewport Glass Chamber */}
            <div className="relative h-72 w-full rounded-lg overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
              {/* Food Image Stream */}
              <img
                src={customPhotoUrl || IMAGES.viewfinderSalmon}
                alt="Viewfinder Stream"
                className="w-full h-full object-cover"
              />

              {/* Flash / Lamp Simulation Overlay */}
              {flashOn && (
                <div className="absolute inset-0 bg-yellow-100/25 pointer-events-none mix-blend-screen" />
              )}

              {/* Shutter flash animation */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white z-40 animate-pulse pointer-events-none" />
              )}

              {/* Sapphire Optical Glare Reflection Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/25 mix-blend-screen" />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/55" />

              {/* Autofocus Reticle Ring & Laser Grid */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-48 h-48 rounded-full border border-[#6ffbbe]/30 flex items-center justify-center animate-pulse">
                  <div className="w-40 h-40 rounded-full border border-dashed border-[#6ffbbe]/40" />
                  <div className="absolute top-2 w-4 h-0.5 bg-[#6ffbbe] shadow-[0_0_6px_#4edea3]" />
                  <div className="absolute bottom-2 w-4 h-0.5 bg-[#6ffbbe] shadow-[0_0_6px_#4edea3]" />
                  <div className="absolute left-2 w-0.5 h-4 bg-[#6ffbbe] shadow-[0_0_6px_#4edea3]" />
                  <div className="absolute right-2 w-0.5 h-4 bg-[#6ffbbe] shadow-[0_0_6px_#4edea3]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffb595] shadow-[0_0_8px_#ffb595]" />
                </div>
              </div>

              {/* Top Viewfinder Telemetry Overlay */}
              <div className="absolute top-2.5 inset-x-3 flex items-center justify-between text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-1.5 bg-[#31312c]/60 backdrop-blur-md px-2 py-0.5 rounded">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
                  <span className="font-label-caps text-[10px] text-[#ffdbcc] tracking-widest font-bold">
                    LIVE REC
                  </span>
                </div>
                <div className="bg-[#31312c]/60 backdrop-blur-md px-2 py-0.5 rounded font-label-meter text-[11px] text-[#6ffbbe] tracking-wider">
                  0.35m MACRO // f/1.8
                </div>
              </div>

              {/* Tactile AI Bounding Tag 1: Salmon Fillet */}
              <div className="absolute top-8 left-4 max-w-[200px] z-20">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-2 h-2 rounded-sm bg-[#994110] shadow-[0_0_4px_#ffb595]" />
                  <div className="h-0.5 w-6 bg-[#994110]" />
                </div>
                <div className="p-1.5 rounded-md bg-[#31312c]/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-body-sm text-xs text-white font-semibold truncate">
                      Salmon Fillet
                    </span>
                    <span className="px-1 py-0.2 rounded bg-[#006947] font-label-caps text-[#6ffbbe] text-[9px] font-bold">
                      98% CONF
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className="font-label-caps text-[#dcc1b6] text-[10px]">180g</span>
                    <span className="font-label-meter text-xs text-[#ffdbcc] font-bold">
                      ~ {Math.round(370 * portionMultiplier)} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* Tactile AI Bounding Tag 2: Avocado Slices */}
              <div className="absolute top-28 right-3 max-w-[170px] z-20">
                <div className="flex items-center justify-end gap-1 mb-0.5">
                  <div className="h-0.5 w-8 bg-[#6ffbbe]" />
                  <div className="w-2 h-2 rounded-sm bg-[#6ffbbe] shadow-[0_0_4px_#6ffbbe]" />
                </div>
                <div className="p-1.5 rounded-md bg-[#31312c]/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-body-sm text-xs text-white font-semibold truncate">
                      Avocado Slices
                    </span>
                    <span className="font-label-caps text-[#6ffbbe] text-[9px]">50g</span>
                  </div>
                  <div className="flex items-baseline justify-end mt-0.5">
                    <span className="font-label-meter text-xs text-[#6ffbbe] font-bold">
                      ~ {Math.round(80 * portionMultiplier)} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* Tactile AI Bounding Tag 3: Tri-color Quinoa & Greens */}
              <div className="absolute bottom-3 left-4 max-w-[210px] z-20">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-2 h-2 rounded-sm bg-[#39b8fd] shadow-[0_0_4px_#39b8fd]" />
                  <div className="h-0.5 w-6 bg-[#39b8fd]" />
                </div>
                <div className="p-1.5 rounded-md bg-[#31312c]/90 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <span className="font-body-sm text-xs text-white font-semibold block truncate">
                    Quinoa &amp; Field Greens
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className="font-label-caps text-[#dcc1b6] text-[10px]">120g</span>
                    <span className="font-label-meter text-xs text-[#c9e6ff] font-bold">
                      ~ {Math.round(150 * portionMultiplier)} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower Viewport Gauge Tape */}
              <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-[#31312c]/75 backdrop-blur-md flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#6ffbbe]">
                  center_focus_strong
                </span>
                <span className="font-label-caps text-[10px] text-[#f3f0e9] font-bold">
                  AUTO-LOCKED
                </span>
              </div>
            </div>

            {/* Etched Precision Gauge Ring Below Lens */}
            <div className="mt-2 pt-1 flex items-center justify-between px-2 font-label-caps text-[10px] text-[#56433a]/80">
              <button
                type="button"
                onClick={() => setSelectedFocal('28mm')}
                className={`cursor-pointer ${selectedFocal === '28mm' ? 'text-[#994110] font-bold' : ''}`}
              >
                | 28mm
              </button>
              <button
                type="button"
                onClick={() => setSelectedFocal('35mm')}
                className={`cursor-pointer ${selectedFocal === '35mm' ? 'text-[#994110] font-bold' : ''}`}
              >
                || 35mm
              </button>
              <button
                type="button"
                onClick={() => setSelectedFocal('50mm')}
                className={`cursor-pointer ${selectedFocal === '50mm' ? 'text-[#994110] font-bold' : ''}`}
              >
                ||| 50mm BIO-EQ
              </button>
              <button
                type="button"
                onClick={() => setSelectedFocal('85mm')}
                className={`cursor-pointer ${selectedFocal === '85mm' ? 'text-[#994110] font-bold' : ''}`}
              >
                || 85mm
              </button>
              <button
                type="button"
                onClick={() => setSelectedFocal('105mm')}
                className={`cursor-pointer ${selectedFocal === '105mm' ? 'text-[#994110] font-bold' : ''}`}
              >
                | 105mm
              </button>
            </div>
          </div>
        </div>

        {/* ANALOG NUTRITION BREAKDOWN RIBBON */}
        <div className="rounded-xl p-4 bg-[#f1eee7] shadow-[0_8px_16px_rgba(28,28,24,0.08),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(0,0,0,0.15)]">
          {/* Panel Header & Glowing Nixie Odometer Counter */}
          <div className="flex items-center justify-between pb-3 relative">
            <div className="flex flex-col">
              <span className="font-label-caps text-xs text-[#56433a] uppercase tracking-wider font-bold">
                AGGREGATE NUTRITION
              </span>
              <span className="font-headline-sm text-sm text-[#1c1c18] font-bold">
                Spectral Estimate
              </span>
            </div>

            {/* Glowing Amber Nixie-Tube */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#31312c] shadow-[inset_0_3px_8px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.7)]">
              <div className="flex items-baseline gap-1">
                <span className="font-label-meter text-2xl font-bold tracking-tight text-[#ffdbcc] drop-shadow-[0_0_10px_rgba(255,181,149,0.85)]">
                  {currentTotalKcal}
                </span>
                <span className="font-label-caps text-[11px] text-[#ffb595] uppercase font-bold">
                  kcal
                </span>
              </div>
              <span
                className="material-symbols-outlined text-[#ffb595] text-base ml-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
            </div>
          </div>

          {/* Groove Divider */}
          <div className="h-0.5 w-full bg-[#dcc1b6]/30 shadow-[0_1px_0_rgba(255,255,255,0.8)] mb-3" />

          {/* Tactile Macro Quick-Gauges */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {/* Protein */}
            <div className="p-2 rounded-lg bg-[#f6f3ec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)] flex flex-col">
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">PROTEIN</span>
              <span className="font-headline-sm text-base text-[#1c1c18] font-bold mt-0.5">
                {proteinGrams}
                <span className="text-[11px] font-normal text-[#56433a]">g</span>
              </span>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2db] mt-1.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                <div
                  className="h-full bg-[#b95928] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (proteinGrams / 50) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="p-2 rounded-lg bg-[#f6f3ec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)] flex flex-col">
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">CARBS</span>
              <span className="font-headline-sm text-base text-[#1c1c18] font-bold mt-0.5">
                {carbsGrams}
                <span className="text-[11px] font-normal text-[#56433a]">g</span>
              </span>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2db] mt-1.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                <div
                  className="h-full bg-[#39b8fd] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (carbsGrams / 50) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="p-2 rounded-lg bg-[#f6f3ec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)] flex flex-col">
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">
                HEALTHY FAT
              </span>
              <span className="font-headline-sm text-base text-[#1c1c18] font-bold mt-0.5">
                {fatGrams}
                <span className="text-[11px] font-normal text-[#56433a]">g</span>
              </span>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2db] mt-1.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                <div
                  className="h-full bg-[#00855b] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (fatGrams / 35) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Physical Controls Area: Rotary Knob & Cook Method */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Control 1: Rotary Knurled Portion Knob */}
            <div className="p-2.5 rounded-lg bg-[#ebe8e1] shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] flex flex-col items-center">
              <span className="font-label-caps text-[10px] text-[#56433a] mb-2 font-bold">
                PORTION SCALE
              </span>
              <div
                onClick={handleKnobRotate}
                className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#dcdad3] via-[#fcf9f2] to-[#e5e2db] shadow-[0_6px_10px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                style={{ transform: `rotate(${(portionIndex - 1) * 35}deg)` }}
                title="Tap to rotate portion"
              >
                <div className="absolute inset-1 rounded-full border border-dashed border-[#dcc1b6]/60" />
                <div className="w-10 h-10 rounded-full bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center relative">
                  <div className="absolute top-1 w-1 h-3 rounded-full bg-[#994110] shadow-[0_0_3px_#994110]" />
                  <span className="font-label-meter text-[11px] font-bold text-[#1c1c18] mt-1">
                    {portionMultiplier.toFixed(1)}x
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full mt-2 font-label-fine text-[11px] text-[#56433a]">
                <span>0.8x</span>
                <span className="text-[#994110] font-bold">{portionMultiplier.toFixed(1)}x</span>
                <span>1.5x</span>
              </div>
            </div>

            {/* Control 2: 3-Position Cook Method Toggle Switch */}
            <div className="p-2.5 rounded-lg bg-[#ebe8e1] shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] flex flex-col justify-between">
              <span className="font-label-caps text-[10px] text-[#56433a] text-center font-bold">
                COOK METHOD
              </span>
              <div className="mt-1 p-1 rounded-lg bg-[#dcdad3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.8)] flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleCookMethod('GRILLED', 0)}
                  className={`w-full py-1 rounded text-center font-label-caps text-[10px] transition-all font-bold ${
                    cookMethod === 'GRILLED'
                      ? 'bg-white text-[#994110] shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]'
                      : 'text-[#56433a] hover:text-[#1c1c18]'
                  }`}
                >
                  GRILLED
                </button>
                <button
                  type="button"
                  onClick={() => handleCookMethod('STEAMED', -40)}
                  className={`w-full py-1 rounded text-center font-label-caps text-[10px] transition-all font-bold ${
                    cookMethod === 'STEAMED'
                      ? 'bg-white text-[#994110] shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]'
                      : 'text-[#56433a] hover:text-[#1c1c18]'
                  }`}
                >
                  STEAMED
                </button>
                <button
                  type="button"
                  onClick={() => handleCookMethod('PAN-FRIED', 65)}
                  className={`w-full py-1 rounded text-center font-label-caps text-[10px] transition-all font-bold ${
                    cookMethod === 'PAN-FRIED'
                      ? 'bg-white text-[#994110] shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]'
                      : 'text-[#56433a] hover:text-[#1c1c18]'
                  }`}
                >
                  PAN-FRIED
                </button>
              </div>
            </div>
          </div>

          {/* Physical Slider: Oil & Dressing Potentiometer */}
          <div className="p-2.5 rounded-lg bg-[#ebe8e1] shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">
                OIL / DRESSING COMPENSATION
              </span>
              <span className="font-label-meter text-xs text-[#994110] font-bold">
                +{dressingAdjustment} kcal
              </span>
            </div>
            {/* Recessed Channel Track */}
            <div
              onClick={handleDressingClick}
              className="relative w-full h-6 rounded-full bg-[#dcdad3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)] flex items-center px-1 cursor-pointer"
            >
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#994110] to-[#b95928] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-200"
                style={{ width: dressingLevels[dressingIndex].pct }}
              />
              <div
                className="absolute -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-white via-[#ebe8e1] to-[#dcdad3] shadow-[0_3px_6px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{ left: dressingLevels[dressingIndex].pct }}
              >
                <div className="w-1 h-3 rounded-full bg-[#897269] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
              </div>
            </div>
            <div className="flex items-center justify-between font-label-fine text-[11px] text-[#56433a] mt-1.5 px-1">
              <span>Dry (0 kcal)</span>
              <span>Light (+45)</span>
              <span>Heavy (+110)</span>
            </div>
          </div>
        </div>

        {/* MECHANICAL SHUTTER CONSOLE & ACTION PANEL */}
        <div className="rounded-2xl p-4 bg-[#e5e2db] shadow-[0_10px_24px_rgba(28,28,24,0.14),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2)]">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center justify-around mb-4">
            {/* Barcode / Upload alternative */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-xl bg-[#f1eee7] shadow-[0_4px_8px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#1c1c18] hover:text-[#994110] transition-all"
                title="Scan Barcode or Upload Photo"
              >
                <span className="material-symbols-outlined text-2xl drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                  barcode_scanner
                </span>
              </button>
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">BARCODE</span>
            </div>

            {/* Central Shutter Button (Chrome Ring + Metallic Red Plunger) */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={handleShutterCapture}
                className="group relative w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-[#dcdad3] via-[#fcf9f2] to-[#dcdad3] shadow-[0_8px_18px_rgba(0,0,0,0.35),inset_0_2px_2px_rgba(255,255,255,0.9)] active:translate-y-1 transition-all"
              >
                <div className="w-full h-full rounded-full p-1 bg-gradient-to-b from-[#dcdad3] to-[#31312c] shadow-[inset_0_2px_5px_rgba(0,0,0,0.6),0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#ba1a1a] via-[#b95928] to-[#93000a] shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_4px_6px_rgba(0,0,0,0.4)] flex items-center justify-center group-active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-white text-2xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
                      photo_camera
                    </span>
                  </div>
                </div>
              </button>
              <span className="font-label-caps text-xs text-[#1c1c18] font-bold tracking-wider">
                ANALYZE
              </span>
            </div>

            {/* Flash / Lamp Toggle */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleToggleFlash}
                className={`w-12 h-12 rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.9)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all ${
                  flashOn ? 'bg-[#ffdbcc] text-[#351000]' : 'bg-[#f1eee7] text-[#1c1c18]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
                  style={{ fontVariationSettings: flashOn ? "'FILL' 1" : "'FILL' 0" }}
                >
                  flash_on
                </span>
              </button>
              <span className="font-label-caps text-[10px] text-[#56433a] font-bold">
                {flashOn ? 'LAMP: ON' : 'LAMP: OFF'}
              </span>
            </div>
          </div>

          {/* Heavy Pill Button: CONFIRM & ADD TO LOG */}
          <button
            type="button"
            onClick={handleConfirmAndAdd}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-b from-[#994110] via-[#b95928] to-[#994110] shadow-[0_6px_14px_rgba(153,65,16,0.38),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2 text-white transition-all font-bold"
          >
            <span
              className="material-symbols-outlined text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-label-caps text-xs tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              CONFIRM &amp; ADD TO LOG
            </span>
          </button>

          {/* Inspection Audit Label */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#897269]" />
            <span className="font-label-fine text-[11px] text-[#56433a]">
              CALIBRE OPTO-ANALYTIC ENGINE #892-B
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#897269]" />
          </div>
        </div>
      </main>
    </div>
  );
};
