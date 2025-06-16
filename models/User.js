import mongoose from 'mongoose';
import { encrypt } from '../lib/safety.js';

// ==================== USER SCHEMA ====================
const UserSchema = new mongoose.Schema({
  // Core Identifiers
  jid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true,
    set: (jid) => jid.endsWith('@s.whatsapp.net') ? jid : `${jid}@s.whatsapp.net`
  },
  phone: {
    type: String,
    set: (phone) => phone.replace(/[^\d]/g, '').slice(-10)
  },

  // Profile Data
  name: { type: String, trim: true },
  pushname: { type: String },
  profilePicture: { type: String },
  status: { type: String, default: 'Hey there! I'm using BarbieX-MD' },

  // Security
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String },
  warningCount: { type: Number, default: 0 },
  lastWarning: { type: Date },

  // Economy
  coins: { type: Number, default: 100, min: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  inventory: [{
    itemId: { type: String },
    count: { type: Number, default: 1 }
  }],

  // Activity Tracking
  lastActive: { type: Date, default: Date.now },
  commandUsage: {
    type: Map,
    of: Number,
    default: {}
  },
  sessions: [{
    device: String,
    ip: String,
    lastLogin: Date
  }],

  // Privacy
  settings: {
    hideLastSeen: { type: Boolean, default: false },
    hideProfile: { type: Boolean, default: false }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== VIRTUAL FIELDS ====================
UserSchema.virtual('rank').get(function() {
  return Math.floor(this.xp / 1000) + 1;
});

UserSchema.virtual('formattedPhone').get(function() {
  return this.phone ? `+${this.phone}` : 'Unknown';
});

// ==================== INDEXES ====================
UserSchema.index({ xp: -1 }); // For leaderboards
UserSchema.index({ 'sessions.ip': 1 }); // For security checks

// ==================== PRE HOOKS ====================
UserSchema.pre('save', function(next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = encrypt(this.phone, process.env.ENCRYPTION_KEY);
  }
  next();
});

// ==================== STATIC METHODS ====================
UserSchema.statics = {
  async findByJid(jid) {
    return this.findOneAndUpdate(
      { jid },
      { $setOnInsert: { jid }, $set: { lastActive: new Date() } },
      { upsert: true, new: true }
    );
  },

  async getTopUsers(limit = 10) {
    return this.find({ isBanned: false })
      .sort({ xp: -1 })
      .limit(limit)
      .select('jid name xp level profilePicture');
  },

  async resetDailyCoins() {
    await this.updateMany(
      { coins: { $lt: 1000 } },
      { $inc: { coins: 50 } }
    );
  }
};

// ==================== INSTANCE METHODS ====================
UserSchema.methods = {
  addCoins(amount) {
    this.coins += amount;
    return this.save();
  },

  addXp(points) {
    this.xp += points;
    // Level up every 1000 XP
    this.level = Math.floor(this.xp / 1000) + 1;
    return this.save();
  },

  logCommand(command) {
    this.commandUsage.set(command, (this.commandUsage.get(command) || 0) + 1);
    return this.save();
  },

  async ban(reason = 'Violation of terms') {
    this.isBanned = true;
    this.banReason = reason;
    await this.save();
    return this;
  }
};

// ==================== MODEL EXPORT ====================
const User = mongoose.model('User', UserSchema);
export default User;
