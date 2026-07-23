import React from 'react';
import { motion } from 'motion/react';
import { Compass, Globe, Sparkles, ArrowUpRight, Award, Footprints, Landmark } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface AboutMissionProps {
  settings: WebsiteSettings;
}

export default function AboutMission({ settings }: AboutMissionProps) {
  const fontTitleClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 
    settings.fontStyle === 'mono' ? 'font-mono uppercase font-semibold' : 
    'font-sans font-extrabold';

  const fontBodyClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  // Dynamic design palettes based on settings.themeColor
  const themeStyles = {
    navy: {
      accentText: 'text-slate-800',
      badgeBorder: 'border-slate-900/10',
      badgeBg: 'bg-slate-100/50',
      badgeText: 'text-slate-900',
      iconBg: 'bg-slate-100 text-slate-800',
      glow: 'bg-slate-500/5',
      bannerBg: 'from-slate-50 to-stone-50 border-stone-200/60',
      bannerBadgeBg: 'bg-slate-900/10 text-slate-800',
      btnText: 'text-slate-950 hover:text-slate-800',
      primaryBtn: 'bg-slate-900 hover:bg-slate-850 text-white',
      accentColor: 'slate',
      cardBgs: ['bg-slate-950/85', 'bg-slate-900/85', 'bg-slate-800/85'],
    },
    gold: {
      accentText: 'text-amber-800',
      badgeBorder: 'border-amber-600/20',
      badgeBg: 'bg-amber-500/5',
      badgeText: 'text-amber-800',
      iconBg: 'bg-amber-50 text-amber-700',
      glow: 'bg-amber-500/5',
      bannerBg: 'from-amber-50 to-orange-50 border-amber-100',
      bannerBadgeBg: 'bg-amber-500/10 text-amber-700',
      btnText: 'text-amber-950 hover:text-amber-850',
      primaryBtn: 'bg-amber-950 hover:bg-amber-900 text-white',
      accentColor: 'amber',
      cardBgs: ['bg-amber-950/85', 'bg-amber-900/85', 'bg-amber-850/85'],
    },
    charcoal: {
      accentText: 'text-zinc-800',
      badgeBorder: 'border-zinc-900/20',
      badgeBg: 'bg-zinc-100',
      badgeText: 'text-zinc-900',
      iconBg: 'bg-zinc-100 text-zinc-800',
      glow: 'bg-zinc-500/5',
      bannerBg: 'from-zinc-50 to-stone-50 border-zinc-200',
      bannerBadgeBg: 'bg-zinc-900/10 text-zinc-800',
      btnText: 'text-zinc-950 hover:text-zinc-850',
      primaryBtn: 'bg-zinc-900 hover:bg-zinc-850 text-white',
      accentColor: 'zinc',
      cardBgs: ['bg-zinc-950/85', 'bg-zinc-900/85', 'bg-zinc-850/85'],
    },
    forest: {
      accentText: 'text-emerald-800',
      badgeBorder: 'border-emerald-600/20',
      badgeBg: 'bg-emerald-500/5',
      badgeText: 'text-emerald-800',
      iconBg: 'bg-emerald-50 text-emerald-700',
      glow: 'bg-emerald-500/5',
      bannerBg: 'from-emerald-50 to-teal-50 border-emerald-100',
      bannerBadgeBg: 'bg-emerald-500/10 text-emerald-700',
      btnText: 'text-emerald-950 hover:text-emerald-850',
      primaryBtn: 'bg-emerald-950 hover:bg-emerald-900 text-white',
      accentColor: 'emerald',
      cardBgs: ['bg-emerald-950/85', 'bg-emerald-900/85', 'bg-emerald-850/85'],
    },
    wine: {
      accentText: 'text-rose-800',
      badgeBorder: 'border-rose-600/20',
      badgeBg: 'bg-rose-500/5',
      badgeText: 'text-rose-800',
      iconBg: 'bg-rose-50 text-rose-700',
      glow: 'bg-rose-500/5',
      bannerBg: 'from-rose-50 to-pink-50 border-rose-100',
      bannerBadgeBg: 'bg-rose-500/10 text-rose-700',
      btnText: 'text-rose-950 hover:text-rose-850',
      primaryBtn: 'bg-rose-950 hover:bg-rose-900 text-white',
      accentColor: 'rose',
      cardBgs: ['bg-rose-950/85', 'bg-rose-900/85', 'bg-rose-850/85'],
    }
  };

  const style = themeStyles[settings.themeColor] || themeStyles.navy;

  return (
    <section id="manifesto-section" className={`py-24 bg-white border-y border-stone-200/60 relative overflow-hidden ${fontBodyClass}`}>
      
      {/* SECTION 1: ABOUT (Inspired by the top section of the reference) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28 relative">
        {/* Giant outline background text like 'SEHEUNG SP' */}
        <div className="absolute right-0 top-[-40px] text-[7vw] font-sans font-black text-stone-100/60 tracking-widest select-none pointer-events-none uppercase">
          {settings.logoText || "LOCAL CONNECT"}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Heading and cropped circle image */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-stone-400 block uppercase">
                // ABOUT US
              </span>
              <h2 className={`text-2xl sm:text-3.5xl text-stone-900 tracking-tight leading-tight font-bold ${fontTitleClass}`}>
                기존 유명한 관광지에<br />
                사람이 몰리는 것을 방지하고,<br />
                진짜 한국 로컬을 연결합니다.
              </h2>
            </div>

            {/* Overlapping circle cropped high-contrast image (Inspired by Seheung SP About Circle image) */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full border border-stone-200/80 p-2 overflow-hidden animate-[spin_40s_linear_infinite]">
                <div className="w-full h-full rounded-full border border-dashed border-stone-300/60" />
              </div>
              <div className="absolute inset-4 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-luxury">
                <img 
                  src={settings.aboutCircleImage || "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80"} 
                  alt="Traditional Korean paper and crafts" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-900/10 hover:bg-transparent transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Right Column: Descriptions and call to action button */}
          <div className="lg:col-span-6 lg:pt-16 space-y-8">
            <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed font-light">
              오늘날의 여행은 특정 랜드마크에 수만 명의 사람이 한꺼번에 쏠리며 발생하는 <strong>오버투어리즘(Overtourism)</strong>으로 가득 차 있습니다. 
              거주민의 평온한 일상은 위협받고, 여행자는 영감 대신 극심한 상업화와 긴 대기줄만을 남긴 채 발길을 돌립니다. 
              <br /><br />
              <strong>로컬커넥터즈(Local Connectors)</strong>는 이러한 관광 병목 현상을 방지하고 지속 가능한 <strong>언더투어리즘(Undertourism)</strong>을 지향합니다. 
              언어와 대중교통의 높은 장벽 탓에 외국인 여행자 스스로는 쉽게 방문하기 어려웠던 골목 안 장인들의 공방, 
              유서 깊은 근대 교육 시설, 숨겨진 한옥과 도심 숲길을 발굴하여 한국 문화의 정수를 선사합니다.
            </p>

            <div className="h-[1px] bg-stone-200/80 w-24" />

            <div>
              <button 
                onClick={() => {
                  const el = document.getElementById('explorer-search-input');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center space-x-2.5 px-6 py-3 rounded-full text-xs font-semibold ${style.primaryBtn} transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer`}
              >
                <span>로컬커넥터즈 추천 코스 보기</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* SECTION 2: PRODUCT / APPROACH (Inspired by the product grid with photos) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-12">
          
          {/* Section text left */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-stone-400 block uppercase">
              // OUR APPROACH
            </span>
            <h2 className={`text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight font-bold ${fontTitleClass}`}>
              지속 가능한 방식과 세심한 연결로<br />
              완성하는 최상의 여행 만족
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm font-light max-w-2xl">
              로컬 지역의 장소들이 가진 역사적 맥락과 이야기를 담아 소개합니다.<br />
              한 번도 경험해보지 못한 진짜 한국을 제공합니다.
            </p>
          </div>

          {/* Slider indicator style decoration (Right) */}
          <div className="lg:col-span-5 flex justify-end items-center space-x-4 text-xs font-mono text-stone-400">
            <span className="h-[1px] bg-stone-200 w-16" />
            <span>01 / 02 CURATED CORES</span>
          </div>

        </div>

        {/* Bento/Grid Layout of Images (Inspired by Section 2 in Reference) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Grid: Two Small Square Images */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Small Image 1 */}
            <div className="group space-y-3 cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden relative shadow-sm">
                <img 
                  src={settings.approachImage1 || "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"} 
                  alt="Ancient narrow alleys in Korea" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/10 transition-all duration-300" />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-stone-900">사색과 서정 가득한 골목길</span>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Alley Walk</span>
              </div>
            </div>

            {/* Small Image 2 */}
            <div className="group space-y-3 cursor-pointer">
              <div className="aspect-square rounded-xl overflow-hidden relative shadow-sm">
                <img 
                  src={settings.approachImage2 || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"} 
                  alt="Cozy hanok cafe interior" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Circle Arrow Overlay inspired by the middle image in the reference */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/60 flex items-center justify-center text-white backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-stone-900">도시와 지역 고택의 결합</span>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Heritage</span>
              </div>
            </div>

          </div>

          {/* Right Grid: One Tall Vertical Image */}
          <div className="lg:col-span-6 group space-y-3 cursor-pointer">
            <div className="aspect-[16/10] lg:aspect-auto lg:h-[420px] rounded-xl overflow-hidden relative shadow-sm">
              <img 
                src={settings.approachImage3 || "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80"} 
                alt="Futuristic and traditional harmony in Incheon" 
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-all duration-300" />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-stone-900">서울 근교에서 체험하는 근대 역사 공간</span>
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Urban Design</span>
            </div>
          </div>

        </div>
      </div>


      {/* SECTION 3: PHILOSOPHY & VALUES (Inspired by the bottom dark banner layout in reference) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-stone-950 text-white shadow-2xl">
          
          {/* High-contrast image background with dark gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80" 
              alt="Misty library study background" 
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-900/60" />
          </div>

          {/* Inside Content container */}
          <div className="relative z-10 pt-20 px-6 sm:px-12 lg:px-16 pb-0">
            
            {/* Heading in center */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-amber-500/80 uppercase block">
                PHILOSOPHY
              </span>
              <h3 className={`text-2xl sm:text-3.5xl text-white tracking-tight leading-snug font-bold ${fontTitleClass}`}>
                최고의 상생 가치를 통해<br />
                인도주의적이고 품격 있는 성장을 지향합니다.
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm font-light">
                로컬커넥터즈는 단순히 가이드하는 역할을 넘어 여행자와 지역 상생을 추구합니다.
              </p>
            </div>

            {/* Three Cards Side-by-side at the bottom (Direct design match to Seheung SP Bottom Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
              
              {/* Card 1 */}
              <div className={`p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10 ${style.cardBgs[0]} backdrop-blur-sm flex flex-col justify-between items-center text-center space-y-6 transition-all duration-300 hover:bg-stone-900/90`}>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-amber-400">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">관광 분산유도</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                    인구 밀집이 심한 서울이나 제주 일부에 몰린 흐름을 인천 구도심과 같은 매력적인 배후 대안지로 영리하게 분산합니다.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/10 ${style.cardBgs[1]} backdrop-blur-sm flex flex-col justify-between items-center text-center space-y-6 transition-all duration-300 hover:bg-stone-900/90`}>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-amber-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">숨은 가치 발굴</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                    기존 외국인이 쉽게 접근하기 어렵던 매력적인 장소들을 발굴하고 안내합니다.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className={`p-8 md:p-10 ${style.cardBgs[2]} backdrop-blur-sm flex flex-col justify-between items-center text-center space-y-6 transition-all duration-300 hover:bg-stone-900/90`}>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">지속가능 상생</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                    대형 자본 체인이 아닌 지역 영세 상공인, 보존 역사 지구와의 협업을 고집하여 로컬 커뮤니티의 온전한 성장을 지탱합니다.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
