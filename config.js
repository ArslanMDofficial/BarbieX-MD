module.exports = {

  // ==================== CORE SETTINGS ====================
  SESSION_ID: "BARBIEX_SESSION",  // Auto-generates session file
  OWNER_NUMBER: "923123456789",   // With country code
  BOT_NAME: "BarbieX-MD",         // Display name
  THEME_EMOJI: "🌸",              // Bot theme
  
  // ==================== AI FEATURES ====================
  OPENAI_KEY: "sk-your-key-here", // GPT-3.5 Turbo
  AI_CHARACTER: "friendly-girl",  // Personality [friendly-girl, strict, funny]
  AI_TEMPERATURE: 0.7,            // Creativity level (0-1)
  
  // ==================== SAFETY SETTINGS ====================
  ANTI_BAD_WORDS: true,           // Auto-delete profanity
  ANTI_SPAM: true,                // Block flooders
  MAX_GROUP_JOINS: 3,             // Groups user can add bot to
  
  // ==================== AUTOMATION ====================
  AUTO_STATUS_UPDATE: true,       // Changes status periodically
  AUTO_READ_MESSAGES: false,      // Marks messages as read
  AUTO_REPLY: true,               // Replies to mentions
  
  // ==================== MEDIA SETTINGS ====================
  STICKER_PACK: "BarbieX-MD",     // Sticker pack name
  STICKER_AUTHOR: "Your BFF",     // Sticker author
  MAX_VIDEO_SIZE: 50,             // MB
  
  // ==================== WOMEN HEALTH ====================
  PERIOD_TRACKER: {
    ENABLED: true,
    REMINDER_DAYS: [3, 2, 1],     // Days before reminder
    FERTILE_ALERTS: true
  },
  
  // ==================== DATABASE ====================
  MONGODB_URI: "mongodb+srv://user:pass@cluster0.xyz.mongodb.net/BarbieX?retryWrites=true&w=majority",
  
  // ==================== ADVANCED ====================
  CRON_JOBS: {
    BACKUP: "0 3 * * *",          // Daily 3AM backup
    CLEANUP: "0 0 * * *"          // Midnight cleanup
  },
  
  // ==================== CUSTOMIZATION ====================
  LANGUAGES: {
    DEFAULT: "en",
    SUPPORTED: ["en", "ur", "hi"]
  },
  
  // ==================== SECURITY ====================
  ENCRYPTION_KEY: "your-encryption-key-here",
  
  // ==================== HOSTING ====================
  PORT: 5000,
  HOST: "0.0.0.0"
};
