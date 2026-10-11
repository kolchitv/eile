import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { playSoundEffect } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Send,
  Smartphone,
  Monitor,
  Share2,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InstallAppTelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  telegramUsername?: string;
}

export const InstallAppTelegramModal: React.FC<InstallAppTelegramModalProps> = ({
  isOpen,
  onClose,
  appName = 'ArabFacile',
  telegramUsername = 'arabiaeasy',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install } = usePWAInstall();
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    playSoundEffect('tap');
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
        playSoundEffect('correct');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
          onClose();
        }, 2000);
        return;
      }
    }
    // If native prompt wasn't available, reveal the concise guided steps
    setShowManualGuide(true);
  };

  const handleOpenTelegram = () => {
    playSoundEffect('tap');
    window.open(`https://t.me/${telegramUsername}`, '_blank', 'noopener,noreferrer');
  };

  const handleDismissLater = () => {
    playSoundEffect('tap');
    try {
      localStorage.setItem('arabfacile_pwa_dismissed', Date.now().toString());
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-[2px] transition-all animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={handleDismissLater}
    >
      {/* Compact Card with Stop Propagation on Click */}
      <div
        className="bg-white/98 relative w-full max-w-[360px] rounded-3xl shadow-2xl border border-amber-200/80 p-4 sm:p-5 overflow-hidden text-center transition-all animate-scale-up"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleDismissLater}
          className="absolute top-3 left-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-violet-100/50 via-rose-50/20 to-transparent -z-10 pointer-events-none" />

        {/* Compact Header: Small Badge + Title */}
        <div className="flex items-center gap-2.5 text-right mb-2.5 pr-1">
          {/* Compact App Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20 shrink-0 border border-white/50">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-arabic font-black text-slate-900 text-sm sm:text-base leading-snug">
              تثبيت {appName} وقناة تلغرام
            </h3>
            <p className="text-[11px] text-slate-500 font-sans leading-tight">
              وصول فوري وخفيف لدروس العربية بلمسة واحدة
            </p>
          </div>
        </div>

        {/* Success Alert if just installed */}
        {installSuccess && (
          <div className="mb-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم تثبيت التطبيق بنجاح! 🎉</span>
          </div>
        )}

        {/* Install Action Button */}
        {!isInstalled ? (
          <button
            onClick={handleInstallClick}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 hover:brightness-105 active:scale-[0.98] text-white font-black text-xs sm:text-sm font-arabic shadow-md shadow-fuchsia-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت التطبيق على جهازك 📥</span>
          </button>
        ) : (
          <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs font-arabic flex items-center justify-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>التطبيق مثبت على جهازك ✨</span>
          </div>
        )}

        {/* Toggle Manual Guide Accordion (Compact) */}
        {!isInstalled && (
          <button
            onClick={() => setShowManualGuide((prev) => !prev)}
            className="text-[11px] text-violet-700 hover:text-violet-900 font-bold flex items-center justify-center gap-1 mx-auto mb-2.5 cursor-pointer transition-colors"
          >
            <Info className="w-3 h-3" />
            <span>{showManualGuide ? 'إخفاء طريقة التثبيت' : 'كيفية التثبيت اليدوي؟'}</span>
            {showManualGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        {/* Guided Step-by-Step Instructions (Only shown if toggled) */}
        {showManualGuide && (
          <div className="mb-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-right space-y-1.5 text-[11px] text-slate-700 font-sans animate-fade-in">
            <span className="font-bold text-[10px] text-violet-800 block">
              {isIOS ? 'أجهزة iPhone / iPad (Safari):' : isDesktop ? 'الكمبيوتر (Chrome/Edge):' : 'أجهزة Android:'}
            </span>
            {isIOS ? (
              <p className="leading-relaxed text-[10px]">
                اضغط زر المشاركة <Share2 className="w-3 h-3 inline text-sky-600" /> ثم اختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> <PlusSquare className="w-3 h-3 inline text-emerald-600" /> ثم «إضافة».
              </p>
            ) : isDesktop ? (
              <p className="leading-relaxed text-[10px]">
                اضغط على أيقونة التثبيت <Monitor className="w-3 h-3 inline text-violet-600" /> بشريط المتصفح أو قائمة (⋮) ثم <strong>«تثبيت ArabFacile»</strong>.
              </p>
            ) : (
              <p className="leading-relaxed text-[10px]">
                اضغط على قائمة المتصفح (⋮) ثم اختر <strong>«تثبيت التطبيق»</strong> أو «إضافة للشاشة الرئيسية».
              </p>
            )}
          </div>
        )}

        {/* Telegram Channel Section (Ultra-Compact) */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50/70 border border-sky-200 text-right space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                <Send className="w-3.5 h-3.5 fill-white -rotate-12 translate-x-0.5" />
              </div>
              <div className="leading-tight">
                <h4 className="font-arabic font-black text-xs text-sky-950">
                  قناة تلغرام التعليمية
                </h4>
                <span className="text-[10px] font-mono text-sky-700 font-bold" dir="ltr">
                  @{telegramUsername}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-sky-200/80 text-sky-900 text-[9px] font-black">
              مجانية 🎁
            </span>
          </div>

          <button
            onClick={handleOpenTelegram}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-105 active:scale-[0.98] text-white font-arabic font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3 h-3 fill-white -rotate-12" />
            <span>الانضمام لقناة @{telegramUsername}</span>
            <ExternalLink className="w-2.5 h-2.5 text-sky-200 mr-0.5" />
          </button>
        </div>

        {/* Dismiss Link */}
        <div className="mt-2.5">
          <button
            onClick={handleDismissLater}
            className="text-xs font-arabic font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer py-0.5"
          >
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
};
