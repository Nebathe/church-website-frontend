import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Globe, Building2, DollarSign, Users, Zap, Heart,
  Clock, RefreshCw, CheckCircle2, AlertTriangle, XCircle,
  User, Calendar, MessageSquare, Send, Trash2, Plus, X,
  TrendingUp, ChevronRight, Languages, Sliders, ShieldAlert, Check
} from 'lucide-react';
import { getTranslation } from '../translations';

// ============================================================
// COMPREHENSIVE INTERNAL MULTI-LANG DICTIONARY FOR BI-DIRECTIONAL DESIGN
// ============================================================
const PLAN_TRANSLATIONS = {
  en: {
    heroSub: "Covenant Milestones",
    heroTitle: "Annual Ministry Plan",
    heroDesc: "Track our corporate benchmarks, strategic actions, and infrastructure benchmarks for the glory of God. Watch the body align as we faithful labor together.",
    progressText: "Overall Completion",
    totalGoals: "Total Milestones",
    completed: "Completed",
    inProgress: "In Progress",
    planned: "Planned",
    delayed: "Delayed",
    cancelled: "Hold",
    cancel: "Cancel Proposal",
    addNewGoal: "Propose Milestone",
    newGoalTitle: "Formulate Corporate Benchmarks",
    goalAddedText: "Strategic Milestone Transmitted & Synchronized!",
    placeholderTitle: "Milestone Theme / Main Title",
    placeholderLeader: "Overseeing Clergy / Steward",
    placeholderDesc: "Describe the spiritual impact, timeline, and operational objectives in detail...",
    addGoalBtn: "Transmit Milestone to ledger",
    noGoals: "No Corporate Milestones Recorded",
    yet: "yet.",
    emptyHintAdmin: "Sign in with clergy credentials to formulate the first corporate benchmark.",
    emptyHintUser: "Please lift this up in prayer as the administration synchronizes new benchmarks.",
    noDate: "No Date Established",
    comments: "assembly reviews",
    commentPosted: "Review synced with active ledger!",
    writeComment: "Add a question, encouragement or prayer...",
    comment: "Review",
    admin: "Clergy Overseer",
    member: "Parish Member",
    purgeAlert: "Are you sure you want to purge this corporate goal from the active annual manifest?",
    
    // Category Names
    spGrowth: "Spiritual Growth",
    evOutreach: "Evangelism & Mission",
    facInfr: "Facilities & Infra",
    finSteward: "Stewardship Ledger",
    leadDev: "Leadership Cells",
    youthChild: "Youth & Heirs",
    commServ: "Community Solace"
  },
  am: {
    heroSub: "የኪዳን ምዕራፎች",
    heroTitle: "ዓመታዊ የአገልግሎት እቅድ",
    heroDesc: "ለእግዚአብሔር ክብር የቤተክርስቲያናችንን ዕቅዶች፣ ስልታዊ እርምጃዎችን እና መሠረተ ልማቶችን ይከታተሉ። በታማኝነት ስናገለግል የማህበረሰባችንን እድገት ይመልከቱ።",
    progressText: "አጠቃላይ አፈጻጸም",
    totalGoals: "አጠቃላይ እቅዶች",
    completed: "የተጠናቀቀ",
    inProgress: "በመከናወን ላይ",
    planned: "የታቀደ",
    delayed: "የዘገየ",
    cancelled: "የቆመ",
    cancel: "አፍርስ",
    addNewGoal: "አዲስ እቅድ መጨመሪያ",
    newGoalTitle: "የቤተክርስቲያን እቅድ መመዝገቢያ",
    goalAddedText: "ስልታዊ ዕቅዱ በተሳካ ሁኔታ ተመዝግቧል!",
    placeholderTitle: "የእቅዱ ዋና ጭብጥ / አርዕስት",
    placeholderLeader: "እቅዱን የሚያስፈጽም አገልጋይ",
    placeholderDesc: "ስለ እቅዱ መንፈሳዊ ተፅእኖ እና ዝርዝር አፈፃፀም በዝርዝር ይፃፉ...",
    addGoalBtn: "እቅዱን ወደ መዝገቡ አክል",
    noGoals: "ምንም ዓመታዊ እቅድ አልተመዘገበም",
    yet: "እስካሁን።",
    emptyHintAdmin: "የመጀመሪያውን እቅድ ለመመዝገብ በአገልጋይ የይለፍ ቃል ይግቡ።",
    emptyHintUser: "አገልጋዮች አዳዲስ እቅዶችን እስኪመዘግቡ ድረስ ይህንን በጸሎት ይደግፉ።",
    noDate: "ቀን አልተወሰነም",
    comments: "የምዕመናን አስተያየቶች",
    commentPosted: "አስተያየትዎ በተሳካ ሁኔታ ተመዝግቧል!",
    writeComment: "የማበረታቻ ወይም የድጋፍ ቃል እዚህ ይፃፉ...",
    comment: "አስተያየት",
    admin: "አስተዳዳሪ አገልጋይ",
    member: "ምዕመን",
    purgeAlert: "እርግጠኛ ነዎት ይህንን የአገልግሎት እቅድ ከመዝገቡ ላይ መሰረዝ ይፈልጋሉ?",
    
    // Categories
    spGrowth: "መንፈሳዊ እድገት",
    evOutreach: "ወንጌል ስርጭት & ሚሲዮን",
    facInfr: "ህንጻ & መሠረተ ልማት",
    finSteward: "የገንዘብ መጋቢነት",
    leadDev: "አመራር & አነስተኛ ቡድኖች",
    youthChild: "ወጣቶች & ህጻናት",
    commServ: "የማህበረሰብ አገልግሎት"
  },
  om: {
    heroSub: "Covenant Milestones",
    heroTitle: "Kadhannaa fi Karoora Waggaa",
    heroDesc: "Laboring with vision and grace. Monitor our active development, spiritual cell groups, and church infrastructure for the advancement of His Kingdom.",
    progressText: "Milestone Raawwatame",
    totalGoals: "Karoora Hundumaa",
    completed: "Kan Xumurame",
    inProgress: "Hojii Irratti",
    planned: "Kan Karoorfame",
    delayed: "Turi",
    cancelled: "Dhaabbate",
    cancel: "Karoora Haqqa",
    addNewGoal: "Karoora Haaraa",
    newGoalTitle: "Covenant Benchmarks Galmeessi",
    goalAddedText: "Strategic Milestone Locked & Synchronized!",
    placeholderTitle: "Theme / Title Karoorichaa",
    placeholderLeader: "Tajaajilaa Itti Gaafatamu",
    placeholderDesc: "Ibsa guutuu tajaajilaa fi milkiisaa asitti barreessi...",
    addGoalBtn: "Manifestii Irratti Galmeessi",
    noGoals: "Plan haaraan hin galmeeffamne",
    yet: "ammaaf.",
    emptyHintAdmin: "Clergy login is required to file strategic annual plans.",
    emptyHintUser: "Please lift this up in prayer as the administration synchronizes new benchmarks.",
    noDate: "No Date Established",
    comments: "Reviews",
    commentPosted: "Review synced with active ledger!",
    writeComment: "Write feedback, support or query...",
    comment: "Ergi",
    admin: "Clergy Overseer",
    member: "Parish Member",
    purgeAlert: "Are you sure you want to purge this corporate goal?",
    
    // Categories
    spGrowth: "Guddina Hafuuraa",
    evOutreach: "Injinera & Labsa",
    facInfr: "Mana & Infrastructure",
    finSteward: "Qabeenya Misoomaa",
    leadDev: "Geggeessummaa",
    youthChild: "Dargaggoota & Ijoollee",
    commServ: "Hawaasummaa"
  }
};

const CATEGORIES = [
  { id: 'spiritual', nameKey: 'spGrowth', icon: Sparkles, accent: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/15', fill: '#8B5CF6' },
  { id: 'evangelism', nameKey: 'evOutreach', icon: Globe, accent: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15', fill: '#3B82F6' },
  { id: 'facilities', nameKey: 'facInfr', icon: Building2, accent: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/15', fill: '#F97316' },
  { id: 'finance', nameKey: 'finSteward', icon: DollarSign, accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', fill: '#10B981' },
  { id: 'leadership', nameKey: 'leadDev', icon: Users, accent: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/15', fill: '#06B6D4' },
  { id: 'youth', nameKey: 'youthChild', icon: Zap, accent: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/15', fill: '#EC4899' },
  { id: 'community', nameKey: 'commServ', icon: Heart, accent: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/15', fill: '#14B8A6' },
];

const STATUSES = [
  { id: 'planned', nameKey: 'planned', icon: Clock, accent: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/15' },
  { id: 'in-progress', nameKey: 'inProgress', icon: RefreshCw, accent: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/15' },
  { id: 'completed', nameKey: 'completed', icon: CheckCircle2, accent: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
  { id: 'delayed', nameKey: 'delayed', icon: AlertTriangle, accent: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
  { id: 'cancelled', nameKey: 'cancelled', icon: XCircle, accent: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/15' },
];

const YEARS = [2024, 2025, 2026, 2027];

const getCat = id => CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
const getStat = id => STATUSES.find(s => s.id === id) || STATUSES[0];

const EMPTY_GOAL = { title: '', category: 'spiritual', description: '', leader: '', targetDate: '', status: 'planned' };

export default function AnnualPlan() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [plans, setPlans] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [goalAdded, setGoalAdded] = useState(false);
  const [newGoal, setNewGoal] = useState(EMPTY_GOAL);
  const [comments, setComments] = useState({});
  const [openComment, setOpenComment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentPosted, setCommentPosted] = useState(null);
  
  // Spotlight tracking
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const isAdmin = localStorage.getItem('token') === 'admin-token-123';

  const t = (key) => {
    const dict = PLAN_TRANSLATIONS[lang] || PLAN_TRANSLATIONS.en;
    return dict[key] || getTranslation(lang, key) || key;
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Sync language selection dynamically from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch initial structure from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`church_plans_${selectedYear}`);
    if (saved) {
      setPlans(JSON.parse(saved));
    } else {
      const sample = [
        { 
          id: 1, 
          title: 'Apostolic Youth Conference', 
          category: 'youth', 
          description: 'A 3-day regional summit featuring anointed guest speakers, liturgical worship workshops, and small discipleship cells.', 
          leader: 'Pastor Ermias Bekele', 
          targetDate: `${selectedYear}-07-15`, 
          status: 'in-progress', 
          createdAt: new Date().toISOString(), 
          progress: 60 
        },
        { 
          id: 2, 
          title: 'Parish Mercy Food Drive',  
          category: 'community', 
          description: 'Distribute organic care baskets containing dietary essentials to 350 vulnerable families across local parish cells.', 
          leader: 'Deacon Tesfaye G.', 
          targetDate: `${selectedYear}-05-30`, 
          status: 'completed', 
          createdAt: new Date().toISOString(), 
          progress: 100 
        },
        { 
          id: 3, 
          title: 'Sanctuary Restoration Project',
          category: 'facilities', 
          description: 'High-altitude interior mural restorative work, acoustic board treatments, and solid mahogany pews refurbishment.', 
          leader: 'Elder Tamrat M.', 
          targetDate: `${selectedYear}-11-22`, 
          status: 'planned', 
          createdAt: new Date().toISOString(), 
          progress: 5 
        },
      ];
      setPlans(sample);
      localStorage.setItem(`church_plans_${selectedYear}`, JSON.stringify(sample));
    }
  }, [selectedYear]);

  useEffect(() => {
    if (plans.length > 0 || localStorage.getItem(`church_plans_${selectedYear}`)) {
      localStorage.setItem(`church_plans_${selectedYear}`, JSON.stringify(plans));
    }
  }, [plans, selectedYear]);

  useEffect(() => {
    const saved = localStorage.getItem(`church_plan_comments_${selectedYear}`);
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      setComments({});
    }
  }, [selectedYear]);

  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem(`church_plan_comments_${selectedYear}`, JSON.stringify(updatedComments));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.leader.trim()) return;

    const obj = { 
      id: Date.now(), 
      title: newGoal.title.trim(),
      category: newGoal.category,
      description: newGoal.description.trim(),
      leader: newGoal.leader.trim(),
      targetDate: newGoal.targetDate || new Date().toISOString().split('T')[0],
      status: newGoal.status,
      createdAt: new Date().toISOString(), 
      progress: 0 
    };

    setPlans(prev => [...prev, obj]);
    setNewGoal(EMPTY_GOAL);
    setGoalAdded(true);

    setTimeout(() => {
      setGoalAdded(false);
      setShowForm(false);
    }, 2000);
  };

  const handleStatus = (id, val) => {
    setPlans(prev => prev.map(x => {
      if (x.id === id) {
        return { 
          ...x, 
          status: val,
          progress: val === 'completed' ? 100 : x.progress
        };
      }
      return x;
    }));
  };

  const handleProgress = (id, val) => {
    const boundVal = Math.min(100, Math.max(0, val));
    setPlans(prev => prev.map(x => {
      if (x.id === id) {
        return { 
          ...x, 
          progress: boundVal,
          status: boundVal === 100 ? 'completed' : x.status === 'completed' ? 'in-progress' : x.status
        };
      }
      return x;
    }));
  };

  const handleDelete = (id) => {
    if (!window.confirm(t('purgeAlert'))) return;
    setPlans(prev => prev.filter(x => x.id !== id));
  };

  const handleComment = (goalId) => {
    if (!newComment.trim()) return;
    
    const obj = { 
      id: Date.now(), 
      text: newComment.trim(), 
      author: isAdmin ? t('admin') : t('member'), 
      date: new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'am-ET'), 
      isAdmin 
    };

    const updated = { 
      ...comments, 
      [goalId]: [...(comments[goalId] || []), obj] 
    };

    saveComments(updated);
    setNewComment('');
    setCommentPosted(goalId);
    
    setTimeout(() => {
      setCommentPosted(null);
    }, 1500);
  };

  const overall = plans.length ? Math.round(plans.reduce((s, p) => s + (p.progress || 0), 0) / plans.length) : 0;
  const completedCnt = plans.filter(p => p.status === 'completed').length;
  const inProgressCnt = plans.filter(p => p.status === 'in-progress').length;
  const plannedCnt = plans.filter(p => p.status === 'planned').length;

  return (
    <main 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#07070F] text-gray-100 overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Spotlight Effect */}
      <div 
        className="absolute pointer-events-none rounded-full blur-[135px] opacity-[0.24] transition-all duration-300"
        style={{
          width: '520px',
          height: '520px',
          left: `${coords.x - 260}px`,
          top: `${coords.y - 260}px`,
          background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, rgba(249,115,22,0.06) 100%)',
        }}
      />

      {/* Decorative Blur Clusters */}
      <div className="absolute top-[15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[510px] h-[510px] rounded-full bg-orange-600/10 blur-[160px] pointer-events-none" />
      
      {/* Micro Grid Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* ══ HERO DECLARATION SECTION ══ */}
        <section className="text-center max-w-3xl mx-auto mb-14 mt-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold tracking-wider uppercase mb-5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span>{t('heroSub')}</span>
          </motion.div>

          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 font-sans"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            {t('heroDesc')}
          </motion.p>

          {/* Year Navigation Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-1.5 p-1 bg-[#090912]/85 border border-white/[0.05] rounded-xl max-w-xs mx-auto"
          >
            {YEARS.map(yr => (
              <button 
                key={yr} 
                onClick={() => setSelectedYear(yr)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  selectedYear === yr 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/15' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {yr}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ══ OVERALL COVENANT PERFORMANCE HUD ══ */}
        <section className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-[24px] bg-[#090914]/80 border border-white/[0.05] backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-light text-white tracking-tight font-sans">
                  {selectedYear} {t('progressText')}
                </h2>
                <p className="text-xs text-gray-400 mt-1">Weighted progress of active development milestones</p>
              </div>
              <div className="shrink-0 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-light text-violet-400 tracking-tight font-mono">
                  {overall}
                </span>
                <span className="text-lg text-gray-500 font-bold font-sans">%</span>
              </div>
            </div>

            {/* Custom styled progress track */}
            <div className="h-2.5 bg-[#07070F] border border-white/[0.04] rounded-full overflow-hidden mb-8">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${overall}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="height-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-amber-500"
                style={{ height: '100%' }}
              />
            </div>

            {/* Dashboard stats indices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t('totalGoals'), val: plans.length, color: 'text-violet-400', labelColor: 'text-violet-500/40' },
                { label: t('completed'), val: completedCnt, color: 'text-emerald-400', labelColor: 'text-emerald-500/40' },
                { label: t('inProgress'), val: inProgressCnt, color: 'text-blue-400', labelColor: 'text-blue-500/40' },
                { label: t('planned'), val: plannedCnt, color: 'text-slate-400', labelColor: 'text-slate-500/40' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#07070F]/65 border border-white/[0.04] text-center">
                  <span className={`text-2xl sm:text-3xl font-light block ${stat.color} font-mono`}>
                    {stat.val}
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ══ GOAL FORMULATOR STRIP (ADMIN ONLY) ══ */}
        {isAdmin && (
          <div className="text-center mb-10">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: .98 }}
              onClick={() => setShowForm(!showForm)}
              className={`px-5 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer ${
                showForm 
                  ? 'bg-white/[0.04] text-gray-300 border border-white/[0.1] hover:bg-white/[0.08]' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-violet-600/15 text-white shadow-lg'
              }`}
            >
              {showForm ? (
                <>
                  <X className="w-3.5 h-3.5 text-rose-450" />
                  <span>{t('cancel')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addNewGoal')}</span>
                </>
              )}
            </motion.button>
          </div>
        )}

        <AnimatePresence>
          {showForm && isAdmin && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: .4, ease: 'easeInOut' }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-gradient-to-br from-[#0F0D24]/80 to-[#0A0914]/90 border border-violet-500/15 p-6 sm:p-8 rounded-[24px] shadow-2xl relative">
                
                <h3 className="text-lg font-light text-white tracking-tight flex items-center gap-2 mb-1.5 font-sans">
                  <Plus className="w-5 h-5 text-violet-400" />
                  <span>{t('newGoalTitle')}</span>
                </h3>
                <p className="text-xs text-gray-500 max-w-xl mb-6">
                  Input milestone guidelines to update congregational ledgers for {selectedYear}. All fields are recorded.
                </p>

                <AnimatePresence mode="wait">
                  {goalAdded ? (
                    <motion.div 
                      key="submission-feedback" 
                      initial={{ opacity: 0, scale: .95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0 }}
                      className="text-center py-10 bg-violet-500/5 border border-violet-500/20 rounded-2xl"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: .5 }}
                        className="text-violet-400 flex justify-center mb-3"
                      >
                        <Check className="w-10 h-10 bg-violet-400/10 p-2 rounded-full border border-violet-450" />
                      </motion.div>
                      <p className="text-white font-bold text-base">{t('goalAddedText')}</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Milestone Title */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          {t('placeholderTitle')}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={newGoal.title}
                          onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                          placeholder="e.g. Parish Youth Leadership Incubator"
                        />
                      </div>

                      {/* Overlord Overseeing Minister */}
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          {t('placeholderLeader')}
                        </label>
                        <input 
                          type="text" 
                          required
                          value={newGoal.leader}
                          onChange={e => setNewGoal({ ...newGoal, leader: e.target.value })}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all font-sans"
                          placeholder="e.g. Pastor Bekele"
                        />
                      </div>

                      {/* Cateogry */}
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Ministry Domain
                        </label>
                        <select 
                          value={newGoal.category}
                          onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-350 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all cursor-pointer font-sans"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c.id} value={c.id} className="bg-[#0A0A14] text-white">
                              {t(c.nameKey)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Target completion date */}
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Target date limit
                        </label>
                        <input 
                          type="date"
                          required
                          value={newGoal.targetDate}
                          onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-350 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all [color-scheme:dark] font-sans"
                        />
                      </div>

                      {/* Initial Status */}
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Initial ledger status
                        </label>
                        <select 
                          value={newGoal.status}
                          onChange={e => setNewGoal({ ...newGoal, status: e.target.value })}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-350 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all cursor-pointer font-sans"
                        >
                          {STATUSES.map(s => (
                            <option key={s.id} value={s.id} className="bg-[#0A0A14] text-white">
                              {t(s.nameKey)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Strategic description overview
                        </label>
                        <textarea 
                          rows={3} 
                          required
                          value={newGoal.description}
                          onChange={e => setNewGoal({ ...newGoal, description: e.target.value })}
                          maxLength={320}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-violet-500/40 transition-all resize-none font-sans"
                          placeholder={t('placeholderDesc')}
                        />
                      </div>

                      {/* Form action */}
                      <button 
                        type="submit" 
                        className="md:col-span-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:opacity-95 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('addGoalBtn')}</span>
                      </button>

                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══ COVENANT MILESTONES MAIN FLOW ══ */}
        <section className="mb-14">
          <AnimatePresence mode="wait">
            {plans.length === 0 ? (
              
              /* Clean empty state */
              <motion.div 
                key="plans-empty-card" 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                className="text-center py-20 px-6 bg-[#080812]/50 border border-white/[0.04] rounded-[24px]"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <TrendingUp className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 font-sans">
                  {t('noGoals')} {selectedYear} {t('yet')}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {isAdmin ? t('emptyHintAdmin') : t('emptyHintUser')}
                </p>
              </motion.div>
            ) : (
              
              /* Milestone Flow grid */
              <motion.div 
                key="plans-active-cards" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {plans.map((plan, idx) => {
                  const cat = getCat(plan.category);
                  const stat = getStat(plan.status);
                  const goalComments = comments[plan.id] || [];
                  const prog = plan.progress || 0;
                  const isCommentOpened = openComment === plan.id;

                  return (
                    <motion.div 
                      key={plan.id}
                      initial={{ opacity: 0, y: 15 }} 
                      whileInView={{ opacity: 1, y: 0 }} 
                      viewport={{ once: true }} 
                      transition={{ delay: idx * 0.05, duration: .45 }}
                      whileHover={{ y: -3 }}
                      className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#090914]/90 border border-white/[0.05] hover:bg-[#0C0C1C] hover:border-white/[0.08] transition-all duration-300"
                    >
                      {/* Left category-determined border highlight */}
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: cat.fill }} />

                      <div className="pl-6 pr-5 py-5 flex-grow flex flex-col justify-between">
                        <div>
                          
                          {/* Inner Header tags */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.accent} border border-white/[0.04]`}>
                              <cat.icon className="w-3 h-3" />
                              <span>{t(cat.nameKey)}</span>
                            </span>

                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${stat.bg} ${stat.accent} border border-white/[0.04]`}>
                              <stat.icon className="w-3 h-3" />
                              <span>{t(stat.nameKey)}</span>
                            </span>
                          </div>

                          {/* Milestone Title */}
                          <h3 className="text-lg font-light tracking-wide text-white mb-2 text-left font-sans">
                            {plan.title}
                          </h3>

                          {/* Plan details description */}
                          <p className="text-gray-400 text-xs leading-relaxed font-sans mb-5 text-left">
                            {plan.description}
                          </p>
                        </div>

                        {/* Mid Meta values */}
                        <div className="pt-4 border-t border-white/[0.03] space-y-4">
                          
                          <div className="flex flex-wrap items-center justify-between gap-2.5">
                            {/* Steward leader */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans font-medium">
                              <User className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                              <span>{plan.leader}</span>
                            </div>

                            {/* Calendar target date */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans font-medium">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{plan.targetDate || t('noDate')}</span>
                            </div>
                          </div>

                          {/* Performance bar */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-gray-500 font-bold uppercase tracking-wider">Milestone Progress</span>
                              <span className="text-violet-400 font-bold">{prog}%</span>
                            </div>
                            <div className="h-1.5 bg-[#07070F] border border-white/[0.04] rounded-full overflow-hidden">
                              <div 
                                className="height-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                                style={{ width: `${prog}%`, height: '100%' }}
                              />
                            </div>
                          </div>

                          {/* Admin tuning meters directly inside index cards */}
                          {isAdmin && (
                            <div className="p-3 bg-[#07070F]/80 rounded-xl space-y-3 border border-white/[0.03] ">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                  <Sliders className="w-3 h-3 text-violet-400" />
                                  <span>Clergy Calibration</span>
                                </span>
                                <button 
                                  onClick={() => handleDelete(plan.id)}
                                  className="text-rose-450 hover:text-rose-400 p-1 bg-rose-500/10 border border-rose-500/15 rounded transition-all"
                                  title="Purge goal"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider mb-1">Status Code</label>
                                  <select 
                                    value={plan.status} 
                                    onChange={e => handleStatus(plan.id, e.target.value)}
                                    className="w-full bg-[#05050B] border border-white/[0.06] rounded px-2 py-1 text-[10px] text-gray-300 focus:outline-none"
                                  >
                                    {STATUSES.map(s => <option key={s.id} value={s.id}>{t(s.nameKey)}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-wider mb-1">Progress value</label>
                                  <input 
                                    type="number" 
                                    min="0" 
                                    max="100" 
                                    value={prog}
                                    onChange={e => handleProgress(plan.id, parseInt(e.target.value) || 0)}
                                    className="w-full bg-[#05050B] border border-white/[0.06] rounded px-2 py-1 text-[10px] text-violet-400 font-mono focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Review comment system */}
                          <div className="pt-3 border-t border-white/[0.03]">
                            <button 
                              onClick={() => setOpenComment(isCommentOpened ? null : plan.id)}
                              className="text-gray-550 hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{goalComments.length} {t('comments')}</span>
                              <ChevronRight className={`w-3 h-3 transition-transform ${isCommentOpened ? 'rotate-90' : ''}`} />
                            </button>

                            <AnimatePresence>
                              {isCommentOpened && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }} 
                                  transition={{ duration: .3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-3.5 space-y-3.5">
                                    
                                    {/* List comments reviews */}
                                    {goalComments.length > 0 && (
                                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {goalComments.map(c => (
                                          <div 
                                            key={c.id} 
                                            className={`p-3 rounded-xl border ${
                                              c.isAdmin 
                                                ? 'bg-violet-950/15 border-violet-500/15' 
                                                : 'bg-white/[0.02] border-white/[0.04]'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                              <span className={`text-[10px] font-bold ${c.isAdmin ? 'text-violet-400' : 'text-gray-350'}`}>
                                                {c.author}
                                              </span>
                                              <span className="text-[9px] text-gray-550">{c.date}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed text-left font-sans">{c.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Dispatch comment control */}
                                    {commentPosted === plan.id ? (
                                      <div className="text-emerald-400 text-xs font-semibold inline-flex items-center gap-1 py-1.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>{t('commentPosted')}</span>
                                      </div>
                                    ) : (
                                      <div className="flex gap-2">
                                        <input 
                                          type="text" 
                                          placeholder={t('writeComment')}
                                          value={newComment}
                                          onChange={e => setNewComment(e.target.value)}
                                          onKeyDown={e => {
                                            if (e.key === 'Enter') handleComment(plan.id);
                                          }}
                                          maxLength={120}
                                          className="flex-1 bg-[#07070F] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-violet-500/30 font-sans"
                                        />
                                        <button 
                                          onClick={() => handleComment(plan.id)}
                                          className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all shrink-0 active:scale-95"
                                        >
                                          <Send className="w-3 h-3 text-violet-400" />
                                          <span>{t('comment')}</span>
                                        </button>
                                      </div>
                                    )}

                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
}
