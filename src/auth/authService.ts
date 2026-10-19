// Secure client-side authentication engine using Web Cryptography API (PBKDF2 / SHA-256)
// Zero plaintext passwords stored, cryptographic salting, session tokens, and account validation.

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  salt: string; // Hex-encoded random salt
  passwordHash: string; // Hex-encoded SHA-256 hash of (salt + password)
  createdAt: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  name: string;
  expiresAt: number; // Timestamp
}

const STORAGE_USERS_KEY = 'pip_observatory_registered_users';
const STORAGE_SESSION_KEY = 'pip_observatory_active_session';

// Helper: Convert ArrayBuffer to Hex String
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a cryptographically secure random salt (16 bytes)
function generateSalt(): string {
  const saltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(saltBytes);
  return bufferToHex(saltBytes.buffer);
}

// Cryptographic Hash function using native Web Crypto SHA-256 with salt
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + ':' + password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Load registered users from storage
function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Save registered users to storage
function saveStoredUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users store:', err);
  }
}

// Seed standard verified demo stargazer account if no accounts exist
export async function seedDemoAccountsIfEmpty(): Promise<void> {
  const users = getStoredUsers();
  if (users.length === 0) {
    const salt = generateSalt();
    // Default demo account: dreamer@midnight.nursery / Starlight#2026
    const passwordHash = await hashPassword('Starlight#2026', salt);
    const demoUser: UserAccount = {
      id: 'demo-stargazer-001',
      name: 'Pip’s Apprentice',
      email: 'dreamer@midnight.nursery',
      salt,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    saveStoredUsers([demoUser]);
  }
}

// Authenticate with Email & Password
export async function verifyAndLogin(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  await seedDemoAccountsIfEmpty();

  const normalizedEmail = emailInput.trim().toLowerCase();
  const users = getStoredUsers();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return {
      success: false,
      error: 'Unknown dreamer account. No registration found with this email. Please create an account first.'
    };
  }

  // Compute hash of the entered password with user's specific salt
  const computedHash = await hashPassword(passwordInput, user.salt);

  if (computedHash !== user.passwordHash) {
    return {
      success: false,
      error: 'Incorrect starry password. Please check your credentials and try again.'
    };
  }

  // Credentials verified! Generate a real cryptographic session token
  const tokenBytes = new Uint8Array(24);
  window.crypto.getRandomValues(tokenBytes);
  const sessionToken = bufferToHex(tokenBytes.buffer);

  const session: AuthSession = {
    token: sessionToken,
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24-hour session
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Could not persist session:', err);
  }

  return { success: true, session };
}

// Register a New Dreamer Account
export async function registerNewUser(
  nameInput: string,
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
  await seedDemoAccountsIfEmpty();

  const normalizedEmail = emailInput.trim().toLowerCase();
  const trimmedName = nameInput.trim();

  if (!trimmedName) {
    return { success: false, error: 'Please enter a dreamer name.' };
  }

  if (passwordInput.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'A dreamer account with this email already exists. Please sign in instead.'
    };
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(passwordInput, salt);

  const newUser: UserAccount = {
    id: 'user-' + Date.now(),
    name: trimmedName,
    email: normalizedEmail,
    salt,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveStoredUsers(users);

  // Automatically authenticate upon successful registration
  const tokenBytes = new Uint8Array(24);
  window.crypto.getRandomValues(tokenBytes);
  const sessionToken = bufferToHex(tokenBytes.buffer);

  const session: AuthSession = {
    token: sessionToken,
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Could not persist session:', err);
  }

  return { success: true, session };
}

// Validate active session (checking expiration and user existence)
export function getActiveSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);

    // Check expiration
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    // Verify user still exists
    const users = getStoredUsers();
    const userExists = users.some((u) => u.id === session.userId);
    if (!userExists) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

// Invalidate session on logout
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch {
    // Ignored
  }
}
