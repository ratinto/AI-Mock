import type { HistoryItem, UserData } from '../domain/user';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';
const TOKEN_KEY = 'antriview_access_token';
const USER_KEY = 'antriview_current_user_object';

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserData | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserData;
  } catch {
    return null;
  }
}

function persistAuth(token: string, user: UserData) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem('antriview_current_user', user.email);
}

export function clearAuthStorage() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem('antriview_current_user');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const maybeJson = await response.json().catch(() => ({}));
    throw new Error(maybeJson.message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  async signup(email: string, name: string, password: string) {
    const payload = await request<{ token: string; user: UserData }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
    });
    persistAuth(payload.token, payload.user);
    return payload.user;
  },

  async login(email: string, password: string) {
    const payload = await request<{ token: string; user: UserData }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persistAuth(payload.token, payload.user);
    return payload.user;
  },

  async googleLogin(credential: string) {
    const payload = await request<{ token: string; user: UserData }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    persistAuth(payload.token, payload.user);
    return payload.user;
  },

  async me() {
    const payload = await request<{ user: UserData }>('/auth/me');
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    return payload.user;
  },

  async updateMe(updates: Partial<UserData> & { password?: string }) {
    const payload = await request<{ user: UserData }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    return payload.user;
  },

  async addSession(item: HistoryItem, track: 'dsa' | 'hr' | 'dev') {
    const payload = await request<{ user: UserData }>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ item, track }),
    });
    sessionStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    return payload.user;
  },

  async listSessions(limit = 50) {
    return request<{ sessions: any[] }>(`/sessions?limit=${limit}`);
  },

  async dashboardSummary() {
    return request<{ totalSessions: number; latestSession: any | null }>('/dashboard/summary');
  },

  async listResumes() {
    return request<any[]>('/resume');
  },

  async getResume(id: string) {
    return request<any>(`/resume/${id}`);
  },

  async createResume(title: string, target_role: string, data: any) {
    return request<any>('/resume', {
      method: 'POST',
      body: JSON.stringify({ title, target_role, data }),
    });
  },

  async updateResume(id: string, title: string, target_role: string, data: any, latex_code?: string) {
    return request<any>(`/resume/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, target_role, data, latex_code }),
    });
  },

  async evaluateResume(params: { id?: string; data?: any; rawText?: string; target_role?: string }) {
    return request<any>('/resume/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async generateLatex(data: any) {
    return request<{ latex: string }>('/resume/generate-latex', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },

  async parseLatex(latex_code: string) {
    return request<{ data: any }>('/resume/parse-latex', {
      method: 'POST',
      body: JSON.stringify({ latex_code }),
    });
  },

  async compileResume(latex_code: string, title: string) {
    return request<any>('/resume/compile', {
      method: 'POST',
      body: JSON.stringify({ latex_code, title }),
    });
  },

  async deleteResume(id: string) {
    return request<any>(`/resume/${id}`, {
      method: 'DELETE'
    });
  },

  async generateInterviewQuestions(params: { type: string, jobDescription?: string, resumeData?: any }) {
    return request<{ questions: any[] }>('/interview/questions', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async evaluateInterviewAnswer(params: { question: string, answer: string, elapsedSec: number, bodyLanguageScore: number, finishedInTime: boolean }) {
    return request<any>('/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
};
