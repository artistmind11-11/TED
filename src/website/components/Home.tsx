import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ArrowRight, Shield, Lock, Globe, Users, FileText, TrendingUp, CheckCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isInView };
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: string; suffix?: string; prefix?: string }) {
  const { ref, isInView } = useInView();
  return (
    <span ref={ref} className={`transition-all duration-700 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
      {prefix}{value}{suffix}
    </span>
  );
}

export function Home() {
  const hero = useInView();
  const services = useInView();
  const process = useInView();
  const philosophy = useInView();
  const testimonials = useInView();
  const contact = useInView();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3000);
  };

  return (
    <div className="flex flex-col bg-premium-bg">

      {/* ===== HERO ===== */}
      <section ref={hero.ref} className="relative min-h-[92vh] flex flex-col justify-center items-center text-center overflow-hidden pt-24 pb-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_desk.png"
            alt="Executive Desk"
            className="w-full h-full object-cover opacity-40 dark:opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-premium-bg/80 via-premium-bg/40 to-premium-bg" />
        </div>

        <div className={`relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center gap-8 ${hero.isInView ? '' : ''}`}>
          {/* Eyebrow */}
          <div className={`flex items-center gap-3 ${hero.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
            <div className="w-8 h-[1px] bg-premium-gold" />
            <span className="text-premium-gold uppercase tracking-[0.3em] text-[10px] font-normal">
              Institutional-Grade Support
            </span>
            <div className="w-8 h-[1px] bg-premium-gold" />
          </div>

          {/* Headline */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-display font-light tracking-tight leading-[0.95] ${hero.isInView ? 'animate-fade-up delay-100' : 'opacity-0'}`}>
            Silent{' '}
            <span className="font-serif italic text-premium-gold font-normal">
              Execution
            </span>
          </h1>

          {/* Subtext */}
          <p className={`text-base md:text-lg text-premium-muted font-light leading-relaxed max-w-xl ${hero.isInView ? 'animate-fade-up delay-200' : 'opacity-0'}`}>
            We operate as a seamless extension of your executive office — 
            maintaining the highest standards of discretion and governance 
            for GCC's most demanding principals.
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row gap-4 mt-4 ${hero.isInView ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
            <Link to="/login" className="premium-button-primary flex items-center justify-center gap-3 group px-10 py-4">
              Secure Portal
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <a href="#services" className="premium-button-secondary flex items-center justify-center gap-3 px-10 py-4">
              Our Protocols
            </a>
          </div>

          {/* Trust indicators */}
          <div className={`flex flex-wrap justify-center gap-8 mt-8 ${hero.isInView ? 'animate-fade-up delay-500' : 'opacity-0'}`}>
            {[
              { icon: Shield, label: 'AES-256 Encrypted' },
              { icon: Lock, label: 'NDA Protected' },
              { icon: Globe, label: 'GCC Coverage' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-premium-muted">
                <Icon size={13} className="text-premium-gold" />
                <span className="text-[10px] uppercase tracking-[0.15em] font-normal">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-5 h-8 border border-premium-border rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-premium-gold rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY BAR ===== */}
      <section className="py-12 border-y border-premium-border bg-premium-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6">
            {['DIFC Registered', 'ADGM Compliant', 'DFSA Standards', 'ISO 27001', 'SOC 2 Type II'].map((badge) => (
              <span key={badge} className="text-[10px] uppercase tracking-[0.2em] text-premium-muted font-normal opacity-60 hover:opacity-100 transition-opacity duration-300">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" ref={services.ref} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className={`text-premium-gold uppercase tracking-[0.3em] text-[10px] font-normal block mb-4 ${services.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
              What We Do
            </span>
            <h2 className={`text-3xl md:text-5xl font-display font-light tracking-tight ${services.isInView ? 'animate-fade-up delay-100' : 'opacity-0'}`}>
              Governance Without{' '}
              <span className="font-serif italic text-premium-gold">Compromise</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceData.map((s, i) => (
              <div
                key={i}
                className={`premium-card group cursor-pointer p-8 flex flex-col gap-6 ${services.isInView ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-[3px] bg-premium-gold-soft flex items-center justify-center group-hover:bg-premium-gold transition-colors duration-500">
                  <s.icon size={18} className="text-premium-gold group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-display font-normal tracking-wide">{s.title}</h3>
                  <p className="text-sm text-premium-muted font-light leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-premium-border-subtle flex flex-wrap gap-2">
                  {s.features.map((f, fi) => (
                    <span key={fi} className="text-[9px] bg-premium-surface text-premium-muted px-2.5 py-1 rounded-sm uppercase tracking-wider font-normal">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section id="process" ref={process.ref} className="py-24 md:py-32 bg-premium-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className={`text-premium-gold uppercase tracking-[0.3em] text-[10px] font-normal block mb-4 ${process.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
              How It Works
            </span>
            <h2 className={`text-3xl md:text-5xl font-display font-light tracking-tight ${process.isInView ? 'animate-fade-up delay-100' : 'opacity-0'}`}>
              Three Steps to{' '}
              <span className="font-serif italic text-premium-gold">Integration</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[1px] bg-premium-border z-0" />

            {processSteps.map((step, i) => (
              <div
                key={i}
                className={`relative z-10 flex flex-col items-center text-center gap-5 ${process.isInView ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(i + 2) * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-premium-card border-2 border-premium-gold flex items-center justify-center text-premium-gold font-display font-normal text-sm shadow-md">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-display font-normal tracking-wide uppercase">{step.title}</h3>
                <p className="text-sm text-premium-muted font-light leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section id="philosophy" ref={philosophy.ref} className="py-24 md:py-32 relative overflow-hidden bg-charcoal text-white">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/abstract_gold.png"
            alt="Abstract Gold Background"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-charcoal/90" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            <div className={`space-y-10 ${philosophy.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
              <div>
                <span className="text-white/60 uppercase tracking-[0.3em] text-[10px] font-normal block mb-6">
                  The Philosophy
                </span>
                <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight leading-[0.95] text-white">
                  Discretion{' '}
                  <span className="font-serif italic text-gold">by Default</span>
                </h2>
              </div>

              <div className="space-y-6 text-white/70 font-light text-sm md:text-base leading-relaxed max-w-md">
                <p>
                  Founded on the principle that elite support should be felt, not heard. We specialize in navigating the complexities of high-stakes executive environments across the GCC.
                </p>
                <p>
                  Every interaction is smooth, every document is secure, and every deadline is met with absolute precision.
                </p>
              </div>

              <div className={`flex gap-12 pt-8 border-t border-white/10 ${philosophy.isInView ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
                <div>
                  <div className="text-4xl font-display font-light tracking-tight text-white mb-1">
                    <AnimatedCounter value="0%" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-normal">Information Leak</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-light tracking-tight text-white mb-1">
                    <AnimatedCounter value="24/7" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-normal">Availability</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-light tracking-tight text-white mb-1">
                    <AnimatedCounter value="100" suffix="+" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-normal">Principals Served</div>
                </div>
              </div>
            </div>

            {/* Right Image Panel */}
            <div className={`relative h-[500px] ${philosophy.isInView ? 'animate-fade-up delay-200' : 'opacity-0'}`}>
              <img src="/abstract_gold.png" alt="Abstract Art" className="w-full h-full object-cover rounded-[3px] grayscale opacity-40 mix-blend-screen" />
              <div className="absolute inset-4 md:inset-8 border border-white/10 rounded-[3px] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section ref={testimonials.ref} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className={`text-premium-gold uppercase tracking-[0.3em] text-[10px] font-normal block mb-4 ${testimonials.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
              Trust Indicators
            </span>
            <h2 className={`text-3xl md:text-5xl font-display font-light tracking-tight ${testimonials.isInView ? 'animate-fade-up delay-100' : 'opacity-0'}`}>
              Voices of{' '}
              <span className="font-serif italic text-premium-gold">Confidence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialData.map((t, i) => (
              <div
                key={i}
                className={`premium-card p-8 flex flex-col gap-6 ${testimonials.isInView ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className="text-3xl font-serif text-premium-gold leading-none">"</div>
                <p className="text-sm text-premium-muted font-light leading-relaxed italic flex-1">{t.quote}</p>
                <div className="pt-4 border-t border-premium-border-subtle">
                  <div className="text-xs font-display font-normal uppercase tracking-wider">{t.name}</div>
                  <div className="text-[10px] text-premium-muted mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" ref={contact.ref} className="py-24 md:py-32 bg-premium-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className={`space-y-8 ${contact.isInView ? 'animate-fade-up' : 'opacity-0'}`}>
              <div>
                <span className="text-premium-gold uppercase tracking-[0.3em] text-[10px] font-normal block mb-4">
                  Get in Touch
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-light tracking-tight">
                  Begin a{' '}
                  <span className="font-serif italic text-premium-gold">Conversation</span>
                </h2>
              </div>
              <p className="text-sm text-premium-muted font-light leading-relaxed max-w-md">
                All inquiries are handled under strict confidentiality. Initial consultations are complimentary and conducted under NDA.
              </p>

              <div className="space-y-5 pt-4">
                {[
                  { label: 'Dubai, UAE', detail: 'DIFC Gate Village' },
                  { label: 'Riyadh, KSA', detail: 'King Abdullah Financial District' },
                  { label: 'Email', detail: 'counsel@theexecutivedesk.com' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-1 h-1 rounded-full bg-premium-gold mt-2 shrink-0" />
                    <div>
                      <div className="text-xs font-display font-normal uppercase tracking-wider">{item.label}</div>
                      <div className="text-sm text-premium-muted font-light mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${contact.isInView ? 'animate-fade-up delay-200' : 'opacity-0'}`}>
              <form onSubmit={handleSubmit} className="premium-card p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-premium-muted font-normal">Full Name</label>
                  <input
                    type="text"
                    required
                    className="premium-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-premium-muted font-normal">Email Address</label>
                  <input
                    type="email"
                    required
                    className="premium-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.15em] text-premium-muted font-normal">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="premium-input resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="premium-button-primary w-full py-4 flex items-center justify-center gap-3 group"
                  disabled={formSent}
                >
                  {formSent ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={14} /> Message Sent
                    </span>
                  ) : (
                    <>
                      Send Inquiry
                      <Send size={12} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-[9px] text-premium-muted text-center uppercase tracking-wider">
                  All communications encrypted · NDA protected
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==================
   DATA
   ================== */
const serviceData = [
  {
    title: 'Governance & Compliance',
    icon: FileText,
    desc: 'Board pack preparation, entity management, and regulatory compliance coordination across UAE and KSA.',
    features: ['DIFC/ADGM', 'Board Minutes', 'AML Support'],
  },
  {
    title: 'Cross-Border Operations',
    icon: Globe,
    desc: 'Seamless coordination for family offices and C-suite principals moving between GCC capitals and global hubs.',
    features: ['Entity Setup', 'Protocol', 'Aviation'],
  },
  {
    title: 'Strategic Support',
    icon: TrendingUp,
    desc: 'Supporting complex deal flows, high-stakes negotiations, and special projects with analytical precision.',
    features: ['Due Diligence', 'CRM', 'Pipeline'],
  },
];

const processSteps = [
  { title: 'Engage', desc: 'Confidential initial consultation under NDA to understand your operational requirements and governance structure.' },
  { title: 'Integrate', desc: 'Seamless onboarding into your existing workflows with encrypted communication channels and access protocols.' },
  { title: 'Execute', desc: 'Ongoing support with real-time oversight, transparent reporting, and institutional-grade deliverables.' },
];

const testimonialData = [
  {
    quote: 'They became invisible infrastructure — always there when needed, never in the way. The level of discretion is unmatched in the region.',
    name: 'Managing Director',
    role: 'Family Office, Dubai',
  },
  {
    quote: 'Our board pack preparation time dropped by 60%. The governance layer they provide is genuinely institutional-grade.',
    name: 'Group CEO',
    role: 'Holding Company, Riyadh',
  },
  {
    quote: 'Cross-border entity coordination that used to take weeks now happens in days. The protocol adherence is exceptional.',
    name: 'Chief of Staff',
    role: 'Sovereign Fund, Abu Dhabi',
  },
];
