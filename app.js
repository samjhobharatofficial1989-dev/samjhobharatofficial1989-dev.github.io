/* समझो भारत ऐप — मुख्य कोड (main code) — संस्करण 1.5 */
(function () {
  "use strict";
  var C = window.SB_CONFIG;
  var I = window.SB_I18N, T = I.t;
  I.apply();
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); }
      catch (e) { // जगह भर गई तो पुराने सेक्शन की कॉपी हटाकर दोबारा कोशिश
        try { Object.keys(localStorage).forEach(function (x) { if (x.indexOf("sb_sec_") === 0 && x !== k) localStorage.removeItem(x); }); localStorage.setItem(k, JSON.stringify(v)); } catch (e2) {}
      }
    }
  };
  var postsById = {};
  var current = null;
  var SECS = C.sections && C.sections.length ? C.sections : [{ key: "news", name: "sec_news", labels: [] }];

  /* ---------- टैब बदलना ---------- */
  var TABS = ["news", "gyan", "calc", "quiz", "video", "links"];
  var navBtns = document.querySelectorAll(".bottomnav button");
  function showTab(name) {
    navBtns.forEach(function (b) {
      var on = b.dataset.tab === name;
      b.classList.toggle("active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    document.querySelectorAll(".tab").forEach(function (s) { s.classList.toggle("active", s.id === "tab-" + name); });
    if (name === "video") loadVideos();
    if (name === "quiz") Quiz.start();
    if (name === "links") renderLinksExtra();
    if (name !== "calc") Speech.stop();
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
    return html.replace(/<img\b[^>]*>/i, function () { return cardHtml(c, "xcard-full"); });
  }
  /* कुछ Label के अपने तय नाम (मशीन अनुवाद से बेहतर), बाकी Apps Script के अनुवाद से */
  function trLabel(l) {
    var fixed = window.SB_STR[I.get()] && window.SB_STR[I.get()]["lbl:" + l];
    return fixed || (TR && TR.static && TR.static.labels && TR.static.labels[l]) || l;
  }
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

  function autoThumb(p, tp) { var th = window.SBP.theme(p); var t = String(tp.title || ""), cut = t.indexOf(":"); var short = cut > 3 && cut < 40 ? t.slice(0, cut) : t; return '<div class="thumb auto at-' + th.c + '" aria-hidden="true"><b class="ai">' + th.i + '</b><span class="at">' + esc(short) + "</span></div>"; } function renderList(el, posts, emptyMsg) {
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
        : autoThumb(p, tp);
      var star = isSaved(p) ? '<span class="star" aria-hidden="true">★</span>' : "";
      var rd = window.SBP.isRead(p);
      var snip = p.summary && tp.state !== "done" ? '<p class="snip">' + esc(p.summary) + "</p>" : "";
      return '<button class="card' + (i === 0 && p.img ? " hero" : "") + (rd ? " isread" : "") + '" data-id="' + esc(p.id) + '">' + img +
        '<div class="body"><span class="h3" role="heading" aria-level="3">' + star + esc(tp.title) + "</span>" + snip + '<div class="meta">' + labels + fmtDate(p.date) +
        (rd ? ' <span class="rdmark">✓ ' + esc(T("read_mark")) + "</span>" : "") + "</div></div></button>";
    }).join("");
  }
  function skeleton(el) { el.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>'; }

  /* ---------- सेक्शन (ताज़ा खबरें, सरकारी योजनाएँ, पैसा, Technology और AI, राजनीति) ---------- */
  function secByKey(k) { return SECS.filter(function (s) { return s.key === k; })[0]; }
  function mergePosts(lists) {
    var seen = {}, all = [];
    lists.forEach(function (l) { (l || []).forEach(function (p) { if (!seen[p.id]) { seen[p.id] = 1; all.push(p); } }); });
    all.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    return all.slice(0, C.maxPosts);
  }
  /* एक सेक्शन में कई Label हो सकते हैं — हर Label की पोस्ट लाकर जोड़ते हैं */
  function fetchSection(sec) {
    if (!sec.labels || !sec.labels.length) { // ताज़ा खबरें: पहले हल्की सूची (data/news.json), न मिले तो सीधे Blogger से
      return loadNewsJson().then(function (slim) {
        if (slim && slim.length) return slim;
        return jsonp(feedUrl("", "__CB__")).then(function (d) {
          if (d.feed && d.feed.category) store.set("sb_labels", d.feed.category.map(function (c) { return c.term; }));
          return parseFeed(d);
        });
      });
    }
    return Promise.all(sec.labels.map(function (l) {
      return jsonp(feedUrl(l, "__CB__")).then(parseFeed).catch(function () { return null; });
    })).then(function (rs) {
      if (rs.every(function (r) { return r === null; })) throw new Error("network");
      return mergePosts(rs);
    });
  }
  /* इंटरनेट न हो तो फ़ोन में सहेजी सभी पोस्ट में से इस सेक्शन की पोस्ट निकालना */
  function offlinePool() {
    var lists = SECS.map(function (s) { var c = store.get("sb_sec_" + s.key); return c && c.posts; });
    var g = store.get("sb_gyan"); lists.push(g && g.posts); lists.push(store.get("sb_saved"));
    if (feedJson && feedJson.posts) lists.push(feedJson.posts);
    var seen = {}, all = [];
    lists.forEach(function (l) { (l || []).forEach(function (p) { if (p && !seen[p.id]) { seen[p.id] = 1; all.push(p); } }); });
    all.sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    return all;
  }
  function offlineFor(sec) {
    var pool = offlinePool();
    if (!sec.labels || !sec.labels.length) return pool.slice(0, C.maxPosts);
    return pool.filter(function (p) { return p.labels.some(function (l) { return sec.labels.indexOf(l) >= 0; }); }).slice(0, C.maxPosts);
  }
  var feedJson = null; // GitHub पर हर आधे घंटे बनने वाली ऑफ़लाइन कॉपी (data/feed.json)
  function loadFeedJson() {
    return fetch("data/feed.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { feedJson = d; document.dispatchEvent(new Event("sb:news")); return d; }).catch(function () { return null; });
  }
  /* GitHub पर बनने वाली हल्की खबर-सूची (data/news.json): सिर्फ़ शीर्षक, 2 पंक्ति का सार, तारीख, Label, तस्वीर — पूरा लेख खोलने पर आता है */
  function loadNewsJson() {
    return fetch("data/news.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (list) {
        if (!Array.isArray(list)) return null;
        return list.filter(function (it) { return it && it.title; }).map(function (it) {
          return { id: it.id || it.url, pid: it.pid || "", title: it.title, url: it.url || C.blogUrl, date: it.date || "", labels: it.labels || [],
            comments: null, img: it.img || "", summary: it.summary || "", html: "" };
        });
      }).catch(function () { return null; });
  }
  /* हल्की सूची में लेख का पूरा HTML नहीं होता — खोलते समय ही लाना: पहले feed.json / सहेजे लेख से, फिर Blogger से */
  function fillHtml(p) {
    if (p.html) return Promise.resolve(p.html);
    var pick = function (list) { return (list || []).filter(function (x) { return x && x.html && (x.id === p.id || (p.pid && x.pid === p.pid)); })[0]; };
    var hit = pick(feedJson && feedJson.posts) || pick(store.get("sb_saved"));
    var ready = hit ? Promise.resolve(hit.html) : !p.pid ? Promise.reject(new Error("no pid")) :
      jsonp(C.blogUrl.replace(/\/$/, "") + "/feeds/posts/default/" + encodeURIComponent(p.pid) + "?alt=json-in-script&callback=__CB__").then(function (d) {
        var e = d && d.entry, html = e ? ((e.content && e.content.$t) || (e.summary && e.summary.$t) || "") : "";
        if (!html) throw new Error("empty");
        if (e.thr$total) p.comments = +e.thr$total.$t;
        return html;
      });
    return ready.then(function (html) { p.html = html; return html; });
  }

  var curSec = "news";
  var newsFilter = null; // {q} = खोज
  function renderChips() {
    var html = '<button class="chip chip-fy' + (!newsFilter && curSec === "foryou" ? " on" : "") + '" data-sec="foryou">' + esc(T("sec_foryou")) + "</button>";
    html += SECS.map(function (s) {
      return '<button class="chip' + (!newsFilter && curSec === s.key ? " on" : "") + '" data-sec="' + esc(s.key) + '">' + esc(T(s.name)) + "</button>";
    }).join("");
    html += '<button class="chip chip-saved' + (!newsFilter && curSec === "saved" ? " on" : "") + '" data-sec="saved">' + esc(T("sec_saved")) + "</button>";
    $("chips").innerHTML = html;
  }
  function loadSection(key, quiet) {
    var sec = secByKey(key); if (!sec) return Promise.resolve();
    var show = function () { return !quiet && !newsFilter && curSec === key; };
    var cached = store.get("sb_sec_" + key);
    if (show()) {
      $("newsHeading").textContent = T(sec.name);
      if (cached && cached.posts) { renderList($("newsList"), cached.posts, T("no_label")); $("newsStatus").textContent = T("updating"); }
      else skeleton($("newsList"));
    }
    return fetchSection(sec).then(function (posts) {
      store.set("sb_sec_" + key, { at: Date.now(), posts: posts });
      if (key === "news") document.dispatchEvent(new Event("sb:news"));
      if (show()) { renderList($("newsList"), posts, key === "news" ? T("no_news") : T("no_label")); $("newsStatus").textContent = ""; }
      return posts;
    }).catch(function () {
      if (!show()) return;
      var posts = cached && cached.posts ? cached.posts : offlineFor(sec);
      if (posts.length) { renderList($("newsList"), posts, T("no_label")); $("newsStatus").textContent = T("offline"); }
      else {
        $("newsStatus").textContent = "";
        $("newsList").innerHTML = '<div class="empty">' + T("load_fail") + '<br><small class="hint-en">Please check your internet connection.</small>' +
          '<button class="btn" data-retry="1">' + T("retry") + '</button></div>';
      }
    });
  }
  function showSaved() {
    $("newsHeading").textContent = T("sec_saved");
    $("newsStatus").textContent = "";
    renderList($("newsList"), store.get("sb_saved") || [], T("saved_empty"));
  }
  function showForYou() {
    $("newsHeading").textContent = T("foryou_head");
    $("newsStatus").textContent = "";
    var list = window.SBP.forYou(offlinePool(), C.maxPosts);
    renderList($("newsList"), list, T("no_news"));
    $("newsList").insertAdjacentHTML("afterbegin", '<p class="small fynote">' + esc(T("foryou_note")) + "</p>");
  }
  function showCurrent() {
    if (curSec === "saved") showSaved(); else if (curSec === "foryou") showForYou(); else loadSection(curSec);
  }
  function openSection(key) {
    newsFilter = null; curSec = key;
    $("searchInput").value = "";
    window.SBP.setChip(key);
    renderChips();
    showCurrent();
    renderPersonal();
  }
  function showSearch(q) {
    var filter = { q: q };
    newsFilter = filter;
    renderChips();
    $("newsHeading").textContent = T("search_prefix") + q;
    $("newsStatus").textContent = "";
    skeleton($("newsList"));
    jsonp(feedUrl("", "__CB__", q)).then(function (data) {
      if (newsFilter !== filter) return;
      renderList($("newsList"), parseFeed(data), T("no_results") + "<br><small class='hint-en'>No results. Try another word.</small>");
    }).catch(function () {
      if (newsFilter !== filter) return;
      var ql = q.toLowerCase();
      var found = offlinePool().filter(function (p) { return (p.title + " " + (p.html || p.summary || "")).toLowerCase().indexOf(ql) >= 0; });
      if (found.length) { renderList($("newsList"), found, ""); $("newsStatus").textContent = T("offline"); }
      else $("newsList").innerHTML = '<div class="empty">' + T("load_fail") + '<br><small class="hint-en">Please check your internet connection.</small></div>';
    });
  }
  $("chips").addEventListener("click", function (ev) {
    var b = ev.target.closest(".chip"); if (!b) return;
    openSection(b.dataset.sec);
  });
  $("searchForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = $("searchInput").value.trim();
    $("searchInput").blur();
    if (q) showSearch(q); else openSection(curSec === "saved" ? "news" : curSec);
  });
  $("searchInput").addEventListener("search", function () { if (!this.value.trim() && newsFilter) openSection(curSec); });
  renderChips();

  function loadGyan() {
    var cached = store.get("sb_gyan");
    if (cached && cached.posts) { renderList($("gyanList"), cached.posts, T("gyan_empty")); $("gyanStatus").textContent = T("updating"); }
    else skeleton($("gyanList"));
    return jsonp(feedUrl(C.gyanLabel, "__CB__")).then(function (d) {
      var posts = parseFeed(d);
      store.set("sb_gyan", { at: Date.now(), posts: posts });
      renderList($("gyanList"), posts, T("gyan_empty")); $("gyanStatus").textContent = "";
    }).catch(function () {
      if (cached && cached.posts) $("gyanStatus").textContent = T("offline");
      else {
        var off = offlinePool().filter(function (p) { return p.labels.indexOf(C.gyanLabel) >= 0; });
        renderList($("gyanList"), off, T("load_fail")); $("gyanStatus").textContent = off.length ? T("offline") : "";
      }
    });
  }

  /* सबसे पहले खुला सेक्शन, फिर बाकी सेक्शन चुपचाप लाकर फ़ोन में सहेजना (ताकि बाद में बिना इंटरनेट भी पढ़ सकें) */
  function loadAll() {
    var btn = $("refreshBtn");
    btn.classList.add("spin");
    var first = newsFilter ? Promise.resolve() : curSec === "saved" ? Promise.resolve(showSaved()) : curSec === "foryou" ? Promise.resolve(showForYou()) : loadSection(curSec);
    Promise.all([first, loadGyan()]).then(function () {
      btn.classList.remove("spin");
      return SECS.reduce(function (p, s) {
        return p.then(function () { if (s.key !== curSec) return loadSection(s.key, true).catch(function () {}); });
      }, Promise.resolve());
    }).then(function () { if (curSec === "foryou" && !newsFilter && $("reader").hidden) showForYou(); prefetchOffline(); });
  }
  /* ऑफ़लाइन: हर सेक्शन की पहली तस्वीरें और (दूसरी भाषा हो तो) अनुवादित लेख पहले से ले आना */
  function prefetchOffline() {
    if (!navigator.onLine) return;
    var pool = offlinePool(), imgs = 0;
    pool.slice(0, 40).forEach(function (p) {
      if (p.img && imgs < 40) { imgs++; var im = new Image(); im.src = p.img; }
    });
    if (C.trApi && I.get() !== "hi" && I.get() !== "en") {
      pool.slice(0, 8).forEach(function (p, i) {
        if (trPost(p).state === "done") setTimeout(function () { trGet("?a=post&lang=" + I.get() + "&id=" + encodeURIComponent(p.pid)).catch(function () {}); }, 1500 * (i + 1));
      });
    }
    store.set("sb_offline_count", pool.length);
    renderLinksExtra();
    Notify.syncState(pool);
  }

  /* ---------- लेख पढ़ना ---------- */
  function ytId(u) {
    var m = String(u || "").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
  function cleanHtml(html) {
    var doc = new DOMParser().parseFromString("<div>" + (html || "") + "</div>", "text/html");
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
    /* लेख में YouTube का लिंक हो पर वीडियो न लगा हो, तो वीडियो ऊपर ही चला दें (लेख + वीडियो + ऑडियो एक जगह) */
    var root = doc.body.firstChild;
    if (!root.querySelector("iframe")) {
      var a = Array.prototype.filter.call(root.querySelectorAll("a[href]"), function (x) { return ytId(x.getAttribute("href")); })[0];
      if (a) {
        var box = doc.createElement("div"); box.className = "pvideo";
        box.innerHTML = '<iframe loading="lazy" allowfullscreen allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube.com/embed/' +
          ytId(a.getAttribute("href")) + '?rel=0&playsinline=1"></iframe>';
        root.insertBefore(box, root.firstChild);
      }
    }
    return root.innerHTML;
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
  var readLang = "hi";
  function openPost(p, push) {
    Speech.stop();
    current = p;
    var lang = I.get();
    var postLang = /[ऀ-ॿ]/.test(p.title) ? "hi" : "en";
    var tp = trPost(p);
    var needTr = tp.state === "done" || (tp.state === "none" && lang !== postLang);
    readLang = tp.state === "done" ? lang : postLang;
    var tr = "";
    if (tp.state === "done") tr = '<p class="small mt">🌐 ' + esc(T("mt_note")) + "</p>";
    else if (needTr) tr = '<p class="small mt">' + esc(T("tr_pending")) + '</p><a class="btn btn-tr" href="' + esc(translateUrl(p.url, lang)) +
      '" target="_blank" rel="noopener">🌐 ' + esc(T("read_lang")) + "</a>";
    var bodyHtml = tp.state === "done" ? (trHtmlCache[lang + p.pid] || '<div class="skeleton"></div><p class="small">' + esc(T("tr_loading")) + "</p>")
      : p.html ? cleanHtml(p.html) : '<div class="skeleton"></div><div class="skeleton"></div>';
    var cm = p.comments ? T("comment_count", p.comments) : T("no_comments");
    $("readerBody").innerHTML =
      "<h1>" + esc(tp.title) + '</h1>' +
      '<div class="src-line small"><b>' + esc(T("src_publisher")) + ":</b> " + esc(T("src_team")) + " · <b>" + esc(T("src_published")) + ":</b> " + fmtDate(p.date) +
      '<br><b>' + esc(T("src_original")) + ':</b> <a href="' + esc(p.url) + '" target="_blank" rel="noopener">samjhobharatofficial.blogspot.com</a> · <a href="contact.html">' + esc(T("contact_head")) + "</a></div>" + tr +
      '<div class="rtools"><button class="btn btn-sm btn-listen" type="button" id="listenBtn">' + esc(T("listen")) + "</button>" +
      '<button class="btn btn-sm btn-ghost2" type="button" id="saveBtn2"></button></div>' +
      '<div id="postBody">' + bodyHtml + "</div>" +
      '<div class="comments"><h3>💬 ' + esc(T("comments")) + '</h3><p class="small">' + esc(cm) + "</p>" +
      '<a class="btn btn-cm" href="' + esc(p.url.split("#")[0] + "#comments") + '" target="_blank" rel="noopener">' + esc(T("comment_btn")) + "</a>" +
      '<p class="small">' + esc(T("comment_note")) + "</p></div>" +
      '<button class="btn btn-wa" type="button" id="shareBtn2">📤 ' + esc(T("share_btn")) + "</button>" +
      '<button class="btn btn-card" type="button" id="cardBtn2">🖼️ ' + esc(T("card_btn")) + "</button>" +
      '<a class="btn btn-ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(T("read_blog")) + "</a>" +
      '<p class="slogan">' + esc(T("slogan")) + "</p>";
    updateSaveBtns();
    window.SBP.track(p);
    $("reader").hidden = false;
    $("reader").scrollTop = 0;
    var pr = window.SBP.progress();
    if (pr && pr.id === p.id) setTimeout(function () { var r = $("reader"); r.scrollTop = pr.pct * (r.scrollHeight - r.clientHeight); }, 400);
    document.body.style.overflow = "hidden";
    if (push !== false) history.pushState({ reader: true }, "");
    if (tp.state === "done" && C.trApi && !trHtmlCache[lang + p.pid]) {
      trGet("?a=post&lang=" + lang + "&id=" + encodeURIComponent(p.pid)).then(function (d) {
        var html = swapCardImg(d && d.h ? cleanHtml(d.h) : cleanHtml(p.html), p);
        if (d && d.h) trHtmlCache[lang + p.pid] = html;
        if (current === p && $("postBody")) $("postBody").innerHTML = html;
      }).catch(function () { if (current === p && $("postBody")) { $("postBody").innerHTML = cleanHtml(p.html); readLang = postLang; } });
    } else if (!p.html) { // हल्की सूची से खुला लेख: पूरा HTML अब लाना
      fillHtml(p).then(function (html) {
        if (current === p && $("postBody")) $("postBody").innerHTML = cleanHtml(html);
      }).catch(function () {
        if (current === p && $("postBody")) $("postBody").innerHTML = '<p class="small">' + esc(T("load_fail")) + '</p><a class="btn btn-ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(T("read_blog")) + "</a>";
      });
    }
  }
  function readPct() { var r = $("reader"); var h = r.scrollHeight - r.clientHeight; return h > 0 ? r.scrollTop / h : 1; }
  var progT = null;
  $("reader").addEventListener("scroll", function () {
    if (!current) return; clearTimeout(progT);
    var p = current; progT = setTimeout(function () { window.SBP.saveProgress(p, readPct()); }, 400);
  });
  function closeReader() {
    if (current) window.SBP.saveProgress(current, readPct());
    Speech.stop();
    $("reader").hidden = true;
    document.body.style.overflow = "";
    current = null;
    renderPersonal();
    if (curSec === "foryou" && !newsFilter) showForYou();
    else { var n = curSec !== "saved" && store.get("sb_sec_" + curSec); if (n && n.posts && !newsFilter) renderList($("newsList"), n.posts, T("no_label")); }
  }
  document.addEventListener("click", function (ev) {
    var card = ev.target.closest(".card");
    if (card && postsById[card.dataset.id]) { openPost(postsById[card.dataset.id]); return; }
    if (ev.target.closest("[data-retry]")) { loadAll(); return; }
    if (ev.target.closest("#listenBtn")) {
      var b = $("postBody");
      if (b) Speech.toggle(($("readerBody").querySelector("h1").textContent || "") + ". " + b.innerText, readLang, $("listenBtn"));
      return;
    }
    if (ev.target.closest("#saveBtn2")) { toggleSave(); return; }
    if (ev.target.closest("#shareBtn2")) { sharePost(); return; }
    if (ev.target.closest("#cardBtn2") && current && window.SB_CARD) {
      var tp2 = trPost(current);
      window.SB_CARD.open(current, tp2.title, $("postBody").innerHTML, (tp2.labels || []).filter(function (l) { return l && l !== C.gyanLabel; })[0] || "", shareText(tp2.title, current.url));
      return;
    }
  });
  $("readerBack").addEventListener("click", function () { history.back(); });
  window.addEventListener("popstate", function () { if (!$("reader").hidden) closeReader(); });

  /* ---------- शेयर (हर शेयर में tagline, ऐप का लिंक और समापन पंक्ति) ---------- */
  function shareText(title, link) {
    return title + (link ? "\n" + link : "") + "\n\n" + T("tagline") + "\n📲 " + T("share_app") + " " + C.appShareUrl + "\n" + T("slogan");
  }
  function doShare(title, text) {
    if (navigator.share) navigator.share({ title: title, text: text }).catch(function () {});
    else window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }
  function sharePost() {
    if (!current) return;
    doShare(current.title, shareText(trPost(current).title, current.url));
  }
  $("readerShare").addEventListener("click", sharePost);

  /* ---------- लेख सहेजना (Bookmark) — फ़ोन में ही, बिना इंटरनेट भी खुलेंगे ---------- */
  function savedList() { return store.get("sb_saved") || []; }
  function isSaved(p) { return savedList().some(function (x) { return x.id === p.id; }); }
  function toggleSave() {
    if (!current) return;
    var list = savedList();
    if (isSaved(current)) list = list.filter(function (x) { return x.id !== current.id; });
    else list.unshift(current);
    store.set("sb_saved", list.slice(0, 100));
    updateSaveBtns();
    if (curSec === "saved" && !newsFilter) showSaved();
  }
  function updateSaveBtns() {
    if (!current) return;
    var on = isSaved(current);
    $("readerSave").innerHTML = on ? "★" : "☆";
    $("readerSave").setAttribute("aria-label", on ? T("saved") : T("save"));
    $("readerSave").classList.toggle("on", on);
    if ($("saveBtn2")) $("saveBtn2").textContent = (on ? "★ " + T("saved") : "☆ " + T("save"));
  }
  $("readerSave").addEventListener("click", toggleSave);

  /* ---------- अक्षर का आकार (Text size) ---------- */
  var SIZES = [1, 1.15, 1.3, 0.9];
  function applySize() {
    var i = store.get("sb_fs") || 0;
    document.documentElement.style.setProperty("--rs", SIZES[i] || 1);
  }
  $("readerFont").addEventListener("click", function () {
    var i = ((store.get("sb_fs") || 0) + 1) % SIZES.length;
    store.set("sb_fs", i); applySize();
  });
  applySize();

  /* ---------- सुनें (Text-to-speech) — फ़ोन की अपनी आवाज़ से लेख पढ़कर सुनाना ---------- */
  var Speech = (function () {
    var LC = { hi: "hi-IN", en: "en-IN", bn: "bn-IN", mr: "mr-IN", te: "te-IN", ta: "ta-IN", gu: "gu-IN", ur: "ur-IN", kn: "kn-IN", or: "or-IN", ml: "ml-IN", pa: "pa-IN" };
    var queue = [], btn = null, on = false;
    var ok = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    function voiceFor(lang) {
      var vs = ok ? speechSynthesis.getVoices() : [];
      var want = LC[lang] || lang;
      var exact = vs.filter(function (v) { return v.lang.replace("_", "-").toLowerCase() === want.toLowerCase(); })[0];
      return { v: exact || vs.filter(function (v) { return v.lang.toLowerCase().indexOf(lang) === 0; })[0] || null, any: vs.length > 0 };
    }
    function chunks(text) {
      var parts = String(text).replace(/\s+/g, " ").split(/(?<=[।.!?॥؟])\s+/), out = [];
      parts.forEach(function (s) {
        while (s.length > 220) { var cut = s.lastIndexOf(" ", 220); if (cut < 60) cut = 220; out.push(s.slice(0, cut)); s = s.slice(cut); }
        if (s.trim()) out.push(s);
      });
      return out;
    }
    function setBtn(state) { if (btn) btn.textContent = state ? T("stop") : T("listen"); }
    function next(lang, voice) {
      if (!on || !queue.length) { stop(); return; }
      var u = new SpeechSynthesisUtterance(queue.shift());
      u.lang = LC[lang] || lang; if (voice) u.voice = voice;
      u.rate = 0.95;
      u.onend = function () { next(lang, voice); };
      u.onerror = function () { stop(); };
      speechSynthesis.speak(u);
    }
    function start(text, lang, b) {
      stop();
      if (!ok) { alert(T("no_voice")); return; }
      var f = voiceFor(lang);
      if (!f.v && f.any) { alert(T("no_voice")); return; }
      btn = b; on = true; queue = chunks(text); setBtn(true);
      next(lang, f.v);
    }
    function stop() {
      on = false; queue = [];
      if (ok) { try { speechSynthesis.cancel(); } catch (e) {} }
      setBtn(false); btn = null;
    }
    if (ok && speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = function () {};
    if (ok) speechSynthesis.getVoices();
    return { start: start, stop: stop, toggle: function (text, lang, b) { if (on && btn === b) stop(); else start(text, lang, b); } };
  })();

  /* ---------- वीडियो (GitHub हर आधे घंटे YouTube से नई सूची बनाता है: data/videos.json) ---------- */
  var videosLoaded = false, vids = [];
  function playVideo(v) {
    $("ytFrame").src = "https://www.youtube.com/embed/" + encodeURIComponent(v.id) + "?rel=0&playsinline=1";
    $("ytNow").textContent = v.title;
    $("ytFrame").dataset.vid = v.id;
    document.querySelectorAll(".vitem").forEach(function (b) { b.classList.toggle("playing", b.dataset.vid === v.id); });
  }
  function videoList() {
    return fetch("data/videos.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) { store.set("sb_videos", d); return d; })
      .catch(function () { return store.get("sb_videos"); })
      .then(function (d) {
        var seen = {}, list = [];
        var add = function (v) { if (v && v.id && !seen[v.id]) { seen[v.id] = 1; list.push({ id: v.id, title: v.title || "" }); } };
        ((d && d.videos) || []).forEach(add);
        (C.videos || []).forEach(add);
        return list;
      });
  }
  function loadVideos() {
    if (videosLoaded) return;
    videosLoaded = true;
    videoList().then(function (list) {
      var tv = trStatic("videos") || [];
      vids = list.map(function (v) {
        var t = tv.filter(function (x) { return x.id === v.id; })[0];
        var c = (C.videos || []).filter(function (x) { return x.id === v.id; })[0];
        return { id: v.id, title: (t && t.title) || (c && c.title) || v.title };
      });
      if (!vids.length) { $("videoList").innerHTML = '<div class="empty">' + T("v_empty") + '</div>'; return; }
      $("videoList").innerHTML = vids.map(function (v) {
        return '<button class="vitem" data-vid="' + esc(v.id) + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' +
          encodeURIComponent(v.id) + '/mqdefault.jpg"><span>' + esc(v.title) + "</span></button>";
      }).join("");
      playVideo(vids[0]);
    });
  }
  $("videoList").addEventListener("click", function (ev) {
    var b = ev.target.closest(".vitem"); if (!b) return;
    var v = vids.filter(function (x) { return x.id === b.dataset.vid; })[0];
    if (v) { playVideo(v); window.scrollTo({ top: 0, behavior: "smooth" }); }
  });
  $("videoShare").addEventListener("click", function () {
    var id = $("ytFrame").dataset.vid; if (!id) return;
    doShare(T("brand"), shareText($("ytNow").textContent, "https://youtu.be/" + id));
  });

  /* ---------- रोज़ का क्विज़ ---------- */
  var Quiz = (function () {
    var bank = window.SB_QUIZ || [];
    function useBank() {
      var tq = trStatic("quiz");
      bank = tq && tq.length === (window.SB_QUIZ || []).length ? tq : (window.SB_QUIZ || []);
    }
    var qs = [], idx = 0, score = 0;
    function todayKey() { // भारतीय समय के हिसाब से आज की तारीख
      var d = new Date(Date.now() + 5.5 * 3600 * 1000);
      return d.toISOString().slice(0, 10);
    }
    function dayNum(key) { return Math.floor(Date.parse(key + "T00:00:00Z") / 86400000); }
    function rng(seed) { return function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }
    function shuffle(arr, r) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }
    /* बड़ों वाले सवाल (quiz2.js): हिंदी/मराठी पढ़ने वालों को हिंदी, बाकी को English */
    function adultBank() {
      var hi = I.get() === "hi" || I.get() === "mr";
      return (window.SB_QUIZ2 || []).map(function (q) { return { q: hi ? q.q : q.qe, o: hi ? q.o : q.oe, a: q.a, e: hi ? q.e : q.ee, c: q.c }; });
    }
    function pickDay(list, n, salt, d) {
      if (!n || !list.length) return [];
      var perCycle = Math.floor(list.length / n) || 1;
      var cycle = Math.floor(d / perCycle), pos = d % perCycle;
      var order = shuffle(list.map(function (_, i) { return i; }), rng(cycle + salt));
      return order.slice(pos * n, pos * n + n).map(function (i) { return list[i]; });
    }
    function prep(list, r) {
      return list.map(function (q) { return { q: q.q, o: shuffle(q.o.map(function (t, k) { return { t: t, ok: k === q.a }; }), r), e: q.e }; });
    }
    /* आज के 5 सवाल: 4 बड़ों वाले (पैसा, कानून, योजनाएँ, संविधान, साइबर) + 1 सामान्य ज्ञान */
    function todaysQuestions() {
      var n = C.quizPerDay || 5, d = dayNum(todayKey()), ad = adultBank();
      var nAd = ad.length ? Math.min(n - 1, ad.length) : 0;
      var list = pickDay(ad, nAd, 31, d).concat(pickDay(bank, n - nAd, 7, d));
      return prep(list, rng(d + 99));
    }
    var mode = "day";
    function renderCats() {
      var box = $("quizCats"); if (!box) return;
      box.innerHTML = ["day"].concat(window.SB_QUIZ2_CATS || []).map(function (c) {
        return '<button type="button" class="chip' + (mode === c ? " on" : "") + '" data-qcat="' + c + '">' + esc(T("qc_" + c)) + "</button>";
      }).join("");
    }
    function startCat(c) {
      mode = c; store.set("sb_quiz_cat", c); renderCats();
      var list = adultBank().filter(function (q) { return q.c === c; });
      var r = rng(Date.now() % 2147483647);
      qs = prep(shuffle(list, r).slice(0, 5), r); idx = 0; score = 0;
      if (!qs.length) { $("quizBox").innerHTML = '<div class="empty">' + T("q_empty") + "</div>"; return; }
      ask();
      $("quizBox").insertAdjacentHTML("afterbegin", '<p class="small">' + esc(T("q_cat_note")) + "</p>");
    }
    function streakInfo() { return store.get("sb_quiz_streak") || { last: "", count: 0 }; }
    function showStreak() {
      var s = streakInfo();
      $("quizStreak").textContent = s.count ? T("q_streak", s.count) : "";
    }
    function start() {
      mode = "day"; renderCats();
      useBank();
      showStreak();
      var done = store.get("sb_quiz_done");
      if (done && done.date === todayKey()) { result(done.score, done.total, true); return; }
      qs = todaysQuestions(); idx = 0; score = 0;
      if (!qs.length) { $("quizBox").innerHTML = '<div class="empty">' + T("q_empty") + '</div>'; return; }
      ask();
    }
    function ask() {
      var q = qs[idx];
      $("quizBox").innerHTML =
        '<div class="qprog"><span>' + T("q_label") + " " + (idx + 1) + " / " + qs.length + '</span><span>' + T("q_score") + ": " + score + '</span></div>' +
        '<div class="qbar"><i style="width:' + (idx / qs.length * 100) + '%"></i></div>' +
        '<h3 class="qtext">' + esc(q.q) + "</h3>" +
        q.o.map(function (o, k) { var t = String(o.t); t = t.charAt(0).toUpperCase() + t.slice(1); return '<button class="qopt" data-k="' + k + '">' + esc(t) + "</button>"; }).join("") +
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
      if (mode !== "day") { pracResult(); return; }
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
        '<button class="btn btn-wa" id="qshare">' + T("q_share") + '</button>' +
        '<div class="certbox"><h3>🏅 ' + esc(T("cert_head")) + '</h3><label class="cf"><span>' + esc(T("cert_name")) + '</span><input id="certName" type="text" maxlength="40" autocomplete="name" value="' +
        esc((window.SBP.profile().name) || "") + '"></label><button class="btn" id="qcert" type="button">' + esc(T("cert_make")) + '</button><div id="certOut"></div></div></div>';
    }
    function pracResult() {
      var total = qs.length, msg = score === total ? T("q_m4") : score >= total - 1 ? T("q_m3") : score >= total / 2 ? T("q_m2") : "";
      $("quizBox").innerHTML = '<div class="qresult"><div class="qscore">' + score + " / " + total + "</div><h3>" + msg + "</h3><p>" + esc(T("q_prac_done")) + "</p>" +
        '<button class="btn" type="button" data-qcat="' + mode + '">🔁 ' + esc(T("q_again")) + '</button> <button class="btn btn-ghost2" type="button" data-qcat="day">' + esc(T("qc_day")) + "</button>" +
        '<button class="btn btn-wa" type="button" id="qpshare">' + T("q_share") + "</button></div>";
    }
    /* क्विज़ का प्रमाणपत्र (फ़ोन में ही बनता है, कहीं भेजा नहीं जाता) */
    function makeCert() {
      var d = store.get("sb_quiz_done") || { score: 0, total: 0, date: todayKey() };
      var name = ($("certName").value || "").trim();
      if (!name) { $("certName").focus(); return; }
      var pr = window.SBP.profile(); pr.name = name; window.SBP.saveProfile(pr);
      var st = streakInfo();
      var W = 1600, H = 1130, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      var x = cv.getContext("2d");
      var draw = function () {
        x.fillStyle = "#fffaf2"; x.fillRect(0, 0, W, H);
        x.strokeStyle = "#0B2545"; x.lineWidth = 18; x.strokeRect(30, 30, W - 60, H - 60);
        x.strokeStyle = "#FF9933"; x.lineWidth = 6; x.strokeRect(62, 62, W - 124, H - 124);
        x.fillStyle = "#FF9933"; x.fillRect(62, 62, W - 124, 22); x.fillStyle = "#138808"; x.fillRect(62, H - 84, W - 124, 22);
        x.textAlign = "center"; x.fillStyle = "#0B2545";
        x.beginPath(); x.arc(W / 2, 190, 62, 0, 7); x.fillStyle = "#FF9933"; x.fill(); x.lineWidth = 6; x.strokeStyle = "#0B2545"; x.stroke();
        x.fillStyle = "#0B2545"; x.font = "700 64px Mukta, sans-serif"; x.fillText(T("logo_letter"), W / 2, 212);
        x.font = "700 46px Mukta, sans-serif"; x.fillText(T("brand"), W / 2, 310);
        x.fillStyle = "#b45309"; x.font = "700 74px Mukta, sans-serif"; x.fillText(T("cert_title"), W / 2, 410);
        x.fillStyle = "#334155"; x.font = "400 38px Mukta, sans-serif"; x.fillText(T("cert_line1"), W / 2, 490);
        x.fillStyle = "#0B2545"; x.font = "700 86px Mukta, sans-serif"; x.fillText(name, W / 2, 600);
        x.strokeStyle = "#FF9933"; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2 - 360, 630); x.lineTo(W / 2 + 360, 630); x.stroke();
        x.fillStyle = "#334155"; x.font = "400 38px Mukta, sans-serif"; x.fillText(T("cert_line2"), W / 2, 700);
        x.fillStyle = "#138808"; x.font = "700 92px Mukta, sans-serif"; x.fillText(d.score + " / " + d.total, W / 2, 810);
        x.fillStyle = "#334155"; x.font = "400 34px Mukta, sans-serif";
        x.fillText(T("cert_date") + ": " + fmtDate(d.date + "T12:00:00") + (st.count > 1 ? "   •   " + T("q_streak", st.count) : ""), W / 2, 880);
        x.fillStyle = "#0B2545"; x.font = "700 40px Mukta, sans-serif"; x.fillText(T("tagline"), W / 2, 960);
        x.fillStyle = "#64748b"; x.font = "400 26px Mukta, sans-serif"; x.fillText(T("cert_foot"), W / 2, 1010);
        cv.toBlob(function (blob) {
          var url = URL.createObjectURL(blob), fn = "SamjhoBharat-Quiz-" + d.date + ".png";
          $("certOut").innerHTML = '<img class="certimg" alt="" src="' + url + '"><div class="onb-btns"><a class="btn" download="' + fn + '" href="' + url + '">⬇ ' + esc(T("cert_dl")) +
            '</a><button class="btn btn-wa" type="button" id="certShare">📤 ' + esc(T("share_btn")) + "</button></div>";
          $("certShare").onclick = function () {
            var file = new File([blob], fn, { type: "image/png" });
            var txt = T("share_quiz", d.score + "/" + d.total) + "\n" + T("tagline") + "\n📲 " + C.appShareUrl;
            if (navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], text: txt }).catch(function () {});
            else doShare(T("brand"), txt);
          };
        }, "image/png");
      };
      if (document.fonts && document.fonts.load) Promise.all([document.fonts.load("700 40px Mukta"), document.fonts.load("400 40px Mukta")]).then(draw, draw); else draw();
    }
    function share() {
      var d = store.get("sb_quiz_done") || { score: 0, total: 0 };
      doShare(T("brand") + " — " + T("nav_quiz"), shareText(T("share_quiz", d.score + "/" + d.total), ""));
    }
    $("quizBox").addEventListener("click", function (ev) {
      var o = ev.target.closest(".qopt"); if (o) { pick(+o.dataset.k); return; }
      if (ev.target.closest("#qnext")) { next(); return; }
      if (ev.target.closest("#qshare")) share();
      if (ev.target.closest("#qpshare")) doShare(T("brand") + " — " + T("nav_quiz"), shareText(T("q_prac_share", T("qc_" + mode)) + " " + score + "/" + qs.length, ""));
      if (ev.target.closest("#qcert")) makeCert();
    });
    document.addEventListener("click", function (ev) {
      var c = ev.target.closest("[data-qcat]"); if (!c) return;
      if (c.dataset.qcat === "day") { store.set("sb_quiz_cat", "day"); start(); } else startCat(c.dataset.qcat);
      window.scrollTo(0, 0);
    });
    return { start: start };
  })();

  /* ---------- सूचना (Notifications) ---------- */
  var Notify = (function () {
    function supported() { return "Notification" in window && "serviceWorker" in navigator; }
    function state() { return supported() ? Notification.permission : "unsup"; }
    function post(msg) {
      if (!("serviceWorker" in navigator)) return;
      navigator.serviceWorker.ready.then(function (reg) { if (reg.active) reg.active.postMessage(msg); }).catch(function () {});
    }
    /* SW को बताना: भाषा, सूचना के शब्द, और कौन-सी पोस्ट पढ़ने वाला पहले ही देख चुका है */
    function syncState(pool) {
      post({ type: "state", lang: I.get(), on: state() === "granted" && store.get("sb_notif") !== false,
        s: { brand: T("brand"), news: T("notif_new"), tap: T("notif_tap") },
        seen: (pool || []).map(function (p) { return p.pid; }).filter(Boolean).slice(0, 60) });
    }
    function registerSync() {
      return navigator.serviceWorker.ready.then(function (reg) {
        if (!("periodicSync" in reg)) return;
        return navigator.permissions.query({ name: "periodic-background-sync" }).then(function (st) {
          if (st.state === "granted") return reg.periodicSync.register("sb-news", { minInterval: 60 * 60 * 1000 });
        });
      }).catch(function () {});
    }
    function enable() {
      if (!supported()) { render(); return; }
      Notification.requestPermission().then(function (p) {
        store.set("sb_notif", p === "granted");
        if (p === "granted") registerSync();
        syncState(offlinePool());
        render();
      });
    }
    function render() {
      var st = state();
      var dismissed = store.get("sb_notif_ask_off");
      $("notifBanner").hidden = !(st === "default" && !dismissed);
      var box = $("notifBox"); if (!box) return;
      var html = "<h3>" + esc(T("notif_title")) + "</h3>";
      if (st === "granted") html += '<p class="okline">' + esc(T("notif_enabled")) + "</p>";
      else if (st === "denied") html += "<p>" + esc(T("notif_blocked")) + "</p>";
      else if (st === "unsup") html += "<p>" + esc(T("notif_unsup")) + "</p>";
      else html += "<p>" + esc(T("notif_ask")) + '</p><button class="btn" type="button" data-notif-on="1">' + esc(T("notif_on")) + "</button>";
      html += '<p class="small">' + esc(T("notif_note")) + "</p>";
      box.innerHTML = html;
    }
    document.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-notif-on]")) { enable(); return; }
      if (ev.target.closest("[data-notif-later]")) { store.set("sb_notif_ask_off", true); render(); }
    });
    if (state() === "granted") registerSync();
    return { render: render, syncState: syncState };
  })();

  /* ---------- सोशल लिंक, तथ्य, ऑफ़लाइन गिनती, ऐप शेयर ---------- */
  function renderStatic() {
    var th = trStatic("handles") || [], tf = trStatic("facts");
    $("linkList").innerHTML = C.links.map(function (l, i) {
      return '<a class="link" style="--c:' + esc(l.color) + '" href="' + esc(l.url) + '" target="_blank" rel="noopener"><b>' +
        esc(l.name) + "</b><span>" + esc(th[i] || l.handle) + "</span></a>";
    }).join("");
    var facts = tf && tf.length === C.facts.length ? tf : C.facts;
    $("factList").innerHTML = facts.map(function (f) { return '<div class="fact">' + esc(f) + "</div>"; }).join("");
  }
  function renderLinksExtra() {
    var n = store.get("sb_offline_count") || 0;
    $("offlineInfo").textContent = n ? T("offline_ready", n) : "";
    Notify.render();
  }
  $("shareApp").addEventListener("click", function () {
    doShare(T("brand"), T("brand") + " — " + T("share_app_text") + "\n\n" + T("tagline") + "\n📲 " + C.appShareUrl + "\n" + T("slogan"));
  });
  renderStatic();

  /* ---------- कैलकुलेटर ---------- */
  if (window.SB_CALC) window.SB_CALC.init({
    T: T, esc: esc, cfg: C, box: $("calcBox"),
    speak: function (text, b) { Speech.toggle(text, I.get(), b); }, stop: function () { Speech.stop(); },
    share: function (title, text) { doShare(title, text + "\n\n" + T("tagline") + "\n📲 " + T("share_app") + " " + C.appShareUrl + "\n" + T("slogan")); }
  });

  /* अनुवाद आने पर सब दोबारा दिखाना */
  function rerender() {
    renderStatic();
    renderChips();
    if (newsFilter) showSearch(newsFilter.q);
    else if (curSec === "saved") showSaved();
    else if (curSec === "foryou") showForYou();
    else { var n = store.get("sb_sec_" + curSec); if (n && n.posts) renderList($("newsList"), n.posts, T("no_label")); }
    var g = store.get("sb_gyan"); if (g && g.posts) renderList($("gyanList"), g.posts, T("gyan_empty"));
    if (videosLoaded) { videosLoaded = false; loadVideos(); }
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
      if (b.dataset.lang !== I.get()) { I.set(b.dataset.lang); location.reload(); return; }
    }
    if (b || ev.target === $("langSheet")) $("langSheet").hidden = true;
  });

  /* ---------- याद रखने वाले हिस्से का UI ---------- */
  var STATES = ["अंडमान और निकोबार","आंध्र प्रदेश","अरुणाचल प्रदेश","असम","बिहार","चंडीगढ़","छत्तीसगढ़","दादरा नगर हवेली और दमन दीव","दिल्ली","गोवा","गुजरात","हरियाणा","हिमाचल प्रदेश","जम्मू-कश्मीर","झारखंड","कर्नाटक","केरल","लद्दाख","लक्षद्वीप","मध्य प्रदेश","महाराष्ट्र","मणिपुर","मेघालय","मिज़ोरम","नागालैंड","ओडिशा","पुडुचेरी","पंजाब","राजस्थान","सिक्किम","तमिलनाडु","तेलंगाना","त्रिपुरा","उत्तर प्रदेश","उत्तराखंड","पश्चिम बंगाल"];
  var ROLES = ["job", "govt", "biz", "farmer", "student", "home", "senior"];
  function renderPersonal() {
    var box = $("personalBox");
    if (!box) { $("chips").insertAdjacentHTML("beforebegin", '<div id="personalBox"></div>'); box = $("personalBox"); }
    var html = "", pr = window.SBP.progress();
    if (pr && pr.post) {
      postsById[pr.post.id] = pr.post;
      html += '<div class="contread"><button class="card cr-open" data-id="' + esc(pr.post.id) + '"><div class="body"><span class="small">📖 ' + esc(T("cont_read")) +
        " · " + Math.round(pr.pct * 100) + '%</span><h3>' + esc(trPost(pr.post).title) + '</h3><div class="crbar"><i style="width:' + Math.round(pr.pct * 100) + '%"></i></div></div></button>' +
        '<button class="crx" type="button" data-crx="1" aria-label="' + esc(T("cont_close")) + '">✕</button></div>';
    }
    if (!window.SBP.hasTaste() && window.SBP.onbDone()) html += '<div class="nbanner"><span>' + esc(T("taste_ask")) + '</span><span class="nbtns"><button class="btn btn-sm" type="button" data-onb="1">' + esc(T("taste_btn")) + "</button></span></div>";
    box.innerHTML = html;
  }
  function renderHelplines() {
    var H = [["1930", "h_cyber"], ["112", "h_emerg"], ["181", "h_women"], ["1098", "h_child"], ["14567", "h_elder"], ["1915", "h_consumer"], ["139", "h_rail"], ["108", "h_amb"], ["14416", "h_tele"]];
    var html = '<div class="helpbox"><h3>' + esc(T("help_head")) + '</h3><p class="small">' + esc(T("help_note")) + '</p><div class="helpgrid">' +
      H.map(function (h) { return '<a class="hl" href="tel:' + h[0] + '"><b>' + h[0] + "</b><span>" + esc(T(h[1])) + "</span></a>"; }).join("") + "</div></div>";
    var g = $("tab-gyan"), old = $("helpBox");
    if (old) old.outerHTML = '<div id="helpBox">' + html + "</div>";
    else g.querySelector(".section-head").insertAdjacentHTML("beforebegin", '<div id="helpBox">' + html + "</div>");
  }
  function renderMyData() {
    var html = "<h3>" + esc(T("my_head")) + '</h3><p class="small">' + esc(T("my_note")) + '</p><button class="btn btn-sm" type="button" data-onb="1">' + esc(T("my_edit")) +
      '</button> <button class="btn btn-sm btn-ghost2" type="button" data-wipe="1">' + esc(T("my_wipe")) + '</button><p class="small" id="wipeMsg"></p>';
    var b = $("myDataBox");
    if (!b) { $("notifBox").insertAdjacentHTML("afterend", '<div id="myDataBox" class="about"></div>'); b = $("myDataBox"); }
    b.innerHTML = html;
  }
  var Onb = (function () {
    var sel = { roles: [], interests: [] };
    function chip(group, key, label, on) { return '<button type="button" class="chip' + (on ? " on" : "") + '" data-og="' + group + '" data-ok="' + key + '">' + esc(label) + "</button>"; }
    function open(askLang) {
      var pr = window.SBP.profile();
      sel = { roles: (pr.roles || []).slice(), interests: (pr.interests || []).slice(), gender: pr.gender || "", state: pr.state || "" };
      var box = $("onbSheet");
      if (!box) { document.body.insertAdjacentHTML("beforeend", '<div id="onbSheet" class="sheet onb"></div>'); box = $("onbSheet"); }
      var h = '<div class="sheet-box onb-box" role="dialog"><h2>' + esc(T("onb_welcome")) + "</h2>";
      if (askLang) {
        h += "<h3>" + esc(T("onb_lang")) + '</h3><p class="hint-en small">Choose your language</p><div class="lang-list">' + window.SB_LANGS.map(function (l) {
          return '<button type="button" class="lang-opt' + (l.code === I.get() ? " on" : "") + '" data-olang="' + l.code + '"' + (l.rtl ? ' dir="rtl"' : "") + ">" + esc(l.name) + "</button>";
        }).join("") + "</div>";
      } else {
        h += '<p class="small">' + esc(T("onb_about")) + "</p>" +
          "<h3>" + esc(T("onb_roles")) + '</h3><div class="chips wrap">' + ROLES.map(function (r) { return chip("roles", r, T("r_" + r), sel.roles.indexOf(r) >= 0); }).join("") + "</div>" +
          "<h3>" + esc(T("onb_gender")) + '</h3><div class="chips wrap">' + ["f", "m", "x"].map(function (g) { return chip("gender", g, T("g_" + g), sel.gender === g); }).join("") + "</div>" +
          "<h3>" + esc(T("onb_state")) + '</h3><select id="onbState" class="onbsel"><option value="">' + esc(T("st_none")) + "</option>" +
          STATES.map(function (s) { return '<option' + (sel.state === s ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select>" +
          "<h3>" + esc(T("onb_int")) + '</h3><div class="chips wrap">' + SECS.filter(function (s) { return s.key !== "news"; }).map(function (s) { return chip("interests", s.key, T(s.name), sel.interests.indexOf(s.key) >= 0); }).join("") + "</div>" +
          '<p class="small">' + esc(T("onb_priv")) + '</p><div class="onb-btns"><button class="btn" type="button" data-ogo="1">' + esc(T("onb_go")) +
          '</button><button class="btn btn-ghost2" type="button" data-oskip="1">' + esc(T("onb_skip")) + "</button></div>";
      }
      box.innerHTML = h + "</div>";
      box.hidden = false;
    }
    function close() { var b = $("onbSheet"); if (b) b.hidden = true; window.SBP.setOnbDone(); renderPersonal(); }
    document.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-onb]")) { open(false); return; }
      if (ev.target.closest("[data-crx]")) { window.SBP.clearProgress(); renderPersonal(); return; }
      if (ev.target.closest("[data-wipe]")) { window.SBP.wipe(); $("wipeMsg").textContent = T("my_wiped"); renderPersonal(); renderChips(); return; }
      var lb = ev.target.closest("[data-olang]");
      if (lb) { store.set("sb_lang_chosen", 1); if (lb.dataset.olang !== I.get()) { I.set(lb.dataset.olang); location.reload(); } else open(false); return; }
      var c = ev.target.closest("[data-og]");
      if (c && $("onbSheet") && !$("onbSheet").hidden) {
        var g = c.dataset.og, k = c.dataset.ok;
        if (g === "gender") { sel.gender = sel.gender === k ? "" : k; c.parentNode.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x.dataset.ok === sel.gender); }); }
        else { var a = sel[g], i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.push(k); c.classList.toggle("on", i < 0); }
        return;
      }
      if (ev.target.closest("[data-ogo]")) {
        sel.state = ($("onbState") || {}).value || "";
        window.SBP.saveProfile(sel); close();
        if (window.SBP.hasTaste()) openSection("foryou");
        return;
      }
      if (ev.target.closest("[data-oskip]")) close();
    });
    return { open: open };
  })();
  /* भाषा बटन से भाषा बदली तो भी "चुनी गई" मानें */
  $("langSheet").addEventListener("click", function (ev) { if (ev.target.closest(".lang-opt")) store.set("sb_lang_chosen", 1); }, true);

  /* ---------- सूचना छूने पर सीधे वही लेख खोलना (?post=...) ---------- */
  function openFromLink(pid) {
    var find = function () { return offlinePool().filter(function (p) { return p.pid === pid; })[0]; };
    var p = find();
    if (p) { postsById[p.id] = p; openPost(p); return; }
    loadFeedJson().then(function () { var q = find(); if (q) { postsById[q.id] = q; openPost(q); } });
  }

  /* ---------- शुरुआत ---------- */
  var params = new URLSearchParams(location.search);
  /* पिछली बार जहाँ छोड़ा था, वहीं से (अगर लिंक में कुछ और न कहा हो) */
  var startTab = params.get("tab") || store.get("sb_tab") || "news";
  if (TABS.indexOf(startTab) < 0) startTab = "news";
  var startSec = params.get("sec") || window.SBP.lastChip() || (window.SBP.hasTaste() ? "foryou" : null);
  if (startSec && (secByKey(startSec) || startSec === "saved" || startSec === "foryou")) curSec = startSec;
  renderChips();
  showTab(startTab);
  renderPersonal();
  renderHelplines();
  renderMyData();
  if (!window.SBP.onbDone() && !params.get("post")) Onb.open(!store.get("sb_lang_chosen") && !localStorage.getItem("sb_lang"));
  loadFeedJson();
  loadAll();
  loadTr();
  Notify.render();
  if (params.get("post")) openFromLink(params.get("post"));
  window.addEventListener("online", function () { loadAll(); });
  /* चरण 4 (phase4.js) के लिए: ताज़ा खबरें और लेख खोलने का रास्ता */
  window.SBA = { pool: offlinePool, open: function (p) { postsById[p.id] = p; openPost(p); }, tr: trPost, feedReady: loadFeedJson };
  document.dispatchEvent(new Event("sb:ready"));

  /* ---------- छोटा संदेश (toast) ---------- */
  function toast(msg, btnText, onBtn) {
    var old = $("sbToast"); if (old) old.remove();
    var t = document.createElement("div"); t.id = "sbToast"; t.className = "toast"; t.setAttribute("role", "status");
    t.innerHTML = "<span></span>" + (btnText ? '<button class="btn btn-sm" type="button"></button>' : "");
    t.firstChild.textContent = msg;
    if (btnText) { t.lastChild.textContent = btnText; t.lastChild.addEventListener("click", function () { t.remove(); if (onBtn) onBtn(); }); }
    else setTimeout(function () { t.remove(); }, 4000);
    document.body.appendChild(t);
  }

  if ("serviceWorker" in navigator) {
    var hadSW = !!navigator.serviceWorker.controller; // पहले से SW चल रहा हो, तभी "नया संस्करण" बताना (पहली बार नहीं)
    navigator.serviceWorker.addEventListener("message", function (ev) {
      if (hadSW && ev.data && ev.data.type === "SB_UPDATED") toast("नया version उपलब्ध है", "Reload", function () { location.reload(); });
    });
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
