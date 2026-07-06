import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, RefreshCw, User, Clipboard, Calendar, Clock,
  Hourglass, PlayCircle, ShieldAlert
} from 'lucide-react'

interface TokenData {
  studentName: string
  registerNumber: string
  authorityToMeet: string
  purposeOfVisit: string
  preferredDate?: string
  preferredTime?: string
  tokenNumber: string
  peopleAhead: number
  waitTime: number
  createdAt: string
}

export default function TokenStatusPage() {
  const location = useLocation()
  const tokenData = location.state?.tokenData as TokenData | undefined

  // Fallback: If no token state exists
  if (!tokenData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-lg"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Active Token Found</h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            You don't have an active queue session. Generate a token to view live position and waiting times.
          </p>
          <Link
            to="/join"
            className="inline-flex w-full items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-md shadow-blue-500/10 transition-colors"
          >
            Join Queue
          </Link>
        </motion.div>
      </div>
    )
  }

  // Parse Token Number and calculate mock serving token dynamically
  // Example: "HODIT-003" -> prefix = "HODIT", num = 3
  const parseServingToken = () => {
    const parts = tokenData.tokenNumber.split('-')
    if (parts.length === 2) {
      const prefix = parts[0]
      const num = parseInt(parts[1], 10)
      if (!isNaN(num)) {
        // Serving token index is (current - peopleAhead)
        // If people ahead is 0, then we are being served, so serving = current token
        const offset = tokenData.peopleAhead > 0 ? tokenData.peopleAhead : 0
        const servingNum = Math.max(1, num - offset)
        return `${prefix}-${String(servingNum).padStart(3, '0')}`
      }
    }
    return 'GEN-001'
  }

  const servingToken = parseServingToken()
  
  // Calculate queue progress percentage
  const progressPercent = tokenData.peopleAhead === 0 
    ? 100 
    : Math.max(15, Math.min(95, 100 - (tokenData.peopleAhead / 15) * 75))

  return (
    <div className="relative min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        {/* Navigation Action */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* Animated Card (Framer Motion) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg shadow-slate-100/50 space-y-8 relative overflow-hidden"
        >
          {/* Card Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-650" />

          {/* Header & Token Code */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Ticket</span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{tokenData.tokenNumber}</h1>
              <p className="text-sm font-semibold text-blue-600">{tokenData.purposeOfVisit}</p>
            </div>
            
            {/* Status Badge */}
            <div>
              {tokenData.peopleAhead === 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold shadow-sm">
                  <PlayCircle className="w-4 h-4" />
                  Serving Now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold shadow-sm">
                  <Hourglass className="w-4 h-4 animate-spin-slow" />
                  Waiting in Line
                </span>
              )}
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Serving Token</span>
              <span className="text-lg font-bold text-slate-800">{servingToken}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">People Ahead</span>
              <span className="text-lg font-bold text-blue-600">
                {tokenData.peopleAhead === 0 ? 'Next Up!' : tokenData.peopleAhead}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Estimated Wait</span>
              <span className="text-lg font-bold text-slate-800">
                {tokenData.peopleAhead === 0 ? '0 mins' : `~${tokenData.waitTime}m`}
              </span>
            </div>
          </div>

          {/* Queue Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>Queue Status</span>
              <span>{Math.round(progressPercent)}% Progress</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </div>

          {/* Student Meta Details */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4 px-1">Registration Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <User className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-450 block font-medium">Student Name</span>
                  <span className="font-bold text-slate-800">{tokenData.studentName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <Clipboard className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-450 block font-medium">Register Number</span>
                  <span className="font-bold text-slate-800">{tokenData.registerNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-450 block font-medium">Authority to Meet</span>
                  <span className="font-bold text-slate-800">{tokenData.authorityToMeet}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-450 block font-medium">Appointment Slots</span>
                  <span className="font-bold text-slate-800">
                    {tokenData.preferredDate || 'No date chosen'} @ {tokenData.preferredTime || 'Immediate'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
            <Link
              to="/join"
              className="flex-1 text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-md shadow-blue-500/10 transition-colors text-sm"
            >
              Join Another Queue
            </Link>
            <Link
              to="/"
              className="flex-1 text-center py-3 rounded-xl border border-slate-200 hover:border-slate-350 hover:bg-slate-50 font-semibold text-slate-700 hover:text-slate-900 transition-all text-sm"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
