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


export const UNIT_1_SCHOOL_LIFE: UnitCurriculum = {
  unitId: 'unit-1-school',
  unitNumber: 1,
  academicYear: '2024/2025 - 2025/2026',
  themeAr: 'المجال الأول: الحَيَاةُ المَدْرَسِيَّةُ وَالتَّعَارُفُ',
  themeFr: 'Domaine 1 : La Vie Scolaire & Découverte de Soi',
  level: 'السنة الأولى ابتدائي (A1 - Niveau 1)',
  descriptionFr: 'Programme officiel de la première unité (Domaine 1) : Découverte de la vie scolaire, salutations et présentation de soi, matériel de classe, consignes scolaires, chant de l’école et apprentissage progressif des lettres fondamentales (د، ر، ب، ت، ج).',
  sessions: [
    // =================================== HESSA 1 ===================================
    {
      sessionNumber: 1,
      sessionTitleAr: 'الحِصَّةُ 1: الدُّخُولُ المَدْرَسِيُّ وَتَبَادُلُ التَّحِيَّةِ (حَرْفُ الدَّالِ)',
      sessionTitleFr: 'Séance 1 : Rentrée scolaire & Salutations (Lettre Dāl - د)',
      targetLetter: {
        letter: 'د',
        letterNameAr: 'حَرْفُ الدَّالِ',
        letterNameFr: 'La lettre Dāl (د)',
        forms: ['د', 'ـد'],
        sampleWords: [
          { word: 'دَفْتَرٌ', translit: 'Daftar', french: 'Cahier', icon: '📓' },
          { word: 'دَارٌ', translit: 'Dār', french: 'Maison', icon: '🏡' },
          { word: 'دُمْيَةٌ', translit: 'Dumyah', french: 'Poupée', icon: '🧸' },
          { word: 'مَدْرَسَةٌ', translit: 'Madrasah', french: 'École', icon: '🏫' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ التَّحِيَّةِ وَالتَّعَارُفِ فِي المَدْرَسَةِ',
        titleFr: 'Interaction Orale : Dialogue d’accueil et échange de salutations',
        objectiveFr: 'Saluer avec politesse à l’école (« السَّلَامُ عَلَيْكُم » / « صَبَاحُ الخَيْر ») et donner son prénom avec assurance.',
        dialogue: [
          {
            id: 'u1-d1-1',
            speaker: 'الأُسْتَاذُ الحَسَنُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا أَطْفَالُ، مَرْحَبًا بِكُمْ فِي مَدْرَسَتِنَا!',
            translitFr: 'As-salāmu ‘alaykum yā aṭfāl, marḥaban bikum fī madrasatinā!',
            french: 'Que la paix soit sur vous les enfants, bienvenue dans notre école !',
            keywords: ['السَّلَامُ عَلَيْكُم', 'مَرْحَبًا بِكُمْ'],
          },
          {
            id: 'u1-d1-2',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ يَا أُسْتَاذِي، صَبَاحُ الخَيْرِ!',
            translitFr: 'Wa ‘alaykumu s-salāmu yā ustādhī, ṣabāḥu l-khayr!',
            french: 'Et sur vous la paix mon maître, bonjour !',
            keywords: ['وَعَلَيْكُمُ السَّلَام', 'صَبَاحُ الخَيْر'],
          },
          {
            id: 'u1-d1-3',
            speaker: 'الأُسْتَاذُ الحَسَنُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'صَبَاحُ النُّورِ! مَا اسْمُكَ يَا بَطَلُ؟',
            translitFr: 'Ṣabāḥu n-nūr! Mās-muka yā baṭal?',
            french: 'Bonjour ! Quel est ton nom jeune champion ?',
            keywords: ['صَبَاحُ النُّور', 'مَا اسْمُكَ'],
          },
          {
            id: 'u1-d1-4',
            speaker: 'عُمَرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Omar',
            arabic: 'أَنَا اسْمِي عُمَرُ، تِلْمِيذٌ جَدِيدٌ فِي السَّنَةِ الأُولَى.',
            translitFr: 'Anā ismī ‘Umar, tilmīdhun jadīdun fī s-sanati l-ūlā.',
            french: 'Je m’appelle Omar, nouvel élève en première année.',
            keywords: ['أَنَا اسْمِي', 'تِلْمِيذٌ جَدِيد'],
          },
          {
            id: 'u1-d1-5',
            speaker: 'الأُسْتَاذُ الحَسَنُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant',
            arabic: 'أَهْلًا وَسَهْلًا بِكَ يَا عُمَرُ فِي قِسْمِنَا الجَمِيلِ.',
            translitFr: 'Ahlan wa sahlan bika yā ‘Umar fī qisminā l-jamīl.',
            french: 'Bienvenue à toi Omar dans notre belle classe.',
            keywords: ['أَهْلًا وَسَهْلًا', 'قِسْمِنَا الجَمِيل'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: السَّلَامُ عَلَيْكُمْ / وَعَلَيْكُمُ السَّلَامُ',
          'الجملة 2: صَبَاحُ الخَيْرِ / صَبَاحُ النُّورِ',
          'الجملة 3: أَنَا اسْمِي عُمَرُ، تِلْمِيذٌ جَدِيدٌ',
          'الجملة 4: أَهْلًا وَسَهْلًا بِكَ فِي قِسْمِنَا',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ القِسْمِ وَالانْتِبَاهِ (1)',
        titleFr: 'Compréhension de l’oral : Consignes de base en classe',
        audioPromptAr: 'اسْتَمِعْ إِلَى تَعْلِيمَاتِ الأُسْتَاذِ فِي القِسْمِ وَاخْتَرْ الحَرَكَةَ المُنَاسِبَةَ.',
        instructions: [
          {
            id: 'u1-inst-1',
            arabic: 'اسْتَمِعْ',
            french: 'Écoute',
            translitFr: 'Istami‘',
            icon: '👂',
            descriptionFr: 'Prêter l’oreille attentivement à la consigne.',
            interactiveActionType: 'circle',
          },
          {
            id: 'u1-inst-2',
            arabic: 'انْظُرْ',
            french: 'Regarde',
            translitFr: 'Unẓur',
            icon: '👀',
            descriptionFr: 'Regarder attentivement le tableau ou le livre.',
            interactiveActionType: 'underline',
          },
          {
            id: 'u1-inst-3',
            arabic: 'رَدِّدْ',
            french: 'Répète',
            translitFr: 'Raddid',
            icon: '🗣️',
            descriptionFr: 'Répéter à voix haute après le professeur.',
            interactiveActionType: 'write',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْأُسْتَاذِ يَقُولُ: «أُحِيطُ حَرْفَ الدَّالِ» فِي الكَلِمَةِ «دَفْتَرٌ».',
          questionFr: 'Écoutez la consigne et entourez la lettre Dāl dans le mot « دَفْتَرٌ ».',
          targetTextAr: 'دَ فْـ تَـ رٌ',
          options: ['دَ', 'فْـ', 'تَـ', 'رٌ'],
          correctAnswer: 'دَ',
          actionInstruction: 'أُحِيطُ حَرْفَ الدَّالِ (Entoure la lettre Dāl)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: التَّعْرِيفُ بِالنَّفْسِ فِي المَدْرَسَةِ + نَشِيدُ المَدْرَسَةِ',
        titleFr: 'Parler en continu : Présentation de soi & Chant de l’école',
        promptAr: 'قُلْ جُمْلَتَكَ التَّعْرِيفِيَّةَ فِي المَدْرَسَةِ دُونَ انْقِطَاعٍ:',
        fullSpeechAr: 'السَّلَامُ عَلَيْكُمْ، صَبَاحُ الخَيْرِ، أَنَا اسْمِي عُمَرُ، أَنَا تِلْمِيذٌ فِي السَّنَةِ الأُولَى ابْتِدَائِي، أُحِبُّ مَدْرَسَتِي.',
        fullSpeechTranslitFr: 'As-salāmu ‘alaykum, ṣabāḥu l-khayr, anā ismī ‘Umar, anā tilmīdhun fī s-sanati l-ūlā, uḥibbu madrasatī.',
        fullSpeechFr: 'Bonjour, je m’appelle Omar, je suis élève en 1ère année primaire, j’aime mon école.',
        keyPointsFr: [
          'Saluer avec respect : « السَّلَامُ عَلَيْكُمْ »',
          'Décliner son prénom clairement : « أَنَا اسْمِي عُمَر »',
          'Indiquer son niveau : « أَنَا تِلْمِيذٌ فِي السَّنَةِ الأُولَى »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ مَدْرَسَتِي الحَبِيبَةِ',
          lyricsAr: [
            'مَدْرَسَتِي يَا مَدْرَسَتِي ... يَا نُورَ العَقْلِ وَمُنْيَتِي',
            'فِيكِ أَقْضِي أَحْلَى زَمَنِ ... أَتَعَلَّمُ خَيْرَ المِهَنِ',
            'أَلْقَى أَصْدِقَائِي فَرَحًا ... نَمْضِي نَحْوَ العِلْمِ مَعًا!',
          ],
          lyricsFr: 'Chant joyeux d’accueil à l’école et d’amour de l’apprentissage.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الدُّخُولِ المَدْرَسِيِّ وَحَرْفِ الدَّالِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Dāl',
        readingPassageAr: 'دَخَلَ عُمَرُ المَدْرَسَةَ. قَالَتْ زَيْنَبُ: مَرْحَبًا يَا عُمَرُ! دَفْتَرُ عُمَرَ جَدِيدٌ وَنَظِيفٌ.',
        readingPassageFr: 'Omar est entré à l’école. Zineb a dit : Bienvenue Omar ! Le cahier d’Omar est neuf et propre.',
        syllablesFocus: ['دَ', 'دُ', 'دِ', 'دْ', 'دَا', 'دُو', 'دِي'],
        wordsToRead: [
          { word: 'دَفْتَرٌ', translit: 'Daftar', french: 'Cahier' },
          { word: 'دَارٌ', translit: 'Dār', french: 'Maison' },
          { word: 'دُمْيَةٌ', translit: 'Dumyah', french: 'Poupée' },
          { word: 'مَدْرَسَةٌ', translit: 'Madrasah', french: 'École' },
        ],
        quiz: {
          questionAr: 'مَاذَا دَخَلَ عُمَرُ فِي النَّصِّ؟',
          questionFr: 'Où Omar est-il entré dans le texte ?',
          options: ['المَدْرَسَةَ', 'السُّوقَ', 'الحَدِيقَةَ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: رَسْمُ حَرْفِ الدَّالِ وَبِطَاقَةُ التِّلْمِيذِ',
        titleFr: 'Écriture : Tracer la lettre Dāl et remplir le prénom sur la carte',
        copySentenceAr: 'دَخَلَ عُمَرُ المَدْرَسَةَ الجَمِيلَةَ.',
        copySentenceFr: 'Omar est entré dans la belle école.',
        letterPractice: ['دَ', 'دُ', 'دِ', 'دْ', 'دَا', 'دُو', 'دِي'],
        wordsToCopy: ['دَفْتَر', 'دَار', 'مَدْرَسَة'],
        identityCardField: {
          fieldNameAr: 'الاسْمُ الشَّخْصِيُّ لِلتِّلْمِيذِ',
          fieldNameFr: 'Prénom de l’élève',
          placeholderAr: 'اُكْتُبِ اسْمَكَ الشَّخْصِيَّ...',
          exampleValue: 'عُمَر',
        },
      },
    },

    // =================================== HESSA 2 ===================================
    {
      sessionNumber: 2,
      sessionTitleAr: 'الحِصَّةُ 2: الأَدَوَاتُ المَدْرَسِيَّةُ وَفَضَاءُ القِسْمِ (حَرْفُ الرَّاءِ)',
      sessionTitleFr: 'Séance 2 : Matériel scolaire et espace de classe (Lettre Rā’ - ر)',
      targetLetter: {
        letter: 'ر',
        letterNameAr: 'حَرْفُ الرَّاءِ',
        letterNameFr: 'La lettre Rā’ (ر)',
        forms: ['ر', 'ـر'],
        sampleWords: [
          { word: 'مِسْطَرَةٌ', translit: 'Misṭarah', french: 'Règle', icon: '📏' },
          { word: 'رَسْمٌ', translit: 'Rasm', french: 'Dessin', icon: '🎨' },
          { word: 'رَفِيقٌ', translit: 'Rafīq', french: 'Camarade', icon: '👦' },
          { word: 'مِبْرَاةٌ', translit: 'Mibrāh', french: 'Taille-crayon', icon: '✏️' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ الأَدَوَاتِ المَدْرَسِيَّةِ وَالمِحْفَظَةِ',
        titleFr: 'Interaction Orale : Dialogue du matériel scolaire',
        objectiveFr: 'Nommer les fournitures scolaires (« مِحْفَظَة »، « مِسْطَرَة »، « مِبْرَاة ») et décrire le contenu de son cartable.',
        dialogue: [
          {
            id: 'u1-d2-1',
            speaker: 'المُعَلِّمَةُ',
            speakerAvatar: '👩‍🏫',
            speakerRoleFr: 'La maîtresse',
            arabic: 'صَبَاحُ الخَيْرِ يَا رِيمُ، مَاذَا فِي مِحْفَظَتِكِ المَدْرَسِيَّةِ؟',
            translitFr: 'Ṣabāḥu l-khayr yā Rīm, mādhā fī miḥfaẓatiki l-madrasiyyah?',
            french: 'Bonjour Rime, qu’y a-t-il dans ton cartable scolaire ?',
            keywords: ['صَبَاحُ الخَيْر', 'مِحْفَظَتِكِ'],
          },
          {
            id: 'u1-d2-2',
            speaker: 'رِيمُ',
            speakerAvatar: '👧',
            speakerRoleFr: 'Rime',
            arabic: 'صَبَاحُ النُّورِ يَا أُسْتَاذَتِي! فِي مِحْفَظَتِي كِتَابٌ وَدَفْتَرٌ وَمِسْطَرَةٌ.',
            translitFr: 'Ṣabāḥu n-nūr yā ustādhatī! Fī miḥfaẓatī kitābun wa daftarun wa misṭarah.',
            french: 'Bonjour maîtresse ! Dans mon cartable se trouvent un livre, un cahier et une règle.',
            keywords: ['كِتَابٌ', 'دَفْتَرٌ', 'مِسْطَرَةٌ'],
          },
          {
            id: 'u1-d2-3',
            speaker: 'المُعَلِّمَةُ',
            speakerAvatar: '👩‍🏫',
            speakerRoleFr: 'La maîtresse',
            arabic: 'وَأَيْنَ أَقْلَامُكِ المُلَوَّنَةُ يَا رِيمُ؟',
            translitFr: 'Wa ayna aqlāmuki l-mulawwanatu yā Rīm?',
            french: 'Et où sont tes crayons de couleur Rime ?',
            keywords: ['أَقْلَامُكِ المُلَوَّنَة'],
          },
          {
            id: 'u1-d2-4',
            speaker: 'رِيمُ',
            speakerAvatar: '👧',
            speakerRoleFr: 'Rime',
            arabic: 'أَقْلَامِي دَاخِلَ المِقْلَمَةِ مَعَ المِمْحَاةِ وَالمِبْرَاةِ.',
            translitFr: 'Aqlāmī dākhila l-miqlamati ma‘a l-mimḥāti wa l-mibrāh.',
            french: 'Mes crayons sont dans la trousse avec la gomme et le taille-crayon.',
            keywords: ['المِقْلَمَة', 'المِمْحَاة', 'المِبْرَاة'],
          },
          {
            id: 'u1-d2-5',
            speaker: 'المُعَلِّمَةُ',
            speakerAvatar: '👩‍🏫',
            speakerRoleFr: 'La maîtresse',
            arabic: 'أَحْسَنْتِ يَا رِيمُ، أَدَوَاتُكِ مُرَتَّبَةٌ وَنَظِيفَةٌ جِدًّا!',
            translitFr: 'Aḥsanti yā Rīm, adawātuki murattabatun wa naẓīfatun jiddan!',
            french: 'Bravo Rime, tes fournitures sont très bien rangées et propres !',
            keywords: ['أَدَوَاتُكِ مُرَتَّبَة'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: مَاذَا فِي مِحْفَظَتِكِ يَا رِيمُ؟',
          'الجملة 2: فِي مِحْفَظَتِي كِتَابٌ وَدَفْتَرٌ وَمِسْطَرَةٌ',
          'الجملة 3: أَقْلَامِي دَاخِلَ المِقْلَمَةِ مَعَ المِبْرَاةِ',
          'الجملة 4: أَدَوَاتِي مُرَتَّبَةٌ وَنَظِيفَةٌ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ اسْتِعْمَالِ الأَدَوَاتِ (2)',
        titleFr: 'Compréhension de l’oral : Consignes d’utilisation des fournitures',
        audioPromptAr: 'اسْتَمِعْ لِتَعْلِيمَاتِ المُعَلِّمَةِ حَوْلَ الأَدَوَاتِ وَطَبِّقْهَا:',
        instructions: [
          {
            id: 'u1-inst-4',
            arabic: 'افْتَحِ المِحْفَظَةَ',
            french: 'Ouvre le cartable',
            translitFr: 'Iftaḥi l-miḥfaẓah',
            icon: '🎒',
            descriptionFr: 'Ouvrir délicatement son cartable.',
            interactiveActionType: 'circle',
          },
          {
            id: 'u1-inst-5',
            arabic: 'خُذِ القَلَمَ',
            french: 'Prends le crayon',
            translitFr: 'Khudhi l-qalam',
            icon: '✏️',
            descriptionFr: 'Tenir correctement son stylo ou crayon.',
            interactiveActionType: 'underline',
          },
          {
            id: 'u1-inst-6',
            arabic: 'ضَعِ الكِتَابَ',
            french: 'Pose le livre',
            translitFr: 'Ḍa‘i l-kitāb',
            icon: '📖',
            descriptionFr: 'Poser le livre à plat sur le bureau.',
            interactiveActionType: 'write',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْمُعَلِّمَةِ تَقُولُ: «لَوِّنْ حَرْفَ الرَّاءِ» فِي الكَلِمَةِ «مِسْطَرَةٌ».',
          questionFr: 'Écoutez la consigne : « Colorie la lettre Rā’ » dans « مِسْطَرَةٌ ».',
          targetTextAr: 'مِـ سْـ طَـ رَ ةٌ',
          options: ['مِـ', 'سْـ', 'طَـ', 'رَ'],
          correctAnswer: 'رَ',
          actionInstruction: 'لَوِّنْ حَرْفَ الرَّاءِ (Colorie la lettre Rā’)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: وَصْفُ أَدَوَاتِي المَدْرَسِيَّةِ بِطَلَاقَةٍ',
        titleFr: 'Parler en continu : Présentation fluide de ses fournitures scolaires',
        promptAr: 'تَحَدَّثْ بِاسْتِرْسَالٍ عَنْ أَدَوَاتِكَ المَدْرَسِيَّةِ:',
        fullSpeechAr: 'أَنَا أُحَافِظُ عَلَى أَدَوَاتِي المَدْرَسِيَّةِ: فِي مِحْفَظَتِي دَفْتَرٌ وَمِسْطَرَةٌ وَمِبْرَاةٌ، وَأَنَا أَرْسُمُ بِالأَلْوَانِ الجَمِيلَةِ.',
        fullSpeechTranslitFr: 'Anā uḥāfiẓu ‘alā adawātī l-madrasiyyah: fī miḥfaẓatī daftarun wa misṭaratun wa mibrāh, wa anā arsumu bi-l-alwāni l-jamīlah.',
        fullSpeechFr: 'Je prends soin de mes fournitures : dans mon cartable j’ai un cahier, une règle et un taille-crayon, et je dessine avec de belles couleurs.',
        keyPointsFr: [
          'Affirmer le soin apporté à ses affaires : « أُحَافِظُ عَلَى أَدَوَاتِي »',
          'Énumérer 3 fournitures avec la lettre ر : « دَفْتَر، مِسْطَرَة، مِبْرَاة »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ أَدَوَاتِي المَدْرَسِيَّةِ',
          lyricsAr: [
            'قَلَمِي يَرْسُمُ.. قَلَمِي يَكْتُبْ ... مَعَهُ العِلْمُ حَبِيبٌ طَيِّبْ',
            'مِسْطَرَتِي لِلتَّسْطِيرِ سَبِيلْ ... وَكِتَابِي نُورٌ وَدَلِيلْ',
            'مِحْفَظَتِي تَحْوِي أَمَلِي ... أَمْضِي فَرَحًا نَحْوَ عَمَلِي!',
          ],
          lyricsFr: 'Chant poétique des fournitures scolaires et de l’amour de l’étude.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الأَدَوَاتِ وَحَرْفِ الرَّاءِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Rā’',
        readingPassageAr: 'فِي مِحْفَظَةِ رِيمَ مِسْطَرَةٌ وَمِبْرَاةٌ. رَسَمَتْ رِيمُ وَرْدَةً حَمْرَاءَ بِالأَلْوَانِ. رَفِيقُهَا رَشِيدٌ يُحِبُّ القِرَاءَةَ.',
        readingPassageFr: 'Dans le cartable de Rime se trouvent une règle et un taille-crayon. Rime a dessiné une rose rouge avec les couleurs. Son camarade Rachid aime la lecture.',
        syllablesFocus: ['رَ', 'رُ', 'رِ', 'رْ', 'رَا', 'رُو', 'رِي'],
        wordsToRead: [
          { word: 'مِسْطَرَةٌ', translit: 'Misṭarah', french: 'Règle' },
          { word: 'مِبْرَاةٌ', translit: 'Mibrāh', french: 'Taille-crayon' },
          { word: 'رَفِيقٌ', translit: 'Rafīq', french: 'Camarade' },
          { word: 'رَسْمٌ', translit: 'Rasm', french: 'Dessin' },
        ],
        quiz: {
          questionAr: 'مَاذَا رَسَمَتْ رِيمُ فِي النَّصِّ؟',
          questionFr: 'Qu’a dessiné Rime dans le texte ?',
          options: ['وَرْدَةً حَمْرَاءَ', 'سَيَّارَةً كَبِيرَةً', 'بَيْتًا صَغِيرًا'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: رَسْمُ حَرْفِ الرَّاءِ وَاسْمِ العَائِلَةِ',
        titleFr: 'Écriture : Tracer la lettre Rā’ et inscrire son nom de famille',
        copySentenceAr: 'فِي مِحْفَظَتِي كِتَابٌ وَمِسْطَرَةٌ نَظِيفَةٌ.',
        copySentenceFr: 'Dans mon cartable se trouvent un livre et une règle propre.',
        letterPractice: ['رَ', 'رُ', 'رِ', 'رْ', 'رَا', 'رُو', 'رِي'],
        wordsToCopy: ['مِسْطَرَة', 'رَسْم', 'رَفِيق'],
        identityCardField: {
          fieldNameAr: 'اسْمُ العَائِلَةِ لِلتِّلْمِيذِ',
          fieldNameFr: 'Nom de famille de l’élève',
          placeholderAr: 'اُكْتُبِ اسْمَ عَائِلَتِكَ...',
          exampleValue: 'العَلَمِي',
        },
      },
    },

    // =================================== HESSA 3 ===================================
    {
      sessionNumber: 3,
      sessionTitleAr: 'الحِصَّةُ 3: زُمَلَائِي فِي الفَصْلِ وَالتَّعَاوُنُ (حَرْفُ البَاءِ)',
      sessionTitleFr: 'Séance 3 : Camarades de classe et coopération (Lettre Bā’ - ب)',
      targetLetter: {
        letter: 'ب',
        letterNameAr: 'حَرْفُ البَاءِ',
        letterNameFr: 'La lettre Bā’ (ب)',
        forms: ['بـ', 'ـبـ', 'ـب', 'ب'],
        sampleWords: [
          { word: 'بَابٌ', translit: 'Bāb', french: 'Porte', icon: '🚪' },
          { word: 'كِتَابٌ', translit: 'Kitāb', french: 'Livre', icon: '📖' },
          { word: 'بِنْتٌ', translit: 'Bint', french: 'Fille', icon: '👧' },
          { word: 'سَبُّورَةٌ', translit: 'Sabbūrah', french: 'Tableau', icon: '📋' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ الصَّدَاقَةِ وَالتَّعَاوُنِ فِي القِسْمِ',
        titleFr: 'Interaction Orale : Dialogue d’entraide entre camarades',
        objectiveFr: 'Proposer son aide, partager un livre (« كِتَاب ») et exprimer sa gratitude (« شُكْرًا لَك »).',
        dialogue: [
          {
            id: 'u1-d3-1',
            speaker: 'بِلَالُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Bilal',
            arabic: 'السَّلَامُ عَلَيْكُمْ يَا بَاسِمُ، هَلْ تَقْرَأُ مَعِي فِي هَذَا الكِتَابِ؟',
            translitFr: 'As-salāmu ‘alaykum yā Bāsim, hal taqra’u ma‘ī fī hādhā l-kitāb?',
            french: 'Bonjour Bassem, lis-tu avec moi dans ce livre ?',
            keywords: ['هَلْ تَقْرَأُ مَعِي', 'الكِتَاب'],
          },
          {
            id: 'u1-d3-2',
            speaker: 'بَاسِمُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Bassem',
            arabic: 'وَعَلَيْكُمُ السَّلَامُ يَا بِلَالُ، بِكُلِّ فَرَحٍ وَسُرُورٍ!',
            translitFr: 'Wa ‘alaykumu s-salāmu yā Bilāl, bi-kulli faraḥin wa surūr!',
            french: 'Bonjour Bilal, avec grand plaisir et joie !',
            keywords: ['بِكُلِّ فَرَحٍ وَسُرُور'],
          },
          {
            id: 'u1-d3-3',
            speaker: 'بِلَالُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Bilal',
            arabic: 'أَنَا أَقْرَأُ الكَلِمَةَ الأُولَى عَلَى السَّبُّورَةِ، وَأَنْتَ تَقْرَأُ الثَّانِيَةَ.',
            translitFr: 'Anā aqra’u l-kalimata l-ūlā ‘alā s-sabbūrah, wa anta taqra’u th-thāniyah.',
            french: 'Je lis le premier mot au tableau, et toi tu lis le second.',
            keywords: ['عَلَى السَّبُّورَة'],
          },
          {
            id: 'u1-d3-4',
            speaker: 'بَاسِمُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Bassem',
            arabic: 'التَّعَاوُنُ جَمِيلٌ جِدًّا بَيْنَ الأَصْدِقَاءِ فِي الفَصْلِ.',
            translitFr: 'At-ta‘āwunu jamīlun jiddan bayna l-aṣdiqā’i fī l-faṣl.',
            french: 'La coopération est magnifique entre amis dans la classe.',
            keywords: ['التَّعَاوُنُ جَمِيل'],
          },
          {
            id: 'u1-d3-5',
            speaker: 'بِلَالُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Bilal',
            arabic: 'شُكْرًا لَكَ يَا صَدِيقِي، أَنْتَ نِعْمَ الزَّمِيلُ المُجْتَهِدُ!',
            translitFr: 'Shukran laka yā ṣadīqī, anta ni‘ma z-zamīlu l-mujtahid!',
            french: 'Merci mon ami, tu es un excellent camarade appliqué !',
            keywords: ['شُكْرًا لَكَ', 'صَدِيقِي'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: هَلْ تَقْرَأُ مَعِي فِي هَذَا الكِتَابِ؟',
          'الجملة 2: بِكُلِّ فَرَحٍ وَسُرُورٍ يَا صَدِيقِي',
          'الجملة 3: نَقْرَأُ مَعًا عَلَى السَّبُّورَةِ',
          'الجملة 4: التَّعَاوُنُ جَمِيلٌ بَيْنَ الأَصْدِقَاءِ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ القِرَاءَةِ وَالكِتَابَةِ (3)',
        titleFr: 'Compréhension de l’oral : Consignes de lecture et de tableau',
        audioPromptAr: 'اسْتَمِعْ إِلَى تَعْلِيمَاتِ الأُسْتَاذِ فِي القِسْمِ وَطَبِّقْهَا:',
        instructions: [
          {
            id: 'u1-inst-7',
            arabic: 'اقْرَأْ',
            french: 'Lis',
            translitFr: 'Iqra’',
            icon: '📖',
            descriptionFr: 'Lire le mot ou la phrase à voix haute.',
            interactiveActionType: 'underline',
          },
          {
            id: 'u1-inst-8',
            arabic: 'اكْتُبْ',
            french: 'Écris',
            translitFr: 'Uktub',
            icon: '✍️',
            descriptionFr: 'Écrire sur son cahier ou au tableau.',
            interactiveActionType: 'write',
          },
          {
            id: 'u1-inst-9',
            arabic: 'تَعَاوَنْ مَعَ زَمِيلِكَ',
            french: 'Coopère avec ton camarade',
            translitFr: 'Ta‘āwan ma‘a zamīlik',
            icon: '🤝',
            descriptionFr: 'Partager l’activité d’apprentissage avec son voisin.',
            interactiveActionType: 'circle',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْأُسْتَاذِ يَقُولُ: «سَطِّرْ تَحْتَ حَرْفِ البَاءِ» فِي الكَلِمَةِ «بَابٌ».',
          questionFr: 'Écoutez la consigne : « Souligne la lettre Bā’ » dans « بَابٌ ».',
          targetTextAr: 'بَا بٌ',
          options: ['بَا', 'بٌ'],
          correctAnswer: 'بَا',
          actionInstruction: 'سَطِّرْ تَحْتَ حَرْفِ البَاءِ (Souligne la lettre Bā’)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: التَّعْبِيرُ عَنِ التَّعَاوُنِ مَعَ الزُّمَلَاءِ',
        titleFr: 'Parler en continu : Exprimer la coopération avec les camarades',
        promptAr: 'تَحَدَّثْ بِاسْتِرْسَالٍ عَنْ زُمَلَائِكَ فِي القِسْمِ:',
        fullSpeechAr: 'أَنَا أُحِبُّ زُمَلَائِي فِي الفَصْلِ، نَتَعَاوَنُ فِي القِرَاءَةِ، وَنَحْتَرِمُ كِتَابَنَا وَسَبُّورَةَ قِسْمِنَا، وَنَتَعَلَّمُ بِفَرَحٍ.',
        fullSpeechTranslitFr: 'Anā uḥibbu zumalā’ī fī l-faṣl, nata‘āwanu fī l-qirā’ah, wa naḥtarimu kitābanā wa sabbūrata qisminā, wa nata‘allamu bi-faraḥ.',
        fullSpeechFr: 'J’aime mes camarades de classe, nous coopérons pour la lecture, nous respectons nos livres et notre tableau, et nous apprenons avec joie.',
        keyPointsFr: [
          'Exprimer la camaraderie : « أُحِبُّ زُمَلَائِي فِي الفَصْلِ »',
          'Mentionner l’entraide mutuelle : « نَتَعَاوَنُ فِي القِرَاءَةِ »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ زُمَلَائِي فِي الفَصْلِ',
          lyricsAr: [
            'أَصْدِقَائِي.. يَا رِفَاقِي ... حُبُّكُمْ نَبْضُ فُؤَادِي',
            'فِي انْتِبَاهٍ وَاجْتِهَادِ ... نَبْتَنِي خَيْرَ البِلَادِ',
            'نَقْرَأُ الكُتُبَ انْتِظَامًا ... نَبْتَغِي دَوْمًا مَرَامَا!',
          ],
          lyricsFr: 'Chant de la fraternité et de la réussite partagée en classe.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الفَصْلِ وَحَرْفِ البَاءِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Bā’',
        readingPassageAr: 'فَتَحَ بِلَالٌ البَابَ. فِي القِسْمِ سَبُّورَةٌ بَيْضَاءُ وَكِتَابٌ كَبِيرٌ. يَقْرَأُ بَاسِمٌ مَعَ بِلَالٍ بِانْتِبَاهٍ.',
        readingPassageFr: 'Bilal a ouvert la porte. Dans la classe il y a un tableau blanc et un grand livre. Bassem lit avec Bilal attentivement.',
        syllablesFocus: ['بَـ', 'بُـ', 'بِـ', 'بْ', 'بَا', 'بُو', 'بِي'],
        wordsToRead: [
          { word: 'بَابٌ', translit: 'Bāb', french: 'Porte' },
          { word: 'كِتَابٌ', translit: 'Kitāb', french: 'Livre' },
          { word: 'سَبُّورَةٌ', translit: 'Sabbūrah', french: 'Tableau' },
          { word: 'بِنْتٌ', translit: 'Bint', french: 'Fille' },
        ],
        quiz: {
          questionAr: 'مَاذَا فَتَحَ بِلَالٌ فِي النَّصِّ؟',
          questionFr: 'Qu’a ouvert Bilal dans le texte ?',
          options: ['البَابَ', 'النَّافِذَةَ', 'المِحْفَظَةَ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: رَسْمُ حَرْفِ البَاءِ وَالمُسْتَوَى الدِّرَاسِيِّ',
        titleFr: 'Écriture : Tracer la lettre Bā’ et écrire le niveau scolaire',
        copySentenceAr: 'نَقْرَأُ فِي الكِتَابِ وَنَكْتُبُ عَلَى السَّبُّورَةِ.',
        copySentenceFr: 'Nous lisons dans le livre et écrivons au tableau.',
        letterPractice: ['بَ', 'بُ', 'بِ', 'بْ', 'بَا', 'بُو', 'بِي'],
        wordsToCopy: ['بَاب', 'كِتَاب', 'سَبُّورَة'],
        identityCardField: {
          fieldNameAr: 'المُسْتَوَى الدِّرَاسِيُّ',
          fieldNameFr: 'Niveau scolaire',
          placeholderAr: 'اُكْتُبْ مُسْتَوَاكَ الدِّرَاسِيَّ...',
          exampleValue: 'السَّنَةُ الأُولَى ابْتِدَائِي (A1)',
        },
      },
    },

    // =================================== HESSA 4 ===================================
    {
      sessionNumber: 4,
      sessionTitleAr: 'الحِصَّةُ 4: وَقْتُ الاسْتِرَاحَةِ وَالأَلْعَابُ المَدْرَسِيَّةُ (حَرْفُ التَّاءِ)',
      sessionTitleFr: 'Séance 4 : Récréation et jeux collectifs (Lettre Tā’ - ت)',
      targetLetter: {
        letter: 'ت',
        letterNameAr: 'حَرْفُ التَّاءِ',
        letterNameFr: 'La lettre Tā’ (ت)',
        forms: ['تـ', 'ـتـ', 'ـت', 'ت'],
        sampleWords: [
          { word: 'تِلْمِيذٌ', translit: 'Tilmīdh', french: 'Élève (m.)', icon: '👦' },
          { word: 'تِلْمِيذَةٌ', translit: 'Tilmīdhah', french: 'Élève (f.)', icon: '👧' },
          { word: 'تَمْرِينٌ', translit: 'Tamrīn', french: 'Exercice', icon: '📝' },
          { word: 'وَقْتٌ', translit: 'Waqt', french: 'Temps / Moment', icon: '⏰' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ الاسْتِرَاحَةِ وَالنِّظَامِ فِي السَّاحَةِ',
        titleFr: 'Interaction Orale : Dialogue de récréation et respect des règles',
        objectiveFr: 'Échanger lors de la sonnerie (« دَقَّ الجَرَسُ »), sortir calmement et jouer en groupe.',
        dialogue: [
          {
            id: 'u1-d4-1',
            speaker: 'تَامِرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Tamer',
            arabic: 'دَقَّ جَرَسُ الاسْتِرَاحَةِ، تَعَالَيْ نَلْعَبْ فِي السَّاحَةِ يَا تَسْنِيمُ!',
            translitFr: 'Daqqa jarasu l-istirāḥah, ta‘ālay nal‘ab fī s-sāḥati yā Tasnīm!',
            french: 'La cloche de la récréation a sonné, viens jouer dans la cour Tasnim !',
            keywords: ['دَقَّ جَرَسُ الاسْتِرَاحَة', 'نَلْعَبْ فِي السَّاحَة'],
          },
          {
            id: 'u1-d4-2',
            speaker: 'تَسْنِيمُ',
            speakerAvatar: '👧',
            speakerRoleFr: 'Tasnim',
            arabic: 'مَرْحَبًا يَا تَامِرُ! لِنُرَتِّبْ دَفَاتِرَنَا أَوَّلًا ثُمَّ نَخْرُجْ بِنِظَامٍ.',
            translitFr: 'Marḥaban yā Tāmir! Li-nurattib dafātiranā awwalan thumma nakhruj bi-niẓām.',
            french: 'Bonjour Tamer ! Rangeons d’abord nos cahiers puis sortons en ordre.',
            keywords: ['نُرَتِّبْ دَفَاتِرَنَا', 'بِنِظَام'],
          },
          {
            id: 'u1-d4-3',
            speaker: 'تَامِرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Tamer',
            arabic: 'فِكْرَةٌ مُمْتَازَةٌ، النِّظَامُ وَاجِبٌ دَاخِلَ المَدْرَسَةِ وَخَارِجَهَا.',
            translitFr: 'Fikratun mumtāzah, an-niẓāmu wājibun dākhila l-madrasati wa khārijahā.',
            french: 'Excellente idée, la discipline est un devoir à l’école et dehors.',
            keywords: ['النِّظَامُ وَاجِب'],
          },
          {
            id: 'u1-d4-4',
            speaker: 'تَسْنِيمُ',
            speakerAvatar: '👧',
            speakerRoleFr: 'Tasnim',
            arabic: 'هَيَّا نَلْعَبْ لُعْبَةَ الحُرُوفِ مَعَ التَّلَامِيذِ وَالتِّلْمِيذَاتِ!',
            translitFr: 'Hayyā nal‘ab lu‘bata l-ḥurūf ma‘a t-talāmīdhi wa t-tilmīdhāt!',
            french: 'Allons jouer au jeu des lettres avec tous les élèves !',
            keywords: ['لُعْبَةَ الحُرُوف', 'التَّلَامِيذ'],
          },
          {
            id: 'u1-d4-5',
            speaker: 'تَامِرُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Tamer',
            arabic: 'وَقْتُ الاسْتِرَاحَةِ جَمِيلٌ يَمْلَأُ قُلُوبَنَا فَرَحًا وَنَشَاطًا.',
            translitFr: 'Waqtu l-istirāḥati jamīlun yamla’u qulūbanā faraḥan wa nashāṭan.',
            french: 'Le temps de la récréation est magnifique, il remplit nos cœurs de joie et d’énergie.',
            keywords: ['وَقْتُ الاسْتِرَاحَة'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: دَقَّ جَرَسُ الاسْتِرَاحَةِ',
          'الجملة 2: نَخْرُجُ إِلَى السَّاحَةِ بِنِظَامٍ',
          'الجملة 3: نَلْعَبُ مَعَ التَّلَامِيذِ وَالتِّلْمِيذَاتِ',
          'الجملة 4: وَقْتُ الاسْتِرَاحَةِ جَمِيلٌ وَمُمْتِعٌ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ السَّاحَةِ وَالاصْطِفَافِ (4)',
        titleFr: 'Compréhension de l’oral : Consignes de la cour et du rang',
        audioPromptAr: 'اسْتَمِعْ لِتَعْلِيمَاتِ الأُسْتَاذِ فِي سَاحَةِ المَدْرَسَةِ وَاخْتَرْ السُّلُوكَ المَطْلُوبَ:',
        instructions: [
          {
            id: 'u1-inst-10',
            arabic: 'اصْطَفَّ بِنِظَامٍ',
            french: 'Mets-toi en rang',
            translitFr: 'Iṣṭaffa bi-niẓām',
            icon: '🚶‍♂️',
            descriptionFr: 'Se placer dans le rang avec calme.',
            interactiveActionType: 'underline',
          },
          {
            id: 'u1-inst-11',
            arabic: 'انْتَبِهْ لِلْجَرَسِ',
            french: 'Fais attention à la sonnerie',
            translitFr: 'Intabih li-l-jaras',
            icon: '🔔',
            descriptionFr: 'S’arrêter de jouer dès que retentit la cloche.',
            interactiveActionType: 'circle',
          },
          {
            id: 'u1-inst-12',
            arabic: 'حَافِظْ عَلَى نَظَافَةِ السَّاحَةِ',
            french: 'Garde la cour propre',
            translitFr: 'Ḥāfiẓ ‘alā naẓāfati s-sāḥah',
            icon: '🌿',
            descriptionFr: 'Jeter les papiers dans la corbeille de la cour.',
            interactiveActionType: 'cross',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْأُسْتَاذِ يَقُولُ: «شَطِّبْ عَلَى الحَرْفِ الزَّائِدِ» وَاخْتَرْ حَرْفَ التَّاءِ فِي «تِلْمِيذٌ».',
          questionFr: 'Repérez la lettre Tā’ dans le mot « تِلْمِيذٌ ».',
          targetTextAr: 'تِـ لْـ مِـ يـ ذٌ',
          options: ['تِـ', 'لْـ', 'مِـ', 'ذٌ'],
          correctAnswer: 'تِـ',
          actionInstruction: 'اخْتَرْ حَرْفَ التَّاءِ (Choisis la lettre Tā’)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: التَّحَدُّثُ عَنْ وَقْتِ الاسْتِرَاحَةِ وَالسَّاحَةِ',
        titleFr: 'Parler en continu : Décrire la récréation avec aisance',
        promptAr: 'تَحَدَّثْ بِاسْتِرْسَالٍ عَنْ أَنْشِطَتِكَ فِي سَاحَةِ المَدْرَسَةِ:',
        fullSpeechAr: 'فِي وَقْتِ الاسْتِرَاحَةِ، أَلْعَبُ مَعَ التَّلَامِيذِ فِي سَاحَةِ المَدْرَسَةِ فَرِحًا، نَصْطَفُّ بِنِظَامٍ حِينَ يَدُقُّ الجَرَسُ، وَنَحْنُ تَلَامِيذُ نَشِيطُونَ.',
        fullSpeechTranslitFr: 'Fī waqti l-istirāḥah, al‘abu ma‘a t-talāmīdhi fī sāḥati l-madrasati faraḥan, naṣṭaffu bi-niẓām ḥīna yaduqqu l-jaras, wa naḥnu talāmīdhun nashīṭūn.',
        fullSpeechFr: 'À la récréation, je joue joyeusement avec les élèves dans la cour, nous nous mettons en rang quand la cloche sonne, et nous sommes des élèves actifs.',
        keyPointsFr: [
          'Décrire le jeu dans la cour : « أَلْعَبُ فِي سَاحَةِ المَدْرَسَةِ »',
          'Souligner le respect du rang : « نَصْطَفُّ بِنِظَامٍ »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ وَقْتِ الاسْتِرَاحَةِ',
          lyricsAr: [
            'دَقَّ الجَرَسُ.. حَانَ الوَقْتُ ... هَيَّا نَفْرَحْ.. هَيَّا نَمْرَحْ',
            'فِي السَّاحَةِ نَجْرِي أَحْبَابَا ... نَمْلَأُ أَرْجَاءً وَرِحَابَا',
            'ثُمَّ نَعُودُ إِلَى الفَصْلِ ... كَيْ نَنْهَلَ مِنْ نُورِ العَقْلِ!',
          ],
          lyricsFr: 'Chant entraînant célébrant la récréation et le retour appliqué en classe.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ الاسْتِرَاحَةِ وَحَرْفِ التَّاءِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Tā’',
        readingPassageAr: 'دَقَّ جَرَسُ المَدْرَسَةِ. خَرَجَ التَّلَامِيذُ إِلَى السَّاحَةِ. تَلْعَبُ تَسْنِيمُ مَعَ التِّلْمِيذَاتِ بِفَرَحٍ. حَانَ وَقْتُ النَّشَاطِ.',
        readingPassageFr: 'La cloche de l’école a sonné. Les élèves sont sortis dans la cour. Tasnim joue joyeusement avec les élèves filles. C’est le moment de l’activité.',
        syllablesFocus: ['تَـ', 'تُـ', 'تِـ', 'تْ', 'تَا', 'تُو', 'تِي'],
        wordsToRead: [
          { word: 'تِلْمِيذٌ', translit: 'Tilmīdh', french: 'Élève' },
          { word: 'تِلْمِيذَةٌ', translit: 'Tilmīdhah', french: 'Élève (f.)' },
          { word: 'وَقْتٌ', translit: 'Waqt', french: 'Temps' },
          { word: 'تَمْرِينٌ', translit: 'Tamrīn', french: 'Exercice' },
        ],
        quiz: {
          questionAr: 'أَيْنَ خَرَجَ التَّلَامِيذُ حِينَ دَقَّ الجَرَسُ؟',
          questionFr: 'Où sont sortis les élèves quand la cloche a sonné ?',
          options: ['إِلَى السَّاحَةِ', 'إِلَى الشَّارِعِ', 'إِلَى المَنْزِلِ'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: رَسْمُ حَرْفِ التَّاءِ وَاسْمِ المَدْرَسَةِ',
        titleFr: 'Écriture : Tracer la lettre Tā’ et inscrire le nom de l’école',
        copySentenceAr: 'خَرَجَ التِّلْمِيذُ النَّشِيطُ إِلَى السَّاحَةِ بِنِظَامٍ.',
        copySentenceFr: 'L’élève dynamique est sorti dans la cour en bon ordre.',
        letterPractice: ['تَ', 'تُ', 'تِ', 'تْ', 'تَا', 'تُو', 'تِي'],
        wordsToCopy: ['تِلْمِيذ', 'تِلْمِيذَة', 'وَقْت'],
        identityCardField: {
          fieldNameAr: 'اسْمُ المَدْرَسَةِ',
          fieldNameFr: 'Nom de l’établissement',
          placeholderAr: 'اُكْتُبِ اسْمَ مَدْرَسَتِكَ...',
          exampleValue: 'مَدْرَسَةُ الأَمَلِ الابْتِدَائِيَّةُ',
        },
      },
    },

    // =================================== HESSA 5 ===================================
    {
      sessionNumber: 5,
      sessionTitleAr: 'الحِصَّةُ 5: مِيثَاقُ القِسْمِ وَالسُّلُوكُ الصَّالِحُ (حَرْفُ الجِيمِ)',
      sessionTitleFr: 'Séance 5 : Règles de vie de classe & Bonne conduite (Lettre Jīm - ج)',
      targetLetter: {
        letter: 'ج',
        letterNameAr: 'حَرْفُ الجِيمِ',
        letterNameFr: 'La lettre Jīm (ج)',
        forms: ['جـ', 'ـجـ', 'ـج', 'ج'],
        sampleWords: [
          { word: 'جَرَسٌ', translit: 'Jaras', french: 'Cloche', icon: '🔔' },
          { word: 'جَمِيلٌ', translit: 'Jamīl', french: 'Beau / Belle', icon: '✨' },
          { word: 'جَدِيدٌ', translit: 'Jadīd', french: 'Nouveau', icon: '🌟' },
          { word: 'جُلُوسٌ', translit: 'Julūs', french: 'Assis', icon: '🪑' },
        ],
      },
      interactionOrale: {
        titleAr: 'التَّفَاعُلُ الشَّفَهِيُّ: حِوَارُ قَوَاعِدِ القِسْمِ وَمِيثَاقِ النَّجَاحِ',
        titleFr: 'Interaction Orale : Dialogue sur la charte de classe',
        objectiveFr: 'Exprimer les règles de politesse : lever le doigt pour parler (« أَرْفَعُ إِصْبَعِي ») et garder sa classe propre.',
        dialogue: [
          {
            id: 'u1-d5-1',
            speaker: 'الأُسْتَاذُ جَمَالُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant Jamal',
            arabic: 'مَاذَا نَفْعَلُ إِذَا أَرَدْنَا الكَلَامَ فِي القِسْمِ يَا جِهَادُ؟',
            translitFr: 'Mādhā naf‘alu idhā aradnā l-kalāma fī l-qismi yā Jihād?',
            french: 'Que faisons-nous si nous voulons parler en classe Jihad ?',
            keywords: ['إِذَا أَرَدْنَا الكَلَام'],
          },
          {
            id: 'u1-d5-2',
            speaker: 'جِهَادُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Jihad',
            arabic: 'نَرْفَعُ الإِصْبَعَ لِلِاسْتِئْذَانِ بِأَدَبٍ قَبْلَ الكَلَامِ يَا أُسْتَاذِي.',
            translitFr: 'Narfa‘u l-iṣba‘a li-l-isti’dhāni bi-adabin qabla l-kalāmi yā ustādhī.',
            french: 'Nous levons poliment le doigt pour demander la parole maître.',
            keywords: ['نَرْفَعُ الإِصْبَع', 'لِلِاسْتِئْذَان'],
          },
          {
            id: 'u1-d5-3',
            speaker: 'الأُسْتَاذُ جَمَالُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant Jamal',
            arabic: 'وَكَيْفَ نُحَافِظُ عَلَى نَظَافَةِ قِسْمِنَا الجَمِيلِ؟',
            translitFr: 'Wa kayfa nuḥāfiẓu ‘alā naẓāfati qisminā l-jamīl?',
            french: 'Et comment préservons-nous la propreté de notre belle classe ?',
            keywords: ['نَظَافَةِ قِسْمِنَا'],
          },
          {
            id: 'u1-d5-4',
            speaker: 'جِهَادُ',
            speakerAvatar: '👦',
            speakerRoleFr: 'Jihad',
            arabic: 'نَضَعُ الأَوْرَاقَ فِي السَّلَّةِ، وَنَتْرُكُ المَقَاعِدَ مُرَتَّبَةً دَائِمًا.',
            translitFr: 'Naḍa‘u l-awrāqa fī s-sallati, wa natruku l-maqā‘ida murattabatan dā’iman.',
            french: 'Nous mettons les papiers à la corbeille, et nous laissons toujours les tables rangées.',
            keywords: ['فِي السَّلَّة', 'مُرَتَّبَة'],
          },
          {
            id: 'u1-d5-5',
            speaker: 'الأُسْتَاذُ جَمَالُ',
            speakerAvatar: '👨‍🏫',
            speakerRoleFr: 'L’enseignant Jamal',
            arabic: 'بَارَكَ اللهُ فِيكُمْ، هَذَا مِيثَاقُ النَّجَاحِ فِي مَدْرَسَتِنَا!',
            translitFr: 'Bāraka Llāhu fīkum, hādhā mīthāqu n-najāḥi fī madrasatinā!',
            french: 'Bravo à vous, voilà la charte du succès dans notre école !',
            keywords: ['مِيثَاقُ النَّجَاح'],
          },
        ],
        memorizationSteps: [
          'الجملة 1: نَرْفَعُ الإِصْبَعَ لِلِاسْتِئْذَانِ',
          'الجملة 2: نَسْتَمِعُ إِلَى الأُسْتَاذِ بِانْتِبَاهٍ',
          'الجملة 3: نُحَافِظُ عَلَى نَظَافَةِ القِسْمِ',
          'الجملة 4: مِيثَاقُ القِسْمِ طَرِيقُ النَّجَاحِ',
        ],
      },
      oralComprehension: {
        titleAr: 'فَهْمُ المَسْمُوعِ: تَعْلِيمَاتُ السُّلُوكِ وَمِيثَاقِ الفَصْلِ (5)',
        titleFr: 'Compréhension de l’oral : Consignes de vie de classe',
        audioPromptAr: 'اسْتَمِعْ لِتَعْلِيمَاتِ مِيثَاقِ القِسْمِ وَاخْتَرْ التَّصَرُّفَ الصَّائِبَ:',
        instructions: [
          {
            id: 'u1-inst-13',
            arabic: 'ارْفَعْ إِصْبَعَكَ',
            french: 'Lève le doigt',
            translitFr: 'Irfa‘ iṣba‘ak',
            icon: '☝️',
            descriptionFr: 'Lever l’index pour demander poliment la parole.',
            interactiveActionType: 'write',
          },
          {
            id: 'u1-inst-14',
            arabic: 'اسْتَأْذِنْ قَبْلَ الكَلَامِ',
            french: 'Demande la permission',
            translitFr: 'Ista’dhin qabla l-kalām',
            icon: '🙋',
            descriptionFr: 'Attendre l’accord de l’enseignant avant de s’exprimer.',
            interactiveActionType: 'circle',
          },
          {
            id: 'u1-inst-15',
            arabic: 'اجْلِسْ فِي مَكَانِكَ بِأَدَبٍ',
            french: 'Assieds-toi correctement',
            translitFr: 'Ijlis fī makānika bi-adab',
            icon: '🪑',
            descriptionFr: 'Rester assis sur sa chaise sans déranger les voisins.',
            interactiveActionType: 'underline',
          },
        ],
        practiceTask: {
          questionAr: 'اسْتَمِعْ لِلْأُسْتَاذِ يَقُولُ: «أُحِيطُ حَرْفَ الجِيمِ» فِي الكَلِمَةِ «جَمِيلٌ».',
          questionFr: 'Écoutez la consigne et entourez la lettre Jīm dans le mot « جَمِيلٌ ».',
          targetTextAr: 'جَـ مِيـ لٌ',
          options: ['جَـ', 'مِيـ', 'لٌ'],
          correctAnswer: 'جَـ',
          actionInstruction: 'أُحِيطُ حَرْفَ الجِيمِ (Entoure la lettre Jīm)',
        },
      },
      continuousSpeaking: {
        titleAr: 'الاسْتِرْسَالُ فِي الكَلَامِ: الإِعْلَانُ عَنِ الالْتِزَامِ بِمِيثَاقِ القِسْمِ',
        titleFr: 'Parler en continu : Déclaration d’engagement à la charte scolaire',
        promptAr: 'أَلْقِ جُمْلَتَكَ عَنْ مِيثَاقِ القِسْمِ أَمَامَ الأُسْتَاذِ وَالزُّمَلَاءِ:',
        fullSpeechAr: 'أَنَا تِلْمِيذٌ مُهَذَّبٌ فِي مَدْرَسَتِي، أَرْفَعُ إِصْبَعِي لِلِاسْتِئْذَانِ، أَلْتَزِمُ بِمِيثَاقِ القِسْمِ، وَأَحْتَرِمُ أُسْتَاذِي وَأَصْدِقَائِي.',
        fullSpeechTranslitFr: 'Anā tilmīdhun muhadhdhabun fī madrasatī, arfa‘u iṣba‘ī li-l-isti’dhān, altazimu bi-mīthāqi l-qism, wa aḥtarimu ustādhī wa aṣdiqā’ī.',
        fullSpeechFr: 'Je suis un élève poli dans mon école, je lève le doigt pour demander la parole, je respecte la charte de la classe, et j’ai du respect pour mon professeur et mes amis.',
        keyPointsFr: [
          'Affirmer sa politesse : « أَنَا تِلْمِيذٌ مُهَذَّبٌ »',
          'Rappeler la règle d’or : « أَرْفَعُ إِصْبَعِي لِلِاسْتِئْذَانِ »',
        ],
        alphabetSongExcerpt: {
          titleAr: 'نَشِيدُ مِيثَاقِ القِسْمِ وَالنِّظَامِ',
          lyricsAr: [
            'قِسْمِي جَمِيلٌ.. صَفِّي نَظِيفٌ ... فِي جَوِّ حُبٍّ نَحْيَا أَلِيفَا',
            'بِالأَدَبِ نَعْلُو.. نَسْمُو جَمِيعًا ... نَرْعَى حُقُوقًا.. نَغْدُو رَبِيعَا',
            'مِيثَاقُ قِسْمِي عَهْدُ وَفَاءِ ... نَمْضِي إِلَى الخَيْرِ وَالعَلَاءِ!',
          ],
          lyricsFr: 'Chant solennel d’engagement et de respect de la charte de classe.',
        },
      },
      readingComprehension: {
        titleAr: 'فَهْمُ المَكْتُوبِ: قِرَاءَةُ جُمَلِ المِيثَاقِ وَحَرْفِ الجِيمِ',
        titleFr: 'Compréhension de l’écrit : Lecture et repérage de la lettre Jīm',
        readingPassageAr: 'دَقَّ جَرَسُ القِسْمِ. جَلَسَ التَّلَامِيذُ فِي المَقَاعِدِ بِأَدَبٍ. قِسْمُنَا نَظِيفٌ وَجَمِيلٌ جِدًّا. عُمَرُ تِلْمِيذٌ جَدِيدٌ نَشِيطٌ.',
        readingPassageFr: 'La cloche de la classe a sonné. Les élèves se sont assis poliment à leurs places. Notre classe est très propre et belle. Omar est un nouvel élève dynamique.',
        syllablesFocus: ['جَـ', 'جُـ', 'جِـ', 'جْ', 'جَا', 'جُو', 'جِي'],
        wordsToRead: [
          { word: 'جَرَسٌ', translit: 'Jaras', french: 'Cloche' },
          { word: 'جَمِيلٌ', translit: 'Jamīl', french: 'Beau' },
          { word: 'جَدِيدٌ', translit: 'Jadīd', french: 'Nouveau' },
          { word: 'جُلُوسٌ', translit: 'Julūs', french: 'Assis' },
        ],
        quiz: {
          questionAr: 'كَيْفَ هُوَ قِسْمُنَا فِي النَّصِّ؟',
          questionFr: 'Comment est notre classe dans le texte ?',
          options: ['نَظِيفٌ وَجَمِيلٌ', 'مُظْلِمٌ وَصَغِيرٌ', 'قَدِيمٌ جِدًّا'],
          correctIndex: 0,
        },
      },
      writing: {
        titleAr: 'الكِتَابَةُ وَالخَطُّ: رَسْمُ حَرْفِ الجِيمِ وَرَقْمِ التِّسْجِيلِ المَدْرَسِيِّ',
        titleFr: 'Écriture : Tracer la lettre Jīm et finaliser la carte scolaire',
        copySentenceAr: 'نَحْتَرِمُ مِيثَاقَ القِسْمِ وَنَرْفَعُ الإِصْبَعَ بِأَدَبٍ.',
        copySentenceFr: 'Nous respectons la charte de classe et levons poliment le doigt.',
        letterPractice: ['جَ', 'جُ', 'جِ', 'جْ', 'جَا', 'جُو', 'جِي'],
        wordsToCopy: ['جَرَس', 'جَمِيل', 'جَدِيد'],
        identityCardField: {
          fieldNameAr: 'رَقْمُ التِّسْجِيلِ المَدْرَسِيِّ',
          fieldNameFr: 'Numéro d’inscription scolaire',
          placeholderAr: 'اُكْتُبْ رَقْمَكَ المَدْرَسِيَّ...',
          exampleValue: 'A1-2024-042',
        },
      },
    },
  ],

  // =================================== CONSOLIDATION ===================================
  consolidationSession: {
    sessionNumber: 6,
    titleAr: 'الحِصَّةُ 6: أَنْشِطَةُ تَقْوِيمِ وَدَعْمِ تَعَلُّمَاتِ المَجَالِ الأَوَّلِ (الحَيَاةُ المَدْرَسِيَّةُ)',
    titleFr: 'Séance 6 : Évaluation diagnostique et consolidation du Domaine 1 (La Vie Scolaire)',
    descriptionFr: 'Bilan d’étape officiel évaluant les 5 acquis majeurs : Saluer et se présenter à l’école, nommer les fournitures, respecter les consignes de classe, lire les 5 lettres (د، ر، ب، ت، ج) et finaliser la carte d’élève.',
    evaluationTasks: [
      {
        id: 'u1-eval-1',
        type: 'dialogue_match',
        questionAr: 'صِلْ كُلَّ سُؤَالٍ أَوْ عِبَارَةٍ مَدْرَسِيَّةٍ بِالجَوَابِ المُنَاسِبِ لَهَا:',
        questionFr: 'Reliez chaque question scolaire à sa réponse appropriée :',
        items: [
          { q: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ', a: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ' },
          { q: 'صَبَاحُ الخَيْرِ يَا أُسْتَاذِي', a: 'صَبَاحُ النُّورِ يَا تِلْمِيذِي العَزِيزَ' },
          { q: 'مَا اسْمُكَ أَيُّهَا البَطَلُ؟', a: 'أَنَا اسْمِي عُمَرُ، تِلْمِيذٌ جَدِيدٌ' },
          { q: 'مَاذَا فِي مِحْفَظَتِكَ؟', a: 'فِي مِحْفَظَتِي كِتَابٌ وَدَفْتَرٌ وَمِسْطَرَةٌ' },
          { q: 'مَاذَا نَفْعَلُ قَبْلَ الكَلَامِ فِي القِسْمِ؟', a: 'نَرْفَعُ الإِصْبَعَ لِلِاسْتِئْذَانِ بِأَدَبٍ' },
        ],
      },
      {
        id: 'u1-eval-2',
        type: 'instruction_action',
        questionAr: 'اسْتَمِعْ إِلَى تَعْلِيمَةِ القِسْمِ وَاخْتَرْ التَّصَرُّفَ المَطْلُوبَ:',
        questionFr: 'Écoutez la consigne scolaire et cochez l’action requise :',
        items: [
          { instruction: 'ارْفَعْ إِصْبَعَكَ لِلِاسْتِئْذَانِ', french: 'Lève le doigt pour demander la parole', symbol: '☝️' },
          { instruction: 'افْتَحِ المِحْفَظَةَ وَخُذِ القَلَمَ', french: 'Ouvre le cartable et prends le stylo', symbol: '🎒' },
          { instruction: 'اقْرَأْ الكَلِمَةَ عَلَى السَّبُّورَةِ', french: 'Lis le mot écrit au tableau', symbol: '📖' },
          { instruction: 'اصْطَفَّ بِنِظَامٍ فِي السَّاحَةِ', french: 'Mets-toi en rang dans la cour', symbol: '🚶' },
          { instruction: 'أُحِيطُ الحَرْفَ المَطْلُوبَ', french: 'J’entoure la lettre demandée', symbol: '⭕' },
        ],
      },
      {
        id: 'u1-eval-3',
        type: 'continuous_presentation',
        questionAr: 'قُمِ الآنَ بِإِلْقَاءِ عَرْضِ التَّعْرِيفِ بِالذَّاتِ المَدْرَسِيِّ بِاسْتِرْسَالٍ كَامِلٍ:',
        questionFr: 'Prononcez votre présentation continue de l’élève :',
        items: [
          'السَّلَامُ عَلَيْكُمْ وَصَبَاحُ الخَيْرِ',
          'أَنَا اسْمِي [اسْمُكَ]، تِلْمِيذٌ فِي السَّنَةِ الأُولَى',
          'أَدْرُسُ فِي [اسْمُ مَدْرَسَتِكَ] الجَمِيلَةِ',
          'فِي مِحْفَظَتِي دَفْتَرٌ وَكِتَابٌ وَمِسْطَرَةٌ',
          'أَلْتَزِمُ بِمِيثَاقِ قِسْمِي وَأَحْتَرِمُ أُسْتَاذِي وَزُمَلَائِي',
        ],
      },
    ],
  },
};

export const UNIT_2_FAMILY_COMMUNITY: UnitCurriculum = {
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

// Backward compatibility alias:
export const UNIT_1_FAMILY_COMMUNITY: UnitCurriculum = UNIT_2_FAMILY_COMMUNITY;

// Re-export Unit 3 & Unit 4
import { UNIT_3_HEALTH_HYGIENE, UNIT_4_VILLAGE_CITY } from './units3and4Data';
export { UNIT_3_HEALTH_HYGIENE, UNIT_4_VILLAGE_CITY };

// Re-export Unit 5 & Unit 6 (Completing the 6 official curriculum units)
import { UNIT_5_WATER_LIFE, UNIT_6_GAMES_TRAVEL } from './units5and6Data';
export { UNIT_5_WATER_LIFE, UNIT_6_GAMES_TRAVEL };

// All 6 Official Unit Curriculums for Level A1 (المنهاج السنوي الكامل - 6 وحدات):
export const ALL_UNIT_CURRICULUMS: UnitCurriculum[] = [
  UNIT_1_SCHOOL_LIFE,
  UNIT_2_FAMILY_COMMUNITY,
  UNIT_3_HEALTH_HYGIENE,
  UNIT_4_VILLAGE_CITY,
  UNIT_5_WATER_LIFE,
  UNIT_6_GAMES_TRAVEL,
];

