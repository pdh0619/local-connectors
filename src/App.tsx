import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMission from './components/AboutMission';
import Explorer from './components/Explorer';
import CourseDetail from './components/CourseDetail';
import AdminDashboard from './components/AdminDashboard';
import ProposeCourseModal from './components/ProposeCourseModal';
import AdminAuthModal from './components/AdminAuthModal';
import { TravelCourse, WebsiteSettings } from './types';
import { 
  getSavedSettings, saveSettings, getSavedCourses, saveCourses, resetToDefaults 
} from './data';
import { Compass, Github, Instagram, HelpCircle, Mail, Sparkles, Check, X } from 'lucide-react';

export default function App() {
  // Global states loaded from local persistence
  const [settings, setSettings] = useState<WebsiteSettings>(getSavedSettings());
  const [courses, setCourses] = useState<TravelCourse[]>(getSavedCourses());
  
  // Navigation & Authentication states
  const [currentTab, setCurrentTab] = useState<'explorer' | 'admin'>('explorer');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('local_connectors_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Proposal modal states
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [showProposalSuccessToast, setShowProposalSuccessToast] = useState(false);

  // Handle Tab Change with Admin Auth Guard
  const handleTabChange = (tab: 'explorer' | 'admin') => {
    if (tab === 'admin' && !isAdminAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    if (tab === 'explorer') {
      setSelectedCourseId(null);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAuthModalOpen(false);
    setCurrentTab('admin');
    try {
      sessionStorage.setItem('local_connectors_admin_auth', 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentTab('explorer');
    try {
      sessionStorage.removeItem('local_connectors_admin_auth');
    } catch (e) {
      // ignore
    }
  };

  // Sync state to body element's classes for the global font customization
  useEffect(() => {
    const body = document.body;
    
    // Remove old font classes
    body.classList.remove('font-sans', 'font-serif', 'font-mono');
    
    // Add active font class
    if (settings.fontStyle === 'serif') {
      body.classList.add('font-serif');
    } else if (settings.fontStyle === 'mono') {
      body.classList.add('font-mono');
    } else {
      body.classList.add('font-sans');
    }
  }, [settings.fontStyle]);

  // Load courses and settings from server-side database on mount, keeping localStorage as local fallback
  useEffect(() => {
    // Sync settings from server
    fetch('/api/settings')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to load settings from server');
      })
      .then(data => {
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          setSettings(data);
          saveSettings(data); // Sync local cache
        }
      })
      .catch(err => {
        console.error('Failed to sync settings from server:', err);
      });

    // Sync courses from server
    fetch('/api/courses')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to load courses from server');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
          saveCourses(data); // Sync local cache
        }
      })
      .catch(err => {
        console.error('Failed to sync courses from server:', err);
      });
  }, []);

  // Toast timer auto-hide
  useEffect(() => {
    if (showProposalSuccessToast) {
      const timer = setTimeout(() => {
        setShowProposalSuccessToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showProposalSuccessToast]);

  // Handle live customizer save
  const handleSaveSettings = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);

    // Sync to server
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(err => console.error('Error saving settings to server:', err));
  };

  // Handle post CMS saves
  const handleSaveCourses = (newCourses: TravelCourse[]) => {
    setCourses(newCourses);
    saveCourses(newCourses);
    
    // Sync to server
    fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourses)
    }).catch(err => console.error('Error saving courses to server:', err));
  };

  // Global reset trigger
  const handleResetData = () => {
    resetToDefaults();
    const defaultSettings: WebsiteSettings = {
      themeColor: 'navy',
      fontStyle: 'serif',
      logoText: 'LOCAL CONNECTORS',
      heroTitle: '경험해보지 못한, 한국 로컬여행',
      heroSubtitle: '우리는 평범한 관광지가 아닌,\n지역의 예술성이 깃든 숨겨진 공간들을 연결하여 고유한 흐름을 제안합니다.',
      heroBanner: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80',
      aboutCircleImage: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
      approachImage1: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      approachImage2: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      approachImage3: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    };
    const defaultCourses = getSavedCourses();
    setSettings(defaultSettings);
    setCourses(defaultCourses);
    setSelectedCourseId(null);
    setCurrentTab('explorer');

    // Reset settings on server
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultSettings)
    }).catch(err => console.error('Error resetting settings on server:', err));

    // Reset courses on server as well
    fetch('/api/courses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultCourses)
    }).catch(err => console.error('Error resetting courses on server:', err));
  };

  // Record a view when selecting an article
  const handleSelectCourse = (id: string) => {
    setSelectedCourseId(id);
    
    // Increment view count dynamically in memory and storage (optimistic update)
    const updated = courses.map(c => {
      if (c.id === id) {
        return { ...c, views: c.views + 1 };
      }
      return c;
    });
    setCourses(updated);
    saveCourses(updated);

    // Sync to server (authoritative update)
    fetch(`/api/courses/${id}/view`, {
      method: 'POST'
    })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(updatedCourse => {
      if (updatedCourse) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, views: updatedCourse.views } : c));
      }
    })
    .catch(err => console.error('Error registering view to server:', err));
  };

  // Record a like
  const handleLikeCourse = (id: string) => {
    // Increment like count dynamically in memory and storage (optimistic update)
    const updated = courses.map(c => {
      if (c.id === id) {
        return { ...c, likes: c.likes + 1 };
      }
      return c;
    });
    setCourses(updated);
    saveCourses(updated);

    // Sync to server (authoritative update)
    fetch(`/api/courses/${id}/like`, {
      method: 'POST'
    })
    .then(res => {
      if (res.ok) return res.json();
    })
    .then(updatedCourse => {
      if (updatedCourse) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, likes: updatedCourse.likes } : c));
      }
    })
    .catch(err => console.error('Error registering like to server:', err));
  };

  // Find currently active course
  const activeCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcfbfa]">
      
      {/* Universal Top Premium Header */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={handleTabChange}
        settings={settings}
        onReset={handleResetData}
        isAdminAuthenticated={isAdminAuthenticated}
        onRequestAdminAuth={() => setIsAuthModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View Workspace Routing */}
      <main className="flex-grow">
        {currentTab === 'explorer' || !isAdminAuthenticated ? (
          /* Public magazine view */
          selectedCourseId && activeCourse ? (
            /* Inside article reader */
            <CourseDetail
              course={activeCourse}
              onBack={() => setSelectedCourseId(null)}
              onLike={handleLikeCourse}
              settings={settings}
            />
          ) : (
            /* Home screen with Hero & Bento Explorer list */
            <>
              <Hero
                settings={settings}
                onExploreClick={() => {
                  const explorerElem = document.getElementById('explorer-search-input');
                  if (explorerElem) {
                    explorerElem.scrollIntoView({ behavior: 'smooth' });
                    explorerElem.focus();
                  }
                }}
              />
              <AboutMission settings={settings} />
              <Explorer
                courses={courses}
                onSelectCourse={handleSelectCourse}
                settings={settings}
                onOpenProposal={() => setIsProposalModalOpen(true)}
              />
            </>
          )
        ) : (
          /* Admin Dashboard & CMS Customizer Workspace */
          <AdminDashboard
            courses={courses}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onSaveCourses={handleSaveCourses}
            onExit={() => setCurrentTab('explorer')}
          />
        )}
      </main>

      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Propose Course Modal & Toast Notification */}
      <ProposeCourseModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        settings={settings}
        onSubmitSuccess={() => setShowProposalSuccessToast(true)}
      />

      {/* Success Notification Toast */}
      {showProposalSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-4 flex items-start space-x-3.5 text-stone-200">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-grow">
            <h5 className="text-xs font-bold text-stone-100">코스 제안 송신 완료</h5>
            <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
              작성하신 정취 가득한 코스가 무사히 도달했습니다. 검토가 끝나는 대로 아티클로 등록될 예정입니다.
            </p>
          </div>
          <button 
            onClick={() => setShowProposalSuccessToast(false)}
            className="p-1 rounded-full text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Premium Footers (Only visible on Public Magazine) */}
      {currentTab === 'explorer' && (
        <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              
              {/* Brand statement */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-stone-100 font-serif tracking-widest text-lg font-semibold block">
                  {settings.logoText || 'LOCAL CONNECTORS'}
                </span>
                <p className="text-xs text-stone-500 max-w-sm leading-relaxed font-light">
                  우리는 일차원적인 관광지 소개를 넘어, 고유한 지역의 소상공인과 장인들, 현대적인 복합문화공간을 씨실과 날실로 엮어내는 사적인 인문학 가이드 매거진입니다.
                </p>
                <p className="text-[10px] text-stone-600 font-mono">
                  © 2026 LOCAL CONNECTORS Inc. Crafted with Premium Curators.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <span className="text-xs text-stone-100 font-mono tracking-widest uppercase block mb-4">Magazine Directory</span>
                <ul className="space-y-2 text-xs font-light">
                  <li><a href="#explorer" onClick={() => setSelectedCourseId(null)} className="hover:text-amber-400 transition-colors">큐레이션 전체 보기</a></li>
                  <li><a href="#about" onClick={() => alert('로컬커넥터즈: 우리는 맹목적인 소비를 지양하고 지속 가능한 슬로우 여행, 정체성이 뚜렷한 브랜드를 사랑하는 에디터 협동조합입니다.')} className="hover:text-amber-400 transition-colors">매니페스토 (철학)</a></li>
                  <li><a href="#apply" onClick={() => alert('큐레이터 파트너십: 나만 아는 숨겨진 동네 골목을 아름다운 지도로 기고해 주실 큐레이터를 상시 모집하고 있습니다 (recruit@localconnectors.com).')} className="hover:text-amber-400 transition-colors">에디터 파트너십 지원</a></li>
                  <li className="pt-2">
                    {isAdminAuthenticated ? (
                      <button onClick={() => setCurrentTab('admin')} className="text-amber-400 hover:underline font-medium">
                        ✓ CMS 대시보드 바로가기
                      </button>
                    ) : (
                      <button onClick={() => setIsAuthModalOpen(true)} className="text-stone-500 hover:text-amber-400 transition-colors text-left flex items-center space-x-1">
                        <span>🔒 큐레이터 CMS 로그인</span>
                      </button>
                    )}
                  </li>
                </ul>
              </div>

              {/* Contacts */}
              <div>
                <span className="text-xs text-stone-100 font-mono tracking-widest uppercase block mb-4">Inquiries & Channels</span>
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center space-x-2 text-stone-500">
                    <Mail className="w-4 h-4 text-stone-600" />
                    <span className="hover:text-stone-300 font-mono">contact@localconnectors.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-stone-500">
                    <Instagram className="w-4 h-4 text-stone-600" />
                    <span className="hover:text-stone-300 font-mono">@local_connectors</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
