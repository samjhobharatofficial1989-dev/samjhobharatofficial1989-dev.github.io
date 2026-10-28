/* समझो भारत — चरण 4: आज की 5 बातें, Scam Alert, ज़रूरी तारीख़ें + याद दिलाना, काम की गाइड
   Data: data/scams.json, data/dates.json, data/guides.json (सरकारी स्रोतों से मिलाई गई जानकारी)
   सब कुछ फ़ोन में ही (localStorage) रहता है; कोई लॉगिन या सर्वर नहीं। */
(function () {
  "use strict";
  var I = window.SB_I18N, T = I.t, P = window.SBP, TL = window.SB_TOOLS, C = window.SB_CONFIG;
  var $ = function (id) { return document.getElementById(id); };
  var esc = TL.esc;
  var ls = {
    get: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- शब्द (हिंदी + English) ---------- */
  (function () {
    var X = {
      hi: {
        tool_scam: "Scam Alert", tool_scam_s: "ठगी के नए तरीके, पहचान और पैसा कटे तो पहले घंटे में क्या करें",
        tool_dates: "ज़रूरी तारीख़ें", tool_dates_s: "ITR, जीवन प्रमाण, PPF जैसी आख़िरी तारीख़ें, याद दिलाने के साथ",
        tool_guides: "काम की गाइड", tool_guides_s: "बैंक, बीमा, उपभोक्ता शिकायत, RTI, PF और नॉमिनी: सही रास्ता",
        tool_yojana_s: "कुछ सवालों से जानें कौन-सी सरकारी योजना आपके काम की है",
        t5_head: "आज की 5 बातें", t5_care: "आज की सावधानी", t5_share_head: "आज की 5 बातें (समझो भारत):", t5_hide: "छोटा करें", t5_show: "खोलें",
        sc_rules: "ये 6 बातें हमेशा याद रखें", sc_types: "ठगी के आम तरीके", sc_how: "कैसे होता है", sc_flag: "पहचान", sc_do: "क्या करें", sc_src: "स्रोत",
        sc_call: "1930 पर कॉल करें", sc_share_head: "ठगी से बचने के 6 नियम (समझो भारत):", sc_links: "ज़रूरी वेबसाइट",
        dt_mine: "मेरे लिए", dt_all: "सभी", dt_today: "आज आख़िरी दिन", dt_tom: "कल आख़िरी दिन", dt_left: "{n} दिन बाकी", dt_from: "{n} से शुरू",
        dt_remind: "याद दिलाएँ", dt_reminding: "याद दिलाऊँगा", dt_cal: "कैलेंडर में जोड़ें", dt_unsure: "तारीख़ बदल सकती है, आधिकारिक वेबसाइट पर पक्का करें।",
        dt_none: "आपकी चुनी हुई जानकारी के हिसाब से अभी कोई तारीख़ नहीं। 'सभी' दबाकर पूरी सूची देखें।",
        dt_own: "मेरी अपनी तारीख़ें", dt_own_note: "बीमा रिन्यूअल, FASTag पास, गाड़ी का PUC, किस्त जैसी तारीख़ें खुद जोड़ें।",
        dt_own_t: "किस बात की याद?", dt_own_d: "तारीख़", dt_add: "जोड़ें", dt_del: "हटाएँ",
        dt_how: "ऐप खुलने पर 7 दिन पहले से याद दिलाएगा। सूचना (notification) चालू हो तो फ़ोन पर भी संदेश आएगा। सबसे पक्का तरीका: 'कैलेंडर में जोड़ें'।",
        rm_banner: "याद दिलाना", rm_see: "देखें", rm_ok: "ठीक है",
        gd_intro: "जब कहीं सुनवाई न हो, तो ये सरकारी रास्ते हैं। ज़्यादातर में कोई फ़ीस या वकील नहीं लगता।"
      },
      en: {
        tool_scam: "Scam Alert", tool_scam_s: "Latest frauds, warning signs, and what to do in the first hour",
        tool_dates: "Important dates", tool_dates_s: "ITR, life certificate, PPF and other deadlines, with reminders",
        tool_guides: "Useful guides", tool_guides_s: "Bank, insurance, consumer complaints, RTI, PF, nominees",
        t5_head: "Today's 5 points", t5_care: "Today's caution", t5_share_head: "Today's 5 points (Samjho Bharat):", t5_hide: "Collapse", t5_show: "Open",
        sc_rules: "Always remember these 6 rules", sc_types: "Common frauds", sc_how: "How it works", sc_flag: "Warning sign", sc_do: "What to do", sc_src: "Source",
        sc_call: "Call 1930", sc_share_head: "6 rules to stay safe from fraud (Samjho Bharat):", sc_links: "Useful websites",
        dt_mine: "For me", dt_all: "All", dt_today: "Last day today", dt_tom: "Last day tomorrow", dt_left: "{n} days left", dt_from: "Starts {n}",
        dt_remind: "Remind me", dt_reminding: "Reminder on", dt_cal: "Add to calendar", dt_unsure: "Date may change. Please confirm on the official website.",
        dt_none: "No dates match your choices right now. Tap 'All' to see the full list.",
        dt_own: "My own dates", dt_own_note: "Add your own dates: insurance renewal, FASTag pass, PUC, loan EMI.",
        dt_own_t: "Remind me about?", dt_own_d: "Date", dt_add: "Add", dt_del: "Remove",
        dt_how: "The app reminds you from 7 days before, when you open it. With notifications on, your phone also gets a message. 'Add to calendar' is the surest way.",
        rm_banner: "Reminder", rm_see: "See", rm_ok: "OK",
        gd_intro: "When nobody listens, these official routes help. Most need no fee or lawyer."
      }
    };
    Object.keys(X).forEach(function (l) { var t = window.SB_STR[l]; if (!t) return; Object.keys(X[l]).forEach(function (k) { t[k] = t[k] && l !== "hi" && l !== "en" ? t[k] : X[l][k]; }); });
  })();
  TL.render(); // नए औज़ारों के नाम के साथ बटन दोबारा बनाएँ

  /* ---------- तारीख़ों के छोटे काम ---------- */
  function ymd(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  var TODAY = ymd(new Date());
  function daysTo(s) { var a = new Date(TODAY + "T00:00:00"), b = new Date(s + "T00:00:00"); return Math.round((b - a) / 864e5); }
  function nice(s) { try { return new Date(s + "T00:00:00").toLocaleDateString(I.get() + "-IN", { day: "numeric", month: "long", year: "numeric" }); } catch (e) { return s; } }
  function dayNo() { return Math.floor(new Date(TODAY + "T00:00:00").getTime() / 864e5); }
  function share(txt) {
    txt += "\n\n" + T("tagline") + "\n📲 " + C.appShareUrl;
    if (navigator.share) navigator.share({ text: txt }).catch(function () {}); else window.open("https://wa.me/?text=" + encodeURIComponent(txt), "_blank");
  }

  /* =========================================================
     1. आज की 5 बातें (खबरें टैब में सबसे ऊपर)
     4 ताज़ा खबरें + 1 आज की सावधानी (हर दिन अलग)
     ========================================================= */
  var scamsData = null;
  function today5() {
    if (!window.SBA || !$("chips")) return;
    var pool = window.SBA.pool().filter(function (p) { return p.labels.indexOf(C.gyanLabel) < 0; });
    var now = Date.now();
    var fresh = pool.filter(function (p) { return p.date && now - new Date(p.date).getTime() < 36 * 36e5; });
    var list = fresh.slice(0, 4);
    if (list.length < 4) pool.forEach(function (p) { if (list.length < 4 && list.indexOf(p) < 0) list.push(p); });
    var box = $("today5");
    if (!list.length) { if (box) box.hidden = true; return; }
    if (!box) { $("chips").insertAdjacentHTML("beforebegin", '<section id="today5" class="t5"></section>'); box = $("today5"); }
    box.hidden = false;
    var closed = ls.get("sb_t5_closed") === TODAY;
    var care = scamsData && scamsData.items.length ? scamsData.items[dayNo() % scamsData.items.length] : null;
    var html = '<div class="t5-head"><h2>📰 ' + esc(T("t5_head")) + ' <small>' + esc(nice(TODAY)) + '</small></h2><button type="button" class="t5-tg" data-t5tg="1" aria-expanded="' + !closed + '">' +
      esc(closed ? T("t5_show") : T("t5_hide")) + "</button></div>";
    if (!closed) {
      html += "<ol>" + list.map(function (p, i) {
        return '<li class="' + (P.isRead(p) ? "isread" : "") + '"><button type="button" data-t5="' + i + '">' + esc(window.SBA.tr(p).title) + "</button></li>";
      }).join("");
      if (care) html += '<li class="t5-care"><button type="button" data-tool="scam"><b>🚨 ' + esc(T("t5_care")) + ":</b> " + esc(care.title) + " — " + esc(care.flag) + "</button></li>";
      html += '</ol><button type="button" class="btn btn-sm btn-wa t5-share" data-t5share="1">📤 ' + esc(T("share_btn")) + "</button>";
    }
    box.innerHTML = html;
    box._list = list; box._care = care;
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-t5]"), box = $("today5");
    if (b && box && box._list) { window.SBA.open(box._list[+b.dataset.t5]); return; }
    if (ev.target.closest("[data-t5tg]")) { ls.set("sb_t5_closed", ls.get("sb_t5_closed") === TODAY ? "" : TODAY); today5(); return; }
    if (ev.target.closest("[data-t5share]") && box) {
      var txt = T("t5_share_head") + "\n" + box._list.map(function (p, i) { return (i + 1) + ". " + window.SBA.tr(p).title; }).join("\n");
      if (box._care) txt += "\n5. 🚨 " + box._care.title + ": " + box._care.do;
      share(txt);
    }
  });

  /* =========================================================
     2. Scam Alert
     ========================================================= */
  function openScam() {
    TL.panel(T("tool_scam"), '<div class="skeleton"></div>');
    TL.load("scams").then(function (d) {
      scamsData = d;
      var fa = d.firstaid;
      var html = '<div class="sc-first"><h3>🆘 ' + esc(fa.title) + "</h3><ol>" + fa.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
        '</ol><a class="btn btn-call" href="tel:1930">📞 ' + esc(T("sc_call")) + "</a></div>" +
        '<p class="tipline">ℹ️ ' + esc(d.nomoney) + "</p>" +
        '<h3 class="wg">✅ ' + esc(T("sc_rules")) + '</h3><ul class="sc-rules">' + d.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
        '<button type="button" class="btn btn-sm btn-wa" id="scShare">📤 ' + esc(T("share_btn")) + "</button>" +
        '<h3 class="wg">⚠️ ' + esc(T("sc_types")) + "</h3>" +
        d.items.map(function (x) {
          return '<details class="scard sc-item" id="sc-' + esc(x.id) + '"><summary><b>' + esc(x.icon + " " + x.title) + '</b><span class="small">' + esc(x.flag) + "</span></summary>" +
            "<h4>" + esc(T("sc_how")) + "</h4><p>" + esc(x.how) + "</p><h4>" + esc(T("sc_flag")) + "</h4><p>" + esc(x.flag) + "</p>" +
            '<p class="tipline">👉 <b>' + esc(T("sc_do")) + ":</b> " + esc(x.do) + '</p><p class="small">' + esc(T("sc_src")) + ": " + esc(x.src) + "</p></details>";
        }).join("") +
        '<p class="small">📉 ' + esc(d.stat) + "</p>" +
        '<h3 class="wg">🔗 ' + esc(T("sc_links")) + "</h3>" + d.links.map(function (l) {
          return '<a class="btn btn-sm btn-ghost2 lnk" href="' + esc(l.u) + '" target="_blank" rel="noopener">' + esc(l.t) + "</a>";
        }).join(" ") + '<p class="small">' + esc(T("data_checked", d.verified_on)) + "</p>";
      $("toolBody").innerHTML = html;
      $("scShare").onclick = function () { share(T("sc_share_head") + "\n" + d.rules.map(function (r) { return "✅ " + r; }).join("\n") + "\n\n🆘 1930 | cybercrime.gov.in"); };
      var care = d.items[dayNo() % d.items.length], el = $("sc-" + care.id); if (el) el.open = true; // आज की सावधानी खुली रहे
    }).catch(function () { $("toolBody").innerHTML = '<div class="empty">' + esc(T("load_fail")) + "</div>"; });
  }

  /* =========================================================
     3. ज़रूरी तारीख़ें + याद दिलाना
     ========================================================= */
  var REM = "sb_rem"; // {id: {t, d, from?, own?}}
  function rems() { return ls.get(REM, {}); }
  function saveRems(r) { ls.set(REM, r); }
  function isMine(x) {
    var pr = P.profile(), roles = pr.roles || [];
    if (x.state && pr.state && x.state !== pr.state) return false;
    if (x.tags.indexOf("all") >= 0) return true;
    return x.tags.some(function (t) { return roles.indexOf(t) >= 0; });
  }
  function badge(x) {
    var n = daysTo(x.date);
    if (x.from && daysTo(x.from) > 0) return '<span class="dt-b">' + esc(T("dt_from", nice(x.from))) + "</span>";
    var cls = n <= 7 ? " hot" : "";
    return '<span class="dt-b' + cls + '">' + esc(n === 0 ? T("dt_today") : n === 1 ? T("dt_tom") : T("dt_left", n)) + "</span>";
  }
  function calUrl(x) {
    var d0 = (x.from || x.date).replace(/-/g, ""), e = new Date(x.date + "T00:00:00"); e.setDate(e.getDate() + 1);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(x.title) +
      "&dates=" + d0 + "/" + ymd(e).replace(/-/g, "") + "&details=" + encodeURIComponent((x.note || "") + "\n— " + C.appShareUrl);
  }
  var dtData = null, dtMode = null;
  function dateCard(x, own) {
    var on = !!rems()[x.id];
    return '<div class="dcard' + (daysTo(x.date) <= 7 ? " soon" : "") + '"><div class="dc-top"><span class="dc-date">' + esc(nice(x.date)) + "</span>" + badge(x) + "</div>" +
      "<b>" + esc(x.title) + "</b>" + (x.who ? '<span class="small">👤 ' + esc(x.who) + "</span>" : "") +
      (x.note ? "<p>" + esc(x.note) + "</p>" : "") + (x.sure === 0 ? '<p class="small warn">⚠️ ' + esc(T("dt_unsure")) + "</p>" : "") +
      '<div class="dc-btns">' + (own ? '<button type="button" class="btn btn-sm btn-ghost2" data-rdel="' + esc(x.id) + '">🗑️ ' + esc(T("dt_del")) + "</button>"
        : '<button type="button" class="btn btn-sm' + (on ? " on" : " btn-ghost2") + '" data-rem="' + esc(x.id) + '">🔔 ' + esc(on ? T("dt_reminding") : T("dt_remind")) + "</button>") +
      '<a class="btn btn-sm btn-ghost2" href="' + esc(calUrl(x)) + '" target="_blank" rel="noopener">📅 ' + esc(T("dt_cal")) + "</a>" +
      (x.url ? '<a class="btn btn-sm btn-ghost2" href="' + esc(x.url) + '" target="_blank" rel="noopener">🔗 ' + esc(T("yf_site")) + "</a>" : "") + "</div></div>";
  }
  function renderDates() {
    var d = dtData; if (!d || !$("dtList")) return;
    var up = d.items.filter(function (x) { return daysTo(x.date) >= 0; });
    var list = dtMode === "mine" ? up.filter(isMine) : up;
    $("dtMode").querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.dataset.dm === dtMode); });
    $("dtList").innerHTML = list.length ? list.map(function (x) { return dateCard(x, false); }).join("") : '<div class="empty">' + esc(T("dt_none")) + "</div>";
    var r = rems(), own = Object.keys(r).filter(function (k) { return r[k].own && daysTo(r[k].d) >= 0; })
      .map(function (k) { return { id: k, date: r[k].d, title: r[k].t }; }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    $("dtOwn").innerHTML = own.map(function (x) { return dateCard(x, true); }).join("");
  }
  function openDates() {
    TL.panel(T("tool_dates"), '<div class="skeleton"></div>');
    TL.load("dates").then(function (d) {
      dtData = d;
      if (!dtMode) dtMode = ls.get("sb_dt_mode", (P.profile().roles || []).length ? "mine" : "all");
      $("toolBody").innerHTML = '<p class="small">' + esc(T("dt_how")) + "</p>" +
        '<div class="chips" id="dtMode"><button type="button" class="chip" data-dm="mine">' + esc(T("dt_mine")) + '</button><button type="button" class="chip" data-dm="all">' + esc(T("dt_all")) + "</button></div>" +
        '<div id="dtList"></div><h3 class="wg">📌 ' + esc(T("dt_own")) + '</h3><p class="small">' + esc(T("dt_own_note")) + "</p>" +
        '<form id="dtForm" class="dt-form"><input id="dtT" maxlength="80" required placeholder="' + esc(T("dt_own_t")) + '"><input id="dtD" type="date" required min="' + TODAY + '" aria-label="' + esc(T("dt_own_d")) + '">' +
        '<button class="btn btn-sm" type="submit">➕ ' + esc(T("dt_add")) + '</button></form><div id="dtOwn"></div>' +
        '<p class="small">' + esc(d.note) + "</p>" + '<p class="small">' + esc(T("data_checked", d.verified_on)) + "</p>";
      renderDates();
      $("dtForm").addEventListener("submit", function (ev) {
        ev.preventDefault();
        var t = $("dtT").value.trim(), dd = $("dtD").value; if (!t || !dd) return;
        var r = rems(); r["own_" + Date.now()] = { t: t, d: dd, own: 1 }; saveRems(r);
        $("dtT").value = ""; $("dtD").value = ""; askNotif(); renderDates(); checkDue();
      });
    }).catch(function () { $("toolBody").innerHTML = '<div class="empty">' + esc(T("load_fail")) + "</div>"; });
  }
  function askNotif() { try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission(); } catch (e) {} }
  document.addEventListener("click", function (ev) {
    var m = ev.target.closest("[data-dm]");
    if (m) { dtMode = m.dataset.dm; ls.set("sb_dt_mode", dtMode); renderDates(); return; }
    var b = ev.target.closest("[data-rem]");
    if (b && dtData) {
      var r = rems(), id = b.dataset.rem, x = dtData.items.filter(function (i) { return i.id === id; })[0];
      if (r[id]) delete r[id]; else if (x) { r[id] = { t: x.title, d: x.date, from: x.from || null }; askNotif(); }
      saveRems(r); renderDates(); checkDue(); return;
    }
    var del = ev.target.closest("[data-rdel]");
    if (del) { var r2 = rems(); delete r2[del.dataset.rdel]; saveRems(r2); renderDates(); checkDue(); return; }
    if (ev.target.closest("[data-rmok]")) { ls.set("sb_rem_ok", TODAY); var bn = $("remBanner"); if (bn) bn.hidden = true; return; }
    if (ev.target.closest("[data-rmsee]")) { openDates(); }
  });
  /* ऐप खुलते ही: 7 दिन के अंदर वाली याद दिलाने वाली तारीख़ें */
  function checkDue() {
    var r = rems(), due = [], changed = false;
    Object.keys(r).forEach(function (k) {
      var n = daysTo(r[k].d);
      if (n < -1) { delete r[k]; changed = true; return; } // बीत चुकी तारीख़ हटाएँ
      if (n >= 0 && n <= 7) due.push({ id: k, t: r[k].t, n: n });
    });
    if (changed) saveRems(r);
    due.sort(function (a, b) { return a.n - b.n; });
    var bn = $("remBanner");
    if (!due.length || ls.get("sb_rem_ok") === TODAY) { if (bn) bn.hidden = true; } else {
      if (!bn && $("chips")) { $("chips").insertAdjacentHTML("beforebegin", '<div id="remBanner" class="nbanner rem"></div>'); bn = $("remBanner"); }
      if (bn) {
        bn.hidden = false;
        bn.innerHTML = '<span>🔔 <b>' + esc(T("rm_banner")) + ":</b> " + due.slice(0, 3).map(function (x) {
          return esc(x.t) + " (" + esc(x.n === 0 ? T("dt_today") : x.n === 1 ? T("dt_tom") : T("dt_left", x.n)) + ")";
        }).join("; ") + '</span><span class="nbtns"><button class="btn btn-sm" type="button" data-rmsee="1">' + esc(T("rm_see")) +
          '</button><button class="btn btn-sm btn-ghost2" type="button" data-rmok="1">' + esc(T("rm_ok")) + "</button></span>";
      }
    }
    /* फ़ोन पर सूचना: 7 दिन पहले, 1 दिन पहले और आख़िरी दिन — हर बार सिर्फ़ एक बार */
    try {
      if (!due.length || !("Notification" in window) || Notification.permission !== "granted" || !navigator.serviceWorker) return;
      var sent = ls.get("sb_rem_sent", {});
      navigator.serviceWorker.ready.then(function (reg) {
        due.forEach(function (x) {
          var lvl = x.n === 0 ? "0" : x.n <= 1 ? "1" : "7", key = x.id + ":" + lvl;
          if (sent[key]) return; sent[key] = TODAY;
          reg.showNotification("🔔 " + x.t, { body: (x.n === 0 ? T("dt_today") : x.n === 1 ? T("dt_tom") : T("dt_left", x.n)) + " — Samjho Bharat",
            icon: "icons/icon-192.png", tag: "rem-" + x.id, data: { url: "./?tool=dates" } });
        });
        ls.set("sb_rem_sent", sent);
      }).catch(function () {});
    } catch (e) {}
  }

  /* =========================================================
     4. काम की गाइड
     ========================================================= */
  function openGuides() {
    TL.panel(T("tool_guides"), '<div class="skeleton"></div>');
    TL.load("guides").then(function (d) {
      var last = ls.get("sb_guide_last", "");
      $("toolBody").innerHTML = '<p class="small">' + esc(T("gd_intro")) + "</p>" + d.items.map(function (x) {
        return '<details class="scard" data-gid="' + esc(x.id) + '"' + (x.id === last ? " open" : "") + '><summary><b>' + esc(x.icon + " " + x.title) + '</b><span class="small">' + esc(x.short) + "</span></summary>" +
          "<ol>" + x.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
          '<p class="tipline">💡 ' + esc(x.tip) + "</p>" + '<p class="small">' + esc(T("sc_src")) + ": " + esc(x.src) + "</p>" +
          (x.phone ? '<a class="btn btn-sm btn-call" href="tel:' + esc(x.phone) + '">📞 ' + esc(x.phone) + "</a> " : "") +
          (x.url ? '<a class="btn btn-sm btn-ghost2" href="' + esc(x.url) + '" target="_blank" rel="noopener">🔗 ' + esc(T("yf_site")) + "</a>" : "") + "</details>";
      }).join("") + '<p class="small">' + esc(T("data_checked", d.verified_on)) + "</p>";
      $("toolBody").querySelectorAll("details[data-gid]").forEach(function (el) {
        el.addEventListener("toggle", function () { if (el.open) ls.set("sb_guide_last", el.dataset.gid); });
      });
    }).catch(function () { $("toolBody").innerHTML = '<div class="empty">' + esc(T("load_fail")) + "</div>"; });
  }

  /* ---------- जोड़ना ---------- */
  function open(k) { if (k === "scam") openScam(); else if (k === "dates") openDates(); else if (k === "guides") openGuides(); }
  window.SB_P4 = { open: open, today5: today5, checkDue: checkDue };
  function start() {
    TL.load("scams").then(function (d) { scamsData = d; today5(); }).catch(function () { today5(); });
    today5(); checkDue();
    var q = new URLSearchParams(location.search).get("tool");
    if (q === "scam" || q === "dates" || q === "guides") open(q);
  }
  document.addEventListener("sb:news", today5);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { var t = ymd(new Date()); if (t !== TODAY) { TODAY = t; today5(); } checkDue(); } });
  if (window.SBA) start(); else document.addEventListener("sb:ready", start);
})();
