import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// 1. AI Interactive Arabic Tutor & Roleplay Endpoint
app.post('/api/tutor-chat', async (req: Request, res: Response) => {
  const { message, level = 'A1', topic = 'general', userLanguage = 'fr', history = [] } = req.body;

  const ai = getAI();
  if (!ai) {
    // Elegant pedagogical fallback when API key is configuring
    const fallbacks: Record<string, string> = {
      A1: `مَرْحَبًا بِكَ! (Marhaban bika! - Bienvenue !)
أَنَا أُسْتَاذُكَ فَصِيح. أَنَا هُنَا لِمُسَاعَدَتِكَ فِي تَعَلُّمِ العَرَبِيَّةِ خُطْوَةً بِخُطْوَة.
👉 Traduction : Bienvenue ! Je suis votre tuteur Faseeh. Je suis là pour vous aider à apprendre l'arabe pas à pas !
💡 Essayez de dire : "كَيْفَ حَالُكَ؟" (Kayfa haluka? - Comment allez-vous ?)`,
      A2: `أَهْلًا وَسَهْلًا! أَنَا سَعِيدٌ بِلِقَائِكَ.
هَلْ تُرِيدُ أَنْ نَتَدَرَّبَ عَلَى طَلَبِ الطَّعَامِ فِي المَطْعَمِ أَمِ التَّسَوُّقِ فِي السُّوقِ؟
👉 Traduction : Bienvenue ! Ravi de vous rencontrer. Voulez-vous vous entraîner à commander au restaurant ou à faire des achats au souk traditionnel ?`,
      B1: `مَسَاءُ الخَيْرِ يَا صَدِيقِي. فِي مُسْتَوَى B1، سَنَتَحَدَّثُ عَنْ خُطَطِ العُطْلَةِ، وَتَجَارِبِ السَّفَرِ، وَالعَادَاتِ التَّقْلِيدِيَّةِ. مَا هُوَ مَوْضُوعُكَ المُفَضَّلُ اليَوْم؟`,
      B2: `أَهْلًا بِكَ. فِي هَذَا المُسْتَوَى المُمَيَّزِ نُنَاقِشُ مَقَالَاتٍ ثَقَافِيَّةً وَنَقَارِنُ بَيْنَ اللَّهَجَاتِ العَرَبِيَّةِ وَالفُصْحَى. هَلْ جَرَّبْتَ سَمَاعَ أَيِّ لَهْجَةٍ عَرَبِيَّةٍ مِنْ قَبْل؟`,
      C1: `أَهْلًا بِرَائِدِ الفَصَاحَةِ! فِي المُسْتَوَى الأَكَادِيمِيِّ C1 نُحَلِّلُ النُّصُوصَ الأَدَبِيَّةَ وَنَسْتَعْرِضُ أَسَالِيبَ البَلَاغَةِ وَالخِطَابَة. مَا هُوَ النَّصُّ الَّذِي تَرْغَبُ فِي سَبْرِ أَغْوَارِهِ؟`,
      C2: `طَابَ مَقَامُكَ فِي رِحَابِ لُغَةِ الضَّاد! هُنَا فِي ذُرْوَةِ البَلَاغَةِ وَالبَيَان، نَخُوضُ فِي أَعْمَاقِ الشِّعْرِ الجَاهِلِيِّ وَالحَدِيث، وَفُنُونِ الإِعْرَابِ وَالتَّرَاكِيبِ النَّادِرَة.`,
    };

    return res.json({
      reply: fallbacks[level] || fallbacks.A1,
      pronunciationTips: 'Pratiquez avec les voyelles courtes (Fatha, Kasra, Damma) pour une prononciation fluide et juste.',
      vocabularyUsed: [
        { arabic: 'مَرْحَبًا', transliteration: 'Marhaban', meaning: 'Bonjour / Bienvenue' },
        { arabic: 'أَهْلًا وَسَهْلًا', transliteration: 'Ahlan wa Sahlan', meaning: 'Bienvenue' },
        { arabic: 'كَيْفَ حَالُك؟', transliteration: 'Kayfa haluk?', meaning: 'Comment vas-tu / allez-vous ?' }
      ]
    });
  }

  try {
    const systemPrompt = `You are "فصيح (Faseeh)", a warm, encouraging and pedagogical Arabic tutor designed specifically for French-speaking learners (apprenants francophones) learning Modern Standard Arabic (Fusha) from CEFR level A1 to C2.
Current Target Learner Level: ${level} (CEFR).
Current Context / Topic: ${topic}.
Learner's native explanation language: ${userLanguage === 'en' ? 'English' : userLanguage === 'ar' ? 'Arabic' : 'French (Français)'}.

Pedagogical Guidelines:
1. Always write Arabic text with FULL Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Shaddah).
2. For levels A1 and A2, always provide French-friendly transliteration and clear translations in French (unless user specifically chooses another language).
3. For B1-B2, combine Arabic immersion with concise grammatical and cultural explanations in French.
4. For C1-C2, use rich classical Arabic with stylistic nuances, rhetoric (Balagha), and syntactic analysis (I'rab).
5. If the user makes a mistake, encourage them and provide a gentle correction in French.
6. Provide your final response in valid JSON matching this schema:
{
  "reply": "Your main conversational reply with full vocalization/tashkeel, transliteration (if A1-B1) and translation in French",
  "feedback": "Friendly correction or encouragement in French regarding learner's Arabic, if applicable",
  "vocabulary": [
    {"arabic": "الكلمة", "transliteration": "alkalima", "meaning": "Définition en français"}
  ],
  "suggestedReplies": ["Next phrase 1 in Arabic with tashkeel", "Next phrase 2 in Arabic with tashkeel"]
}`;

    const promptText = `Student's message: "${message}". Context: User is practicing Arabic at level ${level}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/tutor-chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to process AI tutor request' });
  }
});

// 2. AI Sentence Analyzer & Grammar / Tashkeel Helper
app.post('/api/analyze-arabic', async (req: Request, res: Response) => {
  const { sentence, targetLevel = 'A1', userLanguage = 'fr' } = req.body;

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({ error: 'Sentence is required' });
  }

  const ai = getAI();
  if (!ai) {
    return res.json({
      original: sentence,
      tashkeel: sentence,
      transliteration: 'Transcription phonétique',
      translation: 'Traduction française de la phrase',
      grammarBreakdown: [
        { word: sentence.split(' ')[0] || 'كَلِمَة', pos: 'Nom / Verbe', meaning: 'Signification', explanation: 'Rôle grammatical (I\'rab)' }
      ],
      tips: 'Veillez à bien respecter les terminaisons des voyelles selon la fonction grammaticale (Marfou‘, Mansoub, Madjroor).'
    });
  }

  try {
    const systemPrompt = `You are an expert Arabic linguist and teacher for French-speaking learners (apprenants francophones).
Analyze the given Arabic phrase or word provided by the user.
Provide full accurate vocalization (تشكيل كامل), French phonetic transliteration, grammatical role breakdown in French terminology (Sujet/Fā‘il, COD/Maf‘ūl bihi, Nom au cas direct/indirect, Mubtada’, Khabar...), 3-letter root (الجذر اللغوي), and helpful tips for French speakers.
Output MUST be strictly valid JSON in this schema:
{
  "original": "original text",
  "tashkeel": "vocalized Arabic text with complete harakat",
  "transliteration": "phonetic romanization adapted to French phonetics",
  "translation": "clear and precise French translation",
  "root": "3-letter root (e.g., ك-ت-ب)",
  "cefrLevel": "Estimated CEFR level (A1, A2, B1, B2, C1, C2)",
  "breakdown": [
    {"token": "Arabic word", "vocalized": "vocalized", "type": "Nom/Verbe/Particule", "irab": "Rôle grammatical expliqué simplement", "meaning": "Sens en français"}
  ],
  "commonMistakes": "Astuces pour éviter les erreurs fréquentes des francophones",
  "culturalNote": "Contexte culturel ou linguistique pertinent"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Analyze this Arabic text for a French-speaking learner: "${sentence}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-arabic:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze Arabic' });
  }
});

// 3. AI Custom Practice & Story Generator for any CEFR level
app.post('/api/generate-practice', async (req: Request, res: Response) => {
  const { level = 'A1', theme = 'culture', type = 'story', userLanguage = 'fr' } = req.body;

  const ai = getAI();
  if (!ai) {
    return res.json({
      title: 'رِحْلَةٌ إِلَى المَدِينَةِ المُنَوَّرَة (Un voyage à Médine)',
      arabicText: 'سَافَرَ سَامِي مَعَ عَائِلَتِهِ إِلَى المَدِينَةِ. زَارَ المَسْجِدَ النَّبَوِيَّ وَتَنَاوَلَ التَّمْرَ اللَّذِيذ. كَانَ الجَوُّ لَطِيفًا وَالنَّاسُ كُرَمَاء.',
      translation: 'Sami a voyagé avec sa famille à Médine. Il a visité la mosquée du Prophète et a dégusté de délicieuses dattes. Le temps était agréable et les gens étaient généreux.',
      vocabulary: [
        { arabic: 'سَافَرَ', meaning: 'A voyagé', transliteration: 'Safara' },
        { arabic: 'عَائِلَة', meaning: 'Famille', transliteration: 'A\'ilah' },
        { arabic: 'تَمْر', meaning: 'Dattes', transliteration: 'Tamr' },
        { arabic: 'كُرَمَاء', meaning: 'Généreux (pluriel)', transliteration: 'Kourama\'' }
      ],
      questions: [
        {
          question: 'مَعَ مَنْ سَافَرَ سَامِي؟ (Avec qui Sami a-t-il voyagé ?)',
          options: ['مَعَ أَصْدِقَائِهِ (Avec ses amis)', 'مَعَ عَائِلَتِهِ (Avec sa famille)', 'بِمُفْرَدِهِ (Seul)'],
          correctAnswerIndex: 1,
          explanation: 'Le texte précise : "سَافَرَ سَامِي مَعَ عَائِلَتِهِ"'
        }
      ]
    });
  }

  try {
    const prompt = `Generate an engaging interactive Arabic learning unit suited for CEFR level ${level} on the theme "${theme}" for French-speaking learners.
If level is A1: Focus on short sentences, high-frequency daily vocabulary, self/family/places, complete Tashkeel, French phonetics.
If level is A2: Daily routines, travel, directions, shopping, simple past/present verbs.
If level is B1: Personal anecdotes, hobbies, cultural customs, compound sentences.
If level is B2: Opinions, news summary, social traditions, media analysis.
If level is C1: Literary prose, historical excerpts, nuanced rhetoric, debates.
If level is C2: Classical literature, poetic metaphors, complex philosophical/linguistic mastery.

Output MUST be strictly JSON format matching this schema:
{
  "title": "Titre arabe avec voyelles (Traduction française)",
  "arabicText": "Texte arabe entièrement vocalisé adapté au niveau CEFR",
  "translation": "Traduction française complète",
  "transliteration": "Transcription phonétique adaptée au français",
  "vocabulary": [
    {"arabic": "الكلمة مع التشكيل", "transliteration": "phonétique", "meaning": "Sens en français"}
  ],
  "grammarFocus": {
    "ruleName": "Nom de la règle en arabe et français (ex: النعت والمنعوت / L'adjectif qualificatif)",
    "explanation": "Explication claire pour apprenants francophones",
    "example": "Exemple extrait du texte"
  },
  "questions": [
    {
      "question": "Question en arabe avec sous-titre en français",
      "options": ["Option 1 en arabe", "Option 2 en arabe", "Option 3 en arabe"],
      "correctAnswerIndex": 0,
      "explanation": "Pourquoi cette réponse est correcte en français"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-practice:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate practice' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faseeh Arabic Learning Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
