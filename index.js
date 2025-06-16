require('./settings');
const fs = require('fs');
const chalk = require('chalk');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    useSingleFileAuthState,
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore,
    jidDecode,
    jidNormalizedUser
} = require('@whiskeysockets/baileys');
const NodeCache = require('node-cache');
const PhoneNumber = require('awesome-phonenumber');
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { smsg } = require('./lib/myfunc');

// Load settings
const settings = require('./settings');
const pairingCode = !!settings.phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");

global.botname = settings.botname || "BarbieX-MD";
global.themeemoji = settings.themeemoji || "🌸";

// Session Manager
async function initSession() {
    // Priority 1: Use session_id if specified
    if (settings.session_id) {
        const sessionFile = `./session/${settings.session_id}.json`;
        console.log(chalk.yellow(`Using session_id: ${settings.session_id}`));
        return useSingleFileAuthState(sessionFile);
    }
    // Priority 2: Fallback to creds.json
    else if (fs.existsSync('./session/creds.json')) {
        console.log(chalk.yellow('Using legacy creds.json session'));
        return useMultiFileAuthState('./session');
    }
    // Priority 3: Fresh session
    else {
        console.log(chalk.yellow('Starting with fresh session'));
        return {
            state: { creds: {}, keys: {} },
            saveState: () => {}
        };
    }
}

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveState } = await initSession();
    const msgRetryCounterCache = new NodeCache();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["BarbieX-MD", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => "",
        msgRetryCounterCache
    });

    // Session Save Handler
    sock.ev.on('creds.update', saveState);

    // Message Handler
    sock.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0];
        if (!mek.message) return;
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        if (!sock.public && !mek.key.fromMe && chatUpdate.type === 'notify') return;
        try {
            await handleMessages(sock, chatUpdate, true);
        } catch (err) {
            console.log("Error in handleMessages:", err);
        }
    });

    // Connection Handler
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        console.log('Connection update:', connection);
        
        if (connection === 'open') {
            console.log(chalk.green(`🤖 ${global.botname} Connected Successfully!`));
            await sock.sendMessage(sock.user.id, { 
                text: `*${global.botname} Activated!*\n\n🕒 ${new Date().toLocaleString()}`
            });
        }
        
        if (connection === "close") {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log(chalk.red("Logged out! Please rescan QR"));
            }
        }
    });

    // Group Participants Handler
    sock.ev.on('group-participants.update', handleGroupParticipantUpdate);

    // Status Handler
    sock.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key?.remoteJid === 'status@broadcast') {
            await handleStatus(sock, m);
        }
    });

    sock.public = true;
    sock.serializeM = (m) => smsg(sock, m);
}

// Start Bot with Error Handling
startBot().catch(err => {
    console.error(chalk.red("❌ Bot startup error:"), err);
});

process.on('uncaughtException', err => console.error(chalk.red('❗ Uncaught Exception:'), err));
process.on('unhandledRejection', err => console.error(chalk.red('❗ Unhandled Rejection:'), err));
