export interface WordItem {
  id: string;
  arabic: string; // with full tashkeel
  syllables: string[]; // for breakdown e.g. ['رَ', 'سَ', 'مَ'] or ['مَلْ', 'عَ', 'بُ']
  transliteration: string; // e.g. "ra-sa-ma"
  french: string; // translation
  english: string; // translation
  coloredParts?: { text: string; type: 'vowel' | 'madd' | 'sukoon' | 'consonant' }[];
}

export interface ReadingCategory {
  id: string;
  pageNumber: number;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  ruleExplanationAr: string;
  ruleExplanationFr: string;
  badge: string;
  themeColor: string; // tailwind color token
  words: WordItem[];
}

export const FIRST_GRADE_READING_DATA: ReadingCategory[] = [
  // ================= 1. قراءة كلمات بسيطة (بالفتحة) =================
  {
    id: 'simple-fatha',
    pageNumber: 1,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ بَسِيطَةٍ (بِالفَتْحَة)',
    titleFr: 'Mots simples avec la Fatha (a)',
    titleEn: 'Simple Words with Short Vowel Fatha',
    ruleExplanationAr: 'أفعال ثلاثية مفتوحة الحركات (فَعَلَ)، انطق كل حرف بصوت قصير واضح.',
    ruleExplanationFr: 'Verbes trilitères au son court ouvert "a". Prononcez distinctement chaque syllabe.',
    badge: 'الصفحة 1 • الفتحة',
    themeColor: 'rose',
    words: [
      { id: 'w1-1', arabic: 'رَسَمَ', syllables: ['رَ', 'سَ', 'مَ'], transliteration: 'ra-sa-ma', french: 'Il a dessiné', english: 'He drew' },
      { id: 'w1-2', arabic: 'دَرَسَ', syllables: ['دَ', 'رَ', 'سَ'], transliteration: 'da-ra-sa', french: 'Il a étudié', english: 'He studied' },
      { id: 'w1-3', arabic: 'حَمَدَ', syllables: ['حَ', 'مَ', 'دَ'], transliteration: 'ḥa-ma-da', french: 'Il a loué / remercié', english: 'He praised' },
      { id: 'w1-4', arabic: 'شَرِبَ', syllables: ['شَ', 'رِ', 'بَ'], transliteration: 'sha-ri-ba', french: 'Il a bu', english: 'He drank' },
      { id: 'w1-5', arabic: 'جَرَحَ', syllables: ['جَ', 'رَ', 'حَ'], transliteration: 'ja-ra-ḥa', french: 'Il a blessé', english: 'He wounded' },
      { id: 'w1-6', arabic: 'لَبِسَ', syllables: ['لَ', 'بِ', 'سَ'], transliteration: 'la-bi-sa', french: 'Il a porté / mis', english: 'He wore' },
      { id: 'w1-7', arabic: 'شَرَحَ', syllables: ['شَ', 'رَ', 'حَ'], transliteration: 'sha-ra-ḥa', french: 'Il a expliqué', english: 'He explained' },
      { id: 'w1-8', arabic: 'ذَهَبَ', syllables: ['ذَ', 'هَ', 'بَ'], transliteration: 'dha-ha-ba', french: 'Il est parti / allé', english: 'He went' },
      { id: 'w1-9', arabic: 'أَكَلَ', syllables: ['أَ', 'كَ', 'لَ'], transliteration: 'a-ka-la', french: 'Il a mangé', english: 'He ate' },
      { id: 'w1-10', arabic: 'سَمِعَ', syllables: ['سَ', 'مِ', 'عَ'], transliteration: 'sa-mi-ʿa', french: 'Il a entendu', english: 'He heard' },
      { id: 'w1-11', arabic: 'دَخَلَ', syllables: ['دَ', 'خَ', 'لَ'], transliteration: 'da-kha-la', french: 'Il est entré', english: 'He entered' },
      { id: 'w1-12', arabic: 'خَرَجَ', syllables: ['خَ', 'رَ', 'جَ'], transliteration: 'kha-ra-ja', french: 'Il est sorti', english: 'He exited' },
      { id: 'w1-13', arabic: 'هَرَبَ', syllables: ['هَ', 'رَ', 'بَ'], transliteration: 'ha-ra-ba', french: 'Il s’est enfui', english: 'He fled' },
      { id: 'w1-14', arabic: 'مَسَحَ', syllables: ['مَ', 'سَ', 'حَ'], transliteration: 'ma-sa-ḥa', french: 'Il a essuyé', english: 'He wiped' },
      { id: 'w1-15', arabic: 'غَرِقَ', syllables: ['غَ', 'رِ', 'قَ'], transliteration: 'gha-ri-qa', french: 'Il a coulé / s’est noyé', english: 'He drowned' },
      { id: 'w1-16', arabic: 'عَرَفَ', syllables: ['عَ', 'رَ', 'فَ'], transliteration: 'ʿa-ra-fa', french: 'Il a su / connu', english: 'He knew' },
    ],
  },

  // ================= 2. قراءة كلمات ممدودة بالألف =================
  {
    id: 'madd-alif',
    pageNumber: 2,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ مَمْدُودَةٍ بِالأَلِف',
    titleFr: 'Mots avec voyelle longue Alif (ā)',
    titleEn: 'Words with Long Vowel Alif (ā)',
    ruleExplanationAr: 'المد بالألف صوت طويل ممدود حركتين (ـَا)، افتح الفم ومُدّ الصوت.',
    ruleExplanationFr: 'La voyelle longue Alif allonge le son "a" sur 2 temps (ā). Ouvrez la bouche et prolongez.',
    badge: 'الصفحة 2 • المد بالألف',
    themeColor: 'amber',
    words: [
      { id: 'w2-1', arabic: 'رَاحَ', syllables: ['رَا', 'حَ'], transliteration: 'rā-ḥa', french: 'Il est allé / parti', english: 'He went' },
      { id: 'w2-2', arabic: 'عَادَ', syllables: ['عَا', 'دَ'], transliteration: 'ʿā-da', french: 'Il est revenu', english: 'He returned' },
      { id: 'w2-3', arabic: 'كَانَ', syllables: ['كَا', 'نَ'], transliteration: 'kā-na', french: 'Il était', english: 'He was' },
      { id: 'w2-4', arabic: 'دَارَ', syllables: ['دَا', 'رَ'], transliteration: 'dā-ra', french: 'Il a tourné / Maison', english: 'He turned / Home' },
      { id: 'w2-5', arabic: 'عَالَ', syllables: ['عَا', 'لَ'], transliteration: 'ʿā-la', french: 'Il a pris en charge', english: 'He provided for' },
      { id: 'w2-6', arabic: 'قَالَ', syllables: ['قَا', 'لَ'], transliteration: 'qā-la', french: 'Il a dit', english: 'He said' },
      { id: 'w2-7', arabic: 'جَارَ', syllables: ['جَا', 'رَ'], transliteration: 'jā-ra', french: 'Voisin / Il a dévié', english: 'Neighbor' },
      { id: 'w2-8', arabic: 'حَارَ', syllables: ['حَا', 'رَ'], transliteration: 'ḥā-ra', french: 'Il a hésité', english: 'He was perplexed' },
      { id: 'w2-9', arabic: 'طَارَ', syllables: ['طَا', 'رَ'], transliteration: 'ṭā-ra', french: 'Il a volé (dans l’air)', english: 'He flew' },
      { id: 'w2-10', arabic: 'صَاحَ', syllables: ['صَا', 'حَ'], transliteration: 'ṣā-ḥa', french: 'Il a crié', english: 'He shouted' },
      { id: 'w2-11', arabic: 'شَابَ', syllables: ['شَا', 'بَ'], transliteration: 'shā-ba', french: 'Jeune homme / Il a grisonné', english: 'He grew gray' },
      { id: 'w2-12', arabic: 'سَارَ', syllables: ['سَا', 'رَ'], transliteration: 'sā-ra', french: 'Il a marché', english: 'He walked' },
      { id: 'w2-13', arabic: 'بَاعَ', syllables: ['بَا', 'عَ'], transliteration: 'bā-ʿa', french: 'Il a vendu', english: 'He sold' },
      { id: 'w2-14', arabic: 'خَافَ', syllables: ['خَا', 'فَ'], transliteration: 'khā-fa', french: 'Il a eu peur', english: 'He feared' },
      { id: 'w2-15', arabic: 'تَابَ', syllables: ['تَا', 'بَ'], transliteration: 'tā-ba', french: 'Il s’est repenti', english: 'He repented' },
      { id: 'w2-16', arabic: 'قَامَ', syllables: ['قَا', 'مَ'], transliteration: 'qā-ma', french: 'Il s’est levé / dressé', english: 'He stood up' },
    ],
  },

  // ================= 3. قراءة كلمات بسيطة بالحركات الثلاث =================
  {
    id: 'tri-harakat',
    pageNumber: 3,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ بَسِيطَةٍ بِالحَرَكَاتِ الثَّلَاث',
    titleFr: 'Mots avec les 3 voyelles (ḍamma, kasra, fatḥa)',
    titleEn: 'Words with 3 Short Vowels (u, i, a)',
    ruleExplanationAr: 'كلمات مبنية للمجهول تجمع الضمة والكسرة والفتحة (فُعِلَ)، دقة نطق كل حركة.',
    ruleExplanationFr: 'Forme passive (Fuʿila) combinant la Damma (ou), Kasra (i) et Fatha (a).',
    badge: 'الصفحة 3 • الحركات الثلاث',
    themeColor: 'emerald',
    words: [
      { id: 'w3-1', arabic: 'رُسِمَ', syllables: ['رُ', 'سِ', 'مَ'], transliteration: 'ru-si-ma', french: 'A été dessiné', english: 'It was drawn' },
      { id: 'w3-2', arabic: 'دُرِسَ', syllables: ['دُ', 'رِ', 'سَ'], transliteration: 'du-ri-sa', french: 'A été étudié', english: 'It was studied' },
      { id: 'w3-3', arabic: 'حُمِدَ', syllables: ['حُ', 'مِ', 'دَ'], transliteration: 'ḥu-mi-da', french: 'A été loué', english: 'It was praised' },
      { id: 'w3-4', arabic: 'كُسِرَ', syllables: ['كُ', 'سِ', 'رَ'], transliteration: 'ku-si-ra', french: 'A été cassé / brisé', english: 'It was broken' },
      { id: 'w3-5', arabic: 'جُرِحَ', syllables: ['جُ', 'رِ', 'حَ'], transliteration: 'ju-ri-ḥa', french: 'A été blessé', english: 'He was wounded' },
      { id: 'w3-6', arabic: 'شُرِبَ', syllables: ['شُ', 'رِ', 'بَ'], transliteration: 'shu-ri-ba', french: 'A été bu', english: 'It was drunk' },
      { id: 'w3-7', arabic: 'شُرِحَ', syllables: ['شُ', 'رِ', 'حَ'], transliteration: 'shu-ri-ḥa', french: 'A été expliqué', english: 'It was explained' },
      { id: 'w3-8', arabic: 'لُعِبَ', syllables: ['لُ', 'عِ', 'بَ'], transliteration: 'lu-ʿi-ba', french: 'A été joué', english: 'It was played' },
      { id: 'w3-9', arabic: 'أُكِلَ', syllables: ['أُ', 'كِ', 'لَ'], transliteration: 'u-ki-la', french: 'A été mangé', english: 'It was eaten' },
      { id: 'w3-10', arabic: 'سُمِعَ', syllables: ['سُ', 'مِ', 'عَ'], transliteration: 'su-mi-ʿa', french: 'A été entendu', english: 'It was heard' },
      { id: 'w3-11', arabic: 'دُخِلَ', syllables: ['دُ', 'خِ', 'لَ'], transliteration: 'du-khi-la', french: 'A été pénétré / entré', english: 'It was entered' },
      { id: 'w3-12', arabic: 'جُمِلَ', syllables: ['جُ', 'مِ', 'لَ'], transliteration: 'ju-mi-la', french: 'A été embelli / résumé', english: 'It was summarized' },
      { id: 'w3-13', arabic: 'هُرِبَ', syllables: ['هُ', 'رِ', 'بَ'], transliteration: 'hu-ri-ba', french: 'A été fui', english: 'It was fled' },
      { id: 'w3-14', arabic: 'مُسِحَ', syllables: ['مُ', 'سِ', 'حَ'], transliteration: 'mu-si-ḥa', french: 'A été essuyé', english: 'It was wiped' },
      { id: 'w3-15', arabic: 'سُكِبَ', syllables: ['سُ', 'كِ', 'بَ'], transliteration: 'su-ki-ba', french: 'A été versé', english: 'It was poured' },
      { id: 'w3-16', arabic: 'عُرِفَ', syllables: ['عُ', 'رِ', 'فَ'], transliteration: 'ʿu-ri-fa', french: 'A été reconnu / su', english: 'It was known' },
    ],
  },

  // ================= 4. قراءة كلمات ممدودة بالواو =================
  {
    id: 'madd-waw',
    pageNumber: 4,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ مَمْدُودَةٍ بِالوَاو',
    titleFr: 'Mots avec voyelle longue Wāw (ū)',
    titleEn: 'Words with Long Vowel Wāw (ū)',
    ruleExplanationAr: 'المد بالواو صوت طويل مضموم الشفتين حركتين (ـُو)، ضم الشفتين ومُدّ الصوت.',
    ruleExplanationFr: 'La voyelle longue Wāw allonge le son "ou" sur 2 temps (ū). Arrondissez les lèvres.',
    badge: 'الصفحة 4 • المد بالواو',
    themeColor: 'sky',
    words: [
      { id: 'w4-1', arabic: 'كُوخ', syllables: ['كُو', 'خْ'], transliteration: 'kūkh', french: 'Cabane / Chaumière', english: 'Hut / Cabin' },
      { id: 'w4-2', arabic: 'فُول', syllables: ['فُو', 'لْ'], transliteration: 'fūl', french: 'Fèves', english: 'Fava beans' },
      { id: 'w4-3', arabic: 'حُور', syllables: ['حُو', 'رْ'], transliteration: 'ḥūr', french: 'Peupliers / Houri', english: 'Houries' },
      { id: 'w4-4', arabic: 'سُوق', syllables: ['سُو', 'قْ'], transliteration: 'sūq', french: 'Marché / Souk', english: 'Market' },
      { id: 'w4-5', arabic: 'لُوط', syllables: ['لُو', 'طْ'], transliteration: 'lūṭ', french: 'Prophète Loth', english: 'Lot' },
      { id: 'w4-6', arabic: 'سُور', syllables: ['سُو', 'رْ'], transliteration: 'sūr', french: 'Mur / Rempart', english: 'Wall / Fence' },
      { id: 'w4-7', arabic: 'صُوف', syllables: ['صُو', 'فْ'], transliteration: 'ṣūf', french: 'Laine', english: 'Wool' },
      { id: 'w4-8', arabic: 'نُور', syllables: ['نُو', 'رْ'], transliteration: 'nūr', french: 'Lumière', english: 'Light' },
      { id: 'w4-9', arabic: 'صُفُوف', syllables: ['صُ', 'فُو', 'فْ'], transliteration: 'ṣu-fūf', french: 'Classes / Rangées', english: 'Rows / Classes' },
      { id: 'w4-10', arabic: 'شُرُوق', syllables: ['شُ', 'رُو', 'قْ'], transliteration: 'shu-rūq', french: 'Lever du soleil', english: 'Sunrise' },
      { id: 'w4-11', arabic: 'خَرُوف', syllables: ['خَ', 'رُو', 'فْ'], transliteration: 'kha-rūf', french: 'Mouton / Bélier', english: 'Sheep / Lamb' },
      { id: 'w4-12', arabic: 'حُبُوب', syllables: ['حُ', 'بُو', 'بْ'], transliteration: 'ḥu-būb', french: 'Graines / Céréales', english: 'Grains / Seeds' },
      { id: 'w4-13', arabic: 'فُرُوق', syllables: ['فُ', 'رُو', 'قْ'], transliteration: 'fu-rūq', french: 'Différences', english: 'Differences' },
      { id: 'w4-14', arabic: 'شُعُور', syllables: ['شُ', 'عُو', 'رْ'], transliteration: 'shu-ʿūr', french: 'Sentiment / Cheveux', english: 'Feeling' },
      { id: 'w4-15', arabic: 'جُرُوح', syllables: ['جُ', 'رُو', 'حْ'], transliteration: 'ju-rūḥ', french: 'Blessures', english: 'Wounds' },
      { id: 'w4-16', arabic: 'غُرُوب', syllables: ['غُ', 'رُو', 'بْ'], transliteration: 'ghu-rūb', french: 'Coucher du soleil', english: 'Sunset' },
      { id: 'w4-17', arabic: 'خُلُود', syllables: ['خُ', 'لُو', 'دْ'], transliteration: 'khu-lūd', french: 'Immortalité / Éternité', english: 'Eternity' },
      { id: 'w4-18', arabic: 'عَرُوس', syllables: ['عَ', 'رُو', 'سْ'], transliteration: 'ʿa-rūs', french: 'Mariée', english: 'Bride' },
      { id: 'w4-19', arabic: 'زُهُور', syllables: ['زُ', 'هُو', 'رْ'], transliteration: 'zu-hūr', french: 'Fleurs', english: 'Flowers' },
      { id: 'w4-20', arabic: 'وُرُود', syllables: ['وُ', 'رُو', 'دْ'], transliteration: 'wu-rūd', french: 'Roses', english: 'Roses' },
    ],
  },

  // ================= 5. قراءة كلمات ممدودة بالياء =================
  {
    id: 'madd-yaa',
    pageNumber: 5,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ مَمْدُودَةٍ بِاليَاء',
    titleFr: 'Mots avec voyelle longue Yā’ (ī)',
    titleEn: 'Words with Long Vowel Yā’ (ī)',
    ruleExplanationAr: 'المد بالياء صوت طويل مكسور حركتين (ـِي)، اخفض الفك الأسفل ومُدّ الصوت.',
    ruleExplanationFr: 'La voyelle longue Yā’ allonge le son "i" sur 2 temps (ī). Abaissez la mâchoire.',
    badge: 'الصفحة 5 • المد بالياء',
    themeColor: 'purple',
    words: [
      { id: 'w5-1', arabic: 'كَبِير', syllables: ['كَ', 'بِي', 'رْ'], transliteration: 'ka-bīr', french: 'Grand', english: 'Big / Large' },
      { id: 'w5-2', arabic: 'خَبِير', syllables: ['خَ', 'بِي', 'رْ'], transliteration: 'kha-bīr', french: 'Expert / Spécialiste', english: 'Expert' },
      { id: 'w5-3', arabic: 'حَرِير', syllables: ['حَ', 'رِي', 'رْ'], transliteration: 'ḥa-rīr', french: 'Soie', english: 'Silk' },
      { id: 'w5-4', arabic: 'سَرِير', syllables: ['سَ', 'رِي', 'رْ'], transliteration: 'sa-rīr', french: 'Lit', english: 'Bed' },
      { id: 'w5-5', arabic: 'صَغِير', syllables: ['صَ', 'غِي', 'رْ'], transliteration: 'ṣa-ghīr', french: 'Petit', english: 'Small / Little' },
      { id: 'w5-6', arabic: 'سَرِيع', syllables: ['سَ', 'رِي', 'عْ'], transliteration: 'sa-rīʿ', french: 'Rapide', english: 'Fast / Quick' },
      { id: 'w5-7', arabic: 'نَشِيط', syllables: ['نَ', 'شِي', 'طْ'], transliteration: 'na-shīṭ', french: 'Actif / Dynamique', english: 'Active' },
      { id: 'w5-8', arabic: 'سَعِيد', syllables: ['سَ', 'عِي', 'دْ'], transliteration: 'sa-ʿīd', french: 'Heureux / Joyeux', english: 'Happy' },
      { id: 'w5-9', arabic: 'قَرِيب', syllables: ['قَ', 'رِي', 'بْ'], transliteration: 'qa-rīb', french: 'Proche / Près', english: 'Near / Close' },
      { id: 'w5-10', arabic: 'جَمِيل', syllables: ['جَ', 'مِي', 'لْ'], transliteration: 'ja-mīl', french: 'Beau / Joli', english: 'Beautiful' },
      { id: 'w5-11', arabic: 'قَصِير', syllables: ['قَ', 'صِي', 'رْ'], transliteration: 'qa-ṣīr', french: 'Court / Petit de taille', english: 'Short' },
      { id: 'w5-12', arabic: 'طَوِيل', syllables: ['طَ', 'وِي', 'لْ'], transliteration: 'ṭa-wīl', french: 'Grand / Long', english: 'Tall / Long' },
      { id: 'w5-13', arabic: 'حَرِيق', syllables: ['حَ', 'رِي', 'قْ'], transliteration: 'ḥa-rīq', french: 'Incendie / Feu', english: 'Fire' },
      { id: 'w5-14', arabic: 'شَقِيق', syllables: ['شَ', 'قِي', 'قْ'], transliteration: 'sha-qīq', french: 'Frère germain', english: 'Brother' },
      { id: 'w5-15', arabic: 'غَرِيب', syllables: ['غَ', 'رِي', 'بْ'], transliteration: 'gha-rīb', french: 'Étrange / Étranger', english: 'Strange / Stranger' },
      { id: 'w5-16', arabic: 'بَعِيد', syllables: ['بَ', 'عِي', 'دْ'], transliteration: 'ba-ʿīd', french: 'Loin / Éloigné', english: 'Far / Distant' },
      { id: 'w5-17', arabic: 'قَدِيم', syllables: ['قَ', 'دِي', 'مْ'], transliteration: 'qa-dīm', french: 'Ancien / Vieux', english: 'Old / Ancient' },
      { id: 'w5-18', arabic: 'جَدِيد', syllables: ['جَ', 'دِي', 'دْ'], transliteration: 'ja-dīd', french: 'Nouveau / Neuf', english: 'New' },
      { id: 'w5-19', arabic: 'وَحِيد', syllables: ['وَ', 'حِي', 'دْ'], transliteration: 'wa-ḥīd', french: 'Seul / Unique', english: 'Alone / Unique' },
      { id: 'w5-20', arabic: 'سَلِيم', syllables: ['سَ', 'لِي', 'مْ'], transliteration: 'sa-līm', french: 'Sain / En bonne santé', english: 'Sound / Healthy' },
    ],
  },

  // ================= 6. قراءة كلمات بالمقطع الساكن =================
  {
    id: 'sukoon-syllable',
    pageNumber: 6,
    titleAr: 'قِرَاءَةُ كَلِمَاتٍ بِالمَقْطَعِ السَّاكِن',
    titleFr: 'Mots avec syllabe fermée (Soukoūn)',
    titleEn: 'Words with Sukoon / Closed Syllable',
    ruleExplanationAr: 'المقطع الساكن حرف متحرك يليه حرف ساكن (مَلْـ / مَسْـ)، يُنطقان معاً دفعة واحدة.',
    ruleExplanationFr: 'La consonne portant le Soukoūn s’accroche à la consonne précédente en un seul souffle.',
    badge: 'الصفحة 6 • المقطع الساكن',
    themeColor: 'indigo',
    words: [
      { id: 'w6-1', arabic: 'أَرْنَبُ', syllables: ['أَرْ', 'نَ', 'بُ'], transliteration: 'ar-na-bu', french: 'Lapin', english: 'Rabbit' },
      { id: 'w6-2', arabic: 'مَلْعَبُ', syllables: ['مَلْ', 'عَ', 'بُ'], transliteration: 'mal-ʿa-bu', french: 'Terrain de jeu / Stade', english: 'Playground / Stadium' },
      { id: 'w6-3', arabic: 'مَكْتَبُ', syllables: ['مَكْ', 'تَ', 'بُ'], transliteration: 'mak-ta-bu', french: 'Bureau', english: 'Desk / Office' },
      { id: 'w6-4', arabic: 'مَسْجِدُ', syllables: ['مَسْ', 'جِ', 'دُ'], transliteration: 'mas-ji-du', french: 'Mosquée', english: 'Mosque' },
      { id: 'w6-5', arabic: 'مَطْبَخُ', syllables: ['مَطْ', 'بَ', 'خُ'], transliteration: 'maṭ-ba-khu', french: 'Cuisine', english: 'Kitchen' },
      { id: 'w6-6', arabic: 'كُرْسِيُّ', syllables: ['كُرْ', 'سِي', 'يُّ'], transliteration: 'kur-siy-yu', french: 'Chaise', english: 'Chair' },
      { id: 'w6-7', arabic: 'طِفْلُ', syllables: ['طِفْ', 'لُ'], transliteration: 'ṭif-lu', french: 'Enfant', english: 'Child' },
      { id: 'w6-8', arabic: 'تَمْرُ', syllables: ['تَمْ', 'رُ'], transliteration: 'tam-ru', french: 'Dattes', english: 'Dates' },
      { id: 'w6-9', arabic: 'زَهْرَةُ', syllables: ['زَهْ', 'رَ', 'ةُ'], transliteration: 'zah-ra-tu', french: 'Fleur', english: 'Flower' },
      { id: 'w6-10', arabic: 'ثَعْلَبُ', syllables: ['ثَعْ', 'لَ', 'بُ'], transliteration: 'thaʿ-la-bu', french: 'Renard', english: 'Fox' },
      { id: 'w6-11', arabic: 'كَلْبُ', syllables: ['كَلْ', 'بُ'], transliteration: 'kal-bu', french: 'Chien', english: 'Dog' },
      { id: 'w6-12', arabic: 'مَسْبَحُ', syllables: ['مَسْ', 'بَ', 'حُ'], transliteration: 'mas-ba-ḥu', french: 'Piscine', english: 'Swimming pool' },
      { id: 'w6-13', arabic: 'طَبْلُ', syllables: ['طَبْ', 'لُ'], transliteration: 'ṭab-lu', french: 'Tambour', english: 'Drum' },
      { id: 'w6-14', arabic: 'شَمْعَةُ', syllables: ['شَمْ', 'عَ', 'ةُ'], transliteration: 'sham-ʿa-tu', french: 'Bougie', english: 'Candle' },
      { id: 'w6-15', arabic: 'دِبْسُ', syllables: ['دِبْ', 'سُ'], transliteration: 'dib-su', french: 'Mélasse / Sirop de datte', english: 'Date syrup / Molasses' },
      { id: 'w6-16', arabic: 'عَيْنُ', syllables: ['عَيْ', 'نُ'], transliteration: 'ʿay-nu', french: 'Œil / Source d’eau', english: 'Eye / Water spring' },
      { id: 'w6-17', arabic: 'لَوْنُ', syllables: ['لَوْ', 'نُ'], transliteration: 'law-nu', french: 'Couleur', english: 'Color' },
      { id: 'w6-18', arabic: 'مَدْرَسَةُ', syllables: ['مَدْ', 'رَ', 'سَ', 'ةُ'], transliteration: 'mad-ra-sa-tu', french: 'École', english: 'School' },
      { id: 'w6-19', arabic: 'عُلْبَةُ', syllables: ['عُلْ', 'بَ', 'ةُ'], transliteration: 'ʿul-ba-tu', french: 'Boîte / Conserve', english: 'Box / Container' },
      { id: 'w6-20', arabic: 'خُبْزُ', syllables: ['خُبْ', 'زُ'], transliteration: 'khub-zu', french: 'Pain', english: 'Bread' },
    ],
  },
];
