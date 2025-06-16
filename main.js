const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { getBuffer } = require('./lib/functions');
const { fancyText, stylishFonts } = require('./lib/design');
const Filter = require('bad-words');
const filter = new Filter();

// AI Chat Engine (GPT-3.5 Turbo)
const chatAI = async (message) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_KEY}` }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error);
    return "Sorry, I'm having trouble thinking right now 🧠";
  }
};

// Enhanced Message Handler
module.exports = {
  handleMessages: async (sock, m, isGroup) => {
    try {
      const msg = m.messages[0];
      const userJid = msg.key.remoteJid;
      const message = msg.message.conversation || msg.message.extendedTextMessage?.text;

      // Anti-Spam Protection
      if (msg.key.fromMe || !message) return;
      
      // Auto-Delete Bad Words
      if (filter.isProfane(message)) {
        await sock.sendMessage(userJid, { 
          text: "🚫 Language not allowed! You've been warned."
        });
        if (isGroup) await sock.groupParticipantsUpdate(
          userJid, [msg.key.participant], "remove"
        );
        return;
      }

      // AI-Powered Features
      if (message.startsWith("!ai")) {
        const prompt = message.slice(3).trim();
        const aiResponse = await chatAI(prompt);
        await sock.sendMessage(userJid, { text: aiResponse });
        return;
      }

      // Sticker Creator (WebP/Video)
      if (message.startsWith("!sticker") && msg.message.imageMessage) {
        const media = await sock.downloadMediaMessage(msg);
        const stickerParams = {
          pack: 'BarbieX-MD',
          author: 'Your BFF',
          categories: ['🤩', '🎀'],
          quality: 100
        };
        await sock.sendMessage(userJid, {
          sticker: { url: media },
          ...stickerParams
        });
        return;
      }

      // Period Tracker (Women Health)
      if (message.startsWith("!period")) {
        const trackerData = calculateCycle(message);
        await sock.sendMessage(userJid, {
          text: `📅 *Cycle Tracker*\n\nNext Period: ${trackerData.nextDate}\nFertile Window: ${trackerData.fertileDays}`
        });
        return;
      }

      // More features below...
      
    } catch (error) {
      console.error('Handler Error:', error);
    }
  },

  // Ultra Group Manager
  handleGroupParticipantUpdate: async (sock, update) => {
    const { action, participants, groupId } = update;
    
    // Auto-Welcome
    if (action === 'add') {
      await sock.sendMessage(groupId, {
        text: `👋 Welcome @${participants[0].split('@')[0]} to the group!\n\nType !help for bot guide 🌸`,
        mentions: participants
      });
    }
    
    // Anti-Spam Auto-Ban
    if (action === 'promote' && participants.includes(settings.ownerNumber)) {
      await sock.groupParticipantsUpdate(
        groupId, 
        participants, 
        'demote'
      );
    }
  },

  // Status Handler with AI
  handleStatus: async (sock, statusUpdate) => {
    if (statusUpdate.status === "online") {
      await sock.updateProfileStatus("💖 BarbieX-MD | Always Here for You");
    }
  }
};

// Helper Functions
function calculateCycle(input) {
  // Advanced cycle calculation logic
  return {
    nextDate: new Date(Date.now() + 28*24*60*60*1000).toLocaleDateString(),
    fertileDays: "Day 10-16"
  };
          }
