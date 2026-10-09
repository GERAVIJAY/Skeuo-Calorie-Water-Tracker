import React, { useState } from 'react';
import { useApp, IMAGES } from '../context/AppContext';
import { playKnobTick, playStampThud } from '../utils/audio';

export const WeeklyScreen: React.FC = () => {
  const { showToast } = useApp();
  const [weekNum, setWeekNum] = useState(43);
  const [exportState, setExportState] = useState<'idle' | 'sealing' | 'exported'>('idle');
  const [showExportModal, setShowExportModal] = useState(false);

  const tubeData = [
    { day: 'M', diff: '+80', isOver: true, height: '68%' },
    { day: 'T', diff: '-120', isOver: false, height: '56%' },
    { day: 'W', diff: '-310', isOver: false, height: '48%' },
    { day: 'T', diff: '-50', isOver: false, height: '60%' },
    { day: 'F', diff: '-180', isOver: false, height: '54%' },
    { day: 'S', diff: '+140', isOver: true, height: '72%' },
    { day: 'S', diff: '-400', isOver: false, height: '44%' },
  ];

  const bottleData = [
    { day: 'M', vol: '2.6L', pct: '100%' },
    { day: 'T', vol: '2.5L', pct: '95%' },
    { day: 'W', vol: '2.8L', pct: '100%' },
    { day: 'T', vol: '2.4L', pct: '90%' },
    { day: 'F', vol: '2.6L', pct: '100%' },
    { day: 'S', vol: '2.2L', pct: '85%' },
    { day: 'S', vol: '2.7L', pct: '100%' },
  ];

  const handleWeekPrev = () => {
    playKnobTick();
    setWeekNum((prev) => Math.max(1, prev - 1));
  };

  const handleWeekNext = () => {
    playKnobTick();
    setWeekNum((prev) => Math.min(52, prev + 1));
  };

  const handleExportClick = () => {
    playStampThud();
    setExportState('sealing');
    setTimeout(() => {
      setExportState('exported');
      showToast('Folio PDF Exported', 'Certified expedition document compiled.');
      setShowExportModal(true);
      setTimeout(() => {
        setExportState('idle');
      }, 2500);
    }, 1100);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Header matching mockup */}
      <header className="sticky top-0 z-40 bg-[#ebe8e1]/90 backdrop-blur-xl border-b border-[#dcc1b6]/40 shadow-[0_4px_16px_rgba(28,28,24,0.06)] px-4 py-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
          </div>
          <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-[#897269]" />
          </div>

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
              <span className="font-label-fine text-[11px] text-[#56433a]">Weekly</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#f1eee7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_1px_rgba(255,255,255,0.9)]">
              <div className="w-2 h-2 rounded-full bg-[#006947] shadow-[0_0_6px_#4edea3]" />
              <span className="font-label-meter text-[11px] text-[#006947] font-bold">
                STREAK 14D
              </span>
            </div>

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f1eee7] shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
              <span className="material-symbols-outlined text-[#006947] text-sm drop-shadow-[0_0_3px_#6ffbbe]">
                bolt
              </span>
              <div className="w-8 h-2 rounded-full bg-[#e5e2db] overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                <div className="w-3/4 h-full bg-[#006947] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
              </div>
            </div>

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

      {/* Main Content */}
      <main className="px-4 pt-3 flex flex-col gap-4">
        {/* Physical Brass Bookmark & Week Selector Header */}
        <div className="relative w-full rounded-xl bg-[#ebe8e1] p-4 shadow-[0_10px_20px_rgba(28,28,24,0.12),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.15)] overflow-visible">
          {/* Hanging Brass Ribbon Bookmark */}
          <div className="absolute -top-3 right-5 z-20 flex flex-col items-center">
            <div className="w-6 h-10 bg-gradient-to-b from-[#994110] via-[#b95928] to-[#7c2e00] rounded-t-sm shadow-[0_4px_8px_rgba(153,65,16,0.4),inset_0_1px_1px_rgba(255,255,255,0.6)] flex items-end justify-center pb-1">
              <span className="material-symbols-outlined text-[12px] text-[#ffdbcc] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                bookmark
              </span>
            </div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[8px] border-t-[#7c2e00]" />
          </div>

          {/* Leather Embossed Banner */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-caps text-xs text-[#994110] tracking-widest flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#994110] shadow-[0_0_5px_#ffb595]" />
                FOLIO No. {weekNum} • EXPEDITION LOG
              </span>
              <h2 className="font-headline-md text-xl text-[#1c1c18] font-bold tracking-tight mt-0.5">
                Week {weekNum} Summary
              </h2>
              <span className="font-label-fine text-xs text-[#56433a]">
                18 Oct – 24 Oct • Precision Ledger
              </span>
            </div>

            {/* Brass Week Selector Knurled Dial */}
            <div className="flex items-center gap-1 bg-[#f1eee7] rounded-lg p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),inset_0_-1px_1px_rgba(255,255,255,0.85)]">
              <button
                type="button"
                aria-label="Previous week"
                onClick={handleWeekPrev}
                className="w-7 h-7 rounded flex items-center justify-center text-[#56433a] hover:text-[#1c1c18] bg-[#ebe8e1] shadow-[0_2px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <div className="px-2 py-0.5 bg-[#dcdad3] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center">
                <span className="font-label-meter text-xs font-bold text-[#1c1c18]">
                  W{weekNum}
                </span>
              </div>
              <button
                type="button"
                aria-label="Next week"
                onClick={handleWeekNext}
                className="w-7 h-7 rounded flex items-center justify-center text-[#56433a] hover:text-[#1c1c18] bg-[#ebe8e1] shadow-[0_2px_3px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Skeuomorphic Weekly Calorie Balance Chart (Caloric Flux Tubes) */}
        <div className="w-full rounded-xl bg-[#f6f3ec] p-4 shadow-[0_8px_18px_rgba(28,28,24,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col space-y-3.5 relative overflow-hidden">
          {/* Screws at corners */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-[#897269] rotate-45" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#e5e2db] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-[#897269] -rotate-12" />
          </div>

          {/* Section Title & Status */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#994110] text-base">monitoring</span>
              <span className="font-label-caps text-xs text-[#1c1c18] tracking-wider font-bold">
                CALORIC FLUX TUBES
              </span>
            </div>
            <span className="font-label-fine text-xs text-[#006947] font-semibold flex items-center gap-1 bg-[#f1eee7] px-2 py-0.5 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006947]" />
              Target 2,100 kcal
            </span>
          </div>

          {/* Instrument Cavity containing 7 Liquid Amber Bar Tubes */}
          <div className="relative bg-[#e5e2db] rounded-lg p-3 shadow-[inset_0_3px_8px_rgba(0,0,0,0.28),inset_0_-1px_1px_rgba(255,255,255,0.8)]">
            {/* Target Reference Line */}
            <div className="absolute left-3 right-3 top-[44%] border-t border-dashed border-[#ba1a1a]/50 z-10 pointer-events-none flex justify-end">
              <span className="font-label-caps text-[9px] text-[#ba1a1a] font-bold -mt-3.5 bg-[#e5e2db]/90 px-1 rounded shadow-sm">
                2,100 GOAL
              </span>
            </div>

            {/* 7 Tube Columns */}
            <div className="grid grid-cols-7 gap-2 h-44 items-end relative z-0 pt-3">
              {tubeData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <span
                    className={`font-label-caps text-[9px] font-bold mb-1 ${
                      item.isOver ? 'text-[#ba1a1a]' : 'text-[#006947]'
                    }`}
                  >
                    {item.diff}
                  </span>
                  <div className="w-full max-w-[28px] h-32 rounded-t-full bg-[#dcdad3] relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.8)]">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-sm bg-gradient-to-t from-[#994110] to-[#ffdbcc] shadow-[0_0_8px_rgba(185,89,40,0.6)]"
                      style={{ height: item.height }}
                    >
                      <div className="w-full h-1 bg-[#ffb595]/80 shadow-[0_0_4px_#ffdbcc]" />
                    </div>
                    {/* Glass Specular Reflection Highlight */}
                    <div className="absolute inset-y-0 left-0.5 w-1 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
                  </div>
                  <span className="font-label-caps text-[10px] text-[#56433a] font-bold mt-1.5">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Embossed Copper Plaque: Weekly Average Readout */}
          <div className="w-full rounded-lg bg-gradient-to-r from-[#ffdbcc] via-[#ebe8e1] to-[#ffb595] p-2.5 shadow-[0_2px_4px_rgba(28,28,24,0.1),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#994110]/20 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                <span className="material-symbols-outlined text-[#994110] text-sm">balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#351000] tracking-wide uppercase font-bold">
                  WEEKLY INTAKE METRIC
                </span>
                <span className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  1,980 kcal
                  <span className="font-body-sm text-xs text-[#56433a] font-normal"> / day</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-xs text-[#006947] font-bold bg-white/80 px-2 py-1 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]">
                −120 DEFICIT
              </span>
            </div>
          </div>
        </div>

        {/* Hydration Weekly Matrix & Water Tracker Streak */}
        <div className="w-full rounded-xl bg-[#f6f3ec] p-4 shadow-[0_8px_18px_rgba(28,28,24,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#006591] text-base">
                  water_drop
                </span>
                <span className="font-label-caps text-xs text-[#1c1c18] tracking-wider font-bold">
                  HYDRATION APOTHECARY
                </span>
              </div>
              <span className="font-label-fine text-xs text-[#56433a]">
                Cumulative Volume: 17.8 Liters
              </span>
            </div>
            {/* Wax Seal Golden Foil Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-[#6ffbbe] via-[#006947] to-[#005236] text-white shadow-[0_3px_8px_rgba(0,105,71,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)]">
              <span className="material-symbols-outlined text-[13px] text-[#6ffbbe]">verified</span>
              <span className="font-label-caps text-[10px] tracking-wider uppercase font-bold text-[#f5fff6]">
                7-DAY STREAK
              </span>
            </div>
          </div>

          {/* 7 Cylindrical Glass Bottles */}
          <div className="grid grid-cols-7 gap-2 bg-[#e5e2db] p-3 rounded-lg shadow-[inset_0_2px_6px_rgba(0,0,0,0.22)]">
            {bottleData.map((b, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-3 h-1.5 rounded-t-sm bg-[#dcc1b6] shadow-sm" />
                <div className="w-7 h-16 rounded-b-md bg-[#f1eee7] relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                  <div
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#006591] to-[#39b8fd] opacity-90"
                    style={{ height: b.pct }}
                  />
                  <div className="absolute inset-y-0 left-0.5 w-0.5 bg-white/40" />
                </div>
                <span className="font-label-caps text-[9px] text-[#006591] font-bold mt-1">
                  {b.vol}
                </span>
                <span className="font-label-fine text-[9px] text-[#56433a]">{b.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Balance Dial & Weekly Insights */}
        <div className="w-full grid grid-cols-1 gap-4">
          {/* Macro Dial Panel */}
          <div className="w-full rounded-xl bg-[#f6f3ec] p-4 shadow-[0_8px_18px_rgba(28,28,24,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#994110] text-base">pie_chart</span>
                <span className="font-label-caps text-xs text-[#1c1c18] tracking-wider font-bold">
                  MACRONUTRIENT RATIO
                </span>
              </div>
              <span className="font-label-fine text-xs text-[#56433a]">Weekly Composition</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Concentric Analog Gauge */}
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e5e2db]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  {/* Protein: 28% */}
                  <path
                    className="text-[#994110]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="28, 100"
                    strokeWidth="3.5"
                  />
                  {/* Carbs: 46% */}
                  <path
                    className="text-[#006591]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="46, 100"
                    strokeDashoffset="-28"
                    strokeWidth="3.5"
                  />
                  {/* Fats: 26% */}
                  <path
                    className="text-[#006947]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="26, 100"
                    strokeDashoffset="-74"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-label-caps text-[11px] font-bold text-[#1c1c18]">CAL</span>
                  <span className="font-label-fine text-[9px] text-[#56433a]">RATIO</span>
                </div>
              </div>

              {/* Macro Legend */}
              <div className="flex-1 flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#994110] shadow-sm" />
                    <span className="font-body-sm text-xs text-[#1c1c18]">Protein</span>
                  </div>
                  <span className="font-label-meter text-xs text-[#994110] font-bold">
                    28% (138g)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006591] shadow-sm" />
                    <span className="font-body-sm text-xs text-[#1c1c18]">Carbohydrates</span>
                  </div>
                  <span className="font-label-meter text-xs text-[#006591] font-bold">
                    46% (228g)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006947] shadow-sm" />
                    <span className="font-body-sm text-xs text-[#1c1c18]">Lipids / Fats</span>
                  </div>
                  <span className="font-label-meter text-xs text-[#006947] font-bold">
                    26% (58g)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Parchment Memo Card with Chrome Paperclip */}
          <div className="relative w-full rounded-xl bg-[#f1eee7] p-4 shadow-[0_6px_14px_rgba(28,28,24,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-visible">
            {/* Realistic Chrome Paperclip */}
            <div className="absolute -top-3 left-6 z-20 flex flex-col items-center drop-shadow-md">
              <svg
                className="w-5 h-10 text-[#897269]"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
                viewBox="0 0 24 48"
              >
                <path d="M12 4 L12 36 A6 6 0 0 0 20 36 L20 16 A8 8 0 0 0 4 16 L4 40" />
              </svg>
            </div>

            <div className="pl-7 pr-1 flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[11px] text-[#994110] tracking-widest flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  AI CHRONOMETER NOTE
                </span>
                <span className="font-label-fine text-[11px] text-[#56433a]">Validated 24 Oct</span>
              </div>
              <p className="font-body-sm text-xs text-[#1c1c18] italic leading-relaxed">
                “Your protein intake was 15% higher on workout days. Caloric consistency was optimal
                on weekdays; weekend intake averaged +240 kcal.”
              </p>
              <div className="pt-1.5 flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#006947] bg-[#ebe8e1] px-2 py-0.5 rounded shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)]">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span className="font-label-fine text-[11px] font-bold">
                    Metabolic Efficiency: 94%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactile 'Export Weekly Ledger PDF' Wax Seal Press Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportClick}
              disabled={exportState === 'sealing'}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#994110] via-[#b95928] to-[#7c2e00] text-white shadow-[0_6px_14px_rgba(153,65,16,0.35),inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.35)] active:translate-y-0.5 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.5)] transition-all flex items-center justify-center gap-2.5 font-bold"
            >
              {exportState === 'sealing' ? (
                <>
                  <span className="material-symbols-outlined text-[#ffdbcc] text-lg animate-spin">
                    sync
                  </span>
                  <span className="font-label-caps text-xs tracking-widest uppercase">
                    Sealing Document...
                  </span>
                </>
              ) : exportState === 'exported' ? (
                <>
                  <span className="material-symbols-outlined text-[#6ffbbe] text-lg">
                    check_circle
                  </span>
                  <span className="font-label-caps text-xs tracking-widest uppercase text-[#6ffbbe]">
                    Folio PDF Exported
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[#ffdbcc] text-lg drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                    history_edu
                  </span>
                  <span className="font-label-caps text-xs tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    Export Weekly Ledger (PDF)
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Export Preview Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl p-5 bg-[#fcf9f2] border-2 border-[#dcc1b6] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#dcc1b6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#994110]">history_edu</span>
                <h3 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Folio No. {weekNum} Audit Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-[#897269] hover:text-[#1c1c18]"
              >
                ✕
              </button>
            </div>
            <div className="p-3 bg-[#f6f3ec] rounded-lg border border-[#dcc1b6]/50 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#897269]">AUDIT TIMEFRAME:</span>
                <span className="font-bold">18 OCT - 24 OCT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897269]">TOTAL CONSUMPTION:</span>
                <span className="font-bold">13,860 KCAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897269]">DAILY AVERAGE:</span>
                <span className="font-bold">1,980 KCAL (-120 DEFICIT)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897269]">HYDRATION ACCRUAL:</span>
                <span className="font-bold">17.8 LITERS (100% MET)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#897269]">METABOLIC SCORE:</span>
                <span className="font-bold text-[#006947]">94% EFFICIENCY</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                window.print();
                setShowExportModal(false);
              }}
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-[#994110] shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print / Save Expedition Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
