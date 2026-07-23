import React from 'react';
import { motion } from 'motion/react';
import { WebsiteSettings } from '../types';
import { Sparkles, ArrowDown } from 'lucide-react';

interface HeroProps {
  settings: WebsiteSettings;
  onExploreClick: () => void;
}

export default function Hero({ settings, onExploreClick }: HeroProps) {
  // Font Class mappings
  const fontTitleClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 
    settings.fontStyle === 'mono' ? 'font-mono uppercase font-semibold' : 
    'font-sans font-extrabold';

  const fontBodyClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  // Theme color styling based on settings
  const colorMap = {
    navy: 'border-amber-400 text-amber-400',
    gold: 'border-amber-500 text-amber-500',
    charcoal: 'border-white text-white',
    forest: 'border-lime-300 text-lime-300',
    wine: 'border-amber-300 text-amber-300',
  };

  const accentColor = colorMap[settings.themeColor] || colorMap.navy;

  return (
    <div className="relative h-[80vh] min-h-[550px] w-full flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background Image with elegant overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroBanner || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80'}
          alt="Premium Travel Cover"
          className="w-full h-full object-cover opacity-45 scale-105 transform animate-fade-in transition-all duration-1000"
        />
        {/* Advanced vignette & luxury dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/70 to-[#fcfbfa]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Curatorial Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/20 bg-stone-900/60 backdrop-blur-sm text-[10px] sm:text-xs tracking-[0.25em] text-white uppercase mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ESTABLISHED 2026 • HAND-PICKED LOCALS</span>
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-4xl sm:text-5xl md:text-6xl text-white tracking-tight ${fontTitleClass} leading-tight sm:leading-snug mb-6`}
        >
          {settings.heroTitle || '지극히 사적이고, 감각적인 여행'}
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`text-stone-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${fontBodyClass} leading-relaxed font-light mb-10 whitespace-pre-line`}
        >
          {settings.heroSubtitle || '우리는 평범한 관광지가 아닌,\n지역의 예술성이 깃든 숨겨진 공간들을 연결하여 고유한 흐름을 제안합니다.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <button
            id="hero-explore-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-medium tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-0.5 cursor-pointer"
          >
            큐레이션 매거진 읽기
          </button>
        </motion.div>
      </div>

      {/* Floating Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-1 text-stone-400">
        <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scroll Down</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </div>
    </div>
  );
}
