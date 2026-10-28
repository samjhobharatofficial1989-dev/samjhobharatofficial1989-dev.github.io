/* समझो भारत — "याद रखने वाला" हिस्सा (Personal memory)
   सब कुछ सिर्फ़ पढ़ने वाले के फ़ोन में (localStorage) रहता है। कोई login नहीं, कहीं भेजा नहीं जाता।
   Everything stays on the user's phone only. */
window.SBP = (function () {
  "use strict";
  var K = { prof: "sb_profile", int: "sb_interest", read: "sb_read", prog: "sb_progress", chip: "sb_chip", onb: "sb_onb_done" };
  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- विषय पहचानना (रंगीन card और पसंद, दोनों के लिए) ---------- */
  var THEMES = [
    { re: /पैसा|finance|निवेश|money|बैंक|टैक्स|tax|ipo|शेयर/i, c: "money", i: "₹" },
    { re: /cyber|साइबर|फ्रॉड|फ़्रॉड|fraud|scam|ठगी/i, c: "cyber", i: "🛡️" },
    { re: /technology|tech| ai |मोबाइल|whatsapp/i, c: "tech", i: "💻" },
    { re: /सरकारी|yojana|योजना|scheme/i, c: "govt", i: "🏛️" },
    { re: /राजनीति|politic|चुनाव/i, c: "poli", i: "🗳️" },
    { re: /रक्षा|defen|सेना/i, c: "def", i: "🎖️" },
    { re: /इतिहास|history/i, c: "hist", i: "📜" },
    { re: /काम की|जानकारी|health|स्वास्थ्य/i, c: "info", i: "💡" }
  ];
  function theme(p) {
    var src = " " + ((p && p.labels) || []).join(" ") + " " + ((p && p.title) || "") + " ";
    for (var k = 0; k < THEMES.length; k++) if (THEMES[k].re.test(src)) return THEMES[k];
    return { c: "news", i: "📰" };
  }
  /* सेक्शन ↔ विषय */
  var SEC2TH = { news: "news", yojana: "govt", paisa: "money", tech: "tech", rajniti: "poli" };

  /* ---------- प्रोफ़ाइल (पहली बार पूछी गई बातें) ---------- */
  function profile() { return get(K.prof) || {}; }
  function saveProfile(p) { p.at = Date.now(); set(K.prof, p); }

  /* ---------- पसंद सीखना: जो विषय ज़्यादा पढ़े, वह ऊपर ---------- */
  function interest() { return get(K.int) || {}; }
  function track(p) {
    if (!p) return;
    var t = theme(p).c, s = interest();
    Object.keys(s).forEach(function (k) { s[k] = +(s[k] * 0.97).toFixed(3); }); // पुरानी पसंद धीरे-धीरे हल्की
    s[t] = (s[t] || 0) + 1;
    if (t === "cyber") s.tech = (s.tech || 0) + 0.3;
    set(K.int, s);
    var r = get(K.read) || [];
    if (r.indexOf(p.id) < 0) { r.unshift(p.id); set(K.read, r.slice(0, 300)); }
  }
  function isRead(p) { return (get(K.read) || []).indexOf(p.id) >= 0; }
  function score(p) {
    var t = theme(p).c, s = interest(), pr = profile(), w = s[t] || 0;
    (pr.interests || []).forEach(function (sec) { if (SEC2TH[sec] === t || (sec === "tech" && t === "cyber")) w += 3; });
    (pr.roles || []).forEach(function (r) {
      if ((r === "govt" || r === "senior") && (t === "money" || t === "govt")) w += 1;
      if ((r === "farmer" || r === "home") && t === "govt") w += 1.5;
      if ((r === "biz" || r === "job") && t === "money") w += 1.5;
      if (r === "student" && (t === "tech" || t === "govt")) w += 1;
    });
    var ageDays = p.date ? (Date.now() - Date.parse(p.date)) / 86400000 : 30;
    var fresh = Math.max(0, 3 - ageDays) * 1.5; // नई खबर को बढ़त
    return w + fresh - (isRead(p) ? 6 : 0);
  }
  function forYou(pool, n) {
    return pool.slice().sort(function (a, b) { return score(b) - score(a); }).slice(0, n || 20);
  }
  function hasTaste() {
    var pr = profile();
    return !!((pr.interests && pr.interests.length) || (pr.roles && pr.roles.length) || Object.keys(interest()).length >= 2);
  }

  /* ---------- पढ़ना जारी रखें ---------- */
  function saveProgress(p, pct) {
    if (!p) return;
    if (pct >= 0.9) { var g = get(K.prog); if (g && g.id === p.id) localStorage.removeItem(K.prog); return; }
    if (pct < 0.08) return;
    set(K.prog, { id: p.id, pct: pct, at: Date.now(), post: { id: p.id, pid: p.pid, title: p.title, url: p.url, date: p.date, labels: p.labels, img: p.img, html: p.html } });
  }
  function progress() {
    var g = get(K.prog);
    if (!g || Date.now() - g.at > 7 * 86400000) return null;
    return g;
  }
  function clearProgress() { try { localStorage.removeItem(K.prog); } catch (e) {} }

  /* ---------- आख़िरी जगह याद रखना ---------- */
  function lastChip() { return get(K.chip); }
  function setChip(k) { set(K.chip, k); }

  /* ---------- सब मिटाना (Privacy) ---------- */
  function wipe() {
    try {
      Object.keys(localStorage).forEach(function (x) {
        if ([K.prof, K.int, K.read, K.prog, K.chip, K.onb, "sb_tab", "sb_calc_last"].indexOf(x) >= 0) localStorage.removeItem(x);
      });
    } catch (e) {}
  }

  return {
    theme: theme, profile: profile, saveProfile: saveProfile, track: track, isRead: isRead, forYou: forYou, hasTaste: hasTaste,
    saveProgress: saveProgress, progress: progress, clearProgress: clearProgress, lastChip: lastChip, setChip: setChip,
    onbDone: function () { return !!get(K.onb); }, setOnbDone: function () { set(K.onb, 1); }, wipe: wipe, get: get, set: set
  };
})();

/* ---------- इस हिस्से के शब्द (हिंदी + English; बाकी भाषाओं में अभी हिंदी दिखेगी) ---------- */
(function () {
  var X = {
    hi: {
      sec_foryou: "✨ आपके लिए", foryou_head: "आपके लिए चुनी खबरें", foryou_note: "आप जो पढ़ते हैं, उसी के हिसाब से। सब कुछ सिर्फ़ आपके फ़ोन में रहता है।",
      cont_read: "पढ़ना जारी रखें", cont_close: "हटाएँ", read_mark: "पढ़ा",
      onb_welcome: "समझो भारत में आपका स्वागत है", onb_lang: "अपनी भाषा चुनें", onb_about: "आपके बारे में (ताकि आपके काम की खबरें पहले दिखें)",
      onb_roles: "आप क्या करते हैं?", onb_gender: "आप", onb_state: "आपका राज्य", onb_int: "किन विषयों में रुचि है?",
      onb_go: "शुरू करें", onb_skip: "अभी नहीं", onb_priv: "🔒 ये जवाब सिर्फ़ आपके फ़ोन में रहते हैं, कहीं भेजे नहीं जाते।",
      r_job: "प्राइवेट नौकरी", r_govt: "सरकारी कर्मचारी", r_biz: "व्यापार / दुकान", r_farmer: "किसान", r_student: "छात्र / तैयारी", r_home: "गृहिणी", r_senior: "वरिष्ठ नागरिक (60+)",
      g_f: "महिला", g_m: "पुरुष", g_x: "न बताएँ", st_none: "— चुनें —",
      taste_ask: "अपनी पसंद बताइए, ताकि आपके काम की खबरें पहले आएँ।", taste_btn: "पसंद चुनें",
      my_head: "मेरी पसंद और डेटा", my_edit: "पसंद बदलें", my_wipe: "मेरी पसंद और पढ़ने का इतिहास मिटाएँ", my_wiped: "मिटा दिया गया।",
      my_note: "ऐप याद रखता है कि आपने क्या पढ़ा, कौन-सा टैब और कैलकुलेटर इस्तेमाल किया, ताकि अगली बार वहीं से शुरू हो। यह सब सिर्फ़ आपके फ़ोन में रहता है।",
      help_head: "📞 ज़रूरी हेल्पलाइन", help_note: "नंबर दबाते ही कॉल लगेगी।",
      h_cyber: "साइबर ठगी की शिकायत", h_emerg: "आपातकाल (पुलिस, एंबुलेंस, फ़ायर)", h_women: "महिला हेल्पलाइन", h_child: "चाइल्ड हेल्पलाइन",
      cert_head: "अपना प्रमाणपत्र पाएँ", cert_name: "प्रमाणपत्र पर आपका नाम", cert_make: "प्रमाणपत्र बनाएँ", cert_dl: "डाउनलोड करें",
      cert_title: "प्रमाणपत्र", cert_line1: "यह प्रमाणित किया जाता है कि", cert_line2: "ने समझो भारत का आज का GK क्विज़ खेलकर इतने अंक पाए",
      cert_date: "तारीख़", cert_foot: "Samjho Bharat Daily Quiz • यह प्रोत्साहन प्रमाणपत्र है",
      h_elder: "बुज़ुर्गों की हेल्पलाइन (Elderline)", h_consumer: "उपभोक्ता हेल्पलाइन (NCH)", h_rail: "रेल मदद", h_amb: "एंबुलेंस", h_tele: "टेली-मानस (मानसिक स्वास्थ्य)"
    },
    en: {
      sec_foryou: "✨ For you", foryou_head: "Picked for you", foryou_note: "Based on what you read. Everything stays on your phone.",
      cont_read: "Continue reading", cont_close: "Dismiss", read_mark: "Read",
      onb_welcome: "Welcome to Samjho Bharat", onb_lang: "Choose your language", onb_about: "About you (so useful news shows first)",
      onb_roles: "What do you do?", onb_gender: "You are", onb_state: "Your state", onb_int: "Topics you like",
      onb_go: "Start", onb_skip: "Not now", onb_priv: "🔒 These answers stay only on your phone. Nothing is sent anywhere.",
      r_job: "Private job", r_govt: "Govt employee", r_biz: "Business / shop", r_farmer: "Farmer", r_student: "Student / exam prep", r_home: "Homemaker", r_senior: "Senior citizen (60+)",
      g_f: "Female", g_m: "Male", g_x: "Prefer not to say", st_none: "— Select —",
      taste_ask: "Tell us what you like, so useful news shows first.", taste_btn: "Choose",
      my_head: "My choices and data", my_edit: "Change choices", my_wipe: "Delete my choices and reading history", my_wiped: "Deleted.",
      my_note: "The app remembers what you read and which tab and calculator you used, so it opens where you left off. All of this stays on your phone.",
      help_head: "📞 Important helplines", help_note: "Tap a number to call.",
      h_cyber: "Cyber fraud complaint", h_emerg: "Emergency (police, ambulance, fire)", h_women: "Women helpline", h_child: "Child helpline",
      cert_head: "Get your certificate", cert_name: "Your name on the certificate", cert_make: "Make certificate", cert_dl: "Download",
      cert_title: "Certificate", cert_line1: "This is to certify that", cert_line2: "played today's Samjho Bharat GK quiz and scored",
      cert_date: "Date", cert_foot: "Samjho Bharat Daily Quiz • Certificate of encouragement",
      h_elder: "Elderline (senior citizens)", h_consumer: "Consumer helpline (NCH)", h_rail: "Rail Madad", h_amb: "Ambulance", h_tele: "Tele-MANAS (mental health)"
    }
  };
  Object.keys(X).forEach(function (l) { var t = window.SB_STR[l]; if (!t) return; Object.keys(X[l]).forEach(function (k) { if (!t[k]) t[k] = X[l][k]; }); });
})();
