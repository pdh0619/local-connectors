import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check, Sparkles, MapPin, Clock, Info } from 'lucide-react';
import { Place, WebsiteSettings } from '../types';

interface ProposeCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  onSubmitSuccess: () => void;
}

export default function ProposeCourseModal({ isOpen, onClose, settings, onSubmitSuccess }: ProposeCourseModalProps) {
  const [author, setAuthor] = useState('');
  const [contact, setContact] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [duration, setDuration] = useState('당일치기');
  const [theme, setTheme] = useState('');
  const [places, setPlaces] = useState<Partial<Place>[]>([
    { id: 'p-1', name: '', category: '', time: '', description: '', address: '', image: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonts class configuration based on settings
  const fontTitleClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 
    settings.fontStyle === 'mono' ? 'font-mono uppercase font-bold' : 
    'font-sans font-bold';

  const fontBodyClass = 
    settings.fontStyle === 'serif' ? 'font-serif' : 'font-sans';

  // Theme Colors style mapping
  const btnThemeClass = {
    navy: 'bg-slate-900 text-white hover:bg-slate-800',
    gold: 'bg-amber-600 text-white hover:bg-amber-500',
    charcoal: 'bg-zinc-900 text-white hover:bg-zinc-800',
    forest: 'bg-emerald-950 text-white hover:bg-emerald-900',
    wine: 'bg-rose-950 text-white hover:bg-rose-900',
  }[settings.themeColor] || 'bg-stone-900 text-white hover:bg-stone-800';

  const accentTextClass = {
    navy: 'text-slate-900',
    gold: 'text-amber-600',
    charcoal: 'text-zinc-900',
    forest: 'text-emerald-800',
    wine: 'text-rose-900',
  }[settings.themeColor] || 'text-stone-900';

  const handleAddPlace = () => {
    setPlaces([
      ...places,
      { id: `p-${Date.now()}`, name: '', category: '', time: '', description: '', address: '', image: '' }
    ]);
  };

  const handleRemovePlace = (index: number) => {
    if (places.length === 1) return;
    setPlaces(places.filter((_, i) => i !== index));
  };

  const handlePlaceChange = (index: number, field: keyof Place, value: string) => {
    const updated = [...places];
    updated[index] = { ...updated[index], [field]: value };
    setPlaces(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !contact || !title || !description || !region || !theme) {
      setError('제안자 정보와 코스 기본 항목을 모두 입력해주세요.');
      return;
    }

    // Validate that at least one place is filled out with a name
    const validPlaces = places.filter(p => p.name?.trim());
    if (validPlaces.length === 0) {
      setError('최소 하나의 장소명을 입력해야 합니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const compiledPlaces: Place[] = validPlaces.map((p, idx) => ({
      id: p.id || `p-${idx}-${Date.now()}`,
      name: p.name || '',
      category: p.category || '기타',
      time: p.time || '언제나',
      description: p.description || '',
      address: p.address || '',
      image: p.image || 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
    }));

    const proposalData = {
      title,
      subtitle: subtitle || '방문자가 제안한 정취 가득한 코스',
      description,
      region,
      duration,
      theme,
      author,
      contact,
      places: compiledPlaces,
      status: 'pending'
    };

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proposalData),
      });

      if (!response.ok) {
        throw new Error('서버 전송 중 요류가 발생했습니다.');
      }

      onSubmitSuccess();
      onClose();
      // Reset form
      setAuthor('');
      setContact('');
      setTitle('');
      setSubtitle('');
      setDescription('');
      setRegion('');
      setTheme('');
      setPlaces([{ id: 'p-1', name: '', category: '', time: '', description: '', address: '', image: '' }]);
    } catch (err: any) {
      setError(err.message || '코스 제안 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal content container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`relative bg-[#fcfbfa] w-full max-w-4xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col ${fontBodyClass}`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
              </div>
              <div>
                <h3 className={`text-base font-bold text-stone-900 ${fontTitleClass}`}>
                  나만의 로컬 큐레이션 제안하기
                </h3>
                <p className="text-[10px] text-stone-500 font-light mt-0.5">
                  직접 경험한 아름답고 매력적인 로컬 코스를 엮어주세요. 검토 후 매거진 정식 아티클로 등록됩니다.
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-xs flex items-center space-x-2">
                <span className="font-semibold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Part 1: Proposer Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-stone-700 tracking-wider uppercase border-b border-stone-200 pb-1.5">
                01. 제안자 인적 사항
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">제안자 성명 / 닉네임 *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="매거진 아티클 크레딧에 표기될 성함을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">연락처 / 이메일 *</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="매거진 등록 시 안내를 위한 연락 방법(이메일, SNS, 전화 등)을 적어주세요"
                  />
                </div>
              </div>
            </div>

            {/* Part 2: Course Basics */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-stone-700 tracking-wider uppercase border-b border-stone-200 pb-1.5">
                02. 코스 기획 기본 요소
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">매력적인 코스 제목 *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="예: 성수동 골목길, 장인들이 머무는 붉은 벽돌의 사색"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">코스 부제목 (선택)</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="예: 번잡함을 벗어난 장인 아틀리에 기행"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">대상 지역 *</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="예: 서울 성동구, 제주 애월 등"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">추천 일정 / 소요 시간 *</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs bg-white"
                  >
                    <option value="당일치기">당일치기 (하루 반나절)</option>
                    <option value="1박 2일">1박 2일 사색 기행</option>
                    <option value="2박 3일">2박 3일 로컬 여정</option>
                    <option value="오후 산책">오후 반나절 가벼운 산책</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">추천 테마 키워드 *</label>
                  <input
                    type="text"
                    required
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full input-premium rounded-lg py-2.5 text-xs"
                    placeholder="예: 빈티지, 사색, 북카페, 자연"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">코스 전체 스토리텔링 & 소개말 *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full input-premium rounded-lg p-3 text-xs"
                  placeholder="이 코스가 왜 특별한지, 어떤 영감과 고요함을 전달하고 싶으신지 세련된 에세이 톤으로 들려주세요."
                />
              </div>
            </div>

            {/* Part 3: Recommended Places */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-1.5">
                <h4 className="text-xs font-bold text-stone-700 tracking-wider uppercase">
                  03. 코스를 채울 특별한 로컬 장소들
                </h4>
                <button
                  type="button"
                  onClick={handleAddPlace}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>장소 추가</span>
                </button>
              </div>

              <div className="space-y-6">
                {places.map((place, index) => (
                  <div 
                    key={place.id} 
                    className="relative p-5 rounded-lg border border-stone-200 bg-white shadow-sm space-y-4"
                  >
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-500 font-semibold">
                        Spot {index + 1}
                      </span>
                      {places.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlace(index)}
                          className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-50 transition-colors"
                          title="장소 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 md:pt-0">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">장소명 *</label>
                        <input
                          type="text"
                          required
                          value={place.name}
                          onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                          className="w-full input-premium rounded-md py-2 text-xs"
                          placeholder="예: 옹근달 성수"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">공간 카테고리</label>
                        <input
                          type="text"
                          value={place.category}
                          onChange={(e) => handlePlaceChange(index, 'category', e.target.value)}
                          className="w-full input-premium rounded-md py-2 text-xs"
                          placeholder="예: 로스터리 카페, 독립서점"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">추천 시간대</label>
                        <input
                          type="text"
                          value={place.time}
                          onChange={(e) => handlePlaceChange(index, 'time', e.target.value)}
                          className="w-full input-premium rounded-md py-2 text-xs"
                          placeholder="예: 13:00 - 14:30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">정확한 지번 / 도로명 주소</label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={place.address}
                            onChange={(e) => handlePlaceChange(index, 'address', e.target.value)}
                            className="w-full input-premium pl-8 rounded-md py-2 text-xs"
                            placeholder="예: 서울특별시 성동구 성수이로 22"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-500 mb-1">장소 관련 웹 주소 / 사진 이미지 URL</label>
                        <input
                          type="text"
                          value={place.image}
                          onChange={(e) => handlePlaceChange(index, 'image', e.target.value)}
                          className="w-full input-premium rounded-md py-2 text-xs"
                          placeholder="인터넷 이미지 주소 (https://images.unsplash.com/...)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-500 mb-1">공간에서 꼭 경험해봐야 할 일 / 큐레이션 평론</label>
                      <textarea
                        rows={2.5}
                        value={place.description}
                        onChange={(e) => handlePlaceChange(index, 'description', e.target.value)}
                        className="w-full input-premium rounded-md p-2.5 text-xs"
                        placeholder="이 공간에 깃든 가치, 창문을 통해 비쳐오는 오후 햇살의 분위기, 커피와 조화를 이루는 로컬 사운드를 세련되게 담아주세요."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Footer controls */}
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
            <div className="flex items-center space-x-1.5 text-[10px] text-stone-400 font-light">
              <Info className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>제안해 주신 원고는 편집진의 엄격한 가치 평가를 통해 게시됩니다.</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                작성 취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer ${btnThemeClass} ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>제안 송신 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>코스 기획 제안하기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
