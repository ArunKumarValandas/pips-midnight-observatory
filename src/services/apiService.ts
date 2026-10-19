export interface GuestbookMessage {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  userId: string;
}

export interface GuestbookResponse {
  success: boolean;
  messages: GuestbookMessage[];
  total: number;
  error?: string;
}

export interface CounterResponse {
  success: boolean;
  count: number;
  isNewVisit?: boolean;
  error?: string;
}

// Fetch messages with pagination support (defaults to newest 20)
export async function fetchGuestbookMessages(limit = 20, offset = 0): Promise<{ messages: GuestbookMessage[]; total: number }> {
  try {
    const res = await fetch(`/api/guestbook?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`);
    if (!res.ok) {
      throw new Error(`Failed to load messages (status ${res.status})`);
    }
    const data: GuestbookResponse = await res.json();
    if (!data.success) {
      throw new Error(data.error || 'Server returned an error');
    }
    return { messages: data.messages || [], total: data.total || 0 };
  } catch (err) {
    console.warn('Could not fetch guestbook messages from server:', err);
    throw err;
  }
}

// Submit a new dream message to the shared guestbook
export async function submitGuestbookMessage(
  message: string,
  token: string,
  authorName?: string,
  userId?: string
): Promise<GuestbookMessage> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('Please write a dream wish before sending.');
  }
  if (trimmed.length > 240) {
    throw new Error('Your dream message must be 240 characters or fewer.');
  }

  const res = await fetch('/api/guestbook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      message: trimmed,
      token,
      authorName,
      userId
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to send your dream wish.');
  }

  return data.message;
}

// Get current visit count without incrementing
export async function getVisitCount(): Promise<number> {
  try {
    const res = await fetch('/api/counter');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: CounterResponse = await res.json();
    return data.count || 1204;
  } catch (err) {
    console.warn('Could not retrieve visit count:', err);
    return 1204;
  }
}

// Record a visit for a unique browser session
export async function recordVisitSession(sessionId: string): Promise<{ count: number; isNewVisit: boolean }> {
  try {
    const res = await fetch('/api/counter/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: CounterResponse = await res.json();
    return { count: data.count || 1204, isNewVisit: !!data.isNewVisit };
  } catch (err) {
    console.warn('Could not record visit:', err);
    return { count: 1204, isNewVisit: false };
  }
}

// Inform the backend of an authenticated session to prevent client spoofing
export async function syncAuthSession(session: {
  token: string;
  userId: string;
  name: string;
  email: string;
  expiresAt: number;
}): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
  } catch (err) {
    console.warn('Session sync warning (server may be offline):', err);
  }
}
