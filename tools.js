/* समझो भारत — काम के औज़ार: मेरे लिए योजनाएँ (Yojana Finder), दस्तावेज़ गाइड, महिलाओं के लिए
   Data: data/schemes.json, data/docs.json, data/women.json (सरकारी स्रोतों से मिलाई गई जानकारी) */
(function () {
  "use strict";
  var I = window.SB_I18N, T = I.t, P = window.SBP;
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  /* शब्द (हिंदी + English) */
  (function () {
    var X = {
      hi: { yes: "हाँ", no: "नहीं", r_worker: "मज़दूर / दिहाड़ी / गिग वर्कर", r_vendor: "रेहड़ी-पटरी वाले", r_artisan: "कारीगर (बढ़ई, दर्ज़ी, कुम्हार आदि)",
        tool_yojana: "मेरे लिए योजनाएँ", tool_yojana_s: "कुछ सवालों से जानें कौन-सी सरकारी योजना आपके काम की है", tool_docs: "दस्तावेज़ गाइड", tool_docs_s: "PAN, पासपोर्ट, DL, आधार, वोटर ID: कैसे बनवाएँ, फ़ीस क्या है",
        tool_women: "महिलाओं के लिए", tool_women_s: "सुरक्षा, काम पर हक़, संपत्ति के अधिकार और योजनाएँ",
        yf_intro: "इन सवालों के जवाब दें। ऐप आपके लिए संभावित योजनाएँ दिखाएगा। आख़िरी फ़ैसला योजना की आधिकारिक शर्तों से होता है।",
        yf_age: "आपकी उम्र (साल)", yf_area: "आप कहाँ रहते हैं?", yf_rural: "गाँव", yf_urban: "शहर/क़स्बा", yf_inc: "परिवार की सालाना आय",
        inc_a: "₹1.8 लाख तक (₹15,000 महीना तक)", inc_b: "₹1.8 लाख से ₹3 लाख", inc_c: "₹3 लाख से ₹6 लाख", inc_d: "₹6 लाख से ₹9 लाख", inc_e: "₹9 लाख से ज़्यादा",
        yf_tax: "क्या आप या परिवार में कोई आयकर (Income Tax) देता है?", yf_pf: "क्या आपकी तनख़्वाह से PF या ESIC कटता है?", yf_house: "क्या परिवार के नाम पक्का घर है?",
        yf_bank: "क्या आपका बैंक खाता है?", yf_daughter: "क्या 10 साल से छोटी बेटी है?", yf_mother: "क्या आप गर्भवती हैं या छोटे बच्चे को दूध पिलाती हैं?",
        yf_go: "मेरी योजनाएँ दिखाएँ", yf_found: "आपके लिए {n} योजनाएँ मिलीं", yf_who: "किसे मिलेगा", yf_not: "किसे नहीं मिलेगा", yf_docs: "ज़रूरी काग़ज़",
        yf_how: "आवेदन कैसे करें", yf_site: "आधिकारिक वेबसाइट", yf_unclear: "अभी नए आवेदन खुले हैं या नहीं, यह पक्का नहीं। आधिकारिक वेबसाइट पर जाँचें।",
        yf_share_head: "समझो भारत ऐप के अनुसार ये सरकारी योजनाएँ मेरे काम की हो सकती हैं:",
        docs_intro: "ज़रूरी दस्तावेज़ बनवाने का सही तरीका, सरकारी फ़ीस और काम की बात। बिचौलियों को ज़्यादा पैसे न दें।", docs_steps: "तरीका", docs_fee: "फ़ीस",
        women_intro: "हर महिला को ये हक़ और मदद के नंबर पता होने चाहिए। ज़रूरत हो तो नंबर दबाकर सीधे कॉल करें।", data_checked: "जानकारी {n} को सरकारी स्रोतों से मिलाई गई।" },
      en: { yes: "Yes", no: "No", r_worker: "Labourer / daily wage / gig worker", r_vendor: "Street vendor", r_artisan: "Artisan (carpenter, tailor, potter etc.)",
        tool_yojana: "Schemes for me", tool_yojana_s: "Answer a few questions to find government schemes for you", tool_docs: "Document guide", tool_docs_s: "PAN, passport, DL, Aadhaar, voter ID: how to apply, fees",
        tool_women: "For women", tool_women_s: "Safety, rights at work, property rights and schemes",
        yf_intro: "Answer these questions to see schemes you may be eligible for. Final eligibility depends on each scheme's official rules.",
        yf_age: "Your age (years)", yf_area: "Where do you live?", yf_rural: "Village", yf_urban: "City / town", yf_inc: "Family's yearly income",
        inc_a: "Up to ₹1.8 lakh (₹15,000 a month)", inc_b: "₹1.8 to 3 lakh", inc_c: "₹3 to 6 lakh", inc_d: "₹6 to 9 lakh", inc_e: "Above ₹9 lakh",
        yf_tax: "Do you or anyone in the family pay income tax?", yf_pf: "Is PF or ESIC deducted from your salary?", yf_house: "Does the family own a pucca house?",
        yf_bank: "Do you have a bank account?", yf_daughter: "Do you have a daughter under 10?", yf_mother: "Are you pregnant or breastfeeding a baby?",
        yf_go: "Show my schemes", yf_found: "{n} schemes found for you", yf_who: "Who gets it", yf_not: "Who doesn't", yf_docs: "Documents needed",
        yf_how: "How to apply", yf_site: "Official website", yf_unclear: "Not certain whether new applications are open. Check the official website.",
        yf_share_head: "According to the Samjho Bharat app, these government schemes may suit me:",
        docs_intro: "The right way to get key documents, official fees and useful tips. Don't overpay middlemen.", docs_steps: "Steps", docs_fee: "Fee",
        women_intro: "Every woman should know these rights and helpline numbers. Tap a number to call.", data_checked: "Information checked with government sources on {n}." }
    };
    Object.keys(X).forEach(function (l) { var t = window.SB_STR[l]; if (!t) return; Object.keys(X[l]).forEach(function (k) { if (!t[k]) t[k] = X[l][k]; }); });
  })();
  var cache = {};
  function load(name) {
    if (cache[name]) return Promise.resolve(cache[name]);
    return fetch("data/" + name + ".json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { cache[name] = d; try { localStorage.setItem("sb_tool_" + name, JSON.stringify(d)); } catch (e) {} return d; })
      .catch(function () { try { var d = JSON.parse(localStorage.getItem("sb_tool_" + name)); if (d) return d; } catch (e) {} throw new Error("offline"); });
  }

  /* ---------- पूरी स्क्रीन वाला पैनल ---------- */
  function panel(title, html) {
    var p = $("toolPanel");
    if (!p) {
      document.body.insertAdjacentHTML("beforeend", '<div id="toolPanel" class="reader" hidden><div class="reader-bar"><button id="toolBack" class="icon-btn" aria-label="back">' +
        '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg></button>' +
        '<span class="reader-title" id="toolTitle"></span></div><div id="toolBody" class="reader-body"></div></div>');
      p = $("toolPanel");
      $("toolBack").addEventListener("click", function () { history.back(); });
      window.addEventListener("popstate", function () { if (!p.hidden) { p.hidden = true; document.body.style.overflow = ""; } });
    }
    $("toolTitle").textContent = title;
    $("toolBody").innerHTML = html;
    if (p.hidden) { p.hidden = false; document.body.style.overflow = "hidden"; history.pushState({ tool: 1 }, ""); }
    p.scrollTop = 0;
  }
  function failHtml() { return '<div class="empty">' + esc(T("load_fail")) + "</div>"; }

  /* ---------- 1. मेरे लिए योजनाएँ ---------- */
  var ROLES = ["job", "govt", "biz", "farmer", "worker", "vendor", "artisan", "student", "home", "senior"];
  var INC = [["a", 180000], ["b", 300000], ["c", 600000], ["d", 900000], ["e", Infinity]];
  function yesno(id, v) {
    return '<div class="chips wrap yn" data-yn="' + id + '"><button type="button" class="chip' + (v === 1 ? " on" : "") + '" data-v="1">' + esc(T("yes")) +
      '</button><button type="button" class="chip' + (v === 0 ? " on" : "") + '" data-v="0">' + esc(T("no")) + "</button></div>";
  }
  function finderForm() {
    var pr = P.profile(), y = pr.yf || {};
    var roles = y.roles || (pr.roles || []).slice();
    var g = y.gender || pr.gender || "";
    var h = '<p class="small">' + esc(T("yf_intro")) + '</p><form id="yfForm" class="cform" novalidate>' +
      '<label class="cf"><span>' + esc(T("yf_age")) + '</span><input id="yfAge" type="number" inputmode="numeric" min="0" max="110" value="' + esc(y.age || "") + '"></label>' +
      "<h3>" + esc(T("onb_gender")) + '</h3><div class="chips wrap" data-one="gender">' + ["f", "m"].map(function (k) { return '<button type="button" class="chip' + (g === k ? " on" : "") + '" data-v="' + k + '">' + esc(T("g_" + k)) + "</button>"; }).join("") + "</div>" +
      "<h3>" + esc(T("onb_roles")) + '</h3><div class="chips wrap" data-many="roles">' + ROLES.map(function (r) { return '<button type="button" class="chip' + (roles.indexOf(r) >= 0 ? " on" : "") + '" data-v="' + r + '">' + esc(T("r_" + r)) + "</button>"; }).join("") + "</div>" +
      "<h3>" + esc(T("yf_area")) + '</h3><div class="chips wrap" data-one="area">' + ["rural", "urban"].map(function (k) { return '<button type="button" class="chip' + (y.area === k ? " on" : "") + '" data-v="' + k + '">' + esc(T("yf_" + k)) + "</button>"; }).join("") + "</div>" +
      '<label class="cf"><span>' + esc(T("yf_inc")) + '</span><select id="yfInc">' + INC.map(function (b) { return '<option value="' + b[0] + '"' + (y.inc === b[0] ? " selected" : "") + ">" + esc(T("inc_" + b[0])) + "</option>"; }).join("") + "</select></label>" +
      "<h3>" + esc(T("yf_tax")) + "</h3>" + yesno("tax", y.tax) +
      "<h3>" + esc(T("yf_pf")) + "</h3>" + yesno("pf", y.pf) +
      "<h3>" + esc(T("yf_house")) + "</h3>" + yesno("house", y.house) +
      "<h3>" + esc(T("yf_bank")) + "</h3>" + yesno("bank", y.bank) +
      "<h3>" + esc(T("yf_daughter")) + "</h3>" + yesno("daughter", y.daughter) +
      '<div id="yfMother"><h3>' + esc(T("yf_mother")) + "</h3>" + yesno("mother", y.mother) + "</div>" +
      '<p class="small">' + esc(T("onb_priv")) + '</p><button class="btn" type="submit">' + esc(T("yf_go")) + '</button></form><div id="yfOut"></div>';
    return h;
  }
  function readForm() {
    var f = $("yfForm"), y = {};
    y.age = parseInt($("yfAge").value, 10); if (!(y.age >= 0)) y.age = null;
    var one = function (k) { var b = f.querySelector('[data-one="' + k + '"] .chip.on'); return b ? b.dataset.v : ""; };
    y.gender = one("gender"); y.area = one("area");
    y.roles = Array.prototype.map.call(f.querySelectorAll('[data-many="roles"] .chip.on'), function (b) { return b.dataset.v; });
    y.inc = $("yfInc").value;
    ["tax", "pf", "house", "bank", "daughter", "mother"].forEach(function (k) { var b = f.querySelector('[data-yn="' + k + '"] .chip.on'); y[k] = b ? +b.dataset.v : null; });
    return y;
  }
  function incMax(code) { for (var i = 0; i < INC.length; i++) if (INC[i][0] === code) return INC[i][1]; return Infinity; }
  function match(s, y) {
    if (s.status === "closed") return false;
    if (y.age != null) { if (s.age_min != null && y.age < s.age_min) return false; if (s.age_max != null && y.age > s.age_max) return false; }
    if (s.gender === "female" && y.gender !== "f") return false;
    if (s.roles.indexOf("any") < 0 && !s.roles.some(function (r) { return y.roles.indexOf(r) >= 0; })) return false;
    var R = s.rules || {}, im = incMax(y.inc);
    if (R.no_tax && y.tax === 1) return false;
    if (R.no_pf && y.pf === 1) return false;
    if (R.no_govt && y.roles.indexOf("govt") >= 0) return false;
    if (R.daughter && y.daughter !== 1) return false;
    if (R.mother && y.mother !== 1) return false;
    if (R.no_house && y.house === 1) return false;
    if (R.own_house && y.house === 0) return false;
    if (R.urban && y.area === "rural") return false;
    if (R.rural && y.area === "urban") return false;
    if (R.no_bank && y.bank !== 0) return false;
    if (R.poor && im > 300000) return false;
    if (R.max_income && im > R.max_income) return false;
    if (s.id === "pm-jay" && im > 300000) return false;
    return true;
  }
  function schemeCard(s) {
    return '<details class="scard"><summary><b>' + esc(s.name_hi) + '</b><span class="small">' + esc(s.benefit) + "</span></summary>" +
      (s.status === "unclear" ? '<p class="warn">⚠️ ' + esc(T("yf_unclear")) + "</p>" : "") +
      "<h4>" + esc(T("yf_who")) + "</h4><p>" + esc(s.who) + "</p>" +
      "<h4>" + esc(T("yf_not")) + "</h4><p>" + esc(s.not_for) + "</p>" +
      "<h4>" + esc(T("yf_docs")) + "</h4><ul>" + s.docs.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" +
      "<h4>" + esc(T("yf_how")) + "</h4><p>" + esc(s.how) + "</p>" +
      '<a class="btn btn-sm" href="' + esc(s.url) + '" target="_blank" rel="noopener">🔗 ' + esc(T("yf_site")) + "</a></details>";
  }
  function runFinder() {
    var y = readForm(), pr = P.profile();
    pr.yf = y; if (y.gender) pr.gender = y.gender; P.saveProfile(pr);
    load("schemes").then(function (d) {
      var list = d.schemes.filter(function (s) { return match(s, y); });
      var spec = function (s) { return s.roles.indexOf("any") >= 0 ? 0 : 1; };
      list.sort(function (a, b) { return spec(b) - spec(a); });
      $("yfOut").innerHTML = '<h2 class="yfh">' + esc(T("yf_found", list.length)) + "</h2>" + list.map(schemeCard).join("") +
        '<p class="small">' + esc(d.note_hi) + "</p>" + '<button class="btn btn-wa" type="button" id="yfShare">📤 ' + esc(T("share_btn")) + "</button>";
      $("yfOut").scrollIntoView({ behavior: "smooth" });
      $("yfShare").onclick = function () {
        var txt = T("yf_share_head") + "\n" + list.slice(0, 8).map(function (s) { return "• " + s.name_hi; }).join("\n") + "\n\n" + T("tagline") + "\n📲 " + window.SB_CONFIG.appShareUrl;
        if (navigator.share) navigator.share({ text: txt }).catch(function () {}); else location.href = "https://wa.me/?text=" + encodeURIComponent(txt);
      };
    }).catch(function () { $("yfOut").innerHTML = failHtml(); });
  }
  function openFinder() {
    panel(T("tool_yojana"), finderForm());
    var f = $("yfForm");
    var syncMother = function () { var g = f.querySelector('[data-one="gender"] .chip.on'); $("yfMother").hidden = !(g && g.dataset.v === "f"); };
    syncMother();
    f.addEventListener("click", function (ev) {
      var c = ev.target.closest(".chip"); if (!c) return;
      var box = c.parentNode;
      if (box.dataset.many) c.classList.toggle("on");
      else { var on = c.classList.contains("on"); box.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("on"); }); if (!on) c.classList.add("on"); }
      syncMother();
    });
    f.addEventListener("submit", function (ev) { ev.preventDefault(); runFinder(); });
    if ((P.profile().yf || {}).inc) runFinder(); // पिछली बार के जवाब से तुरंत नतीजे
  }

  /* ---------- 2. दस्तावेज़ गाइड ---------- */
  function openDocs() {
    panel(T("tool_docs"), '<div class="skeleton"></div>');
    load("docs").then(function (d) {
      $("toolBody").innerHTML = '<p class="small">' + esc(T("docs_intro")) + "</p>" + d.docs.map(function (x) {
        return '<details class="scard"><summary><b>' + esc(x.icon + " " + x.name_hi) + '</b><span class="small">' + esc(x.where) + "</span></summary>" +
          "<h4>" + esc(T("docs_steps")) + "</h4><ol>" + x.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
          "<h4>" + esc(T("yf_docs")) + "</h4><ul>" + x.docs.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>" +
          "<h4>" + esc(T("docs_fee")) + "</h4><p>" + esc(x.fee) + "</p>" +
          '<p class="tipline">💡 ' + esc(x.tip) + "</p>" +
          '<a class="btn btn-sm" href="' + esc(x.url) + '" target="_blank" rel="noopener">🔗 ' + esc(T("yf_site")) + "</a></details>";
      }).join("") + '<p class="small">' + esc(T("data_checked", d.verified_on)) + "</p>";
    }).catch(function () { $("toolBody").innerHTML = failHtml(); });
  }

  /* ---------- 3. महिलाओं के लिए ---------- */
  function openWomen() {
    panel(T("tool_women"), '<div class="skeleton"></div>');
    load("women").then(function (d) {
      var html = '<p class="small">' + esc(T("women_intro")) + "</p>";
      Object.keys(d.groups).forEach(function (g) {
        html += '<h3 class="wg">' + esc(d.groups[g]) + "</h3>" + d.items.filter(function (x) { return x.group === g; }).map(function (x) {
          return '<div class="wcard"><b>' + esc(x.title) + "</b><p>" + esc(x.text) + "</p>" +
            (x.phone ? '<a class="btn btn-sm btn-call" href="tel:' + esc(x.phone) + '">📞 ' + esc(x.phone) + "</a> " : "") +
            (x.url ? '<a class="btn btn-sm btn-ghost2" href="' + esc(x.url) + '" target="_blank" rel="noopener">🔗 ' + esc(T("yf_site")) + "</a>" : "") + "</div>";
        }).join("");
      });
      $("toolBody").innerHTML = html + '<p class="small">' + esc(T("data_checked", d.verified_on)) + "</p>";
    }).catch(function () { $("toolBody").innerHTML = failHtml(); });
  }

  /* ---------- "जानकारी" टैब में औज़ारों के बटन ---------- */
  function renderTools() {
    var L = [["yojana", "🏛️"], ["scam", "🚨"], ["dates", "📅"], ["guides", "🧭"], ["docs", "📄"], ["women", "👩"]];
    var html = '<div class="toolgrid">' + L.map(function (x) {
      return '<button class="tool" type="button" data-tool="' + x[0] + '"><b>' + x[1] + "</b><span>" + esc(T("tool_" + x[0])) + "</span><small>" + esc(T("tool_" + x[0] + "_s")) + "</small></button>";
    }).join("") + "</div>";
    var g = $("tab-gyan"), old = $("toolBox");
    if (old) old.innerHTML = html; else g.insertAdjacentHTML("afterbegin", '<div id="toolBox">' + html + "</div>");
  }
  function openTool(k) {
    var P4 = window.SB_P4;
    if (k === "yojana") openFinder(); else if (k === "docs") openDocs(); else if (k === "women") openWomen();
    else if (P4 && P4.open) P4.open(k);
  }
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-tool]"); if (!b) return;
    var k = b.dataset.tool;
    try { localStorage.setItem("sb_last_tool", k); } catch (e) {}
    openTool(k);
  });
  renderTools();
  var q = new URLSearchParams(location.search).get("tool");
  if (q === "yojana" || q === "docs" || q === "women") openTool(q); // बाकी (scam, dates, guides) phase4.js खोलता है
  window.SB_TOOLS = { openFinder: openFinder, openDocs: openDocs, openWomen: openWomen, render: renderTools, panel: panel, load: load, esc: esc, open: openTool };
})();
