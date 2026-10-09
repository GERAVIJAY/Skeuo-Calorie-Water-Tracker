import React from 'react';
import { useApp, IMAGES } from '../context/AppContext';
import { playKnobTick, playSwitchClick, playStampThud } from '../utils/audio';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, setActiveTab, showToast } = useApp();

  const handleCalorieDelta = (delta: number) => {
    playKnobTick();
    const newTarget = Math.max(1200, Math.min(4500, settings.targetCalories + delta));
    updateSettings({ targetCalories: newTarget });
  };

  const handleWaterDelta = (delta: number) => {
    playKnobTick();
    const newTarget = Math.max(1000, Math.min(5000, settings.targetWater + delta));
    updateSettings({ targetWater: newTarget });
  };

  const handleToggleSound = () => {
    playSwitchClick();
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleResetExpedition = () => {
    playStampThud();
    showToast('Vault Re-indexed', 'System calibrated to default expedition registry.');
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Header matching mockup */}
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
              <h1 className="font-headline-sm text-base text-[#1c1c18] font-bold">Calibration Dial</h1>
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

      <main className="px-4 pt-4 flex flex-col gap-4">
        {/* Hardware Status Banner */}
        <div className="relative p-3.5 rounded-xl bg-[#ebe8e1] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_10px_rgba(28,28,24,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bevel-brass flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#351000] text-lg">precision_manufacturing</span>
            </div>
            <div>
              <span className="font-label-caps text-[10px] text-[#994110] font-bold uppercase tracking-wider block">
                ANALOG INSTRUMENT CLUSTER
              </span>
              <span className="font-headline-sm text-xs font-bold text-[#1c1c18]">
                Mechanical Calibrator #MK-IV
              </span>
            </div>
          </div>
          <span className="font-label-caps text-[9px] text-[#006947] font-bold bg-[#6ffbbe]/40 px-2 py-0.5 rounded-full">
            ONLINE
          </span>
        </div>

        {/* Caloric Goal Dial Tuning */}
        <div className="paper-tray rounded-2xl p-4 border border-[#dcc1b6]/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bevel-rim flex items-center justify-center text-[#994110] shadow-sm">
                <span className="material-symbols-outlined text-lg">local_fire_department</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Combustion Dial Baseline
                </h3>
                <p className="font-label-fine text-xs text-[#897269]">
                  Daily Kilocalorie Target
                </p>
              </div>
            </div>
            <span className="font-label-meter text-base font-bold text-[#994110]">
              {settings.targetCalories.toLocaleString()} <span className="text-xs text-[#897269]">KCAL</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleCalorieDelta(-100)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#56433a] border border-[#dcc1b6]"
            >
              - 100 kcal
            </button>
            <button
              type="button"
              onClick={() => handleCalorieDelta(-50)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#56433a] border border-[#dcc1b6]"
            >
              - 50
            </button>
            <button
              type="button"
              onClick={() => handleCalorieDelta(+50)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#994110] border border-[#dcc1b6]"
            >
              + 50
            </button>
            <button
              type="button"
              onClick={() => handleCalorieDelta(+100)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#994110] border border-[#dcc1b6]"
            >
              + 100 kcal
            </button>
          </div>
        </div>

        {/* Water Target Cylinder Tuning */}
        <div className="paper-tray rounded-2xl p-4 border border-[#dcc1b6]/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bevel-rim flex items-center justify-center text-[#006591] shadow-sm">
                <span className="material-symbols-outlined text-lg">water_drop</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Hydration Cylinder Target
                </h3>
                <p className="font-label-fine text-xs text-[#897269]">
                  Liquid Column Capacity
                </p>
              </div>
            </div>
            <span className="font-label-meter text-base font-bold text-[#006591]">
              {settings.targetWater.toLocaleString()} <span className="text-xs text-[#897269]">ML</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleWaterDelta(-250)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#56433a] border border-[#dcc1b6]"
            >
              - 250 ml
            </button>
            <button
              type="button"
              onClick={() => handleWaterDelta(+250)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#006591] border border-[#dcc1b6]"
            >
              + 250 ml
            </button>
            <button
              type="button"
              onClick={() => handleWaterDelta(+500)}
              className="push-button-tactile flex-1 py-2 rounded-xl text-xs font-bold text-[#006591] border border-[#dcc1b6]"
            >
              + 500 ml
            </button>
          </div>
        </div>

        {/* Macro Nutrient Baseline Targets */}
        <div className="paper-tray rounded-2xl p-4 border border-[#dcc1b6]/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bevel-rim flex items-center justify-center text-[#006947] shadow-sm">
                <span className="material-symbols-outlined text-lg">speed</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-sm font-bold text-[#1c1c18]">
                  Macro Target Manometers
                </h3>
                <p className="font-label-fine text-xs text-[#897269]">
                  Sub-meter full scale values
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 bg-[#f6f3ec] rounded-xl border border-[#dcc1b6]/40 text-center">
              <span className="font-label-caps text-[9px] text-[#994110] font-bold block">PROTEIN</span>
              <span className="font-label-meter text-sm font-bold text-[#1c1c18]">{settings.targetProtein}g</span>
            </div>
            <div className="p-2 bg-[#f6f3ec] rounded-xl border border-[#dcc1b6]/40 text-center">
              <span className="font-label-caps text-[9px] text-[#006591] font-bold block">CARBS</span>
              <span className="font-label-meter text-sm font-bold text-[#1c1c18]">{settings.targetCarbs}g</span>
            </div>
            <div className="p-2 bg-[#f6f3ec] rounded-xl border border-[#dcc1b6]/40 text-center">
              <span className="font-label-caps text-[9px] text-[#00855b] font-bold block">LIPIDS (FAT)</span>
              <span className="font-label-meter text-sm font-bold text-[#1c1c18]">{settings.targetFat}g</span>
            </div>
          </div>
        </div>

        {/* Sound & Sensory Feedback */}
        <div className="recessed-chassis rounded-xl p-3.5 border border-[#dcc1b6]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-[#e5e2db] flex items-center justify-center text-[#56433a]">
              <span className="material-symbols-outlined text-lg">volume_up</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-xs font-bold text-[#1c1c18]">
                Mechanical Sound Synthesizer
              </h4>
              <p className="font-body-sm text-xs text-[#897269]">
                Ratchet knobs, shutter snaps, tactile water drops
              </p>
            </div>
          </div>

          {/* Metal toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={handleToggleSound}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-[#e5e2db] peer-focus:outline-none rounded-full peer peer-checked:bg-[#00855b] shadow-inner border border-[#dcc1b6]/50 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gradient-to-b after:from-white after:to-[#ebe8e1] after:border after:border-[#dcc1b6] after:rounded-full after:h-4 after:w-4 after:transition-all after:shadow-md peer-checked:after:translate-x-5" />
          </label>
        </div>

        {/* System Reset & Diagnostics */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetExpedition}
            className="w-full py-3 rounded-xl border border-[#dcc1b6] bg-[#f1eee7] text-xs font-bold text-[#897269] hover:text-[#994110] transition-colors shadow-xs active:translate-y-0.5"
          >
            Re-index Historical Vault Archives
          </button>
        </div>
      </main>
    </div>
  );
};
