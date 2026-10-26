/* समझो भारत ऐप — मुख्य कोड (main code) */
(function () {
  "use strict";
  var C = window.SB_CONFIG;
  var I = window.SB_I18N, T = I.t;
  I.apply();
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var postsById = {};
  var current = null;

  /* ---------- टैब बदलना ---------- */
  var navBtns = document.querySelectorAll(".bottomnav button");
  function showTab(name) {
    navBtns.forEach(function (b) { b.classList.toggle("active", b.dataset.tab === name); });
    document.querySelectorAll(".tab").forEach(function (s) { s.classList.toggle("active", s.id === "tab-" + name); });
    if (name === "video") loadVideos();
    if (name === "quiz") Quiz.start();
    window.scrollTo(0, 0);
    store.set("sb_tab", name);
  }
  navBtns.forEach(function (b) { b.addEventListener("click", function () { showTab(b.dataset.tab); }); });

  /* ---------- ब्लॉग से पोस्ट लाना (Blogger JSON feed) ---------- */
  function feedUrl(label, cb, q) {
    var path = "/feeds/posts/default" + (label ? "/-/" + encodeURIComponent(label) : "");
    return C.blogUrl.replace(/\/$/, "") + path + "?alt=json-in-script&max-results=" + C.maxPosts +
      (q ? "&q=" + encodeURIComponent(q) : "") + "&callback=" + cb;
  }
  function jsonp(url, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var cb = "sbcb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
      var s = document.createElement("script");
      var timer = setTimeout(function () { cleanup(); reject(new Error("timeout")); }, timeoutMs || 12000);
      function cleanup() { clearTimeout(timer); delete window[cb]; s.remove(); }
      window[cb] = function (data) { cleanup(); resolve(data); };
      s.onerror = function () { cleanup(); reject(new Error("network")); };
      s.src = url.replace("__CB__", cb);
      document.head.appendChild(s);
    });
  }
  function bigImage(u) {
    if (!u) return "";
    return u.replace(/\/s72(-[a-z0-9-]+)?\//, "/w640-h360-p-k-no-nu/").replace(/=s72(-[a-z0-9-]+)?$/, "=w640-h360-p-k-no-nu");
  }
  function parseFeed(data) {
    var entries = (data && data.feed && data.feed.entry) || [];
    return entries.map(function (e) {
      var link = (e.link || []).filter(function (l) { return l.rel === "alternate"; })[0];
      var html = (e.content && e.content.$t) || (e.summary && e.summary.$t) || "";
      var img = e.media$thumbnail ? bigImage(e.media$thumbnail.url) : "";
      if (!img) { var m = html.match(/<img[^>]+src="([^"]+)"/i); if (m) img = m[1]; }
      return {
        id: (e.id && e.id.$t) || Math.random().toString(36),
        pid: (((e.id && e.id.$t) || "").match(/post-(\d+)/) || [])[1] || "",
        title: (e.title && e.title.$t) || "—",
        url: link ? link.href : C.blogUrl,
        date: e.published ? e.published.$t : "",
        labels: (e.category || []).map(function (c) { return c.term; }),
        comments: e.thr$total ? +e.thr$total.$t : null,
        img: img,
        html: html
      };
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString(I.get() + "-IN", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return iso.slice(0, 10); }
  }
  /* ---------- लेखों का अनुवाद (Apps Script से तैयार अनुवाद) ---------- */
  var TR = store.get("sbtr_" + I.get());
  var trHtmlCache = {};
  function trPost(p) {
    var e = TR && TR.posts && p.pid ? TR.posts[p.pid] : null;
    if (!e) return { title: p.title, labels: p.labels.map(trLabel), state: "none" };
    if (e.same) return { title: p.title, labels: p.labels.map(trLabel), state: "same" };
    return { title: e.t || p.title, labels: p.labels.map(trLabel), state: "done" };
  }
  /* card वाली तस्वीर की जगह उसी डिज़ाइन का HTML card, पढ़ने वाले की भाषा में */
  function trCard(p) {
    if (I.get() === "hi" || I.get() === "mr") return null;
    var c = TR && TR.static && TR.static.cards && p.pid ? TR.static.cards[p.pid] : null;
    return c && c.headline ? c : null;
  }
  function cardHtml(c, cls) {
    var pts = (c.points || []).map(function (t, k) { return "<li><i>" + (k + 1) + "</i><span>" + esc(t) + "</span></li>"; }).join("");
    return '<div class="xcard ' + cls + '"><div class="xtop"></div><div class="xbrand"><b class="xlogo">' + esc(T("logo_letter")) + "</b><b>" + esc(T("brand")) + "</b></div>" +
      '<div class="xtag">' + esc(c.tag || "") + '</div><div class="xh">' + esc(c.headline) + '</div><div class="xrule"></div><ul class="xpts">' + pts + "</ul>" +
      '<div class="xfoot">' + esc(T("tagline")) + "</div></div>";
  }
  function swapCardImg(html, p) {
    var c = trCard(p); if (!c) return html;
    var done = false;
    return html.replace(/<img\b[^>]*>/i, function () { done = true; return cardHtml(c, "xcard-full"); });
  }
  function trLabel(l) { return (TR && TR.static && TR.static.labels && TR.static.labels[l]) || l; }
  function trStatic(key) { return TR && TR.static ? TR.static[key] : null; }
  /* Apps Script से अनुवाद लाना (cookies के बिना, ताकि कई Google account वाले फ़ोन में भी चले) */
  function trGet(q) {
    return fetch(C.trApi + q, { credentials: "omit" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function loadTr() {
    if (!C.trApi) return;
    var lang = I.get();
    trGet("?a=list&lang=" + lang).then(function (d) {
      if (!d || d.lang !== lang) return;
      TR = d; store.set("sbtr_" + lang, d);
      rerender();
    }).catch(function () {});
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function renderList(el, posts, emptyMsg) {
    if (!posts.length) {
      el.innerHTML = '<div class="empty">' + emptyMsg + '</div>';
      return;
    }
    el.innerHTML = posts.map(function (p, i) {
      postsById[p.id] = p;
      var tp = trPost(p);
      var labels = tp.labels.slice(0, 2).map(function (l) { return '<span class="tag">' + esc(l) + "</span>"; }).join("");
      var xc = trCard(p);
      var img = xc ? cardHtml(xc, i === 0 ? "xcard-hero thumb" : "xcard-mini thumb")
        : p.img ? '<img class="thumb" loading="lazy" alt="" src="' + esc(p.img) + '">'
        : '<div class="thumb ph"><span>' + esc(tp.labels[0] || T("brand")) + "</span></div>";
      return '<button class="card' + (i === 0 && p.img ? " hero" : "") + '" data-id="' + esc(p.id) + '">' + img +
        '<div class="body"><h3>' + esc(tp.title) + '</h3><div class="meta">' + labels + fmtDate(p.date) + "</div></div></button>";
    }).join("");
  }
  function skeleton(el) { el.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>'; }

  function loadSection(key, label, listEl, statusEl, emptyMsg) {
    var cached = store.get(key);
    if (cached && cached.posts) { renderList(listEl, cached.posts, emptyMsg); statusEl.textContent = T("updating"); }
    else skeleton(listEl);
    return jsonp(feedUrl(label, "__CB__")).then(function (data) {
      var posts = parseFeed(data);
      store.set(key, { at: Date.now(), posts: posts });
      if (key === "sb_news" && data.feed && data.feed.category) {
        var labels = data.feed.category.map(function (c) { return c.term; });
        store.set("sb_labels", labels);
        renderChips(labels);
      }
      renderList(listEl, posts, emptyMsg);
      statusEl.textContent = "";
    }).catch(function () {
      if (cached && cached.posts) {
        statusEl.textContent = T("offline");
      } else {
        statusEl.textContent = "";
        listEl.innerHTML = '<div class="empty">' + T("load_fail") + '<br><small class="hint-en">Please check your internet connection.</small>' +
          '<button class="btn" data-retry="1">' + T("retry") + '</button></div>';
      }
    });
  }

  /* ---------- विषय (Labels) और खोज ---------- */
  var newsFilter = null; // {label} या {q}
  function renderChips(labels) {
    labels = (labels || []).filter(function (l) { return l !== C.gyanLabel; });
    var active = newsFilter && newsFilter.label;
    $("chips").innerHTML = '<button class="chip' + (!newsFilter ? " on" : "") + '" data-chip="">' + T("all") + '</button>' +
      labels.map(function (l) {
        return '<button class="chip' + (active === l ? " on" : "") + '" data-chip="' + esc(l) + '">' + esc(trLabel(l)) + "</button>";
      }).join("");
  }
  function showFiltered(filter) {
    newsFilter = filter;
    renderChips(store.get("sb_labels"));
    if (!filter) {
      $("newsHeading").textContent = T("latest");
      var c = store.get("sb_news");
      if (c && c.posts) renderList($("newsList"), c.posts, T("no_news"));
      loadSection("sb_news", "", $("newsList"), $("newsStatus"), T("no_news"));
      return;
    }
    $("newsHeading").textContent = filter.q ? T("search_prefix") + filter.q : trLabel(filter.label);
    $("newsStatus").textContent = "";
    skeleton($("newsList"));
    jsonp(feedUrl(filter.label || "", "__CB__", filter.q)).then(function (data) {
      if (newsFilter !== filter) return;
      renderList($("newsList"), parseFeed(data),
        filter.q ? T("no_results") + "<br><small class='hint-en'>No results. Try another word.</small>" : T("no_label"));
    }).catch(function () {
      $("newsList").innerHTML = '<div class="empty">' + T("load_fail") + '<br><small class="hint-en">Please check your internet connection.</small></div>';
    });
  }
  $("chips").addEventListener("click", function (ev) {
    var b = ev.target.closest(".chip"); if (!b) return;
    $("searchInput").value = "";
    showFiltered(b.dataset.chip ? { label: b.dataset.chip } : null);
  });
  $("searchForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = $("searchInput").value.trim();
    $("searchInput").blur();
    showFiltered(q ? { q: q } : null);
  });
  $("searchInput").addEventListener("search", function () { if (!this.value.trim() && newsFilter) showFiltered(null); });
  renderChips(store.get("sb_labels"));

  function loadAll() {
    if (newsFilter) { showFiltered(newsFilter); }
    var btn = $("refreshBtn");
    btn.classList.add("spin");
    Promise.all([
      newsFilter ? Promise.resolve() : loadSection("sb_news", "", $("newsList"), $("newsStatus"), T("no_news")),
      loadSection("sb_gyan", C.gyanLabel, $("gyanList"), $("gyanStatus"), T("gyan_empty"))
    ]).then(function () { btn.classList.remove("spin"); });
  }

  /* ---------- लेख पढ़ना ---------- */
  function cleanHtml(html) {
    var doc = new DOMParser().parseFromString("<div>" + html + "</div>", "text/html");
    doc.querySelectorAll("script,style,form,object,embed,link,meta,input,button").forEach(function (n) { n.remove(); });
    doc.querySelectorAll("iframe").forEach(function (f) {
      var src = f.getAttribute("src") || "";
      if (!/^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//.test(src)) f.remove();
    });
    doc.querySelectorAll("*").forEach(function (n) {
      Array.prototype.slice.call(n.attributes).forEach(function (a) {
        var nm = a.name.toLowerCase();
        if (nm.indexOf("on") === 0 || nm === "style" || nm === "width" || nm === "height") n.removeAttribute(a.name);
        if ((nm === "href" || nm === "src") && /^\s*javascript:/i.test(a.value)) n.removeAttribute(a.name);
      });
      if (n.tagName === "A") { n.setAttribute("target", "_blank"); n.setAttribute("rel", "noopener"); }
      if (n.tagName === "IMG") n.setAttribute("loading", "lazy");
    });
    return doc.body.firstChild.innerHTML;
  }
  /* Google Translate के पते से लेख किसी भी भाषा में खोलना */
  function translateUrl(url, tl) {
    try {
      var u = new URL(url);
      var host = u.hostname.replace(/-/g, "--").replace(/\./g, "-") + ".translate.goog";
      var q = u.search ? u.search.slice(1) + "&" : "";
      return "https://" + host + u.pathname + "?" + q + "_x_tr_sl=auto&_x_tr_tl=" + tl + "&_x_tr_hl=" + tl + "&_x_tr_pto=wapp";
    } catch (e) { return url; }
  }
  function openPost(p, push) {
    current = p;
    var lang = I.get();
    var postLang = /[\u0900-\u097F]/.test(p.title) ? "hi" : "en";
    var tp = trPost(p);
    var needTr = tp.state === "done" || (tp.state === "none" && lang !== postLang);
    var tr = "";
    if (tp.state === "done") tr = '<p class="small mt">🌐 ' + esc(T("mt_note")) + "</p>";
    else if (needTr) tr = '<p class="small mt">' + esc(T("tr_pending")) + '</p><a class="btn btn-tr" href="' + esc(translateUrl(p.url, lang)) +
      '" target="_blank" rel="noopener">🌐 ' + esc(T("read_lang")) + "</a>";
    var bodyHtml = tp.state === "done" ? (trHtmlCache[lang + p.pid] || '<div class="skeleton"></div><p class="small">' + esc(T("tr_loading")) + "</p>") : cleanHtml(p.html);
    var cm = p.comments ? T("comment_count", p.comments) : T("no_comments");
    $("readerBody").innerHTML =
      "<h1>" + esc(tp.title) + '</h1><div class="meta small">' + fmtDate(p.date) + "</div>" + tr +
      '<div id="postBody">' + bodyHtml + "</div>" +
      '<div class="comments"><h3>💬 ' + esc(T("comments")) + '</h3><p class="small">' + esc(cm) + "</p>" +
      '<a class="btn btn-cm" href="' + esc(p.url.split("#")[0] + "#comments") + '" target="_blank" rel="noopener">' + esc(T("comment_btn")) + "</a>" +
      '<p class="small">' + esc(T("comment_note")) + "</p></div>" +
      '<a class="btn btn-ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(T("read_blog")) + "</a>" +
      '<p class="slogan">' + esc(T("slogan")) + "</p>";
    $("reader").hidden = false;
    $("reader").scrollTop = 0;
    document.body.style.overflow = "hidden";
    if (push !== false) history.pushState({ reader: true }, "");
    if (tp.state === "done" && C.trApi && !trHtmlCache[lang + p.pid]) {
      trGet("?a=post&lang=" + lang + "&id=" + encodeURIComponent(p.pid)).then(function (d) {
        var html = swapCardImg(d && d.h ? cleanHtml(d.h) : cleanHtml(p.html), p);
        if (d && d.h) trHtmlCache[lang + p.pid] = html;
        if (current === p && $("postBody")) $("postBody").innerHTML = html;
      }).catch(function () { if (current === p && $("postBody")) $("postBody").innerHTML = cleanHtml(p.html); });
    }
  }
  function closeReader() {
    $("reader").hidden = true;
    document.body.style.overflow = "";
    current = null;
  }
  document.addEventListener("click", function (ev) {
    var card = ev.target.closest(".card");
    if (card && postsById[card.dataset.id]) { openPost(postsById[card.dataset.id]); return; }
    if (ev.target.closest("[data-retry]")) loadAll();
  });
  $("readerBack").addEventListener("click", function () { history.back(); });
  window.addEventListener("popstate", function () { if (!$("reader").hidden) closeReader(); });
  $("readerShare").addEventListener("click", function () {
    if (!current) return;
    var text = trPost(current).title + "\n\n" + T("tagline") + "\n" + T("share_app") + " " + C.appShareUrl;
    if (navigator.share) navigator.share({ title: current.title, text: text, url: current.url }).catch(function () {});
    else window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + current.url), "_blank");
  });

  /* ---------- वीडियो ---------- */
  var videosLoaded = false;
  function playVideo(v) {
    $("ytFrame").src = "https://www.youtube.com/embed/" + encodeURIComponent(v.id) + "?rel=0&playsinline=1";
    $("ytNow").textContent = v.title;
    document.querySelectorAll(".vitem").forEach(function (b) { b.classList.toggle("playing", b.dataset.vid === v.id); });
  }
  function loadVideos() {
    if (videosLoaded) return;
    videosLoaded = true;
    var tv = trStatic("videos") || [];
    var vids = (C.videos || []).map(function (v) {
      var t = tv.filter(function (x) { return x.id === v.id; })[0];
      return { id: v.id, title: (t && t.title) || v.title };
    });
    if (!vids.length) { $("videoList").innerHTML = '<div class="empty">' + T("v_empty") + '</div>'; return; }
    $("videoList").innerHTML = vids.map(function (v) {
      return '<button class="vitem" data-vid="' + esc(v.id) + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' +
        encodeURIComponent(v.id) + '/mqdefault.jpg"><span>' + esc(v.title) + "</span></button>";
    }).join("");
    $("videoList").addEventListener("click", function (ev) {
      var b = ev.target.closest(".vitem"); if (!b) return;
      var v = vids.filter(function (x) { return x.id === b.dataset.vid; })[0];
      if (v) { playVideo(v); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
    playVideo(vids[0]);
  }

  /* ---------- रोज़ का क्विज़ ---------- */
  var Quiz = (function () {
    var bank = window.SB_QUIZ || [];
    function useBank() {
      var tq = trStatic("quiz");
      bank = tq && tq.length === (window.SB_QUIZ || []).length ? tq : (window.SB_QUIZ || []);
    }
    var qs = [], idx = 0, score = 0, answers = [];
    function todayKey() { // भारतीय समय के हिसाब से आज की तारीख
      var d = new Date(Date.now() + 5.5 * 3600 * 1000);
      return d.toISOString().slice(0, 10);
    }
    function dayNum(key) { return Math.floor(Date.parse(key + "T00:00:00Z") / 86400000); }
    function rng(seed) { return function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }
    function shuffle(arr, r) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
    function todaysQuestions() {
      var n = Math.min(C.quizPerDay || 5, bank.length);
      if (!n) return [];
      var d = dayNum(todayKey());
      var perCycle = Math.floor(bank.length / n) || 1;
      var cycle = Math.floor(d / perCycle), pos = d % perCycle;
      var order = shuffle(bank.map(function (_, i) { return i; }), rng(cycle + 7));
      var r = rng(d + 99);
      return order.slice(pos * n, pos * n + n).map(function (i) {
        var q = bank[i];
        var opts = shuffle(q.o.map(function (t, k) { return { t: t, ok: k === q.a }; }), r);
        return { q: q.q, o: opts, e: q.e };
      });
    }
    function streakInfo() { return store.get("sb_quiz_streak") || { last: "", count: 0 }; }
    function showStreak() {
      var s = streakInfo();
      $("quizStreak").textContent = s.count ? T("q_streak", s.count) : "";
    }
    function start() {
      useBank();
      showStreak();
      var done = store.get("sb_quiz_done");
      if (done && done.date === todayKey()) { result(done.score, done.total, true); return; }
      qs = todaysQuestions(); idx = 0; score = 0; answers = [];
      if (!qs.length) { $("quizBox").innerHTML = '<div class="empty">' + T("q_empty") + '</div>'; return; }
      ask();
    }
    function ask() {
      var q = qs[idx];
      $("quizBox").innerHTML =
        '<div class="qprog"><span>' + T("q_label") + " " + (idx + 1) + " / " + qs.length + '</span><span>' + T("q_score") + ": " + score + '</span></div>' +
        '<div class="qbar"><i style="width:' + (idx / qs.length * 100) + '%"></i></div>' +
        '<h3 class="qtext">' + esc(q.q) + "</h3>" +
        q.o.map(function (o, k) { return '<button class="qopt" data-k="' + k + '">' + esc(o.t) + "</button>"; }).join("") +
        '<div id="qexp"></div>';
    }
    function pick(k) {
      var q = qs[idx];
      if (q.answered) return;
      q.answered = true;
      var ok = q.o[k].ok;
      if (ok) score++;
      document.querySelectorAll(".qopt").forEach(function (b, i) {
        b.disabled = true;
        if (q.o[i].ok) b.classList.add("right");
        else if (i === k) b.classList.add("wrong");
      });
      $("qexp").innerHTML = '<div class="qexp ' + (ok ? "good" : "bad") + '"><b>' + (ok ? T("q_right") : T("q_wrong")) + "</b><br>" + esc(q.e) + "</div>" +
        '<button class="btn" id="qnext">' + (idx + 1 < qs.length ? T("q_next") : T("q_result")) + "</button>";
    }
    function next() {
      idx++;
      if (idx < qs.length) { ask(); window.scrollTo(0, 0); return; }
      var t = todayKey(), s = streakInfo();
      var y = new Date(Date.parse(t + "T00:00:00Z") - 86400000).toISOString().slice(0, 10);
      if (s.last !== t) { s.count = s.last === y ? s.count + 1 : 1; s.last = t; store.set("sb_quiz_streak", s); }
      store.set("sb_quiz_done", { date: t, score: score, total: qs.length });
      showStreak();
      result(score, qs.length, false);
    }
    function result(sc, total, already) {
      var msg = sc === total ? T("q_m4") : sc >= total - 1 ? T("q_m3") : sc >= total / 2 ? T("q_m2") : T("q_m1");
      $("quizBox").innerHTML = '<div class="qresult"><div class="qscore">' + sc + " / " + total + "</div><h3>" + msg + "</h3>" +
        "<p>" + (already ? T("q_already") : T("q_done")) + " " + T("q_tomorrow") + "<br><small class='hint-en'>New questions every day.</small></p>" +
        '<button class="btn btn-wa" id="qshare">' + T("q_share") + '</button></div>';
    }
    function share() {
      var d = store.get("sb_quiz_done") || { score: 0, total: 0 };
      var text = T("share_quiz", d.score + "/" + d.total) + "\n\n" + T("share_app") + " " + C.appShareUrl;
      if (navigator.share) navigator.share({ title: T("brand") + " — " + T("nav_quiz"), text: text }).catch(function () {});
      else window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
    }
    $("quizBox").addEventListener("click", function (ev) {
      var o = ev.target.closest(".qopt"); if (o) { pick(+o.dataset.k); return; }
      if (ev.target.closest("#qnext")) { next(); return; }
      if (ev.target.closest("#qshare")) share();
    });
    return { start: start };
  })();

  /* ---------- सोशल लिंक और तथ्य ---------- */
  function renderStatic() {
    var th = trStatic("handles") || [], tf = trStatic("facts");
    $("linkList").innerHTML = C.links.map(function (l, i) {
      return '<a class="link" style="--c:' + esc(l.color) + '" href="' + esc(l.url) + '" target="_blank" rel="noopener"><b>' +
        esc(l.name) + "</b><span>" + esc(th[i] || l.handle) + "</span></a>";
    }).join("");
    var facts = tf && tf.length === C.facts.length ? tf : C.facts;
    $("factList").innerHTML = facts.map(function (f) { return '<div class="fact">' + esc(f) + "</div>"; }).join("");
  }
  renderStatic();
  /* अनुवाद आने पर सब दोबारा दिखाना */
  function rerender() {
    renderStatic();
    renderChips(store.get("sb_labels"));
    if (newsFilter) showFiltered(newsFilter);
    else { var n = store.get("sb_news"); if (n && n.posts) renderList($("newsList"), n.posts, T("no_news")); }
    var g = store.get("sb_gyan"); if (g && g.posts) renderList($("gyanList"), g.posts, T("gyan_empty"));
    if (videosLoaded) { videosLoaded = false; $("videoList").replaceWith($("videoList").cloneNode(false)); loadVideos(); }
  }

  $("refreshBtn").addEventListener("click", loadAll);

  /* ---------- भाषा चुनना ---------- */
  $("langList").innerHTML = window.SB_LANGS.map(function (l) {
    return '<button class="lang-opt' + (l.code === I.get() ? " on" : "") + '" data-lang="' + l.code + '" lang="' + l.code + '"' +
      (l.rtl ? ' dir="rtl"' : "") + ">" + esc(l.name) + "</button>";
  }).join("");
  $("langBtn").addEventListener("click", function () { $("langSheet").hidden = false; });
  $("langSheet").addEventListener("click", function (ev) {
    var b = ev.target.closest(".lang-opt");
    if (b) {
      if (b.dataset.lang !== I.get()) { I.set(b.dataset.lang); store.set("sb_news", null); location.reload(); return; }
    }
    if (b || ev.target === $("langSheet")) $("langSheet").hidden = true;
  });

  /* ---------- शुरुआत ---------- */
  var startTab = new URLSearchParams(location.search).get("tab") || "news";
  if (["news", "gyan", "quiz", "video", "links"].indexOf(startTab) < 0) startTab = "news";
  showTab(startTab);
  loadAll();
  loadTr();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
