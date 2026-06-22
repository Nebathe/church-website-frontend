import React, { useState, useEffect } from 'react';
import { getSermons, addSermon, deleteSermon, getEvents, addEvent, deleteEvent, getPillars, savePillars } from '../services/localStorageService';
import { getTranslation } from '../translations';

function Admin() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  
  // DYNAMIC HOMEPAGE SECTIONS STATE
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [involvedItems, setInvolvedItems] = useState([]);
  const [pillars, setPillars] = useState([]);

  // NEW ENTRY MANAGEMENT FORM PAYLOADS
  const [newSermon, setNewSermon] = useState({ title: '', speaker: '', description: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '' });
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', author: '', highlight: '' });
  const [newInvolved, setNewInvolved] = useState({ title: '', description: '', link: '', linkText: '' });
  const [newService, setNewService] = useState({ dayKey: '', titleKey: '', time: '', desc: '' });

  const [activeTab, setActiveTab] = useState('overview');

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

  // Comprehensive fallback configuration loader
  const loadData = () => {
    const savedSermons = localStorage.getItem('church_sermons');
    const savedEvents = localStorage.getItem('church_events');
    setSermons(savedSermons ? JSON.parse(savedSermons) : []);
    setEvents(savedEvents ? JSON.parse(savedEvents) : []);

    // Load Pillars
    setPillars(getPillars());

    // Load or initialize Admin Controlled Testimonials
    const savedTestimonials = localStorage.getItem('church_testimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      const defaultTestimonials = [
        { id: '1', quote: "Finding this community changed my walk completely. I found answers to hard questions and genuine human relationships.", author: "Michael T.", highlight: "Explored Faith Since 2024" },
        { id: '2', quote: "The emphasis on bringing your hard copy Bible and taking interactive notes has transformed my Sunday discipline.", author: "Selamawit A.", highlight: "Small Group Leader" }
      ];
      localStorage.setItem('church_testimonials', JSON.stringify(defaultTestimonials));
      setTestimonials(defaultTestimonials);
    }

    // Load or initialize Admin Controlled Weekly Service Hours
    const savedServices = localStorage.getItem('church_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      const defaultServices = [
        { id: '1', dayKey: 'sunday', titleKey: 'sundayWorship', time: '9:00 AM & 11:00 AM', desc: 'Main corporate worship gathering.' },
        { id: '2', dayKey: 'wednesday', titleKey: 'wednesdayBible', time: '7:00 PM', desc: 'Deep systematic verse-by-verse teaching.' },
        { id: '3', dayKey: 'friday', titleKey: 'fridayPrayer', time: '6:30 PM', desc: 'Intercession, warfare prayer, and communion.' }
      ];
      localStorage.setItem('church_services', JSON.stringify(defaultServices));
      setServices(defaultServices);
    }

    // Load or initialize Ways to Get Involved 
    const savedInvolved = localStorage.getItem('church_involved');
    if (savedInvolved) {
      setInvolvedItems(JSON.parse(savedInvolved));
    } else {
      const defaultInvolved = [
        { id: '1', title: 'Join a Life Group', description: 'Small midweek home gatherings scattered across Addis Ababa for meal sharing, accountable fellowship, and deeper prayer execution.', link: '/groups', linkText: 'Find a Group Near Me →' },
        { id: '2', title: 'Volunteer Teams', description: 'Use your technical skill, hospitality gifts, media comprehension, or teaching passions to lift the corporate operational execution of the church.', link: '/serve', linkText: 'Explore Ministry Teams →' },
        { id: '3', title: 'Foundations Discipleship', description: 'A custom 6-week systematic class track clarifying biblical security, scriptural priority, and spiritual parameters for baptism readiness.', link: '/discipleship', linkText: 'Register for Next Intake →' }
      ];
      localStorage.setItem('church_involved', JSON.stringify(defaultInvolved));
      setInvolvedItems(defaultInvolved);
    }
  };

  useEffect(() => {
    loadData();
    const token = localStorage.getItem('token');
    if (token === 'admin-token-123') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'church123') {
      setIsLoggedIn(true);
      localStorage.setItem('token', 'admin-token-123');
      loadData();
    } else {
      alert(t('adminInvalid') || 'Invalid credentials. Use: admin / church123');
    }
  };

  const handleAddSermon = (e) => {
    e.preventDefault();
    const sermonPayload = {
      ...newSermon,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString()
    };
    addSermon(sermonPayload);
    setNewSermon({ title: '', speaker: '', description: '' });
    loadData();
  };

  const handleDeleteSermon = (id) => {
    if (confirm(t('adminDeleteConfirm') || 'Are you sure you want to delete this sermon?')) {
      deleteSermon(id);
      loadData();
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const eventPayload = { ...newEvent, id: Date.now().toString() };
    addEvent(eventPayload);
    setNewEvent({ title: '', date: '', time: '', location: '' });
    loadData();
  };

  const handleDeleteEvent = (id) => {
    if (confirm(t('adminDeleteEventConfirm') || 'Are you sure you want to delete this event?')) {
      deleteEvent(id);
      loadData();
    }
  };

  // ADMIN ACTION: UPDATE PILLARS
  const handlePillarUpdate = (id, field, value) => {
    const updated = pillars.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setPillars(updated);
    savePillars(updated);
  };

  // ADMIN ACTION: ADD TESTIMONIAL
  const handleAddTestimonial = (e) => {
    e.preventDefault();
    const payload = { ...newTestimonial, id: Date.now().toString() };
    const updated = [...testimonials, payload];
    localStorage.setItem('church_testimonials', JSON.stringify(updated));
    setTestimonials(updated);
    setNewTestimonial({ quote: '', author: '', highlight: '' });
  };

  // ADMIN ACTION: DELETE TESTIMONIAL
  const handleDeleteTestimonial = (id) => {
    if (confirm('Delete this community highlight testimonial?')) {
      const updated = testimonials.filter(item => item.id !== id);
      localStorage.setItem('church_testimonials', JSON.stringify(updated));
      setTestimonials(updated);
    }
  };

  // ADMIN ACTION: ADD OR EDIT WEEKLY SERVICE
  const handleAddService = (e) => {
    e.preventDefault();
    const payload = { ...newService, id: Date.now().toString() };
    const updated = [...services, payload];
    localStorage.setItem('church_services', JSON.stringify(updated));
    setServices(updated);
    setNewService({ dayKey: '', titleKey: '', time: '', desc: '' });
  };

  // ADMIN ACTION: DELETE WEEKLY SERVICE ROW
  const handleDeleteService = (id) => {
    if (confirm('Are you sure you want to completely remove this weekly service hour block?')) {
      const updated = services.filter(item => item.id !== id);
      localStorage.setItem('church_services', JSON.stringify(updated));
      setServices(updated);
    }
  };

  // ADMIN ACTION: ADD INVOLVED STEPS
  const handleAddInvolved = (e) => {
    e.preventDefault();
    const payload = { ...newInvolved, id: Date.now().toString() };
    const updated = [...involvedItems, payload];
    localStorage.setItem('church_involved', JSON.stringify(updated));
    setInvolvedItems(updated);
    setNewInvolved({ title: '', description: '', link: '', linkText: '' });
  };

  // ADMIN ACTION: REMOVE INVOLVED STEPS
  const handleDeleteInvolved = (id) => {
    if (confirm('Remove this action gateway block from the homepage?')) {
      const updated = involvedItems.filter(item => item.id !== id);
      localStorage.setItem('church_involved', JSON.stringify(updated));
      setInvolvedItems(updated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-neutral-200 font-sans flex items-center justify-center p-4 selection:bg-purple-500/30 selection:text-purple-200">
        <style>{`
          @keyframes borderGlow {
            0%, 100% { border-color: rgba(168, 85, 247, 0.2); }
            50% { border-color: rgba(234, 179, 8, 0.4); }
          }
          .animate-glow-card { animation: borderGlow 6s infinite ease-in-out; }
        `}</style>
        
        <div className="w-full max-w-md relative">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="bg-[#12121A]/80 backdrop-blur-xl rounded-2xl border border-neutral-800/60 p-8 shadow-2xl relative z-10 animate-glow-card">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3 text-lg font-serif italic">Ω</div>
              <h1 className="text-2xl font-normal tracking-wide text-white uppercase">{t('adminTitle') || 'Admin Console'}</h1>
              <p className="text-xs text-neutral-500 mt-1">{t('adminSubtitle') || 'Authenticate access parameters'}</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-1.5">{t('adminUsername') || 'System Username'}</label>
                <input
                  type="text"
                  className="w-full bg-[#0A0A0F]/90 text-neutral-100 text-sm px-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-neutral-700"
                  placeholder={t('adminUsernamePlaceholder') || 'admin'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-1.5">{t('adminPassword') || 'Secure Password'}</label>
                <input
                  type="password"
                  className="w-full bg-[#0A0A0F]/90 text-neutral-100 text-sm px-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all placeholder-neutral-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium tracking-wider uppercase text-xs py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/10 hover:from-purple-500 active:scale-[0.99]"
              >
                {t('adminLoginBtn') || 'Establish Connection'}
              </button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-neutral-900 text-center">
              <span className="text-[10px] tracking-wider text-neutral-600 bg-neutral-950 px-3 py-1.5 rounded-md border border-neutral-900">
                {t('adminHint') || 'HINT: admin / church123'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-neutral-300 font-sans flex selection:bg-purple-500/20 selection:text-purple-300">
      
      <style>{`
        @keyframes bentoCounter {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-bento { animation: bentoCounter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .delay-1 { animation-delay: 100ms; }
        .delay-2 { animation-delay: 200ms; }
        .delay-3 { animation-delay: 300ms; }
      `}</style>

      {/* Sidebar */}
      <aside className="w-64 bg-[#0E0E14] border-r border-neutral-900 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-500 flex items-center justify-center font-serif italic text-black font-bold text-xs">Ω</div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white leading-none">{t('adminBrand') || 'GRACE SYSTEM'}</h2>
              <span className="text-[10px] text-neutral-500 tracking-wider uppercase">{t('adminBrandSub') || 'Console Hub'}</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'overview' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">📊</span>
              Dashboard Overview
            </button>
            <button onClick={() => setActiveTab('sermons')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'sermons' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">📜</span>
              Manage Sermons
            </button>
            <button onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'events' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">📅</span>
              Manage Events
            </button>
            <button onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'services' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">⏰</span>
              Service Calendar Hours
            </button>
            <button onClick={() => setActiveTab('involved')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'involved' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">🤝</span>
              Get Involved Gateways
            </button>
            <button onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'testimonials' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">💬</span>
              Visitor Highlights
            </button>
            <button onClick={() => setActiveTab('pillars')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${activeTab === 'pillars' ? 'bg-white/5 border border-neutral-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'text-neutral-400 hover:bg-white/[0.02] border border-transparent hover:text-neutral-200'}`}
            >
              <span className="text-sm">🏛️</span>
              Three Pillars
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] text-neutral-300 font-semibold uppercase">A</div>
            <span className="text-xs text-neutral-400 font-medium">{t('adminUser') || 'Administrator'}</span>
          </div>
          <button onClick={handleLogout} className="text-neutral-500 hover:text-red-400 transition-colors text-xs p-1">🚪</button>
        </div>
      </aside>

      {/* Main Content Content Canvas */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10 pb-5 border-b border-neutral-900/80">
          <div>
            <h1 className="text-2xl font-normal text-white tracking-wide uppercase">Workspace Dashboard</h1>
            <p className="text-xs text-neutral-500 mt-0.5">Real-time control parameters over dynamic homepage blocks</p>
          </div>
          <button onClick={handleLogout} className="sm:hidden self-start bg-neutral-900 border border-neutral-800 text-xs px-4 py-2 rounded-xl text-neutral-400">
            {t('adminSignOut') || 'Sign Out'}
          </button>
        </header>

        {/* Dynamic Matrix Bento System Counters */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#12121A] border border-neutral-900 p-4 rounded-2xl relative overflow-hidden group hover:border-neutral-800 transition-all">
            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">Sermons Archive</span>
            <div className="text-2xl font-light text-white tracking-tight"><span className="text-yellow-500 font-serif font-normal">{sermons.length}</span> <span className="text-[10px] text-neutral-600">items</span></div>
            <div className="absolute top-3 right-3 text-neutral-800 text-sm">📜</div>
          </div>
          <div className="bg-[#12121A] border border-neutral-900 p-4 rounded-2xl relative overflow-hidden group hover:border-neutral-800 transition-all">
            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">Calendar Metrics</span>
            <div className="text-2xl font-light text-white tracking-tight"><span className="text-purple-400 font-serif font-normal">{events.length}</span> <span className="text-[10px] text-neutral-600">markers</span></div>
            <div className="absolute top-3 right-3 text-neutral-800 text-sm">📅</div>
          </div>
          <div className="bg-[#12121A] border border-neutral-900 p-4 rounded-2xl relative overflow-hidden group hover:border-neutral-800 transition-all">
            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">Weekly Shifts</span>
            <div className="text-2xl font-light text-white tracking-tight"><span className="text-blue-400 font-serif font-normal">{services.length}</span> <span className="text-[10px] text-neutral-600">hours</span></div>
            <div className="absolute top-3 right-3 text-neutral-800 text-sm">⏰</div>
          </div>
          <div className="bg-[#12121A] border border-neutral-900 p-4 rounded-2xl relative overflow-hidden group hover:border-neutral-800 transition-all">
            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">Get Involved</span>
            <div className="text-2xl font-light text-white tracking-tight"><span className="text-emerald-400 font-serif font-normal">{involvedItems.length}</span> <span className="text-[10px] text-neutral-600">gateways</span></div>
            <div className="absolute top-3 right-3 text-neutral-800 text-sm">🤝</div>
          </div>
          <div className="bg-[#12121A] border border-neutral-900 p-4 rounded-2xl relative overflow-hidden group hover:border-neutral-800 transition-all">
            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest block mb-1">Testimonials</span>
            <div className="text-2xl font-light text-white tracking-tight"><span className="text-pink-400 font-serif font-normal">{testimonials.length}</span> <span className="text-[10px] text-neutral-600">quotes</span></div>
            <div className="absolute top-3 right-3 text-neutral-800 text-sm">💬</div>
          </div>
        </section>

        {/* OVERVIEW COMPONENT INITIALIZATIONS */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6 items-start animate-bento">
            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2"><span className="text-yellow-500">✦</span> Add New Sermon Document</h3>
              <form onSubmit={handleAddSermon} className="space-y-3.5">
                <input type="text" placeholder="Sermon Title" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newSermon.title} onChange={(e) => setNewSermon({...newSermon, title: e.target.value})} required />
                <input type="text" placeholder="Speaker Name" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newSermon.speaker} onChange={(e) => setNewSermon({...newSermon, speaker: e.target.value})} required />
                <textarea placeholder="Context descriptors or biblical text references..." rows="3" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none resize-none" value={newSermon.description} onChange={(e) => setNewSermon({...newSermon, description: e.target.value})} />
                <button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 text-[11px] font-semibold tracking-wider uppercase py-3 rounded-xl transition-all">Commit Sermon Payload</button>
              </form>
            </div>

            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2"><span className="text-purple-400">✦</span> Add New Event Document</h3>
              <form onSubmit={handleAddEvent} className="space-y-3.5">
                <input type="text" placeholder="Event Title Name" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} required />
                <input type="date" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
                <input type="text" placeholder="Target Window Time (e.g., 11:00 AM)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} required />
                <input type="text" placeholder="Assembly Coordinates / Location" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800/80 focus:outline-none" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} required />
                <button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 text-[11px] font-semibold tracking-wider uppercase py-3 rounded-xl transition-all">Commit Event Payload</button>
              </form>
            </div>
          </div>
        )}

        {/* SERMON ARCHIVE PANEL */}
        {activeTab === 'sermons' && (
          <div className="bg-[#12121A] border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl animate-bento">
            <div className="p-5 border-b border-neutral-900 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase">Sermons Archive Module</h3>
                <p className="text-[11px] text-neutral-500">Prune and manage active record rows</p>
              </div>
            </div>
            {sermons.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-600">Empty catalog data blocks.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 bg-[#0E0E14]/50">
                      <th className="p-4 uppercase text-[10px]">Sermon Title</th>
                      <th className="p-4 uppercase text-[10px]">Speaker Node</th>
                      <th className="p-4 uppercase text-[10px]">Staged Date</th>
                      <th className="p-4 text-right uppercase text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/60 text-neutral-400">
                    {sermons.map(sermon => (
                      <tr key={sermon.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-white font-medium">{sermon.title}</td>
                        <td className="p-4">{sermon.speaker}</td>
                        <td className="p-4 font-mono text-neutral-500">{sermon.date || 'N/A'}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteSermon(sermon.id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-[11px] border border-red-500/20">Purge Row</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* EVENTS MATRIX MODULE */}
        {activeTab === 'events' && (
          <div className="bg-[#12121A] border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl animate-bento">
            <div className="p-5 border-b border-neutral-900 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase">Calendar Matrix Registry</h3>
                <p className="text-[11px] text-neutral-500">Live community timeline synchronization indicators</p>
              </div>
            </div>
            {events.length === 0 ? (
              <div className="p-12 text-center text-xs text-neutral-600">Empty timeline data blocks.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 text-neutral-500 bg-[#0E0E14]/50">
                      <th className="p-4 uppercase text-[10px]">Event Marker</th>
                      <th className="p-4 uppercase text-[10px]">Target Date</th>
                      <th className="p-4 uppercase text-[10px]">Time Window</th>
                      <th className="p-4 uppercase text-[10px]">Coordinates</th>
                      <th className="p-4 text-right uppercase text-[10px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900/60 text-neutral-400">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-white/[0.01]">
                        <td className="p-4 text-white font-medium">{event.title}</td>
                        <td className="p-4 font-mono">{event.date}</td>
                        <td className="p-4">{event.time}</td>
                        <td className="p-4 text-neutral-500">{event.location}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1 rounded-lg text-[11px] border border-red-500/20">Purge Row</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* WEEKLY SERVICE TIMES MANAGEMENT PANEL */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-bento">
            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2"><span className="text-blue-400">✦</span> Establish / Modify Weekly Service Hour Block</h3>
              <form onSubmit={handleAddService} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Day Key ID (e.g. sunday, wednesday)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newService.dayKey} onChange={(e) => setNewService({...newService, dayKey: e.target.value})} required />
                <input type="text" placeholder="Title Identifier (e.g. Main Gathering)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newService.titleKey} onChange={(e) => setNewService({...newService, titleKey: e.target.value})} required />
                <input type="text" placeholder="Operational Time Frame (e.g. 9:00 AM)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800 sm:col-span-2" value={newService.time} onChange={(e) => setNewService({...newService, time: e.target.value})} required />
                <textarea placeholder="Short strategy descriptor for seekers..." rows="2" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800 resize-none sm:col-span-2" value={newService.desc} onChange={(e) => setNewService({...newService, desc: e.target.value})} required />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold tracking-wider uppercase py-3 rounded-xl transition-all sm:col-span-2">Commit Service Track Block</button>
              </form>
            </div>

            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-neutral-900"><h4 className="text-xs font-bold uppercase text-white tracking-wider">Active Service Hours Blocks On Live Site</h4></div>
              <div className="divide-y divide-neutral-900/60">
                {services.map(srv => (
                  <div key={srv.id} className="p-4 flex justify-between items-center hover:bg-white/[0.01]">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase"><span>{srv.dayKey}</span> <span className="text-blue-400">· {srv.time}</span></div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{srv.desc}</p>
                    </div>
                    <button onClick={() => handleDeleteService(srv.id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] px-2.5 py-1 rounded-lg border border-red-500/10">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOW TO GET INVOLVED GATEWAYS ENGINE */}
        {activeTab === 'involved' && (
          <div className="space-y-6 animate-bento">
            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2"><span className="text-emerald-400">✦</span> Append New 'How To Get Involved' Gateway Card</h3>
              <form onSubmit={handleAddInvolved} className="space-y-3.5">
                <input type="text" placeholder="Doorway Step Title (e.g. Join a Life Group)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newInvolved.title} onChange={(e) => setNewInvolved({...newInvolved, title: e.target.value})} required />
                <textarea placeholder="Step parameters and structural description..." rows="3" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800 resize-none" value={newInvolved.description} onChange={(e) => setNewInvolved({...newInvolved, description: e.target.value})} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Action Button Endpoint URI Link (e.g. /groups)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newInvolved.link} onChange={(e) => setNewInvolved({...newInvolved, link: e.target.value})} required />
                  <input type="text" placeholder="Button Display Call To Action (e.g. Find Group)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newInvolved.linkText} onChange={(e) => setNewInvolved({...newInvolved, linkText: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold tracking-wider uppercase py-3 rounded-xl transition-all">Publish Involvement Gateway</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {involvedItems.map(item => (
                <div key={item.id} className="bg-[#12121A] border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide mb-1">{item.title}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-900/60 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-emerald-400">{item.link}</span>
                    <button onClick={() => handleDeleteInvolved(item.id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] px-2.5 py-1 rounded-lg">Purge Card</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISITOR HIGHLIGHTS TESTIMONIALS MANAGER */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-bento">
            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2"><span className="text-pink-400">✦</span> Introduce Dynamic Community Testimonial Node</h3>
              <form onSubmit={handleAddTestimonial} className="space-y-3.5">
                <textarea placeholder="Paste authentic testimony text blocks transformation matrix quote..." rows="3" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800 resize-none" value={newTestimonial.quote} onChange={(e) => setNewTestimonial({...newTestimonial, quote: e.target.value})} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Author Full Name Reference" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newTestimonial.author} onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})} required />
                  <input type="text" placeholder="Highlight Role / Identity Subtext (e.g. Seeker Since 2025)" className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-3 rounded-xl border border-neutral-800" value={newTestimonial.highlight} onChange={(e) => setNewTestimonial({...newTestimonial, highlight: e.target.value})} required />
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white text-[11px] font-semibold tracking-wider uppercase py-3 rounded-xl transition-all">Publish Highlight Testimony</button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map(test => (
                <div key={test.id} className="bg-[#12121A] border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                  <p className="text-[11px] italic text-neutral-300 leading-relaxed">"{test.quote}"</p>
                  <div className="mt-4 pt-3 border-t border-neutral-900/60 flex justify-between items-end">
                    <div>
                      <h5 className="text-xs font-bold text-white">{test.author}</h5>
                      <span className="text-[9px] text-pink-400 font-medium block">{test.highlight}</span>
                    </div>
                    <button onClick={() => handleDeleteTestimonial(test.id)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-[10px] px-2 py-1 rounded-lg border border-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THREE PILLARS EDITOR */}
        {activeTab === 'pillars' && (
          <div className="space-y-6 animate-bento">
            <div className="bg-[#12121A] border border-neutral-900 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4 flex items-center gap-2">
                <span className="text-amber-400">✦</span> Edit Three Core Pillars
              </h3>
              <p className="text-[11px] text-neutral-500 mb-6">These are displayed on the homepage under "The Three Core Pillars" section.</p>
              
              {pillars.map((pillar) => (
                <div key={pillar.id} className="border-b border-neutral-900/60 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full bg-${['purple-500', 'blue-500', 'amber-500'][pillars.findIndex(p => p.id === pillar.id)]}`} />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{pillar.id}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handlePillarUpdate(pillar.id, 'title', e.target.value)}
                        className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Short Description</label>
                      <input
                        type="text"
                        value={pillar.description}
                        onChange={(e) => handlePillarUpdate(pillar.id, 'description', e.target.value)}
                        className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">Extended Description (visible on click)</label>
                      <textarea
                        rows="3"
                        value={pillar.extendedDescription}
                        onChange={(e) => handlePillarUpdate(pillar.id, 'extendedDescription', e.target.value)}
                        className="w-full bg-[#0A0A0F] text-neutral-200 text-xs px-4 py-2.5 rounded-xl border border-neutral-800 focus:outline-none focus:border-purple-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-3 border-t border-neutral-900/60">
                <p className="text-[10px] text-emerald-400 font-mono">✓ Changes saved automatically to localStorage</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;