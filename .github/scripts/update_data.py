"""समझो भारत: ब्लॉग की पोस्ट (ऑफ़लाइन/सूचना के लिए) और YouTube वीडियो की सूची बनाना।
Builds data/feed.json (latest blog posts), data/videos.json (latest channel videos) and data/headlines.json (top news headlines)."""
import json, os, re, sys, time, urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

BLOG = "https://samjhobharatofficial.blogspot.com"
CHANNEL = "UC5_5H3KtMPTCb7LJrz3cpgw"
MAX_POSTS = 50
MAX_VIDEOS = 60
UA = {"User-Agent": "Mozilla/5.0 (SamjhoBharat data updater)"}


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read()


def load(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")


def big_image(u):
    if not u:
        return ""
    u = re.sub(r"/s72(-[a-z0-9-]+)?/", "/w640-h360-p-k-no-nu/", u)
    return re.sub(r"=s72(-[a-z0-9-]+)?$", "=w640-h360-p-k-no-nu", u)


def build_feed():
    d = json.loads(get(BLOG + "/feeds/posts/default?alt=json&max-results=%d" % MAX_POSTS))
    posts = []
    for e in d.get("feed", {}).get("entry", []):
        eid = e.get("id", {}).get("$t", "")
        pid = re.search(r"post-(\d+)", eid)
        link = next((l["href"] for l in e.get("link", []) if l.get("rel") == "alternate"), BLOG)
        html = (e.get("content") or e.get("summary") or {}).get("$t", "")
        img = big_image((e.get("media$thumbnail") or {}).get("url", ""))
        if not img:
            m = re.search(r'<img[^>]+src="([^"]+)"', html, re.I)
            img = m.group(1) if m else ""
        posts.append({
            "id": eid,
            "pid": pid.group(1) if pid else "",
            "title": e.get("title", {}).get("$t", "—"),
            "url": link,
            "date": e.get("published", {}).get("$t", ""),
            "labels": [c["term"] for c in e.get("category", [])],
            "comments": int(e["thr$total"]["$t"]) if "thr$total" in e else None,
            "img": img,
            "html": html,
        })
    old = load("data/feed.json", {})
    if old.get("posts") == posts:
        print("feed: no change")
        return
    save("data/feed.json", {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "posts": posts})
    print("feed: %d posts" % len(posts))


MAX_NEWS = 12
NEWS_SUMMARY_LEN = 160


def _plain(html_text, limit):
    """HTML से tag हटाकर सादा पाठ, तय लंबाई तक (शब्द के बीच में न कटे)."""
    import html as H
    txt = H.unescape(re.sub(r"<[^>]+>", " ", html_text or ""))
    txt = re.sub(r"\s+", " ", txt).strip()
    if len(txt) > limit:
        cut = txt.rfind(" ", 0, limit - 1)
        txt = txt[:cut if cut > limit // 2 else limit - 1].rstrip() + "…"
    return txt


def build_news():
    """हल्की खबर-सूची data/news.json: शीर्षक, तारीख, छोटा सार, Label, लिंक, तस्वीर (पूरा लेख ऐप खोलते समय लाता है)."""
    d = json.loads(get(BLOG + "/feeds/posts/summary?alt=json&max-results=%d" % MAX_NEWS))
    items = []
    for e in d.get("feed", {}).get("entry", []):
        eid = e.get("id", {}).get("$t", "")
        pid = re.search(r"post-(\d+)", eid)
        link = next((l["href"] for l in e.get("link", []) if l.get("rel") == "alternate"), BLOG)
        html = (e.get("summary") or e.get("content") or {}).get("$t", "")
        img = big_image((e.get("media$thumbnail") or {}).get("url", ""))
        if not img:
            m = re.search(r'<img[^>]+src="([^"]+)"', html, re.I)
            img = m.group(1) if m else ""
        items.append({
            "id": eid,
            "pid": pid.group(1) if pid else "",
            "title": e.get("title", {}).get("$t", "—"),
            "date": _when(e.get("published", {}).get("$t", "")) or e.get("published", {}).get("$t", ""),
            "summary": _plain(html, NEWS_SUMMARY_LEN),
            "labels": [c["term"] for c in e.get("category", [])],
            "url": link,
            "img": img,
        })
    if not items:
        raise RuntimeError("no posts in summary feed")
    old = load("data/news.json", [])
    if old == items:
        print("news: no change")
        return
    save("data/news.json", items)
    print("news: %d posts" % len(items))


def rss_videos():
    xml = None
    for i in range(3):  # YouTube कभी-कभी पहली बार में जवाब नहीं देता
        try:
            xml = get("https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL)
            break
        except Exception as ex:
            print("rss try %d failed: %s" % (i + 1, ex))
            time.sleep(5)
    if not xml:
        return []
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    out = []
    for en in ET.fromstring(xml).findall("a:entry", ns):
        vid = en.findtext("yt:videoId", default="", namespaces=ns)
        if vid:
            out.append({"id": vid, "title": en.findtext("a:title", default="", namespaces=ns),
                        "date": en.findtext("a:published", default="", namespaces=ns)})
    return out


def _jstr(x):
    try:
        return json.loads('"%s"' % x)
    except Exception:
        return x


def page_videos():
    """RSS न मिले तो चैनल के Videos और Shorts पेज से सूची निकालना (पेज के क्रम में, नया ऊपर)."""
    out, seen = [], set()
    for tab, marker, id_re, title_re in (
        ("videos", '"lockupViewModel":{', r'"contentId":"([\w-]{11})","contentType":"LOCKUP_CONTENT_TYPE_VIDEO"',
         r'"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"'),
        ("shorts", '"shortsLockupViewModel":{', r'"videoId":"([\w-]{11})"', r'"primaryText":\{"content":"((?:[^"\\]|\\.)*)"'),
    ):
        try:
            html = get("https://www.youtube.com/channel/%s/%s" % (CHANNEL, tab)).decode("utf-8", "replace")
        except Exception as ex:
            print("page %s failed: %s" % (tab, ex))
            continue
        found = 0
        for chunk in html.split(marker)[1:]:
            m = re.search(id_re, chunk)
            if not m or m.group(1) in seen:
                continue
            t = re.search(title_re, chunk)
            seen.add(m.group(1))
            out.append({"id": m.group(1), "title": _jstr(t.group(1)) if t else "", "date": ""})
            found += 1
        print("page %s: %d" % (tab, found))
    return out


def build_videos():
    new = rss_videos()
    if not new:
        new = page_videos()
    if not new:
        raise RuntimeError("no videos found from RSS or channel page")
    old = load("data/videos.json", {}).get("videos", [])
    olddates = {v["id"]: v.get("date", "") for v in old}
    for v in new:  # पुरानी पक्की तारीख हो तो वही रखें
        if olddates.get(v["id"]):
            v["date"] = olddates[v["id"]]
    ids = {v["id"] for v in new}
    merged = new + [v for v in old if v.get("id") not in ids]
    merged = sorted(merged, key=lambda v: v.get("date") or "0", reverse=True) if all(v.get("date") for v in new) else merged
    merged = merged[:MAX_VIDEOS]
    if merged == old:
        print("videos: no change")
        return
    save("data/videos.json", {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "videos": merged})
    print("videos: %d" % len(merged))


# बड़ी न्यूज़ वेबसाइटों की सुर्खियाँ: सिर्फ़ हेडलाइन + स्रोत + लिंक (पूरी खबर उसी वेबसाइट पर खुलती है)
HEADLINE_SOURCES = [
    ("Aaj Tak", "hi", "https://www.aajtak.in/rssfeeds/?id=home"),
    ("BBC Hindi", "hi", "https://feeds.bbci.co.uk/hindi/rss.xml"),
    ("Amar Ujala", "hi", "https://www.amarujala.com/rss/breaking-news.xml"),
    ("Dainik Bhaskar", "hi", "https://www.bhaskar.com/rss-v1--category-1061.xml"),
    ("ABP Live", "hi", "https://www.abplive.com/home/feed"),
    ("NDTV", "en", "https://feeds.feedburner.com/ndtvnews-top-stories"),
    ("India Today", "en", "https://www.indiatoday.in/rss/home"),
    ("Hindustan Times", "en", "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"),
    ("The Hindu", "en", "https://www.thehindu.com/news/national/feeder/default.rss"),
]
PER_SOURCE = 8


def _when(txt):
    from email.utils import parsedate_to_datetime
    txt = (txt or "").strip()
    if not txt:
        return ""
    try:
        d = parsedate_to_datetime(txt)
    except Exception:
        try:
            d = datetime.fromisoformat(txt.replace("Z", "+00:00"))
        except Exception:
            return ""
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d.astimezone(timezone.utc).isoformat(timespec="seconds")


def build_headlines():
    import html as H
    now = datetime.now(timezone.utc)
    items, seen = [], set()
    for name, lang, url in HEADLINE_SOURCES:
        try:
            root = ET.fromstring(get(url))
        except Exception as ex:
            print("headlines: %s failed: %s" % (name, ex))
            continue
        n = 0
        for it in root.iter("item"):
            title = H.unescape(re.sub(r"<[^>]+>", "", it.findtext("title") or "")).strip()
            link = (it.findtext("link") or "").strip()
            if not title or not link.startswith("http") or link in seen:
                continue
            when = _when(it.findtext("pubDate") or it.findtext("{http://purl.org/dc/elements/1.1/}date"))
            if when and (now - datetime.fromisoformat(when)).total_seconds() > 2 * 86400:
                continue  # दो दिन से पुरानी खबर नहीं
            seen.add(link)
            items.append({"t": title[:220], "u": link, "s": name, "l": lang, "d": when})
            n += 1
            if n >= PER_SOURCE:
                break
        print("headlines: %s %d" % (name, n))
    if len(items) < 5:
        raise RuntimeError("too few headlines (%d)" % len(items))
    items.sort(key=lambda x: x["d"] or "0", reverse=True)
    old = load("data/headlines.json", {})
    if old.get("items") == items:
        print("headlines: no change")
        return
    save("data/headlines.json", {"updated": now.isoformat(timespec="seconds"), "items": items})
    print("headlines: %d total" % len(items))


if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    ok = True
    for fn in (build_feed, build_news, build_videos, build_headlines):
        try:
            fn()
        except Exception as ex:  # एक हिस्सा फेल हो तो दूसरा फिर भी चले
            ok = False
            print("ERROR in %s: %s" % (fn.__name__, ex))
    if not ok:
        print("::warning::Some data could not be updated this time; the old copy is kept.")
