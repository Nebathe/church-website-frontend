import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ArrowRight, Heart, Eye, BookOpen,
  Clock, Mail, Users, Sparkles, Building2, Send, ChevronUp,
  MapPin, Notebook, MessageSquare, PlusCircle
} from 'lucide-react';
import { getBibleVerse } from '../services/localStorageService';
import { getTranslation } from '../translations';
import SocialLinks from '../components/SocialLinks';
import OnlineGiving from '../components/OnlineGiving';
import { getPillars } from '../services/localStorageService';

function useCountUp(target, duration = 2200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);
  return [count, ref];
}

function StatItem({ value, suffix = '', label, icon: Icon }) {
  const [count, ref] = useCountUp(value);
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{once: true}}
      style={{ background: 'white', borderRadius: '16px', padding: '2.5rem 1.5rem',
        textAlign: 'center', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
    >
      <div style={{ color: 'var(--color-accent)' }}><Icon size={32} /></div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)',
        color: 'var(--color-navy)', lineHeight: 1, fontWeight: 800 }}>{count}{suffix}</span>
      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </motion.div>
  );
}

function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [bibleVerse, setBibleVerse] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [services, setServices] = useState([]);
  const [involvedItems, setInvolvedItems] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('langChanged', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('langChanged', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem('newsletter_email')) setSubscribed(true);
    setBibleVerse(getBibleVerse());
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setPillars(getPillars());
    
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
  }, []);

  const scrollToSection = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { localStorage.setItem('newsletter_email', email); setSubscribed(true); setEmail(''); }
  };

  const togglePillar = (id) => {
    setExpandedPillar(expandedPillar === id ? null : id);
  };

  const events = services.length > 0 ? services : [
    { id: '1', dayKey: 'sunday', titleKey: 'sundayWorship', time: '9:00 AM & 11:00 AM', desc: 'Main corporate worship gathering.' },
    { id: '2', dayKey: 'wednesday', titleKey: 'wednesdayBible', time: '7:00 PM', desc: 'Deep systematic verse-by-verse teaching.' },
    { id: '3', dayKey: 'friday', titleKey: 'fridayPrayer', time: '6:30 PM', desc: 'Intercession, warfare prayer, and communion.' }
  ];

  return (
    <div className="home-root" style={{ overflowX: 'hidden', background: '#FAFAFA', color: '#334155', fontFamily: 'var(--font-body)' }}>

      <a href="/contact" style={{ position:'fixed',right:'1.5rem',bottom:'5.5rem',zIndex:100,
          background:'var(--color-accent)',color:'white',borderRadius:'30px',
          padding:'0.8rem 1.5rem',display:'flex',alignItems:'center',gap:'0.5rem',
          fontWeight:700,fontSize:'0.875rem',textDecoration:'none',boxShadow:'0 10px 25px rgba(249,115,22,0.4)', transition:'all 0.2s ease' }}>
        <Send size={16} /> {t('connect') || 'Connect With Us'}
      </a>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.5}}
            onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
            style={{position:'fixed',right:'1.5rem',bottom:'1.5rem',zIndex:100,
              background:'var(--color-navy)',color:'white',border:'none',
              borderRadius:'50%',width:'3rem',height:'3rem',
              display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',
              boxShadow:'0 4px 16px rgba(15,23,42,0.3)'}}>
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <section id="hero" style={{position:'relative',minHeight:'100svh',background:'var(--color-navy)',
          display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        
        <div style={{ position: 'absolute', inset: 0, 
            backgroundImage: 'url("/worship.jpg")', 
            backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)' }} />

        <div style={{position:'absolute',inset:0,pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize:'80px 80px'}} />

        <div style={{position:'relative',zIndex:10,maxWidth:'1000px',margin:'0 auto',padding:'4rem 1.5rem'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', gap:'3rem'}}>
            
            <div style={{textAlign:'left'}}>
              <motion.p initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
                style={{color:'#FCD34D',fontSize:'0.85rem',fontWeight:700,letterSpacing:'0.25em',
                  textTransform:'uppercase',marginBottom:'1.5rem'}}>
                {t('addisAbaba') || 'Addis Ababa · Ethiopia'}
              </motion.p>
              
              <motion.h1 initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.1}}
                style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.8rem,8vw,6.5rem)',
                  lineHeight:1.0,letterSpacing:'-0.02em',color:'white',fontWeight:900,marginBottom:'1rem'}}>
                {t('welcomeHome') || 'Welcome Home'}
              </motion.h1>

              <motion.p initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}}
                style={{fontFamily:'var(--font-body)',fontSize:'clamp(1rem,3.5vw,1.6rem)',
                  color:'rgba(255,255,255,0.85)',fontWeight:400,maxWidth:'700px',margin:'0 0 2.5rem',lineHeight:1.5}}>
                {t('homeDescription') || 'A sanctuary of radical worship, absolute belonging, and permanent transformation.'}
              </motion.p>

              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                style={{display:'flex',gap:'1.25rem',flexWrap:'wrap'}}>
                <button onClick={() => scrollToSection('logistics')}
                  style={{background:'var(--color-accent)',color:'white',border:'none',borderRadius:'8px',
                    padding:'1rem 2.5rem',fontWeight:700,fontSize:'1rem',
                    cursor:'pointer',boxShadow:'0 10px 25px rgba(249,115,22,0.45)'}}>
                  {t('joinUs') || 'Plan Your Visit'}
                </button>
                <button onClick={() => scrollToSection('pillars')}
                  style={{background:'rgba(255,255,255,0.12)',color:'white',border:'1px solid rgba(255,255,255,0.25)',
                    borderRadius:'8px',padding:'1rem 2.5rem',backdropFilter:'blur(8px)',
                    fontWeight:600,fontSize:'1rem',cursor:'pointer',
                    display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  {t('ourStory') || 'What We Believe'} <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
            
            <div>
              <img 
                src="/your-church-photo.jpg" 
                alt="Church Photo" 
                style={{width:'100%', borderRadius:'16px', boxShadow:'0 20px 40px rgba(0,0,0,0.4)', maxHeight:'500px', objectFit:'cover'}}
              />
            </div>
            
          </div>
        </div>

        <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}}
          onClick={() => scrollToSection('logistics')}
          style={{position:'absolute',bottom:'2rem',left:'50%',transform:'translateX(-50%)',
            background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.5)'}}>
          <motion.div animate={{y:[0,6,0]}} transition={{duration:2,repeat:Infinity,ease:'easeInOut'}}>
            <ChevronDown size={32} />
          </motion.div>
        </motion.button>
      </section>

      <section id="logistics" style={{padding:'6rem 1.5rem', background:'white'}}>
        <div style={{maxWidth:'1140px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'4rem'}}>
            <span style={{color:'var(--color-accent)', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'0.8rem'}}>{t('visitLabel') || 'Times & Location'}</span>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--color-navy)', marginTop:'0.5rem'}}>{t('gatherTitle') || 'Join Us This Week'}</h2>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'2.5rem', alignItems:'start'}}>
            
            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
              <div style={{background:'#F8FAFC', borderRadius:'16px', padding:'2rem', border:'1px solid #E2E8F0'}}>
                <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--color-navy)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                  <Clock size={20} style={{color:'var(--color-accent)'}}/> Weekly Service Hours
                </h3>
                <div style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
                  {events.map((ev, idx) => (
                    <div key={ev.id || idx} style={{borderBottom: idx !== events.length -1 ? '1px solid #E2E8F0' : 'none', paddingBottom: idx !== events.length -1 ? '1.25rem' : '0'}}>
                      <div style={{display:'flex', justifyContent:'space-between', fontWeight:700, color:'var(--color-navy)'}}>
                        <span>{t(ev.dayKey) || ev.dayKey.toUpperCase()}</span>
                        <span style={{color:'var(--color-primary)'}}>{ev.time}</span>
                      </div>
                      <p style={{fontSize:'0.9rem', color:'#64748B', marginTop:'0.25rem'}}>{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{background:'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius:'16px', padding:'1.75rem', display:'flex', gap:'1rem', alignItems:'flex-start', border:'1px solid #BFDBFE'}}>
                <Notebook size={32} style={{color:'var(--color-primary)', flexShrink:0}} />
                <div>
                  <h4 style={{fontWeight:700, color:'var(--color-navy)', fontSize:'1rem', marginBottom:'0.25rem'}}>Bring Your Notebook & Bible</h4>
                  <p style={{fontSize:'0.9rem', color:'#1E40AF', lineHeight:1.5}}>We value deep, interactive study. We highly encourage all first-time visitors and community members to bring a physical notebook and a hardcopy Bible to write down revelations together.</p>
                </div>
              </div>
            </div>

            <div style={{background:'#F8FAFC', borderRadius:'16px', padding:'2rem', border:'1px solid #E2E8F0', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
              <div>
                <h3 style={{fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--color-navy)', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                  <MapPin size={20} style={{color:'var(--color-accent)'}}/> Our Campus Location
                </h3>
                <p style={{color:'#475569', fontSize:'0.95rem', lineHeight:1.6, marginBottom:'1.5rem'}}>
                  Main Sanctuary Complex, Bole Sub-City (Near Friendship Square), Addis Ababa, Ethiopia.
                </p>
              </div>

              <div style={{width:'100%', height:'220px', background:'#E2E8F0', borderRadius:'12px', overflow:'hidden', position:'relative', boxShadow:'inset 0 2px 8px rgba(0,0,0,0.06)'}}>
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#64748B', fontSize:'0.85rem', fontWeight:600, flexDirection:'column', gap:'0.5rem'}}>
                  <span>[Google Map Embed Interface]</span>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{color:'var(--color-primary)', textDecoration:'underline'}}>Open in Navigation App</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {bibleVerse && (
        <section id="verse" style={{background:'linear-gradient(150deg,#0F172A 0%,#1E3A5F 100%)',padding:'6rem 1.5rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(ellipse at 50% 50%,rgba(245,158,11,0.08) 0%,transparent 65%)'}} />
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}}
            style={{maxWidth:'800px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
            <p style={{color:'#F59E0B',fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'2rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.75rem'}}>
              <span style={{width:32,height:1,background:'currentColor'}} />{t('verseLabel') || 'Scripture Highlight'}<span style={{width:32,height:1,background:'currentColor'}} />
            </p>
            <blockquote style={{fontSize:'clamp(1.2rem,3.5vw,1.8rem)',color:'rgba(255,255,255,0.95)',lineHeight:1.7,fontStyle:'italic',marginBottom:'1.5rem',fontWeight:300}}>
              "{bibleVerse.text}"
            </blockquote>
            <cite style={{fontFamily:'var(--font-display)',fontSize:'1.35rem',letterSpacing:'0.05em',color:'#F59E0B',fontStyle:'normal',display:'block',marginBottom:'2.5rem'}}>
              — {bibleVerse.verse} —
            </cite>
            <div style={{display:'flex',gap:'2rem',justifyContent:'center',flexWrap:'wrap', background:'rgba(255,255,255,0.04)', padding:'1.5rem', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.06)'}}>
              <div><p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.5rem'}}>አማርኛ</p><p style={{color:'rgba(255,255,255,0.85)',fontSize:'1rem'}}>{bibleVerse.amharic}</p></div>
              <div style={{width:1,background:'rgba(255,255,255,0.12)'}} />
              <div><p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.5rem'}}>Afaan Oromoo</p><p style={{color:'rgba(255,255,255,0.85)',fontSize:'1rem'}}>{bibleVerse.oromo}</p></div>
            </div>
          </motion.div>
        </section>
      )}

      <section id="pillars" style={{background:'#FAFAFA',padding:'6rem 1.5rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:'center',marginBottom:'4rem'}}>
            <p style={{color:'var(--color-accent)',fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:'0.75rem'}}>
              {t('whoWeAre') || 'Our Core Foundations'}
            </p>
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,5vw,3.8rem)',letterSpacing:'-0.01em',color:'var(--color-navy)', fontWeight:800}}>
              {t('threePillars') || 'The Three Core Pillars'}
            </h2>
          </motion.div>
          
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'2rem'}}>
            {pillars.map((p, i) => {
              const isExpanded = expandedPillar === p.id;
              const icons = [Heart, Eye, BookOpen];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div key={p.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                  transition={{delay: i * 0.08}}
                  style={{background:'white',borderRadius:'16px',padding:'2.5rem 2rem',boxShadow:'0 4px 20px rgba(0,0,0,0.02)',position:'relative', border:'1px solid #F1F5F9', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                  <div>
                    <span style={{position:'absolute',top:'1.5rem',right:'1.5rem',fontFamily:'var(--font-display)',fontSize:'3rem',color:'rgba(37,99,235,0.05)',lineHeight:1,fontWeight:900}}>{['I','II','III'][i]}</span>
                    <div style={{width:'3.2rem',height:'3.2rem',background:'linear-gradient(135deg,var(--color-primary), #3B82F6)',borderRadius:'12px',marginBottom:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:'0 4px 14px rgba(37,99,235,0.2)'}}>
                      <IconComponent size={22} />
                    </div>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.4rem',color:'var(--color-navy)',marginBottom:'0.75rem', fontWeight:700}}>
                      {p.title}
                    </h3>
                    <p style={{color:'#64748B',lineHeight:1.6,fontSize:'0.95rem',marginBottom:'1rem'}}>
                      {p.description}
                    </p>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden', fontSize: '0.9rem', color: '#475569', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', marginTop: '0.75rem', lineHeight: 1.5 }}
                        >
                          {p.extendedDescription}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button 
                    onClick={() => togglePillar(p.id)}
                    style={{background:'none',border:'none',color:'var(--color-primary)',fontWeight:700,fontSize:'0.875rem',cursor:'pointer',padding:'0.5rem 0 0 0',display:'flex',alignItems:'center',gap:'0.4rem', width:'max-content', outline:'none'}}
                  >
                    {isExpanded ? (t('showLess') || 'Show Less ↑') : (t('readMore') || 'Learn Depth →')}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{background:'white',padding:'5rem 1.5rem', borderTop:'1px solid #F1F5F9', borderBottom:'1px solid #F1F5F9'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'2rem'}}>
          <StatItem value={1247} suffix="+" label={t('activeMembers') || 'Active Disciples'} icon={Users} />
          <StatItem value={156} suffix="+" label={t('weeklyServices') || 'Global Fellowships'} icon={Building2} />
          <StatItem value={28} label={t('yearsMinistry') || 'Years Proclaiming Truth'} icon={Sparkles} />
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            style={{background:'linear-gradient(135deg, var(--color-navy) 0%, #1E293B 100%)',borderRadius:'16px',padding:'2.5rem 1.5rem',textAlign:'center',boxShadow:'0 10px 30px rgba(15,23,42,0.1)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
            <Heart size={32} style={{color:'var(--color-accent)'}} />
            <span style={{fontFamily:'var(--font-display)',fontSize:'clamp(2.2rem,5vw,3rem)',color:'white',lineHeight:1, fontWeight:800}}>100%</span>
            <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.6)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>{t('faithAction') || 'Grace Driven'}</span>
          </motion.div>
        </div>
      </section>

      <section id="get-involved" style={{padding:'6rem 1.5rem', background:'#FAFAFA'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'4rem'}}>
            <span style={{color:'var(--color-accent)', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'0.8rem'}}>Next Steps</span>
            <h2 style={{fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--color-navy)', marginTop:'0.5rem'}}>How to Get Involved</h2>
            <p style={{color:'#64748B', maxWidth:'550px', margin:'0.5rem auto 0', fontSize:'1rem'}}>Community flourishes when we serve, connect, and learn together. Here are simple doorways to step through.</p>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
            {involvedItems.length > 0 ? (
              involvedItems.map((item) => (
                <div key={item.id} style={{background:'white', borderRadius:'16px', padding:'2.5rem 2rem', border:'1px solid #E2E8F0'}}>
                  <div style={{color:'var(--color-primary)', marginBottom:'1rem'}}><Users size={32}/></div>
                  <h3 style={{fontWeight:700, fontSize:'1.25rem', color:'var(--color-navy)', marginBottom:'0.5rem'}}>{item.title}</h3>
                  <p style={{fontSize:'0.95rem', color:'#64748B', lineHeight:1.6, marginBottom:'1.5rem'}}>{item.description}</p>
                  <a href={item.link} style={{color:'var(--color-primary)', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.9rem'}}>{item.linkText}</a>
                </div>
              ))
            ) : (
              <>
                <div style={{background:'white', borderRadius:'16px', padding:'2.5rem 2rem', border:'1px solid #E2E8F0'}}>
                  <div style={{color:'var(--color-primary)', marginBottom:'1rem'}}><Users size={32}/></div>
                  <h3 style={{fontWeight:700, fontSize:'1.25rem', color:'var(--color-navy)', marginBottom:'0.5rem'}}>Join a Life Group</h3>
                  <p style={{fontSize:'0.95rem', color:'#64748B', lineHeight:1.6, marginBottom:'1.5rem'}}>Small midweek home gatherings scattered across Addis Ababa for meal sharing, accountable fellowship, and deeper prayer execution.</p>
                  <a href="/groups" style={{color:'var(--color-primary)', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.9rem'}}>Find a Group Near Me →</a>
                </div>
                <div style={{background:'white', borderRadius:'16px', padding:'2.5rem 2rem', border:'1px solid #E2E8F0'}}>
                  <div style={{color:'var(--color-primary)', marginBottom:'1rem'}}><Sparkles size={32}/></div>
                  <h3 style={{fontWeight:700, fontSize:'1.25rem', color:'var(--color-navy)', marginBottom:'0.5rem'}}>Volunteer Teams</h3>
                  <p style={{fontSize:'0.95rem', color:'#64748B', lineHeight:1.6, marginBottom:'1.5rem'}}>Use your technical skill, hospitality gifts, media comprehension, or teaching passions to lift the corporate operational execution of the church.</p>
                  <a href="/serve" style={{color:'var(--color-primary)', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.9rem'}}>Explore Ministry Teams →</a>
                </div>
                <div style={{background:'white', borderRadius:'16px', padding:'2.5rem 2rem', border:'1px solid #E2E8F0'}}>
                  <div style={{color:'var(--color-primary)', marginBottom:'1rem'}}><BookOpen size={32}/></div>
                  <h3 style={{fontWeight:700, fontSize:'1.25rem', color:'var(--color-navy)', marginBottom:'0.5rem'}}>Foundations Discipleship</h3>
                  <p style={{fontSize:'0.95rem', color:'#64748B', lineHeight:1.6, marginBottom:'1.5rem'}}>A custom 6-week systematic class track clarifying biblical security, scriptural priority, and spiritual parameters for baptism readiness.</p>
                  <a href="/discipleship" style={{color:'var(--color-primary)', fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.9rem'}}>Register for Next Intake →</a>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section id="testimonials" style={{background:'white', padding:'6rem 1.5rem'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto'}}>
            <div style={{textAlign:'center', marginBottom:'4rem'}}>
              <span style={{color:'var(--color-accent)', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'0.8rem'}}>{t('gatherTogether') || 'Stories of Change'}</span>
              <h2 style={{fontFamily:'var(--font-display)', fontSize:'clamp(2rem,5vw,3.5rem)', color:'var(--color-navy)', marginTop:'0.5rem'}}>Community Highlights</h2>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:'2rem'}}>
              {testimonials.map((test) => (
                <motion.div key={test.id} initial={{opacity:0, scale:0.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}}
                  style={{background:'#F8FAFC', padding:'2.5rem', borderRadius:'16px', border:'1px solid #E2E8F0', display:'flex', flexDirection:'column', justifyContent:'between', position:'relative'}}>
                  <MessageSquare size={40} style={{color:'rgba(37,99,235,0.06)', position:'absolute', top:'1.5rem', left:'1.5rem'}} />
                  <p style={{fontStyle:'italic', color:'#334155', lineHeight:1.7, fontSize:'1.05rem', marginBottom:'1.5rem', position:'relative', zIndex:2}}>
                    "{test.quote}"
                  </p>
                  <div>
                    <h4 style={{fontWeight:700, color:'var(--color-navy)', fontSize:'1rem'}}>{test.author}</h4>
                    <span style={{fontSize:'0.8rem', color:'var(--color-accent)', fontWeight:600}}>{test.highlight}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <p style={{textAlign:'center', marginTop:'2rem', fontSize:'0.75rem', color:'#94A3B8', letterSpacing:'0.05em'}}>
              * Note for Admin: Testimonial items can be pushed or sliced out of the local tracking hooks dynamically. *
            </p>
          </div>
        </section>
      )}

      <OnlineGiving />
      <SocialLinks />

      <section id="newsletter" style={{background:'#F8FAFC',padding:'6rem 1.5rem', borderTop:'1px solid #E2E8F0'}}>
        <motion.div initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{maxWidth:'540px',margin:'0 auto',textAlign:'center'}}>
          <div style={{width:'4rem',height:'4rem',background:'linear-gradient(135deg,var(--color-primary),#3B82F6)',borderRadius:'16px',margin:'0 auto 1.5rem',display:'flex',alignItems:'center',justifyContent:'center',color:'white',boxShadow:'0 6px 20px rgba(37,97,235,0.25)'}}>
            <Mail size={24} />
          </div>
          <h3 style={{fontFamily:'var(--font-display)',fontSize:'clamp(1.8rem,5vw,2.5rem)',color:'var(--color-navy)',marginBottom:'0.75rem', fontWeight:800}}>
            {t('stayConnected') || 'Stay In The Loop'}
          </h3>
          <p style={{color:'#64748B',lineHeight:1.6,marginBottom:'2rem', fontSize:'0.95rem'}}>
            {t('newsletterDesc') || 'Receive weekly pastor devotionals, emergency prayer alignments, and community schedules right into your inbox.'}
          </p>
          {subscribed ? (
            <div style={{background:'rgba(37,99,235,0.06)',border:'1px solid rgba(37,99,235,0.15)',borderRadius:'8px',padding:'1.25rem',color:'var(--color-primary)',fontWeight:600}}>
              {t('thankYou') || 'Thank you! You have been joined to our online family channel.'}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{display:'flex',gap:'0.5rem',background:'white',borderRadius:'8px',padding:'0.45rem',boxShadow:'0 4px 12px rgba(0,0,0,0.03)', border:'1px solid #E2E8F0'}}>
              <input type="email" placeholder={t('emailPlaceholder') || 'Your best email address'} value={email} onChange={e => setEmail(e.target.value)} required
                style={{flex:1,border:'none',background:'transparent',padding:'0.625rem 0.75rem',fontSize:'0.95rem',outline:'none',minWidth:0}} />
              <button type="submit" style={{background:'var(--color-accent)',color:'white',border:'none',borderRadius:'6px',padding:'0.625rem 1.5rem',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>
                {t('subscribe') || 'Join System'}
              </button>
            </form>
          )}
        </motion.div>
      </section>

    </div>
  );
}

export default Home;