'use client';
import Link from 'next/link';

const NAV_LINKS = ['Home', 'Resources', 'About Us'];

const STEPS = [
  { icon: '🔍', title: 'Discover', desc: 'Find internships that match your skills.', color: 'bg-purple-100 text-purple-600' },
  { icon: '📋', title: 'Apply', desc: 'Easy application and tracking system.', color: 'bg-green-100 text-green-600' },
  { icon: '📈', title: 'Learn', desc: 'Gain practical exposure and new skills.', color: 'bg-yellow-100 text-yellow-600' },
  { icon: '🏆', title: 'Succeed', desc: 'Build your profile and achieve your career goals.', color: 'bg-purple-100 text-purple-600' },
];

const STATS = [
  { icon: '👥', value: '', label: 'Active Students', color: 'text-purple-600' },
  { icon: '💼', value: '', label: 'Live Internships', color: 'text-green-600' },
  { icon: '🏢', value: '', label: 'Partner Companies', color: 'text-yellow-500' },
  { icon: '⭐', value: '', label: 'Student Rating', color: 'text-purple-600' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-purple-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-lg font-bold text-gray-900">
            Field Finder <span className="font-normal text-gray-400">System</span>
          </span>
        </div>
        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className={`hover:text-purple-600 transition-colors ${link === 'Home' ? 'text-purple-600 font-semibold border-b-2 border-purple-600 pb-0.5' : ''}`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="/login" className="border border-purple-600 text-purple-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
            Login
          </Link>
          <Link href="/register" className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-yellow-50 via-white to-purple-50 px-8 pt-16 pb-0">
        {/* blobs */}
        <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 rounded-full bg-yellow-200 opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-200 opacity-30 blur-3xl" />

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 relative">

          {/* Left */}
          <div className="flex-1 pb-16">
          
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              Learn. Apply.<br />
              <span className="text-green-600">Grow</span> with Experience.
            </h1>
            <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
              Find the best internships, gain real-world experience,
              and build your successful future.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/internships"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md shadow-green-200"
              >
                Find Internships →
              </Link>
              <Link
                href="/register"
                className="border border-purple-500 text-purple-700 px-6 py-3 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                For Students 🎓
              </Link>
            </div>

            {/* Steps row */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STEPS.map((s) => (
                <div key={s.title}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 ${s.color}`}>
                    {s.icon}
                  </div>
                  <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image area with floating badges */}
          <div className="flex-1 relative flex justify-center items-end self-end">
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-green-100 opacity-50 blur-2xl" />

            {/* Hero image placeholder */}
            <div className="relative z-0 w-full max-w-md h-80 rounded-t-3xl bg-linear-to-br from-yellow-100 via-green-50 to-purple-100 flex items-center justify-center overflow-hidden">
              <span className="text-8xl select-none">👩‍💻</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-t border-b border-gray-100 py-8 px-8 shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust line ── */}
      <div className="bg-linear-to-r from-yellow-50 via-white to-purple-50 py-5 text-center text-sm text-gray-500 border-b border-gray-100">
        💛 Trusted by Students &nbsp;·&nbsp; 💜 Preferred by Companies &nbsp;·&nbsp; 💚 Powered by Opportunities
      </div>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 text-center text-sm py-6">
        © {new Date().getFullYear()} Field Finder System. All rights reserved.
      </footer>
    </main>
  );
}
