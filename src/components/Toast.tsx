import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 pointer-events-none animate-bounce">
      <div className="p-3.5 rounded-xl bg-[#31312c] text-[#f3f0e9] shadow-[0_12px_24px_rgba(0,0,0,0.45)] border border-[#56433a]/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00855b] flex items-center justify-center text-[#f5fff6] shrink-0 shadow-inner">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            done
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-sm text-xs text-white font-bold truncate">
            {toastMessage.title}
          </span>
          <span className="font-body-sm text-xs text-[#dcdad3] truncate">
            {toastMessage.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
