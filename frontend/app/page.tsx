'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURES = [
  { icon: '🎯', title: 'Smart Matching', desc: 'Get matched with internships that fit your skills, course, and location.' },
  { icon: '⚡', title: 'Instant Apply', desc: 'One-click applications with your saved profile and documents.' },
  { icon: '📊', title: 'Track Progress', desc: 'Monitor every application from submitted to accepted in real time.' },
  { icon: '🏢', title: 'Top Companies', desc: 'Connect with verified companies offering quality placements.' },
  { icon: '📄', title: 'CV Manager', desc: 'Upload and manage your CV and documents all in one place.' },
  { icon: '🔔', title: 'Live Notifications', desc: 'Get instant alerts when your application status changes.' },
];
const STEPS = [
  { num: '1', title: 'Create Account', desc: 'Sign up as a student or company in seconds.', icon: '✍️' },
  { num: '2', title: 'Build Profile', desc: 'Add your course, skills, and upload your CV.', icon: '👤' },
  { num: '3', title: 'Browse & Apply', desc: 'Filter hundreds of listings and apply instantly.', icon: '🔍' },
  { num: '4', title: 'Get Hired', desc: 'Track your applications and land your placement.', icon: '🎉' },
];
const TESTIMONIALS = [
  { name: 'Amina K.', role: 'Computer Science Student', text: 'Found my dream internship in just 3 days. The matching system is incredibly accurate.', avatar: '👩🏾‍💻', stars: 5 },
  { name: 'Brian M.', role: 'Business Administration', text: 'The application tracking feature saved me so much stress. I always knew where I stood.', avatar: '👨🏽‍💼', stars: 5 },
  { name: 'Sarah T.', role: 'Engineering Student', text: 'Connected with a company I never would have found on my own. Highly recommend!', avatar: '👩🏻‍🔬', stars: 5 },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState({ students: 0, internships: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = { students: 1200, internships: 850 };
    const steps = 60; let step = 0;
    const t = setInterval(() => {
      step++;
      const p = step / steps;
      setCount({ students: Math.floor(targets.students * p), internships: Math.floor(targets.internships * p) });
      if (step >= steps) clearInterval(t);
    }, 33);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-green-700/95 backdrop-blur shadow-sm border-b border-green-800' : 'bg-green-600'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200">FF</div>
            <span className="font-bold text-lg">Field<span className="text-indigo-600">Finder</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <a href="#features" className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Features</a>
            <a href="#how" className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">How it works</a>
            <a href="#testimonials" className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">Reviews</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-colors">Get Started Free</Link>
          </div>
          <button className="md:hidden p-2 text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600 py-1">Features</a>
            <a href="#how" className="block text-sm text-gray-600 py-1">How it works</a>
            <a href="#testimonials" className="block text-sm text-gray-600 py-1">Reviews</a>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center text-sm border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl">Sign In</Link>
              <Link href="/register" className="flex-1 text-center text-sm bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -top-16 right-0 w-[400px] h-[400px] bg-purple-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-20 right-8 grid grid-cols-6 gap-2 opacity-20 pointer-events-none">
          {[...Array(36)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />)}
        </div>


        <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />Campus Internship Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Launch Your Career<br />
              <span className="relative inline-block">
                <span className="text-indigo-600">with the Right</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </span>
              <br />Internship
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mb-10 leading-relaxed">
              Connect with top companies, apply to internships, field training and attachments — all in one platform built for campus students.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
              <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">Get Started Free →</Link>
              <Link href="/login" className="border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 font-medium px-8 py-3.5 rounded-xl text-sm transition-all">Sign In</Link>
            </div>
            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['👩🏾‍💻','👨🏽‍💼','👩🏻‍🔬','👨🏿‍🎓'].map((e,i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-sm shadow-sm">{e}</div>
                ))}
              </div>
              <p className="text-sm text-gray-500"><span className="font-semibold text-gray-800">1,200+</span> students already placed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wave divider ── */}
      <div className="relative -mt-8 overflow-hidden">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full"><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f9fafb"/></svg>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute bottom-8 left-8 grid grid-cols-5 gap-2 opacity-10 pointer-events-none">
          {[...Array(25)].map((_, i) => <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full" />)}
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase border border-indigo-100">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">A complete toolkit for students to find, apply and track internship opportunities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm">{f.icon}</div>
                <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curved divider ── */}
      <div className="relative overflow-hidden bg-white">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full rotate-180"><path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f0f4ff"/></svg>
      </div>

      {/* ── How it works ── */}
      <section id="how" className="py-24 px-6 bg-[#f0f4ff] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block bg-white text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase border border-indigo-100 shadow-sm">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get started in 4 simple steps</h2>
            <p className="text-gray-400 mt-4">From signup to placement — it's fast and simple.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative group">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[65%] w-[70%] h-px bg-indigo-200 z-0">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-full" />
                  </div>
                )}
                <div className="relative bg-white rounded-2xl p-6 border border-indigo-100 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">{s.icon}</div>
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">{s.num}</div>
                  <h3 className="text-gray-900 font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[120px] font-serif text-indigo-50 pointer-events-none leading-none select-none">"</div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase border border-indigo-100">Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What students say</h2>
            <p className="text-gray-400 mt-4">Real stories from students who found their internships here.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
                <div className="text-3xl text-indigo-200 font-serif leading-none mb-3">"</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">{t.text}</p>
                <div className="flex gap-0.5 mb-4">{[...Array(t.stars)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-2xl">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-950 text-gray-500 py-2.5 px-6 z-40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-[10px]">FF</div>
            <span className="text-white font-semibold text-sm">Field<span className="text-green-400">Finder</span></span>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} Field Finder System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
