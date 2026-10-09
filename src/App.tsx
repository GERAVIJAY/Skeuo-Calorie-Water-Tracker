import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TodayScreen } from './components/TodayScreen';
import { VaultScreen } from './components/VaultScreen';
import { ScanScreen } from './components/ScanScreen';
import { WeeklyScreen } from './components/WeeklyScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { Navigation } from './components/Navigation';
import { Toast } from './components/Toast';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#fcf9f2] border-x border-[#dcc1b6]/30 shadow-2xl relative">
      {activeTab === 'today' && <TodayScreen />}
      {activeTab === 'vault' && <VaultScreen />}
      {activeTab === 'scan' && <ScanScreen />}
      {activeTab === 'weekly' && <WeeklyScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

      <Navigation />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
