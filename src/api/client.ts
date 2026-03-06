const API_BASE = import.meta.env.VITE_API_URL || 'https://beautysalon-api.fly.dev/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Services ──
export async function getServices(category?: string) {
  const params = category ? `?category=${category}` : '';
  return fetchJson<import('../types').Service[]>(`${API_BASE}/services${params}`);
}

export async function getServiceById(id: string) {
  return fetchJson<import('../types').Service>(`${API_BASE}/services/${id}`);
}

// ── Masters ──
export async function getMasters(category?: string) {
  const params = category ? `?category=${category}` : '';
  return fetchJson<import('../types').Master[]>(`${API_BASE}/masters${params}`);
}

export async function getMasterById(id: string) {
  return fetchJson<import('../types').Master>(`${API_BASE}/masters/${id}`);
}

// ── Time Slots ──
export async function getTimeSlots(masterId: string, date: string) {
  return fetchJson<import('../types').TimeSlot[]>(
    `${API_BASE}/masters/${masterId}/timeslots?date=${date}`
  );
}

// ── Bookings ──
export async function createBooking(data: {
  serviceId: string;
  masterId: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
}) {
  return fetchJson<{ id: string }>(`${API_BASE}/bookings`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Reviews ──
export async function getReviews(masterId?: string) {
  const params = masterId ? `?masterId=${masterId}` : '';
  return fetchJson<import('../types').Review[]>(`${API_BASE}/reviews${params}`);
}

export async function createReview(data: {
  author: string;
  rating: number;
  text: string;
  masterId: string;
}) {
  return fetchJson<import('../types').Review>(`${API_BASE}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Categories ──
export async function getCategories() {
  return fetchJson<{ key: string; name: string; minPrice: number }[]>(
    `${API_BASE}/categories`
  );
}

// ── Contact ──
export async function getContactInfo() {
  return fetchJson<import('../types').ContactInfo>(`${API_BASE}/contact`);
}
