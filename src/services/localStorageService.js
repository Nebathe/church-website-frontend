// Shared service for storing all church data

const STORAGE_KEYS = {
  SERMONS: 'church_sermons',
  EVENTS: 'church_events',
  PRAYER_REQUESTS: 'church_prayer_requests',
  GALLERY: 'church_gallery',
  SOCIAL_LINKS: 'church_social_links',
  BIBLE_VERSE: 'church_bible_verse'
};

// ============ SERMONS ============
export const getSermons = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SERMONS);
  return saved ? JSON.parse(saved) : [];
};

export const saveSermons = (sermons) => {
  localStorage.setItem(STORAGE_KEYS.SERMONS, JSON.stringify(sermons));
};

export const addSermon = (sermon) => {
  const sermons = getSermons();
  const newSermon = { 
    ...sermon, 
    id: Date.now(), 
    date: new Date().toLocaleDateString() 
  };
  const updated = [newSermon, ...sermons];
  saveSermons(updated);
  return updated;
};

export const deleteSermon = (id) => {
  const sermons = getSermons();
  const updated = sermons.filter(s => s.id !== id);
  saveSermons(updated);
  return updated;
};

// ============ EVENTS ============
export const getEvents = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return saved ? JSON.parse(saved) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

export const addEvent = (event) => {
  const events = getEvents();
  const newEvent = { ...event, id: Date.now() };
  const updated = [newEvent, ...events];
  saveEvents(updated);
  return updated;
};

export const deleteEvent = (id) => {
  const events = getEvents();
  const updated = events.filter(e => e.id !== id);
  saveEvents(updated);
  return updated;
};

// ============ PRAYER REQUESTS ============
export const getPrayerRequests = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.PRAYER_REQUESTS);
  return saved ? JSON.parse(saved) : [];
};

export const addPrayerRequest = (prayerRequest) => {
  const requests = getPrayerRequests();
  const newRequest = {
    ...prayerRequest,
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    status: 'pending', // pending, prayed, answered
    prayerCount: 0
  };
  const updated = [newRequest, ...requests];
  localStorage.setItem(STORAGE_KEYS.PRAYER_REQUESTS, JSON.stringify(updated));
  return updated;
};

export const prayForRequest = (id) => {
  const requests = getPrayerRequests();
  const updated = requests.map(req => {
    if (req.id === id) {
      return { ...req, prayerCount: (req.prayerCount || 0) + 1 };
    }
    return req;
  });
  localStorage.setItem(STORAGE_KEYS.PRAYER_REQUESTS, JSON.stringify(updated));
  return updated;
};

// ============ GALLERY ============
export const getGallery = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
  return saved ? JSON.parse(saved) : [];
};

export const addGalleryImage = (image) => {
  const gallery = getGallery();
  const newImage = { 
    ...image, 
    id: Date.now(), 
    date: new Date().toLocaleDateString(),
    url: image.imageData || image.url // Store base64 image
  };
  const updated = [...gallery, newImage];
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
  return updated;
};

export const deleteGalleryImage = (id) => {
  const gallery = getGallery();
  const updated = gallery.filter(img => img.id !== id);
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
  return updated;
};

// ============ BACKEND API CALLS ============
const API_URL = 'http://localhost:5000/api';

// Prayer Requests API
export const fetchPrayersFromBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/prayers`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch prayers:', error);
    return [];
  }
};

export const submitPrayerToBackend = async (prayerData) => {
  try {
    const response = await fetch(`${API_URL}/prayers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prayerData)
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to submit prayer:', error);
    throw error;
  }
};

export const prayForPrayerBackend = async (id) => {
  try {
    const response = await fetch(`${API_URL}/prayers/${id}/pray`, {
      method: 'PUT'
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to pray:', error);
    throw error;
  }
};

export const deletePrayerBackend = async (id) => {
  try {
    const response = await fetch(`${API_URL}/prayers/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to delete:', error);
    throw error;
  }
};
// ============ SOCIAL LINKS ============
const DEFAULT_SOCIAL_LINKS = {
  facebook: 'https://facebook.com/yourchurch',
  youtube: 'https://youtube.com/yourchurch',
  telegram: 'https://t.me/yourchurch',
  instagram: 'https://instagram.com/yourchurch',
  tiktok: ''
};

export const getSocialLinks = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS);
  return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_LINKS;
};

export const saveSocialLinks = (links) => {
  localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(links));
};

// ============ BIBLE VERSE ============
const DEFAULT_BIBLE_VERSES = [
  { verse: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", amharic: "ኤርምያስ 29:11", oromo: "Yeremiyaas 29:11" },
  { verse: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", amharic: "ፊልጵስዩስ 4:13", oromo: "Filippiyos 4:13" },
  { verse: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", amharic: "መዝሙር 23:1", oromo: "Faarfannaa 23:1" },
  { verse: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him.", amharic: "ሮሜ 8:28", oromo: "Roomaa 8:28" },
  { verse: "John 3:16", text: "For God so loved the world that he gave his one and only Son.", amharic: "ዮሐንስ 3:16", oromo: "Yohannis 3:16" }
];

export const getBibleVerse = () => {
  const saved = localStorage.getItem(STORAGE_KEYS.BIBLE_VERSE);
  if (saved) {
    return JSON.parse(saved);
  }
  // Set default verse of the day based on day of year
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % DEFAULT_BIBLE_VERSES.length;
  return DEFAULT_BIBLE_VERSES[dayOfYear];
};

export const updateBibleVerse = (verse) => {
  localStorage.setItem(STORAGE_KEYS.BIBLE_VERSE, JSON.stringify(verse));
};
// ============ LEADERSHIP ============
export const getLeaders = () => {
  const saved = localStorage.getItem('church_leaders');
  if (saved) return JSON.parse(saved);
  
  // Default/sample leaders (you can edit these)
  const defaultLeaders = {
    founders: [
      {
        id: 1,
        name: "Pastor Lako Bedasso",
        role: "Founder & President",
        amharicRole: "መስራች እና ፕሬዚዳንት",
        oromoRole: "Hundeeffataa fi Pireezidaantii",
        description: "Founding pastor with over 30 years of ministry experience, dedicated to spreading the Gospel across Ethiopia.",
        amharicDesc: "ከ30 ዓመታት በላይ የአገልግሎት ልምድ ያለው መስራች ፓስተር፣ በመላ ኢትዮጵያ ወንጌልን ለማስፋፋት የተሰጠ።",
        oromoDesc: "Phaastora hundeeffataa waggaa 30 ol tajaajila qabu, Itiyoophiyaa keessatti Wangeela babal'isuuf of kenne.",
        image: null,
        isFounder: true
      }
    ],
    currentLeaders: [
      {
        id: 2,
        name: "Pastor Leweyehu Sinshaw",
        role: "Vice President",
        amharicRole: "ምክትል ፕሬዚዳንት",
        oromoRole: "Varayii Pireezidaantii",
        description: "Visionary leader overseeing church administration and pastoral care.",
        amharicDesc: "የቤተክርስቲያን አስተዳደር እና የእረኝነት እንክብካቤን የሚቆጣጠር ራዕይ ያለው መሪ።",
        oromoDesc: "Bulchiinsa waldaa fi kunuunsa tiksee to'atu geggeessaa mul'ata qabu.",
        image: null
      },
      {
        id: 3,
        name: "Pastor Tarekegn Umeta",
        role: "Gospel Mission Director",
        amharicRole: "የወንጌል ሚሽን ዳይሬክተር",
        oromoRole: "Daayirektar Ergaa Wangeelaa",
        description: "Leading evangelism and church planting efforts nationwide.",
        amharicDesc: "በአገር አቀፍ ደረጃ የወንጌል ስርጭት እና የቤተክርስቲያን መመስረት ጥረቶችን ይመራሉ።",
        oromoDesc: "Tajaajila wangeela babal'isuu fi waldaa dhaabuun biyya guutuu geggeessa.",
        image: null
      }
    ]
  };
  
  localStorage.setItem('church_leaders', JSON.stringify(defaultLeaders));
  return defaultLeaders;
};

export const saveLeaders = (leaders) => {
  localStorage.setItem('church_leaders', JSON.stringify(leaders));
};

export const addLeader = (leader, type) => {
  const leaders = getLeaders();
  const newLeader = { ...leader, id: Date.now() };
  if (type === 'founder') {
    leaders.founders.push(newLeader);
  } else {
    leaders.currentLeaders.push(newLeader);
  }
  saveLeaders(leaders);
  return leaders;
};

export const deleteLeader = (id, type) => {
  const leaders = getLeaders();
  if (type === 'founder') {
    leaders.founders = leaders.founders.filter(l => l.id !== id);
  } else {
    leaders.currentLeaders = leaders.currentLeaders.filter(l => l.id !== id);
  }
  saveLeaders(leaders);
  return leaders;
};
// ============ PILLARS ============
export const getPillars = () => {
  const saved = localStorage.getItem('church_pillars');
  if (saved) return JSON.parse(saved);
  const defaultPillars = [
    { id: 'mission', title: 'Our Mission', description: 'To reach, restore, and release people to their God-given destiny.', extendedDescription: 'We fulfill this by actively prioritizing horizontal small-group networks across communities, discipling believers systematically, and mobilizing individuals to walk out their unique local and global purposes.' },
    { id: 'vision', title: 'Our Vision', description: 'To see communities transformed by the undeniable love and power of God.', extendedDescription: 'We envision cultural environments dynamically shaped by Christ-centered values—where the gospel brings restorative answers to families, local commerce, academic arenas, and community developments.' },
    { id: 'faith', title: 'Our Faith Statement', description: 'Unwavering commitment to scriptural truth, grace, and Christ-centered worship.', extendedDescription: 'We believe firmly in the inerrant authority of the Holy Scriptures, structural accountability within the household of faith, justification by grace, and ongoing alignment with the Holy Spirit.' }
  ];
  localStorage.setItem('church_pillars', JSON.stringify(defaultPillars));
  return defaultPillars;
};

export const savePillars = (pillars) => {
  localStorage.setItem('church_pillars', JSON.stringify(pillars));
};