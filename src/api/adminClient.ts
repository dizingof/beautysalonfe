import type { Master, Service } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://beautysalon-api.fly.dev/api';

export function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function setToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function fetchAdmin<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const text = await res.text();
    let message = `Помилка ${res.status}`;
    try {
      const json = JSON.parse(text);
      if (json.message) message = json.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }
  return res.json();
}

// ── Auth ──
export async function adminLogin(username: string, password: string): Promise<string> {
  const data = await fetchAdmin<{ token: string }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.token;
}

// ── Masters ──
export async function adminGetMasters(): Promise<Master[]> {
  return fetchAdmin<Master[]>('/admin/masters');
}

export interface MasterPayload {
  name: string;
  photo: string;
  experience: string;
  description: string;
  specializations: string[];
}

export async function adminCreateMaster(data: MasterPayload): Promise<Master> {
  return fetchAdmin<Master>('/admin/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateMaster(id: string, data: MasterPayload): Promise<void> {
  return fetchAdmin<void>(`/admin/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteMaster(id: string): Promise<void> {
  return fetchAdmin<void>(`/admin/masters/${id}`, { method: 'DELETE' });
}

// ── Services ──
export async function adminGetServices(): Promise<Service[]> {
  return fetchAdmin<Service[]>('/admin/services');
}

export interface ServicePayload {
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  image: string;
}

export async function adminCreateService(data: ServicePayload): Promise<Service> {
  return fetchAdmin<Service>('/admin/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateService(id: string, data: ServicePayload): Promise<void> {
  return fetchAdmin<void>(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteService(id: string): Promise<void> {
  return fetchAdmin<void>(`/admin/services/${id}`, { method: 'DELETE' });
}

export interface ReviewPayload {
  author: string;
  rating: number;
  text: string;
  masterId: string;
  date?: string;
}

export async function adminGetReviews(): Promise<import('../types').Review[]> {
  return fetchAdmin<import('../types').Review[]>('/admin/reviews');
}

export async function adminCreateReview(data: ReviewPayload): Promise<import('../types').Review> {
  return fetchAdmin<import('../types').Review>('/admin/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateReview(id: string, data: ReviewPayload): Promise<void> {
  return fetchAdmin<void>(`/admin/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteReview(id: string): Promise<void> {
  return fetchAdmin<void>(`/admin/reviews/${id}`, { method: 'DELETE' });
}

// ── Bookings ──
export interface AdminBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  masterId: string;
  masterName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  status: string;
  createdAt: string;
}

export async function adminGetBookings(params?: {
  masterId?: string;
  date?: string;
  status?: string;
}): Promise<AdminBooking[]> {
  const qs = new URLSearchParams();
  if (params?.masterId) qs.set('masterId', params.masterId);
  if (params?.date) qs.set('date', params.date);
  if (params?.status) qs.set('status', params.status);
  const q = qs.toString();
  return fetchAdmin<AdminBooking[]>(`/admin/bookings${q ? `?${q}` : ''}`);
}

export async function adminUpdateBookingStatus(id: string, status: string): Promise<void> {
  return fetchAdmin<void>(`/admin/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
