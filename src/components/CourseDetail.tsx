import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Heart, Eye, Share2, MapPin, Clock, Calendar, 
  ExternalLink, Layers, Copy, Check, Info, Sparkles 
} from 'lucide-react';
import { TravelCourse, Place, WebsiteSettings } from '../types';

interface CourseDetailProps {
  course: TravelCourse;
  onBack: () => void;
  onLike: (id: string) => void;
  settings: WebsiteSettings;
}

export default function CourseDetail({ course, onBack, onLike, settings }: CourseDetailProps) {
  // Local states
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'gallery'>(course.layout);
  const [copiedPlaceId, setCopiedPlaceId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showSeoDrawer, setShowSeoDrawer] = useState(false);

  // Styling based on Settings Theme
  const themeMap = {
    navy: {
      accent: 'text-amber-500 bg-amber-500/10',
      badge: 'bg-slate-900 text-amber-400 border-slate-800',
      textAccent: 'text-slate-900',
      line: 'bg-slate-900',
      placeBg: 'bg-white border-slate-100',
      primaryBtn: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    gold: {
      accent: 'text-amber-600 bg-amber-600/10',
      badge: 'bg-stone-900 text-amber-500 border-stone-800',
      textAccent: 'text-stone-900',
      line: 'bg-amber-600',
      placeBg: 'bg-stone-50 border-stone-200',
      primaryBtn: 'bg-stone-900 hover:bg-stone-800 text-white',
    },
    charcoal: {
      accent: 'text-zinc-950 bg-zinc-950/10',
      badge: 'bg-zinc-950 text-white border-zinc-800',
      textAccent: 'text-zinc-950',
      line: 'bg-zinc-950',
      placeBg: 'bg-white border-zinc-100',
      primaryBtn: 'bg-zinc-950 hover:bg-zinc-800 text-white',
    },
    forest: {
      accent: 'text-emerald-700 bg-emerald-700/10',
      badge: 'bg-emerald-950 text-lime-300 border-emerald-900',
      textAccent: 'text-emerald-950',
      line: 'bg-emerald-800',
      placeBg: 'bg-emerald-50/50 border-emerald-100',
      primaryBtn: 'bg-emerald-950 hover:bg-emerald-900 text-white',
    },
    wine: {
      accent: 'text-rose-700 bg-rose-700/10',
      badge: 'bg-rose-950 text-amber-300 border-rose-900',
      textAccent: 'text-rose-950',
      line: 'bg-rose-900',
      placeBg: 'bg-rose-50/50 border-rose-100',
      primaryBtn: 'bg-rose-950 hover:bg-rose-900 text-white',
    },
  };

  const activeTheme = themeMap[settings.themeColor] || themeMap.navy;

  const fontTitleClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 
    settings.fontStyle === 'mono' ? 'font-mono uppercase font-semibold' : 
    'font-sans font-extrabold';

  const fontBodyClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  // Handle Like trigger
  const handleLike = () => {
    if (!isLiked) {
      onLike(course.id);
      setIsLiked(true);
    }
  };

  // Copy Address to clipboard
  const copyToClipboard = (text: string, placeId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlaceId(placeId);
    setTimeout(() => setCopiedPlaceId(null), 2000);
  };

  // Copy whole post link
  const copyPostLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className={`py-12 bg-stone-50 min-h-screen ${fontBodyClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-10 pb-6 border-b border-stone-200">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>큐레이션 리스트로 돌아가기</span>
          </button>

          <div className="flex items-center space-x-2.5">
            {/* SEO Badge */}
            <button
              onClick={() => setShowSeoDrawer(!showSeoDrawer)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-stone-300 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              <span>SEO 메타데이터</span>
            </button>

            {/* Layout Mode Toggle */}
            <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-white shadow-sm">
              <button
                onClick={() => setLayoutMode('timeline')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  layoutMode === 'timeline' 
                    ? 'bg-stone-900 text-white' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>타임라인 뷰</span>
              </button>
              <button
                onClick={() => setLayoutMode('gallery')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  layoutMode === 'gallery' 
                    ? 'bg-stone-900 text-white' 
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>갤러리 뷰</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEO Metadata Drawer */}
        {showSeoDrawer && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-stone-900 text-stone-100 rounded-xl shadow-luxury border border-stone-800"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-800">
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEO ENGINE OPTIMIZATION METRICS</span>
              </span>
              <button onClick={() => setShowSeoDrawer(false)} className="text-xs text-stone-400 hover:text-white">닫기</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-stone-400 block mb-1">🔍 Meta Title:</span>
                <p className="text-stone-200 bg-stone-950 p-2.5 rounded border border-stone-800 break-words">{course.seoTitle}</p>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">📝 Meta Description:</span>
                <p className="text-stone-200 bg-stone-950 p-2.5 rounded border border-stone-800 break-words">{course.seoDesc}</p>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">🏷️ Meta Keywords:</span>
                <p className="text-stone-200 bg-stone-950 p-2.5 rounded border border-stone-800 break-words">{course.seoKeywords}</p>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 mt-3 italic">
              * 위 정보는 실시간 검색엔진 봇(Google, Naver 등)이 이 아티클을 수집할 때 전달하는 정적 SEO 데이터입니다.
            </p>
          </motion.div>
        )}

        {/* Article Cover Image Header */}
        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-luxury mb-10">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-amber-500 text-stone-950 mb-3 uppercase">
              {course.region}
            </span>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl ${fontTitleClass} leading-tight`}>
              {course.title}
            </h1>
            <p className="text-stone-300 text-sm mt-2 font-light italic">
              {course.subtitle}
            </p>
          </div>
        </div>

        {/* Article Editorial Meta & Intro */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Left Metadata panel */}
          <div className="md:col-span-1 space-y-4 text-xs text-stone-500 font-mono border-l-2 border-stone-200 pl-4">
            <div>
              <span className="text-stone-400 block">Curation Director</span>
              <span className="text-stone-800 font-medium font-sans">{course.author}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Published Date</span>
              <span className="text-stone-800 font-medium">{course.createdAt}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Course Duration</span>
              <span className="text-stone-800 font-medium font-sans">{course.duration}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Thematic Tag</span>
              <span className="text-amber-600 font-medium font-sans">#{course.theme}</span>
            </div>
            <div className="flex items-center space-x-4 pt-2 border-t border-stone-200/50">
              <span className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{course.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{course.views}</span>
              </span>
            </div>
          </div>

          {/* Intro Description */}
          <div className="md:col-span-3 text-stone-700 text-sm leading-relaxed whitespace-pre-line font-light">
            {course.description}
          </div>
        </div>

        {/* Curated Spots Render Section */}
        <h3 className="text-xs tracking-[0.25em] text-stone-400 uppercase font-mono mb-6 text-center font-bold">
          CURATED LOCALS & PATHWAY
        </h3>

        {/* Layout Conditonal: Timeline View */}
        {layoutMode === 'timeline' ? (
          <div className="relative pl-6 sm:pl-8 border-l border-stone-300 space-y-12 ml-4">
            {course.places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                className="relative"
              >
                {/* Timeline Dot Marker */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-stone-50 border-stone-300 text-stone-500 text-[10px] font-bold font-mono shadow-sm`}>
                  {index + 1}
                </div>

                {/* Place Detail Card */}
                <div className={`p-6 sm:p-8 rounded-xl bg-white border border-stone-100 shadow-luxury`}>
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    {/* Image Block */}
                    <div className="w-full md:w-2/5 h-44 rounded-lg overflow-hidden mb-4 md:mb-0 bg-stone-100">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta info & text */}
                    <div className="w-full md:w-3/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase border border-amber-600/20 text-amber-700 bg-amber-50">
                            {place.category}
                          </span>
                          <span className="text-xs font-mono text-stone-500 font-medium flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>{place.time}</span>
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 font-sans">{place.name}</h4>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mt-2.5 font-light whitespace-pre-line">
                          {place.description}
                        </p>
                      </div>

                      {/* Utility Footer (Address & Links) */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 mt-4 border-t border-stone-100 space-y-2 sm:space-y-0">
                        <span className="text-stone-500 text-[11px] font-mono flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-[260px]">{place.address}</span>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            id={`copy-addr-tl-${place.id}`}
                            onClick={() => copyToClipboard(place.address, place.id)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
                          >
                            {copiedPlaceId === place.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">복사 완료</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>주소 복사</span>
                              </>
                            )}
                          </button>
                          
                          {place.link && (
                            <a
                              href={place.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>지도 정보</span>
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Layout Conditional: Gallery View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {course.places.map((place, index) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-2xl bg-white border border-stone-200/60 overflow-hidden shadow-luxury flex flex-col justify-between"
              >
                {/* Image & Index Banner */}
                <div className="relative h-56 bg-stone-100 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                  
                  {/* Floating index & category */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {index + 1}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-stone-900/60 backdrop-blur-sm text-[10px] text-white font-mono tracking-wider uppercase">
                      {place.category}
                    </span>
                  </div>

                  {/* Absolute positioning of name and time */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] text-stone-300 font-mono tracking-widest uppercase block mb-1">
                      TIME AT • {place.time}
                    </span>
                    <h4 className="text-lg font-bold font-sans tracking-tight">{place.name}</h4>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light mb-6 whitespace-pre-line">
                    {place.description}
                  </p>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-stone-500 text-[10px] font-mono flex items-center space-x-1 max-w-[150px] truncate">
                      <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                      <span>{place.address}</span>
                    </span>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      <button
                        id={`copy-addr-gal-${place.id}`}
                        onClick={() => copyToClipboard(place.address, place.id)}
                        className="p-2 rounded bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-200 transition-colors"
                        title="주소 복사"
                      >
                        {copiedPlaceId === place.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      
                      {place.link && (
                        <a
                          href={place.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                          title="지도 이동"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Social Share & Action Footer Box */}
        <div className="mt-16 p-8 rounded-2xl bg-stone-900 text-stone-100 shadow-luxury border border-stone-800 text-center">
          <span className="text-xs font-mono tracking-[0.3em] text-amber-400 uppercase font-bold block mb-2">
            SHARE THIS CURATION
          </span>
          <h4 className="text-xl font-serif text-white mb-6">마음에 와닿는 여행 코스였나요? 소중한 이들에게 전해보세요.</h4>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="share-like-btn"
              onClick={handleLike}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                isLiked 
                  ? 'bg-rose-600 text-white hover:bg-rose-700' 
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-white text-white' : 'text-rose-400'}`} />
              <span>{isLiked ? '이 코스를 좋아합니다' : '큐레이션 좋아하기'}</span>
            </button>

            <button
              id="share-link-btn"
              onClick={copyPostLink}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 text-stone-200 hover:bg-white/20 text-xs font-medium tracking-wide transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">링크 복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-300" />
                  <span>공유 링크 복사</span>
                </>
              )}
            </button>


          </div>

          {/* Social Notification Dialog Toast */}
          {(copiedLink || copiedPlaceId) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 border border-stone-800 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-sans">
                {copiedLink ? '공유 링크 복사가 완료되었습니다.' : '주소가 성공적으로 복사되었습니다.'}
              </span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
