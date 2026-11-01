// pages/Landing.jsx
// Public homepage. Showcases NoteSpace features and directs users to register.

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, Zap, Shield, Search, ArrowRight,
  CheckCircle2, Star, Users, FileText
} from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Create, edit and search your notes instantly with a smooth, distraction-free interface.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your notes are protected with JWT authentication and bcrypt password hashing.',
    color: 'bg-emerald-50 text-emerald-500',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Find any note instantly by searching titles and content across your entire collection.',
    color: 'bg-sky-50 text-sky-500',
  },
  {
    icon: BookOpen,
    title: 'Organized Beautifully',
    desc: 'All your notes in one place, sorted by most recently updated for quick access.',
    color: 'bg-violet-50 text-violet-500',
  },
]

const steps = [
  { step: '01', title: 'Create an Account', desc: 'Sign up in seconds. No credit card required.' },
  { step: '02', title: 'Write Your First Note', desc: 'Click "New Note", add a title and content, save.' },
  { step: '03', title: 'Access Anywhere', desc: 'Your notes are synced and ready whenever you are.' },
]

const stats = [
  { icon: Users, label: 'Active Users', value: '10K+' },
  { icon: FileText, label: 'Notes Created', value: '500K+' },
  { icon: Star, label: 'Average Rating', value: '4.9/5' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-56 h-56 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-lavender border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8"
          >
            <Star className="w-3.5 h-3.5 fill-primary" />
            Beautifully designed for thinkers
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-navy leading-tight tracking-tight mb-6"
          >
            Your Thoughts.{' '}
            <span className="gradient-text">Organized</span>
            <br />
            Beautifully.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-secondary text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            NoteSpace is a modern, secure note-taking application. Capture ideas,
            organize thoughts, and access your notes from anywhere — instantly.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-navy font-medium hover:text-primary transition-colors text-base underline underline-offset-2"
            >
              Already have an account? Log in
            </button>
          </motion.div>
        </div>

        {/* Dashboard Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Mock browser bar */}
            <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4 bg-gray-200 rounded-md h-5 flex items-center px-3">
                <span className="text-gray-400 text-xs">notespace.app/dashboard</span>
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="flex h-64">
              {/* Sidebar */}
              <div className="w-48 border-r border-gray-100 p-4 bg-white hidden sm:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-gradient-primary rounded-md" />
                  <span className="font-bold text-navy text-sm">NoteSpace</span>
                </div>
                {['Dashboard', 'All Notes', 'Recent', 'Profile'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg mb-1 text-sm ${
                      i === 0 ? 'bg-lavender text-primary font-medium' : 'text-secondary'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-primary' : 'bg-gray-200'}`} />
                    {item}
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-5 bg-[#F7F8FC]">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['12 Notes', '3 Updated Today', 'All Synced'].map((s, i) => (
                    <div key={s} className="bg-white rounded-xl p-3 shadow-card">
                      <div className={`w-5 h-5 rounded-lg mb-2 ${['bg-primary', 'bg-emerald-400', 'bg-sky-400'][i]}`} />
                      <p className="text-navy text-xs font-semibold">{s}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Learning React', 'Project Ideas', 'Meeting Notes', 'Daily Journal'].map((t, i) => (
                    <div key={t} className={`${['bg-violet-50','bg-sky-50','bg-emerald-50','bg-amber-50'][i]} rounded-xl p-3 border ${['border-violet-100','border-sky-100','border-emerald-100','border-amber-100'][i]}`}>
                      <div className={`w-2 h-2 rounded-full mb-2 ${['bg-violet-400','bg-sky-400','bg-emerald-400','bg-amber-400'][i]}`} />
                      <p className="text-navy text-xs font-semibold">{t}</p>
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1.5 bg-gray-200 rounded w-full opacity-60" />
                        <div className="h-1.5 bg-gray-200 rounded w-3/4 opacity-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <motion.div key={label} {...fadeUp} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-lavender rounded-2xl mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-navy">{value}</p>
              <p className="text-secondary text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-navy mb-4">
              Everything you need to{' '}
              <span className="gradient-text">stay organized</span>
            </h2>
            <p className="text-secondary text-lg max-w-xl mx-auto">
              A powerful feature set wrapped in a clean, intuitive interface.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card card-hover p-6"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${f.color.split(' ')[0]}`}>
                  <f.icon className={`w-5 h-5 ${f.color.split(' ')[1]}`} />
                </div>
                <h3 className="font-semibold text-navy mb-2">{f.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-4xl font-bold text-navy mb-4">How It Works</h2>
            <p className="text-secondary text-lg">Get started in three simple steps.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <span className="text-white font-bold text-xl">{s.step}</span>
                </div>
                <h3 className="font-semibold text-navy text-lg mb-2">{s.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-14">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto"
            >
              Start Writing for Free <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 bg-navy text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">NoteSpace</span>
        </div>
        <p className="text-secondary text-sm">
          Your Thoughts. Organized Beautifully.
        </p>
        <p className="text-gray-600 text-xs mt-4">
          © {new Date().getFullYear()} NoteSpace. Built with React, Node.js & MongoDB.
        </p>
      </footer>
    </div>
  )
}

export default Landing
