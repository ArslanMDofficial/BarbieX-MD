import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Encryption Key (32 characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secure-key-32-chars-123456';

/**
 * Initialize authentication with session encryption
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<{state: object, saveCreds: function}>}
 */
export async function initAuth(sessionId) {
  const SESSION_PATH = path.join(process.cwd(), `session_${sessionId}`);
  
  // Create session directory if not exists
  if (!fs.existsSync(SESSION_PATH)) {
    fs.mkdirSync(SESSION_PATH, { recursive: true });
  }

  // Handle creds.json upload
  if (fs.existsSync('./creds.json')) {
    const encryptedCreds = encryptData(fs.readFileSync('./creds.json', 'utf8'));
    fs.writeFileSync(path.join(SESSION_PATH, 'creds.enc'), encryptedCreds);
    fs.unlinkSync('./creds.json');
    console.log('🔐 Uploaded credentials encrypted and saved');
  }

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

  return {
    state,
    saveCreds: async () => {
      await saveCreds();
      encryptSessionFiles(SESSION_PATH); // Auto-encrypt after save
    }
  };
}

/**
 * Encrypt session files (creds.json + keys.json)
 * @param {string} sessionPath 
 */
function encryptSessionFiles(sessionPath) {
  ['creds.json', 'keys.json'].forEach(file => {
    const filePath = path.join(sessionPath, file);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      fs.writeFileSync(`${filePath}.enc`, encryptData(data));
      fs.unlinkSync(filePath); // Remove plaintext file
    }
  });
}

/**
 * Decrypt session files when bot starts
 * @param {string} sessionPath 
 */
function decryptSessionFiles(sessionPath) {
  ['creds.json', 'keys.json'].forEach(file => {
    const encFile = path.join(sessionPath, `${file}.enc`);
    if (fs.existsSync(encFile)) {
      const data = decryptData(fs.readFileSync(encFile, 'utf8'));
      fs.writeFileSync(path.join(sessionPath, file), data);
    }
  });
}

// AES-256-CBC Encryption
function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// AES-256-CBC Decryption
function decryptData(data) {
  const parts = data.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

/**
 * Validate session and auto-recover if needed
 * @param {string} sessionId 
 * @returns {Promise<boolean>}
 */
export async function validateSession(sessionId) {
  const SESSION_PATH = path.join(process.cwd(), `session_${sessionId}`);
  
  if (!fs.existsSync(SESSION_PATH)) return false;

  try {
    decryptSessionFiles(SESSION_PATH);
    return fs.existsSync(path.join(SESSION_PATH, 'creds.json'));
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
    }
