import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Ticket, CheckCircle, AlertCircle, PlayCircle, 
  Users, Clock, Activity, HelpCircle, AlertTriangle, ArrowRight, Edit2
} from 'lucide-react'
import { AUTHORITIES, PURPOSES_OF_VISIT, getAuthorityIdByName } from '../constants/queueConstants'
import { getAuthorityQueueStatus, type AuthorityQueueStatus } from '../services/mockQueueService'
import { joinQueue } from '../services/apiService'

interface FormState {
  studentName: string
  registerNumber: string
  authorityToMeet: string
  purposeOfVisit: string
  preferredDate: string
  preferredTime: string
}

interface TouchedState {
  studentName: boolean
  registerNumber: boolean
  authorityToMeet: boolean
  purposeOfVisit: boolean
}

export default function JoinQueuePage() {
  const navigate = useNavigate()
  
  // Element Refs for scrolling and autofocus
  const nameInputRef = useRef<HTMLInputElement>(null)
  const authoritySelectRef = useRef<HTMLSelectElement>(null)

  // Guided step state: 1 = Check Queue, 2 = Enter Student Details
  const [step, setStep] = useState<1 | 2>(1)

  const [form, setForm] = useState<FormState>({
    studentName: '',
    registerNumber: '',
    authorityToMeet: '',
    purposeOfVisit: '',
    preferredDate: '',
    preferredTime: ''
  })

  const [touched, setTouched] = useState<TouchedState>({
    studentName: false,
    registerNumber: false,
    authorityToMeet: false,
    purposeOfVisit: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  
  // Dynamic status details
  const [statusData, setStatusData] = useState<AuthorityQueueStatus | null>(null)

  // Validation rules
  const getErrors = () => {
    const errors = {
      studentName: '',
      registerNumber: '',
      authorityToMeet: '',
      purposeOfVisit: ''
    }

    if (!form.studentName.trim()) {
      errors.studentName = 'Student name is required'
    } else if (form.studentName.trim().length < 3) {
      errors.studentName = 'Name must be at least 3 characters long'
    }

    if (!form.registerNumber.trim()) {
      errors.registerNumber = 'Register number is required'
    } else if (form.registerNumber.trim().length < 5) {
      errors.registerNumber = 'Register number must be at least 5 characters long'
    }

    if (!form.authorityToMeet) {
      errors.authorityToMeet = 'Please select the authority to meet'
    }

    if (!form.purposeOfVisit) {
      errors.purposeOfVisit = 'Please select the purpose of visit'
    }

    return errors
  }

  const errors = getErrors()
  const isFormValid = !errors.studentName && !errors.registerNumber && !errors.authorityToMeet && !errors.purposeOfVisit

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'authorityToMeet') {
      if (value) {
        const stats = getAuthorityQueueStatus(value)
        setStatusData(stats)
      } else {
        setStatusData(null)
      }
    }
  }

  const handleBlur = (field: keyof TouchedState) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setTouched({
      studentName: true,
      registerNumber: true,
      authorityToMeet: true,
      purposeOfVisit: true
    })

    if (!isFormValid) return

    setIsSubmitting(true)
    setJoinError(null)

    try {
      const authorityId = getAuthorityIdByName(form.authorityToMeet)
      // Call Spring Boot backend to register student to queue
      const response = await joinQueue({
        studentName: form.studentName,
        registerNumber: form.registerNumber,
        department: 'General', // default department as it is not exposed in the visual layout
        year: 1, // default year as it is not exposed in the visual layout
        authorityId: authorityId,
        purposeOfVisit: form.purposeOfVisit,
        email: form.preferredDate || undefined,
        phoneNumber: form.preferredTime || undefined
      })

      // Store generated token in local storage to keep state valid on refreshes
      localStorage.setItem('activeToken', response.tokenNumber)

      const payload = {
        studentName: form.studentName,
        registerNumber: form.registerNumber,
        authorityToMeet: response.authorityName,
        purposeOfVisit: form.purposeOfVisit,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        tokenNumber: response.tokenNumber,
        peopleAhead: response.estimatedWaitingCount,
        waitTime: response.estimatedWaitingCount * 3,
        createdAt: new Date().toISOString()
      }

      setShowToast(true)
      setIsSubmitting(false)

      setTimeout(() => {
        navigate('/status', { state: { tokenData: payload } })
      }, 1500)

    } catch (err: any) {
      setIsSubmitting(false)
      setJoinError(err.message || 'Failed to join the queue. Please try again.')
    }
  }

  // Action: Choose Another Authority / Reset Step 1
  const handleResetAuthority = () => {
    setForm(prev => ({ ...prev, authorityToMeet: '' }))
    setStatusData(null)
    setStep(1)
    if (authoritySelectRef.current) {
      authoritySelectRef.current.focus()
    }
  }

  // Action: Continue to Step 2
  const handleContinue = () => {
    if (!form.authorityToMeet) return
    setStep(2)
  }

  // Focus the first input field when step changes to 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus()
          nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }, [step])

  // Get Traffic Badge styling
  const getTrafficBadge = (waiting: number) => {
    if (waiting <= 3) {
      return { label: 'Low Traffic', style: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    } else if (waiting <= 7) {
      return { label: 'Moderate Traffic', style: 'bg-amber-50 text-amber-600 border-amber-100' }
    } else {
      return { label: 'High Traffic', style: 'bg-red-50 text-red-600 border-red-100' }
    }
  }

  return (
    <div className="relative min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white border border-emerald-100 rounded-xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="p-1 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">Token Generated Successfully</span>
              <span className="text-xs text-slate-500">Redirecting to status screen...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Guided Step Header Tracker */}
        <div className="flex items-center gap-3 mb-8 bg-white border border-slate-200 rounded-xl p-4 max-w-lg shadow-sm">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${step === 1 ? 'bg-blue-650 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
            {step === 1 ? '1' : <CheckCircle className="w-4 h-4" />}
          </div>
          <span className="text-xs font-bold text-slate-700">Check Queue Status</span>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${step === 2 ? 'bg-blue-650 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2
          </div>
          <span className="text-xs font-bold text-slate-700">Enter Details</span>
        </div>

        {/* Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: STEP 1 Selection Card + STEP 2 Student details card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1 Card: Choose Authority */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Step 1: Choose Authority</h2>
                    <p className="text-[10px] text-slate-400">Select which campus authority you want to meet</p>
                  </div>
                </div>
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-650 hover:text-blue-700"
                  >
                    <Edit2 className="w-3 h-3" />
                    Change Selection
                  </button>
                )}
              </div>

              {/* Authority Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="authorityToMeet" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Authority to Meet <span className="text-blue-500">*</span>
                </label>
                <select
                  id="authorityToMeet"
                  ref={authoritySelectRef}
                  name="authorityToMeet"
                  value={form.authorityToMeet}
                  onChange={handleChange}
                  onBlur={() => handleBlur('authorityToMeet')}
                  disabled={step === 2 || isSubmitting || showToast}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                    touched.authorityToMeet && errors.authorityToMeet
                      ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  } disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200`}
                >
                  <option value="">Select Authority</option>
                  {AUTHORITIES.map(auth => (
                    <option key={auth.name} value={auth.name}>{auth.name}</option>
                  ))}
                </select>
                {touched.authorityToMeet && errors.authorityToMeet && (
                  <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.authorityToMeet}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Step 2 Card: Revealed using Framer Motion */}
            <AnimatePresence>
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 15 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md overflow-hidden"
                >
                  {/* Step 2 Header */}
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Ticket className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 leading-tight">Step 2: Student Details</h2>
                      <p className="text-[10px] text-slate-400">Complete your registration to generate a token</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {joinError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2 mb-6">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                        <span className="font-semibold">{joinError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="flex flex-col">
                        <label htmlFor="studentName" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Student Name <span className="text-blue-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="studentName"
                          ref={nameInputRef}
                          name="studentName"
                          placeholder="e.g. John Doe"
                          value={form.studentName}
                          onChange={handleChange}
                          onBlur={() => handleBlur('studentName')}
                          disabled={isSubmitting || showToast}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                            touched.studentName && errors.studentName
                              ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                        {touched.studentName && errors.studentName && (
                          <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.studentName}
                          </span>
                        )}
                      </div>

                      {/* Register Number */}
                      <div className="flex flex-col">
                        <label htmlFor="registerNumber" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Register Number <span className="text-blue-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="registerNumber"
                          name="registerNumber"
                          placeholder="e.g. 21104051"
                          value={form.registerNumber}
                          onChange={handleChange}
                          onBlur={() => handleBlur('registerNumber')}
                          disabled={isSubmitting || showToast}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                            touched.registerNumber && errors.registerNumber
                              ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        />
                        {touched.registerNumber && errors.registerNumber && (
                          <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.registerNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Purpose of Visit */}
                      <div className="flex flex-col sm:col-span-2">
                        <label htmlFor="purposeOfVisit" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Purpose of Visit <span className="text-blue-500">*</span>
                        </label>
                        <select
                          id="purposeOfVisit"
                          name="purposeOfVisit"
                          value={form.purposeOfVisit}
                          onChange={handleChange}
                          onBlur={() => handleBlur('purposeOfVisit')}
                          disabled={isSubmitting || showToast}
                          className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                            touched.purposeOfVisit && errors.purposeOfVisit
                              ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                              : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                          }`}
                        >
                          <option value="">Select Purpose</option>
                          {PURPOSES_OF_VISIT.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        {touched.purposeOfVisit && errors.purposeOfVisit && (
                          <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.purposeOfVisit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Preferred Date */}
                      <div className="flex flex-col">
                        <label htmlFor="preferredDate" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Preferred Date <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="date"
                          id="preferredDate"
                          name="preferredDate"
                          value={form.preferredDate}
                          onChange={handleChange}
                          disabled={isSubmitting || showToast}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all bg-white"
                        />
                      </div>

                      {/* Preferred Time */}
                      <div className="flex flex-col">
                        <label htmlFor="preferredTime" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                          Preferred Time <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="time"
                          id="preferredTime"
                          name="preferredTime"
                          value={form.preferredTime}
                          onChange={handleChange}
                          disabled={isSubmitting || showToast}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 text-sm transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Generate Token Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handleResetAuthority}
                        className="px-5 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        Choose Another Authority
                      </button>
                      <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting || showToast}
                        className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                            Generating Token...
                          </>
                        ) : (
                          <>
                            <Ticket className="w-4 h-4" />
                            Generate Token
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Queue Status card + Step 1 Buttons */}
          <div className="lg:col-span-5 w-full space-y-6">
            <AnimatePresence mode="wait">
              {statusData ? (
                <motion.div
                  key={form.authorityToMeet}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-100/50 space-y-6"
                >
                  {/* Card Header */}
                  <div className="pb-4 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Live Status</span>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Current Queue</h2>
                    <p className="text-xs text-blue-600 font-semibold mt-1">{form.authorityToMeet}</p>
                  </div>

                  {/* High Visitor Warning Banner */}
                  {statusData.waitingCount > 10 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                      <p className="text-xs leading-relaxed font-semibold">
                        This authority currently has a high number of visitors. You may experience a longer waiting time.
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* Item 1: Serving */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                          <PlayCircle className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Currently Serving</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{statusData.currentlyServing}</span>
                    </div>

                    {/* Item 2: Waiting Count */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                          <Users className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Waiting Students</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{statusData.waitingCount}</span>
                    </div>

                    {/* Item 3: Wait Time */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          <Clock className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Estimated Wait</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{statusData.estimatedWaitMinutes} min</span>
                    </div>

                    {/* Item 4: Traffic Badge */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/40">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-650">
                          <Activity className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Queue Status</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-0.5 font-bold rounded-md border ${getTrafficBadge(statusData.waitingCount).style}`}>
                        {getTrafficBadge(statusData.waitingCount).label}
                      </span>
                    </div>
                  </div>

                  {/* Highlighted Notice */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-center">
                    <p className="text-xs font-semibold text-blue-700 leading-tight">
                      Estimated waiting time is approximately {statusData.estimatedWaitMinutes} minutes.
                    </p>
                  </div>

                  {/* Step 1 Control Buttons: displayed in Step 1, disabled/replaced in Step 2 */}
                  {step === 1 ? (
                    <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-all"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleResetAuthority}
                        className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Choose Another Authority
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50/30 border border-dashed border-emerald-100 rounded-xl text-center">
                      <p className="text-xs font-bold text-emerald-800">Step 1 Confirmed</p>
                      <p className="text-[10px] text-slate-400 mt-1">Please complete Step 2 student details on the left.</p>
                    </div>
                  )}

                  {/* Footer Notice */}
                  <p className="text-[9px] text-slate-400 text-center leading-relaxed block">
                    Queue information is updated periodically. Actual waiting time may vary.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-100/50 text-center space-y-4 animate-fade-in"
                >
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">No Authority Selected</h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1.5 leading-relaxed">
                      Please select an authority from the dropdown list on the left to view their live waiting queue status.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAuthority}
                      className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Select Authority
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
}
