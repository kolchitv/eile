import { CEFRLevel } from '../types';

export interface SpeakingActivity {
  id: string;
  level: CEFRLevel;
  type: 'continuous' | 'listening_comprehension' | 'roleplay' | 'repeat_shadow';
  titleAr: string;
  titleFr: string;
  titleEn: string;
  badgeFr: string;
  icon: string;
  descriptionFr: string;
  audioPromptText: string;
  visualContextUrl?: string;
  targetScriptAr: string;
  targetTranslitFr: string;
  targetTranslationFr: string;
  guidancePointsFr: string[];
  keyVocabulary: { arabic: string; translitFr: string; french: string }[];
  comprehensionQuestions?: {
    questionAr: string;
    questionFr: string;
    audioSnippet?: string;
    options: string[];
    correctIndex: number;
    explanationFr: string;
  }[];
  exampleSpeechModelAr: string;
  exampleSpeechModelFr: string;
  timeLimitSeconds?: number;
}

export const SPEAKING_ACTIVITIES: SpeakingActivity[] = [
  // ====================== A1 ======================
  {
    id: 'spk-a1-1',
    level: 'A1',
    type: 'continuous',
    titleAr: 'التعبير الشفهي المسترسل: التعريف بالهوية والأسرة',
    titleFr: 'Expression Orale en Continu : Se présenter et présenter sa famille',
    titleEn: 'Continuous Speaking: Self & Family Introduction',
    badgeFr: 'Parler en continu (A1)',
    icon: '👤',
    descriptionFr: 'Présentez-vous oralement en continu (prénom, âge, ville, profession) et citez 3 membres de votre famille en formant des phrases complètes.',
    audioPromptText: 'تَكَلَّمْ عَنْ نَفْسِكَ: مَا اسْمُكَ؟ كَمْ عُمْرُك؟ أَيْنَ تَسْكُن؟ وَمَاذَا تَعْمَل؟',
    targetScriptAr: 'السَّلَامُ عَلَيْكُمْ. أَنَا اسْمِي سَامِي. عُمْرِي ثَمَانِي سَنَوَات. أَسْكُنُ فِي مَدِينَةِ بَارِيس. أَنَا تِلْمِيذٌ فِي المَدْرَسَة. أُحِبُّ أَبِي وَأُمِّي وَأُخْتِي الصَّغِيرَة.',
    targetTranslitFr: 'As-salāmu ‘alaykum. Anā ismī Sāmī. ‘Umrī thamānī sanawāt. Askunu fī madīnati Bārīs. Anā tilmīdhun fī al-madrasah. Uḥibbu abī wa ummī wa ukhtī aṣ-ṣaghīrah.',
    targetTranslationFr: 'Bonjour. Je m’appelle Sami. J’ai 8 ans. J’habite dans la ville de Paris. Je suis élève à l’école. J’aime mon père, ma mère et ma petite sœur.',
    guidancePointsFr: [
      'Commencez par la salutation : « السَّلَامُ عَلَيْكُم » ou « صَبَاحُ الخَيْر »',
      'Énoncez votre nom avec « أَنَا اسْمِي... »',
      'Indiquez votre âge : « عُمْرِي... سَنَوَات »',
      'Mentionnez votre lieu de résidence : « أَسْكُنُ فِي... »',
      'Citez des membres de votre famille : « أَبِي، أُمِّي، أَخِي، أُخْتِي »',
    ],
    keyVocabulary: [
      { arabic: 'أَنَا اسْمِي', translitFr: 'Anā ismī', french: 'Je m’appelle' },
      { arabic: 'عُمْرِي', translitFr: '‘Umrī', french: 'J’ai / Mon âge' },
      { arabic: 'أَسْكُنُ فِي', translitFr: 'Askunu fī', french: 'J’habite à' },
      { arabic: 'أُسْرَتِي / عَائِلَتِي', translitFr: 'Usratī / ‘Ā’ilatī', french: 'Ma famille' },
    ],
    exampleSpeechModelAr: 'السَّلَامُ عَلَيْكُم، أَنَا اسْمِي سَارَة، عُمْرِي عِشْرُونَ سَنَة، أَسْكُنُ فِي لِيُون، أَنَا طَالِبَةٌ جَامِعِيَّة، عَائِلَتِي لَطِيفَةٌ جِدًّا.',
    exampleSpeechModelFr: 'Bonjour, je m’appelle Sarah, j’ai 20 ans, j’habite à Lyon, je suis étudiante, ma famille est très gentille.',
    timeLimitSeconds: 60,
  },
  {
    id: 'spk-a1-2',
    level: 'A1',
    type: 'listening_comprehension',
    titleAr: 'الاستماع والفهم: الأدوات المدرسية والتعليمات الصفية',
    titleFr: 'Écoute & Compréhension : Les consignes scolaires et le cartable',
    titleEn: 'Listening Comprehension: Classroom & School Bag',
    badgeFr: 'Écouter & Comprendre (A1)',
    icon: '🎒',
    descriptionFr: 'Écoutez attentivement l’enregistrement du maître en classe, puis répondez aux questions de compréhension orale.',
    audioPromptText: 'يَا تَلَامِيذ، افْتَحُوا المَحَافِظَ وَخُذُوا الدَّفْتَرَ الصَّغِيرَ وَالقَلَمَ الأَزْرَقَ وَالمِسْطَرَة. لَا تَنْسَوْا اللَّوْحَة.',
    targetScriptAr: 'يَا تَلَامِيذ، افْتَحُوا المَحَافِظَ وَخُذُوا الدَّفْتَرَ الصَّغِيرَ وَالقَلَمَ الأَزْرَقَ وَالمِسْطَرَة. لَا تَنْسَوْا اللَّوْحَة.',
    targetTranslitFr: 'Yā talāmīdh, iftaḥū al-maḥāfiẓ wa khudhū ad-daftara aṣ-ṣaghīra wa al-qalama al-azraq wa al-misṭarah.',
    targetTranslationFr: 'Ô élèves, ouvrez les cartables et prenez le petit cahier, le stylo bleu et la règle. N’oubliez pas l’ardoise.',
    guidancePointsFr: [
      'Repérez les verbes d’action à l’impératif : « افْتَحُوا » (ouvrez), « خُذُوا » (prenez)',
      'Identifiez les couleurs et les objets cités',
    ],
    keyVocabulary: [
      { arabic: 'دَفْتَرٌ صَغِير', translitFr: 'Daftarun saghīr', french: 'Un petit cahier' },
      { arabic: 'قَلَمٌ أَزْرَق', translitFr: 'Qalamun azraq', french: 'Un stylo bleu' },
      { arabic: 'مِسْطَرَة', translitFr: 'Misṭarah', french: 'Une règle' },
      { arabic: 'لَوْحَة', translitFr: 'Lawḥah', french: 'Une ardoise' },
    ],
    comprehensionQuestions: [
      {
        questionAr: 'مَاذَا طَلَبَ الأُسْتَاذُ مِنَ التَّلَامِيذِ أَنْ يَفْتَحُوا؟',
        questionFr: 'Qu’est-ce que l’enseignant a demandé aux élèves d’ouvrir ?',
        options: ['المَحَافِظ (Les cartables)', 'النَّوَافِذ (Les fenêtres)', 'الأَبْوَاب (Les portes)'],
        correctIndex: 0,
        explanationFr: 'Le professeur a dit : « افْتَحُوا المَحَافِظَ » (Ouvrez les cartables).',
      },
      {
        questionAr: 'مَا هُوَ لَوْنُ القَلَمِ المَطْلُوبِ؟',
        questionFr: 'Quelle est la couleur du stylo demandé ?',
        options: ['أَحْمَر (Rouge)', 'أَزْرَق (Bleu)', 'أَخْضَر (Vert)'],
        correctIndex: 1,
        explanationFr: 'Le professeur a précisé : « القَلَمَ الأَزْرَق » (Le stylo bleu).',
      },
    ],
    exampleSpeechModelAr: 'خُذُوا الدَّفْتَرَ الصَّغِيرَ وَالقَلَمَ الأَزْرَق.',
    exampleSpeechModelFr: 'Prenez le petit cahier et le stylo bleu.',
    timeLimitSeconds: 45,
  },

  // ====================== A2 ======================
  {
    id: 'spk-a2-1',
    level: 'A2',
    type: 'continuous',
    titleAr: 'التعبير الشفهي المسترسل: سرد الروتين اليومي',
    titleFr: 'Parler en Continu : Raconter ma journée et mes activités quotidiennes',
    titleEn: 'Continuous Speaking: My Daily Routine Narrative',
    badgeFr: 'Parler en continu (A2)',
    icon: '⏰',
    descriptionFr: 'Exprimez-vous de manière fluide pendant 1 à 2 minutes pour raconter le déroulement complet de votre journée (réveil, petit-déjeuner, travail/école, loisirs, coucher).',
    audioPromptText: 'تَحَدَّثْ بِاسْتِرْسَالٍ عَنْ يَوْمِكَ: مَتَى تَسْتَيْقِظ؟ مَاذَا تَفْعَلُ فِي الصَّبَاحِ وَالمَسَاءِ؟',
    targetScriptAr: 'أَسْتَيْقِظُ كُلَّ يَوْمٍ فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا. أَغْسِلُ وَجْهِي وَأَتَنَاوَلُ الفُطُورَ مَعَ أُسْرَتِي. فِي المَسَاءِ، أَرْجِعُ إِلَى البَيْتِ، أُرَاجِعُ دُرُوسِي، وَأَشْرَبُ الشَّايَ مَعَ قِطْعَةِ حَلْوَى، ثُمَّ أَنَامُ مُبَكِّرًا.',
    targetTranslitFr: 'Astayqiẓu kulla yawmin fī as-sā‘ati as-sābi‘ati ṣabāḥan. Aghsilu wajhī wa atanāwalu al-fuṭūra ma‘a usratī. Fī al-masā’, arji‘u ilā al-bayt, urāji‘u durūsī, wa ashrabu ash-shāya ma‘a qiṭ‘ati ḥalwā, thumma anāmu mubakkiran.',
    targetTranslationFr: 'Je me réveille chaque jour à sept heures du matin. Je me lave le visage et prends mon petit-déjeuner avec ma famille. Le soir, je rentre à la maison, je révise mes leçons, je bois du thé avec un gâteau, puis je dors tôt.',
    guidancePointsFr: [
      'Utilisez les connecteurs temporels : « فِي الصَّبَاح » (le matin), « بَعْدَ ذَلِك » (ensuite), « فِي المَسَاء » (le soir)',
      'Conjuguez les verbes au présent à la 1re personne : « أَسْتَيْقِظُ » (je me réveille), « أَتَنَاوَلُ » (je consomme), « أَنَامُ » (je dors)',
      'Précisez l’heure : « فِي السَّاعَةِ السَّابِعَة » (à 7 heures)',
    ],
    keyVocabulary: [
      { arabic: 'أَسْتَيْقِظُ', translitFr: 'Astayqiẓu', french: 'Je me réveille' },
      { arabic: 'أَتَنَاوَلُ الفُطُور', translitFr: 'Atanāwalu al-fuṭūr', french: 'Je prends le petit-déjeuner' },
      { arabic: 'أُرَاجِعُ دُرُوسِي', translitFr: 'Urāji‘u durūsī', french: 'Je révise mes leçons' },
      { arabic: 'أَنَامُ مُبَكِّرًا', translitFr: 'Anāmu mubakkiran', french: 'Je me couche tôt' },
    ],
    exampleSpeechModelAr: 'أَسْتَيْقِظُ مُبَكِّرًا، أَتَنَاوَلُ القَهْوَةَ، أَذْهَبُ إِلَى العَمَلِ بِالقِطَار، وَفِي المَسَاءِ أُمَارِسُ الرِّيَاضَةَ مَعَ أَصْدِقَائِي.',
    exampleSpeechModelFr: 'Je me réveille tôt, je bois du café, je vais au travail en train, et le soir je fais du sport avec mes amis.',
    timeLimitSeconds: 90,
  },
  {
    id: 'spk-a2-2',
    level: 'A2',
    type: 'listening_comprehension',
    titleAr: 'الاستماع والفهم: طلب وجبة في المطعم التقليدي',
    titleFr: 'Écoute & Compréhension : Commander au restaurant traditionnel',
    titleEn: 'Listening: Ordering Food at Traditional Restaurant',
    badgeFr: 'Écouter & Comprendre (A2)',
    icon: '🍲',
    descriptionFr: 'Écoutez le dialogue entre le serveur et le client, notez les plats commandés et le montant de l’addition.',
    audioPromptText: 'ـ أَهْلًا بِكَ يَا سَيِّدِي! مَاذَا تُفَضِّلُ أَنْ تَأْكُلَ اليَوْم؟ ـ أُرِيدُ طَاجِينَ الدَّجَاجِ بِالزَّيْتُونِ، وَسَلَطَةً خَضْرَاءَ، وَإِبْرِيقَ شَايٍ بِالنَّعْنَاع. ـ حَسَنًا، الحِسَابُ خَمْسُونَ دِرْهَمًا.',
    targetScriptAr: 'أُرِيدُ طَاجِينَ الدَّجَاجِ بِالزَّيْتُونِ، وَسَلَطَةً خَضْرَاءَ، وَإِبْرِيقَ شَايٍ بِالنَّعْنَاع. الحِسَابُ خَمْسُونَ دِرْهَمًا.',
    targetTranslitFr: 'Urīdu ṭājīna ad-dajāji bi-z-zaytūn, wa salaṭatan khaḍrā’, wa ibrīqa shāyin bi-n-na‘nā‘.',
    targetTranslationFr: 'Je désire un tajine de poulet aux olives, une salade verte et une théière de thé à la menthe. L’addition est de 50 dirhams.',
    guidancePointsFr: [
      'Repérez la formule de commande : « أُرِيدُ... مِنْ فَضْلِك »',
      'Identifiez le prix : « خَمْسُونَ دِرْهَمًا »',
    ],
    keyVocabulary: [
      { arabic: 'طَاجِينُ الدَّجَاج', translitFr: 'Ṭājīn ad-dajāj', french: 'Tajine de poulet' },
      { arabic: 'إِبْرِيقُ شَاي', translitFr: 'Ibrīq shāy', french: 'Une théière de thé' },
      { arabic: 'الحِسَاب', translitFr: 'Al-ḥisāb', french: 'L’addition / La note' },
    ],
    comprehensionQuestions: [
      {
        questionAr: 'مَا هُوَ الطَّبَقُ الرَّئِيسِيُّ الَّذِي طَلَبَهُ الزَّبُون؟',
        questionFr: 'Quel est le plat principal commandé par le client ?',
        options: ['طَاجِينُ الدَّجَاجِ بِالزَّيْتُون (Tajine de poulet aux olives)', 'كُسْكُس بِاللَّحْم (Couscous à la viande)', 'سَمَك مَشْوِيّ (Poisson grillé)'],
        correctIndex: 0,
        explanationFr: 'Le client a demandé : « طَاجِينَ الدَّجَاجِ بِالزَّيْتُون ».',
      },
      {
        questionAr: 'كَمْ بَلَغَ ثَمَنُ الوَجْبَةِ كَامِلَةً؟',
        questionFr: 'À combien s’élève le prix total du repas ?',
        options: ['خَمْسُونَ دِرْهَمًا (50 Dirhams)', 'مِائَةُ دِرْهَم (100 Dirhams)', 'ثَلَاثُونَ دِرْهَمًا (30 Dirhams)'],
        correctIndex: 0,
        explanationFr: 'Le serveur indique : « الحِسَابُ خَمْسُونَ دِرْهَمًا » (50 dirhams).',
      },
    ],
    exampleSpeechModelAr: 'أُرِيدُ كُسْكُسًا بِالخُضَارِ وَعَصِيرَ بُرْتُقَالٍ مِنْ فَضْلِك.',
    exampleSpeechModelFr: 'Je voudrais un couscous aux légumes et un jus d’orange s’il vous plaît.',
    timeLimitSeconds: 60,
  },

  // ====================== B1 ======================
  {
    id: 'spk-b1-1',
    level: 'B1',
    type: 'continuous',
    titleAr: 'التعبير الشفهي المسترسل: ذكريات رحلة سياحية لا تُنسى',
    titleFr: 'Parler en Continu : Raconter un voyage mémorable dans le monde arabe',
    titleEn: 'Continuous Speaking: An Unforgettable Travel Experience',
    badgeFr: 'Parler en continu (B1)',
    icon: '✈️',
    descriptionFr: 'Faites un exposé oral continu de 2 minutes pour décrire une ville visitée, les monuments historiques, la gastronomie locale et vos impressions personnelles.',
    audioPromptText: 'تَحَدَّثْ عَنْ رِحْلَةٍ قُمْتَ بِهَا: أَيْنَ ذَهَبْتَ؟ مَاذَا شَاهَدْتَ؟ وَمَا هُوَ انْطِبَاعُكَ؟',
    targetScriptAr: 'فِي الصَّيْفِ المَاضِي، سَافَرْتُ إِلَى مَدِينَةِ مَرَّاكُش العَرِيقَة. أُعْجِبْتُ بِسَاحَةِ جَامِعِ الفَنَا وَأَسْوَاقِهَا المَلِيئَةِ بِالحِرَفِ التَّقْلِيدِيَّة. كَانَتِ الضِّيَافَةُ رَائِعَةً، وَتَذَوَّقْتُ أَشْهَى المَأْكُولَاتِ المَغْرِبِيَّةِ مِثْلَ الطَّنْجِيَّة.',
    targetTranslitFr: 'Fī aṣ-ṣayfi al-māḍī, sāfartu ilā madīnati Marrākush al-‘arīqah. U‘jibtu bi-sāḥati Jāmi‘i al-Fanā wa aswāqihā...',
    targetTranslationFr: 'L’été dernier, j’ai voyagé dans la ville historique de Marrakech. J’ai été émerveillé par la place Jemaa el-Fna et ses souks artisanaux. L’hospitalité était chaleureuse et j’ai dégusté de savoureux plats comme la Tanjia.',
    guidancePointsFr: [
      'Utilisez les temps du passé : « سَافَرْتُ » (j’ai voyagé), « زُرْتُ » (j’ai visité), « شَاهَدْتُ » (j’ai contemplé)',
      'Exprimez des sentiments d’admiration : « أُعْجِبْتُ بِـ... » (j’ai admiré), « كَانَ الجَوُّ رَائِعًا » (l’ambiance était formidable)',
      'Structurez votre discours : introduction, étapes de la visite, conclusion et recommandation.',
    ],
    keyVocabulary: [
      { arabic: 'مَدِينَةٌ عَرِيقَة', translitFr: 'Madīnah ‘arīqah', french: 'Une ville historique / séculaire' },
      { arabic: 'الضِّيَافَةُ الكَرِيمَة', translitFr: 'Aḍ-ḍiyāfah al-karīmah', french: 'L’hospitalité généreuse' },
      { arabic: 'مَعَالِمُ تَارِيخِيَّة', translitFr: 'Ma‘ālim tārīkhiyyah', french: 'Monuments historiques' },
    ],
    exampleSpeechModelAr: 'زُرْتُ القَاهِرَةَ، رَأَيْتُ الأَهْرَامَاتِ وَالمَتَاحِفَ، وَاسْتَمْتَعْتُ بِجَوْلَةٍ فِي نَهْرِ النِّيل.',
    exampleSpeechModelFr: 'J’ai visité Le Caire, j’ai vu les pyramides et les musées, et j’ai profité d’une promenade sur le Nil.',
    timeLimitSeconds: 120,
  },

  // ====================== B2 ======================
  {
    id: 'spk-b2-1',
    level: 'B2',
    type: 'continuous',
    titleAr: 'التعبير الشفهي المسترسل: مناظرة وإبداء الرأي حول التكنولوجيا والتعليم',
    titleFr: 'Parler en Continu : Argumentation & Prise de position sur le numérique dans l’éducation',
    titleEn: 'Continuous Speaking: Debate on EdTech & AI',
    badgeFr: 'Parler en continu (B2)',
    icon: '💡',
    descriptionFr: 'Développez un argumentaire structuré (thèse, antithèse, synthèse) sur les avantages et les défis de l’intelligence artificielle dans l’apprentissage des langues.',
    audioPromptText: 'أَبْدِ رَأْيَكَ فِي دَوْرِ الذَّكَاءِ الِاصْطِنَاعِيِّ فِي تَعَلُّمِ اللُّغَاتِ: هَلْ يُغْنِي عَنِ المُعَلِّمِ البَشَرِيّ؟',
    targetScriptAr: 'مِمَّا لَا شَكَّ فِيهِ أَنَّ الذَّكَاءَ الِاصْطِنَاعِيَّ يُقَدِّمُ حُلُولًا ثَوْرِيَّةً فِي إِتَاحَةِ التَّعْلِيمِ وَتَخْصِيصِ المَسَارَاتِ لِكُلِّ مُتَعَلِّم. وَمَعَ ذَلِكَ، يَظَلُّ المُعَلِّمُ البَشَرِيُّ عُنْصُرًا جَوْهَرِيًّا لِبَثِّ الرُّوحِ الإِنْسَانِيَّةِ وَالتَّحْفِيزِ الوِجْدَانِيّ.',
    targetTranslitFr: 'Mimmā lā shakka fīhi anna adh-dhakā’a al-iṣṭinā‘iyya yuqaddimu ḥulūlan thawriyyah...',
    targetTranslationFr: 'Il ne fait aucun doute que l’intelligence artificielle offre des solutions révolutionnaires pour démocratiser l’apprentissage. Cependant, l’enseignant humain demeure un élément essentiel pour apporter la dimension humaine et la motivation émotionnelle.',
    guidancePointsFr: [
      'Employez des connecteurs d’argumentation : « مِمَّا لَا شَكَّ فِيه » (nul doute que), « مِنْ جِهَةٍ أُخْرَى » (d’autre part), « وَبِنَاءً عَلَى ذَلِك » (en conséquence)',
      'Nuancez vos propos avec des arguments concrets.',
    ],
    keyVocabulary: [
      { arabic: 'الذَّكَاءُ الِاصْطِنَاعِيّ', translitFr: 'Adh-dhakā’ al-iṣṭinā‘ī', french: 'L’intelligence artificielle' },
      { arabic: 'تَخْصِيصُ التَّعَلُّم', translitFr: 'Takhṣīṣ at-ta‘allum', french: 'Personnalisation de l’apprentissage' },
      { arabic: 'البُعْدُ الإِنْسَانِيّ', translitFr: 'Al-bu‘d al-insānī', french: 'La dimension humaine' },
    ],
    exampleSpeechModelAr: 'أَرَى أَنَّ التِّكْنُولُوجْيَا أَدَاةٌ مُسَاعِدَةٌ فَعَّالَة، لَكِنَّ التَّوَاصُلَ الإِنْسَانِيَّ هُوَ أَسَاسُ الفَصَاحَة.',
    exampleSpeechModelFr: 'Je pense que la technologie est un outil efficace, mais le contact humain reste le fondement de l’éloquence.',
    timeLimitSeconds: 150,
  },

  // ====================== C1 & C2 ======================
  {
    id: 'spk-c1-1',
    level: 'C1',
    type: 'continuous',
    titleAr: 'التعبير الشفهي المسترسل: تحليل بلاغي وخطابة أدبية',
    titleFr: 'Parler en Continu : Éloquence, Rhétorique et Analyse Littéraire',
    titleEn: 'Continuous Speaking: Rhetoric & Classical Discourse',
    badgeFr: 'Parler en continu (C1/C2)',
    icon: '👑',
    descriptionFr: 'Présentez une analyse stylistique orale approfondie en langue arabe soutenue (Fusha) sur la puissance de la métaphore et de l’éloquence dans la poésie arabe classique.',
    audioPromptText: 'حَلِّلْ أَهَمِّيَّةَ البَلَاغَةِ وَالمَجَازِ فِي إِثْرَاءِ اللُّغَةِ العَرَبِيَّةِ وَالتَّعْبِيرِ عَنِ المَعَانِي الدَّقِيقَة.',
    targetScriptAr: 'إِنَّ البَلَاغَةَ العَرَبِيَّةَ لَيْسَتْ مُجَرَّدَ زَخْرَفَةٍ لَفْظِيَّة، بَلْ هِيَ مِرْآةٌ لِعُمْقِ الفِكْرِ وَدِقَّةِ التَّصْوِير. فَالِاسْتِعَارَةُ وَالكِنَايَةُ تَفْتَحَانِ آفَاقًا رَحْبَةً لِلتَّأْوِيلِ وَالجَمَال.',
    targetTranslitFr: 'Inna al-balāghata al-‘arabiyyata laysat mujarrada zakhrafatin lafẓiyyah, bal hiya mir’ātun li-‘umqi al-fikr...',
    targetTranslationFr: 'La rhétorique arabe n’est pas un simple ornement lexical, mais le miroir de la profondeur de la pensée et de la précision imagée. La métaphore et la métonymie ouvrent de vastes horizons d’interprétation et de beauté.',
    guidancePointsFr: [
      'Utilisez un registre académique et soigné avec respect total des règles de la déclinaison (الإعراب).',
      'Citez des figures de style : الاستعارة (métaphore), الجناس (allitération), الكناية (métonymie).',
    ],
    keyVocabulary: [
      { arabic: 'البَلَاغَةُ وَالفَصَاحَة', translitFr: 'Al-Balāghah wa al-faṣāḥah', french: 'La rhétorique et l’éloquence' },
      { arabic: 'عُمْقُ التَّصْوِير', translitFr: '‘Umq at-taṣwīr', french: 'La profondeur imagée' },
      { arabic: 'حُسْنُ البَيَان', translitFr: 'Ḥusn al-bayān', french: 'L’élégance de l’élocution' },
    ],
    exampleSpeechModelAr: 'تَتَجَلَّى عَبْقَرِيَّةُ الضَّادِ فِي قُدْرَتِهَا عَلَى إِيجَازِ المَعَانِي العَظِيمَةِ بِأَلْفَاظٍ بَلِيغَةٍ رَصِينَة.',
    exampleSpeechModelFr: 'Le génie de la langue arabe se manifeste dans sa capacité à condenser de grands sens dans des mots d’une sobre éloquence.',
    timeLimitSeconds: 180,
  },
];
