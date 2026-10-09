import React, { useState } from 'react';
import { useApp, IMAGES } from '../context/AppContext';
import { playKnobTick, playSwitchClick, playWaterDrop, playStampThud } from '../utils/audio';

export const VaultScreen: React.FC = () => {
  const {
    selectedVaultDate,
    setSelectedVaultDate,
    addWater,
    setActiveTab,
    showToast,
    settings,
  } = useApp();

  const [aiLoggedToggle1, setAiLoggedToggle1] = useState(true);
  const [sortAsc, setSortAsc] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualDish, setManualDish] = useState('');
  const [manualKcal, setManualKcal] = useState('');

  const dateTabs = [
    { label: 'MON', num: 21, active: false },
    { label: 'TUE', num: 22, active: false },
    { label: 'WED', num: 23, active: true, isToday: true },
    { label: 'THU', num: 24, active: false },
    { label: 'FRI', num: 25, active: false, dim: true },
  ];

  const handleDateSelect = (num: number) => {
    playKnobTick();
    setSelectedVaultDate(num);
  };

  const handleBarcodeClick = () => {
    playKnobTick();
    showToast('Barcode Laser Sensor', 'Simulating GS1 optical food barcode alignment.');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDish || !manualKcal) return;
    playStampThud();
    showToast('Manual Entry Filed', `${manualDish} (${manualKcal} kcal) recorded into Vault.`);
    setManualDish('');
    setManualKcal('');
    setManualModalOpen(false);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Header matching mockup */}
      <header className="sticky top-0 z-40 bg-[#ebe8e1]/90 backdrop-blur-xl border-b border-[#dcc1b6]/40 shadow-[0_4px_16px_rgba(28,28,24,0.06)] px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Decorative Corner Screws */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
          </div>
          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
          </div>

          {/* Left Brand */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#f1eee7] shadow-[inset_0_1px_2px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.9)]">
              <img
                src={IMAGES.appIcon}
                alt="Calibre Icon"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-xs text-[#1c1c18] tracking-widest font-bold">
                CALIBRE
              </span>
              <span className="font-label-fine text-[11px] text-[#56433a]">Vault</span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_1px_rgba(255,255,255,0.9)]">
              <div className="w-2 h-2 rounded-full bg-[#006947] shadow-[0_0_6px_#4edea3]" />
              <span className="font-label-meter text-[11px] text-[#006947] font-bold">
                STREAK 14D
              </span>
            </div>

            {/* Battery / Power */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f1eee7] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
              <span className="material-symbols-outlined text-[#006947] text-sm drop-shadow-[0_0_3px_#6ffbbe]">
                bolt
              </span>
              <div className="w-8 h-2 rounded-full bg-[#e5e2db] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                <div className="w-3/4 h-full bg-[#006947] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
              </div>
            </div>

            {/* Profile Avatar */}
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

      {/* Main Drawer Content */}
      <main className="px-4 pt-3 flex flex-col gap-4">
        {/* TOP DATE NAVIGATION & BAKELITE TAB SELECTOR */}
        <section className="flex flex-col gap-2">
          {/* Brass rivet accent strip */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
              </div>
              <span className="font-label-caps text-[11px] text-[#56433a] tracking-widest uppercase font-bold">
                REGISTRY NO. 048-A
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#994110]">history_edu</span>
              <span className="font-label-meter text-[11px] text-[#56433a] uppercase font-bold">
                OCTOBER ARCHIVE
              </span>
            </div>
          </div>

          {/* Date Drawer Selector Deck */}
          <div className="relative w-full rounded-xl p-1 bg-[#e5e2db] shadow-[inset_0_3px_6px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.85)] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {dateTabs.map((tab) => {
              const isSelected = selectedVaultDate === tab.num;
              if (isSelected) {
                return (
                  <button
                    key={tab.num}
                    type="button"
                    onClick={() => handleDateSelect(tab.num)}
                    className="flex-1 py-2 px-2.5 rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-[#994110] via-[#b95928] to-[#7c2e00] text-white shadow-[0_4px_8px_rgba(153,65,16,0.35),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_3px_rgba(0,0,0,0.3)] transition-all"
                  >
                    <span className="font-label-caps text-[9px] uppercase tracking-widest text-[#ffdbcc]">
                      TODAY
                    </span>
                    <span className="font-label-meter text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] font-bold">
                      {tab.num} {tab.label}
                    </span>
                  </button>
                );
              }
              return (
                <button
                  key={tab.num}
                  type="button"
                  onClick={() => handleDateSelect(tab.num)}
                  className={`flex-1 py-1.5 px-2 rounded-lg flex flex-col items-center justify-center bg-[#f1eee7] shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-0.5 transition-all text-[#56433a] hover:text-[#1c1c18] ${
                    tab.dim ? 'opacity-60' : ''
                  }`}
                >
                  <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#897269]">
                    {tab.label}
                  </span>
                  <span className="font-label-meter text-sm text-[#1c1c18] font-bold">
                    {tab.num}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* MACRO INSTRUMENT CLUSTER GAUGES (CHRONO-MACRO MANOMETER) */}
        <section className="my-1">
          <div className="relative p-3 rounded-xl bg-[#ebe8e1] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(28,28,24,0.08)] flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#994110]">speed</span>
                <span className="font-label-caps text-xs text-[#1c1c18] uppercase tracking-wider font-bold">
                  CHRONO-MACRO MANOMETER
                </span>
              </div>
              <span className="font-label-caps text-[10px] text-[#006947] font-bold tracking-widest bg-[#6ffbbe]/40 px-2 py-0.5 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                78% ON-TARGET
              </span>
            </div>

            {/* 3 Circular Recessed Barrels */}
            <div className="grid grid-cols-3 gap-2">
              {/* Protein Dial */}
              <div className="rounded-lg p-2.5 bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.85)] flex flex-col items-center text-center relative overflow-hidden">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#994110] font-bold">
                  PROTEIN
                </span>
                <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e5e2db]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#b95928]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="78, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-label-meter text-[12px] leading-tight text-[#1c1c18] font-bold">
                      110
                    </span>
                    <span className="font-label-fine text-[8px] text-[#897269]">/140g</span>
                  </div>
                </div>
                <span className="font-label-fine text-[10px] text-[#56433a] font-medium">
                  30g Rem.
                </span>
              </div>

              {/* Carbs Dial */}
              <div className="rounded-lg p-2.5 bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.85)] flex flex-col items-center text-center relative overflow-hidden">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#006591] font-bold">
                  CARBS
                </span>
                <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e5e2db]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#006591]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="69, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-label-meter text-[12px] leading-tight text-[#1c1c18] font-bold">
                      145
                    </span>
                    <span className="font-label-fine text-[8px] text-[#897269]">/210g</span>
                  </div>
                </div>
                <span className="font-label-fine text-[10px] text-[#56433a] font-medium">
                  65g Rem.
                </span>
              </div>

              {/* Lipids Dial */}
              <div className="rounded-lg p-2.5 bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.85)] flex flex-col items-center text-center relative overflow-hidden">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#00855b] font-bold">
                  LIPIDS
                </span>
                <div className="relative w-14 h-14 my-1 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e5e2db]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#00855b]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="74, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-label-meter text-[12px] leading-tight text-[#1c1c18] font-bold">
                      48
                    </span>
                    <span className="font-label-fine text-[8px] text-[#897269]">/65g</span>
                  </div>
                </div>
                <span className="font-label-fine text-[10px] text-[#56433a] font-medium">
                  17g Rem.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MEAL CHRONOLOGICAL INDEX CARDS DRAWER */}
        <section className="flex flex-col gap-3.5 mt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-[11px] text-[#56433a] uppercase tracking-widest font-bold">
                DRAWER CARD ENTRIES
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#e5e2db] font-label-caps text-[9px] text-[#897269] font-bold">
                5 FILED
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playKnobTick();
                setSortAsc(!sortAsc);
              }}
              className="font-label-caps text-[11px] text-[#994110] hover:text-[#7c2e00] flex items-center gap-0.5 font-bold"
            >
              <span>SORT TIME</span>
              <span className="material-symbols-outlined text-sm">unfold_more</span>
            </button>
          </div>

          {/* CARD 1: BREAKFAST (8:30 AM) */}
          <article className="relative rounded-xl p-4 bg-[#f6f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_-2px_rgba(28,28,24,0.14)] rotate-[-0.35deg] transition-transform hover:rotate-0">
            {/* Stamped Header Tape */}
            <div className="flex items-start justify-between pb-2.5">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-[#ffdbcc] text-[#351000] font-label-caps text-[10px] tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.1)] font-bold">
                  RECIPE #01 • BREAKFAST
                </div>
                <span className="font-label-caps text-[11px] text-[#897269]">08:30 AM</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-meter text-lg text-[#994110] font-bold">460</span>
                <span className="font-label-caps text-[10px] text-[#56433a]">KCAL</span>
              </div>
            </div>

            {/* Main Dish Info with Photo & Brass Corner Bracket */}
            <div className="flex gap-3 items-center">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden p-0.5 bg-[#e5e2db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                <img
                  src={IMAGES.oats}
                  alt="Steel-cut oats"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute top-0.5 left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-headline-sm text-sm text-[#1c1c18] font-bold truncate">
                  Steel-cut oats &amp; almond butter
                </h3>
                <p className="font-body-sm text-xs text-[#56433a] line-clamp-1">
                  With organic blueberries and chia seeds
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-label-caps text-[10px] text-[#994110] font-bold">14g P</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006591] font-bold">62g C</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006947] font-bold">18g F</span>
                </div>
              </div>
            </div>

            {/* Tactile Toggle Switch: 'Logged with AI Scan' */}
            <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-[#dcc1b6]/30">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006947]">
                  document_scanner
                </span>
                <span className="font-label-fine text-xs text-[#56433a]">
                  Optical Scan Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-caps text-[9px] text-[#006947] font-bold">
                  AI LOGGED
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playSwitchClick();
                    setAiLoggedToggle1(!aiLoggedToggle1);
                  }}
                  className="w-10 h-5 rounded-full bg-[#00855b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative flex items-center px-0.5 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9)] transform transition-transform ${
                      aiLoggedToggle1 ? 'ml-auto' : 'ml-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </article>

          {/* CARD 2: LUNCH (1:15 PM) */}
          <article className="relative rounded-xl p-4 bg-[#f6f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_-2px_rgba(28,28,24,0.14)] rotate-[0.4deg] transition-transform hover:rotate-0">
            <div className="flex items-start justify-between pb-2.5">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-[#e5e2db] text-[#56433a] font-label-caps text-[10px] tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.08)] font-bold">
                  RECIPE #02 • MIDDAY
                </div>
                <span className="font-label-caps text-[11px] text-[#897269]">01:15 PM</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-meter text-lg text-[#994110] font-bold">620</span>
                <span className="font-label-caps text-[10px] text-[#56433a]">KCAL</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden p-0.5 bg-[#e5e2db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                <img
                  src={IMAGES.chickenQuinoa}
                  alt="Grilled Chicken Quinoa Bowl"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute top-0.5 left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-headline-sm text-sm text-[#1c1c18] font-bold truncate">
                  Grilled Chicken Quinoa Bowl
                </h3>
                <p className="font-body-sm text-xs text-[#56433a] line-clamp-1">
                  Steamed greens, citrus tahini, seeds
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-label-caps text-[10px] text-[#994110] font-bold">48g P</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006591] font-bold">54g C</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006947] font-bold">16g F</span>
                </div>
              </div>
            </div>

            {/* Caloric Division Breakdown */}
            <div className="mt-3 pt-2.5 flex flex-col gap-2 border-t border-[#dcc1b6]/30">
              <div className="p-2.5 rounded-lg bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18),0_1px_0_rgba(255,255,255,0.85)] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[#897269]">
                  <span className="font-label-caps text-[9px] uppercase tracking-wider font-bold">
                    CALORIC DIVISION BREAKDOWN
                  </span>
                  <span className="font-label-caps text-[9px] text-[#006947] font-bold">
                    HIGH DENSITY
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] flex overflow-hidden">
                  <div className="h-full bg-[#994110]" style={{ width: '32%' }} />
                  <div className="h-full bg-[#006591]" style={{ width: '44%' }} />
                  <div className="h-full bg-[#006947]" style={{ width: '24%' }} />
                </div>
                <div className="flex justify-between items-center text-[#56433a] font-label-fine text-[10px] pt-0.5">
                  <span>Chicken Breast 180g (295 kcal)</span>
                  <span className="font-label-meter text-[10px] text-[#1c1c18] font-bold">
                    Quinoa 150g (222 kcal)
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 3: AFTERNOON HYDRATION CHECK (3:45 PM) */}
          <article className="relative rounded-xl p-3.5 bg-[#f6f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(28,28,24,0.12)] rotate-[-0.2deg] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#39b8fd] via-[#006591] to-[#004666] shadow-[0_4px_8px_rgba(0,101,145,0.35),inset_0_1px_2px_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(0,0,0,0.4)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  water_drop
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-[10px] uppercase text-[#006591] font-bold tracking-wider">
                    HYDRATION VIAL
                  </span>
                  <span className="font-label-caps text-[11px] text-[#897269]">03:45 PM</span>
                </div>
                <h4 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Pure Spring Water
                </h4>
                <span className="font-body-sm text-xs text-[#56433a]">
                  Electrolytes &amp; Pink Himalayan Salt
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-0.5">
                <span className="font-label-meter text-lg text-[#006591] font-bold">+750</span>
                <span className="font-label-caps text-[9px] text-[#56433a]">ML</span>
              </div>
              <span className="font-label-caps text-[9px] text-[#006947] font-bold tracking-widest bg-[#6ffbbe]/30 px-1.5 py-0.5 rounded shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                PASSED
              </span>
            </div>
          </article>

          {/* CARD 4: DINNER (7:30 PM) */}
          <article className="relative rounded-xl p-4 bg-[#f6f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_-2px_rgba(28,28,24,0.14)] rotate-[0.25deg] transition-transform hover:rotate-0">
            <div className="flex items-start justify-between pb-2.5">
              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded bg-[#e5e2db] text-[#56433a] font-label-caps text-[10px] tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.08)] font-bold">
                  RECIPE #03 • SUPPER
                </div>
                <span className="font-label-caps text-[11px] text-[#897269]">07:30 PM</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-label-meter text-lg text-[#994110] font-bold">590</span>
                <span className="font-label-caps text-[10px] text-[#56433a]">KCAL</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden p-0.5 bg-[#e5e2db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                <img
                  src={IMAGES.salmon}
                  alt="Pan-seared Salmon Fillet"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute top-0.5 left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#ffdbcc] shadow-[0_1px_1px_rgba(0,0,0,0.4)] pointer-events-none" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="font-headline-sm text-sm text-[#1c1c18] font-bold truncate">
                  Pan-seared Salmon Fillet
                </h3>
                <p className="font-body-sm text-xs text-[#56433a] line-clamp-1">
                  With grilled asparagus &amp; lemon butter
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-label-caps text-[10px] text-[#994110] font-bold">42g P</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006591] font-bold">18g C</span>
                  <span className="text-[#897269] text-[10px]">•</span>
                  <span className="font-label-caps text-[10px] text-[#006947] font-bold">28g F</span>
                </div>
              </div>
            </div>

            {/* Satiety Index & Stepped Dial Indicator */}
            <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-[#dcc1b6]/30">
              <div className="flex flex-col">
                <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#897269] font-bold">
                  SATIETY INDEX
                </span>
                <div className="flex items-center gap-1 mt-0.5 text-[#994110]">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-base">star_half</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)]">
                <span className="material-symbols-outlined text-sm text-[#994110]">tune</span>
                <span className="font-label-meter text-[11px] text-[#1c1c18] font-bold">
                  CALIBRE 9.2
                </span>
              </div>
            </div>
          </article>

          {/* CARD 5: NIGHTCAP (9:15 PM) */}
          <article className="relative rounded-xl p-3.5 bg-[#f6f3ec] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(28,28,24,0.12)] rotate-[-0.3deg] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center shrink-0 text-[#56433a]">
                <span className="material-symbols-outlined text-xl text-[#994110]">
                  emoji_food_beverage
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-[10px] uppercase text-[#897269] font-bold">
                    NIGHTCAP
                  </span>
                  <span className="font-label-caps text-[11px] text-[#897269]">09:15 PM</span>
                </div>
                <h4 className="font-headline-sm text-sm font-bold text-[#1c1c18] truncate">
                  Chamomile Tea &amp; Raw Walnuts
                </h4>
                <span className="font-body-sm text-xs text-[#56433a]">
                  Magnesium &amp; melatonin support (25g nuts)
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <div className="flex items-baseline gap-0.5">
                <span className="font-label-meter text-lg text-[#994110] font-bold">150</span>
                <span className="font-label-caps text-[9px] text-[#56433a]">KCAL</span>
              </div>
              <span className="font-label-caps text-[9px] text-[#897269]">6g P • 14g F</span>
            </div>
          </article>
        </section>

        {/* FAST ENTRY MECHANICAL TRAY & METALLIC PLAQUE */}
        <section className="mt-3 flex flex-col gap-3">
          {/* Tactile Inset Tray with 3 Spring-Loaded Push Buttons */}
          <div className="p-2 rounded-2xl bg-[#e5e2db] shadow-[inset_0_3px_6px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.85)] flex items-center gap-2">
            {/* Button 1: Quick Water Log */}
            <button
              type="button"
              onClick={() => addWater(250)}
              className="flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-[#f1eee7] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_6px_-1px_rgba(31,36,33,0.18)] active:translate-y-1 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#c9e6ff]/50 flex items-center justify-center text-[#006591] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                <span
                  className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  add_circle
                </span>
              </div>
              <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#1c1c18] font-bold text-center leading-tight">
                +250ml H₂O
              </span>
              <span className="font-label-fine text-[8px] text-[#897269]">ONE-CLICK</span>
            </button>

            {/* Button 2: Quick Barcode Scan */}
            <button
              type="button"
              onClick={handleBarcodeClick}
              className="flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-[#f1eee7] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_6px_-1px_rgba(31,36,33,0.18)] active:translate-y-1 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#ffdbcc]/50 flex items-center justify-center text-[#994110] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                  barcode_scanner
                </span>
              </div>
              <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#1c1c18] font-bold text-center leading-tight">
                BARCODE
              </span>
              <span className="font-label-fine text-[8px] text-[#897269]">LASER SENSOR</span>
            </button>

            {/* Button 3: Manual Precision Dial-In */}
            <button
              type="button"
              onClick={() => {
                playKnobTick();
                setManualModalOpen(true);
              }}
              className="flex-1 py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-[#f1eee7] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_6px_-1px_rgba(31,36,33,0.18)] active:translate-y-1 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.4)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#6ffbbe]/50 flex items-center justify-center text-[#006947] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                  dialpad
                </span>
              </div>
              <span className="font-label-caps text-[9px] uppercase tracking-wider text-[#1c1c18] font-bold text-center leading-tight">
                MANUAL
              </span>
              <span className="font-label-fine text-[8px] text-[#897269]">PRECISION</span>
            </button>
          </div>

          {/* DAILY TOTAL SUMMARY METALLIC ENGRAVED PLAQUE */}
          <div className="relative p-3.5 rounded-xl bg-gradient-to-r from-[#ebe8e1] via-[#e5e2db] to-[#ebe8e1] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_10px_rgba(28,28,24,0.1)] flex items-center justify-between overflow-hidden">
            {/* Corner Screws */}
            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
            </div>
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
            </div>
            <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
            </div>
            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
            </div>

            <div className="flex flex-col pl-2">
              <span className="font-label-caps text-[9px] uppercase text-[#897269] tracking-widest font-bold">
                CALIBRE LOGBOOK AUDIT
              </span>
              <span className="font-label-meter text-[13px] text-[#1c1c18] uppercase tracking-wider font-bold">
                TOTAL REGISTERED
              </span>
            </div>

            <div className="flex items-center gap-3 pr-2">
              <div className="flex flex-col items-end">
                <span className="font-label-caps text-[10px] text-[#994110] uppercase font-bold">
                  1,820 KCAL
                </span>
                <span className="font-label-fine text-[9px] text-[#897269]">
                  TARGET: {settings.targetCalories.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-6 bg-[#dcc1b6]" />
              <div className="flex flex-col items-end">
                <span className="font-label-caps text-[10px] text-[#006591] uppercase font-bold">
                  2,500 ML
                </span>
                <span className="font-label-fine text-[9px] text-[#006947] font-bold">
                  100% MET
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Manual Precision Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl p-5 bg-[#f6f3ec] border border-[#dcc1b6] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcc1b6]/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006947]">dialpad</span>
                <h3 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Manual Precision Entry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="text-[#897269] hover:text-[#1c1c18] text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="font-label-caps text-[10px] text-[#56433a] font-bold block mb-1">
                  FOOD ITEM / RECIPE
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough Toast & Butter"
                  value={manualDish}
                  onChange={(e) => setManualDish(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#dcc1b6] bg-white focus:outline-none focus:border-[#994110]"
                  required
                />
              </div>
              <div>
                <label className="font-label-caps text-[10px] text-[#56433a] font-bold block mb-1">
                  CALORIC VALUE (KCAL)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 280"
                  value={manualKcal}
                  onChange={(e) => setManualKcal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#dcc1b6] bg-white focus:outline-none focus:border-[#994110]"
                  required
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold text-[#897269] bg-[#e5e2db]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-b from-[#994110] to-[#7c2e00] shadow-md active:scale-98"
                >
                  Commit to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
