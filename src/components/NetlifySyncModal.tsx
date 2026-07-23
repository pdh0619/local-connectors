import React, { useState } from 'react';
import { Download, Upload, Copy, Check, ExternalLink, HelpCircle, X, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsiteSettings, TravelCourse } from '../types';

interface NetlifySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  courses: TravelCourse[];
  onImportData: (settings: WebsiteSettings, courses: TravelCourse[]) => void;
}

export default function NetlifySyncModal({
  isOpen,
  onClose,
  settings,
  courses,
  onImportData,
}: NetlifySyncModalProps) {
  const [copiedCourses, setCopiedCourses] = useState(false);
  const [copiedSettings, setCopiedSettings] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to download JSON files
  const downloadJson = (filename: string, data: any) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (data: any, setCopiedState: (val: boolean) => void) => {
    const jsonStr = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Handle uploading JSON file to sync into current browser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetType: 'courses' | 'settings') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (targetType === 'courses') {
          if (!Array.isArray(parsed)) {
            throw new Error('courses.json 파일은 배열 형식이어야 합니다.');
          }
          onImportData(settings, parsed);
          setImportSuccess('코스 데이터(courses.json)가 성공적으로 적용되었습니다!');
        } else {
          onImportData(parsed, courses);
          setImportSuccess('설정 데이터(settings.json)가 성공적으로 적용되었습니다!');
        }
        setImportError(null);
        setTimeout(() => setImportSuccess(null), 3000);
      } catch (err: any) {
        setImportError(err.message || 'JSON 파일 파싱 중 오류가 발생했습니다.');
        setImportSuccess(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title Header */}
          <div className="flex items-center space-x-3 mb-6 border-b border-stone-800 pb-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">
                Netlify / GitHub 전 세계 배포 동기화
              </h3>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                다른 브라우저나 타인에게도 내가 수정한 내용이 보이도록 깃허브에 영구 반영하는 방법
              </p>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl mb-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1.5 text-stone-300 leading-relaxed">
                <p className="font-bold text-amber-300">
                  💡 다른 브라우저에서 수정 전 모습이 보이는 이유:
                </p>
                <p>
                  Netlify는 깃허브(GitHub) 저장소의 코드를 기반으로 호스팅됩니다. CMS에서 변경한 내용은 현재 브라우저에 임시 저장되므로, **다른 사용자가 보려면 깃허브 저장소의 파일도 업데이트**되어야 합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="space-y-6">
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-xs flex items-center justify-center font-bold">1</span>
                <span>수정된 JSON 파일 다운로드하기</span>
              </h4>
              <p className="text-xs text-stone-400 mb-4">
                아래 버튼을 눌러 현재 CMS 대시보드에서 편집된 최신 데이터를 컴퓨터에 다운로드하세요.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Download courses.json */}
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold mb-1">
                      <FileText className="w-4 h-4" />
                      <span>courses.json</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light mb-3">
                      모든 여행 코스, 장소, 사진, SEO 정보가 담긴 파일 ({courses.length}개 코스)
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadJson('courses.json', courses)}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>파일 다운로드</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(courses, setCopiedCourses)}
                      className="py-2 px-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition-colors"
                      title="텍스트 복사"
                    >
                      {copiedCourses ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Download settings.json */}
                <div className="p-3 bg-stone-900 border border-stone-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold mb-1">
                      <FileText className="w-4 h-4" />
                      <span>settings.json</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light mb-3">
                      메인 타이틀, 대표 배너, 서브 타이틀 등 브랜드 비주얼 설정
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadJson('settings.json', settings)}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>파일 다운로드</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(settings, setCopiedSettings)}
                      className="py-2 px-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition-colors"
                      title="텍스트 복사"
                    >
                      {copiedSettings ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Guide */}
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-xs flex items-center justify-center font-bold">2</span>
                <span>GitHub 저장소에 파일 덮어쓰기 (업로드)</span>
              </h4>
              <ol className="text-xs text-stone-300 space-y-2 list-decimal list-inside leading-relaxed font-light">
                <li>
                  내 <span className="text-amber-300 font-medium">GitHub Repository</span> 페이지로 이동합니다.
                </li>
                <li>
                  상단 오른쪽 <span className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Add file</span> 버튼 클릭 후 <span className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">Upload files</span> 선택.
                </li>
                <li>
                  방금 다운로드받은 <span className="font-mono text-amber-300">courses.json</span> 및 <span className="font-mono text-amber-300">settings.json</span> 파일 2개를 그대로 드래그하여 올립니다.
                </li>
                <li>
                  하단 green <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Commit changes</span> 버튼을 클릭합니다.
                </li>
              </ol>

              <div className="mt-4 p-3 bg-stone-900 border border-stone-800 rounded-lg flex items-center justify-between text-xs text-stone-400">
                <span>Netlify가 1분 이내로 자동 재배포를 완료합니다!</span>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>GitHub 이동</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Step 3 Optional: Import to another browser or sync from server */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-stone-300 mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-stone-400" />
                  <span>배포 서버 최신 데이터 즉시 불러오기 / 내보내기</span>
                </span>
              </h4>
              <p className="text-[11px] text-stone-400 mb-3">
                깃허브/Netlify에 업데이트된 최신 JSON을 이 브라우저로 즉시 불러오거나, 백업용 파일로 불러올 수 있습니다.
              </p>

              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={async () => {
                    setImportError(null);
                    setImportSuccess(null);
                    try {
                      const ts = Date.now();
                      const [cRes, sRes] = await Promise.all([
                        fetch(`/courses.json?v=${ts}`),
                        fetch(`/settings.json?v=${ts}`)
                      ]);
                      if (!cRes.ok || !sRes.ok) {
                        throw new Error('배포된 courses.json 또는 settings.json을 찾을 수 없습니다.');
                      }
                      const cData = await cRes.json();
                      const sData = await sRes.json();
                      onImportData(sData, cData);
                      setImportSuccess('Netlify 배포 서버의 최신 데이터로 동기화되었습니다!');
                    } catch (e: any) {
                      setImportError(e.message || '서버 데이터 동기화에 실패했습니다.');
                    }
                  }}
                  className="py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs rounded-lg transition-colors border border-amber-500/40 font-medium flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Netlify 배포본 데이터로 이 브라우저 동기화</span>
                </button>

                <label className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg cursor-pointer transition-colors border border-stone-700">
                  <span>courses.json 파일 불러오기</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'courses')}
                  />
                </label>
                <label className="py-1.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg cursor-pointer transition-colors border border-stone-700">
                  <span>settings.json 파일 불러오기</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'settings')}
                  />
                </label>
              </div>

              {importSuccess && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">{importSuccess}</p>
              )}
              {importError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">{importError}</p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
