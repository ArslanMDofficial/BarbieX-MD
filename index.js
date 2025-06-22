import { makeWASocket, useMultiFileAuthState, Browsers, delay } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import config from './config.js';
import axios from 'axios';
import sharp from 'sharp';

// ======================
// 🛠️  INITIAL SETUP
// ======================
const SESSION_PATH = path.join(process.cwd(), `session_${config.SESSION_ID}`);
if (!fs.existsSync(SESSION_PATH)) fs.mkdirSync(SESSION_PATH);

// ======================
// 🔄 AUTHENTICATION SYSTEM
// ======================

// 🔥 Yeh NEW CODE paste karo (Line 10-13 ke aas paas)
if (fs.existsSync('./creds.json')) {
  fs.renameSync('./creds.json', `./session_${config.SESSION_ID}/creds.json`);
  console.log("🔑 Creds file moved to session folder!");
}

async function initAuth() {
  // ... baaki ka existing code
}
async function initAuth() {
  try {
    // If creds.json exists in root (uploaded by user)
    if (fs.existsSync('./creds.json')) {
      fs.copyFileSync('./creds.json', path.join(SESSION_PATH, 'creds.json'));
      fs.unlinkSync('./creds.json');
      console.log("🔑 Using uploaded credentials");
    }

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
  
  // Show QR if new session
  if (qr && !fs.existsSync(path.join(SESSION_PATH, 'creds.json'))) {
    console.log("\n📳 Scan this QR:");
    qrcode.generate(qr, { small: true });
  }

  // Auto-reconnect
  if (connection === 'close') {
    const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== 401);
    console.log(shouldReconnect ? "🔁 Reconnecting..." : "❌ Permanent disconnect");
    if (shouldReconnect) setTimeout(startBot, 5000);
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
    
    // Ping Command
    if (text === `${config.PREFIX}ping`) {
      await sock.sendMessage(userJid, { text: `🏓 Pong! ${Date.now() - msg.messageTimestamp}ms` });
    }

    // Menu (Buttons)
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

    // Sticker Creator
    else if ((text.startsWith(`${config.PREFIX}sticker`)) && msg.message.imageMessage) {
      const buffer = await downloadMediaMessage(msg, 'buffer', {});
      const webp = await sharp(buffer).resize(512, 512).webp().toBuffer();
      await sock.sendMessage(userJid, { sticker: webp });
    }

    // ======================
    // 🔒  OWNER COMMANDS
    // ======================
    if (isOwner) {
      // Broadcast (Owner Only)
      if (text.startsWith(`${config.PREFIX}bc `)) {
        const message = text.split(' ').slice(1).join(' ');
        // Implement broadcast logic
      }
    }

  } catch (error) {
    console.error('Command Error:', error);
    await sock.sendMessage(userJid, { text: "❌ Error processing command!" });
  }
});

// ======================
// 🛠️  UTILITY FUNCTIONS
// ======================

// Auto-restart
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Bot crashed, restarting...', err);
  startBot();
});

console.log(`🚀 Starting ${config.BOT_NAME} (Session ID: ${config.SESSION_ID})`);
