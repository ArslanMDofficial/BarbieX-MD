import mongoose from 'mongoose';
import { NodeCache } from 'node-cache';
import chalk from 'chalk';

// Initialize cache (5min TTL)
const dbCache = new NodeCache({ stdTTL: 300 });

// Database Models
const userSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  name: { type: String, index: true },
  coins: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  banned: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const groupSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  name: { type: String },
  settings: {
    antilink: { type: Boolean, default: true },
    nsfw: { type: Boolean, default: false },
    botAccess: { type: Boolean, default: true }
  },
  admins: [{ type: String }]
});

// Create models
export const User = mongoose.model('User', userSchema);
export const Group = mongoose.model('Group', groupSchema);

// Cache middleware
const cache = (key, ttl = 300) => {
  return async (req, res, next) => {
    const cachedData = dbCache.get(key);
    if (cachedData) return cachedData;
    
    const data = await next();
    dbCache.set(key, data, ttl);
    return data;
  };
};

// Database Connection
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log(chalk.green('✅ MongoDB Connected!'));
    
    // Auto-create indexes
    await User.createIndexes();
    await Group.createIndexes();

  } catch (err) {
    console.error(chalk.red('❌ MongoDB Connection Error:'), err);
    process.exit(1);
  }
};

// CRUD Operations
export const db = {
  // User Operations
  getUser: async (jid) => {
    return cache(`user_${jid}`, 600)(async () => {
      return User.findOneAndUpdate(
        { jid },
        { $setOnInsert: { jid } },
        { upsert: true, new: true }
      );
    });
  },

  updateUser: async (jid, data) => {
    dbCache.del(`user_${jid}`);
    return User.updateOne({ jid }, { $set: data });
  },

  // Group Operations
  getGroup: async (jid) => {
    return cache(`group_${jid}`)(async () => {
      return Group.findOne({ jid }) || new Group({ jid }).save();
    });
  },

  // Economy System
  addCoins: async (jid, amount) => {
    return User.updateOne(
      { jid },
      { $inc: { coins: amount } }
    );
  }
};

// Auto-reconnect
mongoose.connection.on('disconnected', () => {
  console.log(chalk.yellow('⚠️ MongoDB Disconnected! Trying to reconnect...'));
  setTimeout(connectDB, 5000);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
