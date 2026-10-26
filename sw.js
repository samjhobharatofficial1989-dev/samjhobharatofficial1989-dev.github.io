/* ऑफ़लाइन के लिए ऐप की फ़ाइलें सहेजना (offline cache). नया संस्करण डालें तो VERSION बदलें। */
const VERSION = "sb-v8";
const SHELL = ["./", "index.html", "style.css", "app.js", "config.js", "i18n.js", "quiz.js", "manifest.json", "privacy.html",
  "icons/icon-192.png", "icons/icon-512.png",
  "fonts/mukta-devanagari-400-normal.woff2", "fonts/mukta-devanagari-700-normal.woff2",
  "fonts/mukta-latin-400-normal.woff2", "fonts/mukta-latin-700-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return; // ब्लॉग/YouTube सीधे इंटरनेट से
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
