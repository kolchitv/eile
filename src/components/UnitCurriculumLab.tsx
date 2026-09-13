import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { UNIT_1_FAMILY_COMMUNITY, SessionData, DialogueSentence } from '../data/unitCurriculumData';
import { speakArabic, playSoundEffect, stopAudio } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  Music,
  Edit3,
  User,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Download,
  Flame,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UnitCurriculumLabProps {
  language: SupportedLanguage;
  onEarnXp?: (amount: number) => void;
  onBackToRoadmap?: () => void;
}

export const UnitCurriculumLab: React.FC<UnitCurriculumLabProps> = ({
  language,
  onEarnXp,
  onBackToRoadmap,
}) => {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0);
  const [activeComponentTab, setActiveComponentTab] = useState<
    'dialogue' | 'oral_comp' | 'speaking' | 'reading' | 'writing' | 'eval'
  >('dialogue');

  // Audio playing states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentlyPlayingSentenceId, setCurrentlyPlayingSentenceId] = useState<string | null>(null);
  const [audioSpeedSlow, setAudioSpeedSlow] = useState<boolean>(false);

  // Memorization Mode State
  const [isMemorizationMode, setIsMemorizationMode] = useState<boolean>(false);
  const [maskedSentenceIds, setMaskedSentenceIds] = useState<Record<string, boolean>>({});
  const [memorizedSentences, setMemorizedSentences] = useState<Record<string, boolean>>({});
  const [currentMemorizationStep, setCurrentMemorizationStep] = useState<number>(0);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSpeech, setRecordedSpeech] = useState<string>('');
  const [speechMatchScore, setSpeechMatchScore] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Oral comprehension interactive task state
  const [selectedActionTarget, setSelectedActionTarget] = useState<string | null>(null);
  const [isActionTaskCorrect, setIsActionTaskCorrect] = useState<boolean | null>(null);

  // Reading Quiz state
  const [readingQuizAnswer, setReadingQuizAnswer] = useState<number | null>(null);
  const [readingQuizSubmitted, setReadingQuizSubmitted] = useState<boolean>(false);

  // Student Identity Card State (Fiche d'identité)
  const [identityCardData, setIdentityCardData] = useState({
    fullName: 'عُمَرُ المَنْصُورِي',
    age: '7 سَنَوَاتٍ',
    birthPlace: 'مَدِينَةُ الرِّبَاطِ',
    residence: 'حَيُّ النَّخِيلِ',
    country: 'المَغْرِبُ',
  });
  const [savedIdentityCard, setSavedIdentityCard] = useState<boolean>(false);

  // Current session data
  const session: SessionData = UNIT_1_FAMILY_COMMUNITY.sessions[selectedSessionIndex] || UNIT_1_FAMILY_COMMUNITY.sessions[0];
  const isEvaluationSession = selectedSessionIndex === 5;

  // Speech Recognition Init
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'ar-SA';
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; i++) {
          full += event.results[i][0].transcript + ' ';
        }
        setRecordedSpeech(full.trim());
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Stop audio on unmount or session change
  useEffect(() => {
    stopAudio();
    setIsPlayingAudio(false);
    setCurrentlyPlayingSentenceId(null);
    setReadingQuizAnswer(null);
    setReadingQuizSubmitted(false);
    setSelectedActionTarget(null);
    setIsActionTaskCorrect(null);
    setRecordedSpeech('');
    setSpeechMatchScore(null);
  }, [selectedSessionIndex, activeComponentTab]);

  // Audio Play helper
  const handlePlaySentence = async (text: string, id: string) => {
    playSoundEffect('tap');
    if (currentlyPlayingSentenceId === id && isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
      setCurrentlyPlayingSentenceId(null);
      return;
    }

    stopAudio();
    setIsPlayingAudio(true);
    setCurrentlyPlayingSentenceId(id);

    try {
      await speakArabic(text, 0.88, audioSpeedSlow);
    } finally {
      setIsPlayingAudio(false);
      setCurrentlyPlayingSentenceId(null);
    }
  };

  // Play full dialogue in sequence
  const handlePlayFullDialogue = async (sentences: DialogueSentence[]) => {
    playSoundEffect('tap');
    if (isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
      setCurrentlyPlayingSentenceId(null);
      return;
    }

    setIsPlayingAudio(true);
    for (const item of sentences) {
      setCurrentlyPlayingSentenceId(item.id);
      await speakArabic(item.arabic, 0.88, audioSpeedSlow);
      await new Promise((r) => setTimeout(r, 650));
    }
    setIsPlayingAudio(false);
    setCurrentlyPlayingSentenceId(null);
    playSoundEffect('correct');
  };

  // Toggle mask state for sentence
  const toggleMaskSentence = (id: string) => {
    playSoundEffect('tap');
    setMaskedSentenceIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Mark sentence as memorized
  const toggleMemorized = (id: string) => {
    playSoundEffect('levelup');
    setMemorizedSentences((prev) => {
      const nextState = !prev[id];
      if (nextState && onEarnXp) {
        onEarnXp(15);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      return { ...prev, [id]: nextState };
    });
  };

  // Speech recording for learner testing
  const toggleRecording = (targetText: string) => {
    playSoundEffect('tap');
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);

      // Score calculation
      if (recordedSpeech) {
        const cleanTarget = targetText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').trim();
        const cleanRecorded = recordedSpeech.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').trim();
        const matches = cleanTarget.includes(cleanRecorded) || cleanRecorded.includes(cleanTarget) || cleanRecorded.length >= 3;
        setSpeechMatchScore(matches ? 95 : 70);
        if (matches) {
          playSoundEffect('correct');
          if (onEarnXp) onEarnXp(20);
        }
      }
    } else {
      setRecordedSpeech('');
      setSpeechMatchScore(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch {
          setIsRecording(false);
        }
      } else {
        // Mock speech test if browser doesn't support Web Speech API
        setIsRecording(true);
        setTimeout(() => {
          setRecordedSpeech(targetText);
          setIsRecording(false);
          setSpeechMatchScore(100);
          playSoundEffect('correct');
          if (onEarnXp) onEarnXp(20);
        }, 3000);
      }
    }
  };

  // Handle classroom instruction test click
  const handleInstructionTaskClick = (option: string) => {
    playSoundEffect('tap');
    setSelectedActionTarget(option);
    const isCorrect = option === session.oralComprehension.practiceTask.correctAnswer;
    setIsActionTaskCorrect(isCorrect);
    if (isCorrect) {
      playSoundEffect('correct');
      if (onEarnXp) onEarnXp(25);
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      playSoundEffect('wrong');
    }
  };

  // Handle Reading Quiz
  const handleReadingQuizSubmit = (index: number) => {
    playSoundEffect('tap');
    setReadingQuizAnswer(index);
    setReadingQuizSubmitted(true);
    if (index === session.readingComprehension.quiz.correctIndex) {
      playSoundEffect('correct');
      if (onEarnXp) onEarnXp(20);
    } else {
      playSoundEffect('wrong');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner - Official Syllabus Distribution */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {UNIT_1_FAMILY_COMMUNITY.level}
              </span>
              <span className="bg-emerald-700/80 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                {UNIT_1_FAMILY_COMMUNITY.academicYear}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight font-arabic">
              {UNIT_1_FAMILY_COMMUNITY.themeAr}
            </h1>
            <p className="text-emerald-200 text-sm font-medium font-sans">
              {UNIT_1_FAMILY_COMMUNITY.themeFr}
            </p>
          </div>

          {/* Quick Sound Speed Control */}
          <div className="flex items-center gap-2 bg-emerald-950/60 p-2 rounded-2xl border border-emerald-600/40 backdrop-blur-md">
            <span className="text-xs font-bold text-amber-300 px-2">سرعة الصوت:</span>
            <button
              onClick={() => {
                setAudioSpeedSlow(false);
                playSoundEffect('tap');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                !audioSpeedSlow
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              عادي 1.0x
            </button>
            <button
              onClick={() => {
                setAudioSpeedSlow(true);
                playSoundEffect('tap');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                audioSpeedSlow
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              بطيء للأطفال 0.7x 🐢
            </button>
          </div>
        </div>

        {/* Sessions Stepper Bar (الحصص من 1 إلى 6) */}
        <div className="mt-6 pt-4 border-t border-emerald-700/60 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {UNIT_1_FAMILY_COMMUNITY.sessions.map((s, idx) => {
            const isSelected = selectedSessionIndex === idx;
            return (
              <button
                key={s.sessionNumber}
                onClick={() => {
                  setSelectedSessionIndex(idx);
                  playSoundEffect('tap');
                }}
                className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 border-amber-300 font-black shadow-lg scale-102 ring-2 ring-amber-300/60'
                    : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-100 border-emerald-700/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/10">
                    الحصة {s.sessionNumber}
                  </span>
                  <span className="text-lg font-black bg-white/20 w-7 h-7 rounded-full flex items-center justify-center">
                    {s.targetLetter.letter}
                  </span>
                </div>
                <span className="text-xs font-bold truncate leading-snug">
                  {s.targetLetter.letterNameAr}
                </span>
              </button>
            );
          })}

          {/* Hessa 6: Evaluation */}
          <button
            onClick={() => {
              setSelectedSessionIndex(5);
              playSoundEffect('tap');
            }}
            className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between gap-1.5 border ${
              selectedSessionIndex === 5
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border-amber-300 font-black shadow-lg scale-102 ring-2 ring-amber-300/60'
                : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-100 border-emerald-700/40'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/10">
                الحصة 6
              </span>
              <span className="text-base">🏆</span>
            </div>
            <span className="text-xs font-bold truncate">تقويم ودعم</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!isEvaluationSession ? (
        <div className="space-y-6">
          {/* Sub-Components Nav Tabs (المكونات الخمسة المنهجية) */}
          <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveComponentTab('dialogue');
                  playSoundEffect('tap');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeComponentTab === 'dialogue'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>💬</span>
                <span>التفاعل الشفهي (حوارات التعارف)</span>
                <span className="bg-amber-300 text-emerald-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  جمل قصيرة للحفظ
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveComponentTab('oral_comp');
                  playSoundEffect('tap');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeComponentTab === 'oral_comp'
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>👂</span>
                <span>فهم المسموع (تعليمات القسم)</span>
              </button>

              <button
                onClick={() => {
                  setActiveComponentTab('speaking');
                  playSoundEffect('tap');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeComponentTab === 'speaking'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>🎙️</span>
                <span>الاسترسال في الكلام + النشيد</span>
              </button>

              <button
                onClick={() => {
                  setActiveComponentTab('reading');
                  playSoundEffect('tap');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeComponentTab === 'reading'
                    ? 'bg-indigo-700 text-white shadow-md'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>📖</span>
                <span>فهم المكتوب (القراءة)</span>
              </button>

              <button
                onClick={() => {
                  setActiveComponentTab('writing');
                  playSoundEffect('tap');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeComponentTab === 'writing'
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'text-slate-700 hover:bg-amber-50'
                }`}
              >
                <span>✍️</span>
                <span>الكتابة وبطاقة التعريف</span>
              </button>
            </div>

            {/* Target Letter Badge */}
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-amber-900">حرف الحصة:</span>
              <span className="text-xl font-black text-amber-700 font-arabic">
                {session.targetLetter.letter}
              </span>
              <span className="text-xs text-slate-500 font-sans">
                ({session.targetLetter.letterNameFr})
              </span>
            </div>
          </div>

          {/* ===================== 1. INTERACTION ORALE (DIALOGUE PHRASE PAR PHRASE) ===================== */}
          {activeComponentTab === 'dialogue' && (
            <div className="space-y-6">
              {/* Dialogue Header Card */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
                      Interaction orale
                    </span>
                    <h2 className="text-xl font-black text-slate-900 font-arabic">
                      {session.interactionOrale.titleAr}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm">
                    {session.interactionOrale.objectiveFr}
                  </p>
                </div>

                {/* Master Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePlayFullDialogue(session.interactionOrale.dialogue)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                      isPlayingAudio && !currentlyPlayingSentenceId
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingAudio ? 'إيقاف الصوت' : 'استمع للحوار كاملاً 🔊'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMemorizationMode(!isMemorizationMode);
                      playSoundEffect('tap');
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border ${
                      isMemorizationMode
                        ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md font-black ring-2 ring-amber-300'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{isMemorizationMode ? 'وضع الحفظ مُفعّل ✨' : 'تفعيل وضع الحفظ والتسميع 🧠'}</span>
                  </button>
                </div>
              </div>

              {/* Memorization Guide Card if Enabled */}
              {isMemorizationMode && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-3xl border-2 border-amber-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <h3 className="text-base font-bold text-amber-950 font-arabic">
                          طريقة الحفظ الميسرة: جمل قصيرة خطوة بخطوة
                        </h3>
                        <p className="text-xs text-amber-800 font-sans">
                          Répétez chaque phrase 3 fois, cliquez sur l'œil 👁️ pour masquer les mots et tester votre mémoire !
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-black text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                        المحفوظ: {Object.values(memorizedSentences).filter(Boolean).length} / {session.interactionOrale.dialogue.length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                    {session.interactionOrale.memorizationSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white/90 p-2.5 rounded-xl border border-amber-200 text-xs font-bold text-slate-800 flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dialogue Sentences List (Sentence by Sentence) */}
              <div className="space-y-3">
                {session.interactionOrale.dialogue.map((item, index) => {
                  const isPlaying = currentlyPlayingSentenceId === item.id;
                  const isMasked = maskedSentenceIds[item.id];
                  const isDone = memorizedSentences[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        isPlaying
                          ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/80 shadow-md scale-[1.01]'
                          : isDone
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Speaker & Sentence Info */}
                        <div className="flex items-start gap-3.5 flex-1">
                          <span className="text-3xl p-2 bg-slate-100 rounded-2xl shrink-0 shadow-inner">
                            {item.speakerAvatar}
                          </span>
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 font-arabic">
                                {item.speaker}
                              </span>
                              <span className="text-[11px] text-slate-500 font-sans">
                                ({item.speakerRoleFr})
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                                الجملة {index + 1}
                              </span>
                            </div>

                            {/* Arabic Sentence (with Tashkeel and optional Masking for Memorization) */}
                            <div className="py-1">
                              {isMasked ? (
                                <p className="text-xl sm:text-2xl font-black text-slate-400 font-arabic tracking-wide filter blur-[4px] select-none">
                                  {item.arabic}
                                </p>
                              ) : (
                                <p className="text-xl sm:text-2xl font-black text-emerald-900 font-arabic tracking-wide leading-relaxed">
                                  {item.arabic}
                                </p>
                              )}
                            </div>

                            {/* Transliteration & French Translation */}
                            <div className="space-y-0.5 pt-0.5">
                              <p className="text-xs font-semibold text-amber-900 font-mono" dir="ltr">
                                {item.translitFr}
                              </p>
                              <p className="text-xs text-slate-600 font-sans" dir="ltr">
                                🇫🇷 {item.french}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Buttons for Each Sentence */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {/* Play Sentence Audio */}
                          <button
                            onClick={() => handlePlaySentence(item.arabic, item.id)}
                            className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                              isPlaying
                                ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-400'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 shadow-sm'
                            }`}
                            title="استمع للجملة"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>

                          {/* Mask/Unmask for Memory Testing */}
                          <button
                            onClick={() => toggleMaskSentence(item.id)}
                            className={`p-3 rounded-2xl transition-all ${
                              isMasked
                                ? 'bg-amber-400 text-slate-950 font-bold'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title={isMasked ? 'إظهار الكلمات' : 'إخفاء الكلمات للتسميع'}
                          >
                            {isMasked ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>

                          {/* Student Record & Repeat Voice */}
                          <button
                            onClick={() => toggleRecording(item.arabic)}
                            className={`p-3 rounded-2xl transition-all ${
                              isRecording
                                ? 'bg-red-600 text-white animate-ping'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-900'
                            }`}
                            title="سجّل صوتك وردد الجملة"
                          >
                            <Mic className="w-5 h-5" />
                          </button>

                          {/* Memorized Checkbox */}
                          <button
                            onClick={() => toggleMemorized(item.id)}
                            className={`px-3 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isDone ? 'حفظتُها ✓' : 'حفظ'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Microphone Feedback Snippet */}
                      {recordedSpeech && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between bg-white/80 p-3 rounded-2xl">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">صوتك المسجل:</span>
                            <span className="text-sm font-black text-rose-700 font-arabic">
                              « {recordedSpeech} »
                            </span>
                          </div>
                          {speechMatchScore && (
                            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-lg">
                              درجة النطق: {speechMatchScore}% ممتاز! ⭐
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================== 2. COMPRÉHENSION DE L'ORAL (CONSIGNES DE CLASSE) ===================== */}
          {activeComponentTab === 'oral_comp' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-3xl border border-teal-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-100 text-teal-800 text-xs font-black px-2.5 py-1 rounded-lg">
                    Compréhension de l'oral
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-arabic">
                    {session.oralComprehension.titleAr}
                  </h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {session.oralComprehension.titleFr}
                </p>
              </div>

              {/* Classroom Instructions Visual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {session.oralComprehension.instructions.map((inst) => (
                  <div
                    key={inst.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl p-3 bg-teal-50 rounded-2xl group-hover:scale-110 transition-transform">
                        {inst.icon}
                      </span>
                      <button
                        onClick={() => handlePlaySentence(inst.arabic, inst.id)}
                        className="p-2.5 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded-xl transition-all"
                        title="استمع للتعليمة"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-teal-900 font-arabic">
                        {inst.arabic}
                      </h3>
                      <p className="text-xs font-bold text-amber-900 font-mono" dir="ltr">
                        {inst.translitFr}
                      </p>
                      <p className="text-xs text-slate-600 font-sans" dir="ltr">
                        🇫🇷 {inst.french}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-1 font-sans">
                        {inst.descriptionFr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Practice Task (Click / Action Simulation) */}
              <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white p-6 rounded-3xl shadow-lg border border-teal-700/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                      تطبيق تفاعلي فوري
                    </span>
                    <h3 className="text-lg font-black text-amber-200 font-arabic">
                      {session.oralComprehension.practiceTask.questionAr}
                    </h3>
                    <p className="text-xs text-teal-200 font-sans">
                      {session.oralComprehension.practiceTask.questionFr}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handlePlaySentence(session.oralComprehension.practiceTask.actionInstruction, 'task-audio')
                    }
                    className="p-3 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-2xl font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="text-xs font-black">اسمع التعليمة 🔊</span>
                  </button>
                </div>

                {/* Target Word Interactive Options */}
                <div className="bg-teal-950/60 p-6 rounded-2xl border border-teal-600/40 text-center space-y-4">
                  <p className="text-xs text-teal-300 font-bold">
                    انقر على المقطع الصحيح لتطبيق التعليمة:
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {session.oralComprehension.practiceTask.options.map((opt, i) => {
                      const isSelected = selectedActionTarget === opt;
                      const isCorrect = isActionTaskCorrect && isSelected;
                      const isWrong = isActionTaskCorrect === false && isSelected;

                      return (
                        <button
                          key={i}
                          onClick={() => handleInstructionTaskClick(opt)}
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-3xl sm:text-4xl font-black font-arabic flex items-center justify-center transition-all border-2 shadow-lg ${
                            isCorrect
                              ? 'bg-emerald-500 border-emerald-300 text-white scale-110 ring-4 ring-emerald-300 animate-bounce'
                              : isWrong
                              ? 'bg-rose-600 border-rose-400 text-white'
                              : 'bg-white/10 hover:bg-white/20 border-teal-500/50 text-amber-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isActionTaskCorrect !== null && (
                    <div className="pt-2">
                      {isActionTaskCorrect ? (
                        <p className="text-emerald-300 font-black text-sm">
                          🎉 أحسنت صنعاً! قمت بتنفيذ التعليمة بشكل ممتاز (+25 XP)
                        </p>
                      ) : (
                        <p className="text-rose-300 font-bold text-xs">
                          حاول مرة أخرى! انتبه لحرف الحصة المطلوب.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== 3. PARLER EN CONTINU & CHANT DE L'ALPHABET ===================== */}
          {activeComponentTab === 'speaking' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-lg">
                    Parler en continu
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-arabic">
                    {session.continuousSpeaking.titleAr}
                  </h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {session.continuousSpeaking.titleFr}
                </p>
              </div>

              {/* Continuous Speaking Speech Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-full">
                      نص التقديم المسترسل (سلسلة واحدة)
                    </span>
                    <h3 className="text-lg font-black text-slate-900 font-arabic">
                      {session.continuousSpeaking.promptAr}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handlePlaySentence(session.continuousSpeaking.fullSpeechAr, 'full-speech')
                      }
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>استمع للنموذج 🔊</span>
                    </button>

                    <button
                      onClick={() => toggleRecording(session.continuousSpeaking.fullSpeechAr)}
                      className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400'
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-900'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isRecording ? 'جارٍ التسجيل...' : 'تحدَّ نفسك وسجّل 🎙️'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-inner">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-950 font-arabic leading-loose tracking-wide">
                    « {session.continuousSpeaking.fullSpeechAr} »
                  </p>
                  <p className="text-xs font-semibold text-amber-900 font-mono mt-3" dir="ltr">
                    {session.continuousSpeaking.fullSpeechTranslitFr}
                  </p>
                  <p className="text-xs text-slate-600 font-sans mt-1" dir="ltr">
                    🇫🇷 {session.continuousSpeaking.fullSpeechFr}
                  </p>
                </div>

                {/* Key Guidance Points */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">معايير الطلاقة الشفهية:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {session.continuousSpeaking.keyPointsFr.map((pt, i) => (
                      <div
                        key={i}
                        className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-xs text-slate-700 flex items-center gap-2 font-sans"
                        dir="ltr"
                      >
                        <span className="text-emerald-600 font-black">✓</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chant de l'alphabet (نشيد حروف الهجاء) */}
              {session.continuousSpeaking.alphabetSongExcerpt && (
                <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-600/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl p-2 bg-white/10 rounded-2xl">🎵</span>
                      <div>
                        <h3 className="text-xl font-black text-amber-200 font-arabic">
                          {session.continuousSpeaking.alphabetSongExcerpt.titleAr}
                        </h3>
                        <p className="text-xs text-emerald-200 font-sans">
                          {session.continuousSpeaking.alphabetSongExcerpt.lyricsFr}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handlePlaySentence(
                          session.continuousSpeaking.alphabetSongExcerpt!.lyricsAr.join('، '),
                          'song-audio'
                        )
                      }
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>أنشد معي 🎶</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {session.continuousSpeaking.alphabetSongExcerpt.lyricsAr.map((line, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 text-center"
                      >
                        <p className="text-xl font-black text-amber-100 font-arabic">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================== 4. COMPRÉHENSION DE L'ÉCRIT / LECTURE ===================== */}
          {activeComponentTab === 'reading' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-2.5 py-1 rounded-lg">
                    Lecture & Compréhension
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-arabic">
                    {session.readingComprehension.titleAr}
                  </h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {session.readingComprehension.titleFr}
                </p>
              </div>

              {/* Reading Passage Card */}
              <div className="bg-indigo-50/70 p-6 rounded-3xl border-2 border-indigo-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 bg-indigo-200 px-3 py-1 rounded-full">
                    جملة القراءة للحصة
                  </span>
                  <button
                    onClick={() =>
                      handlePlaySentence(session.readingComprehension.readingPassageAr, 'passage-audio')
                    }
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>قراءة صوتية 🔊</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-indigo-200 text-center shadow-inner">
                  <p className="text-2xl sm:text-3xl font-black text-indigo-950 font-arabic leading-loose tracking-wider">
                    {session.readingComprehension.readingPassageAr}
                  </p>
                  <p className="text-xs text-slate-500 font-sans mt-2" dir="ltr">
                    🇫🇷 {session.readingComprehension.readingPassageFr}
                  </p>
                </div>
              </div>

              {/* Syllables Focus (حركات قصيرة وطويلة) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-arabic flex items-center gap-2">
                  <span>🎯</span>
                  <span>المقاطع الصوتية المركزة مع حركات الحرف ({session.targetLetter.letterNameAr}):</span>
                </h3>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {session.readingComprehension.syllablesFocus.map((syl, i) => (
                    <button
                      key={i}
                      onClick={() => handlePlaySentence(syl, `syl-${i}`)}
                      className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl text-2xl font-black text-amber-950 font-arabic flex flex-col items-center justify-center gap-1 shadow-2xs hover:scale-105 transition-all"
                    >
                      <span>{syl}</span>
                      <span className="text-[10px] text-amber-700">🔊</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Words to Read List */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {session.readingComprehension.wordsToRead.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between gap-2 text-center"
                  >
                    <p className="text-2xl font-black text-slate-900 font-arabic">
                      {item.word}
                    </p>
                    <div>
                      <p className="text-xs font-bold text-indigo-900 font-mono" dir="ltr">
                        {item.translit}
                      </p>
                      <p className="text-xs text-slate-500 font-sans" dir="ltr">
                        {item.french}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePlaySentence(item.word, `read-word-${i}`)}
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 mt-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>نطق</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Instant Reading Quiz */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg border border-indigo-700/50 space-y-4">
                <div className="space-y-1">
                  <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                    سؤال الفهم القرائي
                  </span>
                  <h3 className="text-lg font-black text-amber-200 font-arabic">
                    {session.readingComprehension.quiz.questionAr}
                  </h3>
                  <p className="text-xs text-indigo-200 font-sans">
                    {session.readingComprehension.quiz.questionFr}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {session.readingComprehension.quiz.options.map((opt, i) => {
                    const isSelected = readingQuizAnswer === i;
                    const isCorrect = i === session.readingComprehension.quiz.correctIndex;

                    return (
                      <button
                        key={i}
                        onClick={() => handleReadingQuizSubmit(i)}
                        className={`p-4 rounded-2xl text-lg font-black font-arabic transition-all border ${
                          readingQuizSubmitted && isCorrect
                            ? 'bg-emerald-500 border-emerald-300 text-white scale-102 ring-2 ring-emerald-300'
                            : readingQuizSubmitted && isSelected && !isCorrect
                            ? 'bg-rose-600 border-rose-400 text-white'
                            : 'bg-white/10 hover:bg-white/20 border-indigo-500/40 text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================== 5. ÉCRITURE & FICHE D'IDENTITÉ ===================== */}
          {activeComponentTab === 'writing' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-800 text-xs font-black px-2.5 py-1 rounded-lg">
                    Écriture & Fiche d'identité
                  </span>
                  <h2 className="text-xl font-black text-slate-900 font-arabic">
                    {session.writing.titleAr}
                  </h2>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">
                  {session.writing.titleFr}
                </p>
              </div>

              {/* Copy Sentence Practice */}
              <div className="bg-rose-50/70 p-6 rounded-3xl border-2 border-rose-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 bg-rose-200 px-3 py-1 rounded-full">
                    نموذج النقل والخط
                  </span>
                  <button
                    onClick={() => handlePlaySentence(session.writing.copySentenceAr, 'write-audio')}
                    className="p-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>استمع</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-rose-300 text-center">
                  <p className="text-3xl sm:text-4xl font-black text-rose-950 font-arabic tracking-wider leading-relaxed">
                    {session.writing.copySentenceAr}
                  </p>
                  <p className="text-xs text-slate-500 font-sans mt-2" dir="ltr">
                    🇫🇷 {session.writing.copySentenceFr}
                  </p>
                </div>
              </div>

              {/* Letter Tracing Forms Practice */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-arabic">
                  رسم أشكال الحرف ومواضعه:
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {session.writing.letterPractice.map((ltr, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1"
                    >
                      <p className="text-2xl font-black text-slate-900 font-arabic">
                        {ltr}
                      </p>
                      <span className="text-[10px] text-slate-400 font-sans">تدرّب</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Identity Card Creator (بطاقة التعريف الشخصية التفاعلية) */}
              <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-amber-600/50 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-3 bg-amber-400 text-amber-950 rounded-2xl font-black">
                      🪪
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-amber-200 font-arabic">
                        بِطَاقَةُ التَّعْرِيفِ الشَّخْصِيَّةِ لِلتِّلْمِيذِ (Fiche d'identité)
                      </h3>
                      <p className="text-xs text-amber-300 font-sans">
                        Remplissez votre fiche personnelle au fur et à mesure des séances !
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSavedIdentityCard(true);
                      playSoundEffect('correct');
                      if (onEarnXp) onEarnXp(30);
                      confetti({
                        particleCount: 50,
                        spread: 80,
                        origin: { y: 0.6 },
                      });
                    }}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>حفظ واعتماد البطاقة ⭐</span>
                  </button>
                </div>

                {/* Identity Card Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>👤</span>
                      <span>الاسْمُ الكَامِلُ (Nom & Prénom):</span>
                    </label>
                    <input
                      type="text"
                      value={identityCardData.fullName}
                      onChange={(e) =>
                        setIdentityCardData({ ...identityCardData, fullName: e.target.value })
                      }
                      className="w-full bg-black/40 border border-amber-400/40 rounded-xl px-3 py-2 text-sm font-bold text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Age */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🎂</span>
                      <span>العُمْرُ / السِّنُّ (Âge):</span>
                    </label>
                    <input
                      type="text"
                      value={identityCardData.age}
                      onChange={(e) =>
                        setIdentityCardData({ ...identityCardData, age: e.target.value })
                      }
                      className="w-full bg-black/40 border border-amber-400/40 rounded-xl px-3 py-2 text-sm font-bold text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Birthplace */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🏥</span>
                      <span>مَكَانُ الوِلَادَةِ (Lieu de naissance):</span>
                    </label>
                    <input
                      type="text"
                      value={identityCardData.birthPlace}
                      onChange={(e) =>
                        setIdentityCardData({ ...identityCardData, birthPlace: e.target.value })
                      }
                      className="w-full bg-black/40 border border-amber-400/40 rounded-xl px-3 py-2 text-sm font-bold text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Residence */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🏠</span>
                      <span>مَكَانُ السَّكَنِ (Adresse / Quartier):</span>
                    </label>
                    <input
                      type="text"
                      value={identityCardData.residence}
                      onChange={(e) =>
                        setIdentityCardData({ ...identityCardData, residence: e.target.value })
                      }
                      className="w-full bg-black/40 border border-amber-400/40 rounded-xl px-3 py-2 text-sm font-bold text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  {/* Country */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🚩</span>
                      <span>البَلَدُ وَالانْتِمَاءُ (Pays / Nationalité):</span>
                    </label>
                    <input
                      type="text"
                      value={identityCardData.country}
                      onChange={(e) =>
                        setIdentityCardData({ ...identityCardData, country: e.target.value })
                      }
                      className="w-full bg-black/40 border border-amber-400/40 rounded-xl px-3 py-2 text-sm font-bold text-white font-arabic focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Identity Speech Generator from Form */}
                <div className="bg-amber-400/10 p-4 rounded-2xl border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-amber-300">
                      بيانك الشفهي المُولَّد من بطاقتك:
                    </span>
                    <p className="text-base font-bold text-amber-100 font-arabic mt-1">
                      « السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي {identityCardData.fullName}، عُمْرِي{' '}
                      {identityCardData.age}، وُلِدْتُ بِـ{identityCardData.birthPlace}، أَسْكُنُ فِي{' '}
                      {identityCardData.residence}، وَأَنَا مِنْ {identityCardData.country}. »
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handlePlaySentence(
                        `السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي ${identityCardData.fullName}، عُمْرِي ${identityCardData.age}، وُلِدْتُ بِـ${identityCardData.birthPlace}، أَسْكُنُ فِي ${identityCardData.residence}، وَأَنَا مِنْ ${identityCardData.country}.`,
                        'custom-id-speech'
                      )
                    }
                    className="p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>نطق بطاقتي 🔊</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ===================== HESSA 6: CONSOLIDATION & ÉVALUATION ===================== */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              <div>
                <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                  Bilan & Évaluation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-arabic mt-1">
                  {UNIT_1_FAMILY_COMMUNITY.consolidationSession.titleAr}
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm font-sans">
                  {UNIT_1_FAMILY_COMMUNITY.consolidationSession.descriptionFr}
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task 1: Q&A Match */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h3 className="text-base font-bold text-slate-900 font-arabic">
                  صِلْ كُلَّ سُؤَالٍ بِالجَوَابِ المُنَاسِبِ لَهُ:
                </h3>
              </div>

              <div className="space-y-2">
                {UNIT_1_FAMILY_COMMUNITY.consolidationSession.evaluationTasks[0].items.map(
                  (item: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-emerald-900 font-arabic">
                          {item.q}
                        </span>
                        <button
                          onClick={() => handlePlaySentence(item.q, `eval-q-${i}`)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-amber-950 font-arabic">
                          {item.a}
                        </span>
                        <button
                          onClick={() => handlePlaySentence(item.a, `eval-a-${i}`)}
                          className="p-1.5 text-slate-500 hover:text-amber-700"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Task 2: Classroom Instructions Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h3 className="text-base font-bold text-slate-900 font-arabic">
                  مَطْبَقُ تَعْلِيمَاتِ القِسْمِ الشَّامِلَةِ:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {UNIT_1_FAMILY_COMMUNITY.consolidationSession.evaluationTasks[1].items.map(
                  (inst: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-black text-sm text-teal-950 font-arabic">
                          {inst.instruction}
                        </p>
                        <p className="text-[11px] text-teal-700 font-sans">{inst.french}</p>
                      </div>
                      <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs">
                        {inst.symbol}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Full Speaking Graduation Card */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl text-center space-y-4 border border-emerald-600">
            <span className="text-5xl">🎓</span>
            <div className="space-y-1">
              <h3 className="text-2xl font-black font-arabic text-amber-200">
                مُبَارَكٌ! لَقَدْ أَتْمَمْتَ جَمِيعَ كِفَايَاتِ الوَحْدَةِ الأُولَى (المَجَالُ الثَّانِي)
              </h3>
              <p className="text-sm text-emerald-100 font-sans max-w-xl mx-auto">
                Félicitations ! Vous maîtrisez les 5 composantes fondamentales : salutations, âge, lieu de naissance, lieu de résidence, nationalité et les consignes de classe.
              </p>
            </div>

            <button
              onClick={() => {
                if (onEarnXp) onEarnXp(100);
                confetti({
                  particleCount: 80,
                  spread: 100,
                  origin: { y: 0.5 },
                });
                playSoundEffect('levelup');
              }}
              className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black text-sm shadow-xl transition-all scale-105"
            >
              استلام شارة إتقان الوحدة الأولى (+100 XP) ⭐
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
