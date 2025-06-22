import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import axios from 'axios';

export const ping = {
  name: "ping",
  desc: "Check bot response time",
  alias: ["speed"],
  category: "fun",
  usage: `${config.PREFIX}ping`,
  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🏓 Pong! ${Date.now() - msg.messageTimestamp}ms`
    });
  }
};

export const sticker = {
  name: "sticker",
  desc: "Convert image to sticker",
  alias: ["s"],
  category: "media",
  usage: `${config.PREFIX}sticker (reply to image)`,
  run: async (sock, msg) => {
    if (!msg.message.imageMessage) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Please reply to an image!"
      });
    }

    try {
      const buffer = await downloadMediaMessage(msg, 'buffer', {});
      const webp = await sharp(buffer)
        .resize(512, 512)
        .webp()
        .toBuffer();
      
      await sock.sendMessage(msg.key.remoteJid, { 
        sticker: webp 
      });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Error creating sticker: ${error.message}`
      });
    }
  }
};

export const menu = {
  name: "menu",
  desc: "Show interactive menu",
  alias: ["help"],
  category: "utility",
  usage: `${config.PREFIX}menu`,
  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: `*${config.BOT_NAME} Menu*`,
      buttons: [
        { 
          buttonId: 'help', 
          buttonText: { displayText: 'Help 📚' }, 
          type: 1 
        },
        { 
          buttonId: 'owner', 
          buttonText: { displayText: 'Owner 👑' }, 
          type: 1 
        }
      ],
      footer: `Prefix: ${config.PREFIX}`
    });
  }
};

// Additional fun commands can be added below
export const joke = {
  name: "joke",
  desc: "Tell a random joke",
  category: "fun",
  run: async (sock, msg) => {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!"
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: randomJoke });
  }
};
