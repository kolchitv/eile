export interface ChantVerse {
  id: string;
  firstHalfAr: string; // صدر البيت
  secondHalfAr: string; // عجز البيت
  lineAr: string; // البيت كاملاً
  translationFr: string; // الترجمة الفرنسية للبيت
  translitFr?: string; // النطق الصوتي بالحروف اللاتينية
}

export interface ChantVocabItem {
  wordAr: string;
  meaningAr: string;
  meaningFr: string;
}

export interface ChantQuizQuestion {
  id: string;
  questionAr: string;
  questionFr: string;
  options: string[];
  correctIndex: number;
  explanationFr: string;
}

export interface ArabicChant {
  id: string;
  unitNumber: number;
  unitNameAr: string;
  unitNameFr: string;
  titleAr: string;
  titleFr: string;
  subtitleFr: string;
  icon: string;
  level: 'A1' | 'A2';
  themeAr: string;
  themeFr: string;
  summaryAr: string;
  summaryFr: string;
  verses: ChantVerse[];
  vocabulary: ChantVocabItem[];
  quiz: ChantQuizQuestion[];
  pedagogicalObjectivesFr: string[];
}

export const ARABIC_CHANTS_DATA: ArabicChant[] = [
  {
    id: 'chant-unit-5-water',
    unitNumber: 5,
    unitNameAr: 'الوحدة الخامسة (Unité 5 - EILE)',
    unitNameFr: 'Unité 5 - Enseignements Internationaux des Langues Étrangères',
    titleAr: 'حَفْنَةُ مَاءٍ',
    titleFr: 'Une poignée d’eau',
    subtitleFr: 'Chant poétique sur le cycle de l’eau et la nature (EILE Unité 5)',
    icon: '💧',
    level: 'A1',
    themeAr: 'الماء، الطبيعة، المطر، ودورة الحياة',
    themeFr: 'L’eau, la pluie, la nature et le cycle de vie',
    summaryAr: 'أنشودة شعرية عذبة تحكي رحلة قطرات الماء من البحر إلى السحاب ثم هطول المطر لترقص الأشجار فرحاً بالحياة.',
    summaryFr: 'Un poème mélodieux racontant le voyage d’une goutte d’eau, de la mer vers les nuages, jusqu’à sa douce retombée en pluie fertilisant la terre.',
    pedagogicalObjectivesFr: [
      'Apprendre le vocabulaire poétique lié à la météo et à l’eau (مَاء، سُحُب، مَطَر، بَحْر، شَجَر).',
      'Maîtriser le rythme prosodique arabe (القافية والروي) et la musicalité de la langue.',
      'S’entraîner à la lecture expressive et au chant choral.',
    ],
    verses: [
      {
        id: 'v5-1',
        firstHalfAr: 'حَفْنَةُ مَاءٍ',
        secondHalfAr: 'ذَاتَ مَسَاءِ',
        lineAr: 'حَفْنَةُ مَاءٍ ذَاتَ مَسَاءِ',
        translationFr: 'Une poignée d’eau, un soir tombant,',
        translitFr: 'Ḥafnatu mā’in dhāta masā’',
      },
      {
        id: 'v5-2',
        firstHalfAr: 'طَارَتْ خَلْفَ',
        secondHalfAr: 'طُيُورِ الْمَاءِ',
        lineAr: 'طَارَتْ خَلْفَ طُيُورِ الْمَاءِ',
        translationFr: 'S’envola derrière les oiseaux de mer.',
        translitFr: 'Ṭārat khalfa ṭuyūri l-mā’',
      },
      {
        id: 'v5-3',
        firstHalfAr: 'قَدْ وَدَّعَتِ الْبَحْرَ',
        secondHalfAr: 'وَطَارَتْ حَتَّى ضَاعَتْ فِي الأَجْوَاءِ',
        lineAr: 'قَدْ وَدَّعَتِ الْبَحْرَ وَطَارَتْ حَتَّى ضَاعَتْ فِي الأَجْوَاءِ',
        translationFr: 'Elle a fait ses adieux à la mer et vola jusqu’à se fondre dans les cieux.',
        translitFr: 'Qad wadda‘ati l-baḥra wa-ṭārat ḥattā ḍā‘at fī l-ajwā’',
      },
      {
        id: 'v5-4',
        firstHalfAr: 'صَارَتْ سُحُباً فَوْقَ الأَرْضِ',
        secondHalfAr: 'لَيْسَتْ تَدْرِي أَيْنَ سَتَمْضِي',
        lineAr: 'صَارَتْ سُحُباً فَوْقَ الأَرْضِ لَيْسَتْ تَدْرِي أَيْنَ سَتَمْضِي',
        translationFr: 'Elle devint nuages au-dessus de la terre, ne sachant où ses pas la mèneraient.',
        translitFr: 'Ṣārat suḥuban fawqa l-arḍi laysat tadrī ayna satamḍī',
      },
      {
        id: 'v5-5',
        firstHalfAr: 'عَنْ قِصَّتِهَا رَاحَتْ تَحْكِي',
        secondHalfAr: 'مِنْ رِقَّتِهَا أَخَذَتْ تَبْكِي',
        lineAr: 'عَنْ قِصَّتِهَا رَاحَتْ تَحْكِي مِنْ رِقَّتِهَا أَخَذَتْ تَبْكِي',
        translationFr: 'Elle se mit à conter son histoire, et dans sa grande tendresse, se mit à pleurer.',
        translitFr: '‘An qiṣṣatihā rāḥat taḥkī, min riqqatihā akhadhat tabkī',
      },
      {
        id: 'v5-6',
        firstHalfAr: 'وَإِذَا الدَّمْعُ يُصْبِحُ مَطَراً',
        secondHalfAr: 'فَوْقَ تِلاَلِ الأَرْضِ انْهَمَرَ',
        lineAr: 'وَإِذَا الدَّمْعُ يُصْبِحُ مَطَراً فَوْقَ تِلاَلِ الأَرْضِ انْهَمَرَ',
        translationFr: 'Et voilà que ses larmes devinrent pluie, ruisselant sur les collines de la terre.',
        translitFr: 'Wa-idha d-dam‘u yuṣbiḥu maṭaran, fawqa tilāli l-arḍi nhamar',
      },
      {
        id: 'v5-7',
        firstHalfAr: 'وَإِذَا الْمَطَرُ عَذْبٌ عَطِرٌ',
        secondHalfAr: 'لَمَّا انْسَكَبَ رَقَصَ الشَّجَرُ',
        lineAr: 'وَإِذَا الْمَطَرُ عَذْبٌ عَطِرٌ لَمَّا انْسَكَبَ رَقَصَ الشَّجَرُ',
        translationFr: 'Et voilà une pluie douce et parfumée : lorsqu’elle s’est déversée, les arbres ont dansé !',
        translitFr: 'Wa-idha l-maṭaru ‘adhbun ‘aṭirun, lammā nsakaba raqaṣa sh-shajar',
      },
    ],
    vocabulary: [
      { wordAr: 'حَفْنَةٌ', meaningAr: 'مِلْءُ الْكَفَّيْنِ مِنَ الشَّيْءِ', meaningFr: 'Une poignée / une brassée' },
      { wordAr: 'الأَجْوَاءُ', meaningAr: 'الْفَضَاءُ وَالسَّمَاءُ الْعَالِيَةُ', meaningFr: 'L’atmosphère / les cieux' },
      { wordAr: 'سُحُباً', meaningAr: 'غُيُوماً فِي السَّمَاءِ', meaningFr: 'Des nuages' },
      { wordAr: 'رِقَّتِهَا', meaningAr: 'لُطْفِهَا وَعُذُوبَتِهَا وَإِحْسَاسِهَا الْمُرْهَفِ', meaningFr: 'Sa délicatesse / sa tendresse' },
      { wordAr: 'انْهَمَرَ', meaningAr: 'تَدَفَّقَ وَنَزَلَ بِغَزَارَةٍ وَقُوَّةٍ', meaningFr: 'S’est déversé / a coulé à flots' },
      { wordAr: 'عَذْبٌ عَطِرٌ', meaningAr: 'طَيِّبُ الْمَذَاقِ ذُو رَائِحَةٍ زَكِيَّةٍ', meaningFr: 'Doux et agréablement parfumé' },
      { wordAr: 'انْسَكَبَ', meaningAr: 'جَرَى وَصُبَّ عَلَى التُّرَابِ', meaningFr: 'S’est répandu / a coulé' },
    ],
    quiz: [
      {
        id: 'q5-1',
        questionAr: 'مَاذَا حَدَثَ لِحَفْنَةِ الْمَاءِ عِنْدَمَا طَارَتْ فِي الأَجْوَاءِ؟',
        questionFr: 'Qu’est-il arrivé à la poignée d’eau dans les airs ?',
        options: ['صَارَتْ سُحُباً فَوْقَ الأَرْضِ', 'تَجَمَّدَتْ وَصَارَتْ ثَلْجاً', 'غَرِقَتْ فِي أَعْمَاقِ الْبَحْرِ', 'اخْتَفَتْ إِلَى الأَبَدِ'],
        correctIndex: 0,
        explanationFr: 'Dans le poème : « صَارَتْ سُحُباً فَوْقَ الأَرْضِ » (Elle devint des nuages).',
      },
      {
        id: 'q5-2',
        questionAr: 'مَاذَا فَعَلَ الشَّجَرُ لَمَّا انْسَكَبَ الْمَطَرُ الْعَذْبُ الْعَطِرُ؟',
        questionFr: 'Qu’ont fait les arbres lorsque la pluie s’est déversée ?',
        options: ['رَقَصَ الشَّجَرُ فَرَحاً', 'سَقَطَتْ أَوْرَاقُهُ', 'جَفَّتْ أَغْصَانُهُ', 'نَامَ الشَّجَرُ'],
        correctIndex: 0,
        explanationFr: 'Dans le dernier vers : « لَمَّا انْسَكَبَ رَقَصَ الشَّجَرُ » (Les arbres ont dansé de joie).',
      },
    ],
  },
  {
    id: 'chant-unit-3-arabic-language',
    unitNumber: 3,
    unitNameAr: 'الوحدة الثالثة (Unité 3 - EILE)',
    unitNameFr: 'Unité 3 - Enseignements Internationaux des Langues Étrangères',
    titleAr: 'لُغَتِي الْعَرَبِيَّةُ',
    titleFr: 'Ma Langue Arabe',
    subtitleFr: 'Chant d’amour de la langue arabe, de l’écriture et du savoir (EILE Unité 3)',
    icon: '📖',
    level: 'A1',
    themeAr: 'اللغة العربية، الحروف، المدرسة، الفن والوطن',
    themeFr: 'La langue arabe, l’alphabet, l’école, les arts et la patrie',
    summaryAr: 'أنشودة بهيجة تُبرز جمال لغة الضاد، وتدعو الأطفال للقراءة والرسم بالفرشاة وتزيين الحروف بالألوان وبناء الوطن بالعلم والحب.',
    summaryFr: 'Un hymne chaleureux célébrant la beauté de la langue arabe, invitant les écoliers à écrire, lire, peindre leurs rêves et servir leur pays par le savoir.',
    pedagogicalObjectivesFr: [
      'Apprendre les noms de lettres et leur épellation poétique (ب، ل، د، ي = بَلَدِي / ر، و، ح، ي = رُوحِي / ع، ل، م، ي = عِلْمِي).',
      'Enrichir le lexique scolaire et artistique (قَلَم، فُرْشَاة، كُتُب، أَلْوَان، مَدْرَسَة، أَصْحَاب).',
      'Développer l’attachement aux valeurs du savoir, de l’amour et du partage.',
    ],
    verses: [
      {
        id: 'v3-1',
        firstHalfAr: 'لُغَتِي لُغَتِي مَا أَحْلاَهَا',
        secondHalfAr: 'لُغَتِي الْعَرَبِيَّة',
        lineAr: 'لُغَتِي لُغَتِي مَا أَحْلاَهَا لُغَتِي الْعَرَبِيَّة',
        translationFr: 'Ma langue, ô ma langue, qu’elle est douce ! Ma belle langue arabe !',
        translitFr: 'Lughatī lughatī mā aḥlāhā, lughatī l-‘arabiyyah',
      },
      {
        id: 'v3-2',
        firstHalfAr: 'أَكْتُبُ حَرْفِي',
        secondHalfAr: 'أَقْرَأُ كُتُبِي',
        lineAr: 'أَكْتُبُ حَرْفِي أَقْرَأُ كُتُبِي',
        translationFr: 'J’écris mes lettres, je lis mes livres,',
        translitFr: 'Aktubu ḥarfī, aqra’u kutubī',
      },
      {
        id: 'v3-3',
        firstHalfAr: 'أُغَنِّي',
        secondHalfAr: 'أُغْنِيَّة',
        lineAr: 'أُغَنِّي أُغْنِيَّة',
        translationFr: 'Et j’entonne une joyeuse chanson !',
        translitFr: 'Ughannī ughniyyah',
      },
      {
        id: 'v3-4',
        firstHalfAr: 'أَكْتُبُ أَلِفاً',
        secondHalfAr: 'أَكْتُبُ بَاءً',
        lineAr: 'أَكْتُبُ أَلِفاً أَكْتُبُ بَاءً',
        translationFr: 'J’écris un Alif, j’écris un Bā’,',
        translitFr: 'Aktubu alifan, aktubu bā’an',
      },
      {
        id: 'v3-5',
        firstHalfAr: 'أَقْرَأُ',
        secondHalfAr: 'كَلِمَاتِي',
        lineAr: 'أَقْرَأُ كَلِمَاتِي',
        translationFr: 'Et je lis distinctement mes mots.',
        translitFr: 'Aqra’u kalimātī',
      },
      {
        id: 'v3-6',
        firstHalfAr: 'أُمْسِكُ قَلَمِي وَبِفُرْشَاتِي',
        secondHalfAr: 'أَرْسُمُ أَحْلاَمِي',
        lineAr: 'أُمْسِكُ قَلَمِي وَبِفُرْشَاتِي أَرْسُمُ أَحْلاَمِي',
        translationFr: 'Je tiens mon crayon et avec mon pinceau, je peins mes rêves.',
        translitFr: 'Umsiku qalamī wa-bifurshātī arsumu aḥlāmī',
      },
      {
        id: 'v3-7',
        firstHalfAr: 'وَبِمَدْرَسَتِي مَعَ أَصْحَابِي',
        secondHalfAr: 'تَحْلُو أَيَّامِي',
        lineAr: 'وَبِمَدْرَسَتِي مَعَ أَصْحَابِي تَحْلُو أَيَّامِي',
        translationFr: 'Et dans mon école avec mes amis, mes journées s’illuminent de bonheur.',
        translitFr: 'Wa-bimadrasatī ma‘a aṣ-ḥābī taḥlū ayyāmī',
      },
      {
        id: 'v3-8',
        firstHalfAr: 'هَيَّا نُزَيِّنْ بِالأَلْوَانِ',
        secondHalfAr: 'حُرُوفَ الْعَرَبِيَّة',
        lineAr: 'هَيَّا نُزَيِّنْ بِالأَلْوَانِ حُرُوفَ الْعَرَبِيَّة',
        translationFr: 'Venez, parons de mille couleurs les lettres de l’arabe !',
        translitFr: 'Hayyā nuzayyin bil-alwān ḥurūfa l-‘arabiyyah',
      },
      {
        id: 'v3-9',
        firstHalfAr: 'بَاءٌ لاَمٌ دَالٌ يَاءٌ',
        secondHalfAr: 'بَلَدِي أَحْمِيهَا',
        lineAr: 'بَاءٌ لاَمٌ دَالٌ يَاءٌ بَلَدِي أَحْمِيهَا',
        translationFr: 'B - L - D - Y : « Mon pays » (Baladī), je le protège !',
        translitFr: 'Bā’un Lāmun Dālun Yā’un : Baladī aḥmīhā',
      },
      {
        id: 'v3-10',
        firstHalfAr: 'رَاءٌ وَاوٌ حَاءٌ يَاءٌ',
        secondHalfAr: 'رُوحِي تَفْدِيهَا',
        lineAr: 'رَاءٌ وَاوٌ حَاءٌ يَاءٌ رُوحِي تَفْدِيهَا',
        translationFr: 'R - W - Ḥ - Y : « Mon âme » (Rūḥī), lui est dévouée !',
        translitFr: 'Rā’un Wāwun Ḥā’un Yā’un : Rūḥī tafdīhā',
      },
      {
        id: 'v3-11',
        firstHalfAr: 'عَيْنٌ لاَمٌ مِيمٌ يَاءٌ',
        secondHalfAr: 'عِلْمِي يَبْنِيهَا',
        lineAr: 'عَيْنٌ لاَمٌ مِيمٌ يَاءٌ عِلْمِي يَبْنِيهَا',
        translationFr: 'ʿ - L - M - Y : « Mon savoir » (‘Ilmī), le bâtit et l’élève !',
        translitFr: '‘Aynun Lāmun Mīmun Yā’un : ‘Ilmī yabnīhā',
      },
      {
        id: 'v3-12',
        firstHalfAr: 'نَمْلأُ دُنْيَانَا بِالْحُبِّ',
        secondHalfAr: 'لِيَسْعَدَ مَنْ فِيهَا',
        lineAr: 'نَمْلأُ دُنْيَانَا بِالْحُبِّ لِيَسْعَدَ مَنْ فِيهَا',
        translationFr: 'Remplissons notre monde d’amour pour que chacun y vive heureux !',
        translitFr: 'Namla’u dunyānā bil-ḥubbi li-yas‘ada man fīhā',
      },
      {
        id: 'v3-13',
        firstHalfAr: 'لُغَتِي لُغَتِي مَا أَحْلاَهَا',
        secondHalfAr: 'لُغَتِي الْعَرَبِيَّة',
        lineAr: 'لُغَتِي لُغَتِي مَا أَحْلاَهَا لُغَتِي الْعَرَبِيَّة',
        translationFr: 'Ma langue, ô ma langue, qu’elle est douce ! Ma belle langue arabe !',
        translitFr: 'Lughatī lughatī mā aḥlāhā, lughatī l-‘arabiyyah',
      },
    ],
    vocabulary: [
      { wordAr: 'فُرْشَاتِي', meaningAr: 'أَدَاةُ الرَّسْمِ وَالتَّلْوِينِ بِالأَلْوَانِ', meaningFr: 'Mon pinceau de peinture' },
      { wordAr: 'أَحْلاَمِي', meaningAr: 'أُمْنِيَاتِي وَمَا أَرْغَبُ فِي تَحْقِيقِهِ', meaningFr: 'Mes rêves et aspirations' },
      { wordAr: 'تَحْلُو', meaningAr: 'تَصِيرُ جَمِيلَةً وَمُمْتِعَةً', meaningFr: 'Devient douce et agréable' },
      { wordAr: 'أَحْمِيهَا', meaningAr: 'أُدَافِعُ عَنْهَا وَأَرْعَاهَا', meaningFr: 'Je la protège / je la défends' },
      { wordAr: 'تَفْدِيهَا', meaningAr: 'تُضَحِّي مِنْ أَجْلِهَا بِكُلِّ غَالٍ', meaningFr: 'Lui est dévouée corps et âme' },
      { wordAr: 'عِلْمِي يَبْنِيهَا', meaningAr: 'بِالتَّعَلُّمِ وَالْمَعْرِفَةِ نَبْنِي الأَوْطَانَ', meaningFr: 'Mon savoir la bâtit' },
    ],
    quiz: [
      {
        id: 'q3-1',
        questionAr: 'مَا هِيَ الْكَلِمَةُ الْمُشَكَّلَةُ مِنَ الْحُرُوفِ: (بَاءٌ لاَمٌ دَالٌ يَاءٌ)؟',
        questionFr: 'Quel mot est formé par les lettres : Bā’ - Lām - Dāl - Yā’ ?',
        options: ['بَلَدِي', 'بَابِي', 'بَيْتِي', 'بُسْتَانِي'],
        correctIndex: 0,
        explanationFr: 'ب + ل + د + ي = بَلَدِي (Mon pays).',
      },
      {
        id: 'q3-2',
        questionAr: 'بِمَاذَا يَبْنِي الطِّفْلُ وَطَنَهُ حَسَبَ أَبْيَاتِ النَّشِيدِ؟',
        questionFr: 'Avec quoi l’enfant bâtit-il son pays selon le chant ?',
        options: ['بِالْعِلْمِ (عِلْمِي يَبْنِيهَا)', 'بِالأَلْعَابِ', 'بِالنَّوْمِ', 'بِالْمَالِ فَقَطْ'],
        correctIndex: 0,
        explanationFr: 'Le poème affirme : « عَيْنٌ لاَمٌ مِيمٌ يَاءٌ ... عِلْمِي يَبْنِيهَا » (Mon savoir le bâtit).',
      },
    ],
  },
  {
    id: 'chant-unit-2-my-kitten',
    unitNumber: 2,
    unitNameAr: 'الوحدة الثانية (Unité 2 - EILE)',
    unitNameFr: 'Unité 2 - Enseignements Internationaux des Langues Étrangères',
    titleAr: 'قِطَّتِي صَغِيرَة',
    titleFr: 'Ma Petite Chatte',
    subtitleFr: 'Comptine enfantine rythmée sur les animaux de compagnie (EILE Unité 2)',
    icon: '🐱',
    level: 'A1',
    themeAr: 'الحيوانات الأليفة، القطة، اللعب والمرح',
    themeFr: 'Les animaux de compagnie, le chaton, le jeu et l’amitié',
    summaryAr: 'أنشودة طفولية رقيقة تصف القطة الصغيرة «نَمِيرَة» ذات الشعر الجميل والذيل الطويل ومهارتها في اللعب.',
    summaryFr: 'Une comptine entraînante décrivant la petite chatte « Namira » avec son beau pelage soyeux, sa longue queue et son habileté espiègle.',
    pedagogicalObjectivesFr: [
      'Apprendre le vocabulaire descriptif des animaux (قِطَّة، شَعْر، ذَيْل، صَغِيرَة، طَوِيل، جَمِيل).',
      'Pratiquer les rimes jumelées en -َة (-ira) et -يل (-il) et -ِّي (-lī).',
      'Associer le geste, le mime corporel et le rythme musical.',
    ],
    verses: [
      {
        id: 'v2-1',
        firstHalfAr: 'قِطَّتِي صَغِيرَة',
        secondHalfAr: 'وَاسْمُهَا نَمِيرَة',
        lineAr: 'قِطَّتِي صَغِيرَة وَاسْمُهَا نَمِيرَة',
        translationFr: 'Ma petite chatte est si mignonne, et elle s’appelle Namira !',
        translitFr: 'Qiṭṭatī ṣaghīrah, wa-smuhā Namīrah',
      },
      {
        id: 'v2-2',
        firstHalfAr: 'شَعْرُهَا جَمِيل',
        secondHalfAr: 'ذَيْلُهَا طَوِيل',
        lineAr: 'شَعْرُهَا جَمِيل ذَيْلُهَا طَوِيل',
        translationFr: 'Son pelage est soyeux et beau, et sa queue est longue.',
        translitFr: 'Sha‘ruhā jamīl, dhayluhā ṭawīl',
      },
      {
        id: 'v2-3',
        firstHalfAr: 'لَعْبُهَا يُسَلِّي',
        secondHalfAr: 'هِيَ لِي كَظِلِّي',
        lineAr: 'لَعْبُهَا يُسَلِّي هِيَ لِي كَظِلِّي',
        translationFr: 'Son jeu est si distrayant, elle me suit partout comme mon ombre !',
        translitFr: 'La‘buhā yusallī, hiya lī ka-ẓillī',
      },
      {
        id: 'v2-4',
        firstHalfAr: 'عِنْدَهَا الْمَهَارَة',
        secondHalfAr: 'كَيْ تَصِيدَ فَارَة',
        lineAr: 'عِنْدَهَا الْمَهَارَة كَيْ تَصِيدَ فَارَة',
        translationFr: 'Elle a toute l’adresse et le talent pour attraper une souris !',
        translitFr: '‘Indahā l-mahārah kay taṣīda fārah',
      },
    ],
    vocabulary: [
      { wordAr: 'قِطَّتِي', meaningAr: 'حَيَوَانٌ أَلِيفٌ لَطِيفٌ يُحِبُّ اللَّعِبَ', meaningFr: 'Ma chatte / mon chaton' },
      { wordAr: 'نَمِيرَة', meaningAr: 'اسْمٌ لَطِيفٌ لِلْقِطَّةِ مُشْتَقٌّ مِنَ النَّمِرِ لِجَمَالِ فَرْوِهَا', meaningFr: 'Namira (prénom donné à la chatte, rappelant le pelage tacheté)' },
      { wordAr: 'ذَيْلُهَا', meaningAr: 'ذَنَبُهَا الطَّوِيلُ فِي خَلْفِهَا', meaningFr: 'Sa queue' },
      { wordAr: 'يُسَلِّي', meaningAr: 'يَبْعَثُ عَلَى الْمَرَحِ وَالسُّرُورِ', meaningFr: 'Distrait / amuse joyeusement' },
      { wordAr: 'كَظِلِّي', meaningAr: 'تَتْبَعُنِي دَائِماً أَيْنَمَا ذَهَبْتُ', meaningFr: 'Comme mon ombre' },
      { wordAr: 'الْمَهَارَة', meaningAr: 'الْحِذْقُ وَالْبَرَاعَةُ وَالسُّرْعَةُ', meaningFr: 'L’habileté / l’adresse' },
      { wordAr: 'تَصِيدَ فَارَة', meaningAr: 'تُمْسِكَ بِالْفَأْرِ بِخِفَّةٍ وَذَكَاءٍ', meaningFr: 'Chasser / attraper une souris' },
    ],
    quiz: [
      {
        id: 'q2-1',
        questionAr: 'مَا هُوَ اسْمُ الْقِطَّةِ فِي الأُنْشُودَةِ؟',
        questionFr: 'Quel est le prénom de la chatte dans la comptine ?',
        options: ['نَمِيرَة', 'بَسْبُوسَة', 'مِيشُو', 'سُكَّرَة'],
        correctIndex: 0,
        explanationFr: 'Le premier vers dit : « قِطَّتِي صَغِيرَة وَاسْمُهَا نَمِيرَة » (Son nom est Namira).',
      },
      {
        id: 'q2-2',
        questionAr: 'كَيْفَ تَصِفُ الأُنْشُودَةُ حَرَكَةَ الْقِطَّةِ وَمُرَافَقَتَهَا لِصَاحِبِهَا؟',
        questionFr: 'Comment le chant décrit-il la fidélité de la chatte accompagnant l’enfant ?',
        options: ['هِيَ لِي كَظِلِّي (تَتْبَعُنِي دَائِماً)', 'تَهْرُبُ فِي الْحَدِيقَةِ', 'تَنَامُ طَوَالَ الْيَوْمِ', 'تَخَافُ مِنَ النَّاسِ'],
        correctIndex: 0,
        explanationFr: 'Le poème dit : « هِيَ لِي كَظِلِّي » (Elle me suit comme mon ombre).',
      },
    ],
  },
];
