/* समझो भारत — बड़ी न्यूज़ वेबसाइटों की सुर्खियाँ (सिर्फ़ हेडलाइन + स्रोत + लिंक) और खबरों का अपने-आप ताज़ा होना। संस्करण 2.3 */
(function () {
  "use strict";
  var I = window.SB_I18N;
  var STR = {
    hi: { hl_title: "बड़ी वेबसाइटों की सुर्खियाँ", hl_note: "हेडलाइन पर टैप करें, पूरी खबर उसी वेबसाइट पर खुलेगी।", hl_hi: "हिंदी", hl_en: "English", hl_more: "और सुर्खियाँ देखें", hl_empty: "सुर्खियाँ अभी लोड नहीं हो पाईं।" },
    en: { hl_title: "Headlines from top news sites", hl_note: "Tap a headline to read the full story on that website.", hl_hi: "हिंदी", hl_en: "English", hl_more: "Show more headlines", hl_empty: "Headlines could not be loaded right now." },
    bn: { hl_title: "বড় সংবাদ ওয়েবসাইটের শিরোনাম", hl_note: "শিরোনামে ট্যাপ করুন, পুরো খবর সেই ওয়েবসাইটে খুলবে।", hl_hi: "हिंदी", hl_en: "English", hl_more: "আরও শিরোনাম দেখুন", hl_empty: "এখন শিরোনাম লোড হয়নি।" },
    mr: { hl_title: "मोठ्या वेबसाइटवरील ठळक बातम्या", hl_note: "मथळ्यावर टॅप करा, पूर्ण बातमी त्याच वेबसाइटवर उघडेल.", hl_hi: "हिंदी", hl_en: "English", hl_more: "आणखी मथळे पाहा", hl_empty: "मथळे आत्ता लोड झाले नाहीत." },
    te: { hl_title: "పెద్ద వార్తా వెబ్‌సైట్ల ముఖ్యాంశాలు", hl_note: "ముఖ్యాంశంపై నొక్కండి, పూర్తి వార్త ఆ వెబ్‌సైట్‌లో తెరుచుకుంటుంది.", hl_hi: "हिंदी", hl_en: "English", hl_more: "మరిన్ని ముఖ్యాంశాలు చూడండి", hl_empty: "ముఖ్యాంశాలు ఇప్పుడు లోడ్ కాలేదు." },
    ta: { hl_title: "பெரிய செய்தி இணையதளங்களின் தலைப்புச் செய்திகள்", hl_note: "தலைப்பைத் தொடுங்கள், முழுச் செய்தி அந்த இணையதளத்தில் திறக்கும்.", hl_hi: "हिंदी", hl_en: "English", hl_more: "மேலும் தலைப்புகள்", hl_empty: "தலைப்புச் செய்திகள் இப்போது ஏற்றப்படவில்லை." },
    gu: { hl_title: "મોટી ન્યૂઝ વેબસાઇટની હેડલાઇન્સ", hl_note: "હેડલાઇન પર ટૅપ કરો, આખા સમાચાર એ જ વેબસાઇટ પર ખૂલશે.", hl_hi: "हिंदी", hl_en: "English", hl_more: "વધુ હેડલાઇન્સ જુઓ", hl_empty: "હેડલાઇન્સ અત્યારે લોડ થઈ નથી." },
    ur: { hl_title: "بڑی نیوز ویب سائٹس کی سرخیاں", hl_note: "سرخی پر ٹیپ کریں، پوری خبر اسی ویب سائٹ پر کھلے گی۔", hl_hi: "हिंदी", hl_en: "English", hl_more: "مزید سرخیاں دیکھیں", hl_empty: "سرخیاں ابھی لوڈ نہیں ہو سکیں۔" },
    kn: { hl_title: "ದೊಡ್ಡ ಸುದ್ದಿ ವೆಬ್‌ಸೈಟ್‌ಗಳ ಮುಖ್ಯಾಂಶಗಳು", hl_note: "ಮುಖ್ಯಾಂಶದ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ, ಪೂರ್ಣ ಸುದ್ದಿ ಆ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ತೆರೆಯುತ್ತದೆ.", hl_hi: "हिंदी", hl_en: "English", hl_more: "ಇನ್ನಷ್ಟು ಮುಖ್ಯಾಂಶಗಳು", hl_empty: "ಮುಖ್ಯಾಂಶಗಳು ಈಗ ಲೋಡ್ ಆಗಲಿಲ್ಲ." },
    or: { hl_title: "ବଡ଼ ଖବର ୱେବସାଇଟର ମୁଖ୍ୟ ଖବର", hl_note: "ହେଡଲାଇନରେ ଟ୍ୟାପ କରନ୍ତୁ, ପୂରା ଖବର ସେହି ୱେବସାଇଟରେ ଖୋଲିବ।", hl_hi: "हिंदी", hl_en: "English", hl_more: "ଆହୁରି ହେଡଲାଇନ ଦେଖନ୍ତୁ", hl_empty: "ହେଡଲାଇନ ଏବେ ଲୋଡ ହୋଇପାରିଲା ନାହିଁ।" },
    ml: { hl_title: "വലിയ വാർത്താ വെബ്സൈറ്റുകളിലെ തലക്കെട്ടുകൾ", hl_note: "തലക്കെട്ടിൽ ടാപ്പ് ചെയ്യൂ, മുഴുവൻ വാർത്തയും ആ വെബ്സൈറ്റിൽ തുറക്കും.", hl_hi: "हिंदी", hl_en: "English", hl_more: "കൂടുതൽ തലക്കെട്ടുകൾ", hl_empty: "തലക്കെട്ടുകൾ ഇപ്പോൾ ലോഡ് ആയില്ല." },
    pa: { hl_title: "ਵੱਡੀਆਂ ਨਿਊਜ਼ ਵੈੱਬਸਾਈਟਾਂ ਦੀਆਂ ਸੁਰਖੀਆਂ", hl_note: "ਸੁਰਖੀ 'ਤੇ ਟੈਪ ਕਰੋ, ਪੂਰੀ ਖ਼ਬਰ ਉਸੇ ਵੈੱਬਸਾਈਟ 'ਤੇ ਖੁੱਲ੍ਹੇਗੀ।", hl_hi: "हिंदी", hl_en: "English", hl_more: "ਹੋਰ ਸੁਰਖੀਆਂ ਦੇਖੋ", hl_empty: "ਸੁਰਖੀਆਂ ਹੁਣੇ ਲੋਡ ਨਹੀਂ ਹੋਈਆਂ।" }
  };
  Object.keys(STR).forEach(function (l) {
    var t = window.SB_STR[l]; if (!t) return;
    Object.keys(STR[l]).forEach(function (k) { if (!t[k]) t[k] = STR[l][k]; });
  });
  var T = I.t;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function sget(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var box = $("hlBox");
  if (!box) return;
  var HINDI_FIRST = { hi: 1, mr: 1, gu: 1, pa: 1, ur: 1, bn: 1, or: 1 };
  var pick = sget("sb_hl_lang") || (HINDI_FIRST[I.get()] ? "hi" : "en");
  var data = null, showAll = false;
  var SHOW = 8;

  function when(iso) {
    if (!iso) return "";
    var d = new Date(iso); if (isNaN(d)) return "";
    try { return d.toLocaleString(I.get() + "-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); }
    catch (e) { return d.toLocaleString(); }
  }
  /* हर स्रोत से बारी-बारी एक खबर, ताकि एक ही वेबसाइट ऊपर न छा जाए */
  function mix(items) {
    var by = {}, order = [];
    items.forEach(function (x) { if (!by[x.s]) { by[x.s] = []; order.push(x.s); } by[x.s].push(x); });
    var out = [], i = 0, left = true;
    while (left) {
      left = false;
      order.forEach(function (s) { if (by[s][i]) { out.push(by[s][i]); left = true; } });
      i++;
    }
    return out;
  }
  function render() {
    var head = '<div class="section-head hl-head"><h2>' + esc(T("hl_title")) + '</h2></div>' +
      '<div class="chips hl-chips"><button type="button" class="chip' + (pick === "hi" ? " on" : "") + '" data-hl="hi">' + esc(T("hl_hi")) + '</button>' +
      '<button type="button" class="chip' + (pick === "en" ? " on" : "") + '" data-hl="en">' + esc(T("hl_en")) + "</button></div>" +
      '<p class="small hl-note">' + esc(T("hl_note")) + "</p>";
    if (!data || !data.items || !data.items.length) { box.innerHTML = head + '<div class="empty">' + esc(T("hl_empty")) + "</div>"; return; }
    var list = mix(data.items.filter(function (x) { return x.l === pick; }));
    var shown = showAll ? list : list.slice(0, SHOW);
    box.innerHTML = head + '<ol class="hl-list">' + shown.map(function (x) {
      return '<li><a href="' + esc(x.u) + '" target="_blank" rel="noopener nofollow"' + (x.l === "hi" ? ' lang="hi"' : ' lang="en"') + ">" +
        '<span class="hl-t">' + esc(x.t) + '</span><span class="hl-m">' + esc(x.s) + (x.d ? " · " + esc(when(x.d)) : "") + "</span></a></li>";
    }).join("") + "</ol>" +
      (!showAll && list.length > SHOW ? '<button type="button" class="btn btn-ghost2 hl-more" data-hl-more="1">' + esc(T("hl_more")) + "</button>" : "");
  }
  box.addEventListener("click", function (ev) {
    var c = ev.target.closest("[data-hl]");
    if (c) { pick = c.dataset.hl; sset("sb_hl_lang", pick); showAll = false; render(); return; }
    if (ev.target.closest("[data-hl-more]")) { showAll = true; render(); }
  });
  function load() {
    return fetch("data/headlines.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { data = d; sset("sb_hl", d); render(); })
      .catch(function () { if (!data) { data = sget("sb_hl"); render(); } });
  }
  data = sget("sb_hl");
  render();
  load();

  /* ---------- खबरें अपने-आप ताज़ा होना ----------
     ऐप खुला रहे तो हर 10 मिनट में, और ऐप पर लौटने पर (10 मिनट से ज़्यादा हो गए हों तो) नई खबरें चुपचाप लाना।
     लेख पढ़ते समय या सूची में नीचे स्क्रॉल किया हो तो सूची नहीं बदलती, ताकि पढ़ने में रुकावट न हो। */
  var EVERY = 10 * 60 * 1000;
  var last = Date.now();
  var rb = $("refreshBtn");
  if (rb) rb.addEventListener("click", function () { last = Date.now(); load(); });
  function canRefresh() {
    var news = $("tab-news"), reader = $("reader");
    return navigator.onLine && document.visibilityState === "visible" &&
      news && news.classList.contains("active") && (!reader || reader.hidden) && window.scrollY < 300 &&
      !($("searchInput") && $("searchInput").value);
  }
  function tick(force) {
    if (!force && Date.now() - last < EVERY) return;
    if (canRefresh() && rb) rb.click(); // वही काम जो ऊपर का ताज़ा करें बटन करता है (उसमें load() भी शामिल है)
    else { load(); last = Date.now(); }
  }
  setInterval(function () { tick(false); }, 60 * 1000);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") tick(false); });
  window.addEventListener("online", function () { tick(true); });
})();
