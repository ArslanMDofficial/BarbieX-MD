// ============================
// 🛠️ BarbieX-MD Configuration
// ============================
export default {
  // ======================
  // 🔧 BOT BASICS
  // ======================
  SESSION_ID: "default_session", // Unique ID (Change for each bot instance)
  BOT_NAME: "BarbieX-MD", // Display name
  PREFIX: "!", // Command prefix (!help, !menu)
  OWNER_NUMBER: "923123456789", // With country code
  OWNER_NAME: "Arslan", // Owner display name

  // ======================
  // 🔐 AUTHENTICATION
  // ======================
  AUTH_MODE: "QR", // "QR" or "CREDS"
  SESSION_ENCRYPTION_KEY: "your-secret-key-123", // Optional encryption

  // ======================
  // ⚙️ BOT FEATURES
  // ======================
  AUTO_WELCOME: true, // Welcome new group members
  AUTO_GOODBYE: true, // Goodbye message when someone leaves
  ANTI_SPAM: true, // Enable anti-spam
  BLOCK_UNKNOWN: false, // Block non-saved contacts
  MAX_UPLOAD_SIZE: 100, // MB (for media downloads)

  // ======================
  // 📦 MEDIA SETTINGS
  // ======================
  STICKER_PACK_NAME: "BarbieX-MD", // Sticker pack name
  ALLOWED_MEDIA_TYPES: ["image", "video", "audio"], // Supported media

  // ======================
  // 🌐 API INTEGRATIONS
  // ======================
  OPENAI_KEY: "", // ChatGPT API key
  YOUTUBE_KEY: "", // YouTube API key
  TIKTOK_KEY: "", // TikTok API key

  // ======================
  // 💾 DATABASE
  // ======================
  DATABASE: {
    ENABLED: false, // Enable/disable database
    URL: "mongodb://localhost:27017", // MongoDB URL
    NAME: "barbiex_md" // Database name
  },

  // ======================
  // 🖥️ SERVER SETTINGS
  // ======================
  PORT: 3000, // Local server port
  DEPLOY_URL: "https://your-app.railway.app" // Public URL for webhooks
};
