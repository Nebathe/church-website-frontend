import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, CheckCircle2, Clock, Trash2, Plus, X,
  Send, Users, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, Flame, PlusCircle
} from 'lucide-react';
import { getTranslation } from '../translations';

export default function PrayerWall() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ name: '', request: '', isPublic: true });
  const [filter, setFilter] = useState('all');
  const [prayedIds, setPrayedIds] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const t = (key) => getTranslation(lang, key);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadPrayerRequests = () => {
    const saved = localStorage.getItem('church_prayer_requests');
    if (saved) {
      setPrayerRequests(JSON.parse(saved));
    } else {
      const sample = [
        {
          id: 1718816226000,
          name: 'The Clergy Assembly',
          request: 'Praying for structural unity, our upcoming global covenant assembly, and spiritual revitalization in our local household cells as they study historical Gospels.',
          isPublic: true,
          prayerCount: 24,
          status: 'pending',
          date: '06/19/2026',
          createdAt: new Date().toISOString(),
        },
        {
          id: 1718816227000,
          name: 'Sister Martha G.',
          request: 'Clinical breakthrough: Giving glory to Yahweh for complete healing from pulmonary ailments after the joint intercession last Sunday!',
          isPublic: true,
          prayerCount: 78,
          status: 'answered',
          date: '06/18/2026',
          createdAt: new Date().toISOString(),
        }
      ];
      setPrayerRequests(sample);
      localStorage.setItem('church_prayer_requests', JSON.stringify(sample));
    }
  };

  useEffect(() => {
    loadPrayerRequests();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.request.trim()) return;

    const item = {
      id: Date.now(),
      name: newRequest.name.trim() || t('prayerAnonymous') || 'Anonymous',
      request: newRequest.request.trim(),
      isPublic: newRequest.isPublic,
      prayerCount: 0,
      status: 'pending',
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };

    const updated = [item, ...prayerRequests];
    setPrayerRequests(updated);
    localStorage.setItem('church_prayer_requests', JSON.stringify(updated));
    setNewRequest({ name: '', request: '', isPublic: true });
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  const handlePray = (id) => {
    if (prayedIds.has(id)) return;
    
    const updatedSet = new Set(prayedIds);
    updatedSet.add(id);
    setPrayedIds(updatedSet);

    const updatedList = prayerRequests.map(r => {
      if (r.id === id) {
        return { 
          ...r, 
          prayerCount: (r.prayerCount || 0) + 1,
          status: r.status === 'answered' ? 'answered' : 'pending'
        };
      }
      return r;
    });

    setPrayerRequests(updatedList);
    localStorage.setItem('church_prayer_requests', JSON.stringify(updatedList));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (token !== 'admin-token-123') {
      alert(t('prayerAdminRequired') || 'Admin login required.');
      return;
    }
    if (!window.confirm(t('prayerDeleteConfirm') || 'Delete this prayer request?')) return;

    const updated = prayerRequests.filter(r => r.id !== id);
    setPrayerRequests(updated);
    localStorage.setItem('church_prayer_requests', JSON.stringify(updated));
  };

  const handleToggleAnswered = (id) => {
    const token = localStorage.getItem('token');
    if (token !== 'admin-token-123') {
      alert(t('prayerAdminRequired') || 'Admin login required.');
      return;
    }

    const updatedList = prayerRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === 'answered' ? 'pending' : 'answered'
        };
      }
      return r;
    });

    setPrayerRequests(updatedList);
    localStorage.setItem('church_prayer_requests', JSON.stringify(updatedList));
  };

  const filtered = prayerRequests.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'answered') return r.status === 'answered';
    return true;
  });

  const tabs = [
    { key: 'all', label: t('prayerAll') || 'All', count: prayerRequests.length },
    { key: 'pending', label: t('prayerPending') || 'Pending', count: prayerRequests.filter(r => r.status === 'pending').length },
    { key: 'answered', label: t('prayerAnswered') || 'Answered', count: prayerRequests.filter(r => r.status === 'answered').length },
  ];

  return (
    <main 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#07070F] text-gray-100 overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      <div 
        className="absolute pointer-events-none rounded-full blur-[130px] opacity-[0.22] transition-all duration-300"
        style={{
          width: '500px',
          height: '500px',
          left: `${coords.x - 250}px`,
          top: `${coords.y - 250}px`,
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(249,115,22,0.05) 100%)',
        }}
      />

      <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.012] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* ══ HERO ══ */}
        <section className="text-center max-w-3xl mx-auto mb-14 mt-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wider uppercase mb-5"
          >
            <Heart className="w-3.5 h-3.5 text-orange-400 animate-pulse fill-current" />
            <span>{t('prayerHeroBadge') || 'United in Prayer'}</span>
          </motion.div>

          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 font-sans"
          >
            {t('prayerWallTitle') || 'Prayer Wall'}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans mb-10"
          >
            {t('prayerHeroDesc') || 'Share your prayer requests and intercede for one another — where two or three gather, He is present.'}
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 max-w-xl mx-auto gap-4 p-4 rounded-2xl bg-[#090912]/80 border border-white/[0.04] mb-10"
          >
            {[
              { label: t('prayerStatsRequests') || 'Requests', value: prayerRequests.length, color: 'text-violet-400' },
              { label: t('prayerStatsPrayers') || 'Prayers', value: prayerRequests.reduce((sum, r) => sum + (r.prayerCount || 0), 0), color: 'text-rose-400' },
              { label: t('prayerStatsAnswered') || 'Answered', value: prayerRequests.filter(r => r.status === 'answered').length, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className={`text-2xl sm:text-3xl font-light tracking-tight block ${stat.color} font-mono`}>
                  {stat.value}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer ${
              showForm 
                ? 'bg-white/[0.04] text-gray-300 border border-white/[0.1] hover:bg-white/[0.08]' 
                : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20'
            }`}
          >
            {showForm ? (
              <>
                <X className="w-4 h-4 text-rose-400" />
                <span>{t('cancel') || 'Cancel'}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-white" />
                <span>{t('prayerSubmit') || 'Submit Prayer Request'}</span>
              </>
            )}
          </motion.button>
        </section>

        {/* ══ FORM ══ */}
        <AnimatePresence>
          {showForm && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-gradient-to-br from-[#0F0D24]/80 to-[#0A0914]/90 border border-orange-500/15 p-6 sm:p-8 rounded-[24px] shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

                <h3 className="text-xl font-light text-white tracking-tight flex items-center gap-2 mb-2 font-sans">
                  <PlusCircle className="w-5 h-5 text-orange-400" />
                  <span>{t('prayerFormTitle') || 'Share Your Request'}</span>
                </h3>
                
                <p className="text-xs text-gray-450 leading-relaxed max-w-xl mb-6 font-sans">
                  {t('prayerFormDesc') || 'Your request will be seen and prayed over by our church family.'}
                </p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="thanks-message"
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0 }}
                      className="text-center py-10 bg-orange-500/5 border border-orange-500/20 rounded-2xl"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }} 
                        transition={{ duration: 0.5 }}
                        className="text-orange-400 flex justify-center mb-3 text-2xl"
                      >
                        <CheckCircle2 className="w-10 h-10 animate-bounce" />
                      </motion.div>
                      <p className="text-white font-bold text-base">{t('prayerSubmitted') || 'Prayer Request Submitted!'}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('prayerSubmittedDesc') || 'Our church family will pray for you.'}</p>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="active-form" 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          {t('prayerName') || 'Your Name (optional)'}
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. Brother Thomas"
                          value={newRequest.name}
                          onChange={e => setNewRequest({ ...newRequest, name: e.target.value })}
                          maxLength={32}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          {t('prayerRequestPlaceholder') || 'What would you like prayer for?'}
                        </label>
                        <textarea 
                          rows={4} 
                          required
                          placeholder={t('prayerRequestPlaceholder') || 'What would you like prayer for?'}
                          value={newRequest.request}
                          onChange={e => setNewRequest({ ...newRequest, request: e.target.value })}
                          maxLength={350}
                          className="w-full bg-[#07070F] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all resize-none font-sans"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:opacity-95 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-98 transition-all shadow-md shadow-orange-500/10"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('prayerSubmitBtn') || 'Submit Prayer Request'}</span>
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ══ PRAYER WALL GALLERY ══ */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1 bg-[#090912]/80 border border-white/[0.05] rounded-xl max-w-md mx-auto">
            {tabs.map(tab => (
              <button 
                key={tab.key} 
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-2 rounded-lg text-[11px] sm:text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === tab.key 
                    ? 'bg-gradient-to-r from-orange-600/90 to-amber-500/90 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  filter === tab.key ? 'bg-black/30 text-white' : 'bg-white/5 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="prayer-empty-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 px-6 bg-[#080812]/50 border border-white/[0.04] rounded-[24px]"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/10">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 font-sans">
                  {t('prayerNone') || 'No Prayer Requests Yet'}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {t('prayerEmptyDesc') || 'Be the first to share — your church family is here to pray with you.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="prayer-active-wall"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filtered.map((req, idx) => {
                  const hasPrayed = prayedIds.has(req.id);
                  const isAnswered = req.status === 'answered';
                  const hasToken = localStorage.getItem('token') === 'admin-token-123';

                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -3 }}
                      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 ${
                        isAnswered 
                          ? 'bg-[#0E1513]/90 border border-emerald-500/20 shadow-lg shadow-emerald-900/5' 
                          : 'bg-[#090914]/90 border border-white/[0.05] hover:bg-[#0C0C1C] hover:border-white/[0.08]'
                      }`}
                    >
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${
                        isAnswered 
                          ? 'bg-gradient-to-b from-emerald-500 to-teal-400' 
                          : 'bg-gradient-to-b from-orange-500 to-amber-400'
                      }`} />

                      <div className="pl-6 pr-5 py-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[10px] text-gray-500 font-mono font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-600" />
                              <span>{req.date}</span>
                            </span>
                            
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isAnswered 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
                            }`}>
                              {isAnswered ? (t('prayerAnswered') || 'Answered') : (t('prayerPending') || 'Praying')}
                            </span>
                          </div>

                          <p className="text-gray-200 text-sm leading-relaxed tracking-wide font-light mb-4 font-sans text-left">
                            "{req.request}"
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-3 mt-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] text-orange-400 font-bold shrink-0">
                              {req.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-400 font-sans font-medium max-w-[120px] truncate">
                              {req.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {hasToken && (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleToggleAnswered(req.id)}
                                  className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                                    isAnswered 
                                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'
                                  }`}
                                  title="Toggle Answer Status"
                                >
                                  {isAnswered ? "Burden" : "Answer!"}
                                </button>
                                <button 
                                  onClick={() => handleDelete(req.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 hover:text-white text-rose-400 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <motion.button
                              onClick={() => handlePray(req.id)}
                              whileTap={{ scale: 0.94 }}
                              disabled={hasPrayed}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                                hasPrayed 
                                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.06]'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-current text-orange-400' : 'text-orange-500'}`} />
                              <span>{hasPrayed ? (t('prayerPrayed') || 'Prayed!') : (t('prayerIPrayed') || 'I Prayed')}</span>
                              <span className="px-1 py-0.2 bg-black/40 rounded text-[10px] font-mono text-gray-400 font-medium">
                                {req.prayerCount || 0}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {prayerRequests.length > 0 && (
            <p className="text-center text-xs text-gray-500 font-mono mt-10">
              {filtered.length} of {prayerRequests.length} request(s) shown.
            </p>
          )}
        </section>

        {/* ══ SCRIPTURE ══ */}
        <section className="mt-20 border-t border-white/[0.04] pt-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] blur-xl bg-gradient-to-r from-orange-500 via-amber-500 to-violet-500" />
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="max-w-2xl mx-auto position-relative z-10"
          >
            <blockquote className="text-lg text-gray-300 font-serif italic leading-relaxed mb-4">
              {t('prayerScripture') || '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."'}
            </blockquote>
            <cite className="text-sm font-bold tracking-wider text-orange-400 font-mono block not-italic uppercase">
              — {t('prayerScriptureRef') || 'Philippians 4:6'} —
            </cite>
          </motion.div>
        </section>

      </div>
    </main>
  );
}