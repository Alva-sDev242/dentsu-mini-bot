# DENTSU MINI BOT

> WhatsApp × Telegram assistant bot — **by NatsuTech's Dev 🇨🇬**

[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E=20-brightgreen.svg)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc14-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![Dev](https://img.shields.io/badge/Dev-NatsuTech's%20Dev-ff69b4.svg)](https://github.com/Alva-sDev242)

A feminine, fast WhatsApp bot with 400+ commands, paired and managed from Telegram.

## ✨ Features

- 🔗 Pair WhatsApp accounts via Telegram `/pair`
- 💬 400+ WhatsApp commands (download, AI, group, sticker, fun, +18, tools)
- 👮 Anti-link (`delete` / `kick` modes), anti-spam, welcome, goodbye
- 💕 Built-in love-words commands (FR + EN) — she's a bébé bot 🥹
- 🚫 Telegram `/ban` & `/broadcast` for admins
- ⁉️ Reacts to unknown commands so you always know it heard you

## 🚀 Quick start

```bash
npm install
TELEGRAM_BOT_TOKEN=xxxxx npm start
```

Then on Telegram → `/start` → `/pair <your number>`.

## 🚀 Deploy on Render

This bot runs as a **web service** because it serves the pairing page and the
`/health` endpoint. The included `render.yaml` selects Render's Starter plan,
keeps WhatsApp credentials on a persistent disk, and deploys each commit pushed
to the linked branch.

Required Render environment variables:

- `TELEGRAM_BOT_TOKEN` — token from BotFather.
- `NEXORACLE_API_KEY` — optional, used by the `gfx` logo commands.
- `OMDB_API_KEY` — optional, used by movie commands.

The persistent disk is important: without it, a Render restart removes the
WhatsApp pairing sessions and the accounts must be paired again. Render's free
web services sleep after 15 minutes without inbound traffic; the WhatsApp
connection alone does not keep the web service awake. Keep this service on the
Starter plan for continuous operation. If the service was created manually,
confirm its plan and Auto-Deploy setting in the Render Dashboard; syncing
`render.yaml` only updates a Blueprint-managed service.

## Pairing website

The pairing website is served directly by the bot on Render and Railway.

## 🚂 Deploy on Railway

Connect this GitHub repository to Railway and deploy the `main` branch.
`railway.json` configures the Node build, start command, `/health` check, and
automatic restarts. Set these variables in the Railway service:

- `TELEGRAM_BOT_TOKEN` — required for Telegram pairing.
- `NEXORACLE_API_KEY` — optional, used by the `gfx` logo commands.
- `OMDB_API_KEY` — optional, used by movie commands.

Create a Railway Volume and mount it at `/app/auth_info` so WhatsApp sessions
survive redeploys. Volumes are attached in Railway's service settings, not in
`railway.json`. Enable automatic deployments from `main` in the service's
deployment settings.

## 📜 License

[MIT](./LICENSE) — © NatsuTech's Dev

## 🧑‍💻 Dev

- WhatsApp : +242 06 514 10 56 / +242 05 047 10 17
- Telegram : [Dploiement d'un bot](https://t.me/DPLOIEMENT_DUN_BOT2)
- GitHub   : [Alva-sDev242/dentsu-mini-bot](https://github.com/Alva-sDev242/dentsu-mini-bot)

---

> _Made with 💕 by NatsuTech's Dev_
