/* समझो भारत — किसी भी लेख का "image card" (1080×1350) फ़ोन में ही बनाना और शेयर करना।
   कोई तस्वीर या जानकारी कहीं भेजी नहीं जाती; कार्ड canvas से बनता है। */
(function () {
  "use strict";
  var I = window.SB_I18N, T = I.t, C = window.SB_CONFIG;
  (function () {
    var X = {
      hi: { card_btn: "कार्ड बनाकर शेयर करें", card_head: "शेयर करने के लिए कार्ड", card_dl: "डाउनलोड", card_making: "कार्ड बन रहा है…", card_close: "बंद करें", card_app: "पूरी ख़बर पढ़ें: समझो भारत ऐप" },
      en: { card_btn: "Share as image card", card_head: "Card to share", card_dl: "Download", card_making: "Making the card…", card_close: "Close", card_app: "Read the full story: Samjho Bharat app" }
    };
    Object.keys(X).forEach(function (l) { var t = window.SB_STR[l]; if (!t) return; Object.keys(X[l]).forEach(function (k) { if (!t[k]) t[k] = X[l][k]; }); });
  })();
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* लेख से 3 मुख्य बातें निकालना: पहले सूची (li), नहीं तो पैराग्राफ़ के पहले वाक्य */
  function points(html) {
    var doc = new DOMParser().parseFromString("<div>" + (html || "") + "</div>", "text/html");
    var clean = function (s) { return s.replace(/\s+/g, " ").trim(); };
    var lis = [].map.call(doc.querySelectorAll("li"), function (n) { return clean(n.textContent); }).filter(function (s) { return s.length >= 12 && s.length <= 160; });
    if (lis.length >= 3) return lis.slice(0, 3);
    var out = lis.slice();
    [].forEach.call(doc.querySelectorAll("p,h2,h3"), function (n) {
      if (out.length >= 3) return;
      var t = clean(n.textContent); if (t.length < 25) return;
      var m = t.match(/^.+?[।.!?](\s|$)/); t = (m ? m[0] : t).trim();
      if (t.length > 150) t = t.slice(0, 147).replace(/\s+\S*$/, "") + "…";
      if (out.indexOf(t) < 0) out.push(t);
    });
    return out.slice(0, 3);
  }
  function wrap(x, text, maxW) {
    var words = String(text).split(" "), lines = [], line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (x.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function draw(p, title, html, label) {
    var W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var x = cv.getContext("2d"), F = "Mukta, 'Noto Sans', sans-serif";
    var g = x.createLinearGradient(0, 0, W * 0.4, H); g.addColorStop(0, "#0b1f4a"); g.addColorStop(0.55, "#13306b"); g.addColorStop(1, "#0a1a3c");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "#ff9933"; x.fillRect(0, 0, W, 18);
    /* ब्रांड */
    x.beginPath(); x.arc(103, 103, 43, 0, 7); x.fillStyle = "#ff9933"; x.fill(); x.lineWidth = 4; x.strokeStyle = "#fff"; x.stroke();
    x.fillStyle = "#0b1f4a"; x.textAlign = "center"; x.font = "700 44px " + F; x.fillText(T("logo_letter"), 103, 119);
    x.textAlign = "left"; x.fillStyle = "#fff"; x.font = "700 40px " + F; x.fillText(T("brand"), 166, 98);
    x.fillStyle = "#ffd7a8"; x.font = "400 26px " + F; x.fillText(T("tagline"), 166, 134);
    /* विषय की पट्टी */
    var y = 230;
    if (label) {
      x.font = "700 30px " + F; var lw = x.measureText(label).width + 52;
      x.fillStyle = "#d62828"; roundRect(x, 60, y - 40, lw, 54, 8); x.fill();
      x.fillStyle = "#fff"; x.fillText(label, 86, y - 2); y += 50;
    }
    /* शीर्षक: जगह के हिसाब से अक्षर का आकार */
    var size = 66, lines;
    do { x.font = "700 " + size + "px " + F; lines = wrap(x, title, W - 120); size -= 4; } while (lines.length > 4 && size > 44);
    if (lines.length > 4) { lines = lines.slice(0, 4); lines[3] = lines[3].replace(/\s*\S*$/, "") + "…"; }
    size += 4; x.fillStyle = "#fff";
    lines.forEach(function (l) { y += size * 1.2; x.fillText(l, 60, y); });
    y += 50;
    /* मुख्य बातें */
    var pts = points(html), bottom = H - 190;
    x.font = "700 36px " + F;
    pts.forEach(function (t) {
      var ls = wrap(x, t, W - 200); if (ls.length > 3) { ls = ls.slice(0, 3); ls[2] = ls[2].replace(/\s*\S*$/, "") + "…"; }
      var h = ls.length * 48 + 40;
      if (y + h > bottom) return;
      x.fillStyle = "rgba(255,255,255,.08)"; roundRect(x, 60, y, W - 120, h, 12); x.fill();
      x.fillStyle = "#ff9933"; x.fillRect(60, y, 9, h);
      x.fillStyle = "#ffb347"; x.fillText("✓", 92, y + 56);
      x.fillStyle = "#fff"; ls.forEach(function (l, i) { x.fillText(l, 140, y + 56 + i * 48); });
      y += h + 24;
    });
    /* तारीख़ और नीचे की पट्टी */
    x.fillStyle = "#c9d6f2"; x.font = "400 26px " + F;
    var dt = ""; try { dt = new Date(p.date).toLocaleDateString(I.get() + "-IN", { day: "numeric", month: "long", year: "numeric" }); } catch (e) {}
    x.fillText(dt, 60, H - 130);
    x.fillStyle = "#ff9933"; x.fillRect(0, H - 96, W, 96);
    x.fillStyle = "#0b1f4a"; x.textAlign = "center"; x.font = "700 34px " + F; x.fillText("📲 " + T("card_app"), W / 2, H - 52);
    x.font = "600 22px " + F; x.fillText(C.appShareUrl.replace(/^https:\/\//, "").replace(/\/$/, ""), W / 2, H - 18);
    return cv;
  }
  function roundRect(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

  function open(p, title, html, label, shareTxt) {
    var sh = document.getElementById("cardSheet");
    if (!sh) {
      document.body.insertAdjacentHTML("beforeend", '<div id="cardSheet" class="sheet"><div class="sheet-box cardbox" role="dialog"></div></div>');
      sh = document.getElementById("cardSheet");
      sh.addEventListener("click", function (ev) { if (ev.target === sh || ev.target.closest("[data-cclose]")) sh.hidden = true; });
    }
    var box = sh.querySelector(".cardbox");
    box.innerHTML = "<h3>🖼️ " + esc(T("card_head")) + '</h3><p class="small">' + esc(T("card_making")) + "</p>";
    sh.hidden = false;
    var go = function () {
      var cv = draw(p, title, html, label);
      cv.toBlob(function (blob) {
        var url = URL.createObjectURL(blob), fn = "SamjhoBharat-" + (p.pid || "post") + ".png";
        box.innerHTML = "<h3>🖼️ " + esc(T("card_head")) + '</h3><img class="certimg" alt="" src="' + url + '"><div class="onb-btns">' +
          '<button class="btn btn-wa" type="button" id="cardShare">📤 ' + esc(T("share_btn")) + '</button><a class="btn btn-ghost2" download="' + fn + '" href="' + url + '">⬇ ' + esc(T("card_dl")) +
          '</a><button class="btn btn-ghost2" type="button" data-cclose="1">' + esc(T("card_close")) + "</button></div>";
        document.getElementById("cardShare").onclick = function () {
          var file = new File([blob], fn, { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: shareTxt }).catch(function () {});
          else window.open("https://wa.me/?text=" + encodeURIComponent(shareTxt), "_blank");
        };
      }, "image/png");
    };
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load("700 40px Mukta"), document.fonts.load("400 40px Mukta")]).then(go, go); else go();
  }
  window.SB_CARD = { open: open, points: points };
})();
