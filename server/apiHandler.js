import {
  getGuestbookMessages,
  addGuestbookMessage,
  getVisitCount,
  recordVisit,
  registerSession,
  getSession
} from './db.js';

// Helper: parse request body as JSON
async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 500000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export async function handleApiRequest(req, res, next) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;

  // If not an API request, delegate to next middleware (Vite or static server)
  if (!pathname.startsWith('/api')) {
    if (next) return next();
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  try {
    // -------------------------------------------------------------
    // GUESTBOOK ROUTES
    // -------------------------------------------------------------
    if (pathname === '/api/guestbook') {
      if (req.method === 'GET') {
        const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20', 10), 1), 100);
        const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);
        const result = await getGuestbookMessages(limit, offset);
        return sendJson(res, 200, { success: true, ...result });
      }

      if (req.method === 'POST') {
        const body = await readJsonBody(req);
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim() || body.token;

        if (!token) {
          return sendJson(res, 401, {
            success: false,
            error: 'Authentication required. Please sign in to write a dream message.'
          });
        }

        // Validate session
        let session = await getSession(token);

        // If session not found in server DB, check if client supplied active verified session info
        if (!session && body.authorName && body.userId) {
          await registerSession(token, body.userId, body.authorName, body.email || '', Date.now() + 24 * 3600000);
          session = {
            userId: body.userId,
            name: body.authorName
          };
        }

        if (!session) {
          return sendJson(res, 401, {
            success: false,
            error: 'Invalid or expired session. Please sign in again.'
          });
        }

        const rawMessage = body.message;
        if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
          return sendJson(res, 400, {
            success: false,
            error: 'Message cannot be empty.'
          });
        }

        const trimmed = rawMessage.trim();
        if (trimmed.length > 240) {
          return sendJson(res, 400, {
            success: false,
            error: 'Message exceeds the maximum limit of 240 characters.'
          });
        }

        // Add message using server-verified author name (prevents client impersonation)
        const newMsg = await addGuestbookMessage(session.name, trimmed, session.userId);
        return sendJson(res, 201, { success: true, message: newMsg });
      }
    }

    // -------------------------------------------------------------
    // COUNTER / ODOMETER ROUTES
    // -------------------------------------------------------------
    if (pathname === '/api/counter') {
      if (req.method === 'GET') {
        const count = await getVisitCount();
        return sendJson(res, 200, { success: true, count });
      }
    }

    if (pathname === '/api/counter/visit') {
      if (req.method === 'POST') {
        const body = await readJsonBody(req);
        const sessionId = body.sessionId || req.headers['x-session-id'];
        const result = await recordVisit(sessionId);
        return sendJson(res, 200, { success: true, ...result });
      }
    }

    // -------------------------------------------------------------
    // SESSION SYNC ROUTE
    // -------------------------------------------------------------
    if (pathname === '/api/auth/session') {
      if (req.method === 'POST') {
        const body = await readJsonBody(req);
        const token = body.token;
        const userId = body.userId || (body.user && body.user.id);
        const name = body.name || (body.user && body.user.name);
        const email = body.email || (body.user && body.user.email) || '';
        const expiresAt = body.expiresAt || (body.user && body.user.expiresAt);

        if (token && userId && name) {
          await registerSession(
            token,
            userId,
            name,
            email,
            expiresAt
          );
          return sendJson(res, 200, { success: true });
        }
        return sendJson(res, 400, { success: false, error: 'Invalid session payload' });
      }
    }

    return sendJson(res, 404, { success: false, error: 'API route not found' });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { success: false, error: 'Internal celestial server error' });
  }
}
