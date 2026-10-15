export interface CommunicativeItem {
  id: string;
  level: 'A1' | 'A2' | 'A1-A2';
  categoryKey:
    | 'information'
    | 'opinions'
    | 'emotions'
    | 'activities'
    | 'social_rituals'
    | 'structure_speech'
    | 'structure_interaction';
  subCategoryFr: string;
  subCategoryAr: string;
  standardArabic: string;
  french: string;
  translitFr: string;
  dialectalVariants?: {
    maghreb?: string;
    egypt?: string;
    levant?: string;
    generalNote?: string;
  };
  sampleDialogue?: {
    speakerA: string;
    textA: string;
    speakerB: string;
    textB: string;
  };
  contextNoteFr: string;
}

export interface ThematicNotion {
  id: string;
  number: number;
  titleFr: string;
  titleAr: string;
  icon: string;
  level: 'A1' | 'A2' | 'A1-A2';
  subthemes: {
    nameFr: string;
    nameAr: string;
    words: { ar: string; fr: string; translit?: string; type: 'nom' | 'adj' | 'verbe' | 'locution' }[];
  }[];
}

export const COMMUNICATIVE_FUNCTIONS_DATA: CommunicativeItem[] = [
  // 1. INFORMATIONS
  {
    id: 'f1-1',
    level: 'A1',
    categoryKey: 'information',
    subCategoryFr: '1.1. Identifier des personnes ou des objets',
    subCategoryAr: '1.1. التعريف عن شخص أو شيء',
    standardArabic: 'هَذَا سَمِيرٌ • هَذِهِ صَدِيقَتِي مَرْيَمُ • ذَلِكَ الرَّجُلُ طَبِيبٌ',
    french: 'C’est Samir. Voici mon amie Maryam. Cet homme est médecin.',
    translitFr: 'Hādhā Samīr • Hādhihi ṣadīqatī Maryam • Dhālika r-rajulu ṭabīb',
    dialectalVariants: {
      maghreb: 'هَادَا سَمِير / هَادِي مَرْيَم',
      levant: 'هَيْدَا سَمِير / هَيْدِي مَرْيَم',
      egypt: 'دَه سَمِير / دِي مَرْيَم',
      generalNote: 'Dans les dialectes, le démonstratif se simplifie en [دا / دي / هاد / هيدا].',
    },
    sampleDialogue: {
      speakerA: 'مَنْ هَذَا؟',
      textA: 'مَنْ هَذَا الرَّجُلُ؟',
      speakerB: 'طَالِبٌ',
      textB: 'هُوَ طَالِبٌ جَدِيدٌ فِي مَعْهَدِنَا.',
    },
    contextNoteFr: 'Utilisé pour présenter quelqu’un ou désigner un objet dans la classe ou dans la rue.',
  },
  {
    id: 'f1-2',
    level: 'A1',
    categoryKey: 'information',
    subCategoryFr: '1.3. Décrire un lieu ou une situation',
    subCategoryAr: '1.3. الوصف المكاني والظرفي',
    standardArabic: 'هُنَاكَ سِينَمَا فِي هَذَا الشَّارِعِ • فِي هَذَا الحَيِّ مَطْعَمٌ وَمَكْتَبَةٌ',
    french: 'Il y a un cinéma dans cette rue. Dans ce quartier se trouvent un restaurant et une bibliothèque.',
    translitFr: 'Hunāka sīnamā fī hādhā sh-shāri‘ • Fī hādhā l-ḥayyi maṭ‘amun wa-maktabah',
    dialectalVariants: {
      maghreb: 'كَايْنَة سِينِمَا فْـ هَاد الشَّارِع',
      levant: 'فِيه سِينَمَا بهَالشَّارِع',
      egypt: 'فِيه سِينَمَا فِي الشَّارِع دَه',
      generalNote: 'Équivalent de « il y a » : [كاين / فيه / ثَمّ].',
    },
    contextNoteFr: 'Permet de localiser des commerces et services essentiels.',
  },
  {
    id: 'f1-3',
    level: 'A1-A2',
    categoryKey: 'information',
    subCategoryFr: '1.5. S’informer (Temps, Lieu, Prix, Cause)',
    subCategoryAr: '1.5. الاستعلام والسؤال عن الزمان والمكان والثمن',
    standardArabic: 'كَمِ السَّاعَةُ؟ • أَيْنَ المَتْحَفُ؟ • بِكَمِ السِّرْوَالُ؟ • لِمَاذَا تَجْرِي؟',
    french: 'Quelle heure est-il ? Où est le musée ? Combien coûte le pantalon ? Pourquoi cours-tu ?',
    translitFr: 'Kami s-sā‘ah? • Ayna l-matḥaf? • Bi-kami s-sirwāl? • Limādhā tajrī?',
    dialectalVariants: {
      maghreb: 'شْحَالْ السَّاعَة؟ / فِينْ المَتْحَف؟ / بْشْحَالْ هَاد السِّرْوَال؟ / عْلَاشْ كَتْجْرِي؟',
      levant: 'قَدِّيش السَّاعَة؟ / وَيْن المَتْحَف؟ / بِقَدِّيش هَالبَنْطَلُون؟ / لَيْش عَمْ تِرْكُض؟',
      egypt: 'السَّاعَة كَام؟ / فِين المَتْحَف؟ / بِكَام البَنْطَلُون؟ / لِيه بِتِجْرِي؟',
      generalNote: 'Variations des mots interrogatifs : [شحال / قديش / كام] et [فين / وين] et [علاش / ليش / ليه].',
    },
    sampleDialogue: {
      speakerA: 'الزَّبُونُ',
      textA: 'بِكَمْ هَذَا القَمِيصُ الأَزْرَقُ؟',
      speakerB: 'البَائِعُ',
      textB: 'ثَمَنُهُ عِشْرُونَ دِرْهَماً فَقَطْ.',
    },
    contextNoteFr: 'Les 4 questions clés de la communication quotidienne en pays arabophone.',
  },

  // 2. OPINIONS ET POSITIONS
  {
    id: 'f2-1',
    level: 'A1-A2',
    categoryKey: 'opinions',
    subCategoryFr: '2.2 & 2.4. Exprimer son accord et son approbation',
    subCategoryAr: '2.2 و 2.4. التعبير عن الموافقة والاستحسان',
    standardArabic: 'نَعَمْ، صَحِيحٌ • أَنَا مُوَافِقٌ • فِكْرَةٌ جَمِيلَةٌ • مُمْتَازٌ • عَظِيمٌ',
    french: 'Oui, c’est vrai. Je suis d’accord. Excellente idée ! Parfait ! Formidable !',
    translitFr: 'Na‘am, ṣaḥīḥ • Anā muwāfiq • Fikratun jamīlah • Mumtāz • ‘Aẓīm',
    dialectalVariants: {
      maghreb: 'وَاخَّا / مْزْيَانْ / بَاهِي',
      levant: 'تَمَامْ / مَاشِي / عَالْ',
      egypt: 'تَمَامْ / مَاشِي الحَال / بَرَافُو',
      generalNote: 'Les approbations usuelles : [واخا / مزيان / باهي / ماشي / تمام].',
    },
    contextNoteFr: 'Validation enthousiaste d’une proposition ou d’un projet.',
  },
  {
    id: 'f2-2',
    level: 'A1-A2',
    categoryKey: 'opinions',
    subCategoryFr: '2.14. Exprimer un désir ou un souhait',
    subCategoryAr: '2.14. التعبير عن الرغبة والطلب',
    standardArabic: 'أُرِيدُ عَصِيرَ بُرْتُقَالٍ • أُحِبُّ أَنْ أَشْرَبَ شَايَاً • نَفْسِي فِي...',
    french: 'Je voudrais un jus d’orange. J’aimerais boire un thé. J’ai bien envie de...',
    translitFr: 'Urīdu ‘aṣīra burtuqāl • Uḥibbu an ashraba shāyā',
    dialectalVariants: {
      maghreb: 'بْغِيتْ عَصِيرْ اللِّيمُونْ / نْحِبْ نَشْرَبْ أَتَايْ',
      levant: 'بِدِّي عَصِيرْ بُرْدْقَانْ / نَفْسِي بِشَايْ',
      egypt: 'عَايِزْ عَصِيرْ بُرْتُقَانْ / نَفْسِي فِي شَايْ',
      generalNote: 'Verbe vouloir/désirer : [بغيت / بدّي / عايز / نحب].',
    },
    contextNoteFr: 'Indispensable pour commander au restaurant ou exprimer ses préférences.',
  },
  {
    id: 'f2-3',
    level: 'A2',
    categoryKey: 'opinions',
    subCategoryFr: '2.16. Exprimer l’obligation et l’interdiction',
    subCategoryAr: '2.16. التعبير عن الإلزام والمنع',
    standardArabic: 'يَجِبُ أَنْ تَرْتَاحَ • مَمْنُوعُ التَّدْخِينِ • لاَ يَجُوزُ الكَذِبُ',
    french: 'Tu dois te reposer. Il est interdit de fumer. Il n’est pas permis de mentir.',
    translitFr: 'Yajibu an tartāḥ • Mamnū‘u t-tadkhīn • Lā yajūzu l-kadhib',
    dialectalVariants: {
      maghreb: 'لَازِمْ تَرْتَاحْ / حْشُومَة / مَمْنُوعْ',
      levant: 'لازِمْ تِرْتَاحْ / عَيْبْ / مَمْنُوعْ',
      egypt: 'لازِمْ تِرْتَاحْ / مَيْصَحِّشْ كِدَه',
      generalNote: 'Emploi fréquent de [لازم + فعل مضارع] et [عيب / حشومة / ما يصحش].',
    },
    contextNoteFr: 'Règles de vie scolaire, santé et comportement citoyen.',
  },

  // 3. ÉMOTIONS ET SENTIMENTS
  {
    id: 'f3-1',
    level: 'A1',
    categoryKey: 'emotions',
    subCategoryFr: '3.1 & 3.12. La joie, l’enthousiasme et l’amour',
    subCategoryAr: '3.1 و 3.12. الفرح والحب والتقدير',
    standardArabic: 'يَا سَلاَمُ! • أَنَا سَعِيدٌ جِدّاً • أُحِبُّ المُوسِيقَى • هَذَا رَائِعٌ!',
    french: 'Que c’est beau ! Je suis très heureux. J’adore la musique. C’est magnifique !',
    translitFr: 'Yā salām! • Anā sa‘īdun jiddan • Uḥibbu l-mūsīqā • Hādhā rā’i‘!',
    dialectalVariants: {
      maghreb: 'أَنَا فَرْحَانْ بْزَّافْ / حْلُو / زْوِينْ',
      levant: 'أَنَا مَبْسُوطْ كْتِيرْ / بِيْجَنِّنْ / بَمُوتْ فِيه',
      egypt: 'أَنَا مَبْسُوطْ قَوِي / حِلْو قَوِي',
      generalNote: 'Adjectif heureux : [فرحان / مبسوط], très : [بزاف / كتير / قوي].',
    },
    contextNoteFr: 'Partager sa joie avec ses pairs et exprimer ses goûts artistiques.',
  },
  {
    id: 'f3-2',
    level: 'A1-A2',
    categoryKey: 'emotions',
    subCategoryFr: '3.3 & 3.4. Prendre des nouvelles et réconforter',
    subCategoryAr: '3.3 و 3.4. السؤال عن الحال والمواساة',
    standardArabic: 'مَا بِكَ؟ هَلْ أَنْتَ بِخَيْرٍ؟ • لاَ تَحْزَنْ! • كُلُّ شَيْءٍ عَلَى مَا يُرَامُ',
    french: 'Qu’as-tu ? Tu vas bien ? Ne sois pas triste ! Tout va bien.',
    translitFr: 'Mā bika? Hal anta bi-khayr? • Lā taḥzan! • Kullu shay’in ‘alā mā yurām',
    dialectalVariants: {
      maghreb: 'مَالْك؟ لَا بَاسْ؟ / مَعْلِيشْ / صَافِي',
      levant: 'شُو بَك؟ تَمَام؟ / بَسِيطَة / لَا تِزْعَلْ / شِدّ حَيْلَك',
      egypt: 'مَالَك؟ فِيه حَاجَة؟ / مَعْلِشْ / خَيْر إِنْ شَاءَ الله',
      generalNote: 'Formules de consolation immédiate : [معليش / بسيطة / لا باس / ما تخافش].',
    },
    contextNoteFr: 'Soutien amical en situation de peine, fatigue ou petit accident.',
  },
  {
    id: 'f3-3',
    level: 'A1-A2',
    categoryKey: 'emotions',
    subCategoryFr: '3.28. Exprimer sa gratitude et ses remerciements',
    subCategoryAr: '3.28. التعبير عن الشكر والامتنان',
    standardArabic: 'شُكْراً جَزِيلاً • بَارَكَ اللَّهُ فِيكَ • عَفْواً، لاَ شُكْرَ عَلَى وَاجِبٍ',
    french: 'Merci beaucoup ! Que Dieu te bénisse ! De rien, il n’y a pas de quoi.',
    translitFr: 'Shukran jazīlan • Bāraka Llāhu fīk • ‘Afwan, lā shukra ‘alā wājib',
    dialectalVariants: {
      maghreb: 'شُكْراً بْزَّافْ / بَارَكْ الله فِيكْ / اللَّه يْخَلِّيكْ',
      levant: 'يِسْلَمُو إِيدَيْك / يَعْطِيك العَافْيِة',
      egypt: 'أَلْف شُكْر / رَبِّنَا يِخَلِّيك',
      generalNote: 'Remerciements chaleureux : [بارك الله فيك / يعطيك العافية / يسلموا].',
    },
    contextNoteFr: 'Formule rituelle de politesse indispensable dans tout échange.',
  },

  // 4. ACTIVITÉS ET ACTIONS
  {
    id: 'f4-1',
    level: 'A1',
    categoryKey: 'activities',
    subCategoryFr: '4.1. Demander poliment et donner des consignes',
    subCategoryAr: '4.1. الطلب بأدب وتوجيه التعليمات',
    standardArabic: 'مِنْ فَضْلِكَ، أَعْطِنِي كَأْسَ مَاءٍ • لَوْ سَمَحْتَ • تَفَضَّلْ بِالدُّخُولِ',
    french: 'S’il te plaît, donne-moi un verre d’eau. Si tu permets. Je t’en prie, entre.',
    translitFr: 'Min faḍlika, a‘ṭinī ka’sa mā’ • Law samaḥta • Tafaḍḍal bid-dukhūl',
    dialectalVariants: {
      maghreb: 'عَافَاكْ، عْطِينِي كَاسْ دْ المَا / اللَّه يْخَلِّيكْ / تَفَضَّلْ',
      levant: 'لَوْ سَمَحْتْ، أَعْطِينِي كَاسِة مَيّ / عَمْلُوفْ مَعْرُوف',
      egypt: 'مِنْ فَضْلَك، إِدِّينِي كُوبَايِة مَيَّة / لَوْ سَمَحْت',
      generalNote: 'S’il vous plaît : [من فضلك / عافاك / لو سمحت / من بعد إذنك].',
    },
    contextNoteFr: 'Politesse élémentaire à table, en classe et dans les magasins.',
  },
  {
    id: 'f4-2',
    level: 'A1-A2',
    categoryKey: 'activities',
    subCategoryFr: '4.4. Proposer une activité ensemble',
    subCategoryAr: '4.4. اقتراح القيام بنشاط مشترك',
    standardArabic: 'هَيَّا بِنَا! • تَعَالَ مَعَنَا إِلَى الشَّاطِئِ • هَلْ تَلْعَبُ مَعِي؟',
    french: 'Allons-y ! Viens avec nous à la plage. Veux-tu jouer avec moi ?',
    translitFr: 'Hayyā binā! • Ta‘āla ma‘anā ilā sh-shāṭi’ • Hal tal‘abu ma‘ī?',
    dialectalVariants: {
      maghreb: 'يَلَّا نْمْشِيوْ لِلْبْحَرْ / أَرَاهَا',
      levant: 'يَلَّا نْرُوحْ عَالْبَحِرْ / تَعَا مْعَنَا',
      egypt: 'يَلَّا بِينَا عَالْبَحْر / تَعَالَى مَعَانَا',
      generalNote: 'Invitation dynamique : [هيا بنا / يلّا / أرواح].',
    },
    contextNoteFr: 'Inviter un camarade à une partie de jeu ou une sortie.',
  },

  // 5. RITUELS SOCIAUX
  {
    id: 'f5-1',
    level: 'A1',
    categoryKey: 'social_rituals',
    subCategoryFr: '5.3. Saluer et répondre aux salutations',
    subCategoryAr: '5.3. التحية والرد عليها في مختلف الأوقات',
    standardArabic: 'السَّلاَمُ عَلَيْكُمْ ⇋ وَعَلَيْكُمُ السَّلاَمُ • صَبَاحُ الخَيْرِ ⇋ صَبَاحُ النُّورِ • مَسَاءُ الخَيْرِ ⇋ مَسَاءُ النُّورِ',
    french: 'Paix sur vous (Bonjour) ⇋ Et sur vous la paix. Bonjour (matin) ⇋ Bonjour de lumière. Bonsoir ⇋ Bonsoir de lumière.',
    translitFr: 'As-salāmu ‘alaykum ⇋ Wa-‘alaykumu s-salām • Ṣabāḥu l-khayr ⇋ Ṣabāḥu n-nūr',
    dialectalVariants: {
      maghreb: 'صْبَاحْ الخِيرْ / مْسَاءْ الخِيرْ / عَلَسْلاَمَة',
      levant: 'مَرْحَبَا ⇋ مَرْحَبْتَيْن / صَبَاحُو',
      egypt: 'صَبَاح الفُلّ والوَرْد / مَسَاء الفُلّ',
      generalNote: 'Dans le monde arabe, chaque salutation reçoit une réponse surenchérissant en bienveillance.',
    },
    contextNoteFr: 'Règle de sociabilité fondamentale dans toutes les cultures arabes.',
  },
  {
    id: 'f5-2',
    level: 'A1-A2',
    categoryKey: 'social_rituals',
    subCategoryFr: '5.12 & 5.13. Souhaits de table, fêtes et félicitations',
    subCategoryAr: '5.12 و 5.13. أدعية المائدة والأعياد والمناسبات السعيدة',
    standardArabic: 'بِالصِّحَّةِ وَالعَافِيَةِ! ⇋ الحَمْدُ لِلَّهِ • عِيدٌ مُبَارَكٌ سَعِيدٌ! • كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ!',
    french: 'Bon appétit et bonne santé ! ⇋ Louange à Dieu. Bonne fête bénie ! Meilleurs vœux pour chaque année !',
    translitFr: 'Biṣ-ṣiḥḥati wal-‘āfiyah! • ‘Īdun mubārakun sa‘īd! • Kullu ‘āmin wa-antum bi-khayr!',
    dialectalVariants: {
      maghreb: 'بِالصِّحَّة والرَّاحَة ⇋ اللَّه يْعْطِيك الصِّحَّة / مَبْرُوك العِيد',
      levant: 'صَحْتَيْن وَهَنَا ⇋ عَلَى قَلْبَك / يِنْعَاد عَلَيْكُم',
      egypt: 'بِالهَنَا والشِّفَا / كُلّ سَنَة وإِنْتُمْ طَيِّبِين',
      generalNote: 'Souhaits de table : [بالصحة / صحتين / بالهنا والشفا]. Réponse : [الله يعطيك الصحة / دايمة].',
    },
    contextNoteFr: 'Partage des repas familiaux, Ramadan, fêtes de l’Aïd et anniversaires.',
  },
  {
    id: 'f5-3',
    level: 'A2',
    categoryKey: 'social_rituals',
    subCategoryFr: '5.15 & 5.16. Téléphone et visioconférence internet',
    subCategoryAr: '5.15 و 5.16. التفاعل عبر الهاتف ومحادثات الفيديو',
    standardArabic: 'آلُو! نَعَمْ، مَنْ مَعِي؟ • لَحْظَةً مِنْ فَضْلِكَ • هَلْ تَسْمَعُنِي جَيِّداً؟ • الصَّوْتُ وَاضِحٌ الآنَ.',
    french: 'Allô ! Oui, qui est à l’appareil ? Un instant s’il vous plaît. M’entends-tu bien ? Le son est clair maintenant.',
    translitFr: 'Ālō! Na‘am, man ma‘ī? • Laḥẓatan min faḍlik • Hal tasma‘unī jayyidan?',
    dialectalVariants: {
      maghreb: 'آلُو، شْكُون مْعَايَا؟ / دْقِيقَة عَفَاك / كَتْسْمَعْنِي مْزْيَان؟',
      levant: 'آلُو، مِين مَعِي؟ / لَحْظَة لَوْ سَمَحْت / عَمْ تِسْمَعْنِي؟',
      egypt: 'أَلُو، مِين بِيِتْكَلِّم؟ / ثَانْيَة وَاحْدَة / سَامِعْنِي كُوَيِّس؟',
      generalNote: 'Communication numérique moderne : indispensables pour les appels et cours en visio.',
    },
    contextNoteFr: 'Gestion des rituels téléphoniques et des visioconférences.',
  },

  // 6. STRUCTURER SON PROPOS
  {
    id: 'f6-1',
    level: 'A1-A2',
    categoryKey: 'structure_speech',
    subCategoryFr: '6.1 & 6.2. Annoncer un plan et raconter une histoire',
    subCategoryAr: '6.1 و 6.2. تنظيم الأفكار وبداية الحكايات',
    standardArabic: 'أَوَّلاً... ثُمَّ... وَأَخِيراً • كَانَ يَا مَا كَانَ فِي قَدِيمِ الزَّمَانِ...',
    french: 'D’abord... puis... et enfin. Il était une fois, dans les temps anciens...',
    translitFr: 'Awwalan... thumma... wa-akhīran • Kāna yā mā kāna fī qadīmi z-zamān...',
    dialectalVariants: {
      generalNote: 'Formule universelle du conte arabe : « كَانْ يَا مَا كَانْ فِي قَدِيم الزَّمَانْ ».',
    },
    contextNoteFr: 'Structurer une prise de parole orale ou introduire la lecture d’un conte.',
  },
  {
    id: 'f6-2',
    level: 'A1-A2',
    categoryKey: 'structure_speech',
    subCategoryFr: '6.20. Demander de l’aide sur un mot ou une traduction',
    subCategoryAr: '6.20. طلب المساعدة اللغوية والترجمة',
    standardArabic: 'مَا مَعْنَى كَلِمَةِ «مُسْتَشْفَى»؟ • كَيْفَ نَقُولُ «MERCI» بِالعَرَبِيَّةِ؟ • كَيْفَ تُكْتَبُ هَذِهِ الكَلِمَةُ؟',
    french: 'Que veut dire le mot « Mustashfā » ? Comment dit-on « merci » en arabe ? Comment s’écrit ce mot ?',
    translitFr: 'Mā ma‘nā kalimati «Mustashfā»? • Kayfa naqūlu «merci» bil-‘arabiyyah?',
    dialectalVariants: {
      maghreb: 'شْنُو كَيْعْنِي هَاد الكَلْمَة؟ / كِيفَاشْ نْقُولُو «MERCI» بِالعَرَبِيَّة؟',
      levant: 'شُو يَعْنِي هَالْكِلْمِة؟ / كِيف بْنِقُولْ بِالعَرَبِي؟',
      egypt: 'يَعْنِي إِيه الكِلْمَة دِي؟ / إِزَّايْ نِقُول كِدَه بِالعَرَبِي؟',
      generalNote: 'Question de métalangage essentielle pour tout apprenant francophone.',
    },
    contextNoteFr: 'Favorise l’autonomie de l’élève face à l’incompréhension.',
  },

  // 7. STRUCTURER L'INTERACTION
  {
    id: 'f7-1',
    level: 'A1-A2',
    categoryKey: 'structure_interaction',
    subCategoryFr: '7.6 & 7.7. S’assurer de la compréhension et faire répéter',
    subCategoryAr: '7.6 و 7.7. التأكد من صحة الفهم وطلب الإعادة ببطء',
    standardArabic: 'هَلْ هَذَا وَاضِحٌ؟ • فَهِمْتَ؟ ⇋ نَعَمْ فَهِمْتُ • عَفْواً، لَمْ أَفْهَمْ، أَعِدْ مِنْ فَضْلِكَ • عَلَى مَهْلِكَ!',
    french: 'Est-ce clair ? As-tu compris ? ⇋ Oui, j’ai compris. Pardon, je n’ai pas compris, répète s’il te plaît. Doucement !',
    translitFr: 'Hal hādhā wāḍiḥ? • Fahimta? ⇋ Na‘am fahimtu • ‘Afwan, lam afham, a‘id min faḍlik • ‘Alā mahlika!',
    dialectalVariants: {
      maghreb: 'وَاشْ مَفْهُومْ؟ / مَا فْهِمْتْشْ، عَاوْدْ عَفَاكْ / بْشْوِيَّة عَلِيكْ',
      levant: 'وَاضِحْ؟ / مَا فْهِمِتْ، عِيدْ لَوْ سَمَحْتْ / شْوَيّ شْوَيّ / عَمَهْلَك',
      egypt: 'فَاهِمْ؟ / مَفْهِمْتِشْ، قُولْ تَانِي مِنْ فَضْلَك / بِالرَّاحَة',
      generalNote: 'Demande de ralentissement : [على مهلك / بشوية / شوي شوي / بالراحة].',
    },
    contextNoteFr: 'Réguler le débit de parole pour assurer une communication fluide et sereine.',
  },
];

// THEMATIC NOTIONS FROM EDUSCOL (19 NOTIONS SPÉCIFIQUES A1-A2)
export const THEMATIC_NOTIONS_DATA: ThematicNotion[] = [
  {
    id: 'notion-1-human',
    number: 1,
    titleFr: '1. L’être humain & le corps',
    titleAr: '1. الإنسان وأعضاء الجسد والوظائف الحيوية',
    icon: '👤',
    level: 'A1-A2',
    subthemes: [
      {
        nameFr: 'Anatomie du corps',
        nameAr: 'أعضاء الجسد',
        words: [
          { ar: 'رَأْسٌ', fr: 'Tête', translit: 'Ra’s', type: 'nom' },
          { ar: 'وَجْهٌ', fr: 'Visage', translit: 'Wajh', type: 'nom' },
          { ar: 'عَيْنٌ', fr: 'Œil', translit: '‘Ayn', type: 'nom' },
          { ar: 'يَدٌ', fr: 'Main', translit: 'Yad', type: 'nom' },
          { ar: 'قَلْبٌ', fr: 'Cœur', translit: 'Qalb', type: 'nom' },
          { ar: 'أَسْنَانٌ', fr: 'Dents', translit: 'Asnān', type: 'nom' },
        ],
      },
      {
        nameFr: 'Caractéristiques physiques',
        nameAr: 'الصفات الجسدية',
        words: [
          { ar: 'كَبِيرٌ', fr: 'Grand', translit: 'Kabīr', type: 'adj' },
          { ar: 'صَغِيرٌ', fr: 'Petit', translit: 'Ṣaghīr', type: 'adj' },
          { ar: 'قَوِيٌّ', fr: 'Fort', translit: 'Qawiyy', type: 'adj' },
          { ar: 'نَحِيفٌ', fr: 'Mince', translit: 'Naḥīf', type: 'adj' },
        ],
      },
    ],
  },
  {
    id: 'notion-2-senses',
    number: 2,
    titleFr: '2. Les 5 sens & les émotions',
    titleAr: '2. الحواس الخمس والإدراك الحسي والمشاعر',
    icon: '👁️',
    level: 'A1-A2',
    subthemes: [
      {
        nameFr: 'Les 5 sens',
        nameAr: 'الحواس الخمس',
        words: [
          { ar: 'البَصَرُ (رَأَى / شَاهَدَ)', fr: 'La vue (voir / regarder)', type: 'verbe' },
          { ar: 'السَّمْعُ (اسْتَمَعَ / سَمِعَ)', fr: 'L’ouïe (écouter / entendre)', type: 'verbe' },
          { ar: 'اللَّمْسُ (لَمَسَ / أَحَسَّ)', fr: 'Le toucher (toucher / sentir)', type: 'verbe' },
          { ar: 'التَّذَوُّقُ (طَعَامٌ لَذِيذٌ)', fr: 'Le goût (délicieux)', type: 'adj' },
          { ar: 'الشَّمُّ (رَائِحَةٌ زَكِيَّةٌ)', fr: 'L’odorat (bonne odeur)', type: 'adj' },
        ],
      },
    ],
  },
  {
    id: 'notion-4-school',
    number: 4,
    titleFr: '4. L’éducation & l’école',
    titleAr: '4. المدرسة والتربية واللوازم والتقويم',
    icon: '🏫',
    level: 'A1',
    subthemes: [
      {
        nameFr: 'Matériel scolaire',
        nameAr: 'اللوازم المدرسية',
        words: [
          { ar: 'كِتَابٌ', fr: 'Livre', translit: 'Kitāb', type: 'nom' },
          { ar: 'دَفْتَرٌ', fr: 'Cahier', translit: 'Daftar', type: 'nom' },
          { ar: 'قَلَمٌ', fr: 'Stylo', translit: 'Qalam', type: 'nom' },
          { ar: 'مِسْطَرَةٌ', fr: 'Règle', translit: 'Misṭarah', type: 'nom' },
          { ar: 'مِمْحَاةٌ', fr: 'Gomme', translit: 'Mimḥāh', type: 'nom' },
          { ar: 'حَاسُوبٌ', fr: 'Ordinateur', translit: 'Ḥāsūb', type: 'nom' },
        ],
      },
      {
        nameFr: 'Évaluation & Personnes',
        nameAr: 'الأشخاص والامتحانات',
        words: [
          { ar: 'أُسْتَاذٌ / مُعَلِّمٌ', fr: 'Professeur / Maître', type: 'nom' },
          { ar: 'تِلْمِيذٌ مُجْتَهِدٌ', fr: 'Élève studieux', type: 'nom' },
          { ar: 'امْتِحَانٌ / فَرْضٌ', fr: 'Examen / Devoir', type: 'nom' },
          { ar: 'نَجَحَ بِامْتِيَازٍ', fr: 'A réussi avec mention', type: 'verbe' },
        ],
      },
    ],
  },
  {
    id: 'notion-9-transports',
    number: 9,
    titleFr: '9. Transports, voyages & circulation',
    titleAr: '9. النقل والرحلات وقواعد السير',
    icon: '🚆',
    level: 'A1-A2',
    subthemes: [
      {
        nameFr: 'Moyens de transport',
        nameAr: 'وسائل النقل',
        words: [
          { ar: 'قِطَارٌ سَرِيعٌ', fr: 'Train rapide (TGV)', type: 'nom' },
          { ar: 'حَافِلَةٌ / بَاصٌ', fr: 'Autobus', type: 'nom' },
          { ar: 'طَائِرَةٌ', fr: 'Avion', type: 'nom' },
          { ar: 'سَفِينَةٌ', fr: 'Navire / Bateau', type: 'nom' },
          { ar: 'سَيَّارَةٌ', fr: 'Voiture', type: 'nom' },
        ],
      },
      {
        nameFr: 'Gare & Billets',
        nameAr: 'المحطة والتذاكر',
        words: [
          { ar: 'مَحَطَّةٌ', fr: 'Gare', type: 'nom' },
          { ar: 'مَطَارٌ', fr: 'Aéroport', type: 'nom' },
          { ar: 'تَذْكِرَةُ السَّفَرِ', fr: 'Billet de voyage', type: 'nom' },
          { ar: 'حَقِيبَةُ الأَمْتِعَةِ', fr: 'Valise de bagages', type: 'nom' },
        ],
      },
    ],
  },
  {
    id: 'notion-11-food',
    number: 11,
    titleFr: '11. Nourriture, boissons & restaurant',
    titleAr: '11. المأكولات والمشروبات والمطعم',
    icon: '🍲',
    level: 'A1-A2',
    subthemes: [
      {
        nameFr: 'Aliments & Plats',
        nameAr: 'الأطباق والأغذية',
        words: [
          { ar: 'خُبْزٌ طَازَجٌ', fr: 'Pain frais', type: 'nom' },
          { ar: 'كُسْكُسٌ', fr: 'Couscous', type: 'nom' },
          { ar: 'طَاجِينٌ', fr: 'Tajine', type: 'nom' },
          { ar: 'سَلَطَةٌ خَضْرَاءُ', fr: 'Salade verte', type: 'nom' },
          { ar: 'تُفَّاحٌ وَبُرْتُقَالٌ', fr: 'Pommes et oranges', type: 'nom' },
          { ar: 'شَايٌ بِالنَّعْنَاعِ', fr: 'Thé à la menthe', type: 'nom' },
        ],
      },
    ],
  },
  {
    id: 'notion-17-environment',
    number: 17,
    titleFr: '17. Nature, environnement, climat & animaux',
    titleAr: '17. البيئة والمناخ والحيوانات والغابات',
    icon: '🌲',
    level: 'A1-A2',
    subthemes: [
      {
        nameFr: 'Nature & Climat',
        nameAr: 'الطبيعة والمناخ',
        words: [
          { ar: 'مَطَرٌ وَغَيْثٌ', fr: 'Pluie bienfaisante', type: 'nom' },
          { ar: 'ثَلْجٌ نَاصِعٌ', fr: 'Neige blanche', type: 'nom' },
          { ar: 'غَابَةٌ خَضْرَاءُ', fr: 'Forêt verdoyante', type: 'nom' },
          { ar: 'شَمْسٌ دَافِئَةٌ', fr: 'Soleil tiède', type: 'adj' },
          { ar: 'حِمَايَةُ البِيئَةِ', fr: 'Protection de la nature', type: 'nom' },
        ],
      },
    ],
  },
];
