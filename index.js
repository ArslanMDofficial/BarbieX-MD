require('./settings')
const fs = require('fs')
const chalk = require('chalk')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidDecode, jidNormalizedUser, delay } = require('@whiskeysockets/baileys')
const NodeCache = require('node-cache')
const readline = require('readline')
const PhoneNumber = require('awesome-phonenumber')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const { smsg } = require('./lib/myfunc')

let phoneNumber = "923237045919"
let owner = ["923237045919"]

global.botname = "Arslan-MD"
global.themeemoji = "•"

const settings = require('./settings')
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Modified session handling - uses single file instead of multi-file
const { state, saveState } = useSingleFileAuthState('./session/auth_info.json')

async function startBot() {
    let { version } = await fetchLatestBaileysVersion()
    const msgRetryCounterCache = new NodeCache()

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => "",
        msgRetryCounterCache
    })

    // Auto-save session when credentials update
    sock.ev.on('creds.update', saveState)

    // Rest of your existing event handlers remain the same...
    sock.ev.on('messages.upsert', async chatUpdate => {
        // ... (keep existing message handler code)
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'open') {
            console.log(chalk.green(`🤖 Bot Connected Successfully as ${sock.user.id}`))
            // ... (rest of your connection handler)
        }
        // ... (rest of your connection update logic)
    })

    // ... (keep all other existing event handlers)

    sock.public = true
    sock.serializeM = (m) => smsg(sock, m)
    // ... (rest of your helper functions)
}

startBot().catch(err => {
    console.error("❌ Fatal Error:", err)
})

process.on('uncaughtException', err => console.error('❗ Uncaught Exception:', err))
process.on('unhandledRejection', err => console.error('❗ Unhandled Rejection:', err))
