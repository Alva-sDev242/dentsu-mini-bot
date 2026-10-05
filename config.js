/*
┏━━━━━━━━━━━━━━━┓
┃  DENTSU MINI BOT
┣━━━━━━━━━━━━━━━┛
┃whatsapp : +242065141056
┃owner : DENTSU MINI BOT
┃Dev : NatsuTech's Dev 🇨🇬
┗━━━━━━━━━━━━━━━┛
*/

const path = require("path");

module.exports = {
  BOT_NAME: "DENTSU MINI BOT",
  VERSION: "V7.6.0",
  DEV: "NatsuTech's Dev 🇨🇬",
  PREFIX: ".",

  TELEGRAM_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  NEXORACLE_API_KEY: process.env.NEXORACLE_API_KEY || "",
  OMDB_API_KEY: process.env.OMDB_API_KEY || "",

  MENU_IMAGE: path.join(__dirname, "assets", "dentsu-mini-bot-avatar.png"),
  MENU_IMAGE_FALLBACK: "",

  OWNERS: ["242065141056", "242050471017"],
  TELEGRAM_ADMINS: [6405611529, 8316170511],

  // Quatre newsletters suivies automatiquement à chaque connexion WhatsApp.
  NEWSLETTERS: [
    "120363423640959729@newsletter",
    "120363373387302754@newsletter",
    "120363425458450099@newsletter",
    "120363408953987969@newsletter",
  ],

  LINKS: {
    whatsappGroup: "https://chat.whatsapp.com/FwJDxAdCgeCGWqJiTv68eF",
    whatsappChannel: "https://whatsapp.com/channel/0029VbC1s7fFnSz1YhZYc01h",
    telegramChannel: "https://t.me/DPLOIEMENT_DUN_BOT2",
    telegramBot: process.env.TELEGRAM_BOT_URL || "https://t.me/DPLOIEMENT_DUN_BOT2",
    webPairing: process.env.WEB_PAIRING_URL || process.env.RENDER_EXTERNAL_URL || (process.env.RAILWAY_PUBLIC_DOMAIN && "https://" + process.env.RAILWAY_PUBLIC_DOMAIN) || "https://dentsu-mini-bot.onrender.com",
  },

  // ✨ Réponses simples (pas de "Message via la publicité").
  // On laisse contextInfo VIDE — pas d'externalAdReply ni de forwardedNewsletter.
  contextInfo: {},
};
