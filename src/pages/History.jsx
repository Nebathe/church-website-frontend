import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Flame, History as HistoryIcon,
  BookOpen, Calendar, MapPin, Award, 
  Sparkle, ShieldAlert, Navigation, ArrowDown,
  Globe2, Check, Bookmark, ArrowRight, Hourglass
} from 'lucide-react';

// ============================================================
// LANGUAGE DATA
// ============================================================
const LANGUAGES = [
  { id: 'english', label: 'English', script: 'EN' },
  { id: 'amharic', label: 'አማርኛ', script: 'አማ' },
  { id: 'oromo', label: 'Afaan Oromoo', script: 'OR' },
];

// ============================================================
// MILESTONES - CHURCH HISTORY DATA
// ============================================================
const MILESTONES = {
  english: [
    {
      year: '1996',
      title: 'The Founding',
      body: 'A small group of believers gathered in a single room with one Bible and an unshakeable conviction. The church was officially established with 12 founding members under the leadership of Pastor Abraham Tesfaye.',
      icon: Flame,
      badge: 'Spiritual Birth'
    },
    {
      year: '2002',
      title: 'A Home of Our Own',
      body: 'After years of meeting in homes and rented halls, the congregation broke ground on its first dedicated building — a milestone celebrated with three days of prayer and praise.',
      icon: MapPin,
      badge: 'Physical Grounding'
    },
    {
      year: '2010',
      title: 'Growth & Outreach',
      body: 'Membership surpassed 500 families. New ministries launched: youth discipleship, community feeding, and a multilingual worship programme serving Amharic, Oromo, and English speakers.',
      icon: BookOpen,
      badge: 'Multicultural Expansion'
    },
    {
      year: '2018',
      title: 'New Sanctuary',
      body: 'The congregation dedicated a new sanctuary seating 1,200 worshippers — a testament to 22 years of faithful giving and God\'s provision.',
      icon: Award,
      badge: 'Divine Completion'
    },
    {
      year: 'Today',
      title: 'Still Growing',
      body: 'With over 1,247 active members and weekly services in three languages, the church continues its mission: worship that transforms, community that heals, and faith that reaches the world.',
      icon: Sparkles,
      badge: 'Active Harvest'
    },
  ],
  amharic: [
    {
      year: '1996',
      title: 'ምስረታ',
      body: 'አነስተኛ ቡድን አማኞች በአንድ ክፍል ውስጥ ተሰብስበው ቤተክርስቲያናችን ተመሠረተ። 12 መሥራቾች ፓስተር አብርሃም ተስፋዬ በሚመሩ ሥር የቤተክርስቲያን ሕይወት ጀምሩ።',
      icon: Flame,
      badge: 'መንፈሳዊ ጅምር'
    },
    {
      year: '2002',
      title: 'የራሳችን ቤት',
      body: 'ለዓመታት በቤቶች ተሰብስበን ከቆየን በኋላ ቤተ ክርስቲያናችን ለመጀሪያ ጊዜ ራሱ ሕንፃ ሠራ። ሦስት ቀን ጸሎት እና ምስጋና ተደረገ።',
      icon: MapPin,
      badge: 'የመጀመሪያው ሕንፃ'
    },
    {
      year: '2010',
      title: 'እድገት እና አገልግሎት',
      body: 'አባልነት 500 ቤተሰቦችን አለፈ። ለወጣቶች፣ ለማህበረሰብ እና ለሦስት ቋንቋ ያሉ ስብከቶች አዳዲስ አገልግሎቶች ተጀምሩ።',
      icon: BookOpen,
      badge: 'የአገልግሎት ማስፋፊያ'
    },
    {
      year: '2018',
      title: 'አዲስ ቤተ መቅደስ',
      body: '1,200 አምልኮ ሰዎችን የሚቀበል አዲስ ቤተ መቅደስ ተወሰነ። ለ22 ዓመታት ታማኝ መስጠት እና የእግዚአብሔር አቅርቦት ምስክርነት ነው።',
      icon: Award,
      badge: 'አዲሱ መቅደስ'
    },
    {
      year: 'ዛሬ',
      title: 'አሁንም እያደጉ',
      body: 'ከ1,247 በላይ ንቁ አባሎች ያሉ ሲሆን፣ ቤተ ክርስቲያናችን አምልኮ፣ ህብረተሰብ እና እምነቱን ወደ ዓለም ለማድረስ ቀጥሏል።',
      icon: Sparkles,
      badge: 'የዛሬው ራዕይ'
    },
  ],
  oromo: [
    {
      year: '1996',
      title: 'Hundeeffama',
      body: 'Gareen amantootaa xiqqaan kutaa tokkotti walitti qabamanii waldaa hundeessan. Miseensota 12 hundeessituu Pastor Abraham Tesfaye hoogganuun jireenyi waldaa jalqabame.',
      icon: Flame,
      badge: 'Jalqaba Hafuraa'
    },
    {
      year: '2002',
      title: 'Mana Keenya',
      body: 'Waggaa dheeraaf manaa fi hoolota kireefametti walitti qabamaa turre. Yeroo jalqabaatiif mana keenya ijaaruu jalqabne — kabajamuu guyyaa sadii kadhannaafi galata wajjin.',
      icon: MapPin,
      badge: 'Ijaarama Gamoo'
    },
    {
      year: '2010',
      title: 'Guddina fi Tajaajila',
      body: 'Miseensonnii 500 maatii darbuu. Dargaggoota, hawaasa fi sagantaa afaan sadii kan qabate tajaajilli haaraan jalqabame.',
      icon: BookOpen,
      badge: 'Baballina Afaanii'
    },
    {
      year: '2018',
      title: 'Mana Waaqeffannaa Haaraa',
      body: 'Namni 1,200 itti sagaduu danda\'u mana waaqeffannaa haaraan eebifame — waggaa 22 kennaa amanamtummaa fi dhiyeessaa Waaqayyoo ragaa.',
      icon: Award,
      badge: 'Eebba Mana Waaqayyo'
    },
    {
      year: 'Har\'a',
      title: 'Guddachaa jira',
      body: 'Miseensota 1,247 olitti kan ta\'an yoo ta\'u, waldaan keenya sagadaa jijjiiru, hawaasa fayyisu, fi amantii addunyaatti gahu itti fufee jira.',
      icon: Sparkles,
      badge: 'Mul\'ata Har\'aa'
    },
  ],
};

// ============================================================
// INTRO TEXT
// ============================================================
const INTRO = {
  english: {
    eyebrow: 'Our Story',
    heading: 'History &\nEstablishment',
    lead: 'From a single room to a sanctuary of thousands — a story of faith, perseverance, and community built across generations.',
  },
  amharic: {
    eyebrow: 'ታሪካችን',
    heading: 'ታሪክ እና\nምስረታ',
    lead: 'ከአንድ ክፍል ወደ ሺዎች ቤተ መቅደስ — ከትውልድ ወደ ትውልድ የተሠራ የእምነት፣ ጽናት እና ማህበረሰብ ታሪክ።',
  },
  oromo: {
    eyebrow: 'Seenaa Keenya',
    heading: 'Seenaa fi\nHundeeffama',
    lead: 'Kutaa tokko irraa hanga mana waaqeffannaa kumootaatti — seenaa amantii, obsaa, fi hawaasa dhaloota darbee dhaalamee.',
  },
};

export default function History() {
  const [activeLang, setActiveLang] = useState('english');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Custom cursor spotlight coords (identical to leadership.jsx)
  const containerRef = useRef(null);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const switchLang = (id) => {
    if (id === activeLang) return;
    setActiveLang(id);
  };

  const intro = INTRO[activeLang];
  const milestones = MILESTONES[activeLang];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#07070F] text-white flex flex-col justify-between font-sans selection:bg-purple-600/30 selection:text-white pb-12 relative overflow-hidden"
    >
      {/* Spotlight Effect matched exactly to leadership.jsx */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 duration-200 transition-opacity"
        style={{
          background: `radial-gradient(1000px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(139, 92, 246, 0.05), transparent 80%)`
        }}
      />

      {/* Warm background drifting glowing vector orbs */}
      <div className="absolute top-[15%] left-[10%] w-[350px] sm:w-[600px] h-[350px] rounded-full bg-violet-600/5 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] sm:w-[650px] h-[400px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />

      {/* ── HERO HEADER BLOCK WITH DEEP SPACE ACCENTS ── */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-6 z-10">
        
        {/* Animated Eyebrow Tag */}
        <div className="flex justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-widest uppercase font-black"
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>{intro.eyebrow}</span>
          </motion.span>
        </div>

        {/* Dynamic Title with Elegant Split Display */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-3xl mx-auto drop-shadow-2xl">
          {intro.heading.split('\n').map((line, i) => (
            <span key={i} className="block mt-1">
              {i === 1 ? (
                <span className="bg-gradient-to-r from-violet-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent font-medium italic">
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>

        {/* Intro Lead Text */}
        <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {intro.lead}
        </p>

        {/* Integrated Multi-Language Switcher matches Leadership button highlights perfectly */}
        <div className="flex justify-center pt-2">
          <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] p-1 rounded-2xl backdrop-blur-xl">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => switchLang(lang.id)}
                className={`px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeLang === lang.id 
                    ? 'bg-violet-600 font-extrabold text-white shadow-lg shadow-violet-600/25 scale-102' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span className="mr-1.5 opacity-60 text-[10px] uppercase font-mono font-bold">{lang.script}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

      </header>

      {/* ── TIMELINE CONTAINER BLOCK ── */}
      <main className="relative w-full max-w-5xl mx-auto px-6 py-16 z-10">
        
        {/* Central Thread Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-8 w-0.5 bg-gradient-to-b from-violet-500/10 via-amber-500/30 to-violet-500/10 hidden md:block" />
        <div className="absolute left-8 top-4 bottom-8 w-0.5 bg-gradient-to-b from-violet-500/10 via-amber-500/30 to-violet-500/10 block md:hidden" />

        {/* Milestone Cards Mapper */}
        <div className="space-y-12 sm:space-y-16">
          <AnimatePresence mode="wait">
            {milestones.map((milestone, idx) => {
              const MilestoneIcon = milestone.icon || Bookmark;
              const isEven = idx % 2 === 0;
              const isHovered = hoveredIndex === idx;

              return (
                <motion.div
                  key={milestone.year + idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative grid grid-cols-1 md:grid-cols-2 items-center gap-8 ${
                    isEven ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  
                  {/* CENTRAL MULTI-GLOW CIRCLE DOT */}
                  <div className={`absolute top-6 z-20 flex items-center justify-center transition-all duration-300 ${
                    isEven 
                      ? 'md:left-1/2 md:-translate-x-1/2 left-8 -translate-x-1/2' 
                      : 'md:left-1/2 md:-translate-x-1/2 left-8 -translate-x-1/2'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isHovered 
                        ? 'bg-amber-400 border-amber-300 text-black scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                        : 'bg-[#09090F] border-violet-500/30 text-violet-400'
                    }`}>
                      <MilestoneIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* ACTIVE MILESTONE INFO CARD WITH INTEGRATED SHADOWS */}
                  <div className={`pl-14 md:pl-0 ${isEven ? 'md:col-start-1 md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <div className={`p-6 sm:p-8 rounded-3xl bg-white/[0.01] border backdrop-blur-xl transition-all duration-300 flex flex-col ${
                      isEven ? 'md:items-end' : 'md:items-start'
                    } ${
                      isHovered 
                        ? 'border-violet-500/30 bg-white/[0.02] shadow-[0_4px_30px_rgba(139,92,246,0.06)] scale-[1.01]' 
                        : 'border-white/[0.04]'
                    }`}>
                      
                      {/* Badge / Year row */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/15 font-mono uppercase tracking-wider font-bold">
                          {milestone.badge}
                        </span>
                        <span className="text-sm font-black text-amber-500 font-mono tracking-widest bg-amber-500/5 px-2 py-0.5 rounded">
                          {milestone.year}
                        </span>
                      </div>

                      {/* Milestone Title */}
                      <h3 className="text-xl font-black text-white leading-snug tracking-tight mb-2">
                        {milestone.title}
                      </h3>

                      {/* Description body */}
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans font-normal">
                        {milestone.body}
                      </p>
                    </div>
                  </div>

                  {/* Empty balance column helper for spacious layout parity on desktop */}
                  <div className="hidden md:block" />

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Beautiful closure seal matching the original design spec */}
        <div className="flex flex-col items-center justify-center pt-20 text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 rounded-full border-2 border-amber-500/20 animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-extrabold text-white">
              ✝
            </div>
          </div>
          <div>
            <span className="block text-[11px] font-mono text-gray-500 uppercase tracking-widest">
              Ancient Paths covenant is eternal
            </span>
          </div>
        </div>

      </main>

      {/* Clergy Footer Node */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 pt-12 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500 z-10 mt-16">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sanctuary History ledger synchronized.</span>
        </div>
        <div>
          <p>© 2026 Ancient Paths Grace Sanctuary · All covenants active.</p>
        </div>
      </footer>
    </div>
  );
}