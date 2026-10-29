/* समझो भारत — Service Worker: ऑफ़लाइन कॉपी, तस्वीरें सहेजना, नई खबर की सूचना। नया संस्करण डालें तो VERSION बदलें। */
const VERSION = "sb-v21";
const DATA = "sb-data";   // feed.json और सूचना की स्थिति (संस्करण बदलने पर भी बनी रहती है)
const IMG = "sb-img";     // खबरों और वीडियो की तस्वीरें
const TRC = "sb-tr";      // अनुवादित लेख
const SHELL = ["./", "index.html", "style.css", "app.js", "config.js", "i18n.js", "i18n-extra.js", "i18n-p5.js", "quiz.js", "calc2.js", "calc.js", "personal.js", "tools.js", "phase4.js", "postcard.js", "headlines.js", "quiz2.js", "manifest.json", "privacy.html",
  "icons/icon-192.png", "icons/icon-512.png",
  "fonts/mukta-devanagari-400-normal.woff2", "fonts/mukta-devanagari-700-normal.woff2",
  "fonts/mukta-latin-400-normal.woff2", "fonts/mukta-latin-700-normal.woff2"];
const SHELL_DATA = ["data/news.json"]; // हल्की खबर-सूची भी पहले से सहेजें (न मिले तो install नहीं रुकता)
const SHELL_PATHS = SHELL.map(p => new URL(p, self.location.href).pathname);
const KEEP = [VERSION, DATA, IMG, TRC];
const IMG_HOSTS = /(^|\.)(blogger\.googleusercontent\.com|bp\.blogspot\.com|ytimg\.com|googleusercontent\.com)$/;

self.addEventListener("install", e => {
  e.waitUntil(Promise.all([
    caches.open(VERSION).then(c => c.addAll(SHELL)),
    caches.open(DATA).then(c => Promise.all(SHELL_DATA.map(p => fetch(p).then(r => { if (r.ok) return c.put(new URL(p, self.registration.scope).pathname, r); }).catch(() => {}))))
  ]));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => KEEP.indexOf(k) < 0).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => self.clients.matchAll({ type: "window" }))
    .then(list => list.forEach(c => c.postMessage({ type: "SB_UPDATED", version: VERSION })))); // ऐप को बताना: नया संस्करण आ गया
});

async function trim(name, max) {
  const c = await caches.open(name); const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (url.pathname.indexOf("/data/") >= 0) { // data/*.json: फ़ोन की कॉपी तुरंत, पीछे-पीछे नई लाकर सहेजना (stale-while-revalidate)
      e.respondWith(caches.open(DATA).then(c => c.match(url.pathname).then(hit => {
        const net = fetch(req).then(r => { if (r.ok) c.put(url.pathname, r.clone()); return r; });
        if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
        return net.catch(() => Response.error());
      })));
      return;
    }
    // ऐप की अपनी फ़ाइलें: पहले इंटरनेट, न मिले तो फ़ोन की कॉपी (सिर्फ़ shell की फ़ाइलें सहेजी जाती हैं)
    const isShell = SHELL_PATHS.indexOf(url.pathname) >= 0;
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok && isShell) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return r;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
    );
    return;
  }
  if (req.destination === "image" && IMG_HOSTS.test(url.hostname)) { // तस्वीरें: पहले फ़ोन की कॉपी
    e.respondWith(caches.open(IMG).then(c => c.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok || r.type === "opaque") { c.put(req, r.clone()); trim(IMG, 160); }
      return r;
    }))));
    return;
  }
  if (url.hostname === "script.google.com") { // अनुवाद: पहले इंटरनेट, न मिले तो सहेजा हुआ अनुवाद
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(TRC).then(c => { c.put(req.url, copy); trim(TRC, 80); }); }
      return r;
    }).catch(() => caches.match(req.url).then(r => r || Response.error())));
  }
});

/* ---------- सूचना की स्थिति (भाषा, शब्द, देखी हुई पोस्ट) ---------- */
async function getState() {
  const r = await caches.open(DATA).then(c => c.match("/__sb_state"));
  try { return r ? await r.json() : {}; } catch (e) { return {}; }
}
async function setState(st) {
  const c = await caches.open(DATA);
  await c.put("/__sb_state", new Response(JSON.stringify(st), { headers: { "Content-Type": "application/json" } }));
}
self.addEventListener("message", e => {
  const m = e.data || {};
  if (m.type !== "state") return;
  e.waitUntil(getState().then(st => {
    const seen = (st.seen || []).concat(m.seen || []).filter((x, i, a) => a.indexOf(x) === i).slice(-200);
    return setState(Object.assign(st, { lang: m.lang, on: m.on, s: m.s, seen }));
  }));
});

/* ---------- हर कुछ घंटे में (फ़ोन तय करता है कब) नई खबर देखना ---------- */
async function checkNews() {
  const r = await fetch("data/feed.json?t=" + Date.now(), { cache: "no-store" });
  if (!r.ok) return;
  const copy = r.clone();
  await caches.open(DATA).then(c => c.put(new URL("data/feed.json", self.registration.scope).pathname, copy));
  const feed = await r.json();
  const posts = (feed && feed.posts) || [];
  const st = await getState();
  const seen = st.seen || [];
  const fresh = posts.filter(p => p.pid && seen.indexOf(p.pid) < 0);
  // नई पोस्ट की तस्वीरें पहले से सहेज लें, ताकि बिना इंटरनेट भी दिखें
  const ic = await caches.open(IMG);
  await Promise.all(posts.slice(0, 20).filter(p => p.img).map(p => ic.match(p.img).then(h => h || fetch(p.img, { mode: "no-cors" }).then(x => ic.put(p.img, x)).catch(() => {}))));
  if (seen.length && fresh.length && st.on && self.Notification && Notification.permission === "granted") {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (!wins.some(w => w.visibilityState === "visible")) {
      const p = fresh[0], s = st.s || {}, lang = st.lang || "hi";
      const hindiTitle = /[ऀ-ॿ]/.test(p.title);
      const sameLang = lang === "hi" || (lang === "en" && !hindiTitle);
      await self.registration.showNotification((s.brand || "समझो भारत") + " — " + (s.news || "नई खबर"), {
        body: sameLang ? p.title : (s.tap || ""), icon: "icons/icon-192.png", badge: "icons/icon-192.png",
        tag: "sb-news", renotify: true, data: { url: "./?post=" + p.pid }
      });
    }
  }
  st.seen = seen.concat(posts.map(p => p.pid)).filter((x, i, a) => x && a.indexOf(x) === i).slice(-200);
  await setState(st);
}
self.addEventListener("periodicsync", e => { if (e.tag === "sb-news") e.waitUntil(checkNews().catch(() => {})); });

/* भविष्य में Firebase जैसी push सेवा जोड़ें तो यही हिस्सा सूचना दिखाएगा */
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "समझो भारत", { body: d.body || "", icon: "icons/icon-192.png", data: { url: d.url || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("navigate" in c) return c.navigate(url).then(w => (w || c).focus()).catch(() => self.clients.openWindow(url)); }
    return self.clients.openWindow(url);
  }));
});
