export interface Authority {
  name: string
  prefix: string
}

export const AUTHORITIES: Authority[] = [
  { name: 'Principal', prefix: 'PRIN' },
  { name: 'Chairman', prefix: 'CHAIR' },
  { name: 'Dean - Academics', prefix: 'DEANA' },
  { name: 'Dean - Student Affairs', prefix: 'DEANS' },
  { name: 'HOD - Information Technology', prefix: 'HODIT' },
  { name: 'HOD - Computer Science', prefix: 'HODCS' },
  { name: 'HOD - Artificial Intelligence & Data Science', prefix: 'HODAI' },
  { name: 'HOD - Electronics & Communication', prefix: 'HODEC' },
  { name: 'HOD - Mechanical Engineering', prefix: 'HODME' },
  { name: 'HOD - Civil Engineering', prefix: 'HODCE' },
  { name: 'HOD - Electrical & Electronics Engineering', prefix: 'HODEE' },
  { name: 'Placement Officer', prefix: 'PLACE' },
  { name: 'Controller of Examinations', prefix: 'COE' },
]

export const PURPOSES_OF_VISIT: string[] = [
  'OD Approval',
  'Leave Approval',
  'Bonafide Certificate',
  'Internship Approval',
  'Project Discussion',
  'Placement Discussion',
  'Scholarship',
  'Fee Related',
  'Recommendation Letter',
  'Academic Counselling',
  'General Meeting',
  'Other'
]

export const getAuthorityPrefix = (authorityName: string): string => {
  const auth = AUTHORITIES.find(a => a.name === authorityName)
  return auth ? auth.prefix : 'GEN'
}

export const getAuthorityIdByName = (name: string): number => {
  const mapping: { [key: string]: number } = {
    'Principal': 1,
    'Vice Principal': 2,
    'Chairman': 3,
    'Dean - Academics': 4,
    'Dean - Student Affairs': 5,
    'HOD - Information Technology': 6,
    'HOD - Computer Science': 7,
    'HOD - Artificial Intelligence & Data Science': 8,
    'HOD - Electronics & Communication': 9,
    'HOD - Mechanical Engineering': 10,
    'HOD - Civil Engineering': 11,
    'HOD - Electrical & Electronics Engineering': 12,
    'Placement Officer': 13,
    'Controller of Examinations': 14,
    'Office Superintendent': 15,
    'Librarian': 16
  }
  return mapping[name] || 1
}

