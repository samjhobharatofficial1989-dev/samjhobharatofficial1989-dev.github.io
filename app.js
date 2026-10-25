/* समझो भारत ऐप — मुख्य कोड (main code) */
(function () {
  "use strict";
  var C = window.SB_CONFIG;
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
    window.scrollTo(0, 0);
    store.set("sb_tab", name);
  }
  navBtns.forEach(function (b) { b.addEventListener("click", function () { showTab(b.dataset.tab); }); });

  /* ---------- ब्लॉग से पोस्ट लाना (Blogger JSON feed) ---------- */
  function feedUrl(label, cb) {
    var path = "/feeds/posts/default" + (label ? "/-/" + encodeURIComponent(label) : "");
    return C.blogUrl.replace(/\/$/, "") + path + "?alt=json-in-script&max-results=" + C.maxPosts + "&callback=" + cb;
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
        title: (e.title && e.title.$t) || "(बिना शीर्षक)",
        url: link ? link.href : C.blogUrl,
        date: e.published ? e.published.$t : "",
        labels: (e.category || []).map(function (c) { return c.term; }),
        img: img,
        html: html
      };
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }); }
    catch (e) { return iso.slice(0, 10); }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  function renderList(el, posts, emptyMsg) {
    if (!posts.length) {
      el.innerHTML = '<div class="empty">' + emptyMsg + '</div>';
      return;
    }
    el.innerHTML = posts.map(function (p, i) {
      postsById[p.id] = p;
      var labels = p.labels.slice(0, 2).map(function (l) { return '<span class="tag">' + esc(l) + "</span>"; }).join("");
      var img = p.img ? '<img class="thumb" loading="lazy" alt="" src="' + esc(p.img) + '">'
        : '<div class="thumb ph"><span>' + esc(p.labels[0] || "समझो भारत") + "</span></div>";
      return '<button class="card' + (i === 0 && p.img ? " hero" : "") + '" data-id="' + esc(p.id) + '">' + img +
        '<div class="body"><h3>' + esc(p.title) + '</h3><div class="meta">' + labels + fmtDate(p.date) + "</div></div></button>";
    }).join("");
  }
  function skeleton(el) { el.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>'; }

  function loadSection(key, label, listEl, statusEl, emptyMsg) {
    var cached = store.get(key);
    if (cached && cached.posts) { renderList(listEl, cached.posts, emptyMsg); statusEl.textContent = "अपडेट हो रहा है…"; }
    else skeleton(listEl);
    return jsonp(feedUrl(label, "__CB__")).then(function (data) {
      var posts = parseFeed(data);
      store.set(key, { at: Date.now(), posts: posts });
      renderList(listEl, posts, emptyMsg);
      statusEl.textContent = "";
    }).catch(function () {
      if (cached && cached.posts) {
        statusEl.textContent = "ऑफ़लाइन — पुरानी खबरें";
      } else {
        statusEl.textContent = "";
        listEl.innerHTML = '<div class="empty">खबरें लोड नहीं हो पाईं। इंटरनेट जाँचें।<br><small>Please check your internet connection.</small>' +
          '<button class="btn" data-retry="1">फिर से कोशिश करें</button></div>';
      }
    });
  }

  function loadAll() {
    var btn = $("refreshBtn");
    btn.classList.add("spin");
    Promise.all([
      loadSection("sb_news", "", $("newsList"), $("newsStatus"), "अभी कोई खबर नहीं है। जल्द ही नई खबरें आएँगी।"),
      loadSection("sb_gyan", C.gyanLabel, $("gyanList"), $("gyanStatus"),
        "जल्द ही यहाँ उपयोगी जानकारी वाले लेख आएँगे।")
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
  function openPost(p, push) {
    current = p;
    $("readerBody").innerHTML =
      "<h1>" + esc(p.title) + '</h1><div class="meta small">' + fmtDate(p.date) + "</div>" +
      cleanHtml(p.html) +
      '<a class="btn" href="' + esc(p.url) + '" target="_blank" rel="noopener">ब्लॉग पर पूरा लेख देखें</a>' +
      '<p class="slogan">देश को समझिए, समझो भारत के साथ।</p>';
    $("reader").hidden = false;
    $("reader").scrollTop = 0;
    document.body.style.overflow = "hidden";
    if (push !== false) history.pushState({ reader: true }, "");
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
    var text = current.title + "\n\nसमझो भारत, आगे बढ़ो भारत।";
    if (navigator.share) navigator.share({ title: current.title, text: text, url: current.url }).catch(function () {});
    else window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + current.url), "_blank");
  });

  /* ---------- वीडियो ---------- */
  var videosLoaded = false;
  function loadVideos() {
    if (videosLoaded) return;
    videosLoaded = true;
    var uploads = "UU" + C.youtubeChannelId.slice(2); // चैनल की सभी वीडियो वाली playlist
    $("ytFrame").src = "https://www.youtube.com/embed/videoseries?list=" + uploads;
  }

  /* ---------- सोशल लिंक और तथ्य ---------- */
  $("linkList").innerHTML = C.links.map(function (l) {
    return '<a class="link" style="--c:' + esc(l.color) + '" href="' + esc(l.url) + '" target="_blank" rel="noopener"><b>' +
      esc(l.name) + "</b><span>" + esc(l.handle) + "</span></a>";
  }).join("");
  $("factList").innerHTML = C.facts.map(function (f) { return '<div class="fact">' + esc(f) + "</div>"; }).join("");

  $("refreshBtn").addEventListener("click", loadAll);

  /* ---------- शुरुआत ---------- */
  var startTab = new URLSearchParams(location.search).get("tab") || "news";
  if (["news", "gyan", "video", "links"].indexOf(startTab) < 0) startTab = "news";
  showTab(startTab);
  loadAll();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
