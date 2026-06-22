import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, User, Calendar, PlayCircle, Search, ChevronRight, 
  PauseCircle, Volume2, VolumeX, SkipBack, SkipForward, ArrowRight,
  Sparkles, Plus, Trash2, Shield, Eye, HelpCircle, Book, 
  FileText, CheckCircle, Info, Heart, ArrowUp, Music, ListCollapse
} from 'lucide-react';
import { getSermons, addSermon, deleteSermon } from '../services/localStorageService';
import { getTranslation } from '../translations';

// ============================================================
// DYNAMIC INTERNAL MULTI-LANG DICTIONARY FOR THEOLOGY FIDELITY
// ============================================================
const SERMON_TRANSLATIONS = {
  en: {
    badge: "Divine Proclamations",
    title: "Sanctuary Sermons",
    desc: "Nourish your spirit with our historical library of biblical declarations, liturgical messages, and apostolic teachings formulated to anchor your faith.",
    searchPlaceholder: "Search preachings, scriptures, or clergy...",
    noResults: "No Sacred Sermons Found",
    emptyState: "No Sermons Registered in Ledger Yet",
    emptyStateDesc: "Enter the Clergy Admin portal below to draft the first sacred teaching.",
    resultsOf: "of",
    resultsShowing: "Showing",
    resultsCount: "sermons recorded",
    
    // Player Labels
    playerTitle: "Active Scriptural Stream",
    playerHint: "Select any sermon below to anchor it in the live meditation deck.",
    playingState: "Channeling Word",
    pausedState: "Stream Paused",
    durationLabel: "Spiritual Duration",
    featuredBadge: "FEATURED TEACHING",
    versesTitle: "Covenant Scriptures to Study",
    
    // Detail/Notes Labels
    studyGuide: "Scripture Study Outline",
    keyTakeaway: "Liturgical Reflection",
    discussionQuestions: "Covenant Fellowship Discussion",
    prayerInspiration: "Sanctuary Prophetic Prayer Focus",
    
    // Admin Pane
    adminTitle: "Clergy Sermon Proclamation",
    adminSub: "Register newly preached sermons, liturgical commentary, and biblical texts.",
    addBtn: "Draft Proclamation",
    titleLabel: "Sermon Theme / Title",
    speakerLabel: "Preaching Bishop / Pastor",
    descLabel: "Core Message Overview",
    dateLabel: "Preaching Date",
    successMsg: "Sermon successfully proclaimed to the congregation!",
    enterPasscode: "Clergy Passcode Required",
    adminToggleName: "Clergy Administration Command",
    adminDisclaimer: "Attention: Authenticated clergy credentialing only. Aligns local database parameters."
  },
  am: {
    badge: "መለኮታዊ ስብከቶች",
    title: "የጸጋ ማደሪያ ስብከቶች",
    desc: "እምነትዎን ለማፅናት የተዘጋጁትን ቅዱሳት መጻሕፍትን፣ የአምልኮ መልእክቶችን እና የሐዋርያት ትምህርቶችን በማድመጥ መንፈስዎን ይመግቡ።",
    searchPlaceholder: "ስብከቶችን፣ የመጽሐፍ ቅዱስ ክፍሎችን ወይም ሰባኪዎችን ይፈልጉ...",
    noResults: "ምንም የተዛመደ ስብከት አልተገኘም",
    emptyState: "በመዝገቡ ላይ የተመዘገበ ስብከት የለም",
    emptyStateDesc: "የመጀመሪያውን የተቀደሰ ትምህርት ለማርቀቅ ከታች ያለውን የአገልጋዮች መግቢያ ይጠቀሙ።",
    resultsOf: "ከ",
    resultsShowing: "እየታዩ ያሉ ስብከቶች፡",
    resultsCount: "ስብከቶች ተመዝግበዋል",
    
    // Player
    playerTitle: "ገባሪ የመለኮታዊ ቃል ስርጭት",
    playerHint: "ስብከቱን ወደ ማጫወቻው ለማስገባት ከታች ካሉት አማራጮች አንዱን ይምረጡ።",
    playingState: "ቃሉ እየፈሰሰ ነው",
    pausedState: "ለጊዜው የቆመ",
    durationLabel: "የመልእክቱ ቆይታ",
    featuredBadge: "ዋናው ሳምንታዊ መልእክት",
    versesTitle: "ለጥናት የሚሆኑ የኪዳን ጥቅሶች",
    
    // Details
    studyGuide: "የቃሉ ጥናት መመሪያ outline",
    keyTakeaway: "የአምልኮ እና የቃል ማጠቃለያ",
    discussionQuestions: "የቤተሰብ እና የህብረት ውይይት ጥያቄዎች",
    prayerInspiration: "የቃል ኪዳን የጸሎት ትኩረት",
    
    // Admin
    adminTitle: "አዲስ ስብከት ማወጃ ሰሌዳ",
    adminSub: "አዲስ የተሰበኩ ስብከቶችን፣ ማብራሪያዎችን እና የመጽሐፍ ቅዱስ ጥቅሶችን ይመዝግቡ።",
    addBtn: "አዲስ ስብከት አውጅ",
    titleLabel: "የስብከቱ አርዕስት/ጭብጥ",
    speakerLabel: "ሰባኪው ፓስተር/እረኛ",
    descLabel: "የመልእክቱ ዋና ሃሳብ",
    dateLabel: "የተሰበከበት ቀን",
    successMsg: "መልእክቱ በተሳካ ሁኔታ ለምዕመናን ተሰራጭቷል!",
    enterPasscode: "የአገልጋይ የይለፍ ቃል ያስገቡ",
    adminToggleName: "የአገልጋዮች የቁጥጥር ሰሌዳ",
    adminDisclaimer: "ማስጠንቀቂያ፡ ይህ ሰሌዳ ይፋዊ ስብከቶችን ለመጨመር ወይም ለመቀነስ ያገለግላል። የአገልጋዮች ብቻ።"
  },
  om: {
    badge: "Lallaba Hafuuraa",
    title: "Lallaba Mana Amantaa",
    desc: "Barumsa dubbii Waaqayyoo, ergaa lallabaa fi kakuu haaraa amantii keessan jabeessuun dhaloota ijaaruuf qophaaye kanaan jabaadhaa.",
    searchPlaceholder: "Lallaba, caqasa ykn lallabaa barbaadi...",
    noResults: "Lallabni Qophaa’e Hin Argamne",
    emptyState: "Lallabni Galmeeffame Ammaaf Hin Jiru",
    emptyStateDesc: "Barumsa jalqabaa galmeessuuf gara tajaajila teessoo deemaa.",
    resultsOf: "keessaa",
    resultsShowing: "Agarsiisaa jira",
    resultsCount: "lallaba galmeeffaman",
    
    // Player
    playerTitle: "Sagalee Lallabaa Jiruu",
    playerHint: "Sagaleen lallabaa akka jalqabuuf kanneen gadii keessaa tokko filadhaa.",
    playingState: "Dubbii Waaqayyoo Dhagahuu",
    pausedState: "Yeroof Dhaabbateera",
    durationLabel: "Yeroo Lallabaa",
    featuredBadge: "LALLABA WIIXATA KANAA",
    versesTitle: "Caqasawwan Dubbii Kakuu Qorannoodhaaf",
    
    // Details
    studyGuide: "Qajeelfama Qorannoo Caqasaa",
    keyTakeaway: "Ibsa fi Xiinxala Lallabaa",
    discussionQuestions: "Gaaffii Hirmaannaa Maatii fi Tokkummaa",
    prayerInspiration: "Xiyyeeffannaa Kadhannaa Qulqulluu",
    
    // Admin
    adminTitle: "Galmeessu Lallaba Haaraa",
    adminSub: "Lallaba haaraa lallabame fi caqasawwan isaa hawaasaaf kabaajaan dhiyeessaa.",
    addBtn: "Lallaba Haaraa Proclami",
    titleLabel: "Mata-duree Lallabaa",
    speakerLabel: "Lallabaa / Paastorii",
    descLabel: "Ibsa Ergaa Lallabaa",
    dateLabel: "Guyyaa Lallabame",
    successMsg: "Lallabni milkiidhaan hawaasaaf dhiyaateera!",
    enterPasscode: "Sabaqa Passcode Galchi",
    adminToggleName: "Bulchiinsa Hoggantoota Lallabaa",
    adminDisclaimer: "Of-eeggannoo: Namoota mirkanaa'an qofaaf tajaajila. Galmee kan sirreessu dha."
  }
};

// Default custom structural scriptures matched dynamically based on titles to add massive design fidelity!
const SCRYPTURE_DB = {
  "The Blueprint of Faithful Stewardship": {
    reference: "Luke 16:10 / ሉቃስ 16:10 / Luqaas 16:10",
    text_en: "“Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.”",
    text_am: "“ከሁሉ በሚያንስ የታመነ በብዙ ደግሞ የታመነ ነው፥ ከሁሉ በሚያንስም ዓመፀኛ በብዙ ደግሞ ዓመፀኛ ነው።”",
    text_om: "“Inni waan xinnootti amaname, waan guddaattis immoo ni amanama; inni waan xinnootti jal'ises, waan guddaattis immoo ni jal'isa.”",
    takeaway_en: "Honor God with the micro-elements of life, work, and community. True spiritual leadership is born in quiet, unseen consistency.",
    takeaway_am: "በማንኛውም ትንሽ ነገር ውስጥ እግዚአብሔርን በታማኝነት ማገልገል። እውነተኛ መንፈሳዊ ብስለት የሚለካው በሰው እይታ ሳይሆን በታማኝነት ህይወት ነው።",
    takeaway_om: "Jireenya guyyaa guyyaa keessatti waan xinnoon amanamaa ta'uun eebba guddaaf sababa ta'a.",
    guide_steps_en: [
      "Assessing our personal devotion time and resource management.",
      "Cultivating selfless giving of talents to support the broken-hearted.",
      "Building reliable accountabilities within covenant home networks."
    ],
    guide_steps_am: [
      "ጊዜያችንን እና ሀብታችንን ለአምላክ ክብር እንዴት እየተጠቀምንበት እንደሆነ መፈተሽ።",
      "ችግረኞችን በሙያችን፣ በዕውቀታችንና በጉልበታችን በቅንነት መርዳት።",
      "በቤተክርስቲያን ህብረቶች ውስጥ ታማኝ እና የሚታመን ሰብዕና መገንባት።"
    ],
    guide_steps_om: [
      "Qabeenya fi yeroo keenya ulfina Waaqayyootiif akkamitti fayyadamaa akka jirru qorachuu.",
      "Tajaajila adda addaan obboloota gargaaruu.",
      "Hawaasa keessatti nama amanamu ta'anii argamuu."
    ],
    questions_en: [
      "What is one standard 'small area' in your schedule where you can introduce more transparent faithfulness?",
      "How does reliable stewardship change our external community outreach impact?"
    ],
    questions_am: [
      "በቅንነት ማገልገል የምትችልበት በዕለት ተዕለት ህይወትህ ውስጥ ያለህበት ትንሽ ስፍራ ምንድነው?",
      "ታማኝ መሆን የቤተክርስቲያንን ውጫዊ አገልግሎት በምን መልኩ ያግዛል?"
    ],
    questions_om: [
      "Amanamummaan keenya tajaajila hawaasummaatiif akkamitti daandii saaqaa?",
      "Waan xinnootti amanamuun maaliif rakkisaa ta'a?"
    ],
    prayer_en: "Heavenly Father, secure our hearts in relentless dependability. Anchor our daily activities in your beautiful service. Amen.",
    prayer_am: "ቅዱስ አባት ሆይ፤ በታማኝነት እና በቅንነት እንድንመላለስ ልባችንን አፅና። በዕለት ተዕለት ኑሯችን ክብርህን ለማሳየት እርዳን። አሜን።",
    prayer_om: "Yaa Gooftaa, jaalala fi amanamummaa keeynan akka deddeebinu onnee keenya nuuf jabeessi. Ameen."
  },
  "Anchored Through Uncharted Waters": {
    reference: "Hebrews 6:19 / ዕብራውያን 6:19 / Ibroota 6:19",
    text_en: "“We have this hope as an anchor for the soul, firm and secure. It enters the inner sanctuary behind the curtain.”",
    text_am: "“ይህም ተስፋ እንደ ነፍስ መልሕቅ አለን እርሱም የታመነና የጸና ነው ወደ መጋረጃውም ውስጥ ገባ።”",
    text_om: "“Abdiin kunis akka ejjetoo hafuura keenyaa ti, inni amansiisaa dha, jabaas dha; hulaa dunkaana qulqullummaa keessaa darbees gara keessaatti gad ni seena.”",
    takeaway_en: "When outward parameters surge with tempest levels, our internal baseline remains bound to God's eternal covenant.",
    takeaway_am: "በውጭ ያሉት ሞገዶች እና አውሎ ነፋሶች በሚበዙበት ጊዜ፣ የእኛ ውስጣዊ ተስፋ ከእግዚአብሔር ዘላለማዊ ኪዳን ጋር የተቆራኘ ነው።",
    takeaway_om: "Dhiphina guutuun yommuu nuyi marsinu, abdiin keenya Yesus Christos irratti qofa ijaarama.",
    guide_steps_en: [
      "Sovereign perspective: Reminding our minds of historical deliverance testimonies.",
      "Quiet solitude: Reserving at least 15 minutes of dynamic scriptural silence.",
      "Unified prayer: Standing together against spiritual fear and communal dread."
    ],
    guide_steps_am: [
      "መለኮታዊ እይታ፡ እግዚአብሔር ከዚህ ቀደም ካደረገልን ማዳን ጋር አእምሯችንን ማገናኘት።",
      "የጸጥታ ጊዜ፡ በቀን ቢያንስ ለ15 ደቂቃ ያህል በቃሉ ፊት ፀጥታን መለማመድ።",
      "የጋራ ጸሎት፡ ተባብሮ በመጸለይ ፍርሃትንና ጭንቀትን ድል ማድረግ።"
    ],
    guide_steps_om: [
      "Mul’ata gooftaa yaaduun of jabeessuu.",
      "Yeroo kadhannaa dhuunfaa qabaachuu.",
      "Hamaa hundaa kadhannaadhaan irratti ka'uu."
    ],
    questions_en: [
      "What particular 'uncharted storm' is challenging your equilibrium today?",
      "In what ways can we act as secondary human anchors to brethren currently drifting?"
    ],
    questions_am: [
      "ዛሬ በአንተ ላይ ትልቅ ተግዳሮት ሆኖ የተጋረጠው ማዕበል ምንድነው?",
      "እየተንገዳገዱ ያሉ ሰዎችን እምነት ለመደገፍ በምን መልኩ መልሕቅ መሆን እንችላለን?"
    ],
    questions_om: [
      "Maalutu amantii keessan raasaa jira?",
      "Obboloota dadhaban akkamitti gargaaruu dandeessu?"
    ],
    prayer_en: "Almighty Lord, when the earthly waters roar, whisper your deep peace into our cells. Keep us bound to the covenant anchor. Amen.",
    prayer_am: "ሁሉን የምትችል ጌታ ሆይ፤ የምድር ማዕበል በሚነሳበት ጊዜ ሰላምህን በውስጣችን አዝንብ። ከኪዳኑ መልሕቅ ጋር እንድንጸና አድርገን። አሜን።",
    prayer_om: "Yaa Gooftaa, dambaliin bishaanii yommuu raawwatu nagaa kee nuuf kenni. Si irrattis nu jabeessi. Ameen."
  }
};

const DEFAULT_SCRYPTURE = {
  reference: "Colossians 3:16 / ቆላስይስ 3:16 / Qolosaayis 3:16",
  text_en: "“Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom...”",
  text_am: "“የክርስቶስ ቃል በሙላት ይኑርባችሁ፤ በጥበብ ሁሉ እርስ በርሳችሁ አስተምሩና ገሥጹ...”",
  text_om: "“Dubbiin Kristos onnee keessan keessa guutee haa hafu; ogummaa kanaan wal tajaajilaa...”",
  takeaway_en: "Scriptural learning is not a spectator sport. Let the living logos infuse your decisions, community, and domestic sanctuary.",
  takeaway_am: "ቃሉን መማር ዝም ብሎ መስማት ብቻ አይደለም። ህያው የሆነው መለኮታዊ ቃል በውሳኔዎቻችን፣ በማህበራዊ ኑሯችንና በቤታችን እንዲገለጥ እንፍቀድ።",
  takeaway_om: "Dubbii Waaqayyoo baratanii hojiitti hiikuun bu’ura amantii keenyaati.",
  guide_steps_en: [
    "Reflecting carefully on the weekly proclamations during your quiet hours.",
    "Drafting personal study journal outlines to catalog biblical breakthroughs.",
    "Applying the teachings explicitly in marketplace ethics and relational dynamics."
  ],
  guide_steps_am: [
    "በሳምንቱ የተነገረውን ቃል በጸጥታ ጊዜ በጥንቃቄ ማሰላሰል።",
    "ቃሉን በግል ማስታወሻ ላይ በመጻፍ የተረዱትን መለኮታዊ እውነቶች መመዝገብ።",
    "ትምህርቱን በስራ ቦታ፣ በንግድ ስነ-ምግባር እና ከሰዎች ጋር ባለን ግንኙነት በተግባር መተርጎም።"
  ],
  guide_steps_om: [
    "Lallaba torbanii yaadan xiinxaluu.",
    "Yaadannoo dhuunfaa qopheeffachuu.",
    "Dubbicha hojii irra oolchuu."
  ],
  questions_en: [
    "How can you encourage a neighbor this week using a scripture verse you learned in assembly?",
    "Which aspect of the message challenged your traditional patterns of thinking?"
  ],
  questions_am: [
    "በጉባኤ ከተማርከው ጥቅስ ተነስተህ በዚህ ሳምንት ጎረቤትህን እንዴት ማበረታታት ትችላለህ?",
    "ከተነገረው መልእክት መካከል ቀድሞ የምታስብበትን መንገድ ፈታኝ የሆነብህ የትኛው ክፍል ነው?"
  ],
  questions_om: [
    "Caqasa barattaniin firas ta'ee mana keessan akkamitti jabeessuu dandeessu?",
    "Ergaa kana keessaa maaltu isin raase?"
  ],
  prayer_en: "Loving Master, make your word active and living in our actions. May we walk as moving testaments of your high calling. Amen.",
  prayer_am: "አፍቃሪ ጌታ ሆይ፤ ቃልህን በስራችን ሁሉ ህያው እና ተግባራዊ አድርገው። በቅዱስ ጥሪህ የታመንን ሆነን እንድንመላለስ እርዳን። አሜን።",
  prayer_om: "Yaa Gooftaa Gooftotaa, dubbii kee jireenya keenya keessatti akka mul’atu nu gargaari. Ameen."
};

export default function Sermons() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [sermons, setSermons] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedSermon, setExpandedSermon] = useState(null);
  
  // Custom Audio Player State Simulation
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(255); // simulated seconds (e.g., 4:15)
  const [trackVolume, setTrackVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const playerTimerRef = useRef(null);

  // Admin and Password UI State
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  
  // Form input states
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');

  // Spotlights coordinate tracing
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const getSermonScripture = (title) => {
    return SCRYPTURE_DB[title] || DEFAULT_SCRYPTURE;
  };

  // Helper local translations
  const t = (key) => {
    const dict = SERMON_TRANSLATIONS[lang] || SERMON_TRANSLATIONS.en;
    return dict[key] || getTranslation(lang, key) || key;
  };

  // Sync language with global trigger and local storage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch Sermons
  useEffect(() => {
    const loadSermons = () => {
      const list = getSermons();
      setSermons(list);
      // Default live player track to the latest sermon if available
      if (list.length > 0 && !currentTrack) {
        setCurrentTrack(list[0]);
      }
    };
    loadSermons();
    window.addEventListener('storage', loadSermons);
    return () => window.removeEventListener('storage', loadSermons);
  }, [currentTrack]);

  // Audio timer ticker simulation
  useEffect(() => {
    if (isPlaying) {
      playerTimerRef.current = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 2910) { // Max out at 48:30
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    }
    return () => {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playSermonInPlayer = (sermon) => {
    setCurrentTrack(sermon);
    setPlayProgress(Math.floor(Math.random() * 300) + 20); // random start state for fun
    setIsPlaying(true);
    // Smooth scroll back to active player at the top
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Admin authentication
  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.toLowerCase() === 'grace' || passcode.toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      setPasscodeError('');
      setPasscode('');
    } else {
      setPasscodeError('Invalid Clergy Credentials. Please try again.');
    }
  };

  // Proclaim a sermon
  const handleAddSermonSubmission = (e) => {
    e.preventDefault();
    if (!newTitle || !newSpeaker) {
      setPasscodeError('Please provide both a Title and Speaker name.');
      return;
    }

    const postedDate = newDate || new Date().toISOString().split('T')[0];
    const updatedSermons = addSermon({
      title: newTitle,
      speaker: newSpeaker,
      description: newDesc,
      date: postedDate
    });

    setSermons(updatedSermons);
    setNewTitle('');
    setNewSpeaker('');
    setNewDesc('');
    setNewDate('');
    
    setAdminSuccess(t('successMsg'));
    setTimeout(() => {
       setAdminSuccess('');
    }, 5000);
  };

  // Delete a sermon
  const handleDeleteSermonAction = (id) => {
    if (confirm('Delete this sermon from the congregational logs?')) {
      const updated = deleteSermon(id);
      setSermons(updated);
      if (currentTrack?.id === id) {
        setCurrentTrack(updated[0] || null);
        setIsPlaying(false);
      }
    }
  };

  const formatTrackTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filtered = sermons.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#07070F] text-gray-100 overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Visual Interactive Spotlights tracking cursor motion */}
      <div 
        className="absolute pointer-events-none rounded-full blur-[140px] opacity-[0.25] transition-all duration-300"
        style={{
          width: '500px',
          height: '500px',
          left: `${coords.x - 250}px`,
          top: `${coords.y - 250}px`,
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(99,102,241,0.05) 100%)',
        }}
      />
      
      {/* Stationary Ambient Blobs */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[150px] pointer-events-none" />

      {/* Grid Pattern Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* ══ HERO SECTION ══ */}
        <section className="text-center max-w-3xl mx-auto mb-14 mt-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold tracking-wider uppercase mb-5"
          >
            <BookOpen className="w-3.5 h-3.5 animate-pulse text-violet-400" />
            <span>{t('badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 font-sans"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-400 leading-relaxed font-sans mb-8"
          >
            {t('desc')}
          </motion.p>

          {/* Elegant Search Portal */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0C0C18]/90 border border-white/[0.08] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600/40 focus:border-violet-500/60 transition-all font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white transition-all bg-white/[0.05] hover:bg-white/[0.1] px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </motion.div>
        </section>

        {/* ══ THE ACTIVE DECK / AUDIO MEDIA INTERACTIVE CENTER ══ */}
        <AnimatePresence mode="wait">
          {currentTrack && (
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-14 overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#0A0A14]/90 backdrop-blur-3xl shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Visual player mockup card */}
                <div className="lg:col-span-5 bg-gradient-to-br from-violet-950/40 via-indigo-950/30 to-black/50 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.05]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase bg-violet-500/10 px-2 py-0.5 rounded-md">
                        {t('featuredBadge')}
                      </span>
                      <h4 className="mt-3 text-xs font-semibold tracking-wider text-gray-400 flex items-center gap-1.5 font-sans">
                        <Music className="w-3.5 h-3.5 text-violet-500 animate-bounce" />
                        <span>{t('playerTitle')}</span>
                      </h4>
                    </div>
                    
                    {/* Pulsing state indicator */}
                    <div className="flex items-center gap-2 bg-black/40 border border-white/[0.05] px-3 py-1 rounded-full text-[10px] text-gray-300">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                      <span>{isPlaying ? t('playingState') : t('pausedState')}</span>
                    </div>
                  </div>

                  {/* Core display metadata */}
                  <div className="my-8">
                    <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug mb-3">
                      {currentTrack.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-violet-400" />
                        <span className="font-medium text-gray-200">{currentTrack.speaker}</span>
                      </div>
                      <span className="text-white/10 hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{currentTrack.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic simulated equalizers jumping up and down when playing */}
                  <div className="flex items-end justify-between h-9 px-1 gap-1 mb-6 bg-black/20 rounded-xl p-3 border border-white/[0.02]">
                    {[...Array(24)].map((_, idx) => {
                      const heights = [10, 40, 70, 50, 85, 30, 90, 60, 45, 100, 75, 40, 80, 50, 95, 20, 60, 85, 40, 70, 90, 30, 50, 10];
                      const height = heights[idx % heights.length];
                      return (
                        <div 
                          key={idx} 
                          className="flex-grow rounded-sm bg-gradient-to-t from-indigo-500 to-violet-400 origin-bottom transition-all"
                          style={{
                            height: isPlaying ? `${height}%` : '5%',
                            transitionDuration: isPlaying ? `${150 + (idx % 5) * 80}ms` : '300ms',
                            opacity: isPlaying ? 0.85 : 0.2
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Interactive timeline scrubber controls */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>{formatTrackTime(playProgress)}</span>
                      <span>48:30</span>
                    </div>

                    {/* Progress Slider track container */}
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPercentage = (e.clientX - rect.left) / rect.width;
                        setPlayProgress(Math.floor(clickPercentage * 2910));
                      }}
                      className="group relative w-full h-1.5 bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-all"
                    >
                      <div 
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                        style={{ width: `${(playProgress / 2910) * 100}%` }}
                      />
                      <div 
                        className="absolute w-3 h-3 bg-white border-2 border-violet-600 rounded-full -top-0.5 -translate-x-1/2 group-hover:scale-125 transition-all shadow-md opacity-0 group-hover:opacity-100"
                        style={{ left: `${(playProgress / 2910) * 100}%` }}
                      />
                    </div>

                    {/* Player Trigger Buttons */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setPlayProgress(Math.max(0, playProgress - 15))}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-full cursor-pointer"
                          title="Skip back 15s"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={togglePlayPause}
                          className="p-2 text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 active:scale-90 transition-all rounded-full cursor-pointer"
                        >
                          {isPlaying ? (
                            <PauseCircle className="w-12 h-12 text-violet-500 hover:text-violet-400" />
                          ) : (
                            <PlayCircle className="w-12 h-12 text-violet-500 hover:text-violet-400" />
                          )}
                        </button>

                        <button 
                          onClick={() => setPlayProgress(Math.min(2910, playProgress + 15))}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-full cursor-pointer"
                          title="Skip forward 15s"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Sound volume controls */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1.5 text-gray-400 hover:text-white transition-all rounded"
                        >
                          {isMuted || trackVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-violet-400" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={isMuted ? 0 : trackVolume}
                          onChange={(e) => {
                            setTrackVolume(parseInt(e.target.value));
                            if (isMuted) setIsMuted(false);
                          }}
                          className="w-16 h-1 bg-white/15 hover:bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scripture Study Companion Section */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-black/20">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider text-violet-400 uppercase flex items-center gap-2 mb-4 font-sans">
                      <Book className="w-4 h-4" />
                      <span>{t('versesTitle')}</span>
                    </h3>

                    {/* Active scripture content block */}
                    <div className="bg-[#0D0D19]/70 border border-white/[0.04] p-5 sm:p-6 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 text-xs font-mono font-bold text-violet-500/20 group-hover:text-violet-500/30 transition-all select-none">
                        SCRIPTURE READINGS
                      </div>
                      
                      <div className="text-violet-300 font-serif text-sm italic mb-2 tracking-wide block">
                        {getSermonScripture(currentTrack.title).reference}
                      </div>

                      <blockquote className="text-gray-100 font-sans text-sm sm:text-base leading-relaxed tracking-wide font-normal">
                        {lang === 'am' ? getSermonScripture(currentTrack.title).text_am : lang === 'om' ? getSermonScripture(currentTrack.title).text_om : getSermonScripture(currentTrack.title).text_en}
                      </blockquote>

                      <div className="h-px bg-white/5 my-4" />

                      <div className="flex items-start gap-2 text-xs text-gray-400 font-sans">
                        <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-gray-300 block mb-0.5">{t('keyTakeaway')}</strong>
                          <span>
                            {lang === 'am' ? getSermonScripture(currentTrack.title).takeaway_am : lang === 'om' ? getSermonScripture(currentTrack.title).takeaway_om : getSermonScripture(currentTrack.title).takeaway_en}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Devotional application bullet points */}
                  <div className="mt-6 pt-6 border-t border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-300 tracking-wide uppercase flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-violet-400" />
                        <span>{t('studyGuide')}</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-400 pl-1">
                        {(lang === 'am' ? getSermonScripture(currentTrack.title).guide_steps_am : lang === 'om' ? getSermonScripture(currentTrack.title).guide_steps_om : getSermonScripture(currentTrack.title).guide_steps_en).slice(0, 2).map((step, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-violet-500 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-300 tracking-wide uppercase flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-violet-400" />
                        <span>{t('prayerInspiration')}</span>
                      </h4>
                      <p className="text-xs text-gray-400 italic">
                        {lang === 'am' ? getSermonScripture(currentTrack.title).prayer_am : lang === 'om' ? getSermonScripture(currentTrack.title).prayer_om : getSermonScripture(currentTrack.title).prayer_en}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.section>
          )}

          {!currentTrack && (
            <div className="p-6 bg-white/5 border border-white/[0.05] rounded-xl text-center text-gray-400 text-xs my-6">
              {t('playerHint')}
            </div>
          )}
        </AnimatePresence>

        {/* ══ CONGREGATIONAL ARCHIVE GRID ══ */}
        <section className="mt-12">
          
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              
              /* Empty state layout */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 px-4 bg-[#0A0A14]/70 border border-white/[0.04] rounded-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-600/10">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-light text-white mb-2 font-sans">
                  {search ? t('noResults') : t('emptyState')}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  {search ? "Adjust your query string to seek hidden liturgical records." : t('emptyStateDesc')}
                </p>
              </motion.div>
            ) : (
              
              /* Grid Layout */
              <motion.div
                key="grid-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((sermon, idx) => {
                  const isCurrent = currentTrack?.id === sermon.id;
                  const isSermonExpanded = expandedSermon === sermon.id;
                  const itemScripture = getSermonScripture(sermon.title);

                  return (
                    <motion.div
                      key={sermon.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      className={`relative flex flex-col justify-between overflow-hidden rounded-[20px] transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-[#100E22]/90 border border-violet-500/30 shadow-xl' 
                          : 'bg-[#0A0A14]/80 border border-white/[0.05] hover:bg-[#0E0E1C] hover:border-white/[0.1]'
                      }`}
                    >
                      {/* Top Accent Gradient Line */}
                      <div className={`h-1.5 w-full ${isCurrent ? 'bg-gradient-to-r from-violet-600 to-indigo-500' : 'bg-white/5'}`} />

                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Heading structure */}
                          <div className="flex items-start justify-between gap-1.5 mb-4">
                            <span className="text-[10px] font-mono tracking-wider text-gray-500">
                              {sermon.date}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded uppercase">
                                LOADED
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-light text-white tracking-tight leading-snug mb-3">
                            {sermon.title}
                          </h3>

                          {/* Preacher */}
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-sans">
                            <span className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-300">
                              {sermon.speaker.charAt(0)}
                            </span>
                            <span className="font-medium text-gray-300">{sermon.speaker}</span>
                          </div>

                          {/* Brief overview */}
                          {sermon.description && (
                            <p className="text-xs text-gray-500 leading-relaxed mb-4 font-sans">
                              {sermon.description}
                            </p>
                          )}
                        </div>

                        {/* Interactive Control buttons for individual cards */}
                        <div className="space-y-3 pt-4 border-t border-white/[0.04]">
                          <div className="flex items-center justify-between gap-2">
                            {/* Study Expand Trigger */}
                            <button
                              onClick={() => setExpandedSermon(isSermonExpanded ? null : sermon.id)}
                              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 active:scale-95 transition-all bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] px-2.5 py-1.5 rounded-lg cursor-pointer"
                            >
                              <ListCollapse className="w-3.5 h-3.5 text-violet-400" />
                              <span>{isSermonExpanded ? "Collapse study" : "Study guide"}</span>
                            </button>

                            {/* Stream now trigger */}
                            <button
                              onClick={() => playSermonInPlayer(sermon)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                                isCurrent && isPlaying
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                                  : 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-600/10 hover:scale-102 active:scale-95'
                              }`}
                            >
                              {isCurrent && isPlaying ? (
                                <>
                                  <PauseCircle className="w-3.5 h-3.5 animate-spin" />
                                  <span>Pause Deck</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>Stream Word</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Interactive accordions expand logic directly within card structure */}
                          <AnimatePresence>
                            {isSermonExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden bg-black/30 rounded-xl p-3 border border-white/[0.05] space-y-3 mt-2 text-[11px]"
                              >
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-violet-400 block uppercase tracking-wide">
                                    Scripture Reference:
                                  </span>
                                  <p className="text-gray-300 font-serif italic">
                                    {itemScripture.reference}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wide">
                                    Weekly Discussion:
                                  </span>
                                  <p className="text-gray-400">
                                    {lang === 'am' ? itemScripture.questions_am[0] : lang === 'om' ? itemScripture.questions_om[0] : itemScripture.questions_en[0]}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-violet-400 block uppercase tracking-wide">
                                    Practice Step:
                                  </span>
                                  <p className="text-gray-400">
                                    {lang === 'am' ? itemScripture.guide_steps_am[0] : lang === 'om' ? itemScripture.guide_steps_om[0] : itemScripture.guide_steps_en[0]}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Records Counter */}
          {sermons.length > 0 && (
            <p className="text-center text-xs text-gray-500 font-mono mt-8">
              {t('resultsShowing')} {filtered.length} {t('resultsOf')} {sermons.length} {t('resultsCount')}
            </p>
          )}
        </section>

        {/* ══ CLERGY EXCLUSIVE ADMINISTRATION INTERFACE ══ */}
        <section className="mt-20 border-t border-white/[0.06] pt-12">
          <div className="max-w-xl mx-auto rounded-3xl bg-[#090912]/80 border border-white/[0.05] p-6 sm:p-8 backdrop-blur-3xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="w-full justify-between items-center bg-[#0F0F1B] border border-white/[0.04] p-4 rounded-2xl hover:bg-[#141426] transition-all flex text-sm font-semibold tracking-wide text-gray-300 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-violet-400" />
                  <span>{t('adminToggleName')}</span>
                </div>
                <div className="text-xs text-violet-400 px-3 py-1 rounded-full bg-violet-400/10 border border-violet-500/15">
                  {showAdmin ? 'Hide Panel' : 'Access Gate'}
                </div>
              </button>
            </div>

            <AnimatePresence>
              {showAdmin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4 flex gap-3 text-xs text-yellow-200/80 leading-relaxed">
                    <Info className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <p>{t('adminDisclaimer')}</p>
                  </div>

                  {!isAdminAuthenticated ? (
                    
                    /* Password Credential gate */
                    <form onSubmit={handleVerifyPasscode} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                          {t('enterPasscode')}
                        </label>
                        <input
                          type="password"
                          placeholder="••••"
                          value={passcode}
                          onChange={e => setPasscode(e.target.value)}
                          className="w-full bg-[#111120] border border-white/[0.08] px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/40 text-center text-white"
                        />
                      </div>
                      
                      {passcodeError && (
                        <p className="text-xs text-rose-400 text-center font-bold">
                          {passcodeError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-violet-600 hover:bg-violet-500 transition-all font-bold text-xs rounded-xl tracking-wide text-white uppercase cursor-pointer"
                      >
                        Authenticate Clergy
                      </button>
                    </form>
                  ) : (
                    
                    /* Logged In Admin view with Add Form & List for Deletion */
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-light text-white mb-2">
                          {t('adminTitle')}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {t('adminSub')}
                        </p>
                      </div>

                      {adminSuccess && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>{adminSuccess}</span>
                        </div>
                      )}

                      <form onSubmit={handleAddSermonSubmission} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1.5">{t('titleLabel')}</label>
                            <input
                              type="text"
                              value={newTitle}
                              onChange={e => setNewTitle(e.target.value)}
                              placeholder="e.g. Walking in Divine Assurance"
                              className="w-full bg-[#111120] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1.5">{t('speakerLabel')}</label>
                            <input
                              type="text"
                              value={newSpeaker}
                              onChange={e => setNewSpeaker(e.target.value)}
                              placeholder="e.g. Pastor Marcus Vance"
                              className="w-full bg-[#111120] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">{t('descLabel')}</label>
                          <textarea
                            value={newDesc}
                            onChange={e => setNewDesc(e.target.value)}
                            placeholder="Briefly summarize the theological pillars addressed in this message..."
                            className="w-full h-20 bg-[#111120] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[#a5a5b5] text-xs mb-1.5">{t('dateLabel')}</label>
                          <input
                            type="date"
                            value={newDate}
                            onChange={e => setNewDate(e.target.value)}
                            className="w-full bg-[#111120] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-violet-600/10 active:scale-98 transition-all cursor-pointer"
                        >
                          {t('addBtn')}
                        </button>
                      </form>

                      {/* Deletion control list */}
                      <div className="pt-6 border-t border-white/[0.05]">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                          Current Sermon Registries
                        </h4>
                        
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                          {sermons.map(item => (
                            <div 
                              key={item.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-[#111120] border border-white/[0.04]"
                            >
                              <div className="min-w-0 pr-3">
                                <span className="text-[10px] text-gray-500 font-mono block">{item.date}</span>
                                <h5 className="text-xs text-white truncate font-medium">{item.title}</h5>
                                <span className="text-[10px] text-violet-400">{item.speaker}</span>
                              </div>
                              
                              <button
                                onClick={() => handleDeleteSermonAction(item.id)}
                                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg shrink-0 transition-all cursor-pointer"
                                title="Remove Sermon"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </main>
  );
}
