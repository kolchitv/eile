export interface DialogueSentence {
  id: string;
  speaker: string;
  speakerAvatar: string;
  speakerRoleFr: string;
  arabic: string;
  translitFr: string;
  french: string;
  keywords?: string[];
}

export interface ClassroomInstruction {
  id: string;
  arabic: string;
  french: string;
  translitFr: string;
  icon: string;
  descriptionFr: string;
  interactiveActionType: 'underline' | 'cross' | 'circle' | 'color' | 'link' | 'write';
}

export interface SessionData {
  sessionNumber: number;
  sessionTitleAr: string;
  sessionTitleFr: string;
  targetLetter: {
    letter: string;
    letterNameAr: string;
    letterNameFr: string;
    forms: string[];
    sampleWords: { word: string; translit: string; french: string; icon: string }[];
  };
  // 1. Interaction Orale (حوارات التعارف مقسمة لجمل قصيرة للحفظ)
  interactionOrale: {
    titleAr: string;
    titleFr: string;
    objectiveFr: string;
    dialogue: DialogueSentence[];
    memorizationSteps: string[];
  };
  // 2. Compréhension de l'oral (فهم المسموع والتعليمات)
  oralComprehension: {
    titleAr: string;
    titleFr: string;
    audioPromptAr: string;
    instructions: ClassroomInstruction[];
    practiceTask: {
      questionAr: string;
      questionFr: string;
      targetTextAr: string;
      options: string[];
      correctAnswer: string;
      actionInstruction: string;
    };
  };
  // 3. Parler en continu (الاسترسال في الكلام والنشيد)
  continuousSpeaking: {
    titleAr: string;
    titleFr: string;
    promptAr: string;
    fullSpeechAr: string;
    fullSpeechTranslitFr: string;
    fullSpeechFr: string;
    keyPointsFr: string[];
    alphabetSongExcerpt?: {
      titleAr: string;
      lyricsAr: string[];
      lyricsFr: string;
    };
  };
  // 4. Compréhension de l'écrit / Lecture (فهم المكتوب)
  readingComprehension: {
    titleAr: string;
    titleFr: string;
    readingPassageAr: string;
    readingPassageFr: string;
    syllablesFocus: string[];
    wordsToRead: { word: string; translit: string; french: string }[];
    quiz: {
      questionAr: string;
      questionFr: string;
      options: string[];
      correctIndex: number;
    };
  };
  // 5. Écriture (الكتابة وبطاقة التعريف)
  writing: {
    titleAr: string;
    titleFr: string;
    copySentenceAr: string;
    copySentenceFr: string;
    letterPractice: string[];
    wordsToCopy: string[];
    identityCardField?: {
      fieldNameAr: string;
      fieldNameFr: string;
      placeholderAr: string;
      exampleValue: string;
    };
  };
}

export interface UnitCurriculum {
  unitId: string;
  unitNumber: number;
  academicYear: string;
  themeAr: string;
  themeFr: string;
  level: string;
  descriptionFr: string;
  sessions: SessionData[];
  consolidationSession: {
    sessionNumber: number;
    titleAr: string;
    titleFr: string;
    descriptionFr: string;
    evaluationTasks: {
      id: string;
      type: 'dialogue_match' | 'instruction_action' | 'continuous_presentation' | 'identity_card';
      questionAr: string;
      questionFr: string;
      items: any[];
    }[];
  };
}

export const UNIT_1_FAMILY_COMMUNITY: UnitCurriculum = {
  unitId: 'unit-1-family',
  unitNumber: 1,
  academicYear: '2024/2025 - 2025/2026',
  themeAr: 'المجال الثاني: الأُسْرَةُ وَالمُحِيطُ',
  themeFr: 'Domaine 2 : La Famille et l’Environnement',
  level: 'السنة الأولى ابتدائي (A1 - Niveau 1)',
  descriptionFr: 'Programme officiel réparti en 5 séances méthodologiques + 1 séance d’évaluation et de consolidation avec les 5 composantes intégrées.',
  sessions: [
    // =================================== HESSA 1 ===================================
    {
      sessionNumber: 1,
      sessionTitleAr: 'الحِصَّةُ 1: تَبَادُلُ التَّحِيَّةِ وَتَقْدِيمُ النَّفْسِ (حَرْفُ المِيمِ)',
      sessionTitleFr: 'Séance 1 : Salutation & Présentation de soi (Lettre Mīm)',
      targetLetter: {
        letter: 'م',
        letterNameAr: 'حَرْفُ المِيمِ',
        letterNameFr: 'La lettre Mīm (م)',
        forms: ['مـ', 'ـمـ', 'ـم', 'م'],
        sampleWords: [
          { word: 'مَكْتَبٌ', translit: 'Maktab', french: 'Bureau', icon: '🪵' },
          { word: 'مَدْرَسَةٌ', translit: 'Madrasah', french: 'École', icon: '🏫' },
          { word: 'مِقْلَمَةٌ', translit: 'Miqlamah', french: 'Trousse', icon: '✏️' },
          { word: 'عَلَمٌ', translit: '‘Alam', french: 'Drapeau', icon: '🚩' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ التَّعَارُفِ (1)',
        titleFr: 'Interaction Orale : Dialogue de présentation (Phrases courtes)',
        objectiveFr: 'Échanger les salutations et décliner son identité (prénom et âge) avec des phrases courtes faciles à mémoriser.',
        dialogue: [
          {
            id: 'd1-1',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا أَطْفَالُ.',
            translitFr: 'As-salāmu ‘alaykum yā aṭfāl.',
            french: 'Que la paix soit sur vous, les enfants.',
            keywords: ['السَّلَامُ عَلَيْكُم'],
          },
          {
            id: 'd1-2',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ يَا أُسْتَاذُ.',
            translitFr: 'Wa ‘alaykumu s-salāmu yā ustādh.',
            french: 'Et sur vous la paix, cher maître.',
            keywords: ['وَعَلَيْكُمُ السَّلَام'],
          },
          {
            id: 'd1-3',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'صَبَاحُ الخَيْرِ! مَا اسْمُكَ؟',
            translitFr: 'Ṣabāḥu l-khayr! Mās-muka?',
            french: 'Bonjour ! Quel est ton nom ?',
            keywords: ['صَبَاحُ الخَيْر', 'مَا اسْمُكَ'],
          },
          {
            id: 'd1-4',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'صَبَاحُ النُّورِ! أَنَا اسْمِي عُمَرُ.',
            translitFr: 'Ṣabāḥu n-nūr! Anā ismī ‘Umar.',
            french: 'Bonjour ! Je m’appelle Omar.',
            keywords: ['صَبَاحُ النُّور', 'أَنَا اسْمِي'],
          },
          {
            id: 'd1-5',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'كَمْ عُمْرُكَ يَا عُمَرُ؟',
            translitFr: 'Kam ‘umruka yā ‘Umar?',
            french: 'Quel âge as-tu Omar ?',
            keywords: ['كَمْ عُمْرُكَ'],
          },
          {
            id: 'd1-6',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'عُمْرِي سَبْعُ سَنَوَاتٍ.',
            translitFr: '‘Umrī sab‘u sanawāt.',
            french: 'J’ai sept ans.',
            keywords: ['عُمْرِي', 'سَبْعُ سَنَوَات'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: السَّلَامُ عَلَيْكُمْ / وَعَلَيْكُمُ السَّلَام',
          'الجملة 2: صَبَاحُ الخَيْرِ / صَبَاحُ النُّورِ',
          'الجملة 3: أَنَا اسْمِي عُمَرُ',
          'الجملة 4: عُمْرِي سَبْعُ سَنَوَاتٍ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ القِسْمِ وَالتَّعْرِيفُ بِالذَّاتِ',
        titleFr: 'Compréhension de l’oral : Consignes de classe & Découverte de soi',
        audioPromptAr: 'اسْتَمِعْ إِلَى كَلِمَاتِ الأُسْتَاذِ فِي القِسْمِ وَاخْتَرْ الحَرَكَةَ المَطْلُوبَةَ.',
        instructions: [
          {
            id: 'inst-1',
            arabic: 'سَطِّرْ',
            french: 'Souligne',
            translitFr: 'Saṭṭir',
            icon: '➖',
            descriptionFr: 'Tracer un trait sous le mot ou la phrase.',
            interactiveActionType: 'underline',
          },
          {
            id: 'inst-2',
            arabic: 'شَطِّبْ',
            french: 'Barre / Raye',
            translitFr: 'Shaṭṭib',
            icon: '✖️',
            descriptionFr: 'Mettre une croix ou barrer l’élément incorrect.',
            interactiveActionType: 'cross',
          },
          {
            id: 'inst-3',
            arabic: 'أُحِيطُ',
            french: 'Entoure',
            translitFr: 'Uḥīṭu',
            icon: '⭕',
            descriptionFr: 'Mettre un cercle autour de la lettre ou de l’image.',
            interactiveActionType: 'circle',
          },
        ],
        practiceTask: {
          questionAr: 'أَيْنَ تَسْمَعُ كَلِمَةَ «أُحِيطُ»؟ قُمْ بِإِحَاطَةِ حَرْفِ المِيمِ فِي الكَلِمَةِ «مَكْتَبٌ».',
          questionFr: 'Écoutez la consigne et entourez la lettre Mīm dans le mot « مَكْتَبٌ ».',
          targetTextAr: 'مَـ كْـ تَـ بٌ',
          options: ['مَـ', 'كْـ', 'تَـ', 'بٌ'],
          correctAnswer: 'مَـ',
          actionInstruction: 'أُحِيطُ حَرْفَ المِيمِ (Entoure la lettre Mīm)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: تَقْدِيمُ النَّفْسِ بِطَلَاقَةٍ + نَشِيدُ الحُرُوفِ',
        titleFr: 'Parler en continu : Présentation fluide de soi + Chant de l’Alphabet',
        promptAr: 'قُلْ جُمْلَتَكَ الشَّفَهِيَّةَ كَامِلَةً دُونَ تَوَقُّفٍ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، صَبَاحُ الخَيْرِ، أَنَا اسْمِي عُمَرُ، عُمْرِي سَبْعُ سَنَوَاتٍ.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, ṣabāḥu l-khayr, anā ismī ‘Umar, ‘umrī sab‘u sanawāt.',
        fullSpeechFr: 'Bonjour, que la paix soit sur vous. Je m’appelle Omar, j’ai 7 ans.',
        keyPointsFr: [
          'Saluer avec clarté : « السَّلَامُ عَلَيْكُم »',
          'Dire son prénom sans hésitation : « أَنَا اسْمِي... »',
          'Préciser son âge : « عُمْرِي سَبْعُ سَنَوَاتٍ »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ حُرُوفِ الهِجَاءِ (المَقْطَعُ الأَوَّلُ)',
          lyricsAr: [
            'أَلِفٌ.. بَاءٌ.. تَاءٌ.. ثَاءْ',
            'جِيمٌ.. حَاءٌ.. خَاءْ.. دَالْ',
            'رَاءٌ.. زَايٌ.. سِينٌ.. شِينْ',
            'لُغَتِي العَرَبِيَّةُ مَا أَحْلَاهَا!',
          ],
          lyricsFr: 'Chant mélodieux de l’alphabet arabe pour le rythme oral et la mémorisation.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الحِصَّةِ (1) وَحَرْفِ المِيمِ',
        titleFr: 'Compréhension de l’écrit : Lecture progressive & Lettre Mīm',
        readingPassageAr: 'السَّلَامُ عَلَيْكُمْ، صَبَاحُ الخَيْرِ، مَسَاءُ الخَيْرِ، أَنَا عُمَرُ.',
        readingPassageFr: 'Bonjour, bonne matinée, bonsoir, je suis Omar.',
        syllablesFocus: ['مَـ', 'مُـ', 'مِـ', 'مْ', 'مَا', 'مُو', 'مِي'],
        wordsToRead: [
          { word: 'عُمَرُ', translit: '‘Umar', french: 'Omar' },
          { word: 'مَسَاءُ', translit: 'Masā’u', french: 'Soir' },
          { word: 'مَكْتَبٌ', translit: 'Maktab', french: 'Bureau' },
          { word: 'مُمَرِّضَةٌ', translit: 'Mumarridhah', french: 'Infirmière' },
        ],
        quiz: {
          questionAr: 'مَا هُوَ اسْمُ الطِّفْلِ فِي النَّصِّ؟',
          questionFr: 'Quel est le prénom de l’enfant dans le texte ?',
          options: ['عُمَرُ', 'كَرِيمٌ', 'نَبِيلٌ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: نَقْلُ الاسْمِ وَكِتَابَةُ حَرْفِ المِيمِ',
        titleFr: 'Écriture : Recopier son prénom et tracer la lettre Mīm',
        copySentenceAr: 'أَنَا اسْمِي عُمَرُ.',
        copySentenceFr: 'Je m’appelle Omar.',
        letterPractice: ['مَ', 'مُ', 'مِ', 'مْ', 'مَا', 'مُو', 'مِي'],
        wordsToCopy: ['عُمَر', 'مَسَاء', 'مَدْرَسَة'],
        identityCardField: {
          fieldNameAr: 'الاسْمُ الكَامِلُ',
          fieldNameFr: 'Nom et Prénom',
          placeholderAr: 'اُكْتُبِ اسْمَكَ هُنَا...',
          exampleValue: 'عُمَرُ المَنْصُورِي',
        },
      },
    },

    // =================================== HESSA 2 ===================================
    {
      sessionNumber: 2,
      sessionTitleAr: 'الحِصَّةُ 2: التَّعْرِيفُ بِالعُمْرِ (حَرْفُ الكَافِ)',
      sessionTitleFr: 'Séance 2 : Salutation du soir et âge (Lettre Kāf)',
      targetLetter: {
        letter: 'ك',
        letterNameAr: 'حَرْفُ الكَافِ',
        letterNameFr: 'La lettre Kāf (ك)',
        forms: ['كـ', 'ـكـ', 'ـك', 'ك'],
        sampleWords: [
          { word: 'كِتَابٌ', translit: 'Kitāb', french: 'Livre', icon: '📖' },
          { word: 'كُرْسِيٌّ', translit: 'Kursīy', french: 'Chaise', icon: '🪑' },
          { word: 'كَلْبٌ', translit: 'Kalb', french: 'Chien', icon: '🐕' },
          { word: 'دِيكٌ', translit: 'Dīk', french: 'Coq', icon: '🐓' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ التَّعَارُفِ (2)',
        titleFr: 'Interaction Orale : Dialogue du soir et précision de l’âge',
        objectiveFr: 'Saluer le soir (« مَسَاءُ الخَيْر ») et répondre avec assurance sur son âge.',
        dialogue: [
          {
            id: 'd2-1',
            speaker: 'سَلْمَى',
            speakerAvatar: '👧',
            speakerRoleFr: 'Salma',
            arabic: 'السَّلَامُ عَلَيْكُمْ، مَسَاءُ الخَيْرِ!',
            translitFr: 'As-salāmu ‘alaykum, masā’u l-khayr!',
            french: 'Bonjour, bonsoir !',
            keywords: ['مَسَاءُ الخَيْر'],
          },
          {
            id: 'd2-2',
            speaker: 'كَرِيمٌ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Karim',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ، مَسَاءُ النُّورِ وَالسُّرُورِ!',
            translitFr: 'Wa ‘alaykumu s-salām, masā’u n-nūri wa s-surūr!',
            french: 'Bonsoir de lumière et de joie !',
            keywords: ['مَسَاءُ النُّور'],
          },
          {
            id: 'd2-3',
            speaker: 'سَلْمَى',
            speakerAvatar: '👧',
            speakerRoleFr: 'Salma',
            arabic: 'أَنَا اسْمِي سَلْمَى، وَمَا اسْمُكَ أَنْتَ؟',
            translitFr: 'Anā ismī Salmā, wa mās-muka anta?',
            french: 'Je m’appelle Salma, et quel est ton nom ?',
            keywords: ['اسْمِي سَلْمَى'],
          },
          {
            id: 'd2-4',
            speaker: 'كَرِيمٌ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Karim',
            arabic: 'أَنَا اسْمِي كَرِيمٌ، عُمْرِي سَبْعُ سَنَوَاتٍ.',
            translitFr: 'Anā ismī Karīm, ‘umrī sab‘u sanawāt.',
            french: 'Je m’appelle Karim, j’ai 7 ans.',
            keywords: ['اسْمِي كَرِيم', 'عُمْرِي سَبْعُ سَنَوَات'],
          },
          {
            id: 'd2-5',
            speaker: 'سَلْمَى',
            speakerAvatar: '👧',
            speakerRoleFr: 'Salma',
            arabic: 'أَهْلًا وَسَهْلًا بِكَ يَا صَدِيقِي كَرِيمُ!',
            translitFr: 'Ahlan wa sahlan bika yā ṣadīqī Karīm!',
            french: 'Bienvenue à toi mon ami Karim !',
            keywords: ['أَهْلًا وَسَهْلًا'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: مَسَاءُ الخَيْرِ / مَسَاءُ النُّورِ',
          'الجملة 2: اسْمِي كَرِيمٌ',
          'الجملة 3: عُمْرِي سَبْعُ سَنَوَاتٍ',
          'الجملة 4: أَهْلًا وَسَهْلًا بِكَ يَا كَرِيمُ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ التَّلْوِينِ وَالرَّبْطِ',
        titleFr: 'Compréhension de l’oral : Consignes « Colorie » et « Relie »',
        audioPromptAr: 'اسْتَمِعْ لِتَعْلِيمَاتِ الأُسْتَاذِ وَطَبِّقْهَا بِمَهَارَةٍ.',
        instructions: [
          {
            id: 'inst-4',
            arabic: 'لَوِّنْ',
            french: 'Colorie',
            translitFr: 'Lawwin',
            icon: '🎨',
            descriptionFr: 'Colorier la forme ou l’image avec la couleur demandée.',
            interactiveActionType: 'color',
          },
          {
            id: 'inst-5',
            arabic: 'صِلْ',
            french: 'Relie',
            translitFr: 'Ṣil',
            icon: '🔗',
            descriptionFr: 'Relier les deux éléments correspondants par un trait.',
            interactiveActionType: 'link',
          },
          {
            id: 'inst-6',
            arabic: 'سَطِّرْ',
            french: 'Souligne',
            translitFr: 'Saṭṭir',
            icon: '➖',
            descriptionFr: 'Souligner la bonne réponse.',
            interactiveActionType: 'underline',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْأُسْتَاذِ يَقُولُ: «لَوِّنْ حَرْفَ الكَافِ» فِي الكَلِمَةِ «كِتَابٌ».',
          questionFr: 'Écoutez la consigne : « Colorie la lettre Kāf » dans « كِتَابٌ ».',
          targetTextAr: 'كِـ تَا بٌ',
          options: ['كِـ', 'تَا', 'بٌ'],
          correctAnswer: 'كِـ',
          actionInstruction: 'لَوِّنْ حَرْفَ الكَافِ (Colorie la lettre Kāf)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: الإِفْصَاحُ عَنِ العُمْرِ بِسَلَاسَةٍ',
        titleFr: 'Parler en continu : Déclaration d’âge et d’identité en continu',
        promptAr: 'تَحَدَّثْ بِاسْتِرْسَالٍ عَنْ اسْمِكَ وَعُمْرِكَ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، مَسَاءُ الخَيْرِ، أَنَا اسْمِي كَرِيمٌ، عُمْرِي سَبْعُ سَنَوَاتٍ.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, masā’u l-khayr, anā ismī Karīm, ‘umrī sab‘u sanawāt.',
        fullSpeechFr: 'Bonjour, bonsoir, je m’appelle Karim, j’ai 7 ans.',
        keyPointsFr: [
          'Formule de politesse du soir : « مَسَاءُ الخَيْر »',
          'Enchaînement fluide : nom + âge sans pause bloquante',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ حُرُوفِ الهِجَاءِ (المَقْطَعُ الثَّانِي)',
          lyricsAr: [
            'صَادٌ.. ضَادٌ.. طَاءٌ.. ظَاءْ',
            'عَيْنٌ.. غَيْنٌ.. فَاءٌ.. قَافْ',
            'كَافٌ.. لَامٌ.. مِيمٌ.. نُونْ',
            'هَاءٌ.. وَاوٌ.. يَاءْ.. هِيَ اللُّغَةُ العَرَبِيَّةُ!',
          ],
          lyricsFr: 'Deuxième strophe du chant des lettres de l’alphabet.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الحِصَّةِ (2) وَحَرْفِ الكَافِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Kāf',
        readingPassageAr: 'السَّلَامُ عَلَيْكُمْ، مَسَاءُ الخَيْرِ، اسْمِي كَرِيمٌ، عُمْرِي سَبْعُ سَنَوَاتٍ.',
        readingPassageFr: 'Bonjour, bonsoir, mon nom est Karim, mon âge est sept ans.',
        syllablesFocus: ['كَـ', 'كُـ', 'كِـ', 'كْ', 'كَا', 'كُو', 'كِي'],
        wordsToRead: [
          { word: 'كَرِيمٌ', translit: 'Karīm', french: 'Karim / Généreux' },
          { word: 'كِتَابٌ', translit: 'Kitāb', french: 'Livre' },
          { word: 'كَبِيرٌ', translit: 'Kabīr', french: 'Grand' },
          { word: 'شُكْرًا', translit: 'Shukran', french: 'Merci' },
        ],
        quiz: {
          questionAr: 'كَمْ عُمْرُ كَرِيمٍ فِي النَّصِّ؟',
          questionFr: 'Quel est l’âge de Karim dans le texte ?',
          options: ['سَبْعُ سَنَوَاتٍ', 'خَمْسُ سَنَوَاتٍ', 'عَشْرُ سَنَوَاتٍ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: نَقْلُ جُمْلَةِ العُمْرِ وَحَرْفِ الكَافِ',
        titleFr: 'Écriture : Écrire son âge et tracer la lettre Kāf',
        copySentenceAr: 'عُمْرِي سَبْعُ سَنَوَاتٍ.',
        copySentenceFr: 'Mon âge est de sept ans.',
        letterPractice: ['كَ', 'كُ', 'كِ', 'كْ', 'كَا', 'كُو', 'كِي'],
        wordsToCopy: ['كَرِيم', 'كِتَاب', 'عُمْرِي'],
        identityCardField: {
          fieldNameAr: 'العُمْرُ / السِّنُّ',
          fieldNameFr: 'Âge',
          placeholderAr: 'اُكْتُبْ عُمْرَكَ...',
          exampleValue: '7 سَنَوَاتٍ',
        },
      },
    },

    // =================================== HESSA 3 ===================================
    {
      sessionNumber: 3,
      sessionTitleAr: 'الحِصَّةُ 3: مَكَانُ الوِلَادَةِ «وُلِدْتُ بِـ...» (حَرْفُ اللَّامِ)',
      sessionTitleFr: 'Séance 3 : Lieu de naissance « Je suis né à... » (Lettre Lām)',
      targetLetter: {
        letter: 'ل',
        letterNameAr: 'حَرْفُ اللَّامِ',
        letterNameFr: 'La lettre Lām (ل)',
        forms: ['لـ', 'ـلـ', 'ـل', 'ل', 'لا'],
        sampleWords: [
          { word: 'لِبَاسٌ', translit: 'Libās', french: 'Vêtement', icon: '👔' },
          { word: 'لَوْحَةٌ', translit: 'Lawḥah', french: 'Ardoise / Tableau', icon: '🖼️' },
          { word: 'قَلَمٌ', translit: 'Qalam', french: 'Stylo', icon: '🖊️' },
          { word: 'بَلَدٌ', translit: 'Balad', french: 'Pays', icon: '🌍' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ مَكَانِ الوِلَادَةِ (3)',
        titleFr: 'Interaction Orale : Dialogue sur le lieu de naissance',
        objectiveFr: 'Exprimer clairement son lieu de naissance avec la structure « وُلِدْتُ بِـ... ».',
        dialogue: [
          {
            id: 'd3-1',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا لَيْلَى.',
            translitFr: 'As-salāmu ‘alaykum yā Laylā.',
            french: 'Bonjour Layla.',
            keywords: ['السَّلَامُ عَلَيْكُم'],
          },
          {
            id: 'd3-2',
            speaker: 'لَيْلَى',
            speakerAvatar: '👧',
            speakerRoleFr: 'Layla',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ يَا أُسْتَاذُ، أَنَا اسْمِي لَيْلَى.',
            translitFr: 'Wa ‘alaykumu s-salāmu yā ustādh, anā ismī Laylā.',
            french: 'Bonjour maître, je m’appelle Layla.',
            keywords: ['اسْمِي لَيْلَى'],
          },
          {
            id: 'd3-3',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'أَيْنَ وُلِدْتِ يَا لَيْلَى؟',
            translitFr: 'Ayna wulidti yā Laylā?',
            french: 'Où es-tu née Layla ?',
            keywords: ['أَيْنَ وُلِدْتِ'],
          },
          {
            id: 'd3-4',
            speaker: 'لَيْلَى',
            speakerAvatar: '👧',
            speakerRoleFr: 'Layla',
            arabic: 'وُلِدْتُ بِـمَدِينَةِ الرِّبَاطِ.',
            translitFr: 'Wulidtu bi-madīnati r-Ribāṭ.',
            french: 'Je suis née dans la ville de Rabat.',
            keywords: ['وُلِدْتُ بِـ', 'الرِّبَاط'],
          },
          {
            id: 'd3-5',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'تَشَرَّفْنَا يَا لَيْلَى، مَرْحَبًا بِكِ!',
            translitFr: 'Tasharrafnā yā Laylā, marḥaban biki!',
            french: 'Enchanté Layla, bienvenue !',
            keywords: ['تَشَرَّفْنَا'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي لَيْلَى',
          'الجملة 2: عُمْرِي سَبْعُ سَنَوَاتٍ',
          'الجملة 3: وُلِدْتُ بِـمَدِينَةِ الرِّبَاطِ',
          'الجملة 4: تَشَرَّفْنَا',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ الكِتَابَةِ وَالقِرَاءَةِ',
        titleFr: 'Compréhension de l’oral : Consignes « Écris », « Lis », « Écoute »',
        audioPromptAr: 'اسْتَمِعْ جَيِّدًا لِلتَّعْلِيمَةِ وَاخْتَرْ الإِجَابَةَ الصَّحِيحَةَ.',
        instructions: [
          {
            id: 'inst-7',
            arabic: 'اُكْتُبْ',
            french: 'Écris',
            translitFr: 'Uktub',
            icon: '✍️',
            descriptionFr: 'Écrire la lettre, le mot ou la phrase sur le cahier ou la tablette.',
            interactiveActionType: 'write',
          },
          {
            id: 'inst-8',
            arabic: 'اِقْرَأْ',
            french: 'Lis',
            translitFr: 'Iqra’',
            icon: '📖',
            descriptionFr: 'Lire à voix haute avec prononciation correcte.',
            interactiveActionType: 'underline',
          },
          {
            id: 'inst-9',
            arabic: 'اِسْتَمِعْ',
            french: 'Écoute',
            translitFr: 'Istami‘',
            icon: '👂',
            descriptionFr: 'Écouter attentivement la consigne sonore.',
            interactiveActionType: 'circle',
          },
        ],
        practiceTask: {
          questionAr: 'الأُسْتَاذُ يَطْلُبُ: «صِلْ حَرْفَ اللَّامِ بِالكَلِمَةِ المُنَاسِبَةِ».',
          questionFr: 'Reliez la syllabe « لِـ » avec le mot qui convient.',
          targetTextAr: 'لِـ ــبَاسٌ',
          options: ['لِـبَاسٌ', 'كِتَابٌ', 'مَكْتَبٌ'],
          correctAnswer: 'لِـبَاسٌ',
          actionInstruction: 'صِلْ حَرْفَ اللَّامِ (Relie la lettre Lām)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: تَقْدِيمُ النَّفْسِ وَمَكَانِ الوِلَادَةِ',
        titleFr: 'Parler en continu : Identité et lieu de naissance d’un seul souffle',
        promptAr: 'تَكَلَّمْ بِاسْتِرْسَالٍ تَامٍّ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي لَيْلَى، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـمَدِينَةِ الرِّبَاطِ.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, anā ismī Laylā, ‘umrī sab‘u sanawāt, wulidtu bi-madīnati r-Ribāṭ.',
        fullSpeechFr: 'Bonjour, je m’appelle Layla, j’ai 7 ans, je suis née dans la ville de Rabat.',
        keyPointsFr: [
          'Articuler avec justesse : « وُلِدْتُ بِـ... » (Wulidtu bi...)',
          'Nommer la ville de naissance avec fierté',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ حُرُوفِ الهِجَاءِ (التَّرْدِيدُ الجَمَاعِيُّ)',
          lyricsAr: [
            'أَلِفٌ أُمِّي.. بَاءٌ بَيْتِي.. تَاءٌ تَاجِي.. ثَاءٌ ثَوْبِي',
            'جِيمٌ جَدِّي.. حَاءٌ حَقْلِي.. خَاءٌ خُبْزِي.. دَالٌ دَرْبِي',
          ],
          lyricsFr: 'Chant des lettres illustré par les objets du quotidien.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الحِصَّةِ (3) وَحَرْفِ اللَّامِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Lām',
        readingPassageAr: 'السَّلَامُ عَلَيْكُمْ، اسْمِي لَيْلَى، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـالرِّبَاطِ.',
        readingPassageFr: 'Bonjour, mon nom est Layla, j’ai sept ans, je suis née à Rabat.',
        syllablesFocus: ['لَـ', 'لُـ', 'لِـ', 'لْ', 'لَا', 'لُو', 'لِي'],
        wordsToRead: [
          { word: 'لَيْلَى', translit: 'Laylā', french: 'Layla' },
          { word: 'وُلِدْتُ', translit: 'Wulidtu', french: 'Je suis né(e)' },
          { word: 'الرِّبَاطِ', translit: 'Ar-Ribāṭ', french: 'Rabat' },
          { word: 'لِبَاسٌ', translit: 'Libās', french: 'Habit' },
        ],
        quiz: {
          questionAr: 'أَيْنَ وُلِدَتْ لَيْلَى؟',
          questionFr: 'Où est née Layla ?',
          options: ['بِـالرِّبَاطِ', 'بِـفَاسَ', 'بِـطَنْجَةَ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: نَقْلُ «وُلِدْتُ بِـ...» وَحَرْفِ اللَّامِ',
        titleFr: 'Écriture : Écrire son lieu de naissance et tracer la lettre Lām',
        copySentenceAr: 'وُلِدْتُ بِـمَدِينَةِ الرِّبَاطِ.',
        copySentenceFr: 'Je suis né(e) à Rabat.',
        letterPractice: ['لَ', 'لُ', 'لِ', 'لْ', 'لَا', 'لُو', 'لِي'],
        wordsToCopy: ['وُلِدْتُ', 'لَيْلَى', 'لِبَاس'],
        identityCardField: {
          fieldNameAr: 'مَكَانُ الوِلَادَةِ',
          fieldNameFr: 'Lieu de naissance',
          placeholderAr: 'مَدِينَةُ الوِلَادَةِ...',
          exampleValue: 'الرِّبَاطُ',
        },
      },
    },

    // =================================== HESSA 4 ===================================
    {
      sessionNumber: 4,
      sessionTitleAr: 'الحِصَّةُ 4: مَكَانُ السَّكَنِ «أَسْكُنُ فِي...» (حَرْفُ النُّونِ)',
      sessionTitleFr: 'Séance 4 : Lieu de résidence « J’habite à... » (Lettre Nūn)',
      targetLetter: {
        letter: 'ن',
        letterNameAr: 'حَرْفُ النُّونِ',
        letterNameFr: 'La lettre Nūn (ن)',
        forms: ['نـ', 'ـنـ', 'ـن', 'ن'],
        sampleWords: [
          { word: 'نَارٌ', translit: 'Nār', french: 'Feu', icon: '🔥' },
          { word: 'نَافِذَةٌ', translit: 'Nāfidhah', french: 'Fenêtre', icon: '🪟' },
          { word: 'مَنْزِلٌ', translit: 'Manzil', french: 'Maison', icon: '🏠' },
          { word: 'عَيْنٌ', translit: '‘Ayn', french: 'Œil', icon: '👁️' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ مَكَانِ السَّكَنِ (4)',
        titleFr: 'Interaction Orale : Dialogue sur le lieu d’habitation',
        objectiveFr: 'Exprimer où l’on habite avec la formule « أَسْكُنُ فِي... » et dialoguer avec un ami.',
        dialogue: [
          {
            id: 'd4-1',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا صَدِيقِي.',
            translitFr: 'As-salāmu ‘alaykum yā ṣadīqī.',
            french: 'Bonjour mon ami.',
            keywords: ['يَا صَدِيقِي'],
          },
          {
            id: 'd4-2',
            speaker: 'نَبِيلٌ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Nabil',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ، أَنَا اسْمِي نَبِيلٌ.',
            translitFr: 'Wa ‘alaykumu s-salām, anā ismī Nabīl.',
            french: 'Bonjour, je m’appelle Nabil.',
            keywords: ['اسْمِي نَبِيل'],
          },
          {
            id: 'd4-3',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'أَيْنَ تَسْكُنُ يَا نَبِيلُ؟',
            translitFr: 'Ayna taskunu yā Nabīl?',
            french: 'Où habites-tu Nabil ?',
            keywords: ['أَيْنَ تَسْكُن'],
          },
          {
            id: 'd4-4',
            speaker: 'نَبِيلٌ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Nabil',
            arabic: 'أَسْكُنُ فِي حَيِّ النَّخِيلِ بِـمَدِينَةِ فَاسَ.',
            translitFr: 'Askunu fī ḥayyi n-nakhīli bi-madīnati Fās.',
            french: 'J’habite dans le quartier Ennakhil dans la ville de Fès.',
            keywords: ['أَسْكُنُ فِي', 'حَيِّ النَّخِيل'],
          },
          {
            id: 'd4-5',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'مَدِينَةُ فَاسَ مَدِينَةٌ عَظِيمَةٌ وَجَمِيلَةٌ!',
            translitFr: 'Madīnatu Fāsa madīnatun ‘aẓīmatun wa jamīlah!',
            french: 'La ville de Fès est une ville magnifique et grandiose !',
            keywords: ['جَمِيلَة'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: اسْمِي نَبِيلٌ',
          'الجملة 2: عُمْرِي سَبْعُ سَنَوَاتٍ',
          'الجملة 3: وُلِدْتُ بِـفَاسَ',
          'الجملة 4: أَسْكُنُ فِي حَيِّ النَّخِيلِ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَمْيِيزُ تَعْلِيمَاتِ الدَّفْتَرِ وَالمَنْزِلِ',
        titleFr: 'Compréhension de l’oral : Consignes et phrases du domicile',
        audioPromptAr: 'اسْتَمِعْ لِلتَّعْلِيمَةِ وَاخْتَرْ الصُّورَةَ المُطَابِقَةَ.',
        instructions: [
          {
            id: 'inst-10',
            arabic: 'شَطِّبْ',
            french: 'Barre',
            translitFr: 'Shaṭṭib',
            icon: '❌',
            descriptionFr: 'Barrer la réponse fausse.',
            interactiveActionType: 'cross',
          },
          {
            id: 'inst-11',
            arabic: 'أُحِيطُ',
            french: 'Entoure',
            translitFr: 'Uḥīṭu',
            icon: '⭕',
            descriptionFr: 'Entourer le mot juste.',
            interactiveActionType: 'circle',
          },
        ],
        practiceTask: {
          questionAr: 'أُحِيطُ حَرْفَ النُّونِ فِي كَلِمَةِ «مَنْزِلٌ».',
          questionFr: 'Entourez la lettre Nūn dans « مَنْزِلٌ ».',
          targetTextAr: 'مَـ نْـ زِ لٌ',
          options: ['مَـ', 'نْـ', 'زِ', 'لٌ'],
          correctAnswer: 'نْـ',
          actionInstruction: 'أُحِيطُ حَرْفَ النُّونِ (Entoure la lettre Nūn)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: رَبْطُ الِاسْمِ وَالعُمْرِ وَالسَّكَنِ',
        titleFr: 'Parler en continu : Présentation complète (Nom, Âge, Naissance, Résidence)',
        promptAr: 'تَكَلَّمْ بِاسْتِرْسَالٍ دُونَ تَرَدُّدٍ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي نَبِيلٌ، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـفَاسَ، وَأَسْكُنُ فِي حَيِّ النَّخِيلِ.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, anā ismī Nabīl, ‘umrī sab‘u sanawāt, wulidtu bi-Fās, wa askunu fī ḥayyi n-nakhīl.',
        fullSpeechFr: 'Bonjour, je m’appelle Nabil, j’ai 7 ans, je suis né à Fès et j’habite au quartier Ennakhil.',
        keyPointsFr: [
          'Prononciation fluide du lieu d’habitation : « أَسْكُنُ فِي... »',
          'Enchaînement naturel des 4 informations clés',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ حُرُوفِ الهِجَاءِ (مَقْطَعُ النُّونِ)',
          lyricsAr: [
            'نُونٌ نُورٌ فِي القُرْآنْ.. يَهْدِي قَلْبَ الإِنْسَانْ',
            'نُونٌ نَجْمٌ فِي السَّمَاءِ.. يَلْمَعُ لَيْلًا بِالضِّيَاءِ',
          ],
          lyricsFr: 'Poème de la lettre Nūn rythmé et facile à retenir.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الحِصَّةِ (4) وَحَرْفِ النُّونِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Nūn',
        readingPassageAr: 'السَّلَامُ عَلَيْكُمْ، اسْمِي نَبِيلٌ، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـفَاسَ، أَسْكُنُ فِي حَيِّ النَّخِيلِ.',
        readingPassageFr: 'Bonjour, je m’appelle Nabil, j’ai 7 ans, je suis né à Fès, j’habite au quartier Ennakhil.',
        syllablesFocus: ['نَـ', 'نُـ', 'نِـ', 'نْ', 'نَا', 'نُو', 'نِي'],
        wordsToRead: [
          { word: 'نَبِيلٌ', translit: 'Nabīl', french: 'Nabil / Noble' },
          { word: 'أَسْكُنُ', translit: 'Askunu', french: 'J’habite' },
          { word: 'النَّخِيلِ', translit: 'An-Nakhīl', french: 'Les palmiers' },
          { word: 'مَنْزِلٌ', translit: 'Manzil', french: 'Maison' },
        ],
        quiz: {
          questionAr: 'أَيْنَ يَسْكُنُ نَبِيلٌ؟',
          questionFr: 'Où habite Nabil ?',
          options: ['فِي حَيِّ النَّخِيلِ', 'فِي المَدْرَسَةِ', 'فِي المَلْعَبِ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: نَقْلُ «أَسْكُنُ فِي...» وَحَرْفِ النُّونِ',
        titleFr: 'Écriture : Écrire son lieu d’habitation et tracer la lettre Nūn',
        copySentenceAr: 'أَسْكُنُ فِي حَيِّ النَّخِيلِ.',
        copySentenceFr: 'J’habite au quartier Ennakhil.',
        letterPractice: ['نَ', 'نُ', 'نِ', 'نْ', 'نَا', 'نُو', 'نِي'],
        wordsToCopy: ['أَسْكُنُ', 'نَبِيل', 'مَنْزِل'],
        identityCardField: {
          fieldNameAr: 'عُنْوَانُ السَّكَنِ',
          fieldNameFr: 'Adresse / Quartier',
          placeholderAr: 'اُكْتُبْ حَيَّكَ أَوْ مَدِينَتَكَ...',
          exampleValue: 'حَيُّ النَّخِيلِ - فَاس',
        },
      },
    },

    // =================================== HESSA 5 ===================================
    {
      sessionNumber: 5,
      sessionTitleAr: 'الحِصَّةُ 5: بَلَدُ الانْتِمَاءِ «أَنَا مِنْ...» وَبِطَاقَةُ التَّعْرِيفِ (حَرْفُ السِّينِ)',
      sessionTitleFr: 'Séance 5 : Pays d’origine & Fiche d’identité (Lettre Sīn)',
      targetLetter: {
        letter: 'س',
        letterNameAr: 'حَرْفُ السِّينِ',
        letterNameFr: 'La lettre Sīn (س)',
        forms: ['سـ', 'ـسـ', 'ـس', 'س'],
        sampleWords: [
          { word: 'سَيَّارَةٌ', translit: 'Sayyārah', french: 'Voiture', icon: '🚗' },
          { word: 'سَمَكٌ', translit: 'Samak', french: 'Poisson', icon: '🐟' },
          { word: 'مَسْجِدٌ', translit: 'Masjid', french: 'Mosquée', icon: '🕌' },
          { word: 'شَمْسٌ', translit: 'Shams', french: 'Soleil', icon: '☀️' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ الانْتِمَاءِ وَبِطَاقَةِ التَّعْرِيفِ (5)',
        titleFr: 'Interaction Orale : Dialogue complet d’identité et de nationalité',
        objectiveFr: 'Présenter son identité intégrale (Nom, Âge, Naissance, Résidence, Nationalité) avec la formule « أَنَا مِنْ... ».',
        dialogue: [
          {
            id: 'd5-1',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا سَامِي، رَحِّبْ بِأَصْدِقَائِكَ!',
            translitFr: 'As-salāmu ‘alaykum yā Sāmī, raḥḥib bi-aṣdiqā’ik!',
            french: 'Bonjour Sami, salue tes camarades !',
            keywords: ['السَّلَامُ عَلَيْكُم'],
          },
          {
            id: 'd5-2',
            speaker: 'سَامِي',
            speakerAvatar: '👦',
            speakerRoleFr: 'Sami',
            arabic: 'السَّلَامُ عَلَيْكُمْ! أَنَا اسْمِي سَامِي، عُمْرِي سَبْعُ سَنَوَاتٍ.',
            translitFr: 'As-salāmu ‘alaykum! Anā ismī Sāmī, ‘umrī sab‘u sanawāt.',
            french: 'Bonjour ! Je m’appelle Sami, j’ai 7 ans.',
            keywords: ['اسْمِي سَامِي', 'عُمْرِي سَبْعُ سَنَوَات'],
          },
          {
            id: 'd5-3',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'مِنْ أَيْنَ أَنْتَ يَا سَامِي؟',
            translitFr: 'Min ayna anta yā Sāmī?',
            french: 'D’où viens-tu Sami ?',
            keywords: ['مِنْ أَيْنَ أَنْتَ'],
          },
          {
            id: 'd5-4',
            speaker: 'سَامِي',
            speakerAvatar: '👦',
            speakerRoleFr: 'Sami',
            arabic: 'أَنَا مِنَ المَغْرِبِ، أَنَا مَغْرِبِيٌّ، وُلِدْتُ بِـطَنْجَةَ وَأَسْكُنُ فِي الدَّارِ البَيْضَاءِ.',
            translitFr: 'Anā mina l-Maghrib, anā maghribīy, wulidtu bi-Ṭanjah wa askunu fī d-Dāri l-Bayḍā’.',
            french: 'Je viens du Maroc, je suis marocain, je suis né à Tanger et j’habite à Casablanca.',
            keywords: ['أَنَا مِنَ المَغْرِب', 'أَنَا مَغْرِبِيّ'],
          },
          {
            id: 'd5-5',
            speaker: 'الأُسْتَاذُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'أَحْسَنْتَ يَا سَامِي! بَارَكَ اللهُ فِيكَ.',
            translitFr: 'Aḥsanta yā Sāmī! Bāraka l-Lāhu fīk.',
            french: 'Très bien dit Sami ! Bravo.',
            keywords: ['أَحْسَنْت'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: السَّلَامُ عَلَيْكُمْ، اسْمِي سَامِي',
          'الجملة 2: عُمْرِي سَبْعُ سَنَوَاتٍ',
          'الجملة 3: وُلِدْتُ بِـطَنْجَةَ، وَأَسْكُنُ فِي الدَّارِ البَيْضَاءِ',
          'الجملة 4: أَنَا مِنَ المَغْرِبِ، أَنَا مَغْرِبِيٌّ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَمْيِيزُ كَافَّةِ تَعْلِيمَاتِ القِسْمِ',
        titleFr: 'Compréhension de l’oral : Maîtrise globale des consignes de classe',
        audioPromptAr: 'اسْتَمِعْ لِتَعْلِيمَةِ الأُسْتَاذِ وَنَفِّذْهَا عَلَى الفَوْرِ.',
        instructions: [
          {
            id: 'inst-12',
            arabic: 'سَطِّرْ',
            french: 'Souligne',
            translitFr: 'Saṭṭir',
            icon: '➖',
            descriptionFr: 'Tracer une ligne sous le mot.',
            interactiveActionType: 'underline',
          },
          {
            id: 'inst-13',
            arabic: 'شَطِّبْ',
            french: 'Barre',
            translitFr: 'Shaṭṭib',
            icon: '✖️',
            descriptionFr: 'Barrer l’élément intrus.',
            interactiveActionType: 'cross',
          },
          {
            id: 'inst-14',
            arabic: 'أُحِيطُ',
            french: 'Entoure',
            translitFr: 'Uḥīṭu',
            icon: '⭕',
            descriptionFr: 'Entourer la lettre demandée.',
            interactiveActionType: 'circle',
          },
          {
            id: 'inst-15',
            arabic: 'لَوِّنْ',
            french: 'Colorie',
            translitFr: 'Lawwin',
            icon: '🎨',
            descriptionFr: 'Colorier avec soin.',
            interactiveActionType: 'color',
          },
        ],
        practiceTask: {
          questionAr: 'الأُسْتَاذُ يَقُولُ: «سَطِّرْ عَلَى اسْمِ البَلَدِ» فِي العِبَارَةِ «أَنَا مِنَ المَغْرِبِ».',
          questionFr: 'Soulignez le nom du pays dans « أَنَا مِنَ المَغْرِبِ ».',
          targetTextAr: 'أَنَا / مِنَ / المَغْرِبِ',
          options: ['أَنَا', 'مِنَ', 'المَغْرِبِ'],
          correctAnswer: 'المَغْرِبِ',
          actionInstruction: 'سَطِّرْ عَلَى اسْمِ البَلَدِ (Souligne le nom du pays)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: التَّقْدِيمُ الشَّامِلُ لِلْهُوِيَّةِ وَالانْتِمَاءِ',
        titleFr: 'Parler en continu : Discours intégral de présentation (Niveau A1 Maîtrisé)',
        promptAr: 'قَدِّمْ نَفْسَكَ بِاسْتِرْسَالٍ كَامِلٍ أَمَامَ القِسْمِ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، أَنَا اسْمِي سَامِي، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـطَنْجَةَ، أَسْكُنُ فِي الدَّارِ البَيْضَاءِ، وَأَنَا مِنَ المَغْرِبِ.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, anā ismī Sāmī, ‘umrī sab‘u sanawāt, wulidtu bi-Ṭanjah, askunu fī d-Dāri l-Bayḍā’, wa anā mina l-Maghrib.',
        fullSpeechFr: 'Bonjour, je m’appelle Sami, j’ai 7 ans, je suis né à Tanger, j’habite à Casablanca et je viens du Maroc.',
        keyPointsFr: [
          'Élocution continue sans rupture',
          'Intonation joyeuse et communicative',
          'Enchaînement des 5 éléments de la carte d’identité',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ حُرُوفِ الهِجَاءِ كَامِلًا',
          lyricsAr: [
            'أَلِفٌ، بَاءٌ، تَاءٌ، ثَاءْ.. جِيمٌ، حَاءٌ، خَاءْ، دَالْ',
            'ذَالٌ، رَاءٌ، زَايٌ، سِينْ.. شِينٌ، صَادٌ، ضَادٌ، طَاءْ',
            'ظَاءٌ، عَيْنٌ، غَيْنٌ، فَاءْ.. قَافٌ، كَافٌ، لَامٌ، مِيمْ',
            'نُونٌ، هَاءٌ، وَاوٌ، يَاءْ.. هَذِهِ حُرُوفُ الهِجَاءِ!',
          ],
          lyricsFr: 'L’alphabet arabe complet chanté en choeur avec joie.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الحِصَّةِ (5) وَحَرْفِ السِّينِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Sīn',
        readingPassageAr: 'السَّلَامُ عَلَيْكُمْ، اسْمِي سَامِي، عُمْرِي سَبْعُ سَنَوَاتٍ، وُلِدْتُ بِـطَنْجَةَ، أَسْكُنُ فِي الدَّارِ البَيْضَاءِ، أَنَا مِنَ المَغْرِبِ.',
        readingPassageFr: 'Bonjour, je m’appelle Sami, j’ai 7 ans, je suis né à Tanger, j’habite à Casablanca, je viens du Maroc.',
        syllablesFocus: ['سَـ', 'سُـ', 'سِـ', 'سْ', 'سَا', 'سُو', 'سِي'],
        wordsToRead: [
          { word: 'سَامِي', translit: 'Sāmī', french: 'Sami' },
          { word: 'السَّلَامُ', translit: 'As-Salām', french: 'La paix / Bonjour' },
          { word: 'سَنَوَاتٍ', translit: 'Sanawāt', french: 'Années' },
          { word: 'المَغْرِبِ', translit: 'Al-Maghrib', french: 'Le Maroc' },
        ],
        quiz: {
          questionAr: 'مِنْ أَيِّ بَلَدٍ سَامِي؟',
          questionFr: 'De quel pays vient Sami ?',
          options: ['مِنَ المَغْرِبِ', 'مِنْ فَرَنْسَا', 'مِنْ كَنَدَا'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: مَلْءُ بِطَاقَةِ التَّعْرِيفِ الشَّخْصِيَّةِ وَحَرْفِ السِّينِ',
        titleFr: 'Écriture : Remplir sa Fiche d’Identité & Tracer la lettre Sīn',
        copySentenceAr: 'أَنَا مِنَ المَغْرِبِ، أَنَا مَغْرِبِيٌّ.',
        copySentenceFr: 'Je viens du Maroc, je suis marocain.',
        letterPractice: ['سَ', 'سُ', 'سِ', 'سْ', 'سَا', 'سُو', 'سِي'],
        wordsToCopy: ['سَامِي', 'السَّلَام', 'المَغْرِب'],
        identityCardField: {
          fieldNameAr: 'البَلَدُ / الجِنْسِيَّةُ',
          fieldNameFr: 'Pays / Nationalité',
          placeholderAr: 'اُكْتُبْ بَلَدَكَ أَوْ جِنْسِيَّتَكَ...',
          exampleValue: 'المَغْرِبُ - مَغْرِبِيٌّ',
        },
      },
    },
  ],

  // =================================== HESSA 6 (ÉVALUATION) ===================================
  consolidationSession: {
    sessionNumber: 6,
    titleAr: 'الحِصَّةُ 6: أَنْشِطَةُ تَقْوِيمِ وَدَعْمِ تَعَلُّمَاتِ الوَحْدَةِ الأُولَى',
    titleFr: 'Séance 6 : Évaluation & Consolidation des Acquis de l’Unité 1',
    descriptionFr: 'Bilan complet et interactif des 5 compétences de l’unité : Dialogue, Consignes de classe, Oral continu, Lecture et Fiche d’identité.',
    evaluationTasks: [
      {
        id: 'eval-1',
        type: 'dialogue_match',
        questionAr: 'صِلْ كُلَّ سُؤَالٍ بِالجَوَابِ المُنَاسِبِ لَهُ:',
        questionFr: 'Reliez chaque question à sa réponse adéquate :',
        items: [
          { q: 'مَا اسْمُكَ؟', a: 'أَنَا اسْمِي عُمَرُ.' },
          { q: 'كَمْ عُمْرُكَ؟', a: 'عُمْرِي سَبْعُ سَنَوَاتٍ.' },
          { q: 'أَيْنَ وُلِدْتَ؟', a: 'وُلِدْتُ بِـمَدِينَةِ الرِّبَاطِ.' },
          { q: 'أَيْنَ تَسْكُنُ؟', a: 'أَسْكُنُ فِي حَيِّ النَّخِيلِ.' },
          { q: 'مِنْ أَيْنَ أَنْتَ؟', a: 'أَنَا مِنَ المَغْرِبِ.' },
        ],
      },
      {
        id: 'eval-2',
        type: 'instruction_action',
        questionAr: 'اسْتَمِعْ إِلَى تَعْلِيمَةِ الأُسْتَاذِ وَاخْتَرْ التَّصَرُّفَ الصَّحِيحَ:',
        questionFr: 'Écoutez la consigne du maître et cochez l’action requise :',
        items: [
          { instruction: 'سَطِّرْ تَحْتَ الكَلِمَةِ', french: 'Souligne sous le mot', symbol: '➖' },
          { instruction: 'شَطِّبْ عَلَى الخَطَأِ', french: 'Barre l’erreur', symbol: '✖️' },
          { instruction: 'أُحِيطُ الإِجَابَةَ الصَّحِيحَةَ', french: 'J’entoure la bonne réponse', symbol: '⭕' },
          { instruction: 'لَوِّنْ الرَّسْمَ', french: 'Colorie le dessin', symbol: '🎨' },
          { instruction: 'صِلْ بِسَهْمٍ', french: 'Relie avec une flèche', symbol: '🔗' },
        ],
      },
      {
        id: 'eval-3',
        type: 'continuous_presentation',
        questionAr: 'قُمِ الآنَ بِإِلْقَاءِ بَيَانِ هُوِيَّتِكَ الكَامِلِ أَمَامَ زُمَلَائِكَ بِاسْتِرْسَالٍ:',
        questionFr: 'Prononcez votre présentation continue intégrale :',
        items: [
          'السَّلَامُ عَلَيْكُمْ',
          'أَنَا اسْمِي [اسْمُكَ]',
          'عُمْرِي [عُمْرُكَ] سَنَوَاتٍ',
          'وُلِدْتُ بِـ [مَدِينَتُكَ]',
          'أَسْكُنُ فِي [حَيُّكَ]',
          'أَنَا مِنْ [بَلَدُكَ]',
        ],
      },
    ],
  },
};
