import React from 'react';
import { useApp } from '../context/AppContext';
import { playKnobTick, playShutterSnap } from '../utils/audio';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const handleTabChange = (tab: typeof activeTab) => {
    if (tab === 'scan') {
      playShutterSnap();
    } else {
      playKnobTick();
    }
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom,0px)] bg-[#f1eee7]/95 backdrop-blur-xl border-t border-[#dcc1b6]/40 shadow-[0_-4px_24px_rgba(28,28,24,0.1)]">
      <div className="relative max-w-md mx-auto h-20 px-4 flex items-center justify-between gap-1">
        {/* Tab 1: Today / Dashboard */}
        <button
          type="button"
          onClick={() => handleTabChange('today')}
          className={`flex-1 min-h-[44px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:translate-y-0.5 ${
            activeTab === 'today'
              ? 'text-[#994110] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(0,0,0,0.28)] bg-[#e5e2db] border-t-0 font-bold'
              : 'text-[#56433a] hover:text-[#1c1c18] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.06)] bg-[#f6f3ec]'
          }`}
        >
          <span className="material-symbols-outlined text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            local_fire_department
          </span>
          <span className="font-label-caps text-[10px] leading-none tracking-wider uppercase">
            Today
          </span>
        </button>

        {/* Tab 2: Vault / Meals */}
        <button
          type="button"
          onClick={() => handleTabChange('vault')}
          className={`flex-1 min-h-[44px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:translate-y-0.5 ${
            activeTab === 'vault'
              ? 'text-[#994110] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(0,0,0,0.28)] bg-[#e5e2db] border-t-0 font-bold'
              : 'text-[#56433a] hover:text-[#1c1c18] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.06)] bg-[#f6f3ec]'
          }`}
        >
          <span className="material-symbols-outlined text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            restaurant_menu
          </span>
          <span className="font-label-caps text-[10px] leading-none tracking-wider uppercase">
            Vault
          </span>
        </button>

        {/* Center Raised Amber Shutter Plunger Button: Scan */}
        <div className="flex-1 flex justify-center items-center">
          <button
            type="button"
            onClick={() => handleTabChange('scan')}
            className={`w-14 h-14 -mt-5 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-[#994110] via-[#b95928] to-[#7c2e00] text-white shadow-[0_8px_16px_rgba(153,65,16,0.38),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.4)] active:translate-y-1 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.5)] transition-transform duration-100 ring-4 ring-[#ebe8e1] ${
              activeTab === 'scan' ? 'scale-105 ring-[#ffdbcc]' : 'hover:scale-105'
            }`}
          >
            <span className="material-symbols-outlined text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              photo_camera
            </span>
            <span className="font-label-caps text-[8px] leading-none tracking-wider mt-0.5 font-bold uppercase text-[#ffdbcc]">
              Scan
            </span>
          </button>
        </div>

        {/* Tab 4: Weekly / Calendar */}
        <button
          type="button"
          onClick={() => handleTabChange('weekly')}
          className={`flex-1 min-h-[44px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:translate-y-0.5 ${
            activeTab === 'weekly'
              ? 'text-[#994110] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(0,0,0,0.28)] bg-[#e5e2db] border-t-0 font-bold'
              : 'text-[#56433a] hover:text-[#1c1c18] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.06)] bg-[#f6f3ec]'
          }`}
        >
          <span className="material-symbols-outlined text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            calendar_month
          </span>
          <span className="font-label-caps text-[10px] leading-none tracking-wider uppercase">
            Weekly
          </span>
        </button>

        {/* Tab 5: Dial / Settings */}
        <button
          type="button"
          onClick={() => handleTabChange('settings')}
          className={`flex-1 min-h-[44px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-150 active:translate-y-0.5 ${
            activeTab === 'settings'
              ? 'text-[#994110] shadow-[inset_0_2px_4px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(0,0,0,0.28)] bg-[#e5e2db] border-t-0 font-bold'
              : 'text-[#56433a] hover:text-[#1c1c18] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.06)] bg-[#f6f3ec]'
          }`}
        >
          <span className="material-symbols-outlined text-xl drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
            tune
          </span>
          <span className="font-label-caps text-[10px] leading-none tracking-wider uppercase">
            Dial
          </span>
        </button>
      </div>
    </nav>
  );
};
