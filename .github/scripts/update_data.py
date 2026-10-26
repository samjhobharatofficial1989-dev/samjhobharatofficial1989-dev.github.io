"""समझो भारत: ब्लॉग की पोस्ट (ऑफ़लाइन/सूचना के लिए) और YouTube वीडियो की सूची बनाना।
Builds data/feed.json (latest blog posts) and data/videos.json (latest channel videos)."""
import json, os, re, sys, urllib.request
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


def build_videos():
    xml = get("https://www.youtube.com/feeds/videos.xml?channel_id=" + CHANNEL)
    ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    root = ET.fromstring(xml)
    new = []
    for en in root.findall("a:entry", ns):
        vid = en.findtext("yt:videoId", default="", namespaces=ns)
        if vid:
            new.append({"id": vid, "title": en.findtext("a:title", default="", namespaces=ns),
                        "date": en.findtext("a:published", default="", namespaces=ns)})
    old = load("data/videos.json", {}).get("videos", [])
    ids = {v["id"] for v in new}
    merged = new + [v for v in old if v.get("id") not in ids]
    merged.sort(key=lambda v: v.get("date", ""), reverse=True)
    merged = merged[:MAX_VIDEOS]
    if merged == old:
        print("videos: no change")
        return
    save("data/videos.json", {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "videos": merged})
    print("videos: %d" % len(merged))


if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    ok = True
    for fn in (build_feed, build_videos):
        try:
            fn()
        except Exception as ex:  # एक हिस्सा फेल हो तो दूसरा फिर भी चले
            ok = False
            print("ERROR in %s: %s" % (fn.__name__, ex), file=sys.stderr)
    if not ok:
        print("::warning::Some data could not be updated this time; the old copy is kept.")
