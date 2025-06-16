import axios from 'axios';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { tmpdir } from 'os';

// ==================== CORE UTILITIES ====================
export const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

// ==================== MEDIA PROCESSING ====================
export const getBuffer = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

export const generateThumbnail = async (videoPath) => {
  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: tmpdir(),
        size: '640x360'
      })
      .on('end', () => resolve(path.join(tmpdir(), 'thumbnail_000.png')));
  });
};

export const webpToPng = async (webpBuffer) => {
  return await sharp(webpBuffer)
    .png()
    .toBuffer();
};

// ==================== SECURITY FUNCTIONS ====================
export const encrypt = (text, key) => {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decrypt = (encrypted, key) => {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// ==================== WHATSAPP SPECIFIC ====================
export const parseJid = (jid) => jid?.split('@')[0] || jid;

export const isAdmin = async (groupId, userId, sock) => {
  const metadata = await sock.groupMetadata(groupId);
  return metadata.participants.some(p => 
    p.id === userId && (p.admin === 'admin' || p.admin === 'superadmin')
  );
};

// ==================== FILE OPERATIONS ====================
export const fileExists = async (filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

export const readJSON = async (filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return null;
  }
};

// ==================== TEXT MANIPULATION ====================
export const fancyText = (text, style = 'bold') => {
  const styles = {
    bold: '𝗧𝗵𝗶𝘀 𝗶𝘀 𝗯𝗼𝗹𝗱',
    italic: '𝘛𝘩𝘪𝘴 𝘪𝘴 𝘪𝘵𝘢𝘭𝘪𝘤',
    smallcaps: 'ᴛʜɪꜱ ɪꜱ ꜱᴍᴀʟʟᴄᴀᴘꜱ'
  };
  return styles[style] || text;
};

export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
    .filter(Boolean)
    .join(':');
};

// ==================== VALIDATION FUNCTIONS ====================
export const isUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isPhoneNumber = (num) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneRegex.test(num);
};

// ==================== SPECIAL FEATURES ====================
export const calculatePeriod = (lastDate, cycleLength = 28) => {
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + cycleLength);
  
  const fertileStart = new Date(nextDate);
  fertileStart.setDate(fertileStart.getDate() - 14);
  
  const fertileEnd = new Date(fertileStart);
  fertileEnd.setDate(fertileEnd.getDate() + 6);
  
  return {
    next: nextDate.toLocaleDateString(),
    fertile: `${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`,
    ovulation: new Date(fertileStart.getTime() + (3 * 86400000)).toLocaleDateString()
  };
};

// ==================== EXPORT ALL ====================
export default {
  getRandom,
  delay,
  formatBytes,
  getBuffer,
  generateThumbnail,
  webpToPng,
  encrypt,
  decrypt,
  parseJid,
  isAdmin,
  fileExists,
  readJSON,
  fancyText,
  formatTime,
  isUrl,
  isPhoneNumber,
  calculatePeriod
};
