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
  Sparkles,
  ExternalLink,
  ChevronDown,
  Info,
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
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
        }, 2500);
        return;
      }
    }

    // If native prompt wasn't triggered (e.g. iOS or manual browser requirement), reveal the guided steps
    setShowManualGuide(true);
  };

  const handleOpenTelegram = () => {
    playSoundEffect('tap');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white relative w-full max-w-md rounded-[32px] shadow-2xl border border-slate-100 p-6 sm:p-7 overflow-hidden text-center transition-all animate-scale-up"
        dir="rtl"
      >
        {/* Close Button (top-left / top-right depending on visual) */}
        <button
          onClick={handleDismissLater}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-100/60 via-pink-50/30 to-transparent -z-10 pointer-events-none" />

        {/* ========================================================================= */}
        {/* Centered App Icon with Radiant Gradient & Glow (Matches User Screenshot)  */}
        {/* ========================================================================= */}
        <div className="flex justify-center mb-4 pt-1">
          <div className="relative group">
            {/* Glowing Backdrop */}
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500 opacity-60 blur-lg group-hover:opacity-80 transition duration-300" />
            
            {/* Squircle App Badge */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-[26px] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-500 flex flex-col items-center justify-center text-white shadow-xl shadow-fuchsia-500/30 border-2 border-white/40">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
                <Smartphone className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="font-arabic font-black text-[10px] text-amber-200 tracking-wider mt-1 drop-shadow-xs">
                {appName}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Title & Subtitle                                                          */}
        {/* ========================================================================= */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-arabic tracking-tight mb-2">
          ثبّت {appName} على شاشتك الرئيسية
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-5 max-w-sm mx-auto">
          وصول أسرع لدروس وتمارين اللغة العربية والأناشيد بضغطة واحدة، من غير متصفح ومن غير تحميل من أي متجر.
        </p>

        {/* Success Alert if just installed */}
        {installSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم تثبيت التطبيق بنجاح على جهازك! مرحباً بك.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Primary Action Button: Install Now (Gradient Pill/Rounded)                */}
        {/* ========================================================================= */}
        {!isInstalled && (
          <button
            onClick={handleInstallClick}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-500 hover:from-violet-700 hover:via-fuchsia-700 hover:to-rose-600 text-white font-black text-base sm:text-lg font-arabic shadow-lg shadow-fuchsia-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mb-3"
          >
            <Download className="w-5 h-5" />
            <span>ثبّت الآن</span>
          </button>
        )}

        {isInstalled && (
          <div className="w-full py-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-sm font-arabic flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>التطبيق مثبت بالفعل على جهازك 🎉</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Guided Step-by-Step Instructions (For iOS Safari, Android, or PC/Mac)     */}
        {/* ========================================================================= */}
        {showManualGuide && (
          <div className="mb-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-right space-y-2 text-xs text-slate-700 font-sans animate-fade-in">
            <div className="flex items-center justify-between text-slate-900 font-bold font-arabic pb-1 border-b border-slate-200">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-violet-600" />
                <span>طريقة التثبيت السريعة:</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {isIOS ? 'أجهزة iPhone / iPad' : isDesktop ? 'الكمبيوتر (Chrome/Edge)' : 'أجهزة Android'}
              </span>
            </div>

            {isIOS ? (
              <div className="space-y-1.5 pt-1 text-[11px] leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>اضغط على زر المشاركة <strong>(Partager / Share)</strong> <Share2 className="w-3.5 h-3.5 inline text-sky-600" /> في أسفل متصفح Safari.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>مرر للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> (Sur l’écran d’accueil) <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" />.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>اضغط على <strong>«إضافة»</strong> (Ajouter) لتثبيت أيقونة التطبيق فوراً.</span>
                </p>
              </div>
            ) : isDesktop ? (
              <div className="space-y-1.5 pt-1 text-[11px] leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>اضغط على أيقونة التثبيت <Monitor className="w-3.5 h-3.5 inline text-violet-600" /> الموجودة في شريط العنوان (URL bar) أعلى المتصفح.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>أو افتح قائمة الخيارات (⋮) ثم اختر <strong>«تثبيت ArabFacile»</strong>.</span>
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1 text-[11px] leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>اضغط على زر القائمة (⋮) أعلى يمين أو يسار المتصفح.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Toggle manual guide link if not already shown */}
        {!showManualGuide && !isInstalled && (
          <button
            onClick={() => setShowManualGuide(true)}
            className="text-[11px] text-slate-500 hover:text-violet-700 underline font-medium mb-3 cursor-pointer block mx-auto"
          >
            كيف أقوم بتثبيت التطبيق يدوياً؟
          </button>
        )}

        {/* ========================================================================= */}
        {/* TELEGRAM CHANNEL SECTION: arabiaeasy (Explicitly requested by user)       */}
        {/* ========================================================================= */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 via-sky-100/50 to-blue-50 border border-sky-200 text-right space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4 fill-white -rotate-12 translate-x-0.5" />
                </div>
                <div>
                  <h4 className="font-arabic font-black text-sm text-sky-950">
                    قناة تلغرام التعليمية الرسمية
                  </h4>
                  <p className="text-[10px] font-mono text-sky-700 font-bold" dir="ltr">
                    @{telegramUsername}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900 text-[10px] font-black font-sans">
                مجانية 🎁
              </span>
            </div>

            <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
              انضم إلينا لمتابعة الدروس الحصرية، تحميل أوراق العمل وملفات PDF، والتواصل المباشر مع الأستاذ سعيد.
            </p>

            <button
              onClick={handleOpenTelegram}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-arabic font-extrabold text-xs shadow-md shadow-sky-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-white -rotate-12" />
              <span>الانضمام لقناة تلغرام @{telegramUsername}</span>
              <ExternalLink className="w-3 h-3 text-sky-200 mr-0.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Dismissal Link: "ربما لاحقاً" (Matches User Screenshot)                   */}
        {/* ========================================================================= */}
        <div className="mt-4">
          <button
            onClick={handleDismissLater}
            className="text-xs sm:text-sm font-arabic font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer py-1"
          >
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
};
