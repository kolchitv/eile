export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SupportedLanguage = 'en' | 'fr' | 'ar';

export interface VocabularyItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: {
    en: string;
    fr: string;
  };
  audioText?: string;
  category?: string;
  root?: string;
  exampleSentence?: {
    arabic: string;
    transliteration: string;
    translationEn: string;
    translationFr: string;
  };
}

export interface DialogueLine {
  speaker: string;
  speakerAvatar: string;
  arabic: string;
  transliteration: string;
  translationEn: string;
  translationFr: string;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'sentence-order' | 'audio-listen' | 'letter-trace' | 'fill-blank';
  questionEn: string;
  questionFr: string;
  questionAr?: string;
  arabicPrompt?: string;
  audioPrompt?: string;
  options?: string[];
  correctAnswer: string | number | string[];
  explanationEn: string;
  explanationFr: string;
}

export interface LessonUnit {
  id: string;
  level: CEFRLevel;
  unitNumber: number;
  titleAr: string;
  titleEn: string;
  titleFr: string;
  iconName: string;
  descriptionEn: string;
  descriptionFr: string;
  colorTheme: string;
  competencies: {
    oralInteraction: string;
    listening: string;
    continuousSpeaking: string;
    reading: string;
    writing: string;
  };
  vocabulary: VocabularyItem[];
  dialogue?: DialogueLine[];
  readingPassage?: {
    title: string;
    arabicText: string;
    translationEn: string;
    translationFr: string;
  };
  grammarTip?: {
    titleEn: string;
    titleFr: string;
    contentEn: string;
    contentFr: string;
    examples: { arabic: string; explanation: string }[];
  };
  exercises: Exercise[];
  tracingLetters?: {
    letter: string;
    nameEn: string;
    forms: { isolated: string; initial: string; medial: string; final: string };
    audioTip: string;
  }[];
}

export interface UserProgress {
  selectedLevel: CEFRLevel;
  language: SupportedLanguage;
  xp: number;
  gems: number;
  streakDays: number;
  completedLessons: string[];
  unlockedLevels: CEFRLevel[];
  highScores: Record<string, number>;
  bookmarkedWords: string[];
  soundSpeed: number; // 0.8, 1.0, 1.2
}

export interface TrickySound {
  id: string;
  letter: string;
  nameEn: string;
  nameAr: string;
  ipa: string;
  articulationGuideEn: string;
  articulationGuideFr: string;
  comparisonWithLatinEn: string;
  comparisonWithLatinFr: string;
  minimalPairs: {
    targetArabic: string;
    targetTranslit: string;
    targetMeaning: string;
    confusedArabic: string;
    confusedTranslit: string;
    confusedMeaning: string;
  }[];
}

export type CompetencyDomainId =
  | 'oral_production'
  | 'written_production'
  | 'listening_comprehension'
  | 'reading_comprehension'
  | 'oral_interaction'
  | 'written_interaction'
  | 'linguistic_competence';

export interface CompetencyDescriptor {
  id: string;
  textAr: string;
  textFr?: string;
  textEn?: string;
  exampleAr?: string;
  exampleFr?: string;
  exampleEn?: string;
}

export interface CompetencyCategory {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  icon: string;
  descriptors: CompetencyDescriptor[];
}

export interface CompetencyDomain {
  id: CompetencyDomainId;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  icon: string;
  badgeColor: string;
  categories: CompetencyCategory[];
}

export interface CEFRLevelCompetencies {
  level: CEFRLevel;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn: string;
  domains: CompetencyDomain[];
}
