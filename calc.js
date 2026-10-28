/* समझो भारत — पैसे के कैलकुलेटर (Money calculators)
   साधारण ब्याज, चक्रवृद्धि ब्याज, लोन EMI, गोल्ड लोन बनाम गिरवी — हर एक में महँगाई (inflation) का विकल्प। */
window.SB_CALC = (function () {
  "use strict";
  var D; // app से मिलने वाली चीज़ें: T, esc, speak, share, cfg, box
  var MEM = (function () { try { return JSON.parse(localStorage.getItem("sb_calc_last")) || {}; } catch (e) { return {}; } })();
  function memSave() { try { localStorage.setItem("sb_calc_last", JSON.stringify(MEM)); } catch (e) {} }
  var cur = MEM.cur || "si";
  var EXT = window.SB_CALC_EXT || {};
  var LIST = ["si", "ci", "emi", "gold"].concat(Object.keys(EXT));

  function money(x) {
    if (!isFinite(x)) return "—";
    return "₹" + Math.round(x).toLocaleString("en-IN");
  }
  function num(id) {
    var el = document.getElementById(id);
    var v = el ? parseFloat(String(el.value).replace(/,/g, "")) : NaN;
    return isFinite(v) ? v : NaN;
  }
  function field(id, label, val, step) {
    return '<label class="cf"><span>' + D.esc(label) + '</span><input id="' + id + '" type="number" inputmode="decimal" min="0" step="' + (step || "any") + '" value="' + val + '"></label>';
  }
  function inflBlock() {
    var r = D.cfg.inflationDefault || 6;
    return '<label class="ccheck"><input id="c_infl" type="checkbox" checked> <span>' + D.esc(D.T("f_infl")) + "</span></label>" +
      '<div id="c_infl_box">' + field("c_ir", D.T("f_infl_rate"), r, "0.1") + "</div>";
  }
  function formHtml(k) {
    var T = D.T, h = "";
    if (EXT[k]) return EXT[k].form({ T: T, esc: D.esc, field: field }) + (EXT[k].infl === false ? "" : inflBlock());
    if (k === "si") {
      h = field("c_p", T("f_amount"), 100000) + field("c_r", T("f_rate"), 10, "0.01") + field("c_t", T("f_years"), 3, "0.5");
    } else if (k === "ci") {
      h = field("c_p", T("f_amount"), 100000) + field("c_r", T("f_rate"), 7, "0.01") + field("c_t", T("f_years"), 5, "0.5") +
        '<label class="cf"><span>' + D.esc(T("f_freq")) + '</span><select id="c_n">' +
        '<option value="1">' + D.esc(T("fq1")) + '</option><option value="2">' + D.esc(T("fq2")) + '</option>' +
        '<option value="4" selected>' + D.esc(T("fq4")) + '</option><option value="12">' + D.esc(T("fq12")) + "</option></select></label>";
    } else if (k === "emi") {
      h = field("c_p", T("f_amount"), 500000) + field("c_r", T("f_rate"), 10, "0.01") + field("c_m", T("f_months"), 60, "1");
    } else {
      h = field("c_p", T("f_amount"), 50000) + field("c_m", T("f_months"), 12, "1") + field("c_gr", T("f_gold_rate"), 12, "0.01") +
        '<label class="cf"><span>' + D.esc(T("f_girvi_rate")) + '</span><span class="crow"><input id="c_vr" type="number" inputmode="decimal" min="0" step="0.01" value="2">' +
        '<select id="c_vu"><option value="m" selected>' + D.esc(T("u_month")) + '</option><option value="y">' + D.esc(T("u_year")) + "</option></select></span></label>" +
        '<label class="ccheck"><input id="c_vc" type="checkbox"> <span>' + D.esc(T("f_girvi_comp")) + "</span></label>";
    }
    return h + inflBlock();
  }
  function row(label, value, big) {
    return '<div class="crres' + (big ? " big" : "") + '"><span>' + D.esc(label) + "</span><b>" + D.esc(value) + "</b></div>";
  }
  var lastShare = "";
  function calcExt() {
    var T = D.T, X = EXT[cur], inflEl = document.getElementById("c_infl");
    var useInfl = inflEl && inflEl.checked, ir = num("c_ir") / 100;
    var res = X.run({ T: T, n: num, el: function (id) { return document.getElementById(id); } });
    if (!res) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
    if (res.err) { show('<p class="cerr">' + D.esc(res.err) + "</p>"); return; }
    var out = "", share = [T(cur + "_name")];
    res.rows.forEach(function (r) { out += row(r[0], r[1], !!r[2]); share.push(r[0] + ": " + r[1]); });
    if (res.verdict) { out += '<div class="cverdict">' + D.esc(res.verdict) + "</div>"; share.push(res.verdict); }
    if (useInfl && ir >= 0 && res.total && res.years) {
      var real = res.total / Math.pow(1 + ir, res.years);
      out += row(T("r_real"), money(real)) + '<p class="small">' + D.esc(T("r_real_note", +(ir * 100).toFixed(2))) + "</p>";
      share.push(T("r_real") + ": " + money(real));
    }
    if (res.note) out += '<p class="small">' + D.esc(res.note) + "</p>";
    lastShare = share.join("\n");
    show(out + '<button class="btn btn-wa" id="c_share" type="button">📤 ' + D.esc(T("share_btn")) + "</button>");
  }
  function calc() {
    if (EXT[cur]) { calcExt(); return; }
    var T = D.T, out = "", share = [];
    var useInfl = document.getElementById("c_infl").checked;
    var ir = num("c_ir") / 100;
    if (useInfl && !(ir >= 0)) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
    var P = num("c_p");
    if (!(P > 0)) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
    var realLine = function (amount, years, labelKey) {
      if (!useInfl) return "";
      var real = amount / Math.pow(1 + ir, years);
      share.push(T(labelKey || "r_real") + ": " + money(real));
      return row(T(labelKey || "r_real"), money(real), false) + '<p class="small">' + D.esc(T("r_real_note", +(ir * 100).toFixed(2))) + "</p>";
    };
    if (cur === "si" || cur === "ci") {
      var r = num("c_r") / 100, t = num("c_t");
      if (!(r >= 0) || !(t > 0)) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
      var A;
      if (cur === "si") A = P * (1 + r * t);
      else { var n = +document.getElementById("c_n").value || 1; A = P * Math.pow(1 + r / n, n * t); }
      out = row(T("r_interest"), money(A - P)) + row(T("r_total"), money(A), true) + realLine(A, t);
      share.unshift(T(cur + "_name") + " — " + money(P) + ", " + (r * 100) + "%, " + t + " " + T("f_years"), T("r_total") + ": " + money(A));
    } else if (cur === "emi") {
      var R = num("c_r") / 100 / 12, N = Math.round(num("c_m"));
      if (!(R >= 0) || !(N > 0)) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
      var emi = R === 0 ? P / N : P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
      var total = emi * N;
      out = row(T("r_emi"), money(emi), true) + row(T("r_interest"), money(total - P)) + row(T("r_paid"), money(total));
      share.push(T("emi_name") + " — " + money(P) + ", " + (R * 1200).toFixed(2) + "%, " + N + " " + T("f_months"), T("r_emi") + ": " + money(emi), T("r_paid") + ": " + money(total));
      if (useInfl) {
        var im = Math.pow(1 + ir, 1 / 12) - 1, pv = 0;
        for (var k = 1; k <= N; k++) pv += emi / Math.pow(1 + im, k);
        out += row(T("r_real_emi"), money(pv)) + '<p class="small">' + D.esc(T("r_real_note", +(ir * 100).toFixed(2))) + "</p>";
        share.push(T("r_real_emi") + ": " + money(pv));
      }
    } else {
      var m = num("c_m"), gr = num("c_gr") / 100, vr = num("c_vr") / 100;
      var unit = document.getElementById("c_vu").value, comp = document.getElementById("c_vc").checked;
      if (!(m > 0) || !(gr >= 0) || !(vr >= 0)) { show('<p class="cerr">' + D.esc(T("invalid")) + "</p>"); return; }
      var gold = P * (1 + gr * m / 12); // गोल्ड लोन: साधारण ब्याज, अंत में एक साथ चुकाना
      var monthly = unit === "m" ? vr : vr / 12;
      var girvi = comp ? P * Math.pow(1 + monthly, m) : P * (1 + monthly * m);
      var diff = Math.abs(girvi - gold);
      var verdict = Math.round(diff) === 0 ? T("r_same") : gold < girvi ? T("r_cheap_gold", money(diff)) : T("r_cheap_girvi", money(diff));
      out = row(T("r_gold"), money(gold)) + row(T("r_girvi"), money(girvi)) + '<div class="cverdict">' + D.esc(verdict) + "</div>";
      share.push(T("gold_name") + " — " + money(P) + ", " + m + " " + T("f_months"), T("r_gold") + ": " + money(gold), T("r_girvi") + ": " + money(girvi), verdict);
      if (useInfl) {
        var yrs = m / 12;
        out += row(T("r_gold") + " — " + T("r_real"), money(gold / Math.pow(1 + ir, yrs))) +
          row(T("r_girvi") + " — " + T("r_real"), money(girvi / Math.pow(1 + ir, yrs))) +
          '<p class="small">' + D.esc(T("r_real_note", +(ir * 100).toFixed(2))) + "</p>";
      }
    }
    lastShare = share.join("\n");
    show(out + '<p class="small">' + D.esc(T("calc_note")) + "</p>" +
      '<button class="btn btn-wa" id="c_share" type="button">📤 ' + D.esc(T("share_btn")) + "</button>");
  }
  function show(html) { var b = document.getElementById("c_out"); b.innerHTML = html; b.hidden = false; }

  function render() {
    var T = D.T, vid = (D.cfg.calcVideos || {})[cur];
    D.box.innerHTML =
      '<div class="chips ctabs">' + LIST.map(function (k) {
        return '<button class="chip' + (k === cur ? " on" : "") + '" data-calc="' + k + '">' + D.esc(T(k + "_name")) + "</button>";
      }).join("") + "</div>" +
      '<div class="calc"><h3>' + D.esc(T(cur + "_name")) + "</h3>" +
      '<p class="cabout">' + D.esc(T(cur + "_about")) + "</p>" +
      '<div class="cmedia"><button class="btn btn-sm btn-listen" type="button" data-say="1">' + D.esc(T("listen")) + "</button>" +
      (vid ? '<a class="btn btn-sm btn-yt2" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + encodeURIComponent(vid) + '">' + D.esc(T("video_topic")) + "</a>" : "") +
      "</div>" +
      '<form id="c_form" class="cform" novalidate>' + formHtml(cur) +
      '<button class="btn" type="submit">' + D.esc(T("btn_calc")) + "</button></form>" +
      '<p class="small">' + D.esc(T("example_note")) + "</p>" +
      '<div id="c_out" class="cout" hidden></div></div>';
    var v = MEM[cur]; /* पिछली बार भरे गए अंक वापस */
    if (v) Object.keys(v).forEach(function (id) { var el = document.getElementById(id); if (!el) return; if (el.type === "checkbox") el.checked = v[id]; else el.value = v[id]; });
    var ib = document.getElementById("c_infl_box"), ic = document.getElementById("c_infl"); if (ib && ic) ib.hidden = !ic.checked;
    calc();
    remember();
  }
  function remember() {
    var f = document.getElementById("c_form"); if (!f) return; var v = {};
    f.querySelectorAll("input,select").forEach(function (el) { if (el.id) v[el.id] = el.type === "checkbox" ? el.checked : el.value; });
    MEM[cur] = v; MEM.cur = cur; memSave();
  }
  function init(deps) {
    D = deps;
    D.box.addEventListener("click", function (ev) {
      var c = ev.target.closest("[data-calc]");
      if (c) { D.stop(); cur = c.dataset.calc; MEM.cur = cur; memSave(); render(); return; }
      if (ev.target.closest("[data-say]")) { D.speak(D.T(cur + "_name") + ". " + D.T(cur + "_about"), ev.target.closest("[data-say]")); return; }
      if (ev.target.closest("#c_share")) D.share(D.T("calc_head"), lastShare);
    });
    D.box.addEventListener("submit", function (ev) { ev.preventDefault(); calc(); remember(); });
    D.box.addEventListener("change", function (ev) {
      if (ev.target.id === "c_infl") document.getElementById("c_infl_box").hidden = !ev.target.checked;
      if (EXT[cur]) { calc(); remember(); }
    });
    render();
  }
  return { init: init, render: function () { if (D) render(); } };
})();
