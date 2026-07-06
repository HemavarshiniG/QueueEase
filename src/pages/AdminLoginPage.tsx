import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, KeyRound, AlertCircle, CheckCircle } from 'lucide-react'
import { AUTHORITIES } from '../constants/queueConstants'

interface FormState {
  authorityName: string
  password: string
}

interface TouchedState {
  authorityName: boolean
  password: boolean
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    authorityName: '',
    password: ''
  })
  
  const [touched, setTouched] = useState<TouchedState>({
    authorityName: false,
    password: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Form Validation
  const getErrors = () => {
    const errors = {
      authorityName: '',
      password: ''
    }

    if (!form.authorityName) {
      errors.authorityName = 'Please select your authority profile'
    }

    if (!form.password) {
      errors.password = 'Password is required'
    } else if (form.password.length < 4) {
      errors.password = 'Password must be at least 4 characters long'
    }

    return errors
  }

  const errors = getErrors()
  const isFormValid = !errors.authorityName && !errors.password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field: keyof TouchedState) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Handle Login submission - ready to connect to a Spring Boot Spring Security REST API later
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      authorityName: true,
      password: true
    })

    if (!isFormValid) return

    setIsSubmitting(true)

    // Simulate backend auth check (Spring Boot Spring Security login response)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowToast(true)

      // Redirect to Admin Dashboard page, passing the logged-in authority's name
      setTimeout(() => {
        navigate('/admin/dashboard', { 
          state: { 
            authorityName: form.authorityName,
            isAuth: true
          } 
        })
      }, 1200)

    }, 800)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm w-full bg-white border border-emerald-100 rounded-xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="p-1 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">Authenticated Successfully</span>
              <span className="text-xs text-slate-500">Loading admin session...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg shadow-slate-100/50"
        >
          {/* Card Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Admin Portal</h1>
              <p className="text-xs text-slate-500">Log in to manage authority-specific queues</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Dropdown: Authority Profile */}
            <div className="flex flex-col">
              <label htmlFor="authorityName" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Authority Profile <span className="text-blue-500">*</span>
              </label>
              <select
                id="authorityName"
                name="authorityName"
                value={form.authorityName}
                onChange={handleChange}
                onBlur={() => handleBlur('authorityName')}
                disabled={isSubmitting || showToast}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                  touched.authorityName && errors.authorityName
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              >
                <option value="">Select Authority</option>
                {AUTHORITIES.map(auth => (
                  <option key={auth.name} value={auth.name}>{auth.name}</option>
                ))}
              </select>
              {touched.authorityName && errors.authorityName && (
                <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.authorityName}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Portal Password <span className="text-blue-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password (e.g. admin)"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                disabled={isSubmitting || showToast}
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all bg-white ${
                  touched.password && errors.password
                    ? 'border-red-300 focus:ring-red-500/10 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {touched.password && errors.password && (
                <span className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || showToast}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  )
}
