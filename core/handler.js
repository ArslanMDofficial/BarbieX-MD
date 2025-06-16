import { commandMap, loadCommands } from './commands/index.js';
import { Filter } from 'bad-words';
import mongoose from 'mongoose';
import User from './models/user.js';

const filter = new Filter({ placeHolder: '🌸' });

// Initialize Command System
await loadCommands();

export const handleMessages = async (sock, msg) => {
  try {
    // Ignore non-messages/broadcasts
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

    // Message Processing
    const m = smsg(sock, msg);
    const text = (m.text || '').trim();
    const isCmd = text.startsWith('!');
    
    // Database User Sync
    const user = await User.findOneAndUpdate(
      { jid: m.sender },
      { $set: { lastActive: new Date() } },
      { upsert: true, new: true }
    );

    // Safety Checks
    if (filter.isProfane(text)) {
      await sock.sendMessage(m.chat, {
        text: `⚠️ ${user.name}, mind your language!`,
        mentions: [m.sender]
      });
      return;
    }

    // Command Handling
    if (isCmd) {
      const [cmd, ...args] = text.slice(1).split(' ');
      const command = commandMap.get(cmd.toLowerCase());

      if (command) {
        // Cooldown Check
        if (user.cooldowns?.get(command.name) > Date.now()) {
          const remaining = Math.ceil(
            (user.cooldowns.get(command.name) - Date.now()) / 1000
          );
          return sock.sendMessage(m.chat, {
            text: `⏳ Please wait ${remaining}s before using !${command.name} again`
          });
        }

        // Execute Command
        await command.execute(sock, m, args);

        // Set Cooldown (default 3s)
        const cooldown = (command.cooldown || 3) * 1000;
        user.cooldowns.set(command.name, Date.now() + cooldown);
        await user.save();
      }
    }

    // AI Auto-Reply (for non-commands)
    else if (m.mentionedJid?.includes(sock.user.id)) {
      const aiResponse = await generateAIResponse(text);
      await sock.sendMessage(m.chat, { text: aiResponse });
    }

  } catch (error) {
    console.error('Handler Error:', error);
    // Error Reporting to Owner
    await sock.sendMessage(
      config.OWNER_NUMBER, 
      { text: `❌ Handler Crash:\n${error.stack}` }
    );
  }
};

// Group Event Handler
export const handleGroupUpdate = async (sock, update) => {
  const { action, participants, id } = update;
  
  // Welcome New Members
  if (action === 'add') {
    const welcomeMsg = await generateWelcomeMessage(participants);
    await sock.sendMessage(id, welcomeMsg);
  }
  
  // Detect Admin Abuse
  if (action === 'promote' && !participants.includes(config.OWNER_NUMBER)) {
    await sock.groupParticipantsUpdate(
      id, 
      participants, 
      'demote'
    );
  }
};

// Helper Functions
async function generateAIResponse(prompt) {
  // Your AI integration logic
  return "This is a smart reply from AI!";
}

async function generateWelcomeMessage(users) {
  // Dynamic welcome message
  return {
    text: `🌸 Welcome ${users.map(u => `@${u.split('@')[0]}`).join(', ')}!\n\nType !menu for bot guide`,
    mentions: users
  };
}
