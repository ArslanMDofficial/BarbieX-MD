import { createRateLimiter } from 'rate-limiter-flexible';
import Filter from 'bad-words';
import { getBuffer, decrypt } from './functions.js';
import logger from './logger.js';
import UserDB from '../models/User.js';

// ==================== SECURITY CONFIG ====================
const config = {
  MAX_REQUESTS_PER_MIN: 30,       // Anti-flood
  BAN_AFTER_REPORTS: 3,           // Auto-ban system
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default-secure-key'
};

// ==================== PROTECTION SYSTEMS ====================

// 1. Rate Limiter (Anti-Spam)
const messageLimiter = new createRateLimiter({
  points: config.MAX_REQUESTS_PER_MIN,
  duration: 60,
  blockDuration: 300 // 5min block
});

// 2. Content Filter
const profanityFilter = new Filter({
  placeHolder: '🌸',
  list: require('../assets/bad-words.json') // Custom word list
});

// 3. Anti-Virus Scanner (Mock)
const scanBuffer = async (buffer) => {
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType) return { safe: false, reason: 'Invalid file type' };
  
  // Check for executable files
  if (['exe', 'bat', 'sh'].includes(fileType.ext)) {
    return { safe: false, reason: 'Executable files not allowed' };
  }
  
  return { safe: true };
};

// ==================== CORE SAFETY FUNCTIONS ====================

/**
 * Message Safety Check
 * @param {object} message - WA message object
 * @returns {object} { isSafe: boolean, reason?: string }
 */
export const checkMessageSafety = async (message) => {
  try {
    // 1. Rate Limit Check
    const limiterRes = await messageLimiter.consume(message.sender);
    if (limiterRes.remainingPoints <= 0) {
      return { 
        isSafe: false, 
        reason: `Too many messages! Wait ${limiterRes.msBeforeNext/1000}s`
      };
    }

    // 2. Content Analysis
    if (message.body) {
      // Profanity check
      if (profanityFilter.isProfane(message.body)) {
        await UserDB.updateOne(
          { jid: message.sender },
          { $inc: { warningCount: 1 } }
        );
        return { isSafe: false, reason: 'Inappropriate language' };
      }

      // Link protection
      if (/(https?:\/\/[^\s]+)/.test(message.body)) {
        const url = message.body.match(/(https?:\/\/[^\s]+)/)[0];
        if (!await isSafeUrl(url)) {
          return { isSafe: false, reason: 'Malicious link detected' };
        }
      }
    }

    // 3. Media Analysis
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      const scanResult = await scanBuffer(media.data);
      if (!scanResult.safe) {
        return { isSafe: false, reason: scanResult.reason };
      }
    }

    return { isSafe: true };
  } catch (error) {
    logger.error(`Safety check failed: ${error.message}`);
    return { isSafe: false, reason: 'System error' };
  }
};

// ==================== ADVANCED PROTECTIONS ====================

// URL Safety Check (Integration with VirusTotal API)
async function isSafeUrl(url) {
  try {
    const response = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      { url },
      { 
        headers: { 
          'x-apikey': process.env.VIRUSTOTAL_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data.attributes.last_analysis_stats.malicious === 0;
  } catch {
    return false; // Block if check fails
  }
}

// Encryption Handler
export const secureSession = {
  encrypt: (data) => {
    const cipher = crypto.createCipher('aes-256-cbc', config.ENCRYPTION_KEY);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  decrypt: (encrypted) => {
    try {
      return JSON.parse(decrypt(encrypted, config.ENCRYPTION_KEY));
    } catch {
      return null;
    }
  }
};

// ==================== AUTOMATED MODERATION ====================

// Auto-ban system
export const handleViolation = async (userId, reason) => {
  await UserDB.updateOne(
    { jid: userId },
    { 
      $inc: { violationCount: 1 },
      $set: { lastViolation: new Date() }
    }
  );

  const user = await UserDB.findOne({ jid: userId });
  if (user.violationCount >= config.BAN_AFTER_REPORTS) {
    await UserDB.updateOne(
      { jid: userId },
      { $set: { banned: true, banReason: reason } }
    );
    logger.warn(`User ${userId} banned for: ${reason}`);
    return true;
  }
  return false;
};

// ==================== EXPORTS ====================
export default {
  checkMessageSafety,
  secureSession,
  handleViolation,
  filters: {
    profanity: profanityFilter,
    rateLimit: messageLimiter
  }
};
