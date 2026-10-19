import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');
const COUNTER_FILE = path.join(DATA_DIR, 'counter.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Atomic file write using temporary file and atomic rename
async function atomicWriteJson(filePath, data) {
  ensureDataDir();
  const tempPath = `${filePath}.${Date.now()}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tempPath, filePath);
}

// Initialize seed data if files don't exist
export async function initDatabase() {
  ensureDataDir();

  // 1. Seed Guestbook
  if (!fs.existsSync(GUESTBOOK_FILE)) {
    const seedGuestbook = [
      {
        id: 'msg-seed-1',
        author: 'Pip, Junior Dream Engineer',
        message: 'Welcome to Midnight Observatory! May the stars guide your gentle dreams tonight. ✨',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        userId: 'pip-admin'
      },
      {
        id: 'msg-seed-2',
        author: 'Dreamer Nova',
        message: 'Wishing for sweet starlight dreams and peaceful slumber for all little dreamers. 🌙',
        createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
        userId: 'user-demo-002'
      },
      {
        id: 'msg-seed-3',
        author: 'Pip’s Apprentice',
        message: 'Charted quiet sky routes tonight. Every wandering dream has found its way home. ⭐',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        userId: 'demo-stargazer-001'
      }
    ];
    await atomicWriteJson(GUESTBOOK_FILE, seedGuestbook);
  }

  // 2. Seed Counter
  if (!fs.existsSync(COUNTER_FILE)) {
    const seedCounter = {
      totalVisits: 1204,
      sessions: {
        'seed-session-0': Date.now() - 86400000
      }
    };
    await atomicWriteJson(COUNTER_FILE, seedCounter);
  }

  // 3. Seed Sessions
  if (!fs.existsSync(SESSIONS_FILE)) {
    await atomicWriteJson(SESSIONS_FILE, {});
  }
}

// --- GUESTBOOK OPERATIONS ---

export async function getGuestbookMessages(limit = 20, offset = 0) {
  await initDatabase();
  try {
    const raw = await fs.promises.readFile(GUESTBOOK_FILE, 'utf8');
    const messages = JSON.parse(raw);
    // Ensure sorted newest first
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paged = messages.slice(offset, offset + limit);
    return { messages: paged, total: messages.length };
  } catch (err) {
    console.error('Error reading guestbook:', err);
    return { messages: [], total: 0 };
  }
}

export async function addGuestbookMessage(author, message, userId = 'anonymous') {
  await initDatabase();
  const cleanAuthor = String(author || 'Anonymous Dreamer').trim().slice(0, 60);
  const cleanMessage = String(message || '').trim().slice(0, 240);

  if (!cleanMessage) {
    throw new Error('Message cannot be empty.');
  }

  const raw = await fs.promises.readFile(GUESTBOOK_FILE, 'utf8');
  const messages = JSON.parse(raw);

  const newEntry = {
    id: `msg-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
    author: cleanAuthor,
    message: cleanMessage,
    createdAt: new Date().toISOString(),
    userId: String(userId)
  };

  messages.unshift(newEntry);
  await atomicWriteJson(GUESTBOOK_FILE, messages);
  return newEntry;
}

// --- COUNTER OPERATIONS ---

export async function getVisitCount() {
  await initDatabase();
  try {
    const raw = await fs.promises.readFile(COUNTER_FILE, 'utf8');
    const data = JSON.parse(raw);
    return data.totalVisits || 1204;
  } catch (err) {
    console.error('Error reading counter:', err);
    return 1204;
  }
}

export async function recordVisit(sessionId) {
  await initDatabase();
  const cleanSessionId = String(sessionId || '').trim();
  if (!cleanSessionId) {
    return { count: await getVisitCount(), isNewVisit: false };
  }

  const raw = await fs.promises.readFile(COUNTER_FILE, 'utf8');
  const data = JSON.parse(raw);
  if (!data.sessions) data.sessions = {};
  if (typeof data.totalVisits !== 'number') data.totalVisits = 1204;

  // Check if session has already been counted
  if (data.sessions[cleanSessionId]) {
    return { count: data.totalVisits, isNewVisit: false };
  }

  // New visit! Increment atomically
  data.totalVisits += 1;
  data.sessions[cleanSessionId] = Date.now();

  // Prune sessions older than 7 days if dictionary exceeds 5000 entries
  const sessionKeys = Object.keys(data.sessions);
  if (sessionKeys.length > 5000) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const key of sessionKeys) {
      if (data.sessions[key] < cutoff) {
        delete data.sessions[key];
      }
    }
  }

  await atomicWriteJson(COUNTER_FILE, data);
  return { count: data.totalVisits, isNewVisit: true };
}

// --- SESSION STORAGE OPERATIONS ---

export async function registerSession(token, userId, name, email, expiresAt) {
  await initDatabase();
  try {
    const raw = await fs.promises.readFile(SESSIONS_FILE, 'utf8');
    const sessions = JSON.parse(raw);
    sessions[token] = {
      token,
      userId,
      name,
      email,
      expiresAt: Number(expiresAt) || (Date.now() + 24 * 60 * 60 * 1000)
    };
    await atomicWriteJson(SESSIONS_FILE, sessions);
    return true;
  } catch (err) {
    console.error('Error saving session:', err);
    return false;
  }
}

export async function getSession(token) {
  if (!token) return null;
  await initDatabase();
  try {
    const raw = await fs.promises.readFile(SESSIONS_FILE, 'utf8');
    const sessions = JSON.parse(raw);
    const session = sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete sessions[token];
      await atomicWriteJson(SESSIONS_FILE, sessions);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}
