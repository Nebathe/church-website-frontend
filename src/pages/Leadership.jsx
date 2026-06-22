import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { getLeaders, addLeader, deleteLeader } from '../services/localStorageService';
import { getTranslation } from '../translations';
import { 
  Sparkles, Plus, Trash2, Phone, Mail, 
  Search, CheckCircle2, User, Lock, Flame, 
  Quote, ShieldCheck, Heart, 
  PlusCircle, Award, PhoneCall, MailCheck
} from 'lucide-react';

// Pre-seeded high quality warm professional approachable headshots from Unsplash
const APPROACHABLE_AVATARS = [
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400', label: 'Warm Professional Female' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', label: 'Approachable Professional Male 1' },
  { url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', label: 'Approachable Professional Male 2' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', label: 'Friendly Executive Female' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', label: 'Smiling Young Professional' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400', label: 'Warm Approachable Female 2' }
];

export default function Leadership() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [activeCategory, setActiveCategory] = useState('founders');
  const [leaders, setLeaders] = useState({ founders: [], currentLeaders: [] });
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected leader for "Personal Vision / Testimonial" detailed viewing modal
  const [activeVisionLeader, setActiveVisionLeader] = useState(null);

  // Form states
  const [newLeader, setNewLeader] = useState({
    name: '',
    role: '',
    amharicRole: '',
    oromoRole: '',
    description: '',
    amharicDesc: '',
    oromoDesc: '',
    photo: APPROACHABLE_AVATARS[0].url,
    phone: '',
    email: '',
    vision: '',
    amharicVision: '',
    oromoVision: ''
  });

  // Admin lock authentication bypass
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [alertBanner, setAlertBanner] = useState(null);

  const containerRef = useRef(null);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  const t = (key) => getTranslation(lang, key);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const loadData = () => {
    const data = getLeaders();
    setLeaders(data);
  };

  useEffect(() => {
    loadData();
    const token = localStorage.getItem('token');
    if (token === 'admin-token-123') {
      setIsAdmin(true);
    }
  }, []);

  const triggerNotification = (text, type = 'success') => {
    setAlertBanner({ text, type });
    setTimeout(() => {
      setAlertBanner(null);
    }, 4000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'church123') {
      setIsAdmin(true);
      localStorage.setItem('token', 'admin-token-123');
      setShowAdminAuthModal(false);
      setAdminUsername('');
      setAdminPassword('');
      triggerNotification(t('authSuccess') || 'Authenticated successfully. Clergy mode enabled!', 'success');
    } else {
      triggerNotification(t('authError') || 'Invalid administrative credentials.', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('token');
    triggerNotification(t('logoutSuccess') || 'Logged out from Clergy Administrator mode.', 'info');
  };

  const handleAddLeaderAction = (e) => {
    e.preventDefault();
    if (!newLeader.name || !newLeader.role) {
      triggerNotification('Name and Role are required.', 'error');
      return;
    }

    const leaderToSave = {
      ...newLeader,
      id: Date.now().toString(),
      phone: newLeader.phone || '+1 (555) 019-2000',
      email: newLeader.email || 'office@sanctuary.org',
      vision: newLeader.vision || 'To shepherd souls, build faith families, and empower local believers to represent Christ powerfully.',
      amharicVision: newLeader.amharicVision || 'ነፍሳትን መመገብ፣ የእምነት ቤተሰብን መገንባት እና አማኞችን ማብቃት።',
      oromoVision: newLeader.oromoVision || 'Dhaloota jaalalaan ijaaruu fi tajaajila addaa dhiyeessuu.'
    };

    addLeader(leaderToSave, activeCategory);
    loadData();
    setShowAddForm(false);
    setNewLeader({
      name: '',
      role: '',
      amharicRole: '',
      oromoRole: '',
      description: '',
      amharicDesc: '',
      oromoDesc: '',
      photo: APPROACHABLE_AVATARS[0].url,
      phone: '',
      email: '',
      vision: '',
      amharicVision: '',
      oromoVision: ''
    });
    triggerNotification(`Successfully registered ${newLeader.name} into index!`, 'success');
  };

  const handleDeleteLeaderAction = (id, name) => {
    if (confirm(`Remove ${name} from leadership list?`)) {
      deleteLeader(id, activeCategory);
      loadData();
      triggerNotification(`Removed ${name} from registry.`, 'info');
    }
  };

  const currentFounders = leaders.founders || [];
  const currentLeaders = leaders.currentLeaders || [];
  const displayList = activeCategory === 'founders' ? currentFounders : currentLeaders;

  // Search filter
  const filteredList = displayList.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#07070F] text-white flex flex-col justify-between font-sans selection:bg-purple-600/30 selection:text-white pb-12 relative overflow-hidden"
    >
      {/* Dynamic Interactive Spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 duration-200 transition-opacity"
        style={{
          background: `radial-gradient(1000px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(139, 92, 246, 0.04), transparent 80%)`
        }}
      />

      {/* Background drifting glowing orbs */}
      <div className="absolute top-[10%] left-[20%] w-[300px] sm:w-[500px] h-[300px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[10%] w-[350px] sm:w-[550px] h-[300px] rounded-full bg-amber-500/5 blur-[130px] pointer-events-none z-0" />

      {/* Styled Top Notification Bar */}
      <AnimatePresence>
        {alertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-xs font-semibold backdrop-blur-xl shadow-2xl ${
              alertBanner.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                : alertBanner.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                : 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{alertBanner.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 relative z-10 space-y-12">
        
        {/* Advanced Introduction Card with warm visual cues */}
        <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid md:grid-cols-12 gap-8 md:items-center">
            <div className="md:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-widest uppercase font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                {t('leadershipBadge') || 'CHURCH LEADERSHIP & PIONEERS'}
              </span>
              
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('leadershipIntroTitle') || 'Walking Ancient Paths with Spiritual Grace'}
              </h2>
              
              <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed">
                {t('leadershipIntroText') || 'Welcome to the central leadership index of Grace Sanctuary. Here, we highlight the pioneering founders, lead elders, and congregational shepherds who serve our diverse worship communities.'}
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('officeHours') || 'Office Hours: Mon - Fri (9:00 AM - 5:00 PM)'}</span>
              </div>
            </div>
            
            {/* Visual side illustration or highlights */}
            <div className="md:col-span-5 relative">
              <div className="relative p-6 rounded-2xl bg-[#0B0B13] border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-2.5 text-xs text-amber-500 font-mono font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>{t('testimonialTitle') || 'SHEPHERDED COVENANT STATEMENT'}</span>
                </div>
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-gray-400 italic flex gap-3">
                    <Quote className="w-5 h-5 text-violet-500 shrink-0 opacity-40 animate-pulse" />
                    <span>"{t('testimonialQuote') || 'Spiritual oversight is not our power but our burden of love. We build bridges, we heal, and we restore under divine alignment.'}"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600/25 flex items-center justify-center text-xs font-bold text-violet-300 font-mono">
                      AT
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Pastor Abraham Tesfaye</h4>
                      <p className="text-[10px] text-gray-500 font-mono">{t('pioneerTitle') || 'Pioneer & Patriarch'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Tab Swapper & Operational Search */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 bg-white/[0.01] border border-white/[0.04] p-1 rounded-2xl">
            <button
              onClick={() => {
                setActiveCategory('founders');
                setShowAddForm(false);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeCategory === 'founders' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-600/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('foundersTitle') || 'Church Pioneers & Founders'}
              <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-md text-[10px] font-mono">
                {currentFounders.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveCategory('current');
                setShowAddForm(false);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeCategory === 'current' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-600/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('currentTitle') || 'Active Clergy & Shepherds'}
              <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-md text-[10px] font-mono">
                {currentLeaders.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Live Search bar */}
            <div className="relative flex-grow md:flex-none md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchPlaceholder') || 'Find leaders by name, role...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 transition-all font-sans"
              />
            </div>

            {/* Admin Add Operator */}
            {isAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 text-black font-black" strokeWidth={3} />
                  <span>{t('addServant') || 'Add Servant'}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-violet-600/10 border border-violet-500/30 text-xs font-bold text-violet-400 hover:bg-violet-600 hover:text-white rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('logoutAdmin') || 'Logout Admin'}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAdminAuthModal(true)}
                className="px-4.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-bold hover:border-violet-500/40 hover:text-white transition-all flex items-center gap-2 cursor-pointer text-gray-400"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t('clergyPortal') || 'Clergy Portal'}</span>
              </button>
            )}
          </div>
        </section>

        {/* Dynamic Add Form for Admin Panel */}
        <AnimatePresence>
          {showAddForm && isAdmin && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-[#0A0A13] border border-white/[0.05] rounded-3xl p-6 sm:p-8"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6 pb-3 border-b border-white/[0.04]">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                <span>{t('addNewLeader') || 'Add New spiritual Leader'} ({activeCategory === 'founders' ? t('founder') || 'Founder' : t('shepherd') || 'Current Shepherd'})</span>
              </h3>

              <form onSubmit={handleAddLeaderAction} className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('fullName') || 'Full Name'} *</label>
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.name}
                      onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                      placeholder="Pastor Marcus Vance"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('roleEnglish') || 'Role (English)'} *</label>
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.role}
                      onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                      placeholder="Lead Pastor & Teacher"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('contactEmail') || 'Contact Email'}</label>
                    <input
                      type="email"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.email}
                      onChange={(e) => setNewLeader({ ...newLeader, email: e.target.value })}
                      placeholder="pastor@sanctuary.org"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('roleAmharic') || 'Role (Amharic)'}</label>
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.amharicRole}
                      onChange={(e) => setNewLeader({ ...newLeader, amharicRole: e.target.value })}
                      placeholder="ዋና እረኛ እና አስተማሪ"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('roleOromo') || 'Role (Oromo)'}</label>
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.oromoRole}
                      onChange={(e) => setNewLeader({ ...newLeader, oromoRole: e.target.value })}
                      placeholder="Lallabaa fi Gorsaa Ol'aanaa"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('phoneNumber') || 'Phone Number'}</label>
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={newLeader.phone}
                      onChange={(e) => setNewLeader({ ...newLeader, phone: e.target.value })}
                      placeholder="+1 (555) 019-1111"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('selectPhoto') || 'Select Portrait Headshot Preset'}</label>
                    <div className="grid grid-cols-6 gap-2">
                      {APPROACHABLE_AVATARS.map((avatar, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewLeader({ ...newLeader, photo: avatar.url })}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${newLeader.photo === avatar.url ? 'border-amber-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                          <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('customImageUrl') || 'Custom Image URL (Overrides preset selection above)'}</label>
                  <input
                    type="text"
                    className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50"
                    value={newLeader.photo}
                    onChange={(e) => setNewLeader({ ...newLeader, photo: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('bioEnglish') || 'Biography / Intro Statement (English)'}</label>
                    <textarea
                      className="w-full h-20 bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 resize-none"
                      value={newLeader.description}
                      onChange={(e) => setNewLeader({ ...newLeader, description: e.target.value })}
                      placeholder="Explain key background, education or spiritual callings."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{t('visionStatement') || 'Personal Vision & Testimonial Statement (English)'}</label>
                    <textarea
                      className="w-full h-20 bg-[#11111E] border border-white/[0.06] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500/50 resize-none"
                      value={newLeader.vision}
                      onChange={(e) => setNewLeader({ ...newLeader, vision: e.target.value })}
                      placeholder="Testimonial of their spiritual vision statement."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-xs font-bold transition-all text-gray-400"
                  >
                    {t('cancel') || 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/10"
                  >
                    {t('addServant') || 'Add Servant'}
                  </button>
                </div>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Dynamic Grid / Cards Container */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredList.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center bg-white/[0.01] border border-dashed border-white/[0.05] rounded-3xl"
              >
                <div className="text-4xl text-gray-600 mb-3 block">✝</div>
                <p className="text-sm text-gray-400 italic">
                  {t('noLeaders') || 'No leadership records registered for this section yet.'}
                </p>
                {isAdmin && (
                  <p className="text-xs text-amber-500/70 mt-2 font-mono">
                    {t('clickAdd') || 'Click "Add Servant" button to index your first member.'}
                  </p>
                )}
              </motion.div>
            ) : (
              filteredList.map((leader, i) => {
                const isFounder = activeCategory === 'founders';
                
                // Choose the text values based on active preferred language
                const roleText = (lang === 'am' && leader.amharicRole) 
                  ? leader.amharicRole 
                  : (lang === 'om' && leader.oromoRole)
                  ? leader.oromoRole
                  : leader.role;

                const descText = (lang === 'am' && leader.amharicDesc)
                  ? leader.amharicDesc
                  : (lang === 'om' && leader.oromoDesc)
                  ? leader.oromoDesc
                  : leader.description;

                const visionText = (lang === 'am' && leader.amharicVision)
                  ? leader.amharicVision
                  : (lang === 'om' && leader.oromoVision)
                  ? leader.oromoVision
                  : leader.vision;

                return (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="relative bg-white/[0.02] border border-white/[0.04] rounded-3xl overflow-hidden group hover:bg-white/[0.03] hover:border-violet-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Interactive visual anchor block with photo */}
                      <div className="relative aspect-square overflow-hidden bg-white/[0.01]">
                        <img 
                          src={leader.photo || APPROACHABLE_AVATARS[0].url} 
                          alt={leader.name} 
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* Shimmer gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07070F] via-[#07070F]/50 to-transparent opacity-80" />
                        
                        {/* Label Badge */}
                        <span className="absolute top-4 left-4 inline-block px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
                          {isFounder ? t('pioneerBadge') || 'CHURCH PIONEER' : t('elderBadge') || 'CLERGY ELDER'}
                        </span>

                        {/* Name panel overlay on portrait bottom */}
                        <div className="absolute bottom-4 left-4 right-4 space-y-1">
                          <h3 className="text-xl font-black text-white leading-tight font-sans tracking-tight drop-shadow-md">
                            {leader.name}
                          </h3>
                          <p className="text-xs text-amber-400 font-bold font-mono tracking-wide">
                            {roleText}
                          </p>
                        </div>
                      </div>

                      {/* Card Content Description & details */}
                      <div className="p-6 space-y-4">
                        {descText ? (
                          <p className="text-xs text-gray-400 leading-relaxed font-sans mt-1">
                            {descText}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500 italic">{t('noDescription') || 'No description filled.'}</p>
                        )}

                        {/* Contact details */}
                        <div className="pt-3.5 border-t border-white/[0.04] space-y-2 text-xs font-mono text-gray-500">
                          <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                            <Phone className="w-3.5 h-3.5 text-violet-500/70" />
                            <span>{leader.phone || '+1 (555) 019-2000'}</span>
                          </div>
                          <div className="flex items-center gap-2.5 hover:text-white transition-colors">
                            <Mail className="w-3.5 h-3.5 text-violet-500/70" />
                            <span className="truncate">{leader.email || 'info@sanctuary.org'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Vision testimonial toggle */}
                    <div className="p-6 pt-0 flex gap-2 w-full justify-between items-center mt-auto">
                      <button
                        onClick={() => setActiveVisionLeader(leader)}
                        className="py-2.5 px-4 bg-white/[0.04] border border-white/[0.06] hover:bg-violet-600/15 hover:border-violet-500/40 rounded-xl text-xs font-bold text-violet-300 transition-all flex items-center gap-2 cursor-pointer flex-grow justify-center"
                      >
                        <Heart className="w-3.5 h-3.5 text-violet-400 fill-current" />
                        <span>{t('viewVision') || 'View Vision Statement'}</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteLeaderAction(leader.id, leader.name)}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center justify-center border border-rose-500/20"
                          title="Purge official member record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </section>

      </main>

{/* Modern Dialog/Modal for Personal Vision Details */}
<AnimatePresence>
  {activeVisionLeader && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setActiveVisionLeader(null)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      {/* Modal Body */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-[#09090F] border border-white/[0.06] rounded-3xl max-w-lg w-full overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl z-10"
      >
        <div className="flex items-center gap-4 border-b border-white/[0.04] pb-4">
          <img 
            src={activeVisionLeader.photo || APPROACHABLE_AVATARS[0].url} 
            alt={activeVisionLeader.name} 
            className="w-14 h-14 rounded-2xl object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-lg font-black text-white">{activeVisionLeader.name}</h4>
            <p className="text-xs text-amber-500 font-bold font-mono">
              {/* 👇 FIX: Define roleText here instead of using undefined variable */}
              {lang === 'am' && activeVisionLeader.amharicRole 
                ? activeVisionLeader.amharicRole 
                : lang === 'om' && activeVisionLeader.oromoRole
                ? activeVisionLeader.oromoRole
                : activeVisionLeader.role}
            </p>
          </div>
        </div>

        {/* Multi-language vision display */}
        <div className="relative p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03] space-y-3">
          <Quote className="absolute top-3 right-3 w-10 h-10 text-violet-500/10" />
          <span className="block text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold">
            {t('visionTitle') || 'SHEPHERD GENERAL VISION'}
          </span>
          
          <p className="text-sm font-sans text-white font-normal leading-relaxed italic pr-4">
            "{lang === 'am' && activeVisionLeader.amharicVision 
              ? activeVisionLeader.amharicVision 
              : lang === 'om' && activeVisionLeader.oromoVision
              ? activeVisionLeader.oromoVision
              : activeVisionLeader.vision}"
          </p>

          {/* English fallback if viewing amharic/oromo and not exists */}
          {lang !== 'en' && !(lang === 'am' && activeVisionLeader.amharicVision) && !(lang === 'om' && activeVisionLeader.oromoVision) && (
            <p className="text-xs font-sans text-gray-500 leading-relaxed pt-2">
              Fallback: "{activeVisionLeader.vision}"
            </p>
          )}
        </div>

        {/* Contact direct call controls */}
        <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
          <a 
            href={`tel:${activeVisionLeader.phone || '+15550192000'}`}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-violet-600/10 text-gray-300 hover:text-white transition-all text-center"
          >
            <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
            <span>{t('callOfficer') || 'Call Officer'}</span>
          </a>
          <a 
            href={`mailto:${activeVisionLeader.email || 'office@sanctuary.org'}`}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-violet-600/10 text-gray-300 hover:text-white transition-all text-center"
          >
            <MailCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>{t('sendEmail') || 'Send Email'}</span>
          </a>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setActiveVisionLeader(null)}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl transition-all w-full cursor-pointer"
          >
            {t('closeVision') || 'Close Vision Pane'}
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      {/* Administrator Authentication Modal */}
      <AnimatePresence>
        {showAdminAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminAuthModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#09090F] border border-white/[0.06] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl z-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-violet-400" />
                </div>
                <h4 className="text-xl font-black text-white">{t('adminAccess') || 'Administrator Access'}</h4>
                <p className="text-xs text-gray-400 mt-1">{t('adminAccessDesc') || 'Unlock the ability to catalog pioneers, elders, and leaders.'}</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">{t('adminUsername') || 'Username'}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. admin"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1.5 font-bold">{t('adminPassword') || 'Password'}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="password"
                      className="w-full bg-[#11111E] border border-white/[0.06] rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500/50"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs py-3.5 px-6 rounded-xl w-full flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer mt-2"
                >
                  <span>{t('authenticate') || 'Authenticate Secure Chain'}</span>
                </button>
              </form>

              <div className="pt-4 border-t border-white/[0.04] text-center">
                <span className="text-[10px] text-gray-500 font-mono">
                  {t('defaultCredentials') || 'Default credentials:'} <span className="text-amber-500 font-bold">admin</span> / <span className="text-violet-400 font-bold">church123</span>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 pt-12 mt-16 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500 z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
          <span>Sanctuary OS Clergy Node is synchronizing correctly.</span>
        </div>
        <div>
          <p>© 2026 Ancient Paths Grace Sanctuary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}