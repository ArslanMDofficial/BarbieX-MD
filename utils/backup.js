import fs from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import moment from 'moment';
import chalk from 'chalk';
import logger from '../lib/logger.js';

// ==================== CONFIGURATION ====================
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const ENCRYPTION_KEY = process.env.BACKUP_KEY || 'your-encryption-key-here';
const MAX_LOCAL_BACKUPS = 7;
const S3_CONFIG = {
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY
};

// ==================== BACKUP TYPES ====================
const BACKUP_STRATEGIES = {
  FULL: {
    collections: ['users', 'groups', 'chats'],
    name: 'full',
    priority: 1
  },
  DAILY: {
    collections: ['users', 'groups'],
    name: 'daily',
    priority: 2
  },
  LIGHT: {
    collections: ['users'],
    name: 'light',
    priority: 3
  }
};

// ==================== CORE FUNCTIONS ====================

/**
 * Encrypts backup file with AES-256-GCM
 */
const encryptBackup = async (inputPath, outputPath) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', 
    crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32), 
    iv
  );

  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);
  
  output.write(iv); // Write IV first
  
  await pipeline(
    input,
    createGzip(), // Compress first
    cipher,
    output
  );

  return outputPath + '.enc';
};

/**
 * MongoDB Backup (Dump collections)
 */
const dumpCollections = async (collections, outputPath) => {
  const conn = mongoose.connection;
  const promises = collections.map(async (name) => {
    const data = await conn.db.collection(name).find().toArray();
    return { collection: name, data };
  });

  const results = await Promise.all(promises);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  return outputPath;
};

/**
 * Upload to S3
 */
const uploadToS3 = async (filePath) => {
  if (!S3_CONFIG.bucket) {
    logger.warn('S3 not configured, skipping cloud backup');
    return false;
  }

  const s3 = new S3Client({
    region: S3_CONFIG.region,
    credentials: {
      accessKeyId: S3_CONFIG.accessKey,
      secretAccessKey: S3_CONFIG.secretKey
    }
  });

  const uploadParams = {
    Bucket: S3_CONFIG.bucket,
    Key: `barbiex/backups/${path.basename(filePath)}`,
    Body: fs.createReadStream(filePath),
    ContentType: 'application/octet-stream'
  };

  await s3.send(new PutObjectCommand(uploadParams));
  return true;
};

// ==================== MAIN BACKUP ROUTINE ====================
export const runBackup = async (type = 'DAILY') => {
  try {
    const strategy = BACKUP_STRATEGIES[type] || BACKUP_STRATEGIES.DAILY;
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const fileName = `backup_${strategy.name}_${timestamp}`;
    
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    logger.info(chalk.blue(`Starting ${type} backup...`));

    // Step 1: Dump MongoDB collections
    const jsonPath = path.join(BACKUP_DIR, `${fileName}.json`);
    await dumpCollections(strategy.collections, jsonPath);
    logger.info(chalk.green(`✓ Database dump created (${strategy.collections.length} collections)`));

    // Step 2: Compress and encrypt
    const encryptedPath = await encryptBackup(jsonPath, path.join(BACKUP_DIR, fileName));
    fs.unlinkSync(jsonPath); // Remove raw JSON
    logger.info(chalk.green(`✓ Backup encrypted (AES-256-GCM)`));

    // Step 3: Upload to cloud
    const cloudResult = await uploadToS3(encryptedPath);
    if (cloudResult) {
      logger.info(chalk.green(`✓ Uploaded to S3 bucket: ${S3_CONFIG.bucket}`));
    }

    // Step 4: Cleanup old backups
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.includes(strategy.name))
      .sort()
      .reverse();

    while (files.length > MAX_LOCAL_BACKUPS) {
      const oldFile = files.pop();
      fs.unlinkSync(path.join(BACKUP_DIR, oldFile));
      logger.debug(`Deleted old backup: ${oldFile}`);
    }

    logger.info(chalk.bold.green(`Backup completed successfully!`));
    return { success: true, path: encryptedPath };

  } catch (error) {
    logger.error(chalk.red('Backup failed:'), error);
    return { success: false, error: error.message };
  }
};

// ==================== SCHEDULED BACKUPS ====================
export const scheduleBackups = () => {
  // Daily at midnight
  cron.schedule('0 0 * * *', () => runBackup('DAILY'));

  // Weekly full backup (Sunday 1AM)
  cron.schedule('0 1 * * 0', () => runBackup('FULL'));

  logger.info(chalk.magenta('↻ Scheduled backups activated'));
};

// ==================== RESTORE UTILITIES ====================
export const restoreBackup = async (filePath, decryptionKey) => {
  // Implementation for restore process
  // [Decrypt -> Inflate -> MongoDB Insert]
};
