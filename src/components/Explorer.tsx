import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Eye, Heart, MapPin, Search, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { TravelCourse, WebsiteSettings } from '../types';

interface ExplorerProps {
  courses: TravelCourse[];
  onSelectCourse: (id: string) => void;
  settings: WebsiteSettings;
  onOpenProposal: () => void;
}

export default function Explorer({ courses, onSelectCourse, settings, onOpenProposal }: ExplorerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique regions for filter tags
  const uniqueRegions = ['전체', ...Array.from(new Set(courses.map(c => {
    // Simplify region text (e.g., "제주 (Jeju)" -> "제주")
    const simplified = c.region.split(' ')[0];
    return simplified;
  })))];

  // Filters logic
  const filteredCourses = courses.filter(course => {
    const matchesRegion = selectedRegion === '전체' || course.region.includes(selectedRegion);
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Fonts class configuration based on settings
  const fontTitleClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 
    settings.fontStyle === 'mono' ? 'font-mono uppercase font-bold' : 
    'font-sans font-bold';

  const fontBodyClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  // Theme Colors style mapping
  const colorMap = {
    navy: 'text-slate-900 border-slate-900 bg-slate-900/5',
    gold: 'text-amber-700 border-amber-600 bg-amber-500/5',
    charcoal: 'text-zinc-950 border-zinc-950 bg-zinc-950/5',
    forest: 'text-emerald-800 border-emerald-800 bg-emerald-800/5',
    wine: 'text-rose-900 border-rose-900 bg-rose-900/5',
  };

  const activeColorTheme = colorMap[settings.themeColor] || colorMap.navy;

  return (
    <div className={`py-16 bg-[#fcfbfa] ${fontBodyClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subtitle Curation Introduction Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.3em] text-amber-600 font-bold uppercase block mb-3">
            Local Curation Magazine
          </span>
          <h2 className={`text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight mb-4 ${fontTitleClass}`}>
            오직 깊이 있는 시선으로 골라낸 고유한 장소들
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
            지역의 특색있는 코스들을 만나보세요. 공간을 엮어 하나의 서사를 전합니다.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 mb-12 border-b border-stone-200 gap-4">
          
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {uniqueRegions.map((region) => (
              <button
                key={region}
                id={`filter-region-${region}`}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                  (selectedRegion === region)
                    ? 'bg-stone-900 text-stone-50 shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              id="explorer-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-premium pl-10 rounded-full text-xs shadow-sm"
              placeholder="궁금한 지역, 키워드 검색..."
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="py-24 text-center">
            <Compass className="w-12 h-12 text-stone-300 mx-auto animate-pulse mb-4" />
            <h4 className="text-stone-700 text-sm font-semibold">검색 조건에 맞는 큐레이션이 아직 없습니다.</h4>
            <p className="text-stone-400 text-xs mt-1 font-light">다른 검색어로 찾아보시거나 새로운 코스를 CMS에서 작성해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <motion.article
                key={course.id}
                id={`course-card-${course.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                onClick={() => onSelectCourse(course.id)}
                className="group cursor-pointer rounded-xl bg-white border border-stone-200/60 overflow-hidden shadow-luxury shadow-luxury-hover flex flex-col h-full justify-between"
              >
                {/* Thumbnail Header */}
                <div className="relative h-60 bg-stone-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  {/* Subtle vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                  
                  {/* Floating labels */}
                  <div className="absolute top-4 left-4 flex flex-col space-y-1.5 items-start">
                    <span className="px-2.5 py-1 rounded bg-stone-900/80 backdrop-blur-sm text-[9px] text-stone-50 font-mono tracking-widest uppercase font-semibold">
                      {course.region}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/90 text-stone-950 text-[8px] font-bold tracking-wide uppercase">
                      {course.duration}
                    </span>
                  </div>

                  {/* Views and Likes overlay bottom */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-white/90 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 opacity-80" />
                      <span>{course.createdAt}</span>
                    </span>
                    <div className="flex items-center space-x-2.5">
                      <span className="flex items-center space-x-0.5">
                        <Eye className="w-3.5 h-3.5 opacity-85" />
                        <span>{course.views}</span>
                      </span>
                      <span className="flex items-center space-x-0.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                        <span>{course.likes}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article body content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-amber-700 tracking-wider uppercase block mb-1.5 font-bold">
                      #{course.theme}
                    </span>
                    <h3 className={`text-lg text-stone-900 leading-snug group-hover:text-amber-700 transition-colors ${fontTitleClass}`}>
                      {course.title}
                    </h3>
                    <p className="text-stone-500 text-xs mt-3 leading-relaxed font-light line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  {/* Read article footer */}
                  <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-stone-400 text-[10px] tracking-wide font-mono">
                      By {course.author}
                    </span>
                    <span className="text-stone-800 text-[11px] font-semibold flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
                      <span>자세히 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Editorial Proposal Section */}
        <div className="mt-16 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-xl p-8 sm:p-12 relative overflow-hidden border border-stone-850 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_40%)]" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 font-bold uppercase block mb-3">
              Become a Curator
            </span>
            <h3 className={`text-xl sm:text-2xl font-serif text-stone-100 tracking-tight leading-snug mb-3`}>
              당신만이 알고 있는 깊은 로컬의 매력을 제안해주세요
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed font-light mb-6">
              매거진에 소개되지 않은 당신만의 로컬 공간을 알고 계신가요? 직접 큐레이팅한 코스와 스토리텔링을 들려주세요.<br />
              검토한 후 정식으로 등재됩니다.
            </p>
            <button
              onClick={onOpenProposal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>나만의 코스 제안하기</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple local lucide fallback for search clear button if imported from lucide-react fails
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
