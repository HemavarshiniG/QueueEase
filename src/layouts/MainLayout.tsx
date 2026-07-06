import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Activity } from 'lucide-react'

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false)
    if (location.pathname !== '/') {
      // Allow default router navigation if we aren't on the landing page
      return
    }

    if (href.startsWith('/#')) {
      e.preventDefault()
      const targetId = href.replace('/#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-650 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Subtle Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-10 w-[400px] h-[300px] bg-indigo-100/20 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Sticky Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              QueueEase
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-250 py-2"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 px-4 py-2 rounded-lg border border-slate-200/80 transition-all duration-200"
            >
              Admin Login
            </Link>
            <Link
              to="/join"
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
            >
              Join Queue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg absolute w-full left-0 z-40 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-2 rounded-lg text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 px-4">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:text-blue-600 hover:bg-slate-50 transition-all"
                >
                  Admin Login
                </Link>
                <Link
                  to="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-750 shadow-md shadow-blue-500/10 transition-all"
                >
                  Join Queue
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200/80 bg-white relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                QueueEase
              </span>
            </div>

            {/* Middle Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About</a>
              <a href="mailto:contact@queueease.com" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">GitHub</a>
              <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            </nav>

            {/* Right Copyright */}
            <p className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} QueueEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
