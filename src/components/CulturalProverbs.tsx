import React, { useState } from 'react';
import { speakArabic, playSoundEffect } from '../utils/audio';
import { Volume2, Sparkles, Compass, RefreshCw, Quote } from 'lucide-react';

interface CulturalProverbsProps {
  language: 'en' | 'fr' | 'ar';
}

const ARABIC_PROVERBS = [
  {
    id: 'prv-1',
    arabic: 'اطْلُبُوا العِلْمَ مِنَ المَهْدِ إِلَى اللَّحْد',
    transliteration: 'Uṭlubū al-‘ilma mina al-mahdi ilā al-laḥd',
    translationEn: 'Seek knowledge from the cradle to the grave.',
    translationFr: 'Cherchez le savoir du berceau jusqu’à la tombe.',
    contextEn: 'A fundamental Arabic value celebrating lifelong learning and endless curiosity.',
    contextFr: 'Une valeur essentielle de la culture arabe valorisant l’apprentissage continu tout au long de la vie.',
  },
  {
    id: 'prv-2',
    arabic: 'الصَّبْرُ مِفْتَاحُ الفَرَج',
    transliteration: 'Aṣ-ṣabru miftāḥu al-faraj',
    translationEn: 'Patience is the key to relief and victory.',
    translationFr: 'La patience est la clé de la délivrance.',
    contextEn: 'Encourages resilience in facing life\'s difficulties with dignity and peace of mind.',
    contextFr: 'Incite à la résilience et au calme face aux épreuves de la vie.',
  },
  {
    id: 'prv-3',
    arabic: 'لِسَانُكَ حِصَانُكَ، إِنْ صُنْتَهُ صَانَكَ',
    transliteration: 'Lisānuka ḥiṣānuka, in ṣuntahu ṣānak',
    translationEn: 'Your tongue is your horse: if you care for it, it protects you.',
    translationFr: 'Ta langue est ton cheval : si tu la préserves, elle te préservera.',
    contextEn: 'An iconic proverb on mindfulness, wisdom in speech, and constructive communication.',
    contextFr: 'Un proverbe emblématique sur la sagesse dans la parole et la bienveillance.',
  },
  {
    id: 'prv-4',
    arabic: 'رُبَّ أَخٍ لَكَ لَمْ تَلِدْهُ أُمُّك',
    transliteration: 'Rubba akhin laka lam talid-hu ummuk',
    translationEn: 'Many a brother you have whom your mother never bore.',
    translationFr: 'Il est des frères que ta propre mère n’a point enfantés.',
    contextEn: 'Praises profound friendship and chosen brotherhood beyond bloodlines.',
    contextFr: 'Célèbre l’amitié sincère et la fraternité de cœur.',
  },
];

const DIALECT_COMPARISONS = [
  {
    meaningEn: 'How are you?',
    meaningFr: 'Comment vas-tu ?',
    fusha: 'كَيْفَ حَالُك؟ (Kayfa haluk?)',
    egyptian: 'عَامِل إِيه؟ (Amel eh?)',
    levantine: 'كِيفَك؟ (Kīfak?)',
    maghrebi: 'لَابَاس عَلِيك؟ / كِيدَايِر؟ (Labas alik? / Kidayr?)',
    gulf: 'شْلُونَك؟ (Shlonak?)',
  },
  {
    meaningEn: 'I want / I would like',
    meaningFr: 'Je veux / J’aimerais',
    fusha: 'أُرِيدُ (Urīdu)',
    egyptian: 'عَايِز / عَاوِز (‘Ayiz)',
    levantine: 'بِدِّي (Biddī)',
    maghrebi: 'بْغِيتْ (Bghīt)',
    gulf: 'أَبِي (Abī)',
  },
  {
    meaningEn: 'A lot / Very much',
    meaningFr: 'Beaucoup / Très',
    fusha: 'كَثِيرًا / جِدًّا (Kathīran / Jiddan)',
    egyptian: 'أَوِي (Awi)',
    levantine: 'كْتِير (Ktīr)',
    maghrebi: 'بْزَّافْ (Bzzaf)',
    gulf: 'وَايِدْ (Wāyid)',
  },
];

export const CulturalProverbs: React.FC<CulturalProverbsProps> = ({ language }) => {
  const [currentPrvIdx, setCurrentPrvIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'proverbs' | 'dialects'>('proverbs');

  const proverb = ARABIC_PROVERBS[currentPrvIdx];

  const handleNextProverb = () => {
    playSoundEffect('tap');
    setCurrentPrvIdx((i) => (i + 1) % ARABIC_PROVERBS.length);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border border-amber-200/80 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-amber-600" />
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
            {language === 'ar' ? 'كنوز الثقافة واللهجات العربية' : language === 'fr' ? 'Trésors Culturels & Dialectes' : 'Cultural Wisdom & Dialect Explorer'}
          </h3>
        </div>

        <div className="flex items-center bg-amber-100/70 p-1 rounded-2xl text-xs font-bold border border-amber-200/60">
          <button
            onClick={() => {
              setActiveTab('proverbs');
              playSoundEffect('tap');
            }}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeTab === 'proverbs' ? 'bg-white text-amber-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            {language === 'fr' ? 'Proverbes' : language === 'ar' ? 'الأمثال' : 'Proverbs'}
          </button>
          <button
            onClick={() => {
              setActiveTab('dialects');
              playSoundEffect('tap');
            }}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeTab === 'dialects' ? 'bg-white text-amber-950 shadow-xs font-extrabold' : 'text-slate-600 hover:text-amber-900'
            }`}
          >
            {language === 'fr' ? 'Dialectes vs Fusha' : language === 'ar' ? 'مقارنة اللهجات' : 'Dialects vs MSA'}
          </button>
        </div>
      </div>

      {activeTab === 'proverbs' ? (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/40 border border-amber-300/80 shadow-2xs">
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
              {language === 'fr' ? 'Sagesse Arabe' : language === 'ar' ? 'حكمة اليوم' : 'Daily Proverb'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  playSoundEffect('tap');
                  speakArabic(proverb.arabic, 0.85);
                }}
                className="p-1.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 border border-amber-200 shadow-2xs transition-transform active:scale-95"
                title="Listen to proverb"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextProverb}
                className="p-1.5 rounded-xl bg-white text-slate-700 hover:bg-amber-50 border border-amber-200 shadow-2xs transition-transform active:scale-95"
                title="Next proverb"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p dir="rtl" className="font-serif text-xl sm:text-2xl font-bold text-slate-900 my-2 text-center leading-relaxed">
            «{proverb.arabic}»
          </p>

          <p className="text-xs text-center font-bold text-emerald-900 mb-1">
            {proverb.transliteration}
          </p>

          <p className="text-xs text-center text-slate-700 font-medium mb-2">
            "{language === 'fr' ? proverb.translationFr : proverb.translationEn}"
          </p>

          <p className="text-[11px] text-slate-600 text-center border-t border-amber-200/80 pt-2 font-medium">
            💡 {language === 'fr' ? proverb.contextFr : proverb.contextEn}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {DIALECT_COMPARISONS.map((d, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs">
              <div className="flex items-center justify-between font-extrabold text-slate-900 mb-2">
                <span>{language === 'fr' ? d.meaningFr : d.meaningEn}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] font-bold border border-emerald-300">
                  Fusha: {d.fusha}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="text-amber-800 font-bold block text-[9px]">🇪🇬 Egyptian</span>
                  <span className="font-semibold text-slate-900">{d.egyptian}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="text-amber-800 font-bold block text-[9px]">🇱🇧/🇸🇾 Levantine</span>
                  <span className="font-semibold text-slate-900">{d.levantine}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="text-amber-800 font-bold block text-[9px]">🇲🇦/🇩🇿 Maghrebi</span>
                  <span className="font-semibold text-slate-900">{d.maghrebi}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-amber-200/70 shadow-2xs">
                  <span className="text-amber-800 font-bold block text-[9px]">🇸🇦/🇦🇪 Gulf</span>
                  <span className="font-semibold text-slate-900">{d.gulf}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
