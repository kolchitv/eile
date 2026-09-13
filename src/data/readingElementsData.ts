export interface LetterReadingItem {
  id: string;
  letter: string;
  nameAr: string;
  nameFr: string;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  shortVowels: {
    fatha: string;
    kasra: string;
    damma: string;
    sukoon: string;
  };
  longVowels: {
    alif: string;
    yaa: string;
    waw: string;
  };
  tanween: {
    fath: string;
    kasr: string;
    damm: string;
  };
  sampleWord: {
    word: string;
    meaningAr: string;
    meaningFr: string;
    imageIcon: string;
  };
}

export interface SyllableReadingGroup {
  id: string;
  letter: string;
  letterName: string;
  badge: string;
  syllables: {
    syllable: string;
    type: 'fatha' | 'damma' | 'kasra' | 'sukoon' | 'maddAlif' | 'maddWaw' | 'maddYaa' | 'shaddah';
    typeLabelAr: string;
    typeLabelFr: string;
    exampleWord: string;
  }[];
}

export interface WordReadingCategory {
  id: string;
  titleAr: string;
  titleFr: string;
  badge: string;
  themeColor: string;
  words: {
    id: string;
    arabic: string;
    syllables: string[];
    french: string;
    icon?: string;
  }[];
}

export interface SentenceReadingItem {
  id: string;
  titleAr: string;
  titleFr: string;
  unitBadge: string;
  category: string;
  sentences: {
    id: string;
    textAr: string;
    textFr: string;
    context: string;
    level: 'بسيطة' | 'مركبة' | 'مسترسلة';
  }[];
}

// 1. Letters Data (28 Arabic Letters with all forms and vowel variations)
export const LETTERS_READING_DATA: LetterReadingItem[] = [
  {
    id: 'let-m',
    letter: 'م',
    nameAr: 'حَرْفُ الْمِيمِ',
    nameFr: 'La lettre Mîm (M)',
    forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
    shortVowels: { fatha: 'مَ', kasra: 'مِ', damma: 'مُ', sukoon: 'مْ' },
    longVowels: { alif: 'مَا', yaa: 'مِي', waw: 'مُو' },
    tanween: { fath: 'مً', kasr: 'مٍ', damm: 'مٌ' },
    sampleWord: { word: 'مَسْجِدٌ', meaningAr: 'مكان الصلاة', meaningFr: 'Mosquée', imageIcon: '🕌' },
  },
  {
    id: 'let-k',
    letter: 'ك',
    nameAr: 'حَرْفُ الْكَافِ',
    nameFr: 'La lettre Kâf (K)',
    forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    shortVowels: { fatha: 'كَ', kasra: 'كِ', damma: 'كُ', sukoon: 'كْ' },
    longVowels: { alif: 'كَا', yaa: 'كِي', waw: 'كُو' },
    tanween: { fath: 'كاً', kasr: 'كٍ', damm: 'كٌ' },
    sampleWord: { word: 'كِتَابٌ', meaningAr: 'كتاب القراءة والدراسة', meaningFr: 'Livre', imageIcon: '📖' },
  },
  {
    id: 'let-l',
    letter: 'ل',
    nameAr: 'حَرْفُ اللَّامِ',
    nameFr: 'La lettre Lâm (L)',
    forms: { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
    shortVowels: { fatha: 'لَ', kasra: 'لِ', damma: 'لُ', sukoon: 'لْ' },
    longVowels: { alif: 'لَا', yaa: 'لِي', waw: 'لُو' },
    tanween: { fath: 'لاً', kasr: 'لٍ', damm: 'لٌ' },
    sampleWord: { word: 'لَيْمُونٌ', meaningAr: 'فاكهة حمضية منعشة', meaningFr: 'Citron', imageIcon: '🍋' },
  },
  {
    id: 'let-n',
    letter: 'ن',
    nameAr: 'حَرْفُ النُّونِ',
    nameFr: 'La lettre Nûn (N)',
    forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
    shortVowels: { fatha: 'نَ', kasra: 'نِ', damma: 'نُ', sukoon: 'نْ' },
    longVowels: { alif: 'نَا', yaa: 'نِي', waw: 'نُو' },
    tanween: { fath: 'ناً', kasr: 'نٍ', damm: 'نٌ' },
    sampleWord: { word: 'نَجْمَةٌ', meaningAr: 'نجمة ساطعة في السماء', meaningFr: 'Étoile', imageIcon: '⭐' },
  },
  {
    id: 'let-s',
    letter: 'س',
    nameAr: 'حَرْفُ السِّينِ',
    nameFr: 'La lettre Sîn (S)',
    forms: { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
    shortVowels: { fatha: 'سَ', kasra: 'سِ', damma: 'سُ', sukoon: 'سْ' },
    longVowels: { alif: 'سَا', yaa: 'سِي', waw: 'سُو' },
    tanween: { fath: 'ساً', kasr: 'سٍ', damm: 'سٌ' },
    sampleWord: { word: 'سَمَكَةٌ', meaningAr: 'سمكة تسبح في الماء', meaningFr: 'Poisson', imageIcon: '🐟' },
  },
  {
    id: 'let-b',
    letter: 'ب',
    nameAr: 'حَرْفُ الْبَاءِ',
    nameFr: 'La lettre Bâ’ (B)',
    forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
    shortVowels: { fatha: 'بَ', kasra: 'بِ', damma: 'بُ', sukoon: 'بْ' },
    longVowels: { alif: 'بَا', yaa: 'بِي', waw: 'بُو' },
    tanween: { fath: 'باً', kasr: 'بٍ', damm: 'بٌ' },
    sampleWord: { word: 'بَيْتٌ', meaningAr: 'منزل الأسرة', meaningFr: 'Maison', imageIcon: '🏠' },
  },
  {
    id: 'let-t',
    letter: 'ت',
    nameAr: 'حَرْفُ التَّاءِ',
    nameFr: 'La lettre Tâ’ (T)',
    forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    shortVowels: { fatha: 'تَ', kasra: 'تِ', damma: 'تُ', sukoon: 'تْ' },
    longVowels: { alif: 'تَا', yaa: 'تِي', waw: 'تُو' },
    tanween: { fath: 'تاً', kasr: 'تٍ', damm: 'تٌ' },
    sampleWord: { word: 'تُفَّاحَةٌ', meaningAr: 'تفاحة حمراء لذيذة', meaningFr: 'Pomme', imageIcon: '🍎' },
  },
  {
    id: 'let-th',
    letter: 'ث',
    nameAr: 'حَرْفُ الثَّاءِ',
    nameFr: 'La lettre Thâ’ (Th)',
    forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
    shortVowels: { fatha: 'ثَ', kasra: 'ثِ', damma: 'ثُ', sukoon: 'ثْ' },
    longVowels: { alif: 'ثَا', yaa: 'ثِي', waw: 'ثُو' },
    tanween: { fath: 'ثاً', kasr: 'ثٍ', damm: 'ثٌ' },
    sampleWord: { word: 'ثَعْلَبٌ', meaningAr: 'حيوان ذكي وماكر', meaningFr: 'Renard', imageIcon: '🦊' },
  },
  {
    id: 'let-j',
    letter: 'ج',
    nameAr: 'حَرْفُ الْجِيمِ',
    nameFr: 'La lettre Jîm (J)',
    forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
    shortVowels: { fatha: 'جَ', kasra: 'جِ', damma: 'جُ', sukoon: 'جْ' },
    longVowels: { alif: 'جَا', yaa: 'جِي', waw: 'جُو' },
    tanween: { fath: 'جاً', kasr: 'جٍ', damm: 'جٌ' },
    sampleWord: { word: 'جَمَلٌ', meaningAr: 'سفينة الصحراء', meaningFr: 'Chameau', imageIcon: '🐪' },
  },
  {
    id: 'let-h7',
    letter: 'ح',
    nameAr: 'حَرْفُ الْحَاءِ',
    nameFr: 'La lettre Ḥâ’ (Ḥ)',
    forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
    shortVowels: { fatha: 'حَ', kasra: 'حِ', damma: 'حُ', sukoon: 'حْ' },
    longVowels: { alif: 'حَا', yaa: 'حِي', waw: 'حُو' },
    tanween: { fath: 'حاً', kasr: 'حٍ', damm: 'حٌ' },
    sampleWord: { word: 'حَدِيقَةٌ', meaningAr: 'بستان الأزهار واللعب', meaningFr: 'Jardin', imageIcon: '🌳' },
  },
  {
    id: 'let-kh',
    letter: 'خ',
    nameAr: 'حَرْفُ الْخَاءِ',
    nameFr: 'La lettre Khâ’ (Kh)',
    forms: { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
    shortVowels: { fatha: 'خَ', kasra: 'خِ', damma: 'خُ', sukoon: 'خْ' },
    longVowels: { alif: 'خَا', yaa: 'خِي', waw: 'خُو' },
    tanween: { fath: 'خاً', kasr: 'خٍ', damm: 'خٌ' },
    sampleWord: { word: 'خُبْزٌ', meaningAr: 'خبز طازج دافئ', meaningFr: 'Pain', imageIcon: '🥖' },
  },
  {
    id: 'let-d',
    letter: 'د',
    nameAr: 'حَرْفُ الدَّالِ',
    nameFr: 'La lettre Dâl (D)',
    forms: { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
    shortVowels: { fatha: 'دَ', kasra: 'دِ', damma: 'دُ', sukoon: 'دْ' },
    longVowels: { alif: 'دَا', yaa: 'دِي', waw: 'دُو' },
    tanween: { fath: 'داً', kasr: 'دٍ', damm: 'دٌ' },
    sampleWord: { word: 'دَرَّاجَةٌ', meaningAr: 'دراجة للركوب والرياضة', meaningFr: 'Vélo', imageIcon: '🚲' },
  },
  {
    id: 'let-dh',
    letter: 'ذ',
    nameAr: 'حَرْفُ الذَّالِ',
    nameFr: 'La lettre Dhâl (Dh)',
    forms: { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
    shortVowels: { fatha: 'ذَ', kasra: 'ذِ', damma: 'ذُ', sukoon: 'ذْ' },
    longVowels: { alif: 'ذَا', yaa: 'ذِي', waw: 'ذُو' },
    tanween: { fath: 'ذاً', kasr: 'ذٍ', damm: 'ذٌ' },
    sampleWord: { word: 'ذُرَةٌ', meaningAr: 'نبات أصفر لذيذ', meaningFr: 'Maïs', imageIcon: '🌽' },
  },
  {
    id: 'let-r',
    letter: 'ر',
    nameAr: 'حَرْفُ الرَّاءِ',
    nameFr: 'La lettre Râ’ (R)',
    forms: { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
    shortVowels: { fatha: 'رَ', kasra: 'رِ', damma: 'رُ', sukoon: 'رْ' },
    longVowels: { alif: 'رَا', yaa: 'رِي', waw: 'رُو' },
    tanween: { fath: 'راً', kasr: 'رٍ', damm: 'رٌ' },
    sampleWord: { word: 'رَسَّامٌ', meaningAr: 'فنان يرسم اللوحات', meaningFr: 'Peintre', imageIcon: '🎨' },
  },
  {
    id: 'let-z',
    letter: 'ز',
    nameAr: 'حَرْفُ الزَّايِ',
    nameFr: 'La lettre Zây (Z)',
    forms: { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
    shortVowels: { fatha: 'زَ', kasra: 'زِ', damma: 'زُ', sukoon: 'زْ' },
    longVowels: { alif: 'زَا', yaa: 'زِي', waw: 'زُو' },
    tanween: { fath: 'زاً', kasr: 'زٍ', damm: 'زٌ' },
    sampleWord: { word: 'زَهْرَةٌ', meaningAr: 'وردة جميلة ملونة', meaningFr: 'Fleur', imageIcon: '🌸' },
  },
  {
    id: 'let-sh',
    letter: 'ش',
    nameAr: 'حَرْفُ الشِّينِ',
    nameFr: 'La lettre Shîn (Ch)',
    forms: { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
    shortVowels: { fatha: 'شَ', kasra: 'شِ', damma: 'شُ', sukoon: 'شْ' },
    longVowels: { alif: 'شَا', yaa: 'شِي', waw: 'شُو' },
    tanween: { fath: 'شاً', kasr: 'شٍ', damm: 'شٌ' },
    sampleWord: { word: 'شَمْسٌ', meaningAr: 'تضيء النهار وتدفئ الكون', meaningFr: 'Soleil', imageIcon: '☀️' },
  },
  {
    id: 'let-sad',
    letter: 'ص',
    nameAr: 'حَرْفُ الصَّادِ',
    nameFr: 'La lettre Sâd (Ṣ)',
    forms: { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
    shortVowels: { fatha: 'صَ', kasra: 'صِ', damma: 'صُ', sukoon: 'صْ' },
    longVowels: { alif: 'صَا', yaa: 'صِي', waw: 'صُو' },
    tanween: { fath: 'صاً', kasr: 'صٍ', damm: 'صٌ' },
    sampleWord: { word: 'صَقْرٌ', meaningAr: 'طائر جارح وقوي', meaningFr: 'Faucon', imageIcon: '🦅' },
  },
  {
    id: 'let-dad',
    letter: 'ض',
    nameAr: 'حَرْفُ الضَّادِ',
    nameFr: 'La lettre Dâd (Ḍ)',
    forms: { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
    shortVowels: { fatha: 'ضَ', kasra: 'ضِ', damma: 'ضُ', sukoon: 'ضْ' },
    longVowels: { alif: 'ضَا', yaa: 'ضِي', waw: 'ضُو' },
    tanween: { fath: 'ضاً', kasr: 'ضٍ', damm: 'ضٌ' },
    sampleWord: { word: 'ضِفْدَعٌ', meaningAr: 'حيوان يقفز في البركة', meaningFr: 'Grenouille', imageIcon: '🐸' },
  },
  {
    id: 'let-taa',
    letter: 'ط',
    nameAr: 'حَرْفُ الطَّاءِ',
    nameFr: 'La lettre Tâ’ (Ṭ)',
    forms: { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
    shortVowels: { fatha: 'طَ', kasra: 'طِ', damma: 'طُ', sukoon: 'طْ' },
    longVowels: { alif: 'طَا', yaa: 'طِي', waw: 'طُو' },
    tanween: { fath: 'طاً', kasr: 'طٍ', damm: 'طٌ' },
    sampleWord: { word: 'طَيَّارَةٌ', meaningAr: 'طائرة تحلق في الجو', meaningFr: 'Avion', imageIcon: '✈️' },
  },
  {
    id: 'let-zaa',
    letter: 'ظ',
    nameAr: 'حَرْفُ الظَّاءِ',
    nameFr: 'La lettre Zâ’ (Ẓ)',
    forms: { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
    shortVowels: { fatha: 'ظَ', kasra: 'ظِ', damma: 'ظُ', sukoon: 'ظْ' },
    longVowels: { alif: 'ظَا', yaa: 'ظِي', waw: 'ظُو' },
    tanween: { fath: 'ظاً', kasr: 'ظٍ', damm: 'ظٌ' },
    sampleWord: { word: 'ظَرْفٌ', meaningAr: 'ظرف رسالة بريدية', meaningFr: 'Enveloppe', imageIcon: '✉️' },
  },
  {
    id: 'let-ayn',
    letter: 'ع',
    nameAr: 'حَرْفُ الْعَيْنِ',
    nameFr: 'La lettre ‘Ayn (ʿ)',
    forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
    shortVowels: { fatha: 'عَ', kasra: 'عِ', damma: 'عُ', sukoon: 'عْ' },
    longVowels: { alif: 'عَا', yaa: 'عِي', waw: 'عُو' },
    tanween: { fath: 'عاً', kasr: 'عٍ', damm: 'عٌ' },
    sampleWord: { word: 'عَيْنٌ', meaningAr: 'عضو الإبصار والنظر', meaningFr: 'Œil', imageIcon: '👁️' },
  },
  {
    id: 'let-ghayn',
    letter: 'غ',
    nameAr: 'حَرْفُ الْغَيْنِ',
    nameFr: 'La lettre Ghayn (Gh)',
    forms: { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
    shortVowels: { fatha: 'غَ', kasra: 'غِ', damma: 'غُ', sukoon: 'غْ' },
    longVowels: { alif: 'غَا', yaa: 'غِي', waw: 'غُو' },
    tanween: { fath: 'غاً', kasr: 'غٍ', damm: 'غٌ' },
    sampleWord: { word: 'غَزَالٌ', meaningAr: 'حيوان رشيق وجميل', meaningFr: 'Gazelle', imageIcon: '🦌' },
  },
  {
    id: 'let-faa',
    letter: 'ف',
    nameAr: 'حَرْفُ الْفَاءِ',
    nameFr: 'La lettre Fâ’ (F)',
    forms: { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
    shortVowels: { fatha: 'فَ', kasra: 'فِ', damma: 'فُ', sukoon: 'فْ' },
    longVowels: { alif: 'فَا', yaa: 'فِي', waw: 'فُو' },
    tanween: { fath: 'فاً', kasr: 'فٍ', damm: 'فٌ' },
    sampleWord: { word: 'فَرَاشَةٌ', meaningAr: 'فراشة زاهية الألوان', meaningFr: 'Papillon', imageIcon: '🦋' },
  },
  {
    id: 'let-qaf',
    letter: 'ق',
    nameAr: 'حَرْفُ الْقَافِ',
    nameFr: 'La lettre Qâf (Q)',
    forms: { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
    shortVowels: { fatha: 'قَ', kasra: 'قِ', damma: 'قُ', sukoon: 'قْ' },
    longVowels: { alif: 'قَا', yaa: 'قِي', waw: 'قُو' },
    tanween: { fath: 'قاً', kasr: 'قٍ', damm: 'قٌ' },
    sampleWord: { word: 'قَمَرٌ', meaningAr: 'يضيء عتمة الليل', meaningFr: 'Lune', imageIcon: '🌙' },
  },
  {
    id: 'let-ha',
    letter: 'هـ',
    nameAr: 'حَرْفُ الْهَاءِ',
    nameFr: 'La lettre Hâ’ (H)',
    forms: { isolated: 'هـ', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
    shortVowels: { fatha: 'هَ', kasra: 'هِ', damma: 'هُ', sukoon: 'هْ' },
    longVowels: { alif: 'هَا', yaa: 'هِي', waw: 'هُو' },
    tanween: { fath: 'هـاً', kasr: 'هٍ', damm: 'هٌ' },
    sampleWord: { word: 'هِلَالٌ', meaningAr: 'هلال بداية الشهر القمري', meaningFr: 'Croissant de lune', imageIcon: '🌙' },
  },
  {
    id: 'let-waw',
    letter: 'و',
    nameAr: 'حَرْفُ الْوَاوِ',
    nameFr: 'La lettre Wâw (W)',
    forms: { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
    shortVowels: { fatha: 'وَ', kasra: 'وِ', damma: 'وُ', sukoon: 'وْ' },
    longVowels: { alif: 'وَا', yaa: 'وِي', waw: 'وُو' },
    tanween: { fath: 'واً', kasr: 'وٍ', damm: 'وٌ' },
    sampleWord: { word: 'وَرْدَةٌ', meaningAr: 'وردة عطرة فواحة', meaningFr: 'Rose / Fleur', imageIcon: '🌹' },
  },
  {
    id: 'let-yaa',
    letter: 'ي',
    nameAr: 'حَرْفُ الْيَاءِ',
    nameFr: 'La lettre Yâ’ (Y)',
    forms: { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
    shortVowels: { fatha: 'يَ', kasra: 'يِ', damma: 'يُ', sukoon: 'يْ' },
    longVowels: { alif: 'يَا', yaa: 'يِي', waw: 'يُو' },
    tanween: { fath: 'ياً', kasr: 'يٍ', damm: 'يٌ' },
    sampleWord: { word: 'يَدٌ', meaningAr: 'يد للإمساك والعمل', meaningFr: 'Main', imageIcon: '✋' },
  },
];

// 2. Syllables Reading Data (مقاطع صوتية: الحركات، المدود، السكون، الشدة)
export const SYLLABLES_READING_GROUPS: SyllableReadingGroup[] = [
  {
    id: 'syl-m',
    letter: 'م',
    letterName: 'الميم',
    badge: 'الوحدة 1',
    syllables: [
      { syllable: 'مَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'مَـطَر' },
      { syllable: 'مِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'مِـقَصّ' },
      { syllable: 'مُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'مُـعَلِّم' },
      { syllable: 'مَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'مَاء' },
      { syllable: 'مُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'لَيْمُون' },
      { syllable: 'مِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'سَمِير' },
      { syllable: 'مَلْـ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'مَلْعَب' },
      { syllable: 'مُـمَّـ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'حَمَّام' },
    ],
  },
  {
    id: 'syl-k',
    letter: 'ك',
    letterName: 'الكاف',
    badge: 'الوحدة 1',
    syllables: [
      { syllable: 'كَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'كَـلْب' },
      { syllable: 'كِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'كِـتَاب' },
      { syllable: 'كُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'كُـرَة' },
      { syllable: 'كَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'كَامِل' },
      { syllable: 'كُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'كُوب' },
      { syllable: 'كِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'كِيس' },
      { syllable: 'مَكْـ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'مَكْتَب' },
      { syllable: 'دَكَّ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'دُكَّان' },
    ],
  },
  {
    id: 'syl-l',
    letter: 'ل',
    letterName: 'اللام',
    badge: 'الوحدة 1',
    syllables: [
      { syllable: 'لَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'لَـبَن' },
      { syllable: 'لِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'لِـسَان' },
      { syllable: 'لُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'لُـعْبَة' },
      { syllable: 'لَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'لَاعِب' },
      { syllable: 'لُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'قُلُوب' },
      { syllable: 'لِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'لَيْلِي' },
      { syllable: 'يَلْـ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'يَلْعَب' },
      { syllable: 'سَلَّـ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'سَلَّة' },
    ],
  },
  {
    id: 'syl-n',
    letter: 'ن',
    letterName: 'النون',
    badge: 'الوحدة 1',
    syllables: [
      { syllable: 'نَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'نَـمْل' },
      { syllable: 'نِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'نِـسْر' },
      { syllable: 'نُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'نُـقُود' },
      { syllable: 'نَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'نَادِر' },
      { syllable: 'نُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'نُور' },
      { syllable: 'نِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'نِيرَان' },
      { syllable: 'مَنْـ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'مَنْزِل' },
      { syllable: 'جَنَّـ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'جَنَّة' },
    ],
  },
  {
    id: 'syl-s',
    letter: 'س',
    letterName: 'السين',
    badge: 'الوحدة 1',
    syllables: [
      { syllable: 'سَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'سَـمَاء' },
      { syllable: 'سِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'سِـرَاج' },
      { syllable: 'سُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'سُـكَّر' },
      { syllable: 'سَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'سَامِي' },
      { syllable: 'سُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'سُوق' },
      { syllable: 'سِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'سِيرَة' },
      { syllable: 'مَسْـ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'مَسْجِد' },
      { syllable: 'رَسَّـ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'رَسَّام' },
    ],
  },
  {
    id: 'syl-r',
    letter: 'ر',
    letterName: 'الراء',
    badge: 'الأصوات المسترسلة',
    syllables: [
      { syllable: 'رَ', type: 'fatha', typeLabelAr: 'فتحة قصيرة', typeLabelFr: 'Fatha courte', exampleWord: 'رَأْس' },
      { syllable: 'رِ', type: 'kasra', typeLabelAr: 'كسرة قصيرة', typeLabelFr: 'Kasra courte', exampleWord: 'رِيشَة' },
      { syllable: 'رُ', type: 'damma', typeLabelAr: 'ضمة قصيرة', typeLabelFr: 'Damma courte', exampleWord: 'رُمَّان' },
      { syllable: 'رَا', type: 'maddAlif', typeLabelAr: 'مد بالألف', typeLabelFr: 'Longue Alif', exampleWord: 'رَائِد' },
      { syllable: 'رُو', type: 'maddWaw', typeLabelAr: 'مد بالواو', typeLabelFr: 'Longue Waw', exampleWord: 'رُوح' },
      { syllable: 'رِي', type: 'maddYaa', typeLabelAr: 'مد بالياء', typeLabelFr: 'Longue Yaa', exampleWord: 'رِيح' },
      { syllable: 'بَرْ', type: 'sukoon', typeLabelAr: 'مقطع ساكن', typeLabelFr: 'Syllabe fermée', exampleWord: 'بَرْق' },
      { syllable: 'مَرَّ', type: 'shaddah', typeLabelAr: 'حرف مشدد', typeLabelFr: 'Consonne double', exampleWord: 'مَرَّة' },
    ],
  },
];

// 3. Words Reading Data (كلمات مصنفة ومقطعة هجائياً)
export const WORDS_READING_CATEGORIES: WordReadingCategory[] = [
  {
    id: 'cat-fatha',
    titleAr: 'كَلِمَاتٌ بِالْفَتَحَاتِ الْقَصِيرَةِ (فَعَلَ)',
    titleFr: 'Mots à voyelles courtes (Fatha)',
    badge: 'المستوى 1',
    themeColor: 'rose',
    words: [
      { id: 'w-1', arabic: 'رَسَمَ', syllables: ['رَ', 'سَ', 'مَ'], french: 'Il a dessiné', icon: '🎨' },
      { id: 'w-2', arabic: 'دَرَسَ', syllables: ['دَ', 'رَ', 'سَ'], french: 'Il a étudié', icon: '📚' },
      { id: 'w-3', arabic: 'كَتَبَ', syllables: ['كَ', 'تَ', 'بَ'], french: 'Il a écrit', icon: '✍️' },
      { id: 'w-4', arabic: 'قَرَأَ', syllables: ['قَ', 'رَ', 'أَ'], french: 'Il a lu', icon: '📖' },
      { id: 'w-5', arabic: 'أَكَلَ', syllables: ['أَ', 'كَ', 'لَ'], french: 'Il a mangé', icon: '🍽️' },
      { id: 'w-6', arabic: 'شَرِبَ', syllables: ['شَ', 'رِ', 'بَ'], french: 'Il a bu', icon: '🥤' },
      { id: 'w-7', arabic: 'لَعِبَ', syllables: ['لَ', 'عِ', 'بَ'], french: 'Il a joué', icon: '⚽' },
      { id: 'w-8', arabic: 'سَمِعَ', syllables: ['سَ', 'مِ', 'عَ'], french: 'Il a entendu', icon: '👂' },
      { id: 'w-9', arabic: 'دَخَلَ', syllables: ['دَ', 'خَ', 'لَ'], french: 'Il est entré', icon: '🚪' },
      { id: 'w-10', arabic: 'خَرَجَ', syllables: ['خَ', 'رَ', 'جَ'], french: 'Il est sorti', icon: '🚶' },
      { id: 'w-11', arabic: 'ذَهَبَ', syllables: ['ذَ', 'هَ', 'بَ'], french: 'Il est parti', icon: '🏃' },
      { id: 'w-12', arabic: 'وَصَلَ', syllables: ['وَ', 'صَ', 'لَ'], french: 'Il est arrivé', icon: '🏁' },
    ],
  },
  {
    id: 'cat-madd',
    titleAr: 'كَلِمَاتٌ بِالْمُدُودِ الثَّلَاثَةِ (الألف، الواو، الياء)',
    titleFr: 'Mots avec les voyelles longues (Alif, Waw, Yaa)',
    badge: 'المستوى 2',
    themeColor: 'amber',
    words: [
      { id: 'wm-1', arabic: 'سَامِي', syllables: ['سَا', 'مِي'], french: 'Sami (Prénom)', icon: '👦' },
      { id: 'wm-2', arabic: 'سَارَة', syllables: ['سَا', 'رَ', 'ةُ'], french: 'Sarah (Prénom)', icon: '👧' },
      { id: 'wm-3', arabic: 'كِتَابٌ', syllables: ['كِ', 'تَا', 'بٌ'], french: 'Un livre', icon: '📖' },
      { id: 'wm-4', arabic: 'لَيْمُونٌ', syllables: ['لَيْ', 'مُو', 'نٌ'], french: 'Un citron', icon: '🍋' },
      { id: 'wm-5', arabic: 'عُصْفُورٌ', syllables: ['عُصْ', 'فُو', 'رٌ'], french: 'Un oiseau', icon: '🐦' },
      { id: 'wm-6', arabic: 'حَدِيقَةٌ', syllables: ['حَ', 'دِي', 'قَ', 'ةٌ'], french: 'Un jardin', icon: '🏡' },
      { id: 'wm-7', arabic: 'فَرِيقٌ', syllables: ['فَ', 'رِي', 'قٌ'], french: 'Une équipe', icon: '👥' },
      { id: 'wm-8', arabic: 'طَبِيبٌ', syllables: ['طَ', 'بِي', 'بٌ'], french: 'Un médecin', icon: '🩺' },
      { id: 'wm-9', arabic: 'صُورَةٌ', syllables: ['صُو', 'رَ', 'ةٌ'], french: 'Une image', icon: '🖼️' },
      { id: 'wm-10', arabic: 'سُوقٌ', syllables: ['سُو', 'قٌ'], french: 'Un marché / souk', icon: '🏪' },
    ],
  },
  {
    id: 'cat-sukoon-shaddah',
    titleAr: 'كَلِمَاتٌ بِالسُّكُونِ وَالشَّدَّةِ وَالتَّنْوِينِ',
    titleFr: 'Mots avec Sukoon, Shaddah et Tanween',
    badge: 'المستوى 3',
    themeColor: 'emerald',
    words: [
      { id: 'ws-1', arabic: 'مَدْرَسَةٌ', syllables: ['مَدْ', 'رَ', 'سَ', 'ةٌ'], french: 'Une école', icon: '🏫' },
      { id: 'ws-2', arabic: 'مَسْجِدٌ', syllables: ['مَسْ', 'جِ', 'دٌ'], french: 'Une mosquée', icon: '🕌' },
      { id: 'ws-3', arabic: 'مَلْعَبٌ', syllables: ['مَلْ', 'عَ', 'بٌ'], french: 'Un terrain de jeu', icon: '⚽' },
      { id: 'ws-4', arabic: 'مِصْبَاحٌ', syllables: ['مِصْ', 'بَا', 'حٌ'], french: 'Une lampe', icon: '💡' },
      { id: 'ws-5', arabic: 'مُعَلِّمٌ', syllables: ['مُ', 'عَلْ', 'لِ', 'مٌ'], french: 'Un enseignant', icon: '👨‍🏫' },
      { id: 'ws-6', arabic: 'رَسَّامٌ', syllables: ['رَسْ', 'سَا', 'مٌ'], french: 'Un peintre', icon: '🎨' },
      { id: 'ws-7', arabic: 'تُفَّاحٌ', syllables: ['تُفْ', 'فَا', 'حٌ'], french: 'Des pommes', icon: '🍎' },
      { id: 'ws-8', arabic: 'نَظَّارَةٌ', syllables: ['نَظْ', 'ظَا', 'رَ', 'ةٌ'], french: 'Des lunettes', icon: '👓' },
      { id: 'ws-9', arabic: 'دُكَّانٌ', syllables: ['دُكْ', 'كَا', 'نٌ'], french: 'Une boutique', icon: '🏬' },
    ],
  },
];

// 4. Sentences Reading Data (جمل ونصوص قصيرة)
export const SENTENCES_READING_ITEMS: SentenceReadingItem[] = [
  {
    id: 'sent-group-school-1',
    titleAr: 'جُمَلُ وَنُصُوصُ كِتَابِ الْقِرَاءَةِ الْمَدْرَسِيِّ (الصف الأول)',
    titleFr: 'Phrases des leçons du manuel de lecture (1ère Année)',
    unitBadge: 'الكتاب المدرسي',
    category: 'المنهج المدرسي',
    sentences: [
      {
        id: 'school-s-1',
        textAr: 'ذَهَبَ خَالِي إِلَى مَكَّةَ دُونَ أَنْ يَرْوِيَ الْمَزْرَعَةَ، فَسَقَتْ مَنَالُ النَّبَاتَ.',
        textFr: 'Mon oncle est allé à La Mecque, et Manal a arrosé les plantes de la ferme.',
        context: 'درس مَنَالُ وَالْمَزْرَعَةُ (ص 18-19)',
        level: 'مركبة',
      },
      {
        id: 'school-s-2',
        textAr: 'أَسْرَعَ مُنِيرٌ إِلَى الْبَقَالَةِ، وَقَالَ: يَجِبُ أَنْ أَتَعَلَّمَ الْقِرَاءَةَ.',
        textFr: 'Mounir s’est dépêché chez l’épicier et a dit : Je dois apprendre à lire.',
        context: 'درس مُنِيرٌ وَالْقِرَاءَةُ (ص 20)',
        level: 'بسيطة',
      },
      {
        id: 'school-s-3',
        textAr: 'أَعْطَى صَابِرٌ أَبَاهُ بُلْبُلًا دَاخِلَ صُنْدُوقٍ، وَقَالَ: أَنَا وَالْبُلْبُلُ أَصْدِقَاءُ.',
        textFr: 'Saber a donné à son père un rossignol dans une boîte.',
        context: 'درس صَابِرٌ وَالْبُلْبُلُ (ص 21)',
        level: 'مركبة',
      },
      {
        id: 'school-s-4',
        textAr: 'قَفَزَ الْفَأْرُ فَوْقَ رُفُوفِ الدُّولَابِ، وَوَقَعَ فِي الْمِصْيَدَةِ.',
        textFr: 'La souris a sauté sur les étagères de l’armoire et est tombée dans le piège.',
        context: 'درس مِصْيَدَةُ مُفِيدٍ (ص 22)',
        level: 'بسيطة',
      },
      {
        id: 'school-s-5',
        textAr: 'شَكَرَ الْمُعَلِّمُ التَّلَامِيذَ، وَقَالَ: «النَّظَافَةُ مِنَ الْإِيمَانِ».',
        textFr: 'L’enseignant a remercié les élèves et a dit : La propreté fait partie de la foi.',
        context: 'درس النَّظَافَةُ (ص 23)',
        level: 'بسيطة',
      },
      {
        id: 'school-s-6',
        textAr: 'قَالَ الطَّبِيبُ لِوَسِيمٍ: لَا بُدَّ أَنْ تُحْسِنَ نَظَافَةَ الأَسْنَانِ صَبَاحًا وَمَسَاءً.',
        textFr: 'Le dentiste a dit à Wassim : Tu dois bien brosser tes dents matin et soir.',
        context: 'درس أَسْنَانُ وَسِيمٍ (ص 24)',
        level: 'مركبة',
      },
      {
        id: 'school-s-7',
        textAr: 'يَجِبُ أَنْ نَجُودَ بِالْمَالِ وَنَشْتَرِيَ الدَّوَاءَ لِجَارِنَا الْمَرِيضِ جُبْرَانَ.',
        textFr: 'Nous devons être généreux et acheter les médicaments pour notre voisin malade Joubran.',
        context: 'درس جَارُ الْمَسْجِدِ (ص 25)',
        level: 'مسترسلة',
      },
      {
        id: 'school-s-8',
        textAr: 'ذَهَبَتْ رَشِيدَةُ تُرَدِّدُ أُنْشُودَةَ «شُرُوقِ الْحُرِّيَّةِ» وَتُلاحِقُ الْفَرَاشَاتِ.',
        textFr: 'Rachida est allée en fredonnant l’hymne et en poursuivant les papillons.',
        context: 'درس رَشِيدَةُ وَالْفَرَاشَاتُ (ص 26)',
        level: 'مركبة',
      },
      {
        id: 'school-s-9',
        textAr: 'لَا تَقْتَرِبِي مِنَ النَّحْلِ، فَالنَّحْلُ قَدْ يَلْسَعُ مَنْ يَقْطِفُ الزُّهُورَ.',
        textFr: 'Ne t’approche pas des abeilles, elles peuvent piquer quiconque cueille les fleurs.',
        context: 'درس لَطِيفَةُ وَالنَّحْلَةُ (ص 27)',
        level: 'مركبة',
      },
      {
        id: 'school-s-10',
        textAr: 'سَامَحَ جَدِّي زَيْدًا حِينَ اعْتَرَفَ بِخَطَئِهِ، وَبَدَأْنَا نُزِيلُ الزُّجَاجَ.',
        textFr: 'Mon grand-père a pardonné à Zaid quand il a avoué son erreur, et nous avons ramassé le verre.',
        context: 'درس زِيَارَةُ جَدِّي (ص 28-29)',
        level: 'مركبة',
      },
    ],
  },
  {
    id: 'sent-group-1',
    titleAr: 'جُمَلُ التَّعَارُفِ وَالْأُسْرَةِ (الوحدة 1)',
    titleFr: 'Phrases de présentation et de famille (Unité 1)',
    unitBadge: 'الوحدة 1',
    category: 'التعارف',
    sentences: [
      {
        id: 's1-1',
        textAr: 'السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي عُمَرُ.',
        textFr: 'Bonjour, je m’appelle Omar.',
        context: 'التحية وتقديم الاسم',
        level: 'بسيطة',
      },
      {
        id: 's1-2',
        textAr: 'عُمْرِي سَبْعُ سَنَوَاتٍ، وَأَسْكُنُ فِي مَدِينَةِ فَاس.',
        textFr: 'J’ai sept ans, et j’habite dans la ville de Fès.',
        context: 'العمر ومكان السكن',
        level: 'بسيطة',
      },
      {
        id: 's1-3',
        textAr: 'أَنَا أُحِبُّ أُمِّي وَأَبِي وَأُخْتِي الصَّغِيرَةَ سَارَة.',
        textFr: 'J’aime ma mère, mon père et ma petite sœur Sarah.',
        context: 'حب الأسرة',
        level: 'مركبة',
      },
      {
        id: 's1-4',
        textAr: 'يَجْتَمِعُ أَفْرَادُ الْأُسْرَةِ حَوْلَ الْمَائِدَةِ سَعِيدِينَ.',
        textFr: 'Les membres de la famille se réunissent joyeusement autour de la table.',
        context: 'اجتماع الأسرة',
        level: 'مسترسلة',
      },
    ],
  },
  {
    id: 'sent-group-2',
    titleAr: 'جُمَلُ الْمَدْرَسَةِ وَالْأَصْدِقَاءِ',
    titleFr: 'Phrases de l’école et des amis',
    unitBadge: 'المدرسة',
    category: 'التعليم',
    sentences: [
      {
        id: 's2-1',
        textAr: 'دَقَّ جَرَسُ الْمَدْرَسَةِ، فَدَخَلَ التَّلَامِيذُ إِلَى الْقِسْمِ.',
        textFr: 'La cloche a sonné, les élèves sont entrés en classe.',
        context: 'الدخول إلى الصف',
        level: 'مركبة',
      },
      {
        id: 's2-2',
        textAr: 'فَتَحَ سَامِي كِتَابَ الْقِرَاءَةِ وَقَرَأَ نَصّاً جَمِيلاً.',
        textFr: 'Sami a ouvert le livre de lecture et a lu un joli texte.',
        context: 'القراءة في الصف',
        level: 'مركبة',
      },
      {
        id: 's2-3',
        textAr: 'كَتَبَتْ مَرْيَمُ الدَّرْسَ بِخَطٍّ وَاضِحٍ وَمُرَتَّبٍ.',
        textFr: 'Maryam a écrit la leçon d’une écriture claire et soignée.',
        context: 'الكتابة في الدفتر',
        level: 'مركبة',
      },
      {
        id: 's2-4',
        textAr: 'فِي سَاحَةِ الْمَدْرَسَةِ يَلْعَبُ الأَطْفَالُ بِكُرَةِ الْقَدَمِ وَيَمْرَحُونَ.',
        textFr: 'Dans la cour de l’école, les enfants jouent au football et s’amusent.',
        context: 'الاستراحة واللعب',
        level: 'مسترسلة',
      },
    ],
  },
  {
    id: 'sent-group-3',
    titleAr: 'جُمَلُ الطَّبِيعَةِ وَالْأَخْلَاقِ',
    titleFr: 'Phrases sur la nature et les valeurs',
    unitBadge: 'القيم والطبيعة',
    category: 'الأخلاق',
    sentences: [
      {
        id: 's3-1',
        textAr: 'أَشْرَقَتِ الشَّمْسُ الدَّافِئَةُ، وَغَرَّدَتِ الطُّيُورُ فَوْقَ الأَغْصَانِ.',
        textFr: 'Le soleil chaleureux s’est levé, et les oiseaux ont chanté sur les branches.',
        context: 'الصباح الجميل',
        level: 'مسترسلة',
      },
      {
        id: 's3-2',
        textAr: 'الْعَمَلُ التَّطَوُّعِيُّ يُسْعِدُ الْقُلُوبَ وَيَجْعَلُ الْحَيَّ نَظِيفاً.',
        textFr: 'Le travail bénévole réjouit les cœurs et rend le quartier propre.',
        context: 'النظافة والتعاون',
        level: 'مسترسلة',
      },
      {
        id: 's3-3',
        textAr: 'الْحُرِّيَّةُ نِعْمَةٌ غَالِيَةٌ يَفْرَحُ بِهَا كُلُّ طَائِرٍ وَإِنْسَانٍ.',
        textFr: 'La liberté est un bien précieux dont se réjouit chaque oiseau et être humain.',
        context: 'قيمة الحرية',
        level: 'مسترسلة',
      },
    ],
  },
];
