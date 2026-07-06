import { getAuthorityPrefix } from '../constants/queueConstants'

export interface QueueStudent {
  tokenNumber: string
  studentName: string
  registerNumber: string
  purposeOfVisit: string
  preferredTime?: string
  status: 'waiting' | 'serving' | 'completed'
}

export interface AuthorityQueueStatus {
  currentlyServing: string
  waitingCount: number
  estimatedWaitMinutes: number
  lastUpdated: string
}

const MOCK_NAMES = [
  'Arun Kumar',
  'Deepika R.',
  'Sanjay Prasad',
  'Harish V.',
  'Nisha Sharma',
  'Praveen Raj',
  'Sneha Iyer',
  'Karthik S.'
]

const MOCK_REG_NOS = [
  '21104051',
  '21104112',
  '21103098',
  '21104205',
  '21106012',
  '21105043',
  '21104022',
  '21103055'
]

const MOCK_PURPOSES = [
  'OD Approval',
  'Leave Approval',
  'Bonafide Certificate',
  'Internship Approval',
  'Project Discussion',
  'Placement Discussion',
  'Academic Counselling'
]

// Generates a mock waiting list of students for a given authority
export const getMockQueue = (authorityName: string): QueueStudent[] => {
  const prefix = getAuthorityPrefix(authorityName)
  const queue: QueueStudent[] = []
  
  for (let i = 0; i < 5; i++) {
    const nameIndex = (i + prefix.charCodeAt(0)) % MOCK_NAMES.length
    const regIndex = (i + prefix.charCodeAt(1)) % MOCK_REG_NOS.length
    const purposeIndex = (i + prefix.charCodeAt(2)) % MOCK_PURPOSES.length
    
    const tokenNum = 101 + i
    
    queue.push({
      tokenNumber: `${prefix}-${String(tokenNum).padStart(3, '0')}`,
      studentName: MOCK_NAMES[nameIndex],
      registerNumber: MOCK_REG_NOS[regIndex],
      purposeOfVisit: MOCK_PURPOSES[purposeIndex],
      preferredTime: `${9 + i}:30 AM`,
      status: 'waiting'
    })
  }
  
  return queue
}

// Fetches the queue statistics (serving token, wait times, traffic stats) for any authority
export const getAuthorityQueueStatus = (authorityName: string): AuthorityQueueStatus => {
  const prefix = getAuthorityPrefix(authorityName)
  
  let waitingCount = 4
  let estimatedWaitMinutes = 12
  let servingIndex = 5

  // Map requested examples exactly
  if (authorityName === 'Principal') {
    servingIndex = 5
    waitingCount = 4
    estimatedWaitMinutes = 12
  } else if (authorityName === 'Vice Principal') {
    servingIndex = 3
    waitingCount = 2
    estimatedWaitMinutes = 6
  } else if (authorityName === 'HOD - Information Technology') {
    servingIndex = 8
    waitingCount = 5
    estimatedWaitMinutes = 15
  } else if (authorityName === 'HOD - Computer Science') {
    servingIndex = 11
    waitingCount = 7
    estimatedWaitMinutes = 20
  } else if (authorityName === 'HOD - Artificial Intelligence & Data Science') {
    servingIndex = 6
    waitingCount = 3
    estimatedWaitMinutes = 9
  } else if (authorityName === 'HOD - Electronics & Communication') {
    servingIndex = 4
    waitingCount = 1
    estimatedWaitMinutes = 4
  } else if (authorityName === 'Placement Officer') {
    servingIndex = 10
    waitingCount = 6
    estimatedWaitMinutes = 18
  } else {
    // Deterministic fallback for remaining authorities based on prefix hash
    const hash = prefix.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    waitingCount = 1 + (hash % 12) // 1 to 12 students ahead
    estimatedWaitMinutes = waitingCount * 3
    servingIndex = 1 + (hash % 15) // serving token suffix index
  }

  const currentlyServing = `${prefix}-${String(servingIndex).padStart(3, '0')}`

  return {
    currentlyServing,
    waitingCount,
    estimatedWaitMinutes,
    lastUpdated: 'Just Now'
  }
}
