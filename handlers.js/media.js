import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export const broadcast = {
  name: "broadcast",
  desc: "Send message to all groups",
  alias: ["bc"],
  category: "admin",
  usage: `${config.PREFIX}bc <message>`,
  isAdmin: true,
  run: async (sock, msg, args) => {
    if (!args[0]) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Usage: ${this.usage}`
      });
    }

    const groups = await sock.groupFetchAllParticipating();
    const message = args.join(' ');

    for (const group of Object.values(groups)) {
      try {
        await sock.sendMessage(group.id, { text: `📢 *Broadcast*\n\n${message}` });
        await delay(1000); // Prevent rate limiting
      } catch (error) {
        console.error(`Failed to send to ${group.id}: ${error}`);
      }
    }

    await sock.sendMessage(msg.key.remoteJid, {
      text: `✅ Broadcast sent to ${Object.keys(groups).length} groups`
    });
  }
};

export const promote = {
  name: "promote",
  desc: "Promote user to admin",
  usage: `${config.PREFIX}promote @user`,
  isAdmin: true,
  run: async (sock, msg) => {
    if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Please mention a user!"
      });
    }

    const user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    
    try {
      await sock.groupParticipantsUpdate(
        msg.key.remoteJid,
        [user],
        "promote"
      );
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ @${user.split('@')[0]} promoted to admin!`,
        mentions: [user]
      });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to promote: ${error.message}`
      });
    }
  }
};

export const demote = {
  name: "demote",
  desc: "Demote admin to member",
  usage: `${config.PREFIX}demote @user`,
  isAdmin: true,
  run: async (sock, msg) => {
    // Similar implementation to promote but with "demote" action
  }
};

export const ban = {
  name: "ban",
  desc: "Remove user from group",
  usage: `${config.PREFIX}ban @user`,
  isAdmin: true,
  run: async (sock, msg) => {
    if (!msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Please mention a user!"
      });
    }

    const user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    
    try {
      await sock.groupParticipantsUpdate(
        msg.key.remoteJid,
        [user],
        "remove"
      );
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⛔ @${user.split('@')[0]} has been banned!`,
        mentions: [user]
      });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to ban: ${error.message}`
      });
    }
  }
};

export const groupinfo = {
  name: "groupinfo",
  desc: "Show group information",
  usage: `${config.PREFIX}groupinfo`,
  run: async (sock, msg) => {
    const metadata = await sock.groupMetadata(msg.key.remoteJid);
    const participants = metadata.participants.length;
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `📌 *Group Info*\n\n` +
            `🔹 Name: ${metadata.subject}\n` +
            `👥 Members: ${participants}\n` +
            `🆔 ID: ${metadata.id}\n` +
            `👑 Created: ${new Date(metadata.creation * 1000).toLocaleString()}`
    });
  }
};

// Utility function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
    }
