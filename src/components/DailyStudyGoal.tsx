import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { playSoundEffect } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Target,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  Settings2,
  Plus,
  Zap,
  Award,
  Bell,
  X,
  TrendingUp,
} from 'lucide-react';

interface DailyStudyGoalProps {
  language: SupportedLanguage;
  onEarnXp?: (amount: number) => void;
  onEarnGems?: (amount: number) => void;
  onIncrementStreak?: () => void;
  className?: string;
}

interface StudyStorageData {
  date: string;
  secondsStudied: number;
  goalMinutes: number;
  goalReachedAlerted: boolean;
  history: Record<string, number>; // date -> minutes studied
}

const STORAGE_KEY = 'arabfacile_daily_study_goal_v2';
const DEFAULT_GOAL_MINUTES = 20;

const PRESET_GOALS = [5, 10, 15, 20, 30, 45, 60];

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const DailyStudyGoal: React.FC<DailyStudyGoalProps> = ({
  language,
  onEarnXp,
  onEarnGems,
  className = '',
}) => {
  const todayKey = getTodayKey();

  // Core state loaded from localStorage
  const [goalMinutes, setGoalMinutes] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyStorageData = JSON.parse(raw);
        if (parsed.goalMinutes && parsed.goalMinutes > 0) return parsed.goalMinutes;
      }
    } catch {
      // fallback
    }
    return DEFAULT_GOAL_MINUTES;
  });

  const [secondsStudied, setSecondsStudied] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyStorageData = JSON.parse(raw);
        if (parsed.date === getTodayKey()) {
          return parsed.secondsStudied || 0;
        }
      }
    } catch {
      // fallback
    }
    return 0;
  });

  const [history, setHistory] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyStorageData = JSON.parse(raw);
        return parsed.history || {};
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [goalReachedAlerted, setGoalReachedAlerted] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StudyStorageData = JSON.parse(raw);
        if (parsed.date === getTodayKey()) {
          return !!parsed.goalReachedAlerted;
        }
      }
    } catch {
      // fallback
    }
    return false;
  });

  // Focus Timer active status
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCelebrationAlert, setShowCelebrationAlert] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [bonusClaimed, setBonusClaimed] = useState(false);

  // Sync to localStorage
  const saveStateToStorage = (
    updatedSeconds: number,
    updatedGoal: number,
    updatedAlerted: boolean,
    updatedHistory: Record<string, number>
  ) => {
    try {
      const data: StudyStorageData = {
        date: todayKey,
        secondsStudied: updatedSeconds,
        goalMinutes: updatedGoal,
        goalReachedAlerted: updatedAlerted,
        history: {
          ...updatedHistory,
          [todayKey]: Math.floor(updatedSeconds / 60),
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  // Trigger celebration explosion and sound
  const triggerCelebration = (minutesAchieved: number) => {
    playSoundEffect('levelup');
    setShowCelebrationAlert(true);

    try {
      // Fire double confetti volley
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#d97706', '#f59e0b', '#10b981', '#6366f1'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch {
      // ignore
    }

    // Attempt browser notification if supported and permitted
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const title =
          language === 'ar'
            ? '🎉 مبارك! حققت هدفك اليومي لدراسة العربية!'
            : language === 'fr'
            ? '🎉 Félicitations ! Objectif d’étude quotidien atteint !'
            : '🎉 Congratulations! Daily Arabic Study Goal Reached!';
        const body =
          language === 'ar'
            ? `لقد أتممت ${minutesAchieved} دقيقة من التعلم في ArabFacile.com بنجاح!`
            : language === 'fr'
            ? `Vous avez complété ${minutesAchieved} minutes d'apprentissage sur ArabFacile.com.`
            : `You have completed ${minutesAchieved} minutes of learning on ArabFacile.com.`;
        new Notification(title, { body, icon: '/icon.svg' });
      }
    } catch {
      // ignore
    }
  };

  // Check goal reached condition
  const checkGoalReached = (currentSec: number, targetMin: number, alreadyAlerted: boolean) => {
    const targetSec = targetMin * 60;
    if (currentSec >= targetSec && !alreadyAlerted) {
      setGoalReachedAlerted(true);
      triggerCelebration(Math.floor(currentSec / 60));
      saveStateToStorage(currentSec, targetMin, true, history);
    }
  };

  // Timer interval effect: runs every second when focus session is active
  useEffect(() => {
    let interval: any = null;
    if (isFocusActive) {
      interval = setInterval(() => {
        setSecondsStudied((prev) => {
          const next = prev + 1;
          checkGoalReached(next, goalMinutes, goalReachedAlerted);
          saveStateToStorage(next, goalMinutes, goalReachedAlerted, history);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusActive, goalMinutes, goalReachedAlerted, history]);

  // Subtle automatic background tracking (accumulates 1 minute every 60s when active in window)
  useEffect(() => {
    const bgInterval = setInterval(() => {
      // Only track if document has focus and not already running active focus stopwatch
      if (document.hasFocus() && !isFocusActive) {
        setSecondsStudied((prev) => {
          const next = prev + 15; // +15 seconds per active interval check
          checkGoalReached(next, goalMinutes, goalReachedAlerted);
          saveStateToStorage(next, goalMinutes, goalReachedAlerted, history);
          return next;
        });
      }
    }, 15000);

    return () => clearInterval(bgInterval);
  }, [isFocusActive, goalMinutes, goalReachedAlerted, history]);

  // Handle manual addition of minutes (e.g. +5m, +15m)
  const handleAddMinutes = (mins: number) => {
    playSoundEffect('tap');
    const addedSec = mins * 60;
    const newSeconds = secondsStudied + addedSec;
    setSecondsStudied(newSeconds);
    checkGoalReached(newSeconds, goalMinutes, goalReachedAlerted);
    saveStateToStorage(newSeconds, goalMinutes, goalReachedAlerted, history);
  };

  // Change Goal
  const handleSetGoal = (newGoal: number) => {
    playSoundEffect('tap');
    setGoalMinutes(newGoal);
    // If the new goal is higher than current seconds, reset alerted state so they can celebrate again upon hitting the higher goal
    const newAlerted = secondsStudied >= newGoal * 60;
    setGoalReachedAlerted(newAlerted);
    saveStateToStorage(secondsStudied, newGoal, newAlerted, history);
    setShowGoalModal(false);
  };

  // Reset Today
  const handleReset = () => {
    if (
      window.confirm(
        language === 'ar'
          ? 'هل ترغب في إعادة ضبط عداد دراسة اليوم إلى 0 دقيقة؟'
          : language === 'fr'
          ? 'Voulez-vous réinitialiser le temps d\'étude d\'aujourd\'hui à 0 min ?'
          : 'Do you want to reset today\'s study time to 0 min?'
      )
    ) {
      playSoundEffect('tap');
      setSecondsStudied(0);
      setIsFocusActive(false);
      setGoalReachedAlerted(false);
      saveStateToStorage(0, goalMinutes, false, history);
    }
  };

  // Claim celebration bonus reward
  const handleClaimBonus = () => {
    if (bonusClaimed) return;
    playSoundEffect('streak');
    if (onEarnXp) onEarnXp(50);
    if (onEarnGems) onEarnGems(10);
    setBonusClaimed(true);
    setTimeout(() => {
      setShowCelebrationAlert(false);
    }, 1200);
  };

  // Calculate metrics
  const currentMinutes = Math.floor(secondsStudied / 60);
  const displaySeconds = secondsStudied % 60;
  const targetSeconds = goalMinutes * 60;
  const progressPercent = Math.min(100, Math.round((secondsStudied / targetSeconds) * 100));
  const isGoalReached = secondsStudied >= targetSeconds;
  const remainingMinutes = Math.max(0, goalMinutes - currentMinutes);

  // Circular progress calculations (radius = 42, circumference = 2 * PI * 42 ≈ 263.89)
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100;

  // Last 7 days history for weekly activity bars
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabelsAr = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const dayLabelsFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const dayOfWeek = d.getDay();
    const isToday = key === todayKey;
    const mins = isToday ? currentMinutes : history[key] || 0;
    const reached = mins >= goalMinutes;
    return {
      dateKey: key,
      isToday,
      label:
        language === 'ar'
          ? dayLabelsAr[dayOfWeek]
          : language === 'fr'
          ? dayLabelsFr[dayOfWeek]
          : dayLabels[dayOfWeek],
      mins,
      reached,
    };
  });

  return (
    <div
      id="daily-study-goal-widget"
      className={`relative bg-gradient-to-br from-white via-amber-50/40 to-emerald-50/50 rounded-3xl p-5 sm:p-6 border-2 border-amber-300/90 shadow-lg shadow-amber-900/5 transition-all overflow-hidden ${className}`}
    >
      {/* Background aesthetic decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Flex Layout */}
      <div className="relative z-10 space-y-5">
        
        {/* Top Header: Title, Goal Badge & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform ${
              isGoalReached
                ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-amber-500/30 scale-105 animate-bounce-subtle'
                : isFocusActive
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 shadow-emerald-600/30 ring-4 ring-emerald-400/30'
                : 'bg-gradient-to-tr from-emerald-700 to-teal-800 shadow-emerald-700/20'
            }`}>
              {isGoalReached ? (
                <Trophy className="w-6 h-6 text-amber-100" />
              ) : isFocusActive ? (
                <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
              ) : (
                <Target className="w-6 h-6 text-emerald-100" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-1.5">
                  <span className="font-arabic font-black text-amber-950">
                    {language === 'ar' ? 'هدف الدراسة اليومي' : language === 'fr' ? 'Objectif d\'Étude Quotidien' : 'Daily Study Goal'}
                  </span>
                </h3>

                {isGoalReached ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-xs animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    <span>{language === 'ar' ? 'تم تحقيقه! 🌟' : language === 'fr' ? 'Atteint ! 🌟' : 'Reached! 🌟'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>{goalMinutes} {language === 'ar' ? 'دقيقة / يوم' : 'min / jour'}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {isGoalReached
                  ? language === 'ar'
                    ? 'رائع جداً! تجاوزت هدفك لليوم بنجاح واكتسبت نقاط الخبرة'
                    : language === 'fr'
                    ? 'Bravo ! Objectif dépassé avec succès aujourd\'hui !'
                    : 'Awesome job! You reached today\'s learning goal!'
                  : language === 'ar'
                  ? `بقي ${remainingMinutes} دقيقة للوصول إلى هدفك المحدد`
                  : language === 'fr'
                  ? `Encore ${remainingMinutes} minute(s) pour atteindre votre objectif`
                  : `${remainingMinutes} min left to hit your goal today`}
              </p>
            </div>
          </div>

          {/* Quick Buttons: Edit Goal + Re-celebrate if reached */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isGoalReached && (
              <button
                onClick={() => triggerCelebration(currentMinutes)}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-400/90 hover:bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="عرض شاشة التهنئة والمكافأة"
              >
                <span>🎉</span>
                <span>{language === 'ar' ? 'عرض الاحتفال' : 'Célébrer'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowGoalModal(true);
                playSoundEffect('tap');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-amber-100 border border-amber-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="تعديل وقت الهدف اليومي"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'ar' ? 'تعديل الهدف' : language === 'fr' ? 'Changer l\'objectif' : 'Edit Goal'}</span>
            </button>
          </div>
        </div>

        {/* Center Grid: Circular Gauge & Focus Timer & 7-Day History */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Column 1: Circular Progress Gauge & Large Numbers (5 cols) */}
          <div className="md:col-span-5 flex items-center gap-4 bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
            {/* SVG Circle Gauge */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-amber-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className={`transition-all duration-700 ease-out ${
                    isGoalReached
                      ? 'stroke-amber-500'
                      : progressPercent > 50
                      ? 'stroke-emerald-600'
                      : 'stroke-amber-600'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Ring Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-sans font-black text-lg text-slate-900 leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                  {isGoalReached ? 'مكتمل' : 'اليوم'}
                </span>
              </div>
            </div>

            {/* Time Metrics Details */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-black text-2xl sm:text-3xl text-slate-900 text-emerald-950">
                  {currentMinutes}
                </span>
                <span className="text-sm font-black text-slate-400">/</span>
                <span className="text-base font-extrabold text-amber-700">
                  {goalMinutes}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {language === 'ar' ? 'دقيقة' : 'min'}
                </span>
              </div>

              {/* Status Bar */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`w-2 h-2 rounded-full ${isFocusActive ? 'bg-emerald-500 animate-ping' : isGoalReached ? 'bg-amber-500' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-700">
                  {isFocusActive
                    ? language === 'ar'
                      ? 'جلسة تركيز قيد التشغيل...'
                      : 'Session active...'
                    : isGoalReached
                    ? language === 'ar'
                      ? 'تم إنجاز التحدي 🏆'
                      : 'Objectif validé 🏆'
                    : language === 'ar'
                    ? 'في انتظار الإكمال 🌱'
                    : 'En cours 🌱'}
                </span>
              </div>

              {/* Small stopwatch display if active */}
              {isFocusActive && (
                <div className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block border border-emerald-200">
                  ⏱️ {String(Math.floor(secondsStudied / 60)).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Focus Controls & Quick-Add Minutes (4 cols) */}
          <div className="md:col-span-4 bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                {language === 'ar' ? 'جلسة تركيز وتوقيت مباشر :' : language === 'fr' ? 'Session de Concentration :' : 'Live Focus Session :'}
              </span>

              {/* Start / Pause Focus Stopwatch */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-toggle-focus-session"
                  onClick={() => {
                    setIsFocusActive((prev) => !prev);
                    playSoundEffect('tap');
                  }}
                  className={`flex-1 py-2 px-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    isFocusActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:brightness-110 text-white'
                  }`}
                >
                  {isFocusActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>{language === 'ar' ? 'إيقاف مؤقت' : language === 'fr' ? 'Pause' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                      <span>{language === 'ar' ? 'ابدأ جلسة تركيز' : language === 'fr' ? 'Démarrer Focus' : 'Start Focus'}</span>
                    </>
                  )}
                </button>

                {secondsStudied > 0 && (
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition-colors cursor-pointer"
                    title={language === 'ar' ? 'إعادة ضبط عداد اليوم' : 'Réinitialiser'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Add Minutes Pills */}
            <div className="pt-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-600 block mb-1">
                {language === 'ar' ? 'إضافة سريعة لدقائق تعلمتها :' : language === 'fr' ? 'Ajout rapide de temps :' : 'Quick Add Study Time :'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAddMinutes(5)}
                  className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all active:scale-95 cursor-pointer text-center"
                >
                  +5 {language === 'ar' ? 'د' : 'm'}
                </button>
                <button
                  onClick={() => handleAddMinutes(10)}
                  className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all active:scale-95 cursor-pointer text-center"
                >
                  +10 {language === 'ar' ? 'د' : 'm'}
                </button>
                <button
                  onClick={() => handleAddMinutes(15)}
                  className="flex-1 py-1 px-1.5 rounded-lg text-[11px] font-black bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all active:scale-95 cursor-pointer text-center"
                >
                  +15 {language === 'ar' ? 'د' : 'm'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: 7-Day Activity Mini-Bars Tracker (3 cols) */}
          <div className="md:col-span-3 bg-white/90 p-4 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ar' ? 'سجل الأسبوع' : language === 'fr' ? '7 Derniers Jours' : 'Last 7 Days'}</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                {past7Days.filter((d) => d.reached).length}/7 {language === 'ar' ? 'أيام' : 'j'}
              </span>
            </div>

            {/* 7 Bars */}
            <div className="flex items-end justify-between gap-1.5 h-16 pt-2">
              {past7Days.map((d, idx) => {
                const heightPercent = Math.min(100, Math.max(12, Math.round((d.mins / goalMinutes) * 100)));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-amber-200 text-[9px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                      {d.mins} {language === 'ar' ? 'د' : 'm'}
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          d.reached
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-500'
                            : d.mins > 0
                            ? 'bg-gradient-to-t from-amber-400 to-amber-300'
                            : 'bg-slate-200'
                        } ${d.isToday ? 'ring-2 ring-amber-400' : ''}`}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-[9px] font-bold ${
                        d.isToday ? 'text-amber-800 font-black' : 'text-slate-500'
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* GOAL REACHED CELEBRATION ALERT MODAL                                      */}
      {/* ========================================================================= */}
      {showCelebrationAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-400 relative text-center space-y-4 animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setShowCelebrationAlert(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Radiant Trophy Badge */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-400/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs inline-block">
                🌟 {language === 'ar' ? 'إنجاز يومي مكتمل' : 'Objectif Validé !'} 🌟
              </span>
              <h3 className="font-arabic font-black text-2xl text-slate-900">
                {language === 'ar'
                  ? 'مُبَارَكٌ! حَقَّقْتَ هَدَفَكَ اليَوْمِيَّ!'
                  : language === 'fr'
                  ? 'Bravo ! Objectif Quotidien Atteint !'
                  : 'Congratulations! Daily Study Goal Reached!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'ar'
                  ? `لقد درست اليوم ${currentMinutes} دقيقة وتجاوزت بنجاح هدفك المحدد (${goalMinutes} دقيقة). الاستمرارية اليومية هي سر إتقان اللغة العربية!`
                  : language === 'fr'
                  ? `Vous avez étudié ${currentMinutes} minutes aujourd'hui, dépassant votre objectif de ${goalMinutes} min. La régularité est la clé de la maîtrise !`
                  : `You studied ${currentMinutes} minutes today, hitting your ${goalMinutes} min goal. Consistency is the secret to mastering Arabic!`}
              </p>
            </div>

            {/* Bonus Rewards */}
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-center justify-around">
              <div className="flex items-center gap-1.5 font-black text-amber-900 text-sm">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>+50 XP {language === 'ar' ? 'نقطة خبرة' : 'Points'}</span>
              </div>
              <div className="w-px h-6 bg-amber-200" />
              <div className="flex items-center gap-1.5 font-black text-emerald-900 text-sm">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>+10 {language === 'ar' ? 'جواهر الضاد' : 'Gemmes'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleClaimBonus}
                disabled={bonusClaimed}
                className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 active:scale-95 text-white shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {bonusClaimed
                    ? language === 'ar'
                      ? 'تم تحصيل المكافأة بنجاح! ✨'
                      : 'Récompense Récupérée ! ✨'
                    : language === 'ar'
                    ? 'تحصيل المكافأة ومتابعة التعلم 🚀'
                    : 'Récupérer la Récompense 🚀'}
                </span>
              </button>

              {/* Increase challenge button */}
              <button
                onClick={() => {
                  handleSetGoal(goalMinutes + 10);
                  setShowCelebrationAlert(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-slate-700 bg-white hover:bg-amber-50 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>🔥</span>
                <span>
                  {language === 'ar'
                    ? `رفع التحدي اليوم بـ +10 دقائق (${goalMinutes + 10} دقيقة)`
                    : `Ajouter +10 min au défi (${goalMinutes + 10} min)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SETTINGS / CHANGE GOAL MODAL                                              */}
      {/* ========================================================================= */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 relative text-right space-y-4" dir="rtl">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-700" />
                <h3 className="font-arabic font-black text-lg text-slate-900">
                  {language === 'ar' ? 'تحديد هدف الدراسة اليومي' : 'Définir l\'objectif quotidien'}
                </h3>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'اختر عدد الدقائق التي ترغب في تكريسها يومياً لتعلم العربية وقراءة النصوص والأناشيد. سننبهك فور وصولك للهدف!'
                : 'Choisissez le nombre de minutes quotidiennes dédiées à l\'arabe. Une alerte se déclenchera dès l\'objectif atteint !'}
            </p>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 block">
                {language === 'ar' ? 'الأهداف المقترحة :' : 'Objectifs recommandés :'}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {PRESET_GOALS.map((preset) => {
                  const isSelected = goalMinutes === preset;
                  return (
                    <button
                      key={preset}
                      onClick={() => handleSetGoal(preset)}
                      className={`p-2.5 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm ring-2 ring-emerald-500'
                          : 'bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200'
                      }`}
                    >
                      <span>{preset} {language === 'ar' ? 'دقيقة' : 'min'}</span>
                      {preset === 20 && (
                        <span className="text-[9px] text-amber-300 font-normal">
                          {language === 'ar' ? '(المثالي)' : '(Idéal)'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-1.5 pt-2 border-t border-amber-100">
              <span className="text-[11px] font-bold text-slate-500 block">
                {language === 'ar' ? 'أو أدخل وقتاً مخصصاً (بالدقائق) :' : 'Ou durée personnalisée (en min) :'}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customGoalInput}
                  onChange={(e) => setCustomGoalInput(e.target.value)}
                  placeholder="مثال: 25"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/20 text-center font-bold text-sm outline-none"
                />
                <button
                  onClick={() => {
                    const parsed = parseInt(customGoalInput, 10);
                    if (parsed && parsed > 0 && parsed <= 300) {
                      handleSetGoal(parsed);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ' : 'Appliquer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
