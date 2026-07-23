import React, { useState } from 'react';
import { Lock, Key, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid passwords: connectors2026 or admin1234
    if (password === 'connectors2026' || password === 'admin1234' || password === 'admin') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-400">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold font-serif text-white mb-1">
              관리자 보안 인증
            </h3>
            <p className="text-xs text-stone-400 mb-6 font-light">
              CMS 대시보드는 승인된 큐레이터 및 관리자만 접속할 수 있습니다.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div>
                <label className="block text-left text-xs font-medium text-stone-300 mb-1.5">
                  관리자 비밀번호
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="비밀번호를 입력하세요"
                    autoFocus
                    className="w-full px-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all placeholder:text-stone-600"
                  />
                  <Key className="w-4 h-4 text-stone-500 absolute right-3.5 top-3.5" />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-1.5 text-rose-400 text-xs mt-2 text-left"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>비밀번호가 올바르지 않습니다. 다시 확인해주세요.</span>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  인증 및 진입
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
