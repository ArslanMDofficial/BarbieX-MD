import { makeWASocket, useMultiFileAuthState, Browsers, downloadContentFromMessage } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import config from './config.js';
import sharp from 'sharp';
import 'dotenv/config';

// ======================
// 🛠️  INITIAL SETUP
// ======================
const SESSION_PATH = path.join(process.cwd(), `session_${config.SESSION_ID}`);
if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH, { recursive: true });

// ======================
// 🔄  AUTHENTICATION SYSTEM
// ======================

// Handle creds.json upload
if (fs.existsSync('./creds.json')) {
  fs.copyFileSync('./creds.json', path.join(SESSION_PATH, 'creds.json'));
  fs.unlinkSync('./creds.json');
  console.log("🔑 Credentials moved to session folder");
}

async function initAuth() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
    return { state, saveCreds };
  } catch (error) {
    console.error("Auth Error:", error);
    process.exit(1);
  }
}

// ======================
// 🤖  BOT CONNECTION
// ======================
const { state, saveCreds } = await initAuth();
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: !fs.existsSync(path.join(SESSION_PATH, 'creds.json')),
  browser: Browsers.macOS('Chrome'),
  logger: { level: 'warn' },
  getMessage: async (key) => ({ conversation: 'Message not cached' })
});

// ======================
// 🔄  EVENT HANDLERS
// ======================

// Save Creds
sock.ev.on('creds.update', saveCreds);

// Connection Updates
sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect, qr } = update;
  
  if (qr && !fs.existsSync(path.join(SESSION_PATH, 'creds.json'))) {
    console.log("\n📳 Scan this QR:");
    qrcode.generate(qr, { small: true });
  }

  if (connection === 'close') {
    const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== 401);
    console.log(shouldReconnect ? "🔁 Reconnecting..." : "❌ Permanent disconnect");
    if (shouldReconnect) setTimeout(() => startBot(), 5000);
  } else if (connection === 'open') {
    console.log(`✅ ${config.BOT_NAME} Online! (Session ID: ${config.SESSION_ID})`);
  }
});

// ======================
// 💬  MESSAGE HANDLER
// ======================
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const userJid = msg.key.remoteJid;
  const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase();
  const isOwner = msg.key.participant?.endsWith(`${config.OWNER_NUMBER}@s.whatsapp.net`);

  try {
    // ======================
    // 🎯  CORE COMMANDS
    // ======================
    
    if (text === `${config.PREFIX}ping`) {
      await sock.sendMessage(userJid, { text: `🏓 Pong! ${Date.now() - msg.messageTimestamp}ms` });
    }
    else if (text === `${config.PREFIX}menu`) {
      await sock.sendMessage(userJid, {
        text: `*${config.BOT_NAME} Menu*\nSession ID: ${config.SESSION_ID}`,
        buttons: [
          { buttonId: 'help', buttonText: { displayText: 'Help 📚' }, type: 1 },
          { buttonId: 'owner', buttonText: { displayText: 'Owner 👑' }, type: 1 }
        ],
        footer: `Prefix: ${config.PREFIX}`
      });
    }
    else if ((text.startsWith(`${config.PREFIX}sticker`)) && msg.message.imageMessage) {
      const buffer = await downloadMedia(msg);
      const webp = await sharp(buffer).resize(512, 512).webp().toBuffer();
      await sock.sendMessage(userJid, { sticker: webp });
    }

    // ======================
    // 🔒  OWNER COMMANDS
    // ======================
    if (isOwner && text.startsWith(`${config.PREFIX}bc `)) {
      const message = text.split(' ').slice(1).join(' ');
      // Broadcast logic here
    }

  } catch (error) {
    console.error('Command Error:', error);
    await sock.sendMessage(userJid, { 
      text: `❌ Error in command: ${error.message}` 
    });
  }
});

// ======================
// 🛠️  UTILITY FUNCTIONS
// ======================

async function downloadMedia(msg) {
  try {
    const buffer = await downloadContentFromMessage(
      msg.message.imageMessage || 
      msg.message.videoMessage, 
      'buffer'
    );
    let chunks = [];
    for await (const chunk of buffer) chunks.push(chunk);
    return Buffer.concat(chunks);
  } catch (error) {
    throw new Error(`Media download failed: ${error.message}`);
  }
}

function startBot() {
  console.log("🔄 Restarting bot...");
  import('./index.js');
}

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Bot crashed:', err);
  startBot();
});

console.log(`🚀 Starting ${config.BOT_NAME} (Session ID: ${config.SESSION_ID})`);
