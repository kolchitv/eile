import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  X, 
  Play, 
  Search, 
  Download, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  MessageSquare, 
  Sparkles,
  Youtube
} from 'lucide-react';
import { VIDEO_LIBRARY, VideoItem, EILE_CHANNEL_URL } from '../data/videoLibraryData';

interface VideoLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'fr' | 'en';
  initialCategory?: 'all' | 'letters' | 'texts' | 'vocabulary' | 'dialogues';
  initialVideoId?: string;
}

export const VideoLibraryModal: React.FC<VideoLibraryModalProps> = ({
  isOpen,
  onClose,
  language,
  initialCategory = 'all',
  initialVideoId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'letters' | 'texts' | 'vocabulary' | 'dialogues'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(() => {
    if (initialVideoId) {
      return VIDEO_LIBRARY.find((v) => v.id === initialVideoId || v.youtubeId === initialVideoId || v.letterOrTheme === initialVideoId) || VIDEO_LIBRARY[0];
    }
    return VIDEO_LIBRARY[0];
  });

  const filteredVideos = useMemo(() => {
    return VIDEO_LIBRARY.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchSearch =
        item.titleAr.toLowerCase().includes(q) ||
        item.titleFr.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        (item.letterOrTheme && item.letterOrTheme.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', nameAr: 'الكل (45 فيديو)', nameFr: 'Tous (45 vidéos)', nameEn: 'All (45 videos)', icon: Layers },
    { id: 'letters', nameAr: '🔤 حروف اللغة العربية', nameFr: '🔤 Lettres de l’Alphabet', nameEn: '🔤 Alphabet Letters', icon: Sparkles },
    { id: 'texts', nameAr: '📖 نصوص وقصص بسيطة', nameFr: '📖 Textes & Histoires', nameEn: '📖 Stories & Texts', icon: BookOpen },
    { id: 'vocabulary', nameAr: '📚 المعجم المصور', nameFr: '📚 Lexique Thématique', nameEn: '📚 Thematic Lexicon', icon: Video },
    { id: 'dialogues', nameAr: '💬 الحوارات والتواصل', nameFr: '💬 Dialogues & Échanges', nameEn: '💬 Dialogues', icon: MessageSquare },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif">
                    {language === 'ar' ? 'مكتبة الفيديوهات التعليمية (Arabe EILE)' : language === 'fr' ? 'Médiathèque Vidéo (Arabe EILE)' : 'Video Learning Library (Arabe EILE)'}
                  </h2>
                  <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    EILE Official
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-100 mt-0.5">
                  {language === 'ar'
                    ? 'فيديوهات الحروف، القصص المصورة، المعجم الموضوعاتي، والحوارات الشفهية المعتمدة'
                    : language === 'fr'
                    ? 'Lettres de l’alphabet, récits, lexique illustré et dialogues oraux officiels'
                    : 'Alphabet phonics, illustrated stories, thematic lexicon, and oral dialogues'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={EILE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition"
              >
                <Youtube className="w-4 h-4 text-amber-300" />
                <span>قناة اليوتيوب</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Tabs */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-sm shadow-red-200 font-bold'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    <span>{language === 'ar' ? cat.nameAr : language === 'fr' ? cat.nameFr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'بحث عن حرف، نص أو موضوع...' : language === 'fr' ? 'Rechercher...' : 'Search video...'}
                className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left/Main Column: Active Video Player & Info */}
            <div className="lg:col-span-7 xl:col-span-8 p-4 sm:p-5 overflow-y-auto border-b lg:border-b-0 lg:border-l border-slate-200 flex flex-col justify-start">
              {selectedVideo ? (
                <div className="space-y-4">
                  {/* Video Embed Player */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800">
                    {selectedVideo.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                        title={selectedVideo.titleAr}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-300">
                        <Video className="w-16 h-16 text-amber-400 mb-3 animate-pulse" />
                        <p className="font-bold text-lg text-white mb-1">
                          {selectedVideo.titleAr}
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm mb-4">
                          {language === 'ar'
                            ? 'هذا الشريط متوفر للتحميل والمشاهدة المباشرة عبر Google Drive'
                            : 'Cette vidéo de soutien est disponible en téléchargement direct sur Google Drive'}
                        </p>
                        {selectedVideo.driveUrl && (
                          <a
                            href={selectedVideo.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition"
                          >
                            <Download className="w-4 h-4" />
                            <span>فتح / تحميل من Google Drive</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Metadata & Action Bar */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                            {selectedVideo.category === 'letters'
                              ? 'حروف وهجاء'
                              : selectedVideo.category === 'texts'
                              ? 'نصوص وقصص'
                              : selectedVideo.category === 'vocabulary'
                              ? 'معجم مصور'
                              : 'حوار ومحادثة'}
                          </span>
                          {selectedVideo.week && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                              الأسبوع {selectedVideo.week}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-serif">
                          {selectedVideo.titleAr}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500">
                          {language === 'ar'
                            ? selectedVideo.titleFr
                            : language === 'fr'
                            ? selectedVideo.titleFr
                            : selectedVideo.titleEn}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {selectedVideo.youtubeUrl && (
                          <a
                            href={selectedVideo.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition"
                          >
                            <Youtube className="w-4 h-4 text-red-600" />
                            <span>فتح على YouTube</span>
                          </a>
                        )}
                        {selectedVideo.driveUrl && (
                          <a
                            href={selectedVideo.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition"
                          >
                            <Download className="w-4 h-4 text-blue-600" />
                            <span>تحميل من Drive</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                      <span>مصدر المحتوى: منهاج اللغة العربية والثقافة الأصلية (Arabe EILE)</span>
                      <span>جودة HD ومرفقة بروابط التحميل</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Play className="w-12 h-12 mb-2 text-slate-300" />
                  <p>اختر شريط فيديو من القائمة للمشاهدة</p>
                </div>
              )}
            </div>

            {/* Right Column: Playlist / Video Grid */}
            <div className="lg:col-span-5 xl:col-span-4 p-3 sm:p-4 overflow-y-auto max-h-[45vh] lg:max-h-none flex flex-col gap-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-xs font-bold text-slate-600">
                  قائمة المقاطع ({filteredVideos.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  اضغط لتشغيل الفيديو فوراً
                </span>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">لم يتم العثور على مقاطع تطابق بحثك</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredVideos.map((video) => {
                    const isPlaying = selectedVideo?.id === video.id;
                    return (
                      <button
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className={`w-full text-right p-3 rounded-xl flex items-start gap-3 transition-all border ${
                          isPlaying
                            ? 'bg-red-50/90 border-red-300 shadow-sm ring-1 ring-red-400'
                            : 'bg-white hover:bg-slate-100/80 border-slate-200'
                        }`}
                      >
                        {/* Thumbnail / Badge */}
                        <div
                          className={`w-14 h-11 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden ${
                            isPlaying
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-800 text-slate-200'
                          }`}
                        >
                          {video.youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.titleAr}
                              className="w-full h-full object-cover opacity-80"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Video className="w-5 h-5 text-amber-300" />
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className={`w-4 h-4 ${isPlaying ? 'text-amber-300' : 'text-white'}`} />
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isPlaying ? 'text-red-950 font-serif' : 'text-slate-800'
                              }`}
                            >
                              {video.titleAr}
                            </h4>
                            {video.week && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                                س{video.week}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {language === 'ar' ? video.titleFr : video.titleEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
