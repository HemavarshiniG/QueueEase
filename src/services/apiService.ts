const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface LoginResponse {
  token: string;
  authorityName: string;
  tokenType: string;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

export const getAuthorityNameFromToken = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    // Decodes base64 string across environments
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    
    // Check if token has expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      clearAuthToken();
      return null;
    }
    return payload.sub || null;
  } catch (e) {
    clearAuthToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthorityNameFromToken() !== null;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401 || response.status === 403) {
      // If unauthorized, clear local session token
      clearAuthToken();
    }

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Fallback if response is not JSON
      }
      throw new Error(errorMessage);
    }

    // Handles void/no-content responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error: any) {
    throw new Error(error.message || 'Network error occurred');
  }
}

// Auth API Calls
export const login = async (authorityName: string, password: string): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ authorityName, password })
  });
};

// Student API Calls
export interface JoinQueueRequest {
  studentName: string;
  registerNumber: string;
  department: string;
  year: number;
  authorityId: number;
  purposeOfVisit: string;
  email?: string;
  phoneNumber?: string;
}

export interface JoinQueueResponse {
  tokenNumber: string;
  queuePosition: number;
  authorityName: string;
  estimatedWaitingCount: number;
  status: string;
  message: string;
}

export interface QueueStatusResponse {
  tokenNumber: string;
  studentName: string;
  authorityName: string;
  status: string;
  queuePosition: number;
  peopleAhead: number;
  estimatedWaitingCount: number;
  purposeOfVisit: string;
}

export const joinQueue = async (request: JoinQueueRequest): Promise<JoinQueueResponse> => {
  return apiRequest<JoinQueueResponse>('/api/queue/join', {
    method: 'POST',
    body: JSON.stringify(request)
  });
};

export const getQueueStatus = async (token: string): Promise<QueueStatusResponse> => {
  return apiRequest<QueueStatusResponse>(`/api/queue/status/${token}`);
};

// Admin API Calls
export interface DashboardStatisticsResponse {
  totalStudents: number;
  totalAuthorities: number;
  totalQueueEntries: number;
  waitingCount: number;
  servingCount: number;
  completedCount: number;
  cancelledCount: number;
  todayQueueEntries: number;
}

export interface AuthorityQueueResponse {
  tokenNumber: string;
  studentName: string;
  registerNumber: string;
  purposeOfVisit: string;
  queuePosition: number;
  status: string;
}

export interface CallNextResponse {
  tokenNumber: string;
  studentName: string;
  registerNumber: string;
  purposeOfVisit: string;
  queuePosition: number;
  status: string;
}

export interface CompleteCurrentResponse {
  tokenNumber: string;
  studentName: string;
  registerNumber: string;
  purposeOfVisit: string;
  queuePosition: number;
  status: string;
}

export const getDashboardStatistics = async (): Promise<DashboardStatisticsResponse> => {
  return apiRequest<DashboardStatisticsResponse>('/api/dashboard/statistics');
};

export const getAuthorityQueue = async (authorityId: number): Promise<AuthorityQueueResponse[]> => {
  return apiRequest<AuthorityQueueResponse[]>(`/api/authority/${authorityId}/queue`);
};

export const callNextStudent = async (authorityId: number): Promise<CallNextResponse> => {
  return apiRequest<CallNextResponse>(`/api/authority/${authorityId}/call-next`, {
    method: 'POST'
  });
};

export const completeCurrentStudent = async (authorityId: number): Promise<CompleteCurrentResponse> => {
  return apiRequest<CompleteCurrentResponse>(`/api/authority/${authorityId}/complete-current`, {
    method: 'POST'
  });
};

