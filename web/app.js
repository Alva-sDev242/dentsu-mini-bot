(() => {
  const translations = {
    en: {
      menu:"Menu",home:"Home",connect:"Connect WhatsApp",how:"How it works",download:"Download bot",support:"Support & community",contact:"CONTACT DEV",
      eyebrow:"WhatsApp pairing, made simple",heroTitle:"Your bot.<br><em>One secure connection.</em>",heroLead:"Connect your WhatsApp in seconds. Choose the method that feels right: a one-time pairing code or a QR scan.",getStarted:"Get started",howWorks:"See how it works",trustOne:"No WhatsApp password",trustTwo:"Your session stays yours",secureConnection:"SECURE CONNECTION",ready:"READY",connectInSeconds:"Connect in a few simple steps",privateByDesign:"Private by design · No password shared",connectWhatsApp:"Connect WhatsApp",chooseMethod:"Choose code or QR",downloadBot:"Download the bot",fullProjectZip:"Get the project ZIP",deployRailway:"Deploy on Railway",railwayQuick:"Setup guide, step by step",builtFor:"Built for a smoother WhatsApp setup",visitGitHub:"Open GitHub repository",
      backHome:"Home",stepOne:"STEP 01 · CHOOSE A METHOD",chooseTitle:"How would you like to connect?",chooseLead:"Both methods link your WhatsApp to the bot. Pick one to continue.",fastChoice:"FAST & SIMPLE",pairTitle:"Pair with a code",pairDesc:"Enter your number and type the 8-character code into WhatsApp Linked Devices.",usePairCode:"Use pairing code",scanChoice:"SCAN & CONNECT",qrTitle:"Scan a QR code",qrDesc:"Open WhatsApp on your phone, scan the live QR code, and your session will connect.",useQr:"Use QR code",privacyTitle:"Your account stays in your control.",privacyText:"Never share the pairing code or QR image with anyone else.",backMethods:"Connection methods",pairMethodLabel:"PAIRING CODE",pairPageTitle:"Connect with a one-time code.",pairPageLead:"Enter the WhatsApp number you want to link. Use the full international format.",phoneLabel:"WhatsApp phone number",phoneHint:"Country code included · no spaces needed",generateCode:"Generate pairing code",yourCode:"YOUR PAIRING CODE",copyCode:"Copy code",codeNote:"On WhatsApp, open Linked devices → Link a device → Link with phone number.",beforeTitle:"Before you start",codeStep1:"Open WhatsApp on your phone.",codeStep2:"Go to Linked devices.",codeStep3:"Tap Link a device, then choose phone number.",codeStep4:"Enter the code shown on this page.",oneTimeNotice:"The code is temporary. Do not send it to anyone.",qrMethodLabel:"QR SCAN",qrPageTitle:"Scan to connect.",qrPageLead:"Create a private QR code, then scan it from WhatsApp on your phone.",qrPlaceholder:"Your QR code will appear here",qrPlaceholderHint:"It is generated securely for this session",qrNotStarted:"Ready when you are.",generateQr:"Generate secure QR code",scanWithPhone:"Scan with your phone",qrStep1:"Open WhatsApp and tap the menu.",qrStep2:"Select Linked devices.",qrStep3:"Tap Link a device and scan this QR.",qrPrivate:"This QR is private. Only scan it yourself.",projectFiles:"PROJECT FILES",downloadTitle:"Take the bot with you.",downloadLead:"Download the current project source as a ZIP, or open the repository to browse the files.",zipDescription:"Complete project archive · ZIP · from the main branch",downloadZip:"Download project ZIP",browseRepo:"Browse the repository",followDev:"Star the GitHub repository",deployment:"DEPLOYMENT",railwayTitle:"Deploy on Railway.",railwayLead:"The repository includes a Railway configuration. Link GitHub, add the required secret, then deploy.",readyToDeploy:"READY TO DEPLOY",launchProject:"Launch your project",railwayCardText:"Create a Railway project from the GitHub repository and set the Telegram bot token in service variables.",openRailway:"Open Railway deploy",openRepoFirst:"Open the GitHub repository ↗",quickSteps:"Quick setup",railStepOne:"Connect the repository",railStepOneText:"Choose Alva-sDev242/dentsu-mini-bot in Railway.",railStepTwo:"Add the required secret",railStepTwoText:"Set TELEGRAM_BOT_TOKEN in the service variables.",railStepThree:"Keep sessions persistent",railStepThreeText:"Attach a Railway Volume at /app/auth_info.",railStepFour:"Deploy and pair",railStepFourText:"Wait for the /health check, then choose code or QR.",community:"SUPPORT & COMMUNITY",supportTitle:"Need a hand?",supportLead:"Follow the official communities for deployment help, updates and guidance.",waChannel:"WhatsApp channel",updates:"News and updates",tgChannel:"Telegram channel",waGroup:"Official WhatsApp group",askCommunity:"Ask the community",githubDev:"GitHub repository",directHelp:"Need direct help?",messageDev:"Message the developer on WhatsApp.",footerNote:"WhatsApp connection · Your session, your choice",
      phoneInvalid:"Enter a valid international number (8–15 digits).",requesting:"Requesting a secure code…",pairError:"Could not generate a pairing code. Please try again.",copied:"Code copied ✓",copyFailed:"Copy is unavailable. Select the code and copy it manually.",qrStarting:"Preparing a private QR code…",qrWaiting:"Waiting for WhatsApp… keep this page open.",qrConnected:"WhatsApp connected successfully ✓",qrExpired:"This QR expired. Generate a new one.",qrFailed:"QR connection failed. Please try again.",expiredCode:"Code expired. Generate a new one.",
    },
    fr: {
      menu:"Menu",home:"Accueil",connect:"Connecter WhatsApp",how:"Fonctionnement",download:"Télécharger le bot",support:"Support et communauté",contact:"CONTACT DEV",
      eyebrow:"Connexion WhatsApp simplifiée",heroTitle:"Votre bot.<br><em>Une connexion sécurisée.</em>",heroLead:"Connectez WhatsApp en quelques secondes. Choisissez votre méthode : code de jumelage temporaire ou scan QR.",getStarted:"Commencer",howWorks:"Voir le fonctionnement",trustOne:"Aucun mot de passe WhatsApp",trustTwo:"Votre session reste la vôtre",secureConnection:"CONNEXION SÉCURISÉE",ready:"PRÊT",connectInSeconds:"Quelques étapes pour vous connecter",privateByDesign:"Privé par conception · Aucun mot de passe partagé",connectWhatsApp:"Connecter WhatsApp",chooseMethod:"Code ou QR au choix",downloadBot:"Télécharger le bot",fullProjectZip:"Récupérer le projet ZIP",deployRailway:"Déployer sur Railway",railwayQuick:"Guide de configuration",builtFor:"Une configuration WhatsApp plus simple",visitGitHub:"Ouvrir le dépôt GitHub",
      backHome:"Accueil",stepOne:"ÉTAPE 01 · CHOISIR UNE MÉTHODE",chooseTitle:"Comment souhaitez-vous vous connecter ?",chooseLead:"Les deux méthodes associent WhatsApp au bot. Choisissez pour continuer.",fastChoice:"RAPIDE ET SIMPLE",pairTitle:"Jumeler avec un code",pairDesc:"Saisissez votre numéro, puis entrez le code de 8 caractères dans les appareils liés WhatsApp.",usePairCode:"Utiliser un code",scanChoice:"SCAN ET CONNEXION",qrTitle:"Scanner un QR code",qrDesc:"Ouvrez WhatsApp sur votre téléphone, scannez le QR actif et votre session se connectera.",useQr:"Utiliser le QR code",privacyTitle:"Votre compte reste sous votre contrôle.",privacyText:"Ne partagez jamais votre code ni votre QR avec qui que ce soit.",backMethods:"Méthodes de connexion",pairMethodLabel:"CODE DE JUMELAGE",pairPageTitle:"Connectez-vous avec un code temporaire.",pairPageLead:"Saisissez le numéro WhatsApp à associer au format international complet.",phoneLabel:"Numéro WhatsApp",phoneHint:"Indicatif du pays inclus · espaces facultatifs",generateCode:"Générer le code de jumelage",yourCode:"VOTRE CODE DE JUMELAGE",copyCode:"Copier le code",codeNote:"Dans WhatsApp : Appareils connectés → Connecter un appareil → Associer avec un numéro.",beforeTitle:"Avant de commencer",codeStep1:"Ouvrez WhatsApp sur votre téléphone.",codeStep2:"Allez dans Appareils connectés.",codeStep3:"Touchez Connecter un appareil, puis choisissez le numéro.",codeStep4:"Entrez le code affiché sur cette page.",oneTimeNotice:"Le code est temporaire. Ne l’envoyez à personne.",qrMethodLabel:"SCAN QR",qrPageTitle:"Scannez pour vous connecter.",qrPageLead:"Générez un QR privé, puis scannez-le dans WhatsApp sur votre téléphone.",qrPlaceholder:"Votre QR code apparaîtra ici",qrPlaceholderHint:"Il est généré de façon privée pour cette session",qrNotStarted:"Prêt quand vous l’êtes.",generateQr:"Générer un QR code privé",scanWithPhone:"Scannez avec votre téléphone",qrStep1:"Ouvrez WhatsApp et touchez le menu.",qrStep2:"Choisissez Appareils connectés.",qrStep3:"Touchez Connecter un appareil et scannez ce QR.",qrPrivate:"Ce QR est privé. Scannez-le vous-même uniquement.",projectFiles:"FICHIERS DU PROJET",downloadTitle:"Emportez le bot avec vous.",downloadLead:"Téléchargez les sources actuelles du projet en ZIP ou ouvrez le dépôt pour parcourir les fichiers.",zipDescription:"Archive complète du projet · ZIP · branche main",downloadZip:"Télécharger le projet ZIP",browseRepo:"Parcourir le dépôt",followDev:"Mettre une étoile au dépôt",deployment:"DÉPLOIEMENT",railwayTitle:"Déployer sur Railway.",railwayLead:"Le dépôt inclut la configuration Railway. Reliez GitHub, ajoutez le secret requis, puis déployez.",readyToDeploy:"PRÊT À DÉPLOYER",launchProject:"Lancer votre projet",railwayCardText:"Créez un projet Railway depuis le dépôt GitHub et ajoutez le token du bot Telegram dans les variables du service.",openRailway:"Ouvrir le déploiement Railway",openRepoFirst:"Ouvrir le dépôt GitHub ↗",quickSteps:"Configuration rapide",railStepOne:"Relier le dépôt",railStepOneText:"Choisissez Alva-sDev242/dentsu-mini-bot dans Railway.",railStepTwo:"Ajouter le secret requis",railStepTwoText:"Définissez TELEGRAM_BOT_TOKEN dans les variables du service.",railStepThree:"Conserver les sessions",railStepThreeText:"Montez un volume Railway sur /app/auth_info.",railStepFour:"Déployer et jumeler",railStepFourText:"Attendez le contrôle /health, puis choisissez code ou QR.",community:"SUPPORT ET COMMUNAUTÉ",supportTitle:"Besoin d’aide ?",supportLead:"Rejoignez les communautés officielles pour l’aide au déploiement, les mises à jour et les conseils.",waChannel:"Chaîne WhatsApp",updates:"Actualités et mises à jour",tgChannel:"Chaîne Telegram",waGroup:"Groupe WhatsApp officiel",askCommunity:"Poser une question",githubDev:"Dépôt GitHub",directHelp:"Besoin d’aide directe ?",messageDev:"Écrivez au développeur sur WhatsApp.",footerNote:"Connexion WhatsApp · Votre session, votre choix",
      phoneInvalid:"Entrez un numéro international valide (8 à 15 chiffres).",requesting:"Génération du code sécurisé…",pairError:"Impossible de générer le code. Réessayez.",copied:"Code copié ✓",copyFailed:"Copie indisponible. Sélectionnez et copiez le code manuellement.",qrStarting:"Préparation d’un QR privé…",qrWaiting:"En attente de WhatsApp… gardez cette page ouverte.",qrConnected:"WhatsApp est connecté ✓",qrExpired:"Ce QR a expiré. Générez-en un nouveau.",qrFailed:"Échec de la connexion QR. Réessayez.",expiredCode:"Le code a expiré. Générez-en un nouveau."
    }
  };
  const allowedViews = new Set(["home","connect","code","qr","download","guide","support"]);
  const $ = (selector) => document.querySelector(selector);
  let locale = "fr";
  let qrTimer = null;
  let qrSessionId = null;
  function tr(key) { return (translations[locale] && translations[locale][key]) || translations.en[key] || key; }
  function applyLanguage(next) {
    locale = next === "en" ? "en" : "fr";
    document.documentElement.lang = locale;
    document.querySelectorAll("[data-language]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === locale)));
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = tr(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = tr(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = tr(el.dataset.i18nPlaceholder); });
    try { localStorage.setItem("dentsu-locale", locale); } catch {}
  }
  function go(view) {
    const next = allowedViews.has(view) ? view : "home";
    if (location.hash !== "#" + next) history.pushState(null, "", "#" + next);
    showView(next);
    closeMenu();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function showView(view) {
    const next = allowedViews.has(view) ? view : "home";
    document.querySelectorAll("[data-view]").forEach((el) => el.classList.toggle("active", el.dataset.view === next));
    document.title = "dents-mini-bot — " + (next === "home" ? tr("connectWhatsApp") : tr(next === "guide" ? "deployRailway" : next === "support" ? "support" : next === "download" ? "download" : next === "code" ? "pairTitle" : next === "qr" ? "qrTitle" : "connect"));
  }
  function closeMenu() {
    $("#side-menu").classList.remove("open"); $("#menu-shade").classList.remove("open"); $("#menu-toggle").classList.remove("active");
    $("#menu-toggle").setAttribute("aria-expanded","false"); $("#side-menu").setAttribute("aria-hidden","true");
  }
  function openMenu() {
    $("#side-menu").classList.add("open"); $("#menu-shade").classList.add("open"); $("#menu-toggle").classList.add("active");
    $("#menu-toggle").setAttribute("aria-expanded","true"); $("#side-menu").setAttribute("aria-hidden","false");
  }
  document.querySelectorAll("[data-goto]").forEach((button) => button.addEventListener("click", () => go(button.dataset.goto)));
  document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.language)));
  $("#menu-toggle").addEventListener("click", () => $("#side-menu").classList.contains("open") ? closeMenu() : openMenu());
  $("#menu-close").addEventListener("click", closeMenu); $("#menu-shade").addEventListener("click", closeMenu);
  window.addEventListener("hashchange", () => showView(location.hash.slice(1)));
  window.addEventListener("popstate", () => showView(location.hash.slice(1)));
  try { const saved = localStorage.getItem("dentsu-locale"); if (saved === "en" || saved === "fr") locale = saved; } catch {}
  applyLanguage(locale); showView(location.hash.slice(1) || "home");

  const form = $("#pair-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const number = $("#phone").value.replace(/\D/g, "").replace(/^00/, "");
    const status = $("#pair-status"); const button = $("#pair-submit"); const result = $("#pair-result");
    result.hidden = true;
    if (number.length < 8 || number.length > 15) { status.textContent = tr("phoneInvalid"); return; }
    button.disabled = true; button.classList.add("is-loading"); status.textContent = tr("requesting");
    try {
      const response = await fetch("/api/pair", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phoneNumber:number})});
      const data = await response.json();
      if (!response.ok || !data.code) throw new Error(data.error || tr("pairError"));
      $("#pair-code").textContent = data.code; result.hidden = false; status.textContent = "";
      button.querySelector("span").textContent = tr("generateCode");
    } catch (error) { status.textContent = error.message || tr("pairError"); }
    finally { button.disabled = false; button.classList.remove("is-loading"); }
  });
  $("#copy-code").addEventListener("click", async () => {
    const button = $("#copy-code");
    try { await navigator.clipboard.writeText($("#pair-code").textContent); button.textContent = tr("copied"); setTimeout(() => { button.textContent = tr("copyCode"); }, 1600); }
    catch { $("#pair-status").textContent = tr("copyFailed"); }
  });

  const qrButton = $("#start-qr"); const qrState = $("#qr-state"); const qrImage = $("#qr-image"); const qrPlaceholder = $("#qr-placeholder");
  function stopQrPolling() { if (qrTimer) clearInterval(qrTimer); qrTimer = null; }
  function clearQrImage() { qrImage.hidden = true; qrImage.removeAttribute("src"); qrPlaceholder.hidden = false; }
  async function pollQr() {
    if (!qrSessionId) return;
    try {
      const response = await fetch("/api/qr/" + encodeURIComponent(qrSessionId), {cache:"no-store"});
      const data = await response.json();
      if (data.svg) { qrImage.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data.svg); qrImage.hidden = false; qrPlaceholder.hidden = true; qrState.textContent = tr("qrWaiting"); }
      if (data.status === "connected") { stopQrPolling(); clearQrImage(); qrState.textContent = tr("qrConnected"); qrButton.disabled = false; qrButton.querySelector("span").textContent = tr("generateQr"); }
      else if (data.status === "expired") { stopQrPolling(); clearQrImage(); qrState.textContent = tr("qrExpired"); qrButton.disabled = false; qrButton.querySelector("span").textContent = tr("generateQr"); }
      else if (data.status === "error") { stopQrPolling(); clearQrImage(); qrState.textContent = data.error || tr("qrFailed"); qrButton.disabled = false; qrButton.querySelector("span").textContent = tr("generateQr"); }
    } catch { qrState.textContent = tr("qrFailed"); stopQrPolling(); qrButton.disabled = false; qrButton.querySelector("span").textContent = tr("generateQr"); }
  }
  qrButton.addEventListener("click", async () => {
    stopQrPolling(); qrSessionId = null; qrImage.hidden = true; qrImage.removeAttribute("src"); qrPlaceholder.hidden = false;
    qrButton.disabled = true; qrButton.classList.add("is-loading"); qrState.textContent = tr("qrStarting");
    try {
      const response = await fetch("/api/qr", {method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
      const data = await response.json(); if (!response.ok || !data.sessionId) throw new Error(data.error || tr("qrFailed"));
      qrSessionId = data.sessionId; qrState.textContent = tr("qrWaiting"); await pollQr(); qrTimer = setInterval(pollQr, 1500);
    } catch (error) { qrState.textContent = error.message || tr("qrFailed"); qrButton.disabled = false; }
    finally { qrButton.classList.remove("is-loading"); qrButton.querySelector("span").textContent = tr("generateQr"); }
  });
})();