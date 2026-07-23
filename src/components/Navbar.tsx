import React from 'react';
import { Compass, Settings2, RotateCcw, Sparkles } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  currentTab: 'explorer' | 'admin';
  onChangeTab: (tab: 'explorer' | 'admin') => void;
  settings: WebsiteSettings;
  onReset: () => void;
}

export default function Navbar({ currentTab, onChangeTab, settings, onReset }: NavbarProps) {
  // Theme Color mappings
  const themeMap = {
    navy: {
      bg: 'bg-slate-900',
      border: 'border-slate-800',
      text: 'text-white',
      accent: 'text-amber-400',
      btnActive: 'bg-amber-500 text-slate-950 hover:bg-amber-400',
      btnInactive: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    },
    gold: {
      bg: 'bg-neutral-950',
      border: 'border-neutral-800',
      text: 'text-stone-100',
      accent: 'text-amber-500',
      btnActive: 'bg-amber-600 text-white hover:bg-amber-500',
      btnInactive: 'text-stone-300 hover:bg-stone-900 hover:text-white',
    },
    charcoal: {
      bg: 'bg-zinc-950',
      border: 'border-zinc-800',
      text: 'text-zinc-100',
      accent: 'text-white',
      btnActive: 'bg-white text-zinc-950 hover:bg-zinc-200',
      btnInactive: 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
    },
    forest: {
      bg: 'bg-emerald-950',
      border: 'border-emerald-900',
      text: 'text-emerald-50',
      accent: 'text-lime-300',
      btnActive: 'bg-lime-400 text-emerald-950 hover:bg-lime-300',
      btnInactive: 'text-emerald-300 hover:bg-emerald-900 hover:text-white',
    },
    wine: {
      bg: 'bg-rose-950',
      border: 'border-rose-900',
      text: 'text-rose-50',
      accent: 'text-amber-300',
      btnActive: 'bg-amber-400 text-rose-950 hover:bg-amber-300',
      btnInactive: 'text-rose-300 hover:bg-rose-900 hover:text-white',
    },
  };

  const activeTheme = themeMap[settings.themeColor] || themeMap.navy;

  // Font Style class mapping for header logo
  const fontClass = 
    settings.fontStyle === 'serif' ? 'font-serif tracking-widest' : 
    settings.fontStyle === 'mono' ? 'font-mono tracking-wider font-semibold' : 
    'font-sans tracking-wide font-bold';

  return (
    <header className={`${activeTheme.bg} border-b ${activeTheme.border} sticky top-0 z-50 transition-colors duration-300 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onChangeTab('explorer')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-500 to-amber-300 shadow-inner">
              <Compass className="w-5.5 h-5.5 text-slate-900 animate-spin-slow" />
            </div>
            <div>
              <span className={`text-xl md:text-2xl ${fontClass} ${activeTheme.text}`}>
                {settings.logoText || 'LOCAL CONNECTORS'}
              </span>
              <div className="text-[9px] text-amber-400/80 font-serif tracking-[0.2em] -mt-1 font-semibold">
                PREMIUM LOCAL CURATION
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              id="nav-explorer-btn"
              onClick={() => onChangeTab('explorer')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                currentTab === 'explorer' ? activeTheme.btnActive : activeTheme.btnInactive
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>로컬 매거진</span>
            </button>

            <button
              id="nav-admin-btn"
              onClick={() => onChangeTab('admin')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                currentTab === 'admin' ? activeTheme.btnActive : activeTheme.btnInactive
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>CMS 대시보드</span>
            </button>

            {/* Separator */}
            <div className={`h-6 w-[1px] bg-white/10 hidden sm:block`} />

            {/* Reset Data Button */}
            <button
              id="reset-data-btn"
              onClick={() => {
                if (window.confirm('모든 데이터(게시글, 웹 설정)를 기본 샘플 데이터 상태로 초기화하시겠습니까?')) {
                  onReset();
                }
              }}
              title="데이터 초기화"
              className="p-2 rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
