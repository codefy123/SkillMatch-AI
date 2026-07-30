import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  ScanSearch,
  Target,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  CheckCircle2,
  FileText,
  Building2,
  GraduationCap,
  Clock,
  Zap,
} from "lucide-react";

const springUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

function Navbar({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Students", href: "#students" },
    { label: "HR", href: "#hr" },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between rounded-full border border-zinc-200/80 bg-white/70 backdrop-blur-xl shadow-sm px-4 py-2.5">
          
          {/* Updated Minimalist Typographic Logo */}
          <a href="#top" className="flex items-center gap-1 group pl-2">
            <span className="font-black text-xl tracking-tighter text-zinc-900 group-hover:text-emerald-700 transition-colors duration-300">
              SkillMatch
            </span>
            <div className="flex items-end h-full pb-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]"></div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            {user ? (
              <button
                onClick={() => navigate(user.role === 'hr' ? '/hr' : '/student')}
                className="rounded-full bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-zinc-950 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-zinc-700"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 flex flex-col gap-1 rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl shadow-sm p-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => { setOpen(false); navigate(user.role === 'hr' ? '/hr' : '/student'); }}
                className="mt-1 rounded-lg bg-zinc-950 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-zinc-950 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function MagneticButton({ href, children, variant = "primary", isLink = false }) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
      : "border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400";

  if (isLink) {
    return (
      <motion.div
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link to={href} className={`${base} ${styles}`}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.a>
  );
}

function Hero() {
  return (
    <section id="top" className="px-4 sm:px-6 pt-40 pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div
              variants={springUp}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Built for placement teams &amp; students
            </motion.div>

            {/* Updated Professional Headline */}
            <motion.h1
              variants={springUp}
              className="mt-6 text-5xl sm:text-6xl lg:text-[4.2rem] font-bold leading-[1.02] tracking-tight text-zinc-950"
            >
              Eliminate manual
              <br />
              resume screening.
            </motion.h1>

            <motion.p
              variants={springUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600"
            >
              Set a minimum match score for any job description. SkillMatch AI
              scores and routes every resume automatically — and tells every
              student exactly which skills are keeping them out.
            </motion.p>

            <motion.div variants={springUp} className="mt-9 flex flex-wrap gap-3">
              <MagneticButton href="/signup" variant="primary" isLink={true}>
                Deploy for HR
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="/login" variant="secondary" isLink={true}>
                Check Your Score
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={springUp}
              className="mt-10 flex items-center gap-6 text-sm text-zinc-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                No spreadsheets
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Instant feedback
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.15 }}
            className="relative"
          >
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-md overflow-hidden">
              <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                <span className="ml-3 text-xs font-medium text-zinc-400">
                  Backend Engineer, L2 — Applicant Pipeline
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-zinc-500">
                    Minimum match threshold
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    75%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-100 mb-6">
                  <div className="h-1.5 w-3/4 rounded-full bg-emerald-600" />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white">
                      AR
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        Ananya R.
                      </p>
                      <p className="text-xs text-zinc-500">Applied for SDE II</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700">92%</p>
                    <p className="text-[11px] text-zinc-500">match score</p>
                  </div>
                </motion.div>

                <div className="mt-2.5 flex items-center gap-2 pl-1">
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">
                    Auto-routed to shortlist
                  </span>
                </div>

                {[
                  { name: "Rohit V.", role: "SDE II", score: 81, status: "Shortlisted" },
                  { name: "Meera D.", role: "SDE II", score: 58, status: "Below threshold" },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="mt-2.5 flex items-center justify-between rounded-xl border border-zinc-100 p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-800">
                          {c.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Applied for {c.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          c.score >= 75 ? "text-emerald-700" : "text-zinc-400"
                        }`}
                      >
                        {c.score}%
                      </p>
                      <p className="text-[11px] text-zinc-400">{c.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 220, damping: 20 }}
              className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-md"
            >
              <Zap className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">4.2s</p>
                <p className="text-[10px] text-zinc-500">per resume, avg.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 py-24 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={springUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            The Engine
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            One engine. Two very different jobs.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-4 md:grid-cols-3 md:grid-rows-2"
        >
          <motion.div
            variants={springUp}
            whileHover={{ y: -4 }}
            className="md:row-span-2 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm flex flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <SlidersHorizontal className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-950">
              Dynamic Threshold Routing
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
              Set a minimum match score per JD — 70%, 85%, whatever the role
              demands. Candidates are routed, ranked, or held back
              automatically, no spreadsheet required.
            </p>

            <div className="mt-auto pt-8 space-y-2">
              {["Frontend Engineer", "Data Analyst", "Product Designer"].map(
                (jd, i) => (
                  <div
                    key={jd}
                    className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2"
                  >
                    <span className="text-xs font-medium text-zinc-600">
                      {jd}
                    </span>
                    <span className="text-xs font-semibold text-zinc-900">
                      {[80, 70, 75][i]}%
                    </span>
                  </div>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            variants={springUp}
            whileHover={{ y: -4 }}
            className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                  <ScanSearch className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-950">
                  Automated Resume Parsing &amp; Scoring
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-zinc-600">
                  Every resume is parsed for real skills, tools, and
                  experience, then scored against the JD in seconds —
                  consistent and explainable.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1.5 pt-1">
                <FileText className="h-5 w-5 text-zinc-300" />
                <span className="text-2xl font-bold tracking-tight text-zinc-950">
                  248
                </span>
                <span className="text-[11px] text-zinc-400">
                  resumes / batch
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={springUp}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <Clock className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-950">
              Hours back, every week
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
              Teams cut screening time from days to minutes without lowering
              the bar.
            </p>
          </motion.div>

          <motion.div
            variants={springUp}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
              <Target className="h-5 w-5 text-emerald-700" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-950">
              Actionable Skill-Gap Analysis
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
              Students get a ranked list of exactly what's missing — not a
              vague rejection.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 sm:px-6 py-24 border-t border-zinc-200">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={springUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            How it works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Two sides of the same screen
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <motion.div
            id="hr"
            variants={springUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950">
                <Building2 className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">For Recruiters</p>
                <h3 className="text-base font-semibold text-zinc-950">
                  The HR view
                </h3>
              </div>
            </div>

            <ol className="mt-6 space-y-4">
              {[
                { t: "Upload the JD", d: "Paste the job description and set your minimum match threshold." },
                { t: "Let the engine score", d: "Every incoming resume is parsed and scored the moment it arrives." },
                { t: "Review the shortlist", d: "Only candidates above threshold surface — ranked and ready to interview." },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-600">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {step.t}
                    </p>
                    <p className="text-sm text-zinc-500 mt-0.5">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            id="students"
            variants={springUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                <GraduationCap className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">For Students</p>
                <h3 className="text-base font-semibold text-zinc-950">
                  The student view
                </h3>
              </div>
            </div>

            <ol className="mt-6 space-y-4">
              {[
                { t: "Submit your resume", d: "Apply as usual — your resume is scored the moment you submit." },
                { t: "See your real score", d: "No more silence. See your exact match percentage against the threshold." },
                { t: "Close the gap", d: "Get a ranked list of the specific skills you're missing." },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-3.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {step.t}
                    </p>
                    <p className="text-sm text-zinc-500 mt-0.5">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  Your score
                </span>
                <span className="text-sm font-bold text-zinc-900">68%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200">
                <div className="h-1.5 w-[68%] rounded-full bg-zinc-400" />
              </div>
              <p className="mt-3 text-xs text-zinc-500">Missing to reach 80%:</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Docker", "System Design", "GraphQL"].map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section id="cta" className="px-4 sm:px-6 py-24 border-t border-zinc-200">
      <motion.div
        variants={springUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-sm px-8 py-16 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Stop guessing. Start matching.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          Whether you're screening hundreds of resumes or trying to land your
          first offer, SkillMatch AI turns "maybe" into a number — and a plan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton href="/signup" variant="primary" isLink={true}>
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/login" variant="secondary" isLink={true}>
            Check Your Score
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 px-4 sm:px-6 py-10">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        
        {/* Updated Footer Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <span className="font-black text-base tracking-tighter text-zinc-900">SkillMatch</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mb-0.5"></div>
          </div>
          <span>· © {new Date().getFullYear()}</span>
        </div>

        <div className="flex gap-6">
          <a href="#features" className="hover:text-zinc-800">Features</a>
          <a href="#how-it-works" className="hover:text-zinc-800">How it Works</a>
          <a href="#hr" className="hover:text-zinc-800">For HR</a>
          <a href="#students" className="hover:text-zinc-800">For Students</a>
        </div>
      </div>
    </footer>
  );
}

export default function SkillMatchLanding({ user }) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans antialiased text-zinc-900 selection:bg-emerald-100">
      <Navbar user={user} />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}