import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTranslation } from '../translations';
import { 
  Mail, Phone, MapPin, Calendar, Compass, 
  Send, Sparkles, AlertCircle, CheckCircle, 
  Bookmark, Flame, Globe, ArrowRight, Heart,
  Users, MessageSquare, Plus, Clock, HelpCircle
} from 'lucide-react';

// ============================================================
// CONTACT INFO DATA
// ============================================================
const CONTACT_INFO = [
  {
    icon: MapPin,
    labelKey: 'contactAddress',
    defaultLabel: 'Sanctuary Address',
    value: 'Bole Road, Addis Ababa, Ethiopia',
  },
  {
    icon: Phone,
    labelKey: 'contactPhone',
    defaultLabel: 'Prayer Hotline',
    value: '+251 (0) 11 123 4567',
  },
  {
    icon: Mail,
    labelKey: 'contactEmail',
    defaultLabel: 'Sanctuary Email',
    value: 'info@ourchurch.et',
  },
];

const SERVICE_TIMES = [
  { dayKey: 'sunday', defaultDay: 'Sunday Worship', time: '9:00 AM & 11:00 AM' },
  { dayKey: 'wednesday', defaultDay: 'Wednesday Bible Study', time: '7:00 PM' },
  { dayKey: 'friday', defaultDay: 'Friday Prayer Meeting', time: '6:30 PM' },
];

// Sample prayer requests
const PRESET_PRAYERS = [
  {
    id: 'seed-1',
    name: 'Brother Yohannes',
    subject: 'visit',
    message: 'Requesting prayers for my upcoming missionary journey to the southern regions. May God clear path and prepare hearts.',
    isPublic: true,
    candles: 8,
    date: '2026-06-18'
  },
  {
    id: 'seed-2',
    name: 'Sister Selamawit',
    subject: 'prayer',
    message: 'Praying for healing and strength for my family. We trust God\'s promise of restored health and absolute peace.',
    isPublic: true,
    candles: 14,
    date: '2026-06-19'
  }
];

export default function Contact() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', isPublic: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focused, setFocused] = useState(null);
  const [prayers, setPrayers] = useState(() => {
    const saved = localStorage.getItem('church_prayer_wall');
    return saved ? JSON.parse(saved) : PRESET_PRAYERS;
  });

  const containerRef = useRef(null);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('church_prayer_wall', JSON.stringify(prayers));
  }, [prayers]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const t = (key) => getTranslation(lang, key);

  // Listen for language changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
      return;
    }

    setSubmitting(true);
    
    setTimeout(() => {
      const isPublicRequest = formData.isPublic;
      
      if (isPublicRequest) {
        const newPrayer = {
          id: Date.now().toString(),
          name: formData.name.trim(),
          subject: formData.subject || 'general',
          message: formData.message.trim(),
          isPublic: true,
          candles: 1,
          date: new Date().toISOString().split('T')[0]
        };
        setPrayers(prev => [newPrayer, ...prev]);
      }

      setFormData({ name: '', email: '', subject: '', message: '', isPublic: false });
      setSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 4500);
    }, 1200);
  };

  const setField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleLightCandle = (id) => {
    setPrayers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, candles: p.candles + 1 };
      }
      return p;
    }));
  };

  const getSubjectBadge = (subject) => {
    const categories = {
      general: { label: 'General Inquiry', style: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
      prayer: { label: 'Prayer Request', style: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
      visit: { label: 'Planning Visit', style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
      ministry: { label: 'Ministry & Serving', style: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
      giving: { label: 'Giving & Devotion', style: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
    };
    return categories[subject] || { label: 'General', style: 'bg-gray-500/10 text-gray-300 border-gray-500/20' };
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#07070F] text-white flex flex-col justify-between font-sans selection:bg-purple-600/30 selection:text-white pb-12 relative overflow-hidden"
    >
      {/* Spotlight effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 duration-200 transition-opacity"
        style={{
          background: `radial-gradient(1000px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(139, 92, 246, 0.05), transparent 80%)`
        }}
      />

      {/* Background orbs */}
      <div className="absolute top-[20%] right-[10%] w-[350px] sm:w-[500px] h-[350px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[30%] left-[5%] w-[400px] sm:w-[550px] h-[400px] rounded-full bg-amber-500/5 blur-[140px] pointer-events-none z-0" />

      {/* ── HERO HEADER ── */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-6 z-10">
        <div className="flex justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-widest uppercase font-black"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{t('addisAbaba') || 'Addis Ababa · Ethiopia'}</span>
          </motion.span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-3xl mx-auto drop-shadow-2xl">
          {t('contactGetIn') || 'Get in'}{' '}
          <span className="bg-gradient-to-r from-violet-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent font-medium italic">
            {t('contactTouch') || 'Touch'}
          </span>
        </h1>

        <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {t('contactHeroDesc') || "We'd love to hear from you — whether it's a question, a prayer need, or simply wanting to learn more about our faith community."}
        </p>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="relative w-full max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 z-10">
        
        {/* LEFT COLUMN: CONTACT INFO */}
        <section className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-600 via-amber-500 to-indigo-600" />
            
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500/80 font-bold block mb-1">
                Direct Channels
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                {t('contactInfoTitle') || 'Contact Information'}
              </h2>
            </div>

            <div className="space-y-6">
              {CONTACT_INFO.map((item, idx) => {
                const ContactIcon = item.icon;
                const label = t(item.labelKey) || item.defaultLabel;
                return (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/15 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shrink-0">
                      <ContactIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500/70">{label}</p>
                      <p className="text-gray-200 text-sm sm:text-base font-semibold mt-0.5">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-px bg-white/[0.05]" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-violet-400">
                <Clock className="w-4 h-4" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold">
                  {t('contactServiceTimes') || 'Service Times'}
                </h3>
              </div>
              
              <div className="space-y-2.5">
                {SERVICE_TIMES.map((srv, idx) => {
                  const day = t(srv.dayKey) || srv.defaultDay;
                  return (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] px-4 py-3 rounded-xl transition-all">
                      <span className="text-xs text-gray-400 font-medium">{day}</span>
                      <span className="text-xs font-mono font-black text-amber-500">{srv.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-white/[0.05]" />

            <div className="space-y-3">
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">
                {t('contactFollowUs') || 'Follow Us'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Facebook', 'YouTube', 'Telegram', 'Instagram'].map((name, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.02] hover:bg-violet-600 border border-white/[0.04] hover:border-violet-600 text-xs text-gray-300 hover:text-white font-medium transition-all duration-300"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Scripture Quote */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-900/10 to-indigo-900/10 border border-white/[0.03] space-y-4 relative">
            <Flame className="w-8 h-8 text-amber-500/30 absolute right-6 top-6" />
            <p className="text-sm italic text-gray-400 leading-relaxed">
              "For where two or three gather in my name, there am I with them."
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-violet-400/80 font-bold">— Matthew 18:20</p>
          </div>
        </section>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <section className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-violet-600 to-amber-500" />
            
            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold block mb-1">
              Connect With Us
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mb-4">
              {t('contactSendMessage') || 'Send a Message'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-8">
              Fill out the form below to reach our ministry team. Fields with <span className="text-red-500 font-bold">*</span> are required.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                    {t('contactFullName') || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="Your name"
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/[0.02] border py-3 px-4 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#0C0C16] transition-all duration-300 ${
                      focused === 'name' ? 'border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-white/[0.06]'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                    {t('contactEmail') || 'Email Address'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="name@example.com"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-white/[0.02] border py-3 px-4 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-[#0C0C16] transition-all duration-300 ${
                      focused === 'email' ? 'border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-white/[0.06]'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                  {t('contactSubject') || 'Subject'}
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setField('subject', e.target.value)}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    className={`w-full bg-[#090911]/90 border py-3 px-4 rounded-xl text-sm text-gray-300 appearance-none focus:outline-none focus:bg-[#0C0C16] transition-all duration-300 ${
                      focused === 'subject' ? 'border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-white/[0.06]'
                    }`}
                  >
                    <option value="">{t('contactSelectTopic') || 'Select a topic…'}</option>
                    <option value="general">{t('contactGeneral') || 'General Enquiry'}</option>
                    <option value="prayer">{t('contactPrayer') || 'Prayer Request'}</option>
                    <option value="visit">{t('contactVisit') || 'Planning a Visit'}</option>
                    <option value="ministry">{t('contactMinistry') || 'Ministry & Volunteering'}</option>
                    <option value="giving">{t('contactGiving') || 'Giving & Donations'}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-violet-400">
                    <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="message" className="block text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                    {t('contactMessage') || 'Message / Prayer Request'} <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {formData.message.length} / 600
                  </span>
                </div>
                <textarea
                  id="message"
                  required
                  rows={4}
                  maxLength={600}
                  value={formData.message}
                  onChange={(e) => setField('message', e.target.value)}
                  placeholder={t('contactMessagePlaceholder') || 'How can our community support or pray for you?'}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  className={`w-full bg-white/[0.02] border py-3 px-4 rounded-xl text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:bg-[#0C0C16] transition-all duration-300 ${
                    focused === 'message' ? 'border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'border-white/[0.06]'
                  }`}
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] flex items-start gap-3">
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setField('isPublic', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber-500 text-black cursor-pointer border-white/[0.1] rounded bg-white/5"
                />
                <div>
                  <label htmlFor="isPublic" className="block text-xs font-bold text-gray-200 select-none cursor-pointer">
                    Publish this as a prayer request on the Prayer Wall
                  </label>
                  <span className="block text-[11px] text-gray-400 leading-normal mt-0.5">
                    Others can see and pray for your request.
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium">
                      {t('contactSuccess') || 'Message sent! We will get back to you soon. 🙏'}
                    </p>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium">
                      {t('contactError') || 'Please fill out all required fields.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full h-12 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-violet-600/15 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('contactSendBtn') || 'Send Message'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ── PRAYER WALL SECTION ── */}
      <section className="relative w-full max-w-6xl mx-auto px-6 py-12 z-10 border-t border-white/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-1.5">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Prayer Wall</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-none">
              Congregational Prayer Requests
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-2xl mt-1.5">
              Click the candle button on any prayer request to join in prayer.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl text-center flex items-center gap-3">
            <Users className="w-4 h-4 text-violet-400" />
            <div className="text-left font-mono">
              <p className="text-[10px] text-gray-500 uppercase leading-none">Active Requests</p>
              <p className="text-xs font-extrabold text-white mt-0.5">{prayers.length} Live</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {prayers.map((prayer) => {
              const badge = getSubjectBadge(prayer.subject);
              return (
                <motion.div
                  key={prayer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="p-6 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.03] hover:border-violet-500/25 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-400 font-bold">
                        {prayer.name}
                      </span>
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-mono font-bold ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal italic">
                      "{prayer.message}"
                    </p>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-white/[0.03]">
                    <span className="text-[10px] font-mono text-gray-500 font-medium">
                      {prayer.date}
                    </span>
                    <button
                      onClick={() => handleLightCandle(prayer.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/25 text-amber-400 hover:text-amber-300 text-[10px] font-mono font-black tracking-wide transition-all duration-150 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                      <span>Amen ({prayer.candles})</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 pt-12 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500 z-10 mt-16">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Sanctuary intercession registry synchronized.</span>
        </div>
        <div>
          <p>© 2026 Our Church · All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}