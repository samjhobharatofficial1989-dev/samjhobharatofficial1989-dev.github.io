/* समझो भारत — नए कैलकुलेटर: SIP, FD, RD, PPF, सुकन्या, Income Tax, Home loan prepayment, Retirement, DA
   दरें config.js (SB_CONFIG.rates) से आती हैं; user उन्हें बदल भी सकता है।
   New calculators. Default rates come from config.js and can be edited by the user. */
window.SB_CALC_EXT = (function () {
  "use strict";
  var RT = function () { return (window.SB_CONFIG && window.SB_CONFIG.rates) || {}; };
  function money(x) { return isFinite(x) ? "₹" + Math.round(x).toLocaleString("en-IN") : "—"; }
  function slabTax(inc, slabs) { // slabs: [[upto, rate], ...] last upto = Infinity
    var tax = 0, prev = 0;
    for (var i = 0; i < slabs.length; i++) {
      var up = slabs[i][0], r = slabs[i][1];
      if (inc > prev) tax += (Math.min(inc, up) - prev) * r;
      prev = up;
    }
    return tax;
  }
  function surcharge(taxable, tax, isNew) {
    var r = taxable > 2e7 ? 0.25 : taxable > 1e7 ? 0.15 : taxable > 5e6 ? 0.10 : 0;
    if (taxable > 5e7 && !isNew) r = 0.37;
    return tax * r;
  }
  var L = 1e5;
  var NEW = [[4 * L, 0], [8 * L, .05], [12 * L, .10], [16 * L, .15], [20 * L, .20], [24 * L, .25], [Infinity, .30]];
  function oldSlabs(age) {
    var free = age === "80" ? 5 * L : age === "60" ? 3 * L : 2.5 * L;
    return age === "80" ? [[free, 0], [10 * L, .20], [Infinity, .30]] : [[free, 0], [5 * L, .05], [10 * L, .20], [Infinity, .30]];
  }

  var X = {
    sip: {
      form: function (F) { return F.field("c_p", F.T("f_sip_amt"), 5000) + F.field("c_r", F.T("f_ret"), 12, "0.1") + F.field("c_t", F.T("f_years"), 15, "1") + F.field("c_su", F.T("f_stepup"), 0, "1"); },
      run: function (G) {
        var P = G.n("c_p"), r = G.n("c_r") / 100 / 12, Y = Math.round(G.n("c_t")), su = (G.n("c_su") || 0) / 100;
        if (!(P > 0) || !(r >= 0) || !(Y > 0)) return null;
        var bal = 0, inv = 0, m = P;
        for (var y = 0; y < Y; y++) { for (var k = 0; k < 12; k++) { bal = (bal + m) * (1 + r); inv += m; } m *= 1 + su; }
        return { years: Y, total: bal, rows: [[G.T("r_invested"), money(inv)], [G.T("r_gain"), money(bal - inv)], [G.T("r_total"), money(bal), 1]], note: G.T("sip_note") };
      }
    },
    fd: {
      form: function (F) { return F.field("c_p", F.T("f_amount"), 100000) + F.field("c_r", F.T("f_rate"), 7, "0.01") + F.field("c_t", F.T("f_years"), 3, "0.25"); },
      run: function (G) {
        var P = G.n("c_p"), r = G.n("c_r") / 100, t = G.n("c_t");
        if (!(P > 0) || !(r >= 0) || !(t > 0)) return null;
        var A = P * Math.pow(1 + r / 4, 4 * t);
        return { years: t, total: A, rows: [[G.T("r_interest"), money(A - P)], [G.T("r_total"), money(A), 1]], note: G.T("fd_note") };
      }
    },
    rd: {
      form: function (F) { return F.field("c_p", F.T("f_monthly"), 2000) + F.field("c_r", F.T("f_rate"), RT().rd || 6.7, "0.01") + F.field("c_m", F.T("f_months"), 60, "1"); },
      run: function (G) {
        var P = G.n("c_p"), r = G.n("c_r") / 100, N = Math.round(G.n("c_m"));
        if (!(P > 0) || !(r >= 0) || !(N > 0)) return null;
        var A = 0; // हर किस्त पर तिमाही चक्रवृद्धि
        for (var i = 1; i <= N; i++) A += P * Math.pow(1 + r / 4, 4 * (N - i + 1) / 12);
        return { years: N / 12, total: A, rows: [[G.T("r_invested"), money(P * N)], [G.T("r_interest"), money(A - P * N)], [G.T("r_total"), money(A), 1]], note: G.T("rd_note") };
      }
    },
    ppf: {
      form: function (F) { return F.field("c_p", F.T("f_yearly"), 150000) + F.field("c_r", F.T("f_rate"), RT().ppf || 7.1, "0.01") + F.field("c_t", F.T("f_years"), 15, "1"); },
      run: function (G) {
        var P = G.n("c_p"), r = G.n("c_r") / 100, Y = Math.round(G.n("c_t"));
        if (!(P > 0) || !(r >= 0) || !(Y >= 15)) return { err: G.T("ppf_err") };
        var bal = 0; for (var y = 0; y < Y; y++) bal = (bal + Math.min(P, 150000)) * (1 + r);
        var inv = Math.min(P, 150000) * Y;
        return { years: Y, total: bal, rows: [[G.T("r_invested"), money(inv)], [G.T("r_interest"), money(bal - inv)], [G.T("r_total"), money(bal), 1]], note: G.T("ppf_note", RT().asOf || "") };
      }
    },
    ssy: {
      form: function (F) { return F.field("c_p", F.T("f_yearly"), 50000) + F.field("c_r", F.T("f_rate"), RT().ssy || 8.2, "0.01") + F.field("c_age", F.T("f_girl_age"), 2, "1"); },
      run: function (G) {
        var P = Math.min(G.n("c_p"), 150000), r = G.n("c_r") / 100, a = G.n("c_age");
        if (!(P >= 250) || !(r >= 0) || !(a >= 0) || a > 10) return { err: G.T("ssy_err") };
        var bal = 0; for (var y = 0; y < 21; y++) bal = (bal + (y < 15 ? P : 0)) * (1 + r);
        return { years: 21, total: bal, rows: [[G.T("r_invested"), money(P * 15)], [G.T("r_interest"), money(bal - P * 15)], [G.T("r_total"), money(bal), 1], [G.T("r_ssy_age"), Math.round(a + 21) + " " + G.T("u_yrs")]], note: G.T("ssy_note", RT().asOf || "") };
      }
    },
    tax: {
      infl: false,
      form: function (F) {
        var T = F.T;
        return F.field("c_p", T("f_income"), 1500000) +
          '<label class="ccheck"><input id="c_sal" type="checkbox" checked> <span>' + F.esc(T("f_salaried")) + "</span></label>" +
          '<label class="cf"><span>' + F.esc(T("f_age")) + '</span><select id="c_ag"><option value="0">' + F.esc(T("ag0")) + '</option><option value="60">' + F.esc(T("ag60")) + '</option><option value="80">' + F.esc(T("ag80")) + "</option></select></label>" +
          '<p class="small">' + F.esc(T("tax_old_ded")) + "</p>" +
          F.field("c_80c", T("f_80c"), 150000) + F.field("c_80d", T("f_80d"), 25000) + F.field("c_hra", T("f_hra"), 0) + F.field("c_hl", T("f_hl"), 0) + F.field("c_nps", T("f_nps"), 0) + F.field("c_oth", T("f_oth"), 0);
      },
      run: function (G) {
        var I = G.n("c_p"), sal = G.el("c_sal").checked, age = G.el("c_ag").value;
        if (!(I >= 0)) return null;
        var v = function (id, max) { var x = G.n(id); x = x > 0 ? x : 0; return max ? Math.min(x, max) : x; };
        // नई व्यवस्था
        var tn = Math.max(0, I - (sal ? 75000 : 0));
        var nt = slabTax(tn, NEW);
        if (tn <= 12 * L) nt = 0; else nt = Math.min(nt, tn - 12 * L); // 87A छूट, और 12 लाख के ठीक ऊपर marginal relief
        nt += surcharge(tn, nt, true); nt *= 1.04;
        // पुरानी व्यवस्था
        var ded = (sal ? 50000 : 0) + v("c_80c", 150000) + v("c_80d") + v("c_hra") + v("c_hl", 200000) + v("c_nps", 50000) + v("c_oth");
        var to = Math.max(0, I - ded);
        var ot = slabTax(to, oldSlabs(age));
        if (to <= 5 * L) ot = Math.max(0, ot - 12500);
        ot += surcharge(to, ot, false); ot *= 1.04;
        var better = Math.abs(nt - ot) < 1 ? G.T("tax_same") : nt < ot ? G.T("tax_new_better", money(ot - nt)) : G.T("tax_old_better", money(nt - ot));
        return { rows: [[G.T("r_tax_new"), money(nt), nt <= ot], [G.T("r_taxable_new"), money(tn)], [G.T("r_tax_old"), money(ot), ot < nt], [G.T("r_taxable_old"), money(to)]], verdict: better, note: G.T("tax_note") };
      }
    },
    prepay: {
      infl: false,
      form: function (F) { return F.field("c_p", F.T("f_loan_left"), 3000000) + F.field("c_r", F.T("f_rate"), 8.5, "0.01") + F.field("c_m", F.T("f_months_left"), 240, "1") + F.field("c_pp", F.T("f_prepay"), 200000); },
      run: function (G) {
        var P = G.n("c_p"), R = G.n("c_r") / 1200, N = Math.round(G.n("c_m")), X = G.n("c_pp");
        if (!(P > 0) || !(R > 0) || !(N > 0) || !(X > 0) || X >= P) return null;
        var emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
        var intBefore = emi * N - P;
        var B = P - X, n2 = Math.ceil(-Math.log(1 - B * R / emi) / Math.log(1 + R));
        var intAfter = emi * n2 - B;
        var emi2 = B * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1), intAfter2 = emi2 * N - B;
        return { rows: [[G.T("r_emi"), money(emi)], [G.T("r_pp_save_tenure"), money(intBefore - intAfter), 1], [G.T("r_pp_months"), (N - n2) + " " + G.T("f_months_u")],
          [G.T("r_pp_save_emi"), money(intBefore - intAfter2)], [G.T("r_pp_new_emi"), money(emi2)]], verdict: G.T("pp_verdict"), note: G.T("pp_note") };
      }
    },
    retire: {
      infl: false,
      form: function (F) { return F.field("c_a", F.T("f_age_now"), 35, "1") + F.field("c_ra", F.T("f_age_ret"), 60, "1") + F.field("c_ex", F.T("f_expense"), 30000) + F.field("c_ir", F.T("f_infl_rate"), 6, "0.1") + F.field("c_r1", F.T("f_ret_pre"), 11, "0.1") + F.field("c_r2", F.T("f_ret_post"), 7, "0.1") + F.field("c_le", F.T("f_life"), 85, "1") + F.field("c_have", F.T("f_have"), 0); },
      run: function (G) {
        var a = G.n("c_a"), ra = G.n("c_ra"), ex = G.n("c_ex"), inf = G.n("c_ir") / 100, r1 = G.n("c_r1") / 100, r2 = G.n("c_r2") / 100, le = G.n("c_le"), have = G.n("c_have") || 0;
        if (!(ra > a) || !(le > ra) || !(ex > 0)) return null;
        var yrs = ra - a, exRet = ex * 12 * Math.pow(1 + inf, yrs), n = le - ra;
        var g = (1 + r2) / (1 + inf) - 1; // महँगाई के बाद असली रिटर्न
        var corpus = Math.abs(g) < 1e-9 ? exRet * n : exRet * (1 - Math.pow(1 + g, -n)) / g * (1 + g);
        var fvHave = have * Math.pow(1 + r1, yrs), need = Math.max(0, corpus - fvHave), rm = r1 / 12, M = yrs * 12;
        var sip = need === 0 ? 0 : rm === 0 ? need / M : need * rm / ((Math.pow(1 + rm, M) - 1) * (1 + rm));
        return { rows: [[G.T("r_exp_then"), money(exRet / 12) + " / " + G.T("u_month_s")], [G.T("r_corpus"), money(corpus), 1], [G.T("r_have_then"), money(fvHave)], [G.T("r_sip_need"), money(sip) + " / " + G.T("u_month_s"), 1]], note: G.T("ret_note") };
      }
    },
    da: {
      infl: false,
      form: function (F) { return F.field("c_p", F.T("f_basic"), 35400) + F.field("c_r", F.T("f_da_now"), RT().da || 60, "1") + F.field("c_r2", F.T("f_da_new"), (RT().da || 60) + 3, "1"); },
      run: function (G) {
        var B = G.n("c_p"), d1 = G.n("c_r") / 100, d2 = G.n("c_r2") / 100;
        if (!(B > 0) || !(d1 >= 0) || !(d2 >= 0)) return null;
        var diff = B * (d2 - d1);
        return { rows: [[G.T("r_da_now"), money(B * d1)], [G.T("r_da_new"), money(B * d2)], [G.T("r_da_diff"), money(diff) + " / " + G.T("u_month_s"), 1], [G.T("r_da_year"), money(diff * 12)]], note: G.T("da_note", RT().daNote || "") };
      }
    }
  };
  return X;
})();

/* शब्द (हिंदी + English) */
(function () {
  var S = {
    hi: {
      sip_name: "SIP / म्यूचुअल फ़ंड", sip_about: "SIP में हर महीने तय रकम लगती है। लंबे समय में रिटर्न पर भी रिटर्न मिलता है। Step-up का मतलब है हर साल किस्त थोड़ी बढ़ाना।",
      fd_name: "बैंक FD", fd_about: "FD में एक बार पैसा जमा होता है और तय ब्याज मिलता है। ज़्यादातर बैंक ब्याज हर तिमाही जोड़ते हैं।",
      rd_name: "RD (हर महीने जमा)", rd_about: "RD में हर महीने तय रकम जमा होती है। डाकघर की 5 साल वाली RD की दर पहले से भरी है, बैंक की दर अलग हो सकती है।",
      ppf_name: "PPF", ppf_about: "PPF 15 साल की सरकारी बचत योजना है। साल में ₹500 से ₹1.5 लाख तक जमा कर सकते हैं। ब्याज और रकम पर टैक्स नहीं लगता।",
      ssy_name: "सुकन्या समृद्धि", ssy_about: "बेटी (10 साल से कम उम्र) के लिए सरकारी योजना। 15 साल पैसा जमा होता है, खाता 21 साल में पूरा होता है।",
      tax_name: "Income Tax: नई या पुरानी?", tax_about: "अपनी सालाना कमाई और छूट (deductions) डालें। ऐप दोनों व्यवस्थाओं में टैक्स निकालकर बताएगा कि आपके लिए कौन-सी सस्ती है।",
      prepay_name: "Home loan prepayment", prepay_about: "लोन में बीच में एकमुश्त पैसा जमा करने से कितना ब्याज बचेगा, और कितने महीने पहले लोन ख़त्म होगा।",
      retire_name: "रिटायरमेंट प्लान", retire_about: "आज का महीने का ख़र्च रिटायरमेंट तक महँगाई से कितना हो जाएगा, उसके लिए कितनी रकम चाहिए, और अभी से हर महीने कितनी SIP करनी होगी।",
      da_name: "DA (महँगाई भत्ता)", da_about: "सरकारी कर्मचारी अपना मूल वेतन (Basic Pay) डालें। DA बढ़ने पर हर महीने कितना ज़्यादा मिलेगा, यह देखें।",
      f_sip_amt: "हर महीने की SIP (₹)", f_ret: "अनुमानित रिटर्न (% सालाना)", f_stepup: "हर साल SIP बढ़ाएँ (%)", f_monthly: "हर महीने जमा (₹)", f_yearly: "हर साल जमा (₹)",
      f_girl_age: "बेटी की अभी उम्र (साल)", f_income: "सालाना कुल कमाई (₹)", f_salaried: "मैं नौकरीपेशा/पेंशनभोगी हूँ (standard deduction मिलेगा)",
      f_age: "उम्र", ag0: "60 साल से कम", ag60: "60 से 79 साल", ag80: "80 साल या ज़्यादा",
      tax_old_ded: "नीचे की छूट सिर्फ़ पुरानी व्यवस्था में मिलती हैं:", f_80c: "80C (PF, PPF, LIC, ELSS आदि, अधिकतम ₹1.5 लाख)", f_80d: "80D (स्वास्थ्य बीमा)",
      f_hra: "HRA छूट (₹)", f_hl: "होम लोन ब्याज (अधिकतम ₹2 लाख)", f_nps: "NPS 80CCD(1B) (अधिकतम ₹50,000)", f_oth: "बाकी छूट (₹)",
      f_loan_left: "बचा हुआ लोन (₹)", f_months_left: "बचे हुए महीने", f_prepay: "एकमुश्त जमा (₹)", f_months_u: "महीने",
      f_age_now: "आपकी अभी उम्र", f_age_ret: "रिटायरमेंट की उम्र", f_expense: "आज का महीने का ख़र्च (₹)", f_ret_pre: "रिटायरमेंट तक निवेश पर रिटर्न (%)",
      f_ret_post: "रिटायरमेंट के बाद रिटर्न (%)", f_life: "कितनी उम्र तक का हिसाब", f_have: "अभी तक जमा रकम (₹)",
      f_basic: "मूल वेतन / Basic Pay (₹ महीना)", f_da_now: "अभी का DA (%)", f_da_new: "नया DA (%)",
      r_invested: "कुल जमा", r_gain: "कुल फ़ायदा", r_ssy_age: "पैसा पूरा मिलेगा जब बेटी की उम्र होगी", u_yrs: "साल", u_month_s: "महीना",
      r_tax_new: "नई व्यवस्था में टैक्स", r_tax_old: "पुरानी व्यवस्था में टैक्स", r_taxable_new: "नई व्यवस्था में टैक्स वाली आय", r_taxable_old: "पुरानी व्यवस्था में टैक्स वाली आय",
      tax_new_better: "आपके लिए नई व्यवस्था सस्ती है, {n} बचेंगे", tax_old_better: "आपके लिए पुरानी व्यवस्था सस्ती है, {n} बचेंगे", tax_same: "दोनों में टैक्स लगभग बराबर है",
      r_pp_save_tenure: "EMI वही रखें तो ब्याज की बचत", r_pp_months: "लोन इतने पहले ख़त्म होगा", r_pp_save_emi: "समय वही रखें (EMI घटाएँ) तो बचत", r_pp_new_emi: "नई EMI",
      pp_verdict: "EMI वही रखकर समय घटाने में आम तौर पर ज़्यादा ब्याज बचता है।",
      r_exp_then: "रिटायरमेंट पर महीने का ख़र्च", r_corpus: "रिटायरमेंट पर ज़रूरी कुल रकम", r_have_then: "अभी की जमा रकम तब तक बनेगी", r_sip_need: "अभी से हर महीने ज़रूरी SIP",
      r_da_now: "अभी का DA (महीना)", r_da_new: "नया DA (महीना)", r_da_diff: "हर महीने बढ़ोतरी", r_da_year: "साल भर में बढ़ोतरी",
      sip_note: "बाज़ार का रिटर्न तय नहीं होता। यह सिर्फ़ अनुमान है।", fd_note: "तिमाही चक्रवृद्धि मानकर। ब्याज पर टैक्स लग सकता है।", rd_note: "तिमाही चक्रवृद्धि मानकर (डाकघर/बैंक RD का आम तरीका)।",
      ppf_note: "भरी गई दर {n} की है। सरकार हर तिमाही दर तय करती है। हर साल 5 अप्रैल से पहले जमा मानकर।", ppf_err: "PPF कम से कम 15 साल का होता है और जमा रकम ₹500 से ज़्यादा होनी चाहिए।",
      ssy_note: "भरी गई दर {n} की है, आगे बदल सकती है। साल में ₹250 से ₹1.5 लाख तक जमा।", ssy_err: "बेटी की उम्र 10 साल से कम और जमा रकम ₹250 या ज़्यादा होनी चाहिए।",
      tax_note: "वित्त वर्ष 2026-27 की दरें। 4% सेस जोड़ा गया है। नई व्यवस्था में ₹12 लाख तक टैक्स वाली आय पर छूट (87A) है। यह अनुमान है; ITR भरने से पहले CA या incometax.gov.in से मिलान करें।",
      pp_note: "ब्याज दर बीच में न बदले, यह मानकर।", ret_note: "महँगाई और रिटर्न अनुमान हैं। हर कुछ साल में प्लान दोबारा जाँचें।",
      da_note: "{n} DA बढ़ने पर बकाया (arrears) भी मिलता है। HRA और बाकी भत्ते अलग हैं।"
    },
    en: {
      sip_name: "SIP / Mutual fund", sip_about: "In a SIP you invest a fixed amount every month. Over time, returns also earn returns. Step-up means raising the SIP a little every year.",
      fd_name: "Bank FD", fd_about: "In an FD you deposit once and earn fixed interest. Most banks add interest every quarter.",
      rd_name: "RD (monthly deposit)", rd_about: "In an RD you deposit a fixed amount every month. The post office 5-year RD rate is filled in; bank rates may differ.",
      ppf_name: "PPF", ppf_about: "PPF is a 15-year government savings scheme. Deposit ₹500 to ₹1.5 lakh a year. Interest and maturity are tax-free.",
      ssy_name: "Sukanya Samriddhi", ssy_about: "A government scheme for a daughter under 10. You deposit for 15 years; the account matures in 21 years.",
      tax_name: "Income tax: new or old?", tax_about: "Enter your yearly income and deductions. The app works out tax in both regimes and shows which is cheaper for you.",
      prepay_name: "Home loan prepayment", prepay_about: "How much interest a lump-sum prepayment saves, and how many months earlier the loan ends.",
      retire_name: "Retirement plan", retire_about: "How big today's monthly expense becomes by retirement, the corpus you need, and the monthly SIP to start now.",
      da_name: "DA (Dearness Allowance)", da_about: "Government employees: enter your basic pay to see how much more you get each month when DA rises.",
      f_sip_amt: "Monthly SIP (₹)", f_ret: "Expected return (% a year)", f_stepup: "Raise SIP every year (%)", f_monthly: "Monthly deposit (₹)", f_yearly: "Yearly deposit (₹)",
      f_girl_age: "Daughter's age now (years)", f_income: "Total yearly income (₹)", f_salaried: "I am salaried / a pensioner (standard deduction applies)",
      f_age: "Age", ag0: "Below 60", ag60: "60 to 79", ag80: "80 or above",
      tax_old_ded: "These deductions apply only in the old regime:", f_80c: "80C (PF, PPF, LIC, ELSS etc., max ₹1.5 lakh)", f_80d: "80D (health insurance)",
      f_hra: "HRA exemption (₹)", f_hl: "Home loan interest (max ₹2 lakh)", f_nps: "NPS 80CCD(1B) (max ₹50,000)", f_oth: "Other deductions (₹)",
      f_loan_left: "Loan outstanding (₹)", f_months_left: "Months left", f_prepay: "Lump-sum prepayment (₹)", f_months_u: "months",
      f_age_now: "Your age now", f_age_ret: "Retirement age", f_expense: "Monthly expense today (₹)", f_ret_pre: "Return till retirement (%)",
      f_ret_post: "Return after retirement (%)", f_life: "Plan up to age", f_have: "Savings so far (₹)",
      f_basic: "Basic pay (₹ per month)", f_da_now: "Current DA (%)", f_da_new: "New DA (%)",
      r_invested: "Total invested", r_gain: "Total gain", r_ssy_age: "Full amount paid when daughter is", u_yrs: "years", u_month_s: "month",
      r_tax_new: "Tax in new regime", r_tax_old: "Tax in old regime", r_taxable_new: "Taxable income (new)", r_taxable_old: "Taxable income (old)",
      tax_new_better: "The new regime is cheaper for you; you save {n}", tax_old_better: "The old regime is cheaper for you; you save {n}", tax_same: "Tax is about the same in both",
      r_pp_save_tenure: "Interest saved (keep EMI, cut tenure)", r_pp_months: "Loan ends earlier by", r_pp_save_emi: "Interest saved (keep tenure, lower EMI)", r_pp_new_emi: "New EMI",
      pp_verdict: "Keeping the same EMI and cutting the tenure usually saves more interest.",
      r_exp_then: "Monthly expense at retirement", r_corpus: "Corpus needed at retirement", r_have_then: "Your savings will grow to", r_sip_need: "Monthly SIP needed from now",
      r_da_now: "Current DA (monthly)", r_da_new: "New DA (monthly)", r_da_diff: "Increase per month", r_da_year: "Increase per year",
      sip_note: "Market returns are not fixed. This is only an estimate.", fd_note: "Assumes quarterly compounding. Interest may be taxable.", rd_note: "Assumes quarterly compounding (usual for post office/bank RDs).",
      ppf_note: "Rate filled in is for {n}. The government sets it every quarter. Assumes deposits before 5 April each year.", ppf_err: "PPF runs at least 15 years and the deposit must be at least ₹500.",
      ssy_note: "Rate filled in is for {n} and may change. Deposit ₹250 to ₹1.5 lakh a year.", ssy_err: "Daughter must be under 10 and the deposit at least ₹250.",
      tax_note: "FY 2026-27 rates, including 4% cess. New regime: no tax on taxable income up to ₹12 lakh (87A). This is an estimate; check with a CA or incometax.gov.in before filing.",
      pp_note: "Assumes the interest rate does not change.", ret_note: "Inflation and returns are estimates. Review the plan every few years.",
      da_note: "{n} Arrears are also paid when DA rises. HRA and other allowances are separate."
    }
  };
  Object.keys(S).forEach(function (l) { var t = window.SB_STR[l]; if (!t) return; Object.keys(S[l]).forEach(function (k) { if (!t[k]) t[k] = S[l][k]; }); });
})();
