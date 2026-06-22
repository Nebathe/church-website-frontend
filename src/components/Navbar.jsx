import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getTranslation } from '../translations';

// ============================================================
// STYLES (KEEP EXACTLY AS BEFORE - NO CHANGES NEEDED)
// ============================================================
const NAV_STYLES = `
  .mnav-root {
    position: sticky;
    top: 0;
    z-index: 200;
    width: 100%;
    background: rgba(10, 10, 15, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    color: #f0f2fa;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 14px;
  }
  .mnav-bar {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 24px;
    height: 66px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .mnav-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
    color: #f0f2fa;
    flex-shrink: 0;
  }
  .mnav-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  .logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mnav-logo-text { font-weight: 600; font-size: 16px; tracking-wide: 0.05em; white-space: nowrap; }

  .mnav-links { display: flex; align-items: center; gap: 4px; }

  .mnav-link {
    padding: 8px 14px;
    border-radius: 8px;
    color: rgba(240,242,250,0.6);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
    white-space: nowrap;
    background: none;
    border: 1px solid transparent;
    font: inherit;
    font-size: 13.5px;
    text-decoration: none;
  }
  .mnav-link:hover { color: #ffffff; background: rgba(255,255,255,0.03); }
  .mnav-link.is-active { 
    color: #ffffff; 
    background: rgba(255,255,255,0.05); 
    border-color: rgba(255,255,255,0.05);
  }
  
  .mnav-link.is-gold { color: #e8c97a; font-weight: 500; }
  .mnav-link.is-gold:hover { background: rgba(232, 201, 122, 0.08); color: #f3dfae; }

  .mnav-chevron {
    width: 12px; height: 12px;
    display: inline-flex;
    opacity: 0.6;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
  .mnav-chevron.is-open { transform: rotate(180deg); opacity: 1; }

  .mnav-dd-wrap { position: relative; }

  .mnav-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 200px;
    background: #0f0f16;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 6px;
    z-index: 300;
    box-shadow: 0 20px 40px rgba(0,0,0,0.7);
    animation: mnavDropIn 0.2s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes mnavDropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mnav-dropdown a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    color: rgba(240,242,250,0.65);
    text-decoration: none;
    transition: all 0.15s ease;
    font-size: 13px;
    font-weight: 500;
  }
  .mnav-dropdown a:hover { color: #ffffff; background: rgba(255,255,255,0.05); }
  .mnav-dropdown-icon { font-size: 14px; width: 18px; flex-shrink: 0; opacity: 0.8; }

  .mnav-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.12); margin: 0 8px; flex-shrink: 0; }

  /* Language Switcher */
  .mnav-lang-group {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
    padding: 2px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .mnav-lang-btn {
    padding: 4px 10px;
    border-radius: 6px;
    border: none;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: rgba(255,255,255,0.4);
    font-family: inherit;
    letter-spacing: 0.04em;
  }
  .mnav-lang-btn:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.04); }
  .mnav-lang-btn.is-active { 
    background: #e8c97a; 
    color: #0a0a0f; 
    box-shadow: 0 2px 8px rgba(232, 201, 122, 0.25);
  }

  .mnav-admin-btn {
    padding: 7px 14px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    background: rgba(168, 85, 247, 0.1);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.25);
    cursor: pointer;
    font-family: inherit;
    transition: all 0.25s ease;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .mnav-admin-btn:hover { 
    background: rgba(168, 85, 247, 0.2); 
    border-color: rgba(168, 85, 247, 0.4);
    color: #d8b4fe;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
  }
  .mnav-admin-btn.is-active {
    background: rgba(168, 85, 247, 0.25); 
    border-color: rgba(168, 85, 247, 0.5);
    color: #ffffff;
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.25);
  }
  
  .mnav-login-link {
    padding: 7px 14px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 13px;
    color: rgba(240,242,250,0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .mnav-login-link:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .pulse-indicator {
    width: 6px;
    height: 6px;
    background-color: #a855f7;
    border-radius: 50%;
    display: inline-block;
    box-shadow: 0 0 8px #a855f7;
    animation: corePulse 2s infinite;
  }
  @keyframes corePulse {
    0% { transform: scale(0.9); opacity: 0.6; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.6; }
  }

  .mnav-mobile-btn {
    display: none;
    background: none;
    border: none;
    color: #f0f2fa;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .mnav-mobile-btn:hover { background: rgba(255,255,255,0.05); }

  .mnav-mobile-menu {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 10px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: #0A0A0F;
    animation: mnavDropIn 0.2s cubic-bezier(.16,1,.3,1) both;
  }
  .mnav-mob-section {
    font-size: 10px;
    color: #c9a84c;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 12px 12px 4px;
    opacity: 0.8;
  }
  .mnav-mob-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    color: rgba(240,242,250,0.65);
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
  }
  .mnav-mob-link:hover { color: #ffffff; background: rgba(255,255,255,0.04); }
  .mnav-mob-link.is-gold { color: #e8c97a; }
  
  .mnav-mob-link.is-admin {
    margin-top: 8px;
    background: rgba(168, 85, 247, 0.08);
    color: #d8b4fe;
    border: 1px solid rgba(168, 85, 247, 0.2);
    font-weight: 600;
  }
  .mnav-mob-icon { font-size: 16px; width: 20px; flex-shrink: 0; }
  .mnav-mob-pill {
    font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 999px;
    background: rgba(232, 201, 122, 0.15); color: #e8c97a;
    margin-left: auto;
  }

  /* Mobile language switcher */
  .mnav-mob-lang {
    display: flex;
    gap: 8px;
    padding: 12px 12px 4px;
  }
  .mnav-mob-lang-btn {
    padding: 6px 16px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: rgba(255,255,255,0.4);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  .mnav-mob-lang-btn.is-active {
    background: #e8c97a;
    color: #0a0a0f;
    border-color: #e8c97a;
  }
  .mnav-mob-lang-btn:hover { color: #ffffff; }

  @media (max-width: 860px) {
    .mnav-links, .mnav-divider, .mnav-admin-btn, .mnav-login-link, .mnav-lang-group { display: none !important; }
    .mnav-mobile-btn { display: flex !important; }
  }
`;

// ============================================================
// MENU DATA
// ============================================================
const MENU = [
  {
    key: 'about',
    labelKey: 'about',
    icon: '📖',
    children: [
      { labelKey: 'churchHistory', to: '/history', emoji: '📖' },
      { labelKey: 'leadership', to: '/leadership', emoji: '👥' },
      { labelKey: 'gallery', to: '/gallery', emoji: '📸' },
    ],
  },
  {
    key: 'ministry',
    labelKey: 'ministry',
    icon: '🎯',
    children: [
      { labelKey: 'sermons', to: '/sermons', emoji: '🎧' },
      { labelKey: 'events', to: '/events', emoji: '📅' },
    ],
  },
];

function ChevronIcon({ open }) {
  return (
    <span className={`mnav-chevron${open ? ' is-open' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  );
}

function Navbar() {
  const [openDD, setOpenDD] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const navRef = useRef(null);
  const location = useLocation();

  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    const syncToken = () => {
      setIsAdmin(localStorage.getItem('token') === 'admin-token-123');
    };
    syncToken();
    window.addEventListener('storage', syncToken);
    const interval = setInterval(syncToken, 800);
    return () => {
      window.removeEventListener('storage', syncToken);
      clearInterval(interval);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDD(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setOpenDD(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleDD = (key) => setOpenDD((prev) => (prev === key ? null : key));
  const closeAll = () => { setOpenDD(null); setMobileOpen(false); };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('preferred_lang', newLang);
    window.location.reload();
  };

  return (
    <>
      <style>{NAV_STYLES}</style>

      <nav className="mnav-root" ref={navRef} aria-label="Main navigation">
        <div className="mnav-bar">
          <Link to="/" className="mnav-logo">
            <div className="mnav-logo-icon">
              <img src="/logo.png" alt="Church Logo" className="logo" />
            </div>
            <span className="mnav-logo-text">Our Church</span>
          </Link>

          <div className="mnav-links">
            <Link to="/" className={`mnav-link${location.pathname === '/' ? ' is-active' : ''}`}>{t('home')}</Link>

            {MENU.map(({ key, labelKey, children }) => {
              const isChildActive = children.some(child => location.pathname === child.to);
              return (
                <div className="mnav-dd-wrap" key={key}>
                  <button
                    className={`mnav-link${(openDD === key || isChildActive) ? ' is-active' : ''}`}
                    onClick={() => toggleDD(key)}
                  >
                    {t(labelKey)}
                    <ChevronIcon open={openDD === key} />
                  </button>
                  {openDD === key && (
                    <div className="mnav-dropdown">
                      {children.map((item) => (
                        <Link key={item.to} to={item.to} className="mnav-dropdown-item" onClick={closeAll}>
                          <span className="mnav-dropdown-icon" aria-hidden="true">{item.emoji}</span>
                          {t(item.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link to="/contact" className={`mnav-link${location.pathname === '/contact' ? ' is-active' : ''}`}>
              📞 {t('contact')}
            </Link>

            <Link to="/prayer" className={`mnav-link is-gold${location.pathname === '/prayer' ? ' is-active' : ''}`}>🙏 {t('prayerWall')}</Link>
            <Link to="/annual-plan" className={`mnav-link is-gold${location.pathname === '/annual-plan' ? ' is-active' : ''}`}>📋 {t('annualPlan')}</Link>

            <div className="mnav-divider" aria-hidden="true" />

            {/* Language Switcher */}
            <div className="mnav-lang-group">
              <button className={`mnav-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => changeLanguage('en')}>EN</button>
              <button className={`mnav-lang-btn${lang === 'am' ? ' is-active' : ''}`} onClick={() => changeLanguage('am')}>አማ</button>
              <button className={`mnav-lang-btn${lang === 'om' ? ' is-active' : ''}`} onClick={() => changeLanguage('om')}>ORM</button>
            </div>
            
            {isAdmin ? (
              <Link to="/admin" className={`mnav-admin-btn ${location.pathname === '/admin' ? 'is-active' : ''}`}>
                <span className="pulse-indicator" />
                {t('adminConsole')}
              </Link>
            ) : (
              <Link to="/admin" className="mnav-login-link">
                🔒 {t('consoleLogin')}
              </Link>
            )}
          </div>

          <button className="mnav-mobile-btn" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="mnav-mobile-menu" role="menu">
            <p className="mnav-mob-section">{t('navigate')}</p>
            <Link to="/" className="mnav-mob-link" onClick={closeAll}>🏠 {t('home')}</Link>

            {MENU.map(({ key, labelKey, children }) => (
              <React.Fragment key={key}>
                <p className="mnav-mob-section">{t(labelKey)}</p>
                {children.map((item) => (
                  <Link key={item.to} to={item.to} className="mnav-mob-link" onClick={closeAll}>
                    <span className="mnav-mob-icon">{item.emoji}</span>{t(item.labelKey)}
                  </Link>
                ))}
              </React.Fragment>
            ))}

            <p className="mnav-mob-section">{t('connect')}</p>
            <Link to="/contact" className="mnav-mob-link" onClick={closeAll}>
              <span className="mnav-mob-icon">📞</span> {t('contact')}
            </Link>

            <p className="mnav-mob-section">{t('community')}</p>
            <Link to="/prayer" className="mnav-mob-link is-gold" onClick={closeAll}>🙏 {t('prayerWall')}</Link>
            <Link to="/annual-plan" className="mnav-mob-link is-gold" onClick={closeAll}>📋 {t('annualPlan')}</Link>

            <p className="mnav-mob-section">{t('language')}</p>
            <div className="mnav-mob-lang">
              <button className={`mnav-mob-lang-btn${lang === 'en' ? ' is-active' : ''}`} onClick={() => changeLanguage('en')}>🇬🇧 EN</button>
              <button className={`mnav-mob-lang-btn${lang === 'am' ? ' is-active' : ''}`} onClick={() => changeLanguage('am')}>🇪🇹 አማ</button>
              <button className={`mnav-mob-lang-btn${lang === 'om' ? ' is-active' : ''}`} onClick={() => changeLanguage('om')}>🇪🇹 ORM</button>
            </div>

            <p className="mnav-mob-section">{t('secureControl')}</p>
            <Link to="/admin" className={isAdmin ? "mnav-mob-link is-admin" : "mnav-mob-link"} onClick={closeAll}>
              {isAdmin ? `🔮 ${t('openWorkspace')}` : `🔒 ${t('loginToPanel')}`}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
//i will give u the navbar from my website. u will fix it. don't change anything. what u have change is its not working we fix everything.  