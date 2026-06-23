import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import Leadership from './pages/Leadership';  // ← ADDED
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import PrayerWall from './pages/PrayerWall';
import Gallery from './pages/Gallery';
import Annualplan from './pages/Annualplan';
import TestLang from './pages/Testlang';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/leadership" element={<Leadership />} />  {/* ← ADDED */}
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/annual-plan" element={<AnnualPlan />} />
          <Route path="/prayer" element={<PrayerWall />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/test-lang" element={<Testlang />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;