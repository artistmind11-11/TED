import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { ScrollToTop } from './components/ScrollToTop';

export function Website() {
  return (
    <div className="min-h-screen relative overflow-x-hidden grain-overlay">
      <Header />
      <main className="relative z-10">
        <Home />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
