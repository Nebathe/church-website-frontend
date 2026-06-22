import React, { useState } from 'react';

const TRANSLATIONS = {
  en: { title: "Annual Plan", greeting: "Hello" },
  am: { title: "ዓመታዊ ዕቅድ", greeting: "ሰላም" },
  om: { title: "Karoora Waggaa", greeting: "Akkam" }
};

function TestLang() {
  const [lang, setLang] = useState('en');
  const t = (key) => TRANSLATIONS[lang][key];

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setLang('en')} style={{ margin: '5px', padding: '10px' }}>English</button>
        <button onClick={() => setLang('am')} style={{ margin: '5px', padding: '10px' }}>አማርኛ</button>
        <button onClick={() => setLang('om')} style={{ margin: '5px', padding: '10px' }}>Oromoo</button>
      </div>
      <h1>{t('title')}</h1>
      <p>{t('greeting')}</p>
      <p>Current language: {lang}</p>
    </div>
  );
}

export default TestLang;