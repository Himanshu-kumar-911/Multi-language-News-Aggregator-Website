// Simple localStorage-based auth client for demo purposes

const USERS_KEY = 'auth_users';
const CURRENT_USER_KEY = 'auth_current_user';

function readUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

class AuthClient {
  getCurrentUser() {
    return readCurrentUser();
  }

  async register({ name, email, password }) {
    await new Promise(r => setTimeout(r, 400));
    const users = readUsers();
    const emailLower = String(email || '').trim().toLowerCase();

    if (!name || !emailLower || !password) {
      throw new Error('All fields are required');
    }

    if (users.some(u => u.email === emailLower)) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: String(name).trim(),
      email: emailLower,
      // NOTE: Do NOT store plaintext passwords in production. This is a demo only.
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);
    writeCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  async login({ email, password }) {
    await new Promise(r => setTimeout(r, 300));
    const users = readUsers();
    const emailLower = String(email || '').trim().toLowerCase();

    const found = users.find(u => u.email === emailLower);
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password');
    }

    const user = { id: found.id, name: found.name, email: found.email };
    writeCurrentUser(user);
    return user;
  }

  async logout() {
    await new Promise(r => setTimeout(r, 100));
    writeCurrentUser(null);
  }
}

export const authClient = new AuthClient();


