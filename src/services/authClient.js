// Backend API-based auth client

const API_BASE_URL = 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'auth_current_user';
const TOKEN_KEY = 'auth_token';

function writeCurrentUser(user) {
  if (user) {
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function readCurrentUser() {
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function readToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

class AuthClient {
  getCurrentUser() {
    return readCurrentUser();
  }

  getToken() {
    return readToken();
  }

  async register({ name, email, password }) {
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.split('@')[0], // Use email prefix as username
        email: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        preferredLanguage: 'en'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    const { user, token } = data.data;
    writeToken(token);
    writeCurrentUser(user);
    return user;
  }

  async login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    const { user, token } = data.data;
    writeToken(token);
    writeCurrentUser(user);
    return user;
  }

  async logout() {
    const token = readToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    writeToken(null);
    writeCurrentUser(null);
  }

  async verifyToken() {
    const token = readToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return true;
      } else {
        // Token is invalid, clear it
        writeToken(null);
        writeCurrentUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      writeToken(null);
      writeCurrentUser(null);
      return false;
    }
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'superadmin');
  }
}

export const authClient = new AuthClient();


