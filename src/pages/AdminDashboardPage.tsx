import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, CheckCircle2, PlayCircle, LogOut, ArrowRight, UserCheck,
  ChevronRight, RefreshCw, ClipboardList, HelpCircle
} from 'lucide-react'
import { getMockQueue, type QueueStudent } from '../services/mockQueueService'

export default function AdminDashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Retrieve logged-in authority name from state, fallback to HOD IT
  const authorityName = (location.state?.authorityName as string) || 'HOD - Information Technology'

  // Dashboard state: serving, waiting, and completed lists
  const [activeStudent, setActiveStudent] = useState<QueueStudent | null>(null)
  const [waitingQueue, setWaitingQueue] = useState<QueueStudent[]>([])
  const [completedQueue, setCompletedQueue] = useState<QueueStudent[]>([])
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  // Initialize queue data on load using the extracted mock Queue Service
  useEffect(() => {
    const list = getMockQueue(authorityName)
    if (list.length > 0) {
      // Set first student as active and remaining as waiting
      setActiveStudent({ ...list[0], status: 'serving' })
      setWaitingQueue(list.slice(1))
    }
  }, [authorityName])

  // Log out back to login
  const handleLogout = () => {
    navigate('/admin/login')
  }

  // Trigger brief alert messages on dashboard actions
  const triggerAlert = (message: string) => {
    setActionMessage(message)
    setTimeout(() => setActionMessage(null), 3000)
  }

  // Action: Call Next Student
  const handleCallNext = () => {
    // If there is currently an active student, complete them first
    let tempCompleted = [...completedQueue]
    if (activeStudent) {
      tempCompleted.push({ ...activeStudent, status: 'completed' })
    }

    if (waitingQueue.length > 0) {
      const next = waitingQueue[0]
      setActiveStudent({ ...next, status: 'serving' })
      setWaitingQueue(waitingQueue.slice(1))
      setCompletedQueue(tempCompleted)
      triggerAlert(`Called student ${next.studentName} (${next.tokenNumber})`)
    } else {
      setActiveStudent(null)
      setCompletedQueue(tempCompleted)
      triggerAlert('No more students in the waiting queue.')
    }
  }

  // Action: Mark Active Student as Completed
  const handleMarkCompleted = () => {
    if (!activeStudent) return

    const completedStudent = { ...activeStudent, status: 'completed' as const }
    setCompletedQueue(prev => [...prev, completedStudent])
    setActiveStudent(null)
    triggerAlert(`Completed session for ${completedStudent.studentName} (${completedStudent.tokenNumber})`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      
      {/* Action Notification Alert banner */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-6 z-50 max-w-sm w-full bg-white border border-blue-100 rounded-xl p-4 shadow-xl flex items-center gap-3"
          >
            <div className="p-1 rounded-full bg-blue-50 text-blue-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800">{actionMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Title Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{authorityName}</h1>
            <p className="text-xs text-slate-500">Smart Administrative Queue Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                const list = getMockQueue(authorityName)
                if (list.length > 0) {
                  setActiveStudent({ ...list[0], status: 'serving' })
                  setWaitingQueue(list.slice(1))
                  setCompletedQueue([])
                  triggerAlert('Queue reset successfully.')
                }
              }}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
              title="Reset Queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Queue Summary Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Token</span>
              <span className="text-2xl font-black text-slate-900 block leading-tight">
                {activeStudent ? activeStudent.tokenNumber : 'None'}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Students Waiting</span>
              <span className="text-2xl font-black text-slate-900 block leading-tight">
                {waitingQueue.length}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Served Today</span>
              <span className="text-2xl font-black text-slate-900 block leading-tight">
                {completedQueue.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard main workspace splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Serving Card + Waiting List (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Student Serving Detail */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Currently Serving
              </h2>

              {activeStudent ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/50 border border-slate-100 rounded-xl p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{activeStudent.tokenNumber}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-slate-800 block">{activeStudent.studentName}</span>
                      <span className="text-xs text-slate-500 block">Register Number: {activeStudent.registerNumber}</span>
                      <span className="text-xs text-slate-500 block">
                        Purpose: <strong className="text-blue-600">{activeStudent.purposeOfVisit}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleMarkCompleted}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={handleCallNext}
                      disabled={waitingQueue.length === 0}
                      className="px-5 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Call Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <PlayCircle className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-700">No Student Currently Active</p>
                  <p className="text-xs text-slate-500 mb-6">Call the next student in the queue line.</p>
                  <button
                    onClick={handleCallNext}
                    disabled={waitingQueue.length === 0}
                    className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1.5"
                  >
                    Call Next Student
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Waiting Students Queue Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider mb-6 flex items-center gap-2">
                <ClipboardList className="w-4.5 h-4.5 text-indigo-500" />
                Waiting Students Queue ({waitingQueue.length})
              </h2>

              {waitingQueue.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Index</th>
                        <th className="pb-3">Token</th>
                        <th className="pb-3">Student Name</th>
                        <th className="pb-3">Register No</th>
                        <th className="pb-3">Purpose</th>
                        <th className="pb-3 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {waitingQueue.map((student, idx) => (
                        <tr key={student.tokenNumber} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-3.5 pl-2 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 font-bold text-slate-900">{student.tokenNumber}</td>
                          <td className="py-3.5 font-semibold text-slate-800">{student.studentName}</td>
                          <td className="py-3.5 text-slate-500">{student.registerNumber}</td>
                          <td className="py-3.5 font-medium text-blue-600">{student.purposeOfVisit}</td>
                          <td className="py-3.5 text-right pr-2">
                            <button
                              onClick={() => {
                                // Jump this specific student to active
                                let tempCompleted = [...completedQueue]
                                if (activeStudent) {
                                  tempCompleted.push({ ...activeStudent, status: 'completed' })
                                }
                                setActiveStudent({ ...student, status: 'serving' })
                                setWaitingQueue(waitingQueue.filter(s => s.tokenNumber !== student.tokenNumber))
                                setCompletedQueue(tempCompleted)
                                triggerAlert(`Called student ${student.studentName} (${student.tokenNumber})`)
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Call
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 border border-slate-100 rounded-xl bg-slate-50/20">
                  <p className="text-xs text-slate-400">Waiting queue is empty.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Completed List (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm h-fit">
            <h2 className="text-sm font-extrabold text-slate-950 uppercase tracking-wider mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              Completed History
            </h2>

            {completedQueue.length > 0 ? (
              <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                {completedQueue.map((student) => (
                  <div 
                    key={student.tokenNumber} 
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/30 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{student.tokenNumber}</span>
                      <span className="text-slate-500 block">{student.studentName}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold shrink-0">
                      Served
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50/30 border border-slate-100 rounded-xl">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No completed sessions yet today.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
