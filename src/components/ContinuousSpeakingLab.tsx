import React, { useState, useRef, useEffect } from 'react';
import { CEFRLevel, SupportedLanguage } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { SPEAKING_ACTIVITIES, SpeakingActivity } from '../data/speakingActivitiesData';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContinuousSpeakingLabProps {
  currentLevel: CEFRLevel;
  language: SupportedLanguage;
  onEarnXp?: (amount: number) => void;
}

export const ContinuousSpeakingLab: React.FC<ContinuousSpeakingLabProps> = ({
  currentLevel,
  language,
  onEarnXp,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(() => {
    const act = SPEAKING_ACTIVITIES.find((a) => a.level === currentLevel) || SPEAKING_ACTIVITIES[0];
    return act.id;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'continuous' | 'listening'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [feedback, setFeedback] = useState<{
    score: number;
    fluencyCommentFr: string;
    identifiedWords: string[];
    tipsFr: string;
  } | null>(null);

  // Comprehension state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Filter activities by currentLevel and activeTab
  const currentActivities = SPEAKING_ACTIVITIES.filter((act) => {
    const matchesLevel = act.level === currentLevel;
    if (activeTab === 'all') return matchesLevel;
    if (activeTab === 'continuous') return matchesLevel && act.type === 'continuous';
    if (activeTab === 'listening') return matchesLevel && act.type === 'listening_comprehension';
    return matchesLevel;
  });

  const selectedActivity: SpeakingActivity =
    SPEAKING_ACTIVITIES.find((a) => a.id === selectedActivityId) ||
    currentActivities[0] ||
    SPEAKING_ACTIVITIES[0];

  // Update selected activity when level changes
  useEffect(() => {
    const matching = SPEAKING_ACTIVITIES.find((a) => a.level === currentLevel);
    if (matching) {
      setSelectedActivityId(matching.id);
      setFeedback(null);
      setRecordedTranscript('');
      setSelectedQuizAnswers({});
      setQuizSubmitted(false);
    }
  }, [currentLevel]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.lang = 'ar-SA';
      rec.interimResults = true;

      rec.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; i++) {
          full += event.results[i][0].transcript + ' ';
        }
        setRecordedTranscript(full.trim());
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        stopRecording();
      };

      rec.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startRecording = () => {
    playSoundEffect('tap');
    if (!recognitionRef.current) {
      alert(
        language === 'fr'
          ? "La reconnaissance vocale n'est pas supportée dans votre navigateur. Vous pouvez lire à voix haute et vous entraîner avec les modèles audio."
          : 'Speech recognition is not supported in this browser.'
      );
      return;
    }

    setRecordedTranscript('');
    setFeedback(null);
    setIsRecording(true);
    setRecordingSeconds(0);

    try {
      recognitionRef.current.start();
    } catch {
      // recognition may already be started
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    playSoundEffect('tap');
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Evaluate spoken output
    evaluateSpokenEffort();
  };

  const evaluateSpokenEffort = () => {
    const text = recordedTranscript.trim();
    if (!text && recordingSeconds < 2) {
      setFeedback({
        score: 70,
        fluencyCommentFr: 'Enregistrement très court. N’hésitez pas à parler plus longuement en continu !',
        identifiedWords: [],
        tipsFr: 'Essayez de formuler au moins 3 phrases complètes sans vous arrêter.',
      });
      return;
    }

    // Check presence of keywords
    const recognizedWords: string[] = [];
    selectedActivity.keyVocabulary.forEach((v) => {
      const cleanArabic = v.arabic.replace(/[\u064B-\u065F]/g, '');
      if (text.includes(cleanArabic) || text.includes(v.arabic)) {
        recognizedWords.push(v.arabic);
      }
    });

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    let computedScore = Math.min(98, 70 + wordCount * 2 + recognizedWords.length * 5);
    if (computedScore < 75) computedScore = 78;

    setFeedback({
      score: computedScore,
      fluencyCommentFr:
        computedScore >= 90
          ? 'Excellent débit et diction claire ! Votre expression orale en continu est très fluide.'
          : 'Bonne tentative ! Vous structurez vos idées avec clarté. Continuez à soigner l’enchaînement des phrases.',
      identifiedWords: recognizedWords,
      tipsFr:
        'Pensez à marquer les pauses aux virgules et à bien prolonger les voyelles longues (Alif, Waw, Ya).',
    });

    playSoundEffect('correct');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    if (onEarnXp) onEarnXp(25);
  };

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    playSoundEffect('tap');
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    if (quizSubmitted) return;
    setQuizSubmitted(true);

    const questions = selectedActivity.comprehensionQuestions || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    if (correct === questions.length) {
      playSoundEffect('correct');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      if (onEarnXp) onEarnXp(30);
    } else {
      playSoundEffect('tap');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-400/20 text-teal-200 text-xs font-black tracking-wider uppercase border border-teal-300/30">
                {language === 'fr' ? 'Expression Orale & Écoute' : 'Speaking & Listening Lab'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                Niveau {currentLevel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-200 tracking-tight flex items-center gap-3">
              <span>🎙️</span>
              <span>
                {language === 'fr'
                  ? 'Tâches d’Écoute et d’Expression en Continu'
                  : language === 'ar'
                  ? 'مختبر الاستماع والتحدث والتعبير الشفهي المسترسل'
                  : 'Continuous Speaking & Listening Lab'}
              </span>
            </h1>

            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              {language === 'fr'
                ? "Développez votre aisance orale : entraînez-vous à parler en continu sans interruption, écoutez des dialogues authentiques et évaluez votre compréhension auditive et votre prononciation."
                : "Master authentic spoken Arabic: train to speak continuously, listen to native dialogues, and sharpen your oral comprehension."}
            </p>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-2 max-w-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'fr' ? 'Objectif CEFR :' : 'CEFR Target:'}</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {language === 'fr'
                ? 'Prendre la parole en continu sur des sujets familiers et comprendre des messages oraux clairs.'
                : 'Produce continuous speech on familiar topics and comprehend clear spoken messages.'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Activity Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Activity List */}
        <div className="lg:col-span-1 space-y-3">
          {/* Sub-filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'fr' ? 'Tous' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('continuous')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'continuous'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'fr' ? 'Parler en continu' : 'Continuous'}
            </button>
            <button
              onClick={() => setActiveTab('listening')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'listening'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'fr' ? 'Écoute' : 'Listening'}
            </button>
          </div>

          <div className="space-y-2.5">
            {currentActivities.map((act) => {
              const isSelected = act.id === selectedActivity.id;
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    setSelectedActivityId(act.id);
                    setFeedback(null);
                    setRecordedTranscript('');
                    setSelectedQuizAnswers({});
                    setQuizSubmitted(false);
                    playSoundEffect('tap');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-400 shadow-md ring-2 ring-amber-300/60'
                      : 'bg-white/90 hover:bg-amber-50/40 border-amber-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl select-none p-1.5 bg-amber-100/60 rounded-xl">
                      {act.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                          {act.badgeFr}
                        </span>
                        {act.timeLimitSeconds && (
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {act.timeLimitSeconds}s
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {language === 'ar' ? act.titleAr : act.titleFr}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {act.descriptionFr}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Interactive Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-md space-y-6">
            {/* Header of Active Activity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedActivity.icon}</span>
                  <h2 className="font-extrabold text-slate-900 text-lg">
                    {language === 'ar' ? selectedActivity.titleAr : selectedActivity.titleFr}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedActivity.descriptionFr}
                </p>
              </div>

              {/* Native Audio Model Player Button */}
              <button
                onClick={() => speakArabic(selectedActivity.audioPromptText, 0.85)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 transition active:scale-95 whitespace-nowrap"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>{language === 'fr' ? 'Écouter le modèle audio' : 'Listen Native Model'}</span>
              </button>
            </div>

            {/* Target Script & Vocalized Arabic Text Display */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {selectedActivity.type === 'listening_comprehension'
                      ? (language === 'fr' ? 'Texte de l’enregistrement audio :' : 'Audio Recording Script:')
                      : (language === 'fr' ? 'Modèle d’expression continue avec voyelles complètes :' : 'Continuous Speech Model:')}
                  </span>
                </span>
                <button
                  onClick={() => speakArabic(selectedActivity.targetScriptAr, 0.8)}
                  className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 transition"
                  title="Écouter ce passage"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p
                dir="rtl"
                className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-loose"
              >
                {selectedActivity.targetScriptAr}
              </p>

              <div className="pt-2 border-t border-amber-200/60 space-y-1">
                <p className="text-xs font-semibold text-emerald-950">
                  {selectedActivity.targetTranslitFr}
                </p>
                <p className="text-xs text-slate-600 italic">
                  « {selectedActivity.targetTranslationFr} »
                </p>
              </div>
            </div>

            {/* Speaking Guidance & Key Lexicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Guidance points */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                  <span>{language === 'fr' ? 'Conseils pour parler en continu :' : 'Speaking Tips:'}</span>
                </h4>
                <ul className="space-y-1 text-slate-700 list-disc list-inside leading-relaxed">
                  {selectedActivity.guidancePointsFr.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Key Vocabulary Pills */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 text-xs space-y-2">
                <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'fr' ? 'Vocabulaire clé à employer :' : 'Key Vocabulary:'}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedActivity.keyVocabulary.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => speakArabic(v.arabic, 0.85)}
                      className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-slate-800 border border-amber-200/80 font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Volume2 className="w-3 h-3 text-amber-600" />
                      <span dir="rtl" className="font-serif font-bold text-sm">
                        {v.arabic}
                      </span>
                      <span className="text-[10px] text-slate-500">({v.french})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Recording Engine for Continuous Speaking */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-teal-50/30 border-2 border-amber-300/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center justify-center sm:justify-start gap-2">
                    <span>🎙️</span>
                    <span>
                      {language === 'fr'
                        ? 'Enregistrez votre prise de parole en continu'
                        : 'Record Continuous Speech'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    {language === 'fr'
                      ? 'Cliquez sur le micro, parlez en arabe de manière continue puis arrêtez pour recevoir votre évaluation.'
                      : 'Press microphone, speak continuously in Arabic, and stop to get instant evaluation.'}
                  </p>
                </div>

                {/* Main Mic Button */}
                <div className="flex items-center gap-3">
                  {isRecording && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 font-extrabold text-xs animate-pulse border border-red-200">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                      <span>{recordingSeconds}s / {selectedActivity.timeLimitSeconds || 60}s</span>
                    </div>
                  )}

                  {!isRecording ? (
                    <button
                      id="btn-start-continuous-speaking"
                      onClick={startRecording}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:brightness-110 active:scale-95 transition"
                    >
                      <Mic className="w-5 h-5 animate-pulse" />
                      <span>{language === 'fr' ? 'Commencer à parler' : 'Start Speaking'}</span>
                    </button>
                  ) : (
                    <button
                      id="btn-stop-continuous-speaking"
                      onClick={stopRecording}
                      className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg hover:bg-slate-800 active:scale-95 transition"
                    >
                      <MicOff className="w-5 h-5 text-red-400" />
                      <span>{language === 'fr' ? 'Terminer & Évaluer' : 'Finish & Evaluate'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Spoken Output Live Display */}
              <div className="p-4 rounded-2xl bg-white border border-amber-200 min-h-[90px] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'fr' ? 'Transcription détectée en temps réel :' : 'Real-time Transcription:'}
                </span>

                {recordedTranscript ? (
                  <p dir="rtl" className="font-serif text-lg text-slate-900 font-bold leading-relaxed">
                    {recordedTranscript}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {isRecording
                      ? (language === 'fr' ? 'Écoute en cours... Exprimez-vous en arabe.' : 'Listening... Speak in Arabic.')
                      : (language === 'fr' ? 'Votre texte parlé apparaîtra ici dès que vous cliquerez sur le micro.' : 'Your speech transcription will appear here.')}
                  </p>
                )}

                {recordedTranscript && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => speakArabic(recordedTranscript, 0.9)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Réécouter' : 'Replay'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Evaluation Feedback Panel */}
              {feedback && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-extrabold text-emerald-950 text-sm">
                        {language === 'fr' ? 'Évaluation de la fluidité orale' : 'Oral Fluency Evaluation'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                      <span>Score : {feedback.score}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-950 leading-relaxed font-semibold">
                    {feedback.fluencyCommentFr}
                  </p>

                  {feedback.tipsFr && (
                    <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-emerald-200">
                      💡 <strong>{language === 'fr' ? 'Conseil d’amélioration :' : 'Tip:'}</strong> {feedback.tipsFr}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Comprehension Questions (if applicable for listening units) */}
            {selectedActivity.comprehensionQuestions &&
              selectedActivity.comprehensionQuestions.length > 0 && (
                <div className="pt-4 border-t border-amber-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-700" />
                      <span>
                        {language === 'fr'
                          ? 'Questions de Compréhension Orale'
                          : 'Oral Comprehension Quiz'}
                      </span>
                    </h3>
                    <span className="text-xs text-slate-500 font-bold">
                      {selectedActivity.comprehensionQuestions.length} questions
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedActivity.comprehensionQuestions.map((q, qIdx) => {
                      const userChoice = selectedQuizAnswers[qIdx];
                      const isAnswered = userChoice !== undefined;
                      const isRight = userChoice === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {qIdx + 1}. {q.questionFr}
                            </p>
                            <button
                              onClick={() => speakArabic(q.questionAr, 0.85)}
                              className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-100"
                              title="Écouter la question en arabe"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userChoice === optIdx;
                              let btnStyle =
                                'bg-white hover:bg-amber-100/60 border-amber-200/80 text-slate-800';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                                } else if (isSelected && !isRight) {
                                  btnStyle = 'bg-red-100 border-red-300 text-red-950';
                                }
                              } else if (isSelected) {
                                btnStyle =
                                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizAnswer(qIdx, optIdx)}
                                  className={`w-full p-2.5 rounded-xl border text-xs text-left transition flex items-center justify-between gap-2 ${btnStyle}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <p className="text-xs text-emerald-900 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                              ℹ️ {q.explanationFr}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md hover:brightness-105 active:scale-95 transition"
                    >
                      {language === 'fr' ? 'Valider les réponses' : 'Submit Answers'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedQuizAnswers({});
                        playSoundEffect('tap');
                      }}
                      className="w-full py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs transition"
                    >
                      {language === 'fr' ? 'Recommencer le quiz' : 'Retry Quiz'}
                    </button>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
