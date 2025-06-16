import mongoose from 'mongoose';
import { encrypt } from '../lib/safety.js';

const GroupSchema = new mongoose.Schema({
  // Core Identifiers
  jid: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: v => v.endsWith('@g.us'),
      message: props => `${props.value} is not a valid group JID!`
    }
  },
  inviteCode: { type: String, select: false },

  // Group Metadata
  name: { type: String, trim: true },
  description: { type: String, default: '' },
  picture: { type: String },
  creation: { type: Date, default: Date.now },

  // Member Management
  participants: [{
    jid: { type: String, required: true },
    role: { type: String, enum: ['member', 'admin', 'superadmin'], default: 'member' },
    joinDate: { type: Date, default: Date.now },
    addedBy: { type: String }
  }],
  bannedUsers: [{
    jid: String,
    reason: String,
    bannedBy: String,
    bannedAt: { type: Date, default: Date.now }
  }],

  // Group Settings
  settings: {
    antilink: { type: Boolean, default: true },
    nsfw: { type: Boolean, default: false },
    mute: { type: Boolean, default: false },
    botAccess: { type: Boolean, default: true },
    welcome: {
      enabled: { type: Boolean, default: true },
      message: { type: String, default: '🌸 Welcome @user to @group!' }
    },
    goodbye: {
      enabled: { type: Boolean, default: false },
      message: { type: String, default: '🚪 @user left the group' }
    }
  },

  // Statistics
  messageCount: { type: Number, default: 0 },
  commandUsage: {
    type: Map,
    of: Number,
    default: {}
  },
  activeHours: {
    type: Map,
    of: Number,
    default: {}
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==================== INDEXES ====================
GroupSchema.index({ name: 'text', description: 'text' }); // For search
GroupSchema.index({ 'participants.jid': 1 }); // Fast member lookup
GroupSchema.index({ messageCount: -1 }); // For active groups

// ==================== VIRTUAL FIELDS ====================
GroupSchema.virtual('memberCount').get(function() {
  return this.participants.length;
});

GroupSchema.virtual('adminCount').get(function() {
  return this.participants.filter(p => p.role !== 'member').length;
});

// ==================== STATIC METHODS ====================
GroupSchema.statics = {
  async findByJid(jid) {
    return this.findOneAndUpdate(
      { jid },
      { $setOnInsert: { jid }, $set: { updatedAt: new Date() } },
      { upsert: true, new: true }
    );
  },

  async getTopGroups(limit = 10) {
    return this.find()
      .sort({ messageCount: -1 })
      .limit(limit)
      .select('jid name description memberCount');
  },

  async updateParticipant(jid, userJid, update) {
    return this.updateOne(
      { jid, 'participants.jid': userJid },
      { $set: { 'participants.$': update } }
    );
  }
};

// ==================== INSTANCE METHODS ====================
GroupSchema.methods = {
  async addParticipant(jid, role = 'member', addedBy = 'system') {
    if (!this.participants.some(p => p.jid === jid)) {
      this.participants.push({
        jid,
        role,
        addedBy,
        joinDate: new Date()
      });
      await this.save();
    }
    return this;
  },

  async removeParticipant(jid) {
    this.participants = this.participants.filter(p => p.jid !== jid);
    await this.save();
    return this;
  },

  async banUser(jid, reason = 'Violation of rules', bannedBy) {
    const user = this.participants.find(p => p.jid === jid);
    if (user) {
      this.bannedUsers.push({
        jid,
        reason,
        bannedBy,
        bannedAt: new Date()
      });
      this.participants = this.participants.filter(p => p.jid !== jid);
      await this.save();
    }
    return this;
  },

  async logCommand(command) {
    this.commandUsage.set(command, (this.commandUsage.get(command) || 0) + 1);
    this.messageCount += 1;
    await this.save();
  }
};

// ==================== HOOKS ====================
GroupSchema.pre('save', function(next) {
  if (this.isModified('inviteCode') && this.inviteCode) {
    this.inviteCode = encrypt(this.inviteCode, process.env.ENCRYPTION_KEY);
  }
  next();
});

const Group = mongoose.model('Group', GroupSchema);
export default Group;
