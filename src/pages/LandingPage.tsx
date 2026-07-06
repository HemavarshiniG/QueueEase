import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Ticket, Eye, LayoutDashboard, BellRing, ShieldCheck, Zap,
  Sparkles, ChevronRight, Users, Bell
} from 'lucide-react'

export default function LandingPage() {
  // Motion variants for clean, subtle animations
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.08
      }
    },
    viewport: { once: true, margin: "-100px" }
  }

  const features = [
    {
      icon: Ticket,
      title: "Digital Token Generation",
      description: "Instantly secure a digital waiting token via web or QR code. No paper slips or hardware ticket machines required.",
      color: "text-blue-600 bg-blue-50 border-blue-100"
    },
    {
      icon: Eye,
      title: "Real-Time Queue Tracking",
      description: "Monitor live waiting progress, current position in line, and estimated wait times right from any smartphone browser.",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100"
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      description: "Give staff the tools to configure service categories, view real-time statistics, summon tokens, and manage client flows.",
      color: "text-purple-600 bg-purple-50 border-purple-100"
    },
    {
      icon: BellRing,
      title: "Instant Notifications",
      description: "Send automated updates to users when their turn is approaching to prevent crowding and wait-area congestion.",
      color: "text-pink-600 bg-pink-50 border-pink-100"
    },
    {
      icon: ShieldCheck,
      title: "Secure Login",
      description: "Enforce secure roles-based login permissions for administrators and staff members to protect student and queue details.",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100"
    },
    {
      icon: Zap,
      title: "Fast & Easy Queue Management",
      description: "A lightweight cloud architecture that loads in milliseconds, enabling instant boarding and straightforward staff operations.",
      color: "text-amber-600 bg-amber-50 border-amber-100"
    }
  ]

  const steps = [
    {
      num: "01",
      title: "Join Queue",
      desc: "Scan a localized QR code or sign up on the site to register your queue request."
    },
    {
      num: "02",
      title: "Receive Token",
      desc: "Instant assignment of a digital token code with real-time wait estimation."
    },
    {
      num: "03",
      title: "Wait for Your Turn",
      desc: "Track queue status on your browser from the library, cafeteria, or home."
    },
    {
      num: "04",
      title: "Get Served",
      desc: "Head over to the service desk when called by the screen or SMS notifications."
    }
  ]

  return (
    <div className="relative bg-white text-slate-700 w-full overflow-hidden">
      {/* Background Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none z-0" />

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (Copy) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-blue-600 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              QueueEase
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900"
            >
              Smart Queue<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Management System
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              QueueEase is a Smart Administrative Queue Management System designed for educational institutions. Students can select the authority they wish to meet, receive a digital token, and monitor their queue status in real time, reducing waiting time and improving administrative efficiency.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/join"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-1.5"
              >
                Join Queue
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/admin/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 font-semibold text-slate-700 hover:text-slate-900 transition-all duration-150 text-center"
              >
                Admin Login
              </Link>
            </motion.div>
          </div>

          {/* Right Column (Light Mode Queue Dashboard Illustration) */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/50"
            >
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Queue Status</h3>
                  <p className="text-xs text-slate-500">Student Services Office</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  Active
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-2 gap-4 py-5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Serving Now</span>
                  <span className="text-xl font-black text-blue-600 tracking-tight">T-102</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Average Wait</span>
                  <span className="text-xl font-black text-slate-800 tracking-tight">10 mins</span>
                </div>
              </div>

              {/* Queue Items Stack */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">Next Visitors</span>
                
                {/* Queue Item 1 */}
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-bold">
                      01
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Alex M.</span>
                      <span className="text-[10px] text-slate-500">Token T-103</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold border border-emerald-150">
                    Called
                  </span>
                </motion.div>

                {/* Queue Item 2 */}
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-150 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200/60 text-slate-500 flex items-center justify-center text-xs font-bold">
                      02
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Sarah K.</span>
                      <span className="text-[10px] text-slate-500">Token T-104</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-600 font-semibold">
                    In Line
                  </span>
                </motion.div>
              </div>

              {/* Floating Animation Cards */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 px-3 py-2.5 rounded-xl border border-slate-150 bg-white shadow-lg flex items-center gap-2"
              >
                <div className="p-1 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold leading-none">QUEUE SIZE</span>
                  <span className="text-xs font-bold text-slate-800">12 Students</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-5 px-3 py-2.5 rounded-xl border border-slate-150 bg-white shadow-lg flex items-center gap-2"
              >
                <div className="p-1 rounded-lg bg-pink-50 text-pink-600">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold leading-none">ALERT SENT</span>
                  <span className="text-xs font-bold text-slate-800">Ticket T-103</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 md:py-28 bg-slate-50/50 border-t border-b border-slate-200/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">System Features</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Simplified Operations. Better Wait Experience.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              QueueEase provides the essential building blocks of digital queue management, keeping operations clean and modular.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feat) => (
              <motion.div
                key={feat.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400/40 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 overflow-hidden"
              >
                {/* Icon wrapper */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 border ${feat.color}`}>
                  <feat.icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20 md:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">How It Works</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Four Steps to Service
            </p>
            <p className="text-sm text-slate-500">
              A transparent, self-managed path from student boarding to completion.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[50px] left-8 right-8 h-[1px] bg-slate-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="space-y-3 text-center lg:text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-black mx-auto lg:mx-0 shadow-sm group-hover:bg-blue-50 group-hover:border-blue-300 transition-all duration-300">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto lg:mx-0">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="pb-20 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-blue-150 bg-gradient-to-br from-blue-500 to-indigo-650 p-8 md:p-14 text-center overflow-hidden shadow-xl shadow-blue-500/10"
        >
          {/* Subtle Ambient light inside CTA */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[50px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to Experience QueueEase?
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-lg mx-auto">
              Implement digital queues on campus. Help students save time, keep track of token call status, and eliminate crowded corridors.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/join"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-50 font-bold text-blue-600 shadow-md shadow-slate-900/10 transition-all duration-150"
              >
                Join Queue
              </Link>
              <Link
                to="/admin/login"
                className="w-full sm:w-auto px-7 py-3 rounded-xl border border-blue-400 hover:border-white text-white font-bold transition-all duration-150"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
