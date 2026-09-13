import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { HelpCircle, X, CheckCircle2, Award, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlacementTestProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (lvl: CEFRLevel) => void;
  language: 'en' | 'fr' | 'ar';
}

interface TestQuestion {
  level: CEFRLevel;
  questionEn: string;
  questionFr: string;
  questionAr?: string;
  arabicPrompt?: string;
  options: string[];
  correctIdx: number;
  explanationEn: string;
  explanationFr: string;
}

const PLACEMENT_QUESTIONS: TestQuestion[] = [
  {
    level: 'A1',
    questionEn: 'What is the standard polite reply to "السَّلَامُ عَلَيْكُم" (As-salāmu ‘alaykum)?',
    questionFr: 'Quelle est la réponse polie standard à "السَّلَامُ عَلَيْكُم" (As-salāmu ‘alaykum) ?',
    options: ['وَعَلَيْكُمُ السَّلَام', 'صَبَاحُ الخَيْر', 'أَنَا أُسْتَاذ', 'مَعَ السَّلَامَة'],
    correctIdx: 0,
    explanationEn: 'The correct reply is "وَعَلَيْكُمُ السَّلَام" (Wa ‘alaykumu as-salām).',
    explanationFr: 'La réponse correcte est "وَعَلَيْكُمُ السَّلَام" (Et que la paix soit sur vous).',
  },
  {
    level: 'A2',
    questionEn: 'How do you ask "Where is the train station?" in Arabic?',
    questionFr: 'Comment demande-t-on "Où est la gare ferroviaire ?" en arabe ?',
    options: ['أَيْنَ مَحَطَّةُ القِطَار؟', 'كَمْ سِعْرُ التَّذْكِرَة؟', 'مَاذَا تُرِيدُ أَنْ تَأْكُل؟', 'كَيْفَ الجَوُّ اليَوْم؟'],
    correctIdx: 0,
    explanationEn: '"أَيْنَ مَحَطَّةُ القِطَار؟" (Ayna maḥaṭṭatu al-qiṭār?) means "Where is the train station?".',
    explanationFr: '"أَيْنَ مَحَطَّةُ القِطَار؟" (Ayna maḥaṭṭatu al-qiṭār?) signifie "Où est la gare ?".',
  },
  {
    level: 'B1',
    questionEn: 'Choose the correct past tense verb: "سَامِي وَعُمَر ______ إِلَى مَرَّاكُش الأُسْبُوعَ المَاضِي."',
    questionFr: 'Choisissez le verbe au passé approprié pour deux personnes (duel masculin) : "سَامِي وَعُمَر ______ إِلَى مَرَّاكُش."',
    options: ['سَافَرَا (Duel passé)', 'يُسَافِرُونَ (Présent pluriel)', 'سَافَرَتْ (Féminin singulier)', 'سَافِرْ (Impératif)'],
    correctIdx: 0,
    explanationEn: 'For two male subjects (Sami and Omar), the dual past verb is "سَافَرَا".',
    explanationFr: 'Pour deux sujets masculins (Sami et Omar), la terminaison du duel au passé est "سَافَرَا".',
  },
  {
    level: 'B2',
    questionEn: 'Which Arabic proverb expresses that "Patience brings ultimate relief and victory"?',
    questionFr: 'Quel proverbe arabe exprime que "La patience est la clé de la délivrance et du succès" ?',
    options: ['الصَّبْرُ مِفْتَاحُ الفَرَج', 'الوقت كالسيف إن لم تقطعه قطعك', 'لكل مقال مقام', 'العقل السليم في الجسم السليم'],
    correctIdx: 0,
    explanationEn: '"الصَّبْرُ مِفْتَاحُ الفَرَج" means patience is the key to relief.',
    explanationFr: '"الصَّبْرُ مِفْتَاحُ الفَرَج" signifie que la patience est la clé de toute délivrance.',
  },
  {
    level: 'C1',
    questionEn: 'What rhetorical device (بَلَاغَة) is used when a word is meant in an implicit metaphorical sense without stating the comparison particle (كَـ)?',
    questionFr: 'Quelle figure de style rhétorique (Balagha) correspond à la métaphore implicite en arabe classique ?',
    options: ['الاسْتِعَارَة (Métaphore)', 'الجِنَاس (Allitération/Calembour)', 'السَّجْع (Prose rimée)', 'الإِطْنَاب (Périphrase/Amplification)'],
    correctIdx: 0,
    explanationEn: 'الاستعارة (Isti‘ārah) is the classical Arabic metaphor.',
    explanationFr: 'الاستعارة (Isti‘ārah) désigne la métaphore en rhétorique arabe.',
  },
];

export const PlacementTestModal: React.FC<PlacementTestProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  language,
}) => {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_QUESTIONS[currentQIdx];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    playSoundEffect('tap');
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isRight = selectedOption === currentQ.correctIdx;
    if (isRight) {
      setCorrectCount((c) => c + 1);
    }

    if (currentQIdx < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      playSoundEffect('levelup');
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    }
  };

  const determineRecommendedLevel = (): CEFRLevel => {
    if (correctCount <= 1) return 'A1';
    if (correctCount === 2) return 'A2';
    if (correctCount === 3) return 'B1';
    if (correctCount === 4) return 'B2';
    return 'C1';
  };

  const recommended = determineRecommendedLevel();

  const handleStartAtRecommended = () => {
    onSelectLevel(recommended);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200/80">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'ar' ? 'اختبار تحديد المستوى (CEFR)' : language === 'fr' ? 'Test de Positionnement CEFR' : 'CEFR Placement Diagnostic'}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'fr' ? '5 questions pour trouver votre niveau idéal de A1 à C2' : language === 'ar' ? '٥ أسئلة ذكية لتحديد مستواك المناسب' : '5 questions to identify your optimal starting level'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-amber-100/50 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="mt-4 space-y-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{language === 'fr' ? `Question ${currentQIdx + 1} sur ${PLACEMENT_QUESTIONS.length}` : language === 'ar' ? `السؤال ${currentQIdx + 1} من ${PLACEMENT_QUESTIONS.length}` : `Question ${currentQIdx + 1} / ${PLACEMENT_QUESTIONS.length}`}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-extrabold border border-amber-200">
                {language === 'fr' ? `Niveau : ${currentQ.level}` : `Target: ${currentQ.level}`}
              </span>
            </div>
            <div className="w-full bg-amber-100/80 h-2.5 rounded-full overflow-hidden border border-amber-200/60">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
                style={{ width: `${((currentQIdx + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <p className="font-extrabold text-slate-900 text-sm">
                {language === 'fr' ? currentQ.questionFr : language === 'ar' ? (currentQ.questionAr || currentQ.questionFr) : currentQ.questionEn}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                    selectedOption === idx
                      ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/25 shadow-xs'
                      : 'border-amber-200/80 bg-white hover:bg-amber-50/60 text-slate-800'
                  }`}
                >
                  <span dir="rtl" className="font-serif text-base font-bold">{opt}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedOption === idx ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                    {selectedOption === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Next button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedOption !== null
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 active:scale-95'
                    : 'bg-amber-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentQIdx < PLACEMENT_QUESTIONS.length - 1
                    ? (language === 'fr' ? 'Question Suivante' : language === 'ar' ? 'السؤال التالي' : 'Next Question')
                    : (language === 'fr' ? 'Voir le Résultat' : language === 'ar' ? 'عرض النتيجة' : 'View Placement Result')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="mt-4 text-center py-4 space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-xl text-slate-900">
                {language === 'fr' ? 'Évaluation Terminée !' : language === 'ar' ? 'تم تحديد مستواك بنجاح!' : 'Diagnostic Complete!'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {language === 'fr'
                  ? `Vous avez obtenu ${correctCount} sur ${PLACEMENT_QUESTIONS.length} réponses correctes.`
                  : language === 'ar'
                  ? `أجبت على ${correctCount} من أصل ${PLACEMENT_QUESTIONS.length} إجابات صحيحة.`
                  : `You scored ${correctCount} out of ${PLACEMENT_QUESTIONS.length} questions correctly.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 shadow-2xs">
              <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                {language === 'fr' ? 'Niveau Recommandé' : language === 'ar' ? 'المستوى المقترح لك' : 'Recommended Level'}
              </span>
              <span className="font-serif text-3xl font-extrabold text-emerald-950 mt-1 block">
                {recommended} - {recommended === 'A1' ? 'المبتدئ (Discovery)' : recommended === 'A2' ? 'الأساسي (Elementary)' : recommended === 'B1' ? 'المستقل (Intermediate)' : recommended === 'B2' ? 'المتمكن (Vantage)' : 'المتقدم (Proficient)'}
              </span>
            </div>

            <button
              onClick={handleStartAtRecommended}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
            >
              {language === 'fr' ? `Commencer au niveau ${recommended}` : language === 'ar' ? `ابدأ التعلم في مستوى ${recommended}` : `Jump into Level ${recommended} Units`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
