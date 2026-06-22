import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, CalendarDays, Search, ChevronRight, 
  Sparkles, Flame, Users, Plus, Trash2, Send, AlertCircle, 
  CheckCircle, Shield, Bell, HelpCircle, ArrowRight, Heart,
  X, Info
} from 'lucide-react';
import { getEvents, addEvent, deleteEvent } from '../services/localStorageService';
import { getTranslation } from '../translations';

export default function Events() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const [isAttendingMap, setIsAttendingMap] = useState({});
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Admin state
  const [adminOpen, setAdminOpen] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const containerRef = useRef(null);
  const [spotlightCoords, setSpotlightCoords] = useState({ x: 0, y: 0 });

  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    const load = () => {
      setEvents(getEvents());
      const savedRSVPs = localStorage.getItem('church_event_rsvps');
      if (savedRSVPs) {
        setIsAttendingMap(JSON.parse(savedRSVPs));
      }
    };
    load();

    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
      setEvents(getEvents());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSpotlightCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleRSVP = (eventId) => {
    const updated = {
      ...isAttendingMap,
      [eventId]: !isAttendingMap[eventId]
    };
    setIsAttendingMap(updated);
    localStorage.setItem('church_event_rsvps', JSON.stringify(updated));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) return;
    setNewsletterSubscribed(true);
    setEmailInput('');
    setTimeout(() => {
      setNewsletterSubscribed(false);
    }, 5000);
  };

  const handleAddNewEvent = (e) => {
    e.preventDefault();
    if (passcode !== '1234' && passcode !== 'grace') {
      setErrorMessage("Invalid passcode. Use '1234' or 'grace'.");
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    if (!newTitle.trim() || !newDate || !newTime || !newLoc.trim()) {
      setErrorMessage("Please fill all required fields.");
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    const payload = {
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      location: newLoc.trim(),
      description: newDesc.trim() || "Join us for this gathering."
    };

    const updated = addEvent(payload);
    setEvents(updated);

    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewLoc('');
    setNewDesc('');
    setSuccessMessage("Event added successfully! ✨");
    setTimeout(() => {
      setSuccessMessage('');
      setAdminOpen(false);
    }, 2500);
  };

  const handleDeleteEventLocally = (id) => {
    if (confirm("Delete this event?")) {
      const updated = deleteEvent(id);
      setEvents(updated);
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase()) ||
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  const accentGradients = [
    'from-violet-600 via-purple-500 to-indigo-600',
    'from-amber-500 via-orange-400 to-amber-600',
    'from-emerald-500 via-teal-400 to-emerald-600',
    'from-blue-600 via-indigo-400 to-blue-500'
  ];

  const getNearestUpcomingEvent = () => {
    if (!events || events.length === 0) return null;
    const now = new Date();
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const upcoming = sorted.find(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(23, 59, 59, 999);
      return eventDate >= now;
    });
    return upcoming || sorted[0];
  };

  const nearestEvent = getNearestUpcomingEvent();

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#07070F] text-white flex flex-col justify-between font-sans selection:bg-purple-600/30 selection:text-white pb-12 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 pointer-events-none z-0 duration-200 transition-opacity"
        style={{
          background: `radial-gradient(1100px circle at ${spotlightCoords.x}px ${spotlightCoords.y}px, rgba(139, 92, 246, 0.04), transparent 80%)`
        }}
      />

      <div className="absolute top-[15%] left-[5%] w-[380px] sm:w-[500px] h-[380px] rounded-full bg-violet-600/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] right-[10%] w-[450px] sm:w-[600px] h-[450px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none z-0" />

      {/* ── HERO ── */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-8 text-center space-y-6 z-10">
        <div className="flex justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-mono tracking-widest uppercase font-black"
          >
            <CalendarDays className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
            <span>{t('eventsBadge') || 'Upcoming Events'}</span>
          </motion.span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto drop-shadow-2xl">
          {t('eventsTitle') || 'Upcoming Events'}
        </h1>

        <p className="text-gray-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {t('eventsDesc') || 'Come as you are — worship, connect, and grow with our church family.'}
        </p>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => setAdminOpen(true)}
            className="inline-flex items-center gap-2 bg-white/[0.02] hover:bg-violet-600/20 border border-white/[0.05] hover:border-violet-500/30 px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-widest text-amber-500 transition-all duration-300 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('adminToggleName') || 'Clergy Administration'}</span>
          </button>
        </div>
      </header>

      {/* ── COUNTDOWN / NEAREST EVENT ── */}
      {nearestEvent && (
        <section className="relative w-full max-w-5xl mx-auto px-6 mb-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-900/10 to-indigo-900/10 border border-violet-500/20 backdrop-blur-3xl overflow-hidden relative"
          >
            <Flame className="w-24 h-24 text-amber-500/5 absolute -right-6 -bottom-6 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-mono font-black uppercase tracking-wider">
                    {t('eventsNext') || 'Next Assembly'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {nearestEvent.date} · {nearestEvent.time}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {nearestEvent.title}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                  {nearestEvent.description || "Join us for this gathering."}
                </p>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end shrink-0">
                <button
                  onClick={() => handleRSVP(nearestEvent.id)}
                  className={`px-6 py-3 w-full lg:w-auto rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isAttendingMap[nearestEvent.id]
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gradient-to-r from-amber-500 to-violet-600 text-white hover:from-amber-400 hover:to-violet-500 shadow-lg shadow-amber-500/15'
                  }`}
                >
                  <CheckCircle className={`w-4 h-4 ${isAttendingMap[nearestEvent.id] ? 'text-emerald-400' : 'text-white'}`} />
                  <span>
                    {isAttendingMap[nearestEvent.id] ? (t('rsvpActive') || 'Attending') : (t('rsvpBtn') || 'RSVP')}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── SEARCH ── */}
      <section className="relative w-full max-w-xl mx-auto px-6 mb-12 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400/70" />
          <input
            type="text"
            placeholder={t('eventsSearch') || 'Search events or locations…'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0B13]/85 border border-white/[0.06] hover:border-violet-500/30 focus:border-violet-500 focus:outline-none py-3.5 pl-12 pr-4 rounded-2xl text-sm placeholder-gray-500 focus:bg-[#0C0C16] text-white transition-all duration-300 shadow-xl shadow-black/80"
          />
        </div>
      </section>

      {/* ── EVENTS LIST ── */}
      <main className="relative w-full max-w-5xl mx-auto px-6 z-10">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16 px-4 bg-white/[0.01] border border-white/[0.03] rounded-3xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-4">
                <CalendarDays className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {search ? (t('eventsNoResults') || 'No Results Found') : (t('eventsNone') || 'No Events Scheduled')}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-md mx-auto leading-relaxed">
                {search ? (t('eventsTryDifferent') || 'Try a different search term.') : (t('eventsCheckBack') || 'Check back soon — new events will appear here.')}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              className="space-y-6"
            >
              {filtered.map((item, idx) => {
                const gradientClass = accentGradients[idx % accentGradients.length];
                const activeDescription = item.description || "Join us for this gathering.";
                const isAttendee = isAttendingMap[item.id];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-3xl bg-white/[0.01] hover:bg-[#0C0C16] border border-white/[0.04] hover:border-violet-500/20 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b ${gradientClass}`} />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3.5 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${gradientClass} animate-pulse`} />
                          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-wider">
                            {t('eventsEvent') || 'Event'} #{String(item.id).slice(-4)}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            | {item.date}
                          </span>
                        </div>

                        <h3 
                          onClick={() => setActive(active === item.id ? null : item.id)}
                          className="text-lg sm:text-xl font-bold text-white hover:text-violet-300 transition-colors cursor-pointer"
                        >
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            <span>{item.time}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-medium">{item.location}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                        <button
                          onClick={() => handleRSVP(item.id)}
                          className={`px-4.5 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer ${
                            isAttendee
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              : 'bg-white/[0.02] hover:bg-violet-600 border border-white/[0.05] hover:border-violet-600 text-gray-300 hover:text-white'
                          }`}
                        >
                          {isAttendee ? (t('rsvpActive') || 'Attending 🙏') : (t('rsvpBtn') || 'RSVP')}
                        </button>

                        <button
                          onClick={() => setActive(active === item.id ? null : item.id)}
                          className="w-10 h-10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                        >
                          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${active === item.id ? 'rotate-90 text-amber-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleDeleteEventLocally(item.id)}
                          className="w-10 h-10 rounded-xl bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 flex items-center justify-center text-red-400 transition-all cursor-pointer"
                          title={t('eventsDelete') || 'Delete event'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {active === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-5 border-t border-white/[0.03] space-y-3">
                            <h4 className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold block">
                              {t('eventsDetails') || 'Event Details'}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                              {activeDescription}
                            </p>
                            
                            {isAttendee && (
                              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-2.5 text-emerald-400 text-xs font-mono">
                                <Sparkles className="w-4 h-4 animate-spin-slow" />
                                <span>{t('rsvpSuccess') || 'You are attending this event! 🙏'}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {events.length > 0 && (
          <p className="text-center font-mono text-[10px] text-gray-500 mt-12 uppercase tracking-widest">
            {t('eventsShowing') || 'Showing'} {filtered.length} {t('eventsOf') || 'of'} {events.length} {t('eventsCount') || 'events'}
          </p>
        )}
      </main>

      {/* ── NEWSLETTER ── */}
      <section className="relative w-full max-w-5xl mx-auto px-6 mt-16 pb-6 z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-900/15 to-indigo-900/15 border border-white/[0.03] text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

          <div className="flex justify-center text-amber-500">
            <Bell className="w-8 h-8 animate-pulse text-amber-500" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('eventsNeverMiss') || 'Never Miss an Event'}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            {t('eventsSubscribeDesc') || 'Subscribe to our newsletter and get event reminders straight to your inbox.'}
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              className="flex-grow bg-[#0c0c16] border border-white/[0.08] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs sm:text-sm text-white"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-violet-600/20 cursor-pointer"
            >
              {t('eventsSubscribeBtn') || 'Subscribe'}
            </button>
          </form>

          <AnimatePresence>
            {newsletterSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{t('eventsSubscribed') || 'Subscribed successfully! ✨'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── ADMIN MODAL ── */}
      <AnimatePresence>
        {adminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#030307]/90 backdrop-blur-md cursor-pointer"
              onClick={() => setAdminOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#090911] border border-white/[0.07] rounded-3xl w-full max-w-lg p-6 sm:p-8 relative z-10 shadow-2xl space-y-6"
            >
              <button
                onClick={() => setAdminOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.03]/80 hover:bg-white/[0.08] flex items-center justify-center border border-white/[0.05] text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-violet-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black leading-none">
                    {t('adminTitle') || 'Add Event'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white leading-tight">
                  {t('adminSub') || 'Add New Event'}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {t('adminSubDesc') || 'Add a new event to the church calendar.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5 text-[11px] text-amber-400 leading-normal">
                <Info className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <span>{t('adminDisclaimer') || 'This panel modifies the local event registry. Authenticated clergy only.'}</span>
              </div>

              <form onSubmit={handleAddNewEvent} className="space-y-4">
                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">
                    {t('labelTitle') || 'Event Title'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Youth Night"
                    className="bg-[#0c0c16] border border-white/[0.06] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">
                      {t('labelDate') || 'Date'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="bg-[#090911] border border-white/[0.06] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">
                      {t('labelTime') || 'Time'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="7:00 PM"
                      className="bg-[#0c0c16] border border-white/[0.06] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">
                    {t('labelLoc') || 'Location'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="Church Sanctuary"
                    className="bg-[#0c0c16] border border-white/[0.06] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wide font-black">
                    {t('labelDesc') || 'Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Event details..."
                    className="bg-[#0c0c16] border border-white/[0.06] focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white resize-none"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col pt-3 border-t border-white/[0.03]">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-black">
                      {t('enterPasscode') || 'Passcode'} <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[9px] text-gray-500 font-mono">(Hint: 1234)</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••"
                    className="bg-[#0C0C16] border border-violet-500/20 focus:border-violet-500 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-white tracking-widest text-center"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                  {successMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
                    >
                      <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
                      <span>{successMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-violet-600/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('addBtn') || 'Add Event'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative w-full max-w-5xl mx-auto px-6 pt-12 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500 z-10 mt-16">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>{t('eventsFooter') || 'Sanctuary calendar database active & synchronized.'}</span>
        </div>
        <div>
          <p>© 2026 Our Church · All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}