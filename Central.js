process.on("uncaughtException", console.error);
require("./Configuration.js");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const axios = require('axios');
const mathjs = require('mathjs')
const { exec } = require("child_process");
const moment = require("moment-timezone");

const { EmojiAPI } = require("emoji-api");
const { addBalance } = require("./lib/limit.js");
const { smsg, formatp, tanggal, GIFBufferToVideoBuffer, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom } = require('./lib/myfunc')
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const _ = require("lodash");
const yargs = require("yargs/yargs");
var low;
try {
  low = require("lowdb");
} catch (e) {
  low = require("./lib/lowdb");
}

const { Low, JSONFile } = low;
const mongoDB = require("./lib/mongoDB");
const textpro2 = require('./src/textpro2')
global.opts = new Object(
  yargs(process.argv.slice(2)).exitProcess(false).parse()
);
global.db = new Low(
  /https?:\/\//.test(opts["db"] || "")
    ? new cloudDBAdapter(opts["db"])
    : /mongodb/.test(opts["db"])
      ? new mongoDB(opts["db"])
      : new JSONFile(`src/database.json`)
);
global.DATABASE = global.db; // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(function() {
        !global.db.READ
          ? (clearInterval(this),
            resolve(
              global.db.data == null ? global.loadDatabase() : global.db.data
            ))
          : null;
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read();
  global.db.READ = false;
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
};
loadDatabase();
global.db = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db)
  global.db = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    ...(global.db || {}),
  };

let banUser = JSON.parse(fs.readFileSync('./database/banUser.json'));
let banchat = JSON.parse(fs.readFileSync('./database/banChat.json'));


let _limit = JSON.parse(fs.readFileSync('./storage/user/limit.json'));
let _buruan = JSON.parse(fs.readFileSync('./storage/user/bounty.json'));
let _darahOrg = JSON.parse(fs.readFileSync('./storage/user/blood.json'))
let ntilinkfb =JSON.parse(fs.readFileSync('./database/antilink2.json'))
let ntilinkall =JSON.parse(fs.readFileSync('./database/antilinkall.json'))
let pendaftar = JSON.parse(fs.readFileSync('./storage/user/user.json'))
let balance = JSON.parse(fs.readFileSync('./database/balance.json'))
let ssewa = JSON.parse(fs.readFileSync('./database/sewa.json'))
let ban = JSON.parse(fs.readFileSync('./database/ban.json'))
let autosticker = JSON.parse(fs.readFileSync('./database/autosticker.json'))
const _autostick = JSON.parse(fs.readFileSync('./database/autostickpc.json'))
let _leveling = JSON.parse(fs.readFileSync('./database/leveling.json'))
let _level = JSON.parse(fs.readFileSync('./database/level.json'))
let limit = JSON.parse(fs.readFileSync('./database/limit.json'))
let setik = JSON.parse(fs.readFileSync('./src/sticker.json'))
let vien = JSON.parse(fs.readFileSync('./src/audio.json'))
let imagi = JSON.parse(fs.readFileSync('./src/image.json'))
let videox = JSON.parse(fs.readFileSync('./src/video.json'))
global.db = JSON.parse(fs.readFileSync('./src/database.json'))
let _sewa = require("./lib/sewa");
const { M } = require("human-readable");
const sewa = JSON.parse(fs.readFileSync('./database/sewa.json'))


const time = moment.tz('Asia/Kolkata').format('DD/MM HH:mm:ss')
const ucap = moment(Date.now()).tz('Asia/Kolkata').locale('id').format('a')
var buln = ['/01/', '/02/', '/03/', '/04/', '/05/', '/06/', '/07/', '/08/', '/09/', '/10/', '/11/', '/12/'];
var myHari = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var tgel = new Date();
var hri = tgel.getDate();
var bulnh = tgel.getMonth();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();
var syear = (yye < 1000) ? yye + 1900 : yye;
const jangwak = (hri + '' + buln[bulnh] + '' + syear)
const janghar = (thisDaye)
var myHari = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var tgel = new Date();
var thisHari = tgel.getDay(),
  thisDaye = myHari[thisHari];
var yye = tgel.getYear();

module.exports = Maria = async (Maria, m, chatUpdate, store) => {
  try {
    var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
    var budy = (typeof m.text == 'string' ? m.text : '')
    
    const prefix = global.prefa
    const thumb = global.thum
    const ownername = global.OwnerName
    const botname = global.botname
    const ayushsupport= global.support
    const wheat = global.wheather
    const packname = global.packname
    const mariapic = global.thum
    const isCmd = body.startsWith(prefix)
    const notCmd = body.startsWith('')
    const command = isCmd ? body.slice(1).trim().split(' ')[0].toLowerCase() : ''
    const args = body.trim().split(/ +/).slice(1)
    const pushname = m.pushName || "No Name"
    const botNumber = await Maria.decodeJid(Maria.user.id)
    const isCreator = [botNumber, ...global.Owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const itsMe = m.sender == botNumber ? true : false
    const text = args.join(" ")
    const from = m.chat
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)
    const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase()
    const groupMetadata = m.isGroup ? await Maria.groupMetadata(m.chat).catch(e => { }) : ''
    const groupName = m.isGroup ? groupMetadata.subject : ''
    const participants = m.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
    const groupOwner = m.isGroup ? groupMetadata.owner : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isUser = pendaftar.includes(m.sender)
    const isBan = banUser.includes(m.sender)
    const isBanChat = m.isGroup ? banchat.includes(from) : false
    const isRakyat = isCreator || global.rkyt.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || false
    const AntiLink = m.isGroup ? ntilink.includes(from) : false
    const AntiLinkYoutubeVid = m.isGroup ? ntilinkytvid.includes(from) : false
    const AntiLinkYoutubeChannel = m.isGroup ? ntilinkytch.includes(from) : false
    const AntiLinkInstagram = m.isGroup ? ntilinkig.includes(from) : false
    const AntiLinkFacebook = m.isGroup ? ntilinkfb.includes(from) : false
    const AntiLinkTiktok = m.isGroup ? ntilinktt.includes(from) : false
    const AntiLinkTelegram = m.isGroup ? ntilinktg.includes(from) : false
    const AntiLinkTwitter = m.isGroup ? ntilinktwt.includes(from) : false
    const AntiLinkAll = m.isGroup ? ntilinkall.includes(from) : false
    const antiWame = m.isGroup ? ntwame.includes(from) : false
    const antiVirtex = m.isGroup ? ntvirtex.includes(from) : false
    const AntiNsfw = m.isGroup ? ntnsfw.includes(from) : false
    const isLeveling = m.isGroup ? _leveling.includes(from) : false
    autoreadsw = true
    const content = JSON.stringify(m.message)
    const q = args.join(' ')

    const isQuotedVideo = m.mtype === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio = m.mtype === 'extendedTextMessage' && content.includes('audioMessage')
  

    autoreadsw = true;
    _sewa.expiredCheck(Maria, sewa);

    const reply = (teks) => {
            Maria.sendMessage(m.chat, { text: teks},{ quoted: m})
        }
        
        const replay = (teks) => {
            Maria.sendMessage(m.chat, { text: teks}, { quoted: m})
        }


    /* const replay = (teks) => {
      Maria.sendMessage(m.chat, { text: teks }, { quoted: m }); 
    }; */
    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid
    const senderNumber = sender.split('@')[0]

    function randomNomor(angka) {
      return Math.floor(Math.random() * angka) + 1;
    }

    if (m.message) {
      addBalance(m.sender, randomNomor(574), balance);
      console.log(
        chalk.black(chalk.bgWhite("[ MESSAGE ]")),
        chalk.black(chalk.bgGreen(new Date())),
        chalk.black(chalk.bgBlue(budy || m.mtype)) +
        "\n" +
        chalk.magenta("=> From"),
        chalk.green(pushname),
        chalk.yellow(m.sender) + "\n" + chalk.blueBright("=> In"),
        chalk.green(m.isGroup ? pushname : "Private Chat", m.chat)
      );
    }

    if (isCmd && !isUser) {
      pendaftar.push(m.sender);
      fs.writeFileSync("./storage/user/user.json", JSON.stringify(pendaftar));
    }

    if (global.autoreadpmngc) {
      if (command) {
        await Maria.sendPresenceUpdate("composing", m.chat);
        Maria.sendReadReceipt(from, m.sender, [m.key.id]);
      }
    }
    /*
  if (global.autoReadGc) {
  if (m.isGroup) { Maria.sendReadReceipt(m.chat, m.sender, [m.key.id]) }
}
*/

    if (global.autoReadAll) {
      if (m.chat) {
        Maria.sendReadReceipt(m.chat, m.sender, [m.key.id]);
      }
    }

    if (global.autoRecord) {
      if (m.chat) {
        Maria.sendPresenceUpdate("recording", m.chat);
      }
    }

    if (global.autoTyping) {
      if (m.chat) {
        Maria.sendPresenceUpdate("composing", m.chat);
      }
    }

    if (global.available) {
      if (m.chat) {
        Maria.sendPresenceUpdate("available", m.chat);
      }
    }

    const hariRaya = new Date("6 1, 2022 00:00:00");
    const sekarang = new Date().getTime();
    const Selisih = hariRaya - sekarang;
    const jhari = Math.floor(Selisih / (1000 * 60 * 60 * 24));
    const jjam = Math.floor(
      (Selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const mmmenit = Math.floor((Selisih % (1000 * 60 * 60)) / (1000 * 60));
    const ddetik = Math.floor((Selisih % (1000 * 60)) / 1000);
    const ultah = `${jhari}Day ${jjam}Hour ${mmmenit}Minute ${ddetik}Second`;

    async function hitungmundur(bulan, tanggal) {
      let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
      let now = Date.now();
      let distance = from - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return (
        days +
        "Day " +
        hours +
        "Hour " +
        minutes +
        "Minute " +
        seconds +
        "Second"
      );
    }
/*------ Not allowing  212 and 210 country codes to use bot in DM ---------- */

  const messSenderMain = m.sender;
  const messForm = m.chat;
  if ( !m.isGroup ){
    if (messForm.startsWith("212") || messForm.startsWith("210") ){
      return;
    }
  }
       

      
 if (AntiLinkFacebook)
      var rondonxk = '[-a-zA-Z0-9@:%._+~#=].[-a-zA-Z0-9@:%._+~#=].[-a-zA-Z0-9()@:%_+.~#?&/=]'
      if (budy.includes("https://")) {
        if (!isBotAdmins) return
        bvl = `\`\`\`「𝙇𝙞𝙣𝙠 𝙙𝙚𝙩𝙚𝙘𝙩𝙚𝙙   」\`\`\`\n\nLink sent by Admin so no action will be taken!`
        if (isAdmins) return reply(bvl)
        if (m.key.fromMe) return reply(bvl)
        if (isCreator) return reply(bvl)
        kice = m.sender
        await Maria.sendMessage(
          from,
          {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: m.id,
              participant: m.sender,
            },
          },
          {
            quoted: m,
          }
        );
      //  await Maria.groupParticipantsUpdate(m.chat, [kice], 'remove')
        Maria.sendMessage(from, { text: `\`\`\`「  𝙇𝙞𝙣𝙠 𝙙𝙚𝙩𝙚𝙘𝙩𝙚𝙙    」\`\`\`\n\n*⚠️ Group link detected !*\n\n*🚫@${kice.split("@")[0]} You are not allowed to send any links in this group !*\n`, contextInfo: { mentionedJid: [kice] } }, { quoted: m })
      } else {
      }

      if (command) {
      Maria.sendMessage(from, { react: { text: "🚀" , key: m.key }})
      }
      if (!m.isGroup) return replay(mess.pm)
      
      ///chat menu

const pickRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
  }

	
let smallinput = budy.toLowerCase()

if (smallinput.includes(`afternoon`)) {

                  reply(`gud afternoon ${pushname}, 😚 how is the day goin?`)

                  }



		if (smallinput.includes(`Wow`)) {

                  reply(`😍😍`)

                  }
                  
                  
                  if (smallinput.includes(`wow`)) {

                  reply(`😍😍`)

                  }
                  
                  
                  if (smallinput.includes(`morning`)) {

                  reply(`good morning ${pushname}', have a nice day 😁😘`)

                  }

        if (smallinput.includes(`Night`)) {

                  reply(`good night 😽😽${pushname}', sweetdreams💜💜`)

                  }

                          if (smallinput.includes(`Lol`)) {

                  reply(`😹😹👈`)

                  }                
                  
                                                              if (smallinput.includes(`Intro ?`)) {

                  reply(`i am BarbieX-MD, a whatsapp bot created by Ayush, maybe am not the one whom u asked but i just want u to knw that i am a bot, type #menu to see all available features😊`)

                  }

       if (smallinput.includes(`Maria`)) {

         reply(`Hello frnd mai BarbieX-MD hun😁.\ntype😊👉${prefix}menu`)

                  }     

       if (smallinput.includes(`Maria`)) {

         reply(`Hello frnd mai BarbieX-MD hun😁.\ntype😊👉${prefix}menu`)

                  }     

       if (smallinput.includes(`Bot`)) {

         reply(`Hello frnd mai BarbieX-MD hun😁.\ntype😊👉${prefix}menu`)

                  }     

       if (smallinput.includes(`bot`)) {

         reply(`Hello frnd mai BarbieX-MD hun😁.\ntype😊👉${prefix}menu`)

                  }     

       if (smallinput.includes(`@919931122319`)) {

                  reply(`what happen, any problem?🤗`)

                  }
                 
       if (smallinput.includes(`@919931122319`)) {

                  reply(`sorry mate, Ayush is busy`)

                  }


       if (smallinput.includes(`Hi`)) {

                  reply(`annyeonghaseyo,😊 how are you?`)

                  }

       if (smallinput.includes(`Morning`)) {

                  reply(`good morning ${pushname}', have a nice day 😁😘`)

                  }
 
        if (smallinput.includes(`night`)) {



                  reply(`good night 😽😽${pushname}', sweetdreams💜💜`)

                  }

		if (smallinput.includes(`Bye`)) {

                  reply(`bye my frnd take care 💜😽`)

                  }



		if (smallinput.includes(`bye `)) {

                  reply(`bye my frnd, take care 😽😽`)

                  }



		if (smallinput.includes(`koi hai ?`)) {

                  reply(`ha mai hun na😹😹`)

                  }



                  

		if (smallinput.includes(`Hello`)) {

                  reply(`ohayo🖐️🖐️ ${pushname}`)

  
  
                }

		if (smallinput.includes(`Thanks`)) {

                  reply(`welcome😽😽 ${pushname}`)

                  }
                  
                  if (smallinput.includes(`thanks`)) {

                  reply(`no problem😽😽 ${pushname}`)

                  }
                  
                  
                  if (smallinput.includes(`hey`)) {

                  reply(`wassup🖐️  ${pushname}`)

                  }
                  
                  
                  if (smallinput.includes(`thnx`)) {

                  reply(`you are welcome💜${pushname}`)

                  }


if (smallinput.includes(`Thnx`)) {

                  reply(`you are welcome😽💜 ${pushname}`)

                  }
                  
                  if (smallinput.includes(`hello`)) {

                  reply(`ohayo🖐️ ${pushname}`)

                  }


if (smallinput.includes(`thank you`)) {

                  reply(`you are welcome😊😊 ${pushname}`)

                  }

		if (smallinput.includes(`Thank you`)) {

                  reply(`u r welcome my frnd😽😽 ${pushname}`)

                  }





///////////////////////////////////////////////////
    switch (command) {
    	////////////////////////////////////////////////////
      //chat bot 
      
      case 'chatgpt': case 'gpt':{
              if (isBan) return reply(mess.banned);
              if (isBanChat) return reply(mess.bangc);
            
              if (!q) return reply(`Please provide a text query. Example: ${prefix + command} Hello, ChatGPT!`);
            
              const apiUrl1 = `https://vihangayt.me/tools/chatgpt?q=${encodeURIComponent(q)}`;
              const apiUrl2 = `https://gurugpt.cyclic.app/gpt4?prompt=${encodeURIComponent(q)}&model=llama`;
            
              try {
                
                const response1 = await fetch(apiUrl1);
                const responseData1 = await response1.json();
            
                if (response1.status === 200 && responseData1 && responseData1.status === true && responseData1.data) {
                  
                  const message = responseData1.data;
                  const me = m.sender;
                  await Maria.sendMessage(m.chat, { text: message, mentions: [me] }, { quoted: m });
                } else {
                  
                  const response2 = await fetch(apiUrl2);
                  const responseData2 = await response2.json();
            
                  if (response2.status === 200 && responseData2 && responseData2.data) {
                    
                    const message = responseData2.data;
                    const me = m.sender;
                    await Maria.sendMessage(m.chat, { text: message, mentions: [me] }, { quoted: m });
                  } else {
                    reply("Sorry, I couldn't fetch a response from both APIs at the moment.");
                  }
                }
              } catch (error) {
                console.error(error);
                reply("An error occurred while fetching the response from both APIs.");
              }
            }
              break;
              case 'dalle': case 'imgai': {
                if (isBan) return reply(mess.banned);
                if (isBanChat) return reply(mess.bangc);
              
                if (!q) return reply(`Please provide a query to generate an image. Example: ${prefix + command} Beautiful landscape`);
              
                const apiUrl = `https://gurugpt.cyclic.app/dalle?prompt=${encodeURIComponent(q)}&model=art`;
                //api source has ratelimit so may generate invalid results sometimes
                try {
                  
                  const response = await fetch(apiUrl);
              
                  if (response.status === 200) {
                    
                    const imageUrls = await response.json();
                  
                    
                    const randomImageUrl = imageUrls.result[Math.floor(Math.random() * imageUrls.result.length)];
                 
                    await Maria.sendMessage(m.chat, { image: { url: randomImageUrl } }, { quoted: m });
                  } else {
                    reply("Sorry, I couldn't generate an image at the moment.");
                  }
                } catch (error) {
                  console.error(error);
                  reply("An error occurred while generating the image.");
                }
              }
                break; 
            
              case 'chat':
 
    const axios = require("axios");

    botreply = await axios.get(
      `http://api.brainshop.ai/get?bid=166928&key=Qt1zg4HF0XswLxAu&uid=[uid]&msg=[${text}]`
    );

    txtChatbot = `${botreply.data.cnt}`;
    m.reply(txtChatbot);
  
  break;
    	
    
    ///script
    

////////////////////////////////////////////////////
      //General commands
      



      case "Maria": case "Maria-Md":
            
      const mariain= `⚡ *Maria-Md* ⚡\n\n🍀 *Description: A WhatsApp Bot With Rich NSFW features based on Chiku-MD.*\n\n🌐 *OFFICIAL Website: https://ayush-botz.vercel.app/* \n\n 📒 *Guide: https://github.com/AYUSH-PANDEY023/Guide* \n\n 👾 *BOT URL:https://github.com/AYUSH-PANDEY023/Maria-Md* \n`
      Maria.sendMessage(from, { video: { url: 'https://media.tenor.com/videos/80f557139bc3a0857f6a705da6990fdc/mp4' }, gifPlayback: true, caption: mariain }, { quoted: m })

        break
      
      case "rules":
      
        const helptxt = `_*📍[Rules for Maria Md usage]📍*_\n\n\n*>>>* use -support to get the Official group link in your dm.\n\n*--->* If you want to add Maria-Md in your group the contact the owner by *-owner/-mods* \n\n*--->* Dont use wrong command, use the command given in the *-help* list \n\n* Dont spam the bot with commands if Maria-Md is not responding, its means the maybe owner is offline or facing internet issue. \n\n* Dont Dm the bot \n\n*IF YOU DONT FOLLOW THE RULES THEN YOU WILL BE BANNED* 🚫 \n\n\n*©️ Ayush Bots inc* `

        Maria.sendMessage(from, { video: { url: 'https://c.tenor.com/geMdtLCXZkAAAAPo/rules.mp4' }, gifPlayback: true, caption: helptxt }, { quoted: m })

        break
      case 'hii': case 'hi': case 'Hi':
       
        
        let txxt = `👋🏻 Hi *${pushname}*, i am  *Maria-Md*📍\nA whatsapp bot created by: Ayush and based on Chiku-MD bot\n\n I don't have time for chit-chat Darling. Use command from *${prefix}help* list if you want me to do anything.`

        Maria.sendMessage(m.chat, { video: { url: `https://c.tenor.com/4TLYvKWI2mgAAAPo/nakano-yotsuba-smile.mp4` }, caption: txxt, gifPlayback: true }, { quoted: m });
        break
      case "support":
      
        let tex = `📍My Developer's Group📍\n\n*🎇 𝐌𝐚𝐫𝐢𝐚 support group:🎇* *https://chat.whatsapp.com/FoS7pSPtfMqBuoireK4aAJ*`

        await Maria.sendMessage(m.sender, { text: `${tex}` },);

        await Maria.sendMessage(m.chat, { video: { url: `https://i.makeagif.com/media/3-25-2023/NO05ia.mp4` }, caption: 'I sent you the support Link in personal message.\n Pls check.', gifPlayback: true }, { quoted: m });
        break

      case "info":
            
      let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
        let ifx = `🌟『𝕄𝕒𝕣𝕚𝕒-𝕄𝕕 』🌟
*🌟Description:* A WhatsApp Bot With Rich  features based on Maria
*🚦Uptime:* ${runtime(process.uptime())}
*🕸Version:* 1.0.0
*🔖listgc:* ${anu.length}
*👤Owner:*  ${global.Owner}
*🎐supportgc:* ${global.support}\n
*Powered by Ayush*`
Maria.sendMessage(m.chat, { video: { url: `https://media.tenor.com/VmwZnGeD0oEAAAPo/maria-naruse-shinmai-maou-no-testament.mp4` }, caption: ifx, gifPlayback: true }, { quoted: m });
        break
case 'listgc': {
      
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
 let teks = ` 「  Maria 's group user list  」\n\nTotal ${anu.length} users are using bot in Groups.`
 for (let i of anu) {
  let metadata = await Maria .groupMetadata(i)
  if (metadata.owner === "undefined") {
  loldd = false
  } else {
  loldd = metadata.owner
  }
  teks += `\n\nName : ${metadata.subject ? metadata.subject : "undefined"}\nOwner : ${loldd ? '@' + loldd.split("@")[0] : "undefined"}\nID : ${metadata.id ? metadata.id : "undefined"}\nMade : ${metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') : "undefined"}\nMember : ${metadata.participants.length ? metadata.participants.length : "undefined"}`
 }
 Maria .sendTextWithMentions(m.chat, teks, m)
 }
 break
 
      case 'owner': case 'creator': case 'mod': case 'mods': {
      
        Maria.sendContact(m.chat, global.Owner, m)
      }

        break
        
        case 'dev': case 'devs': case 'developes': case 'developers': {
        
    let ayush = `919931122319@s.whatsapp.net`;
    let ayush2 = `@${ayush.split("@")[0]}`;
    let ayush3 = `@919931122319`;
    let ayushtxt = ayush2 + ' My Dev Ayush Pandey';
    
    let FantoX = `918101187835@s.whatsapp.net`;
    let Fantox = `@${FantoX.split("@")[0]}`;
    let fantox = Fantox + ' My Dev FantoX';
    
    
    Maria.sendMessage(m.chat, {text: ayushtxt, mentions: [ayush], }, { quoted: m } );
    await sleep(1000);
    Maria.sendMessage(m.chat, {text: fantox, mentions: [FantoX], }, { quoted: m } );
    
      }

        break
      
      
//script 
case "sc": case "script": case"repo": {
const axios = require("axios");
let repoInfo = await axios.get("https://api.github.com/repos/AYUSH-PANDEY023/Maria-MD");
        let repo = repoInfo.data;
        console.log(repo);

   const scritxt = `*🚀𝑴𝒂𝒓𝒊𝒂-𝑩𝒐𝒕-𝑺𝒄𝒓𝒊𝒑𝒕🚀*\n
  *🌟Creator:* 𝑨𝒚𝒖𝒔𝒉 𝒑𝒂𝒏𝒅𝒆𝒚\n
  *🌟 Repo:* ${repo.html_url}\n
  *🌟 Total Forks:* ${repo.forks_count}\n
  *⭐ Total Stars:* ${repo.stargazers_count}\n
  *📁 Repo Size:* ${(repo.size/1024).toFixed(2)} MB\n
  *📅 Last Updated:* ${repo.updated_at}\n
  *🌟 Scan:* https://replit.com/@theofficialbhar/AYUSH-PAIRING
  *🌟 Tutorial:* https://youtu.be/wqc0LtA0abo?si=y0rMcmk11km63bZk

©️ *Ayush Bots inc* 
*❝ Dont forget to give a Star ⭐ to the repo.*`

        Maria.sendMessage(from, { video: { url: 'https://media.tenor.com/Zco-fadJri4AAAPo/code-matrix.mp4' }, gifPlayback: true, caption: scritxt }, { quoted: m })
}
        break;
        
 ///////////////////////////////////////////////////
 //Group menu
 case 'antilink': case 'antilinkmid': {
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
if (args[0] === "on") {
if (AntiLinkFacebook) return reply('𝘼𝙡𝙧𝙚𝙖𝙙𝙮 𝙖𝙘𝙩𝙞𝙫𝙖𝙩𝙚𝙙')
ntilinkfb.push(from)
fs.writeFileSync('./database/antilink2.json', JSON.stringify(ntilinkfb))
reply('𝐒𝐮𝐜𝐜𝐞𝐬𝐬 𝐢𝐧 𝐭𝐮𝐫𝐧𝐢𝐧𝐠 𝐨𝐧  𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤2 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐠𝐫𝐨𝐮𝐩')
var groupe = await Maria.groupMetadata(from)
var members = groupe['participants']
var mems = []
members.map(async adm => {
mems.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
Maria.sendMessage(from, {text: `\`\`\`「 ⚠️𝗪𝗮𝗿𝗻𝗶𝗻𝗴⚠️ 」\`\`\`\n\n𝑰𝒇 𝒚𝒐𝒖'𝒓𝒆 𝒏𝒐𝒕 𝒂𝒏 𝒂𝒅𝒎𝒊𝒏, 𝒅𝒐𝒏'𝒕 𝒔𝒆𝒏𝒅 𝒕𝒉𝒆 𝒍𝒊𝒏𝒌 𝒊𝒏 𝒕𝒉𝒊𝒔 𝒈𝒓𝒐𝒖𝒑 𝒐𝒓 𝒘𝒆 𝒘𝒊𝒍𝒍 𝒃𝒆 𝒅𝒆𝒍𝒆𝒕𝒆 𝒊𝒕   𝒊𝒎𝒎𝒆𝒅𝒊𝒂𝒕𝒆𝒍𝒚!`, contextInfo: { mentionedJid : mems }}, {quoted:m})
} else if (args[0] === "off") {
if (!AntiLinkFacebook) return reply('𝘼𝙡𝙧𝙚𝙖𝙙𝙮 𝙙𝙚𝙖𝙘𝙩𝙞𝙫𝙖𝙩𝙚𝙙')
let off = ntilinkfb.indexOf(from)
ntilinkfb.splice(off, 1)
fs.writeFileSync('./database/antilink2.json', JSON.stringify(ntilinkfb))
reply('𝚂𝚞𝚌𝚌𝚎𝚜𝚜 𝚒𝚗 𝚝𝚞𝚛𝚗𝚒𝚗𝚐 𝚘𝚏𝚏 𝚊𝚗𝚝𝚒𝚕𝚒𝚗𝚔2 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙')
} else {
  await reply(`Please Type The Option\n\nExample: ${prefix + command} on\nExample: ${prefix + command} off\n\non to enable\noff to disable`)
  }
  }
  break
  
      
          
   
case 'remove': {
      
        if (!m.isGroup) return replay(mess.grouponly)
        if (!isBotAdmins) return replay(mess.botadmin)
        if (!isAdmins && !isCreator) return replay(mess.useradmin)
        let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await Maria.groupParticipantsUpdate(m.chat, [users], 'remove')
      }
        break
        
      
        
        case 'resetlinkgc':
    case 'resetlinkgroup':
    case 'resetlinkgrup':
    case 'revoke':
    case 'resetlink':
    case 'resetgrouplink':
    case 'resetgclink':
    case 'resetgruplink': {
          
       if (isBan) return reply(mess.banned)	 			
    if (isBanChat) return reply(mess.bangc)
    if (!m.isGroup) return replay(mess.grouponly)
    if (!isBotAdmins) return replay(mess.botadmin)
    if (!isAdmins && !isCreator) return replay(mess.useradmin)
    Maria.groupRevokeInvite(m.chat)
    }
    break
    
    case "gclink":
      case "grouplink":
        {
              
          if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
          let response = await Maria.groupInviteCode(m.chat);
          Maria.sendText(
            m.sender,
            `https://chat.whatsapp.com/${response}\n\nGroup Link📍: ${groupMetadata.subject}`,
            m,
            { detectLink: true }
          );
        }
        await Maria.sendMessage(m.chat, { video: { url: `https://media.tenor.com/hzWYhzhMTeEAAAPo/maria-useless.mp4` }, caption: 'I sent you the Group Link in personal message.\n Pls check.', gifPlayback: true }, { quoted: m });
        break
        
case 'listonline': case 'here':{
      
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
if (!isCreator) return replay(mess.botowner);
	
 let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
 let online = [...Object.keys(store.presences[id]), botNumber]
 let liston = 1
 Maria.sendText(m.chat, '  「 *Now Online Members* 」\n\n' + online.map(v => `${liston++} . @` + v.replace(/@.+/, '')).join`\n`, m, { mentions: online })
 }
 break
 
 case 'tag': case 'tagall': case 'all':{
      
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 let teks = `🧩𝗧𝗮𝗴𝗮𝗹𝗹🧩
  
 *Message : ${args.join(" ") ? args.join(" ") : 'no message'}*\n\n`
 for (let mem of participants) {
 teks += `🍭 @${mem.id.split('@')[0]}\n`
 }
 Maria.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
 }
 break
 case'admin': case 'tagadmin':{
       
    if (isBan) return reply(mess.banned)
    if (!isAdmins && !isCreator) return replay(mess.useradmin)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!text) return replay(`*Please quote or write a meaningful message to tag admins to*`)
 let teks = `*🧩𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻𝘀🧩*
  
 *Message : ${text}*\n\n`
 for (let mem of groupAdmins) {
 teks += `🤴 @${mem.split('@')[0]}\n`
 }
 Maria.sendMessage(m.chat, { text: teks, mentions: groupAdmins}, { quoted: m })
 }
 break
 
case 'hidetag': {
      
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 Maria.sendMessage(m.chat, { text : args.join(" ") ? args.join(" ") : '' , mentions: participants.map(a => a.id)}, { quoted: m })
 }
 break
 
 case 'promote': {
       
        if (isBan) return reply(mess.banned)	 			
     if (isBanChat) return reply(mess.bangc)
     if (!m.isGroup) return replay(mess.grouponly)
     if (!isBotAdmins) return replay(mess.botadmin)
     if (!isAdmins && !isCreator) return replay(mess.useradmin)
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
     await Maria.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => replay(mess.promote)).catch((err) => replay(jsonformat(err)))
     }
     break

     case 'demote': {
           
        if (isBan) return reply(mess.banned)	 			
     if (isBanChat) return reply(mess.bangc)
     if (!m.isGroup) return replay(mess.grouponly)
     if (!isBotAdmins) return replay(mess.botadmin)
     if (!isAdmins && !isCreator) return replay(mess.useradmin)
     let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
     await Maria.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => replay(jsonformat(res))).catch((err) => replay(jsonformat(err)))
     }
     break
     
     case 'setname': case 'setsubject': {
           
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
 if (!text) return replay('Pls enter -setname <New Group Name>  to change this Group Name')
 await Maria.groupUpdateSubject(m.chat, text).then((res) => replay(mess.jobdone)).catch((err) => replay(jsonformat(err)))
 }
 break
 
 case 'setppgroup': case 'setgcpp': case 'setgrouppp': {
       
 if (!m.isGroup) return replay(mess.grouponly)
 if (!isBotAdmins) return replay(mess.botadmin)
 if (!isAdmins && !isCreator) return replay(mess.useradmin)
if (!quoted) return reply(`Where is the picture?`)
if (!/image/.test(mime)) return reply(`Send/Reply Image With Caption ${prefix + command}`)
if (/webp/.test(mime)) return reply(`Send/Reply Image With Caption ${prefix + command}`)
var mediz = await Maria.downloadAndSaveMediaMessage(quoted, 'ppgc.jpeg')
if (args[0] == `full`) {
var { img } = await generateProfilePicture(mediz)
await Maria.query({
tag: 'iq',
attrs: {
to: m.chat,
type:'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
fs.unlinkSync(mediz)
reply(`Success`)
} else {
var memeg = await Maria.updateProfilePicture(m.chat, { url: mediz })
fs.unlinkSync(mediz)
reply(`Success`)
}
}
break

////////////////////////////////////////////////////
      //////search menu
      case 'stickersearch':
case 'getsticker':
case 'searchsticker':
  if (!args[0]) {
    return Maria.sendMessage(
      m.from,
      { text: `Please provide a search term!` },
      { quoted: m }
    );
  }

  try {
    const gifSearchTerm = args.join(" ");
    const gif = await axios.get(`https://tenor.googleapis.com/v2/search?q=${gifSearchTerm}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`
    );

    // Generate a random number between 0 and 7 to select a GIF from the results
    const resultIndex = Math.floor(Math.random() * 8);
    const gifUrl = gif.data.results[resultIndex].media_formats.gif.url;

    const response = await axios.get(gifUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "utf-8");

    // Create a sticker with the retrieved GIF
    let stickerMess = new Sticker(buffer, {
      pack: packname,
      author: pushName,
      type: StickerTypes.FULL,
      categories: ["🤩", "🎉"],
      id: "12345",
      quality: 60,
      background: "transparent",
    });

    // Convert the sticker to a buffer and send it
    const stickerBuffer = await stickerMess.toBuffer();
    Maria.sendMessage(m.from, { sticker: stickerBuffer }, { quoted: m });
  } catch (error) {
    console.error("Error:", error);
    Maria.sendMessage(
      m.from,
      { text: "An error occurred while searching for the sticker." },
      { quoted: m }
    );
  }
  break;

   
case 'weather':
        if (isBan) return reply(mess.banned)	 			
        if (isBanChat) return reply(mess.bangc)
        if (!args[0]) return reply("Enter your location to search weather.")
        myweather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args.join(" ")}&units=metric&appid=e409825a497a0c894d2dd975542234b0&language=tr`)

        const weathertext = `           ⛅️ *Weather Report* ⛅️  \n\n 🔎*Search Location:* ${myweather.data.name}\n🌐Country:* ${myweather.data.sys.country}\n ☁️*Weather:* ${myweather.data.weather[0].description}\n🌡*Temperature:* ${myweather.data.main.temp}\n🌡 *Minimum Temperature:* ${myweather.data.main.temp_min}🌡\n *Maximum Temperature:* ${myweather.data.main.temp_max}\n❄️*Humidity:* ${myweather.data.main.humidity}%\n 🌪*Wind:* ${myweather.data.wind.speed} km/h\n`
        Maria.sendMessage(from, { video: { url: 'https://media.tenor.com/bC57J4v11UcAAAPo/weather-sunny.mp4' }, gifPlayback: true, caption: weathertext }, { quoted: m })

        break;


   


case "coffee":
      
  if (isBan) return reply(mess.banned);
  if (isBanChat) return reply(mess.bangc);
  waifudhgd = await getBuffer(`https://coffee.alexflipnote.dev/random`);

          let nsfwapimess = {
            image: waifudhgd,
            caption: `Here it is...`,
          };
          await Maria.sendMessage(m.chat, nsfwapimess, {
            quoted: m,
          }).catch((err) => {
            return "Error!";
          });
        break
        case 'google': {
if (!q) return reply(`Example : ${prefix + command} 𝘈𝘺𝘶𝘴𝘩 𝘱𝘢𝘯𝘥𝘦𝘺`)
reply(mess.wait)
let google = require('google-it')
google({'query': text}).then(res => {
let teks = `Google Search From : ${text}\n\n`
for (let g of res) {
teks += `🌠 *Title* : ${g.title}\n`
teks += `🌠 *Description* : ${g.snippet}\n`
teks += `🌠 *Link* : ${g.link}\n\n────────────────────────\n\n`
} 
reply(teks)
})
}
break
		    
case 'gimage':
case 'gig':
case 'googleimage': {
  if (isBan) return reply(mess.banned);
  if (isBanChat) return reply(mess.bangc);
  

  if (!args[0]) return reply("Enter a search term to get Google Image!");
  let gis = require('g-i-s');
  gis(args.join(" "), async (error, result) => {
    if (error) {
      console.error(error);
      return reply("Error occurred while searching for images.");
    }

    if (!result || result.length === 0) {
      return reply("No images found for the given search term.");
    }

    n = result;
    images = n[Math.floor(Math.random() * n.length)].url;
    let buttonMessage = {
      image: { url: images },
      caption: `🔮 _Google Image Search_🔮 \n\n🧩_Search Term_ : ${text}\n🧩_Media Url_ : ${images}`,
      footer: `${global.BotName}`,
      headerType: 4,
    };
    Maria.sendMessage(m.chat, buttonMessage, { quoted: m });
  });
}
break;




     
 ///////////////////////////////////////////////////
     //funmenu
     case 'handsomecheck': case'hc':
        
     if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @Maria`)
					const gan = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const teng = gan[Math.floor(Math.random() * gan.length)]
Maria.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${teng}%*` }, { quoted: m })
					break
					
					case 'beautifulcheck':
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @Maria`)
					const can = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const tik = can[Math.floor(Math.random() * can.length)]
Maria.sendMessage(from, { text: `*${command}*\n\nName : ${q}\nAnswer : *${tik}%*` }, { quoted: m })
					break
case 'ship':
      
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
				if (!text) return replay(`Tag Someone, Example : ${prefix + command} @maria`)
					const sip = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
					const shik = sip[Math.floor(Math.random() * sip.length)]
Maria.sendMessage(from, { video: { url: `https://media.tenor.com/VmwZnGeD0oEAAAPo/maria-naruse-shinmai-maou-no-testament.mp4` },caption: `*🍁matching🍁*\n\n ${pushname+q}\nAnswer : *${shik}%*`,gifPlayback: true}, { quoted: m })
					break
case 'smart':
case 'gay':
case 'playboy':
case 'playgirl':
case 'hot':{
      
if (!m.isGroup) return m.reply(`${mess.group}`)
            let member = participants.map(u => u.id)
            let me = m.sender
            let jodoh = member[Math.floor(Math.random() * member.length)]
            let jawab = `The Most *${command}* Here Is @${jodoh.split('@')[0]}`
            let ments = [me, jodoh]

                    await Maria.sendButtonText(m.chat, jawab, botname, m, {mentions: ments})
            }
            
            break


//
case 'kill': case 'pat': case 'lick': case 'kiss': case'hug': case 'bite':
case 'bully': case 'bonk': case 'poke': case 'slap':
case 'happy':
case 'cuddle': case 'kick':{
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)	

var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
try {
  let messsender = m.sender
let musers=``
try {
users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'

ment=[messsender,users]
} catch {
users == "none"
 ment=[messsender,m.sender]
}
if(users == "none"){
   musers =`@${m.sender.split("@")[0]} ${command}ed themselves!!`
   console.log(musers)

} else {
const rcpp =`@${users.split("@"[0])}`
musers= `@${m.sender.split("@")[0]} ${command}ed  @${users.split("@")[0]} `

console.log(musers)
}
      const response = await axios.get(pat.url,  { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, "utf-8")
  var fetchedgif = await GIFBufferToVideoBuffer(buffer)
  Maria.sendMessage(m.chat,{video: fetchedgif, gifPlayback:true,mentions:ment,caption:musers},{quoted:m})
  } catch (error) {
      console.log(error);
  }
}
break;


case 'yeet':
case 'wink': case 'smile':
case 'wave': case 'blush': case 'smug': case 'glomp':
case 'cringe': case 'highfive':{
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)	
var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
try {
  let messsender = m.sender
let musers=``
try {
users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'

ment=[messsender,users]
} catch {
users == "none"
 ment=[messsender,m.sender]
}
if(users == "none"){
   musers =`@${m.sender.split("@")[0]} ${command}ed at themself!`
   console.log(musers)

} else {
const rcpp =`@${users.split("@"[0])}`
musers= `@${m.sender.split("@")[0]} ${command}ed at @${users.split("@")[0]} `

console.log(musers)
}
      const response = await axios.get(pat.url,  { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, "utf-8")
  var fetchedgif = await GIFBufferToVideoBuffer(buffer)
  Maria.sendMessage(m.chat,{video: fetchedgif, gifPlayback:true,mentions:ment,caption:musers},{quoted:m})
  } catch (error) {
      console.log(error);
  }
}
break;


case 'cry':  case 'handhold':{
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
//

var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
try {
  let messsender = m.sender
let musers=``
try {
users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'

ment=[messsender,users]
} catch {
users == "none"
 ment=[messsender,m.sender]
}
if(users == "none"){
   musers =`@${m.sender.split("@")[0]} ${command}ed with themself!`
   console.log(musers)

} else {
const rcpp =`@${users.split("@"[0])}`
musers= `@${m.sender.split("@")[0]} ${command}ed with @${users.split("@")[0]} `

console.log(musers)
}
      const response = await axios.get(pat.url,  { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, "utf-8")
  var fetchedgif = await GIFBufferToVideoBuffer(buffer)
  Maria.sendMessage(m.chat,{video: fetchedgif, gifPlayback:true,mentions:ment,caption:musers},{quoted:m})
  } catch (error) {
      console.log(error);
  }
}
break;


case 'dance':{
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
  Maria.sendMessage(from, { react: { text: "💃🏻" , key: m.key }});

var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
try {
  let messsender = m.sender
let musers=``
try {
users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'

ment=[messsender,users]
} catch {
users == "none"
 ment=[messsender,m.sender]
}
if(users == "none"){
   musers =`@${m.sender.split("@")[0]} is dancing alone!!`
   console.log(musers)

} else {
const rcpp =`@${users.split("@"[0])}`
musers= `@${m.sender.split("@")[0]} is dancing with @${users.split("@")[0]} `

console.log(musers)
}
      const response = await axios.get(pat.url,  { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, "utf-8")
  var fetchedgif = await GIFBufferToVideoBuffer(buffer)
  Maria.sendMessage(m.chat,{video: fetchedgif, gifPlayback:true,mentions:ment,caption:musers},{quoted:m})
  } catch (error) {
      console.log(error);
  }
}
break;

//
 case 'dare':
       
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	Maria.sendMessage(from, { react: { text: "ðŸŒ" , key: m.key }})
	
                   const dare =[
"eat 2 tablespoons of rice without any side dishes, if it's dragging you can drink",
         "spill people who make you pause",
         "call crush/pickle now and send ss",
         "drop only emote every time you type on gc/pc for 1 day.",
         "say Welcome to Who Wants To Be a Millionaire! to all the groups you have",
         "call ex saying miss",
         "sing the chorus of the last song you played",
         "vn your ex/crush/girlfriend, says hi (name), wants to call, just a moment. I miss🥺👉🏼👈🏼",
         "Bang on the table (which is at home) until you get scolded for being noisy",
         "Tell random people - I was just told I was your twin first, we separated, then I had plastic surgery. And this is the most ciyusss_ thing",
         "mention ex's name",
         "make 1 rhyme for the members!",
         "send ur whatsapp chat list",
         "chat random people with gheto language then ss here",
         "tell your own version of embarrassing things",
         "tag the person you hate",
         "Pretending to be possessed, for example: possessed by dog, possessed by grasshoppers, possessed by refrigerator, etc.",
         "change name to *I AM DONKEY* for 24 hours",
         "shout *ma chuda ma chuda ma chuda* in front of your house",
         "snap/post boyfriend photo/crush",
         "tell me your boyfriend type!",
         "say *i hv crush on you, do you want to be my girlfriend?* to the opposite sex, the last time you chatted (submit on wa/tele), wait for him to reply, if you have, drop here",
         "record ur voice that read *titar ke age do titar, titar ke piche do titar*",
         "prank chat ex and say *i love u, please come back.* without saying dare!",
         "chat to contact wa in the order according to your battery %, then tell him *i am lucky to hv you!*",
         "change the name to *I am a child of randi* for 5 hours",
         "type in bengali 24 hours",
         "Use selmon bhoi photo for 3 days",
         "drop a song quote then tag a suitable member for that quote",
         "send voice note saying can i call u baby?",
         "ss recent call whatsapp",
         "Say *YOU ARE SO BEAUTIFUL DON'T LIE* to guys!",
         "pop to a group member, and say fuck you",
         "Act like a chicken in front of ur parents",
         "Pick up a random book and read one page out loud in vn n send it here",
         "Open your front door and howl like a wolf for 10 seconds",
         "Take an embarrassing selfie and paste it on your profile picture",
         "Let the group choose a word and a well known song. You have to sing that song and send it in voice note",
         "Walk on your elbows and knees for as long as you can",
         "sing national anthem in voice note",
         "Breakdance for 30 seconds in the sitting room😂",
         "Tell the saddest story you know",
         "make a twerk dance video and put it on status for 5mins",
         "Eat a raw piece of garlic",
         "Show the last five people you texted and what the messages said",
         "put your full name on status for 5hrs",
         "make a short dance video without any filter just with a music and put it on ur status for 5hrs",
         "call ur bestie, bitch",
         "put your photo without filter on ur status for 10mins",
         "say i love oli london in voice note🤣🤣",
         "Send a message to your ex and say I still like you",
         "call Crush/girlfriend/bestie now and screenshot here",
         "pop to one of the group member personal chat and Say you ugly bustard",
         "say YOU ARE BEAUTIFUL/HANDSOME to one of person who is in top of ur pinlist or the first person on ur chatlist",
         "send voice notes and say, can i call u baby, if u r boy tag girl/if girl tag boy",
         "write i love you (random grup member name, who is online) in personal chat, (if u r boy write girl name/if girl write boy name) take a snap of the pic and send it here",
         "use any bollywood actor photo as ur pfp for 3 days",
         "put your crush photo on status with caption, this is my crush",
         "change name to I AM GAY for 5 hours",
         "chat to any contact in whatsapp and say i will be ur bf/gf for 5hours",
         "send voice note says i hv crush on you, want to be my girlfriend/boyfriend or not? to any random person from the grup(if u girl choose boy, if boy choose girl",
         "slap ur butt hardly send the sound of slap through voice note😂",
         "state ur gf/bf type and send the photo here with caption, ugliest girl/boy in the world",
         "shout bravooooooooo and send here through voice note",
         "snap your face then send it here",
         "Send your photo with a caption, i am lesbian",
         "shout using harsh words and send it here through vn",
         "shout you bastard in front of your mom/papa",
         "change the name to i am idiot for 24 hours",
         "slap urself firmly and send the sound of slap through voice note😂",
         "say i love the bot owner Maria through voice note",
         "send your gf/bf pic here",
         "make any tiktok dance challenge video and put it on status, u can delete it after 5hrs",
         "breakup with your best friend for 5hrs without telling him/her that its a dare",
          "tell one of your frnd that u love him/her and wanna marry him/her, without telling him/her that its a dare",
          "say i love depak kalal through voice note",
          "write i am feeling horny and put it on status, u can delete it only after 5hrs",
          "write i am lesbian and put it on status, u can delete only after 5hrs",
          "kiss your mommy or papa and say i love you😌",
          "put your father name on status for 5hrs",
          "send abusive words in any grup, excepting this grup, and send screenshot proof here"
     ]
                   const Mariadareww = dare[Math.floor(Math.random() * dare.length)]
                   buffer = await getBuffer(`https://graph.org/file/8dd92e67cd4019b092f53.jpg`)
                   Maria.sendMessage(from, { image: buffer, caption: '*You have chosen Dare*\n\n'+ Mariadareww }, {quoted:m})
                   break
                       

case 'truth':
      
    if (isBan) return reply(mess.banned)
    if (isBanChat) return reply(mess.bangc)
	Maria.sendMessage(from, { react: { text: "ðŸŒ" , key: m.key }})
		
                           const truth =[
                                  "Have you ever liked anyone? How long?",
                 "If you can or if you want, which gc/outside gc would you make friends with? (maybe different/same type)",
                 "apa ketakutan terbesar kamu?",
                 "Have you ever liked someone and felt that person likes you too?",
                 "What is the name of your friend's ex-girlfriend that you used to secretly like?",
                 "Have you ever stolen money from your father or mom? The reason?",
                 "What makes you happy when you're sad?",
                 "Ever had a one sided love? if so who? how does it feel bro?", 
                 "been someone's mistress?",
                 "the most feared thing",
                 "Who is the most influential person in your life?",
                 "what proud thing did you get this year", 
                 "Who is the person who can make you awesome", 
                 "Who is the person who has ever made you very happy?", 
                 "Who is closest to your ideal type of partner here", 
                 "Who do you like to play with??", 
                 "Have you ever rejected people? the reason why?",
                 "Mention an incident that made you hurt that you still remember", 
                 "What achievements have you got this year??",
                 "What's your worst habit at school??",
                 "What song do you sing most in the shower",
                 "Have you ever had a near-death experience",
                 "When was the last time you were really angry. Why?",
                 "Who is the last person who called you",
                 "Do you have any hidden talents, What are they",
                 "What word do you hate the most?",
                 "What is the last YouTube video you watched?",
                 "What is the last thing you Googled",
                 "Who in this group would you want to swap lives with for a week",
                 "What is the scariest thing thats ever happened to you",
                 "Have you ever farted and blamed it on someone else",
                 "When is the last time you made someone else cry",
                 "Have you ever ghosted a friend",
                 "Have you ever seen a dead body",
                 "Which of your family members annoys you the most and why",
                 "If you had to delete one app from your phone, which one would it be",
                 "What app do you waste the most time on",
                 "Have you ever faked sick to get home from school",
                 "What is the most embarrassing item in your room",
                 "What five items would you bring if you got stuck on a desert island",
                 "Have you ever laughed so hard you peed your pants",
                 "Do you smell your own farts",
                 "have u ever peed on the bed while sleeping ðŸ¤£ðŸ¤£",
                 "What is the biggest mistake you have ever made",
                 "Have you ever cheated in an exam",
                 "What is the worst thing you have ever done",
                 "When was the last time you cried",
                 "whom do you love the most among ur parents", 
                 "do u sometimes put ur finger in ur nosetrilðŸ¤£", 
                 "who was ur crush during the school days",
                 "tell honestly, do u like any boy in this grup",
                 "have you ever liked anyone? how long?",
                 "do you have gf/bf','what is your biggest fear?",
                 "have you ever liked someone and felt that person likes you too?",
                 "What is the name of your ex boyfriend of your friend that you once liked quietly?",
                 "ever did you steal your mothers money or your fathers money",
                 "what makes you happy when you are sad",
                 "do you like someone who is in this grup? if you then who?",
                 "have you ever been cheated on by people?",
                 "who is the most important person in your life",
                 "what proud things did you get this year",
                 "who is the person who can make you happy when u r sad",
                 "who is the person who ever made you feel uncomfortable",
                 "have you ever lied to your parents",
                 "do you still like ur ex",
                 "who do you like to play together with?",
                 "have you ever stolen big thing in ur life? the reason why?",
                 "Mention the incident that makes you hurt that you still remember",
                 "what achievements have you got this year?",
                 "what was your worst habit at school?",
                 "do you love the bot creator Ayush?",
                 "have you ever thought of taking revenge from ur teacher?",
                 "do you like current prime minister of ur country",
                 "you non veg or veg",
                 "if you could be invisible, what is the first thing you would do",
                 "what is a secret you kept from your parents",
                 "Who is your secret crush",
                 "whois the last person you creeped on social media",
                 "If a genie granted you three wishes, what would you ask for",
                 "What is your biggest regret",
                 "What animal do you think you most look like",
                 "How many selfies do you take a day",
                 "What was your favorite childhood show",
                 "if you could be a fictional character for a day, who would you choose",
                 "whom do you text the most",
                 "What is the biggest lie you ever told your parents",
                 "Who is your celebrity crush",
                 "Whats the strangest dream you have ever had",
                 "do you play pubg, if you then send ur id number"
             ]
                           const Mariatruthww = truth[Math.floor(Math.random() * truth.length)]
                           buffer = await getBuffer(`https://graph.org/file/8dd92e67cd4019b092f53.jpg`)
                           Maria.sendMessage(from, { image: buffer, caption: '*You have chosen Truth*\n'+ Mariatruthww }, {quoted:m})
                           break
                           
                           /* 

Kindly Do not remove Creadit to Avoid the Bugs and error 

*/

/* 

Search Shizo The Techie on Google for more info.

This Code is made with ❤️ by Shizo The Techie for Maria-MD (Ayush) 

*/



case 'shayari': case 'sayari':



if (isBan) return reply(mess.banned)

if (isBanChat) return reply(mess.bangc)



let devsiz = await fetch(`https://shizoapi.cyclic.app/api/texts/shayari?apikey=shizo`)

let syri = await devsiz.json()

let shayari = `${syri.result}`

reply(shayari)



break





case 'night': case 'raat':



if (isBan) return reply(mess.banned)

if (isBanChat) return reply(mess.bangc)



let devsizn = await fetch(`https://shizoapi.cyclic.app/api/texts/lovenight?apikey=shizo`)

let nyt = await devsizn.json()

let night = `${nyt.result}`

reply(night)



break





case 'flirt': case 'flirting':



if (isBan) return reply(mess.banned)

if (isBanChat) return reply(mess.bangc)



let devsizf = await fetch(`https://shizoapi.cyclic.app/api/texts/flirt?apikey=shizo`)

let flrt = await devsizf.json()

let flirt = `${flrt.result}`

reply(flirt)



break
    
                           
 ///////////////////////////////////////////////////
//other menu

case 'fact': {
    	const { data } = await axios.get(`https://nekos.life/api/v2/fact`)
        return reply(`📍 *Fact:* ${data.fact}\n`)   
    }
    break
    
    case 'iguser': {
          
     
if (!args[0]) return reply(`Enter Instagram Username\n\nExample: ${prefix + command} Official_bhardwaj023`)
const fg = require('api-dylux')
    try {
    let res = await fg.igStalk(args[0])
    let te = `
┌──「 *📍Instragram📍* 
▢ *⚡Name:* ${res.name} 
▢ *🔖Username:* ${res.username}
▢ *👥Follower:* ${res.followersH}
▢ *🫂Following:* ${res.followingH}
▢ *📌Bio:* ${res.description}
▢ *🏝️Posts:* ${res.postsH}
▢ *🔗 Link* : https://instagram.com/${res.username.replace(/^@/, '')}
└────────────`
     await Maria.sendMessage(m.chat, {image: { url: res.profilePic }, caption: te }, {quoted: m})
      } catch {
        reply(`Make sure the username comes from *Instagram*`)
      }
}
break

case 'emojimix': {
      
		let [emoji1, emoji2] = text.split`+`
		if (!emoji1) return reply(`Example : ${prefix + command} 😅+🤔`)
		if (!emoji2) return reply(`Example : ${prefix + command} 😅+🤔`)
		let anumojimix = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
		for (let res of anumojimix.results) {
		    let encmedia = await Maria.sendImageAsSticker(m.chat, res.url, m, { packname: global.packname, author: global.author, categories: res.tags })
		    
		}
	    }
	    break
	
case 's': case 'sticker': case 'stiker': {
   
if (!quoted) return reply(`Send/Reply Images/Videos/Gifs With Captions ${prefix+command}\nVideo Duration 1-9 Seconds`)

if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await Maria.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })

} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 11) return reply('Send/Reply Images/Videos/Gifs With Captions ${prefix+command}\nVideo Duration 1-9 Seconds')
let media = await quoted.download()
let encmedia = await Maria.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })

} else {
reply(`Send/Reply Images/Videos/Gifs With Captions ${prefix+command}\nVideo Duration 1-9 Seconds`)
}
}
break

 {
      if (/image/.test(mime) && !/webp/.test(mime)) {
        let mediac = await quoted.download();
        await Maria.sendImageAsSticker(from, mediac, m, {
          packname: global.packname,
          author: global.author,
        });
        console.log(`Auto sticker detected`);
      } else if (/video/.test(mime)) {
        if ((quoted.msg || quoted).seconds > 11) return;
        let mediac = await quoted.download();
        await Maria.sendVideoAsSticker(from, mediac, m, {
          packname: global.packname,
          author: global.author,
        });
      }
    }

case 'swm': case 'steal': case 'stickerwm': case 'take':{
      
if (!args.join(" ")) return reply(`Where is the text?`)
const swn = args.join(" ")
const pcknm = swn.split("|")[0]
const atnm = swn.split("|")[1]
if (m.quoted.isAnimated === true) {
Maria.downloadAndSaveMediaMessage(quoted, "gifee")
Maria.sendMessage(from, {sticker:fs.readFileSync("gifee.webp")},{quoted:m})
} else if (/image/.test(mime)) {
let media = await quoted.download()
let encmedia = await Maria.sendImageAsSticker(m.chat, media, m, { packname: pcknm, author: atnm })
} else if (/video/.test(mime)) {
if ((quoted.msg || quoted).seconds > 11) return reply('Maximum 10 Seconds!')
let media = await quoted.download()
let encmedia = await Maria.sendVideoAsSticker(m.chat, media, m, { packname: pcknm, author: atnm })
} else {
reply(`Photo/Video?`)
}
}
break
case 'pornhub':{
      
if(!q) return reply(`Example: ${prefix + command} ajg | ea`)
  inilogo4 = args.join(" ")
inilogo9 = args.join(" ")
   var logo4 = inilogo4.split('|')[0]
var logo9 = inilogo9.split('|')[1]
    let anuphub = await textpro2("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", [`${logo4}`,`${logo9}`])
console.log(anuphub)
Maria.sendMessage(from,{image:{url:anuphub}, caption:"Created by Maria-Md"},{quoted:m})
}
break

case 'calculator': case 'cal': case 'calculate':{
        
    if (isBan) return reply(mess.banned)	 			
if (isBanChat) return reply(mess.bangc)
if (args.length < 1) return reply(`*Example :*\n${prefix}calculator 2*5\n\n`)
let qsd = args.join(" ")
if (typeof mathjs.evaluate(qsd) !== 'number') {
reply('Error')
} else {
reply(`\`\`\`「 _Calculator Tool_ 」\`\`\`\n\n*Input :* ${qsd}\n*Calculation Result :* ${mathjs.evaluate(qsd.replace(/×/g, "*").replace(/x/g, "*").replace(/÷/g, "/"))}`)
}
}
break



 case "tts":  case "texttospeech":  case "say": case "speak":{
      
    if (isBan) return reply(mess.banned)	 			
    if (isBanChat) return reply(mess.bangc)

    if (!args[0]) return reply("Please give me a text so that i can speak it!")
      
      let texttosay = text
        ? text
        : m.quoted && m.quoted.text
        ? m.quoted.text
        : m.text;
      const SpeakEngine = require("google-tts-api"); 
      const texttospeechurl = SpeakEngine.getAudioUrl(texttosay, {lang: "en", slow: false, host: "https://translate.google.com",});
      Maria.sendMessage(m.chat,{audio: {url: texttospeechurl,},mimetype: "audio/mpeg",fileName: `MariaSpeechEngine.mp3`,},{quoted: m,});
    }
    break
        
        case 'toimage': case 'toimg': {
              
   if (isBan) return reply(mess.banned)	 			
if (isBanChat) return reply(mess.bangc)
if (!m.quoted) return reply('Reply Image')
if (!/webp/.test(mime)) return reply(`Reply sticker with caption *${prefix + command}*`)
reply(mess.waiting)
let media = await Maria.downloadAndSaveMediaMessage(quoted)
let ran = await getRandom('.png')
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) throw err
let buffer = fs.readFileSync(ran)
Maria.sendMessage(m.chat, { image: buffer }, { quoted: m})
fs.unlinkSync(ran)
})
}
break

case 'togif': case 'getgif':{
      
    if (isBan) return reply(mess.banned)	 			
 if (isBanChat) return reply(mess.bangc)
 if (!m.quoted) return reply('Reply Image')
 if (!/webp/.test(mime)) return reply(`Reply sticker with caption *${prefix + command}*`)
 reply(mess.wait)
 let { webp2mp4File } = require('./lib/uploader')
 let media = await Maria.downloadAndSaveMediaMessage(quoted)
 let webpToMp4 = await webp2mp4File(media)
 await Maria.sendMessage(m.chat, { video: { url: webpToMp4.result, caption: 'Converted From Webp To Gif' }, gifPlayback: true }, { quoted: m })
 await fs.unlinkSync(media)
 }
 break
 
case 'runtime': {
      
            	let lowq = `*The Bot Has Been Online For:*\n*${runtime(process.uptime())}*`
                reply(lowq)
            	}
            break
            
      case 'ss': case 'ssweb': {
            
if (!q) return replygcMaria(`Example ${prefix+command} link`)
reply(mess.waiting)
let krt = await scp1.ssweb(q)
Maria.sendMessage(from,{image:krt.result,caption:mess.succes}, {quoted:m})
}
break

////////////////////////////////////////////////////
//owner menu 
case 'shutdown': case 'sleep':
        if (!isCreator) return reply(mess.owner)
        if (isBanChat) return reply(mess.bangc);
        if (!isCreator) return reply(mess.owner)
        

        reply(`Okey bye time to sleep!`)
        await sleep(5000)
        process.exit()
        break;
        
case "code":
        if (!isCreator) return replay(mess.botowner)
 const getCase = (cases) => {
          return (
          
            "case" +
            `'${cases}'` +
            fs
              .readFileSync("Central.js")
              .toString()
              .split("case '" + cases + "'")[1]
              .split("break")[0] +
            "break"
          );
        };
        reply(`${getCase(q)}`);
        break;
case 'join': {
  if (isBan) return reply(mess.banned)	 			
if (isBanChat) return reply(mess.bangc)
if (!isCreator) return replay(mess.botowner)

if (!args[0]) return replay(`Where's the link?`)
vdd = args[0]
let vcc = vdd.split("https://chat.whatsapp.com/")[1]
if (!vcc) return replay("Link invalid!")
if (isCreator) {
await Maria.groupAcceptInvite(vcc).then(async(res) => replay(jsonformat(res))).catch(_ => _)
replay("Succes!")
} else {
Maria.query({
tag: "iq",
attrs: {
type: "get",
xmlns: "w:g2",
to: "@g.us"
},
content: [{ tag: "invite", attrs: { code: vcc } }]
}).then(async(res) => {
sizny = res.content[0].attrs.size
if (sizny < 20) {
teks = `Sorry, munimun 20 members are required in a group to add bot!`
sendOrder(m.chat, teks, "667140254502463", fs.readFileSync('./Assets/pic7.jpg'), `${global.packname}`, `${global.BotName}`, "916297175943@s.whatsapp.net", "AR6NCY8euY5cbS8Ybg5Ca55R8HFSuLO3qZqrIYCT7hQp0g==", "99999999999999999999")
} else if (sizny > 20) {
await Maria.groupAcceptInvite(vcc).then(async(res) => replay(jsonformat(res))).catch(_ => _)
replay("Joined !")
} else {
replay("Error")
}
}).catch(_ => _)
}
}
break;

case "bctext":
      case "broadcasttext":
      case "broadcast":
      case "bc":
        {
if (!isCreator) return replay(mess.botowner);
          if (!q) return reply(`Enter text`);
          const data = await store.chats.all();
          for (let i of data) {
            Maria.sendMessage(i.id, {
              text: `*🏮 Maria Broadcast 🏮* \n\n message🧾: ${q}\n\n Broadcast by *${ownername}*`,
            });
            await sleep(1000);
          }
        }
         Maria.sendMessage(m.chat, { video: { url: `https://c.tenor.com/4TLYvKWI2mgAAAPo/nakano-yotsuba-smile.mp4` }, caption: text, gifPlayback: true }, { quoted: m });
        break
        
case 'leavegc': case 'leavegroup': case 'bye': {
    if (isBan) return reply(mess.banned)	 			
    if (isBanChat) return reply(mess.bangc)
    if (!m.isGroup) return replay(mess.grouponly)
        reply(mess.waiting)
                    if (!isCreator) return replay(`${mess.botowner}`)
                    await Maria.groupLeave(m.chat).then((res) => reply(jsonformat(res))).catch((err) => reply(jsonformat(err)))
                }
                break
           
case "creategc":
      case "creategroup":
        {
          if (!isCreator) return replay(mess.botowner);
          if (!args.join(" "))
            return reply(`Use ${prefix + command} groupname`);
          try {
            let cret = await Maria.groupCreate(args.join(" "), []);
            let response = await Maria.groupInviteCode(cret.id);
            teks = ` 《༒𝙂𝙧𝙤𝙪𝙥 𝘾𝙧𝙚𝙖𝙩𝙚༒》

☤Name : ${cret.subject}
☤Owner : @${cret.owner.split("@")[0]}
☤Creation: ${moment(cret.creation * 1000)
              .tz("Asia/Kolkata")
              .format("DD/MM/YYYY HH:mm:ss")}

https://chat.whatsapp.com/${response}
       `;
            Maria.sendMessage(
              m.chat,
              {
                text: teks,
                mentions: await Maria.parseMention(teks),
              },
              { quoted: m }
            );
          } catch {
            reply("Error!");
          }
        }
        break
        case 'setppbot': case 'setbotpp': {
if (!isCreator) return replay(mess.botowner)
if (!quoted) return reply(`Send/Reply Image With Caption ${prefix + command}`)
if (!/image/.test(mime)) return reply(`Send/Reply Image With Caption ${prefix + command}`)
if (/webp/.test(mime)) return reply(`Send/Reply Image With Caption ${prefix + command}`)
var medis = await Maria.downloadAndSaveMediaMessage(quoted, 'ppbot.jpeg')
if (args[0] == `full`) {
var { img } = await generateProfilePicture(medis)
await Maria.query({
tag: 'iq',
attrs: {
to: botNumber,
type:'set',
xmlns: 'w:profile:picture'
},
content: [
{
tag: 'picture',
attrs: { type: 'image' },
content: img
}
]
})
fs.unlinkSync(medis)
reply(`Succes`)
} else {
var memeg = await Maria.updateProfilePicture(botNumber, { url: medis })
fs.unlinkSync(medis)
reply(`Success, Thank you for the new profile photo, my darling 😚`)
}
}
break

case 'setbotname':{
          if (!isCreator) return replay(mess.botowner);
if (!text) return reply(`Where is the name?\nExample: ${prefix + command} BarbieX-MD`)
    await Maria.updateProfileName(text)
    reply(`Success in changing the name of bot's number`)
    }
    break
case 'setbotbio':{
          if (!isCreator) return replay(mess.botowner)
if (!text) return reply(`Where is the text?\nExample: ${prefix + command} BarbieX-MD`)
    await Maria.updateProfileStatus(text)
    reply(`Success in changing the bio of bot's number`)
    }
    break
///////////////////////////////////////////////////
// download menu
case 'git': case 'gitclone':
      
if (!args[0]) return reply(`Where is the link?\nExample :\n${prefix}${command} https://github.com/Ayush-pandey-u/Maria-Md`)
if (!isUrl(args[0]) && !args[0].includes('github.com')) return reply(`Link invalid!!`)
let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
    let [, user, repo] = args[0].match(regex1) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    Maria.sendMessage(m.chat, { document: { url: url }, fileName: filename+'.zip', mimetype: 'application/zip' }, { quoted: m }).catch((err) => reply(mess.error))
break
case 'gdrive': {
      
		if (!args[0]) return reply(`Enter the Google Drive link`)
	const fg = require('api-dylux')
	try {
	let res = await fg.GDriveDl(args[0])
	 await reply(`
≡ *Google Drive DL*
▢ *Nama:* ${res.fileName}
▢ *Size:* ${res.fileSize}
▢ *Type:* ${res.mimetype}`)
	Maria .sendMessage(m.chat, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype }, { quoted: m })
   } catch {
	reply('Error: Check link or try another link') 
  }
}
break

case 'attp':
                try {
                if (args.length == 0) return reply(`Example: ${prefix + command} Ayush pandey`)
                await Maria.sendMessage(m.chat, {sticker: {url:`https://api.lolhuman.xyz/api/attp?apikey=${apikey}&text=${full_args}` }}, { quoted: m })
            } catch (e) {
                reply(mess.error)
            }
            break
            case 'attp2':
                try {
                    if (args.length == 0) return reply(`Example: ${prefix + command} Ayush`)
                    await Maria.sendMessage(m.chat, {sticker: {url:`https://api.lolhuman.xyz/api/attp2?apikey=${apikey}&text=${full_args}` }}, { quoted: m })
                } catch (e) {
                    reply(mess.error)
            }
            break
////////react menu
case 'kill': case 'pat': case 'lick': case 'kiss': case 'bite':
case 'bully': case 'bonk': case 'poke': case 'slap':
case 'happy':
case 'cuddle': case 'kick':{
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)	
var pat = await fetchJson(`https://api.waifu.pics/sfw/${command}`)
try {
  let messsender = m.sender
let musers=``
try {
users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'

ment=[messsender,users]
} catch {
users == "none"
 ment=[messsender,m.sender]
}
if(users == "none"){
   musers =`@${m.sender.split("@")[0]} ${command}ed themselves!!`
   console.log(musers)

} else {
const rcpp =`@${users.split("@"[0])}`
musers= `@${m.sender.split("@")[0]} ${command}ed  @${users.split("@")[0]} `

console.log(musers)
}
      const response = await axios.get(pat.url,  { responseType: 'arraybuffer' })
      const buffer = Buffer.from(response.data, "utf-8")
  var fetchedgif = await GIFBufferToVideoBuffer(buffer)
 Maria.sendMessage(m.chat,{video: fetchedgif, gifPlayback:true,mentions:ment,caption:musers},{quoted:m})
  } catch (error) {
      console.log(error);
  }
}
break


///////////////////////////////////////////////////
///Weeb menu
case 'waifu' :
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
reply(mess.waiting)	
  waifuddd = await axios.get('https://waifu.pics/api/sfw/waifu')
/*var wbuttsssr = [
  {buttonId: `${prefix}waifu`, buttonText: {displayText: `>>`}, type: 1},
  ] */
      let button4Messagess = {
      image: {url:waifuddd.data.url},
      caption: 'More than one waifu will definitely ruin your Laifu!',
      /*buttons: wbuttsssr,
      headerType: 4 */
       }     
                                
  await Maria.sendMessage(m.chat, button4Messagess, { quoted:m }).catch(err => {
      return('error..')
      })
break


case 'neko' :
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
reply(mess.waiting)	
  waifuddd = await axios.get('https://waifu.pics/api/sfw/neko')
/*var wbuttsssr = [
  {buttonId: `${prefix}neko`, buttonText: {displayText: `>>`}, type: 1},
  ] */
      let buttonMessagessf = {
      image: {url:waifuddd.data.url},
      caption: 'Nyaa...',
  /*    buttons: wbuttsssr,
      headerType: 2  */
       }     
                                
  await Maria.sendMessage(m.chat, buttonMessagessf, { quoted:m }).catch(err => {
      return('error..')
      })
break


case 'loli':
  if (isBan) return reply(mess.banned);
  if (isBanChat) return reply(mess.banqc);
  if (!m.isGroup) return reply(mess.grouponly);
  reply(mess.waiting);

  waifuddd = await axios.get('https://waifu.pics/api/sfw/shinobu');

  let buttonMessagessfgr = {
    image: { url: waifuddd.data.url },
  };

  await Maria.sendMessage(m.chat, buttonMessagessfgr, { quoted: m }).catch(err => {
    console.error(err); // Log the error for debugging.
  });

  break;



case 'animewall2': 
case 'animewallpaper2':
case 'wallpaper':
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
  reply(mess.waiting)						
const { AnimeWallpaper } =require("anime-wallpaper")
if(!q) return reply('Please enter a seach term!')
const wall = new AnimeWallpaper();
  const pages = [1,2,3,4];
      const random=pages[Math.floor(Math.random() * pages.length)]
      const wallpaper = await wall
          .getAnimeWall4({ title: q, type: "sfw", page: pages })
          .catch(() => null);
const i = Math.floor(Math.random() * wallpaper.length);
var walb = [
      {buttonId: `${prefix}animewall2 ${q}`, buttonText: {displayText: `>>`}, type: 1},        
      ]
    let wal = {
     image: {url:wallpaper[i].image},
     caption: `*Search Term :* ${q}`,
    footer: `${global.BotName}`,
    buttons: walb,
    headerType: 4
    }     
          await Maria.sendMessage(m.chat, wal,{ quoted:m }).catch(err => {
                  return('Error!')
              })          
break

case 'crossplay': case 'crosplay': case 'cosplay':
      
  if (isBan) return reply(mess.banned)	 			
  if (isBanChat) return reply(mess.bangc)
  if (!m.isGroup) return replay(mess.grouponly)
  Maria.sendMessage(from, { react: { text: "âœ¨" , key: m.key }})  

           /*   const buttons = [
      {buttonId: '-crossplay', buttonText: {displayText: '>>'}, type: 1},
          ]     */     

      const cosplybutton = {
      image: {url: 'https://fantox-cosplay-api.onrender.com/'},
      caption: "Guess who am i...",
     /* footer: `${global.BotName}`,
      buttons: buttons,
      headerType: 4 */
      }
                
      await Maria.sendMessage(m.chat,cosplybutton, { quoted:m }).catch(err => {
          return('Error!')
      })  

      break


///////////////////////////////////////////////////
////help menu
case 'help':{
      
    const helpmenu = require("./lib/Maria/help.js")
        Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: helpmenu, gifPlayback: true }, { quoted: m });
        }
        break

case 'list': case 'listmenu':{
      
const listmenu = require("./lib/Maria/list.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: listmenu, gifPlayback: true }, { quoted: m });
        }
        break
        
         case 'menu':  {
    ;
    const helpmenu = require("./lib/Maria/help.js");
    Maria.sendMessage(m.chat, { video: { url: 'https://graph.org/file/b0b8add10f776322eb9b0.mp4' }, caption: helpmenu }, { quoted: m });
}
break;

case 'list': case 'listmenu': {
    ;
    const listmenu = require("./lib/Maria/list.js");
    Maria.sendMessage(m.chat, { video: { url: 'https://graph.org/file/2a8f5e79a528704a58db7.mp4 ' }, caption: listmenu }, { quoted: m });
}
break;


  
case 'help1': case 'h1':{
      
const h3menu = require("./lib/Maria/general.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h3menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
  case 'help2': case 'h2':{
      
const h3menu = require("./lib/Maria/owner.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h3menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
  
  
         case 'help3': case 'h3':{
               
const h4menu = require("./lib/Maria/search.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h4menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help4': case 'h4':{
               
         
const h5menu = require("./lib/Maria/group.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h5menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help5' : case 'h5':{
               
const h6menu = require("./lib/Maria/fun.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h6menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help6': case 'h6':{
               
const h7menu = require("./lib/Maria/weeb.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h7menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help7': case 'h7':{
               
const h8menu = require("./lib/Maria/audio.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h8menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help8': case 'h8' :{
               
const h9menu = require("./lib/Maria/react.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h9menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         case 'help9': case 'h9':{
               
const h10menu = require("./lib/Maria/other.js")

Maria.sendMessage(m.chat, { image: { url: `https://picfiles.alphacoders.com/623/623720.jpeg` }, caption: h10menu, gifPlayback: true }, { quoted: m });
        }
        break
  
  
         
  /////////////////////////////////////////////////
  
case 'anime': {
if (!text) return reply(`Which anime are you lookin for?`)
const malScraper = require('mal-scraper')
reply(mess.waiting)
        const anime = await malScraper.getInfoFromName(text).catch(() => null)
        if (!anime) return reply(`Could not find`)
let animetxt = `
🎀 *Title: ${anime.title}*
🎋 *Type: ${anime.type}*
🎐 *Premiered on: ${anime.premiered}*
💠 *Total Episodes: ${anime.episodes}*
📈 *Status: ${anime.status}*
💮 *Genres: ${anime.genres}
📍 *Studio: ${anime.studios}*
🌟 *Score: ${anime.score}*
💎 *Rating: ${anime.rating}*
🏅 *Rank: ${anime.ranked}*
💫 *Popularity: ${anime.popularity}*
♦️ *Trailer: ${anime.trailer}*
🌐 *URL: ${anime.url}*
❄ *Description:* ${anime.synopsis}*`
                await Maria.sendMessage(m.chat,{image:{url:anime.picture}, caption:animetxt},{quoted:m})
                }
                break
                
                case 'play':  case 'song': {
if (!text) return reply(`Example : ${prefix + command} anime whatsapp status`)
const Ayushplaymp3 = require('./lib/ytdl2')
const yts = require("youtube-yts")
        const search = await yts(text)
        const anup3k = search.videos[0]
const pl= await Ayushplaymp3.mp3(anup3k.url)
await Maria.sendMessage(m.chat,{
    audio: fs.readFileSync(pl.path),
    fileName: anup3k.title + '.mp3',
    mimetype: 'audio/mp4', ptt: true,
    contextInfo:{
        externalAdReply:{
            title:anup3k.title,
            body: botname,
            thumbnail: await fetchBuffer(pl.meta.image),
            mediaType:2,
            mediaUrl:anup3k.url,
        }

    },
},{quoted:m})
await fs.unlinkSync(pl.path)
}
break

case '':
    if(isCmd){
    if (isBan) return reply(mess.banned)	 			
    if (isBanChat) return reply(mess.bangc)
    Maria.sendMessage(from, { react: { text: "✨" , key: m.key }})

      Mariapic ='https://images5.alphacoders.com/106/1065278.jpg'
    
        
 const needhelpmenu = `Do you need help darling ? Type *${prefix}help* to get my full command list.`

                let buttonMessage = {
                    video:fs.readFileSync( './Assets/Maria.gif' ),
gifPlayback:true,
                    caption: needhelpmenu,  
                  headerType : 4
                }
            Maria.sendMessage(m.chat,buttonMessage,{quoted:m})
                }
break
 
 
////script



            if(isCmd){
          if (isBan) return reply(mess.banned)	 			
          if (isBanChat) return reply(mess.bangc)
          Maria.sendMessage(from, { react: { text: "âŒ", key: m.key }}) 
          reply (`Hey *${pushname}* senpai! this command are not programmed! Type *${prefix}help* to get my full command list!`)
  
      }	 			
  
  
  if (budy.startsWith('=>')) {
  if (!isCreator) return reply(mess.botowner)
  function Return(sul) {
  sat = JSON.stringify(sul, null, 2)
  bang = util.format(sat)
  if (sat == undefined) {
  bang = util.format(sul)
  }
  return reply(bang)
  }
  try {
  reply(util.format(eval(`(async () => { ${budy.slice(3)} })()`)))
  } catch (e) {
  Maria.sendMessage(from, {image:ErrorPic, caption:String(e)}, {quoted:m})
  }
  }
  if (budy.startsWith('>')) {
  if (!isCreator) return reply(mess.botowner)
  try {
  let evaled = await eval(budy.slice(2))
  if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
  await reply(evaled)
  } catch (err) {
  await Maria.sendMessage(from, {image:ErrorPic, caption:String(err)}, {quoted:m})
  }
  }
  
                  
  if (budy.startsWith('$')) {
  if (!isCreator) return replay(mess.botowner)
  exec(budy.slice(2), (err, stdout) => {
  if(err) return Maria.sendMessage(from, {image:ErrorPic, caption:String(err)}, {quoted:m})
  if (stdout) return replayH(stdout)
  })
  }
  
  
  if (isCmd && budy.toLowerCase() != undefined) {
    if (m.chat.endsWith('broadcast')) return
    if (m.isBaileys) return
    let msgs = global.db.database
    if (!(budy.toLowerCase() in msgs)) return
    Maria.copyNForward(m.chat, msgs[budy.toLowerCase()], true)
    }
    }
    }catch (err) {
    Maria.sendMessage(`${ownertag}@s.whatsapp.net`, util.format(err), {quoted:m})
    console.log(err)
    }
    }
  
  
  let file = require.resolve(__filename)
  fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
  })
  
