import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Paintbrush, FileText, Plus, Trash2, Edit, Save, Undo2, 
  Sparkles, Link2, Search, Eye, Heart, X, ChevronUp, ChevronDown, 
  Check, FileUp, Info, HelpCircle, MapPin, Clock, Tag, Globe
} from 'lucide-react';
import { TravelCourse, Place, WebsiteSettings, CourseProposal } from '../types';
import { getSavedProposals, saveProposals } from '../data';
import { 
  fetchProposalsFromFirebase, 
  updateProposalInFirebase, 
  deleteProposalFromFirebase,
  subscribeProposalsFromFirebase
} from '../lib/firebase';
import NetlifySyncModal from './NetlifySyncModal';

interface AdminDashboardProps {
  courses: TravelCourse[];
  settings: WebsiteSettings;
  onSaveSettings: (settings: WebsiteSettings) => void;
  onSaveCourses: (courses: TravelCourse[]) => void;
  onExit: () => void;
}

// Preset visual themes
const COLOR_PRESETS = [
  { id: 'navy', name: '시그니처 딥 네이비', primary: '#0F172A', text: 'slate-900', desc: '신뢰감을 주는 깊은 바다 빛깔과 차분한 지적 감성' },
  { id: 'gold', name: '노블 샴페인 골드', primary: '#AF9053', text: 'amber-600', desc: '빛바랜 책장과 빈티지 가구, 따스한 가을날의 아날로그 무드' },
  { id: 'charcoal', name: '모던 스타크 차콜', primary: '#111111', text: 'zinc-950', desc: '간결함과 고대비, 군더더기 없는 차가운 현대적 미니멀리즘' },
  { id: 'forest', name: '헤리티지 딥 포레스트', primary: '#064E3B', text: 'emerald-800', desc: '이슬 맺힌 전나무 숲길, 촉촉한 흙내음과 평온한 사색' },
  { id: 'wine', name: '바디감 깊은 루비 와인', primary: '#4C0519', text: 'rose-900', desc: '시간이 흘러 더 우아해지는 이국적인 고전주의 낭만' },
];

const FONT_PRESETS = [
  { id: 'serif', name: 'Classic Serif (클래식 세리프)', desc: '우아한 명조 계열 폰트로, 감성적이고 시적 문체에 적합' },
  { id: 'sans', name: 'Modern Sans-Serif (고딕 계열)', desc: '가독성이 극대화된 깔끔하고 현대적인 스타일' },
  { id: 'mono', name: 'Editorial Mono (아카이브 모노)', desc: '예술품 카탈로그와 역사적 기록 아카이브 느낌의 중성적 스타일' },
];

// Rich presets for AI Curation generator to create instant flawless content
const AI_PRESETS: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  region: string;
  duration: string;
  theme: string;
  places: Omit<Place, 'id'>[];
  seoTitle: string;
  seoDesc: string;
  seoKeywords: string;
}> = {
  seongsu: {
    title: '성수동 연무장길, 철공소 골목에서 발견한 미학적 크리에이티브',
    subtitle: '거친 붉은 벽돌과 투명한 유리창, 예술가들이 숨겨둔 영감 아지트',
    description: '오래된 인쇄소와 염색 공장의 녹슨 문 뒤편, 서울에서 가장 뜨거운 실험 정신이 꿈틀거리는 성수동 연무장길을 깊이 들여다봅니다. 단순한 팝업스토어를 넘어 디자이너들의 숨겨진 작업실과 편집숍을 순례하는 미학적 도보 여정입니다.',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    region: '서울 성수 (Seoul)',
    duration: '반나절 코스 (Half Day)',
    theme: '크리에이티브 아카이브',
    seoTitle: '성수동 감성 코스 추천 | 연무장길 숨은 명소 | 로컬커넥터즈',
    seoDesc: '철공소와 가죽 공방의 정취를 고스란히 담아 감각적인 현대 예술로 승화한 성수동 비밀 디자인 스폿 가이드.',
    seoKeywords: '성수동투어, 성수연무장길, 성수동디자인숍, 예술공간, 성수동데이트',
    places: [
      {
        name: '포인트오브뷰 (Point of View) 오피스숍',
        category: '문구/디자인',
        time: '01:00 PM',
        description: '사소한 필기구 하나에도 창작자의 영혼을 불어넣는 큐레이션 문구점입니다. 서걱거리는 연필 소리, 고전적인 황동 오브제, 세계 각국의 기이한 도구들이 마치 오래된 소설가의 서재에 들어온 듯한 신비로운 감각을 일깨워 줍니다.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 성동구 연무장길 18'
      },
      {
        name: '센터커피 (Center Coffee) 로스터즈',
        category: '카페',
        time: '03:00 PM',
        description: '서울숲의 초록빛 풍경을 액자 프레임처럼 온전히 담아내는 통창 카페입니다. 원두의 고유한 캐릭터를 완벽히 살려내는 스페셜티 브루잉과 함께 도심 속 고요를 품어봅니다.',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 성동구 서울숲2길 28-11'
      },
      {
        name: '우란문화재단 (Wooran Foundation)',
        category: '전시/예술',
        time: '05:00 PM',
        description: '기존의 전형적인 갤러리 미술을 거부하고 로컬 공예품과 젊은 설치 미술가들의 과감한 협업을 다루는 미학 실험실입니다. 묵직한 노출 콘크리트 계단을 오르며 한국 고유의 곡선과 소리에 관한 사색의 시간을 완성합니다.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 성동구 광나루로 130'
      }
    ]
  },
  gangneung: {
    title: '강릉 초당 솔향길, 바다 안개와 진한 에스프레소 사색',
    subtitle: '백년 고택의 차분한 이끼 정원과 파도 소리를 닮은 로스터리 정취',
    description: '유명한 순두부 골목 너머, 강릉의 가장 오롯한 품을 만나는 시간. 울창한 소나무 숲길에 감도는 새벽녘 해무를 헤치며 백년 전통의 한옥 마루에 걸터앉아 고요의 정원을 응시하고, 파도가 깎아놓은 해안절벽 옆 이색 커피 바에서 삶의 영감을 채웁니다.',
    thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    region: '강원 강릉 (Gangneung)',
    duration: '1박 2일 (2 Days)',
    theme: '자연 & 사색 슬로우 라이프',
    seoTitle: '강릉 비밀 감성 코스 | 솔향 한옥 산책 | 로컬커넥터즈',
    seoDesc: '해변 관광객을 벗어나 깊은 초당 솔숲 속 백년 고택과 고요한 커피 바를 연결하는 우아한 힐링 코스.',
    seoKeywords: '강릉여행, 강릉카페, 초당솔숲, 고택산책, 슬로우라이프, 로컬커넥터즈',
    places: [
      {
        name: '초당 허균허난설헌 생가 기념공원',
        category: '고택/산책',
        time: '10:00 AM',
        description: '수령이 백 년을 아득히 넘는 거대한 소나무들이 울창한 그늘을 형성하는 유서 깊은 고택공원입니다. 솔바람 소리와 함께 툇마루에 조용히 앉아 시인 허난설헌의 문학 세계와 고요에 몸을 맡깁니다.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
        address: '강원특별자치도 강릉시 난설헌로 193'
      },
      {
        name: '초당 커피정원 (이끼 온실)',
        category: '카페/정원',
        time: '01:30 PM',
        description: '다양한 야생 이끼와 양치식물이 바닥과 돌담을 가득 덮은 비밀스러운 온실 정원 카페입니다. 은은한 오크우드 가구와 원형 천창에서 쏟아지는 아늑한 햇빛 아래 시그니처 흑임자 오트 라떼를 음미합니다.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        address: '강원특별자치도 강릉시 초당길 46'
      },
      {
        name: '경포호수 선셋 파빌리온',
        category: '건축/자연',
        time: '06:00 PM',
        description: '호숫가 갈대숲 사이에 세워진 미니멀 디자인의 목조 파빌리온입니다. 붉은 노을빛이 잔잔한 수면에 칼레이도스코프처럼 부서지는 황홀한 장면을 편히 걸터앉아 고요하게 눈에 담습니다.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        address: '강원특별자치도 강릉시 저동 416'
      }
    ]
  },
  hannam: {
    title: '한남동 이태원 이면, 대사관 뒷골목의 글로벌 예술 가이드',
    subtitle: '수입 고서적과 독립 갤러리가 뿜어내는 다채롭고 오밀조밀한 오라',
    description: '번잡한 제일기획 사거리를 한 발자국만 건너뛰면, 조용한 주택가와 묵직한 가로수 뒤에 꼭꼭 숨어있는 다국적 예술 지형이 나타납니다. 세계 각국의 패션 북바인더리, 독립 세라믹 아틀리에, 오감으로 향을 매핑하는 프래그런스 아카이브를 순례합니다.',
    thumbnail: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=1200&q=80',
    region: '서울 한남 (Hannam)',
    duration: '당일 코스 (1 Day)',
    theme: '글로벌 헤리티지 & 쇼룸',
    seoTitle: '한남동 이면 예술 골목 완벽 큐레이션 | 로컬커넥터즈',
    seoDesc: '이국적이고 사색적인 이태원-한남 대사관 주택가 뒷골목 쇼룸 및 개인 갤러리 투어 코스.',
    seoKeywords: '한남동데이트, 한남동쇼룸, 이색디자인, 이태원예술, 프래그런스숍',
    places: [
      {
        name: '포스트 포에틱스 (Post Poetics)',
        category: '고서적/디자인',
        time: '01:30 PM',
        description: '해외의 희귀한 디자인, 현대 미술, 건축 도록 및 아트 북만을 수입하여 독점 소개하는 공간입니다. 종이 고유의 촉감과 인쇄 잉크 내음이 묵직한 금속 서가와 어우러져 지적 활력을 가득 제공합니다.',
        image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 용산구 이태원로 240'
      },
      {
        name: '비클리프 (Biclyphe) 우드 아틀리에',
        category: '쇼룸/공방',
        time: '03:40 PM',
        description: '원목 본연의 무늬와 뒤틀림을 그대로 살려 하나의 유기체 같은 가구를 제작하는 수공예 목공 쇼룸입니다. 향나무와 호두나무가 내뿜는 포근한 피톤치드 향 속에서 장인의 작업 과정을 조용히 구경할 수 있습니다.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 용산구 한남대로20길 45'
      },
      {
        name: '한남 디앤디파트먼트 (d&department)',
        category: '라이프스타일',
        time: '05:30 PM',
        description: '오래 지속되는 가치(Long Life Design)를 탐구하고 소개하는 일본 발 로컬 브랜드입니다. 세련되게 재생된 빈티지 리사이클 오브제와 지역 소상공인들이 빚어낸 건강한 로컬 식료품들을 관찰하며 안목을 한 차원 넓힙니다.',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
        address: '서울특별시 용산구 이태원로 240 지하3층'
      }
    ]
  }
};

export default function AdminDashboard({ courses, settings, onSaveSettings, onSaveCourses, onExit }: AdminDashboardProps) {
  // Navigation internal tab
  const [activeTab, setActiveTab] = useState<'visual' | 'posts' | 'proposals' | 'editor'>('visual');

  // Netlify / GitHub Sync Modal state
  const [isNetlifySyncModalOpen, setIsNetlifySyncModalOpen] = useState(false);

  // Proposal States
  const [proposals, setProposals] = useState<CourseProposal[]>(() => getSavedProposals());
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);

  const fetchProposals = async () => {
    setIsLoadingProposals(true);
    let serverProposals: CourseProposal[] = [];
    let fbProposals: CourseProposal[] = [];

    try {
      fbProposals = await fetchProposalsFromFirebase();
    } catch (e) {
      console.warn('Error fetching proposals from Firebase:', e);
    }

    try {
      const response = await fetch('/api/proposals');
      if (response.ok) {
        serverProposals = await response.json();
      }
    } catch (e) {
      console.error('Error fetching proposals from server API:', e);
    } finally {
      setIsLoadingProposals(false);
    }

    const localProposals = getSavedProposals();
    // Merge server, firebase, and local proposals by ID
    const mergedMap = new Map<string, CourseProposal>();
    localProposals.forEach(p => mergedMap.set(p.id, p));
    serverProposals.forEach(p => mergedMap.set(p.id, p));
    fbProposals.forEach(p => mergedMap.set(p.id, p));

    const finalProposals = Array.from(mergedMap.values()).sort((a, b) => 
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );

    setProposals(finalProposals);
    saveProposals(finalProposals);
  };

  useEffect(() => {
    fetchProposals();

    // Subscribe to real-time proposals from Firebase
    const unsubscribe = subscribeProposalsFromFirebase((fbList) => {
      if (fbList) {
        setProposals(prev => {
          const map = new Map<string, CourseProposal>();
          prev.forEach(p => map.set(p.id, p));
          fbList.forEach(p => map.set(p.id, p));
          const updated = Array.from(map.values()).sort((a, b) => 
            (b.createdAt || '').localeCompare(a.createdAt || '')
          );
          saveProposals(updated);
          return updated;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab === 'proposals') {
      fetchProposals();
    }
  }, [activeTab]);

  const handleUpdateProposalStatus = async (id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => {
    // Update state & localStorage immediately
    const updatedList = proposals.map(p => p.id === id ? { ...p, status } : p);
    setProposals(updatedList);
    saveProposals(updatedList);

    // Sync to Firebase
    updateProposalInFirebase(id, { status });

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        triggerToast(`제안서 상태를 [${status === 'approved' ? '승인' : status === 'rejected' ? '반려' : '검토완료'}] 상태로 변경했습니다.`);
      }
    } catch (e) {
      console.error('Error updating proposal status remotely:', e);
      triggerToast('로컬/파이어베이스 제안서 상태가 업데이트되었습니다.');
    }
  };

  const handleDeleteProposal = async (id: string) => {
    if (!window.confirm('이 제안된 코스를 영구적으로 삭제하시겠습니까?')) return;
    
    // Remove from state & localStorage immediately
    const filteredList = proposals.filter(p => p.id !== id);
    setProposals(filteredList);
    saveProposals(filteredList);

    // Delete from Firebase
    deleteProposalFromFirebase(id);

    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        triggerToast('제안된 코스를 삭제했습니다.');
      }
    } catch (e) {
      console.error('Error deleting proposal remotely:', e);
      triggerToast('제안서가 삭제되었습니다.');
    }
  };

  const handleApproveAndEdit = (proposal: CourseProposal) => {
    // Populate the editor state with the proposal data
    setEditingCourseId(null); // Create new course based on this
    setEditTitle(proposal.title);
    setEditSubtitle(proposal.subtitle || '방문자가 제안하고 엄선한 로컬 코스');
    setEditDescription(proposal.description);
    setEditThumbnail('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80');
    setEditRegion(proposal.region);
    setEditDuration(proposal.duration || '당일치기');
    setEditTheme(proposal.theme);
    setEditAuthor(proposal.author);
    setEditLayout('timeline');
    setEditSeoTitle(`${proposal.title} | 로컬커넥터즈 제안`);
    setEditSeoDesc(proposal.description.substring(0, 150));
    setEditSeoKeywords(`${proposal.region}, ${proposal.theme}, 로컬여행, 동네발견`);
    setEditPlaces(proposal.places);

    // Update status to approved on the server
    handleUpdateProposalStatus(proposal.id, 'approved');

    // Shift to editor tab
    setActiveTab('editor');
    triggerToast('제안받은 코스의 기획안이 수공업 편집기로 연동되었습니다. 사진과 본문을 보정하여 발행해 보세요!');
  };

  // Visual customizer fields
  const [themeColor, setThemeColor] = useState<WebsiteSettings['themeColor']>(settings.themeColor);
  const [fontStyle, setFontStyle] = useState<WebsiteSettings['fontStyle']>(settings.fontStyle);
  const [logoText, setLogoText] = useState(settings.logoText);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [heroBanner, setHeroBanner] = useState(settings.heroBanner);
  const [aboutCircleImage, setAboutCircleImage] = useState(settings.aboutCircleImage || '');
  const [approachImage1, setApproachImage1] = useState(settings.approachImage1 || '');
  const [approachImage2, setApproachImage2] = useState(settings.approachImage2 || '');
  const [approachImage3, setApproachImage3] = useState(settings.approachImage3 || '');

  // Post Editor states (Handles new or edit course)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editLayout, setEditLayout] = useState<'timeline' | 'gallery'>('timeline');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editSeoDesc, setEditSeoDesc] = useState('');
  const [editSeoKeywords, setEditSeoKeywords] = useState('');
  const [editPlaces, setEditPlaces] = useState<Place[]>([]);

  // AI assistant helper panel state
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [selectedPresetKey, setSelectedPresetKey] = useState('seongsu');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Search filter in post list
  const [searchQuery, setSearchQuery] = useState('');

  // Status banners
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show status banner
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to compress uploaded image files on Canvas to optimize size & persistence
  const compressImage = (file: File, maxWidth = 1600, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Helper to handle local file uploads and read them as optimized Base64 strings
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setImageState(compressedBase64);
        triggerToast('이미지 파일이 성공적으로 최적화되어 업로드되었습니다!');
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    }
  };

  // Synchronize customizer values with incoming settings
  useEffect(() => {
    setThemeColor(settings.themeColor);
    setFontStyle(settings.fontStyle);
    setLogoText(settings.logoText);
    setHeroTitle(settings.heroTitle);
    setHeroSubtitle(settings.heroSubtitle);
    setHeroBanner(settings.heroBanner);
    setAboutCircleImage(settings.aboutCircleImage || '');
    setApproachImage1(settings.approachImage1 || '');
    setApproachImage2(settings.approachImage2 || '');
    setApproachImage3(settings.approachImage3 || '');
  }, [settings]);

  // Apply visual configurations live
  const handleSaveVisual = () => {
    onSaveSettings({
      themeColor,
      fontStyle,
      logoText,
      heroTitle,
      heroSubtitle,
      heroBanner,
      aboutCircleImage,
      approachImage1,
      approachImage2,
      approachImage3,
    });
    triggerToast('비주얼 설정이 실시간으로 적용되었습니다.');
  };

  // Open editor for a NEW post
  const handleInitNewPost = () => {
    setEditingCourseId(null);
    setEditTitle('');
    setEditSubtitle('');
    setEditDescription('');
    setEditThumbnail('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80');
    setEditRegion('새로운 지역');
    setEditDuration('당일 코스');
    setEditTheme('에디터 큐레이션');
    setEditAuthor('공식 큐레이터');
    setEditLayout('timeline');
    setEditSeoTitle('새 여행 코스 추천 | 로컬커넥터즈');
    setEditSeoDesc('에디터가 제안하는 가치있는 장소들의 숨겨진 맥락과 지도 연결 경로.');
    setEditSeoKeywords('국내여행, 감성코스, 숨겨진맛집, 골목투어, 로컬커넥터즈');
    
    // Seed with 1 initial empty spot
    setEditPlaces([
      {
        id: 'place-new-1',
        name: '첫 번째 거점 공간',
        category: '카페',
        time: '11:00 AM',
        description: '이곳의 역사적 정체성 및 소장하고 싶은 포인트를 작성해주세요.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        address: '도로명 주소를 정확하게 기입하세요.'
      }
    ]);

    setActiveTab('editor');
  };

  // Open editor with EXISTING post details
  const handleInitEditPost = (course: TravelCourse) => {
    setEditingCourseId(course.id);
    setEditTitle(course.title);
    setEditSubtitle(course.subtitle);
    setEditDescription(course.description);
    setEditThumbnail(course.thumbnail);
    setEditRegion(course.region);
    setEditDuration(course.duration);
    setEditTheme(course.theme);
    setEditAuthor(course.author);
    setEditLayout(course.layout);
    setEditSeoTitle(course.seoTitle);
    setEditSeoDesc(course.seoDesc);
    setEditSeoKeywords(course.seoKeywords);
    setEditPlaces([...course.places]);

    setActiveTab('editor');
  };

  // Delete a post
  const handleDeletePost = (id: string) => {
    if (window.confirm('이 여행 코스를 영구적으로 삭제하시겠습니까? 관련 데이터가 복구되지 않습니다.')) {
      const filtered = courses.filter(c => c.id !== id);
      onSaveCourses(filtered);
      triggerToast('여행 코스가 데이터베이스에서 영구 삭제되었습니다.');
    }
  };

  // Place operations (Move Up, Move Down, Delete Spot, Add Spot)
  const movePlace = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= editPlaces.length) return;

    const updated = [...editPlaces];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setEditPlaces(updated);
  };

  const deletePlaceInForm = (index: number) => {
    if (editPlaces.length <= 1) {
      alert('여행 코스에는 최소 1개 이상의 스폿(장소)이 등록되어야 합니다.');
      return;
    }
    const updated = editPlaces.filter((_, i) => i !== index);
    setEditPlaces(updated);
  };

  const addPlaceInForm = () => {
    const newPlace: Place = {
      id: `place-added-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: '새로운 로컬 공간',
      category: '식음료',
      time: '02:00 PM',
      description: '장소가 주는 고유한 무드와 에디터의 코멘터리를 섬세하게 입력하세요.',
      image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
      address: '주소 입력'
    };
    setEditPlaces([...editPlaces, newPlace]);
  };

  const updatePlaceFieldInForm = (index: number, field: keyof Place, val: string) => {
    const updated = [...editPlaces];
    updated[index] = { ...updated[index], [field]: val };
    setEditPlaces(updated);
  };

  // Save Post to State & LocalStorage
  const handleSavePost = () => {
    if (!editTitle.trim()) {
      alert('코스 제목은 필수 입력 요소입니다.');
      return;
    }

    const compiledCourse: TravelCourse = {
      id: editingCourseId || `course-${Date.now()}`,
      title: editTitle,
      subtitle: editSubtitle,
      description: editDescription,
      thumbnail: editThumbnail || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      region: editRegion,
      duration: editDuration,
      theme: editTheme,
      likes: editingCourseId ? (courses.find(c => c.id === editingCourseId)?.likes || 0) : 0,
      views: editingCourseId ? (courses.find(c => c.id === editingCourseId)?.views || 1) : 1,
      author: editAuthor,
      createdAt: editingCourseId ? (courses.find(c => c.id === editingCourseId)?.createdAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      layout: editLayout,
      places: editPlaces,
      seoTitle: editSeoTitle || `${editTitle} | 로컬커넥터즈`,
      seoDesc: editSeoDesc || editSubtitle,
      seoKeywords: editSeoKeywords || '국내여행, 로컬코스, 로컬커넥터즈',
    };

    let updatedCourses: TravelCourse[] = [];
    if (editingCourseId) {
      // Update
      updatedCourses = courses.map(c => c.id === editingCourseId ? compiledCourse : c);
      triggerToast('아티클이 성공적으로 업데이트되었습니다.');
    } else {
      // Create
      updatedCourses = [compiledCourse, ...courses];
      triggerToast('신규 로컬 코스 아티클이 정식 발행되었습니다.');
    }

    onSaveCourses(updatedCourses);
    setActiveTab('posts');
  };

  // AI Curation Auto Writer simulator
  const handleGenerateAiCuration = () => {
    setIsGeneratingAi(true);
    
    // Simulate generation with sophisticated text
    setTimeout(() => {
      let data = AI_PRESETS[selectedPresetKey];
      if (!data) {
        data = AI_PRESETS.seongsu;
      }

      // If user provided a custom prompt, we can inject or tweak it!
      const customPrefix = aiCustomPrompt.trim() 
        ? `[AI 요청 반영: "${aiCustomPrompt.trim().substring(0, 30)}..."] ` 
        : '';

      setEditTitle(customPrefix + data.title);
      setEditSubtitle(data.subtitle);
      setEditDescription(data.description);
      setEditThumbnail(data.thumbnail);
      setEditRegion(data.region);
      setEditDuration(data.duration);
      setEditTheme(data.theme);
      setEditSeoTitle(data.seoTitle);
      setEditSeoDesc(data.seoDesc);
      setEditSeoKeywords(data.seoKeywords);

      // Re-seed places with generated contents
      const generatedPlaces = data.places.map((p, i) => ({
        ...p,
        id: `place-ai-gen-${Date.now()}-${i}`
      }));
      setEditPlaces(generatedPlaces);

      setIsGeneratingAi(false);
      setShowAiCopilot(false);
      setAiCustomPrompt('');
      triggerToast('AI 로컬 큐레이터가 명품 아티클 초안 작성을 완료했습니다.');
    }, 1800);
  };

  // Filter courses in UI
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 bg-stone-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header of CMS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[10px] font-mono tracking-wider uppercase font-semibold mb-2">
              ADMIN CONTROL PANEL
            </div>
            <h2 className="text-2xl font-serif text-stone-900 font-bold tracking-tight">
              로컬커넥터즈 통합 CMS 대시보드
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              별도의 데이터베이스나 코딩 없이 비주얼 테마, 마케팅 SEO 및 큐레이션 포스트를 완벽하게 관리할 수 있습니다.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNetlifySyncModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer border border-stone-800"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Netlify / GitHub 배포 동기화 (JSON)</span>
            </button>

            <button
              onClick={onExit}
              className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 hover:shadow-sm transition-all cursor-pointer"
            >
              대시보드 종료 후 매거진 보기
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Navigation */}
        <div className="flex space-x-2 mb-8 border-b border-stone-300 pb-[1px]">
          <button
            id="tab-visual-settings"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'visual'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span>비주얼 테마 설정</span>
          </button>

          <button
            id="tab-posts-cms"
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'posts'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>큐레이션 리스트 관리 ({courses.length})</span>
          </button>

          <button
            id="tab-proposals-cms"
            onClick={() => setActiveTab('proposals')}
            className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'proposals'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>제안받은 코스 관리 ({proposals.length})</span>
          </button>

          <button
            id="tab-editor-cms"
            onClick={() => {
              if (activeTab !== 'editor') {
                handleInitNewPost();
              }
            }}
            className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'editor'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingCourseId ? '아티클 수공업 편집기' : '새 아티클 큐레이션 작성'}</span>
          </button>
        </div>

        {/* --------------------- TAB 1: VISUAL THEME CUSTOMIZER --------------------- */}
        {activeTab === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form control panel */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury border border-stone-200 p-6 space-y-6">
              <h3 className="text-base font-serif font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center space-x-2">
                <Paintbrush className="w-4 h-4 text-amber-600" />
                <span>디자인 커스터마이저</span>
              </h3>

              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3">
                  브랜드 테마 컬러웨이
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id as WebsiteSettings['themeColor'])}
                      className={`p-3.5 rounded-lg border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                        themeColor === color.id
                          ? 'border-amber-600 bg-amber-50/20 shadow-sm'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-stone-300 mt-0.5 flex-shrink-0"
                        style={{ backgroundColor: color.primary }}
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{color.name}</span>
                        <p className="text-[10px] text-stone-500 font-light leading-relaxed mt-0.5">{color.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Selector */}
              <div className="pt-4 border-t border-stone-100">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3">
                  전반적인 타이포그래피 정체성
                </label>
                <div className="space-y-2.5">
                  {FONT_PRESETS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFontStyle(font.id as WebsiteSettings['fontStyle'])}
                      className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between cursor-pointer ${
                        fontStyle === font.id
                          ? 'border-amber-600 bg-amber-50/20 font-bold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <span className={`text-xs block text-stone-900 ${font.id === 'serif' ? 'font-serif' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>
                          {font.name}
                        </span>
                        <span className="text-[10px] text-stone-500 font-light block mt-0.5">{font.desc}</span>
                      </div>
                      {fontStyle === font.id && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                    로고 텍스트 (브랜드명)
                  </label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full input-premium rounded-lg text-xs"
                    placeholder="예: LOCAL CONNECTORS"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                      메인 히어로 타이틀
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full input-premium rounded-lg text-xs"
                      placeholder="예: 지극히 사적이고, 감각적인 여행"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5 flex justify-between items-center">
                      <span>메인 히어로 배너 이미지</span>
                      <label className="text-[10px] font-mono text-amber-700 hover:text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 bg-amber-50 cursor-pointer transition-colors">
                        직접 파일 업로드
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setHeroBanner)}
                        />
                      </label>
                    </label>
                    <input
                      type="text"
                      value={heroBanner}
                      onChange={(e) => setHeroBanner(e.target.value)}
                      className="w-full input-premium rounded-lg text-xs"
                      placeholder="https://images.unsplash.com/... 또는 직접 파일 업로드"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                    메인 히어로 슬로건/설명
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full input-premium rounded-lg text-xs leading-relaxed"
                    placeholder="히어로 헤더 밑에 노출될 서정적이고 고급스러운 문구를 입력하세요."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5 flex justify-between items-center">
                    <span>소개(About Us) 섹션 원형 사진 이미지</span>
                    <label className="text-[10px] font-mono text-amber-700 hover:text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 bg-amber-50 cursor-pointer transition-colors">
                      직접 파일 업로드
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setAboutCircleImage)}
                      />
                    </label>
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={aboutCircleImage}
                      onChange={(e) => setAboutCircleImage(e.target.value)}
                      className="flex-grow input-premium rounded-lg text-xs"
                      placeholder="https://images.unsplash.com/... 또는 직접 파일 업로드"
                    />
                    {aboutCircleImage && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0">
                        <img 
                          src={aboutCircleImage} 
                          alt="About circle preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 font-light mt-1">
                    소개 페이지 좌측의 우아하게 돌아가는 원형 프레임 안에 표시될 맞춤 이미지 주소(혹은 업로드한 로컬 사진)입니다.
                  </p>
                </div>

                {/* Our Approach Curated Cores 3 Images */}
                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-widest block">
                    // 어프로치(Our Approach) 그리드 이미지 설정
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Image 1 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-700 block flex justify-between items-center">
                        <span>어프로치 사진 1 (골목길)</span>
                        <label className="text-[9px] font-mono text-amber-700 hover:text-amber-900 border border-amber-200 rounded px-1 py-0.5 bg-amber-50 cursor-pointer">
                          업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, setApproachImage1)}
                          />
                        </label>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={approachImage1}
                          onChange={(e) => setApproachImage1(e.target.value)}
                          className="flex-grow input-premium rounded-lg text-xs py-1.5"
                          placeholder="이미지 URL"
                        />
                        {approachImage1 && (
                          <div className="w-8 h-8 rounded border border-stone-200 overflow-hidden flex-shrink-0">
                            <img src={approachImage1} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image 2 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-700 block flex justify-between items-center">
                        <span>어프로치 사진 2 (한옥/고택)</span>
                        <label className="text-[9px] font-mono text-amber-700 hover:text-amber-900 border border-amber-200 rounded px-1 py-0.5 bg-amber-50 cursor-pointer">
                          업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, setApproachImage2)}
                          />
                        </label>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={approachImage2}
                          onChange={(e) => setApproachImage2(e.target.value)}
                          className="flex-grow input-premium rounded-lg text-xs py-1.5"
                          placeholder="이미지 URL"
                        />
                        {approachImage2 && (
                          <div className="w-8 h-8 rounded border border-stone-200 overflow-hidden flex-shrink-0">
                            <img src={approachImage2} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image 3 */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-stone-700 block flex justify-between items-center">
                        <span>어프로치 사진 3 (우측 긴 사진)</span>
                        <label className="text-[9px] font-mono text-amber-700 hover:text-amber-900 border border-amber-200 rounded px-1 py-0.5 bg-amber-50 cursor-pointer">
                          업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, setApproachImage3)}
                          />
                        </label>
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={approachImage3}
                          onChange={(e) => setApproachImage3(e.target.value)}
                          className="flex-grow input-premium rounded-lg text-xs py-1.5"
                          placeholder="이미지 URL"
                        />
                        {approachImage3 && (
                          <div className="w-8 h-8 rounded border border-stone-200 overflow-hidden flex-shrink-0">
                            <img src={approachImage3} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Trigger */}
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  id="save-visual-btn"
                  onClick={handleSaveVisual}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium tracking-wide flex items-center space-x-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>설정 실시간 적용하기</span>
                </button>
              </div>
            </div>

            {/* Simulated Mobile Mock Live Preview */}
            <div className="bg-stone-900 rounded-2xl border-4 border-stone-800 p-4 h-[550px] shadow-2xl relative overflow-hidden flex flex-col justify-between text-stone-300">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-stone-800 rounded-full z-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-stone-900" />
              </div>

              {/* Top notch simulated screen container */}
              <div className="h-full bg-stone-950 flex flex-col justify-between relative overflow-hidden rounded-lg">
                {/* Simulated Header */}
                <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-[10px]">
                  <span className={`font-bold tracking-widest text-stone-100 ${fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans'}`}>
                    {logoText || 'LOCAL CONNECTORS'}
                  </span>
                  <span className="text-stone-500 font-mono text-[8px]">04:33 PM</span>
                </div>

                {/* Simulated Hero Banner Block */}
                <div className="flex-1 relative flex items-center justify-center p-4">
                  <img
                    src={heroBanner}
                    alt="Cover preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                  
                  {/* Inside card content */}
                  <div className="relative text-center z-10 max-w-xs">
                    <span className="text-[7px] tracking-widest text-amber-400 block mb-1 uppercase font-semibold">
                      ESTABLISHED 2026 • PREMIUM
                    </span>
                    <h4 className={`text-base font-bold text-white leading-tight ${fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans'}`}>
                      {heroTitle || '지극히 사적이고, 감각적인 여행'}
                    </h4>
                    <p className="text-[8px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {heroSubtitle || '우리는 지역의 숨겨진 가치를 연결하여 완벽한 흐름을 완성합니다.'}
                    </p>
                  </div>
                </div>

                {/* Simulated Bottom Navigation */}
                <div className="p-2 bg-stone-900 border-t border-stone-800 text-center">
                  <span className="text-[7px] font-mono tracking-[0.2em] text-amber-500 font-bold">
                    PREVIEW: LIVE MOBILE VIEW
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --------------------- TAB 2: POSTS LIST MANAGEMENT --------------------- */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-xl shadow-luxury border border-stone-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-stone-100 space-y-4 sm:space-y-0">
              <h3 className="text-base font-serif font-bold text-stone-900 flex items-center space-x-2">
                <FileText className="w-4.5 h-4.5 text-amber-600" />
                <span>스폿 아카이브 데이터베이스</span>
              </h3>

              {/* Search and write */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-premium pl-9 py-1.5 rounded-lg text-xs w-48 sm:w-64"
                    placeholder="지역명, 제목, 작성자 검색..."
                  />
                </div>

                <button
                  id="cms-new-article-btn"
                  onClick={handleInitNewPost}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-1 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>새 아티클 생성</span>
                </button>
              </div>
            </div>

            {/* List Table */}
            {filteredCourses.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                조건에 부합하는 여행 코스가 데이터베이스에 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 text-xs font-sans">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] font-bold">
                      <th className="px-6 py-4 text-left">큐레이션 커버 및 아티클 정보</th>
                      <th className="px-6 py-4 text-left">큐레이션 지역 / 테마</th>
                      <th className="px-6 py-4 text-left">에디터 / 발행일</th>
                      <th className="px-6 py-4 text-center">조회 / 좋아요</th>
                      <th className="px-6 py-4 text-center">상세 레이아웃</th>
                      <th className="px-6 py-4 text-right">관리 작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-stone-50/50 transition-colors">
                        {/* Title & Cover info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0 border border-stone-200"
                            />
                            <div>
                              <span className="font-bold text-stone-950 block">{course.title}</span>
                              <span className="text-[10px] text-stone-400 block italic mt-0.5">{course.subtitle}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Region & Theme */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-stone-800 block">{course.region}</span>
                          <span className="text-[10px] text-amber-700 font-medium block mt-0.5">#{course.theme}</span>
                        </td>

                        {/* Author & date */}
                        <td className="px-6 py-4 whitespace-nowrap text-stone-600">
                          <span className="block font-medium">{course.author}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">{course.createdAt}</span>
                        </td>

                        {/* Telemetry metrics */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-3 text-[11px] text-stone-500 font-mono">
                            <span className="flex items-center space-x-0.5">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{course.views}</span>
                            </span>
                            <span className="flex items-center space-x-0.5">
                              <Heart className="w-3.5 h-3.5 text-rose-400" />
                              <span>{course.likes}</span>
                            </span>
                          </div>
                        </td>

                        {/* Layout */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-semibold ${
                            course.layout === 'timeline' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {course.layout === 'timeline' ? '커넥티브 타임라인' : '비주얼 갤러리'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              id={`cms-edit-${course.id}`}
                              onClick={() => handleInitEditPost(course)}
                              className="p-1.5 rounded hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                              title="아티클 편집"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              id={`cms-delete-${course.id}`}
                              onClick={() => handleDeletePost(course.id)}
                              className="p-1.5 rounded hover:bg-stone-100 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="아티클 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --------------------- TAB 3: PROPOSALS MANAGEMENT --------------------- */}
        {activeTab === 'proposals' && (
          <div className="bg-white rounded-xl shadow-luxury border border-stone-200 p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center space-x-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  <span>방문자 제안 코스 보관함</span>
                </h3>
                <p className="text-[11px] text-stone-400 font-light mt-0.5">
                  홈페이지 방문자들이 동네의 깊은 매력을 가득 담아 직접 제안한 코스 큐레이션 목록입니다.
                </p>
              </div>
              <button
                onClick={fetchProposals}
                disabled={isLoadingProposals}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <span>새로고침</span>
              </button>
            </div>

            {isLoadingProposals ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-stone-500">제안받은 코스 데이터를 안전하게 로드하는 중입니다...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="py-24 text-center">
                <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <h4 className="text-stone-700 text-sm font-semibold">제안받은 로컬 코스가 아직 없습니다.</h4>
                <p className="text-stone-400 text-xs mt-1 font-light max-w-md mx-auto leading-relaxed">
                  로컬 매거진의 최하단에 새롭게 기획된 <span className="font-semibold text-stone-600">[나만의 코스 제안하기]</span> 영역을 통해 방문자들이 코스를 기여할 수 있습니다. 첫 번째 제안을 받아보세요!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {proposals.map((proposal) => (
                  <div 
                    key={proposal.id} 
                    className="border border-stone-200 rounded-lg overflow-hidden bg-[#fcfbfa]"
                  >
                    {/* Header bar of a proposal */}
                    <div className="px-5 py-4 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-[10px] font-semibold text-stone-500 font-mono">
                            ID: {proposal.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            proposal.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            proposal.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            proposal.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-stone-200 text-stone-700'
                          }`}>
                            {proposal.status === 'pending' ? '새 제안 대기중' :
                             proposal.status === 'approved' ? '발행/승인 완료' :
                             proposal.status === 'rejected' ? '검토 후 보류' :
                             '검토 완료'}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            수신일: {proposal.createdAt}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 mt-1.5">
                          {proposal.title}
                        </h4>
                        <p className="text-xs text-stone-500 italic mt-0.5 font-light">
                          {proposal.subtitle}
                        </p>
                      </div>

                      {/* Action controllers */}
                      <div className="flex items-center space-x-2 self-start md:self-center">
                        <button
                          onClick={() => handleApproveAndEdit(proposal)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-sm animate-pulse"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>승인 후 CMS 편집기로 연동</span>
                        </button>
                        
                        <div className="h-5 w-[1px] bg-stone-200" />

                        {proposal.status !== 'reviewed' && (
                          <button
                            onClick={() => handleUpdateProposalStatus(proposal.id, 'reviewed')}
                            className="px-2.5 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 rounded text-xs transition-colors cursor-pointer"
                            title="검토 완료로 표시"
                          >
                            <span>검토 처리</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                          title="영구 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meta info columns */}
                    <div className="p-5 border-b border-stone-200 bg-white grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-0.5">제안자 성명 / 아티클 크레딧</span>
                        <span className="font-semibold text-stone-800">{proposal.author}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-0.5">제안자 긴급 연락처 (이메일 등)</span>
                        <span className="font-semibold text-stone-800 underline font-mono select-all">{proposal.contact}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-0.5">대상 지역</span>
                        <span className="font-semibold text-stone-800">{proposal.region}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-0.5">일정 / 테마</span>
                        <span className="font-semibold text-stone-800">{proposal.duration} <span className="text-amber-600 font-medium ml-1">#{proposal.theme}</span></span>
                      </div>
                    </div>

                    {/* Storytelling & places body */}
                    <div className="p-5 bg-white space-y-5">
                      {/* Entire concept narrative */}
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-1">제안 스토리텔링 및 기획 의도</span>
                        <p className="text-stone-700 text-xs leading-relaxed font-light whitespace-pre-line bg-stone-50 p-3.5 rounded border border-stone-100 select-all">
                          {proposal.description}
                        </p>
                      </div>

                      {/* Recommended places nested details */}
                      <div>
                        <span className="text-stone-400 text-[10px] font-bold block mb-2.5">추천된 핵심 공간 리스트 ({proposal.places?.length || 0})</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {proposal.places?.map((place, idx) => (
                            <div key={place.id || idx} className="p-3.5 rounded-lg border border-stone-200/80 bg-stone-50/50 flex space-x-3 text-xs">
                              {place.image && (
                                <img
                                  src={place.image}
                                  alt={place.name}
                                  className="w-14 h-14 rounded object-cover flex-shrink-0 border border-stone-200/50"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                              )}
                              <div className="space-y-1 min-w-0 flex-grow">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-stone-900 truncate">
                                    {place.name}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200/60 text-stone-600 font-semibold text-right scale-90 origin-right">
                                    {place.category}
                                  </span>
                                </div>
                                <div className="text-[10px] text-stone-400 flex items-center space-x-1 font-mono">
                                  <Clock className="w-3 h-3 flex-shrink-0" />
                                  <span>{place.time}</span>
                                </div>
                                <div className="text-[10px] text-stone-500 flex items-center space-x-1 truncate font-mono">
                                  <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                                  <span className="truncate">{place.address}</span>
                                </div>
                                <p className="text-[11px] text-stone-600 font-light leading-relaxed mt-1 line-clamp-2">
                                  {place.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --------------------- TAB 4: POST EDITOR & AI CO-WRITER --------------------- */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            
            {/* Header info bar */}
            <div className="bg-stone-900 text-stone-100 p-6 rounded-xl shadow-luxury flex flex-col md:flex-row md:items-center md:justify-between border border-stone-800">
              <div>
                <h3 className="text-base font-serif font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>{editingCourseId ? '기존 큐레이션 개정 공방' : '새로운 로컬 큐레이션 창작'}</span>
                </h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">
                  직접 콘텐츠를 수공업 기입하거나 아래의 <strong>AI 비서</strong>를 사용해 완성도 높은 가안을 2초 만에 자동 작성할 수 있습니다.
                </p>
              </div>

              {/* Toggle AI helper */}
              <button
                id="ai-copilot-toggle-btn"
                onClick={() => setShowAiCopilot(!showAiCopilot)}
                className="mt-4 md:mt-0 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Sparkles className="w-4 h-4" />
                <span>{showAiCopilot ? 'AI 도구 상자 닫기' : 'AI 큐레이터 도움받기'}</span>
              </button>
            </div>

            {/* AI Generator Panel Tray */}
            {showAiCopilot && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white border-2 border-amber-500/30 rounded-xl shadow-luxury space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700 flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span>AI CURATOR INSTANT ARTICLE SEEDER</span>
                  </h4>
                  <button onClick={() => setShowAiCopilot(false)} className="text-xs text-stone-400 hover:text-stone-700">닫기</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {/* Presets dropdown */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">큐레이션 테마 및 거점 선택</label>
                    <select
                      value={selectedPresetKey}
                      onChange={(e) => setSelectedPresetKey(e.target.value)}
                      className="w-full input-premium rounded-lg text-xs"
                    >
                      <option value="seongsu">성수동 연무장길 (미학적 크리에이티브 코스)</option>
                      <option value="gangneung">강릉 초당 솔향길 (사색 & 힐링 고택 코스)</option>
                      <option value="hannam">한남동 글로벌 예술 가이드 (이국적인 쇼룸 코스)</option>
                    </select>
                  </div>

                  {/* Add extra prompt */}
                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">추가 커스텀 요청사항 (선택)</label>
                    <input
                      type="text"
                      value={aiCustomPrompt}
                      onChange={(e) => setAiCustomPrompt(e.target.value)}
                      className="w-full input-premium rounded-lg text-xs"
                      placeholder="예: '비오는 날 분위기', '연인과 가기 좋은', '고전 소설 무드로'"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <p className="text-[10px] text-stone-500 font-light">
                    * AI 생성기는 최적의 Unsplash 고품질 여행 전경 사진들과 가교 역할을 할 수 있는 서정적인 카피를 세트로 작성해 줍니다.
                  </p>
                  
                  <button
                    id="ai-generate-run-btn"
                    onClick={handleGenerateAiCuration}
                    disabled={isGeneratingAi}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg text-xs font-bold tracking-wide flex items-center space-x-1.5 cursor-pointer"
                  >
                    {isGeneratingAi ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>AI 큐레이터 집필 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>초안 자동 작성하기</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Main Form Fields */}
            <div className="bg-white rounded-xl shadow-luxury border border-stone-200 p-6 space-y-6 text-xs font-sans text-stone-800">
              
              <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  1. 핵심 큐레이션 메타데이터 기입
                </span>
                <span className="text-[10px] text-stone-400 font-mono">ID: {editingCourseId || '신규 등록 대기'}</span>
              </div>

              {/* Row 1: Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">코스 메인 제목</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 제주 아날로그 감성, 깊은 중산간 비밀 카페 투어"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">서브 타이틀 / 한 줄 요약</label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 푸른 해변 뒤에 숨겨진 제주의 소박하고 투명한 돌담 속 하루"
                  />
                </div>
              </div>

              {/* Row 2: Region, Duration, Theme, Author */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">지역 정보</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 제주 (Jeju)"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">총 소요 시간</label>
                  <input
                    type="text"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 당일 코스 (1 Day)"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">핵심 테마 태그</label>
                  <input
                    type="text"
                    value={editTheme}
                    onChange={(e) => setEditTheme(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 힐링 & 티타임"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">큐레이터 이름</label>
                  <input
                    type="text"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full input-premium rounded-lg"
                    placeholder="예: 홍길동 디렉터"
                  />
                </div>
              </div>

              {/* Row 3: Banner Image & Default Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1.5 flex justify-between items-center">
                    <span>아티클 대표 썸네일 커버 URL</span>
                    <label className="text-[10px] font-mono text-amber-700 hover:text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 bg-amber-50 cursor-pointer transition-colors font-normal">
                      직접 파일 업로드
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setEditThumbnail)}
                      />
                    </label>
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="flex-grow input-premium rounded-lg text-xs"
                      placeholder="https://images.unsplash.com/... 또는 직접 파일 업로드"
                    />
                    {editThumbnail && (
                      <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden bg-stone-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                        <img 
                          src={editThumbnail} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1.5">기본 아티클 노출 레이아웃</label>
                  <select
                    value={editLayout}
                    onChange={(e) => setEditLayout(e.target.value as 'timeline' | 'gallery')}
                    className="w-full input-premium rounded-lg"
                  >
                    <option value="timeline">커넥티브 타임라인 (수직 원형 마커 연결)</option>
                    <option value="gallery">비주얼 갤러리 (바둑판형 이미지 카드 강조)</option>
                  </select>
                </div>
              </div>

              {/* Intro Editorial Description */}
              <div>
                <label className="block text-stone-700 font-bold mb-1.5">인트로 큐레이션 평론 / 소개 서평</label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full input-premium rounded-lg leading-relaxed"
                  placeholder="단순히 장소만 소개하는 것을 넘어, 전체 노선이 가지는 스토리텔링과 가교의 필요성을 명품 매거진 칼럼 수준의 문체로 작성해보세요."
                />
              </div>

              {/* SEO Tags Section */}
              <div className="pt-4 border-t border-stone-100 space-y-4">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  2. 마케팅 검색최적화 (SEO Meta Config)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">SEO Meta Title (검색 타이틀)</label>
                    <input
                      type="text"
                      value={editSeoTitle}
                      onChange={(e) => setEditSeoTitle(e.target.value)}
                      className="w-full input-premium rounded-lg"
                      placeholder="검색엔진에 잡힐 최적의 타이틀"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">SEO Meta Description (검색 묘사글)</label>
                    <input
                      type="text"
                      value={editSeoDesc}
                      onChange={(e) => setEditSeoDesc(e.target.value)}
                      className="w-full input-premium rounded-lg"
                      placeholder="검색 결과 스니펫에 노출될 클릭 유도 카피"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1.5">SEO Keywords (색인 키워드 - 쉼표 구분)</label>
                    <input
                      type="text"
                      value={editSeoKeywords}
                      onChange={(e) => setEditSeoKeywords(e.target.value)}
                      className="w-full input-premium rounded-lg"
                      placeholder="예: 제주카페, 제주여행, 힐링코스"
                    />
                  </div>
                </div>
              </div>

              {/* Course Route Itinerary Planners */}
              <div className="pt-4 border-t border-stone-100 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    3. 여정 상세 거점 플래너 ({editPlaces.length}개 스폿)
                  </span>
                  <button
                    onClick={addPlaceInForm}
                    className="px-3.5 py-1.5 border border-stone-300 rounded text-stone-700 hover:text-stone-900 hover:bg-stone-50 font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>로컬 거점 추가</span>
                  </button>
                </div>

                {/* Places Loop Render Form */}
                <div className="space-y-6">
                  {editPlaces.map((place, index) => (
                    <div
                      key={place.id}
                      className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-4 relative"
                    >
                      {/* Floating actions */}
                      <div className="absolute top-4 right-4 flex items-center space-x-1.5">
                        <button
                          onClick={() => movePlace(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded border border-stone-200 bg-white text-stone-500 hover:text-stone-900 disabled:opacity-30"
                          title="순서 올리기"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => movePlace(index, 'down')}
                          disabled={index === editPlaces.length - 1}
                          className="p-1 rounded border border-stone-200 bg-white text-stone-500 hover:text-stone-900 disabled:opacity-30"
                          title="순서 내리기"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePlaceInForm(index)}
                          className="p-1 rounded border border-stone-200 bg-white text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="장소 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Header Badge */}
                      <div className="inline-flex items-center space-x-1.5 font-bold font-mono text-amber-800">
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-xs border border-amber-500/20">
                          {index + 1}
                        </span>
                        <span>SPOT ITINERARY</span>
                      </div>

                      {/* Field Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-stone-600 font-bold mb-1">장소명 / 공간명</label>
                          <input
                            type="text"
                            value={place.name}
                            onChange={(e) => updatePlaceFieldInForm(index, 'name', e.target.value)}
                            className="w-full input-premium rounded-lg py-2 text-xs"
                            placeholder="예: 송당 돌담 온실 카페"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-600 font-bold mb-1">방문 권장 시각</label>
                          <input
                            type="text"
                            value={place.time}
                            onChange={(e) => updatePlaceFieldInForm(index, 'time', e.target.value)}
                            className="w-full input-premium rounded-lg py-2 text-xs"
                            placeholder="예: 09:30 AM"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-600 font-bold mb-1">공간 대분류 카테고리</label>
                          <input
                            type="text"
                            value={place.category}
                            onChange={(e) => updatePlaceFieldInForm(index, 'category', e.target.value)}
                            className="w-full input-premium rounded-lg py-2 text-xs"
                            placeholder="예: 카페 / 도서관"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-600 font-bold mb-1">정확한 도로명 주소</label>
                          <input
                            type="text"
                            value={place.address}
                            onChange={(e) => updatePlaceFieldInForm(index, 'address', e.target.value)}
                            className="w-full input-premium rounded-lg py-2 text-xs"
                            placeholder="예: 제주특별자치도 제주시 구좌읍 송당5길 12"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-600 font-bold mb-1 flex justify-between items-center">
                            <span>공간 대표 이미지 URL</span>
                            <label className="text-[10px] font-mono text-amber-700 hover:text-amber-900 border border-amber-300 rounded px-1.5 py-0.5 bg-amber-50 cursor-pointer transition-colors font-normal">
                              직접 파일 업로드
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const compressed = await compressImage(file);
                                      updatePlaceFieldInForm(index, 'image', compressed);
                                      triggerToast('장소 사진이 성공적으로 최적화되어 업로드되었습니다!');
                                    } catch (err) {
                                      console.error('Place image upload failed:', err);
                                    }
                                  }
                                }}
                              />
                            </label>
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={place.image}
                              onChange={(e) => updatePlaceFieldInForm(index, 'image', e.target.value)}
                              className="flex-grow input-premium rounded-lg py-2 text-xs"
                              placeholder="https://images.unsplash.com/... 또는 직접 파일 업로드"
                            />
                            {place.image && (
                              <div className="w-8 h-8 rounded border border-stone-200 overflow-hidden bg-stone-100 flex-shrink-0 shadow-sm flex items-center justify-center">
                                <img 
                                  src={place.image} 
                                  alt="Spot preview" 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-600 font-bold mb-1">장소 정체성 및 에디터 큐레이션 한줄 해설</label>
                        <textarea
                          rows={2}
                          value={place.description}
                          onChange={(e) => updatePlaceFieldInForm(index, 'description', e.target.value)}
                          className="w-full input-premium rounded-lg leading-relaxed text-xs"
                          placeholder="방문자가 이곳에서 어떤 감각적 힐링을 얻어갈 수 있는지 차분히 풀어써주세요."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('posts')}
                  className="px-5 py-3 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 tracking-wide flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>발행 취소 및 돌아가기</span>
                </button>

                <button
                  id="cms-save-article-btn"
                  onClick={handleSavePost}
                  className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center space-x-2 shadow-lg cursor-pointer"
                >
                  <Save className="w-4.5 h-4.5" />
                  <span>로컬 큐레이션 정식 발행하기</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Netlify / GitHub Deployment Sync Modal */}
        <NetlifySyncModal
          isOpen={isNetlifySyncModalOpen}
          onClose={() => setIsNetlifySyncModalOpen(false)}
          settings={settings}
          courses={courses}
          onImportData={(newSettings, newCourses) => {
            onSaveSettings(newSettings);
            onSaveCourses(newCourses);
            triggerToast('JSON 설정 데이터가 성공적으로 복구 및 업데이트되었습니다!');
          }}
        />

        {/* Global Toast Alert */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 border border-stone-800 px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-2"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-sans tracking-wide">{toastMessage}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
}
