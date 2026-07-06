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
