"""Audit the blog's HTTP HTML without JavaScript or third-party packages.
Usage: python scripts/seo-audit.py --base-url http://localhost:3100 --output docs/seo-audit-local.json
Exit 1 means confirmed failed checks; network errors are reported separately.
"""
import argparse, json, re, sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError, URLError
import xml.etree.ElementTree as ET

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.meta = {}; self.links = []; self.headings = []; self.times = []; self.language_elements = []
        self.title = ""; self.lang = None; self.schemas = []; self.anchors = []
        self.capture = None; self.buffer = ""; self.raw = text; self.visible = ""; self.hidden = 0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"): self.hidden += 1
        if tag == "html": self.lang = a.get("lang")
        if a.get("lang"): self.language_elements.append({"tag": tag, "lang": a.get("lang")})
        if tag == "meta": self.meta.setdefault(a.get("name") or a.get("property"), []).append(a.get("content",""))
        if tag == "link": self.links.append(a)
        if tag == "a": self.anchors.append(a.get("href"))
        if tag == "time": self.times.append(a.get("datetime"))
        if tag in ("title","h1","h2","h3") or (tag == "script" and a.get("type") == "application/ld+json"):
            self.capture = tag; self.buffer = ""
    def handle_data(self, data):
        if self.capture: self.buffer += data
        if not self.hidden: self.visible += data
    def handle_endtag(self, tag):
        if tag in ("script", "style"): self.hidden = max(0, self.hidden - 1)
        if tag != self.capture: return
        if tag == "title": self.title = self.buffer
        elif tag == "script":
            try: self.schemas.append(json.loads(self.buffer))
            except ValueError: self.schemas.append({"invalid": True})
        else: self.headings.append([tag,self.buffer])
        self.capture = None
    def value(self, key): return self.meta.get(key, [""])[0]

def main():
    args = argparse.ArgumentParser()
    args.add_argument("--base-url", default="http://localhost:3100")
    args.add_argument("--output")
    opt = args.parse_args()
    checks = []; pages = {}; errors = []
    opener = build_opener(NoRedirect)
    def check(name, passed, evidence):
        checks.append({"check": name, "passed": bool(passed), "evidence": evidence})
    def fetch(path, agent="Mozilla/5.0"):
        try:
            r = opener.open(Request(opt.base_url.rstrip("/") + path, headers={"User-Agent":agent}),timeout=30)
        except HTTPError as e: r = e
        except (URLError, TimeoutError, OSError) as e:
            errors.append({"path":path,"error":str(e)}); return None
        with r: return r.status, {k.lower():v for k,v in r.headers.items()}, r.read().decode("utf-8",errors="replace")
    posts = [
        ("/blog/bem-vindo-ao-meu-blog","pt-BR","Bem-vindo ao meu blog"),
        ("/blog/welcome-to-my-blog","en-US","Welcome to my blog"),
        ("/blog/bienvenido-a-mi-blog","es","Bienvenido a mi blog")
    ]
    for path, lang, title in [("/blog","pt-BR",None)] + posts:
        response = fetch(path)
        if response is None: continue
        status, headers, html = response
        p = Page(html)
        canonical = [a.get("href") for a in p.links if a.get("rel")=="canonical"]
        alternates = [a for a in p.links if a.get("hreflang")]
        schema_types = [a.get("@type") for a in p.schemas if isinstance(a,dict)]
        h1 = [v for t,v in p.headings if t=="h1"]
        pages[path] = {"status":status,"title":p.title,"description":p.value("description"),"canonical":canonical,"htmlLang":p.lang,"headings":p.headings,"hreflang":alternates,"schemaTypes":schema_types,"ogTitle":p.value("og:title"),"ogUrl":p.value("og:url"),"ogType":p.value("og:type"),"times":p.times,"bytes":len(html.encode()),"languageElements":p.language_elements, "headers":{k:v for k,v in headers.items() if k.lower() in ("content-type","x-robots-tag","cache-control")}}
        check(path+" HTTP 200",status==200,status)
        check(path+" self canonical",canonical==["https://lagrotti.dev"+path],canonical)
        check(path+" indexable","noindex" not in (p.value("robots")+" "+headers.get("x-robots-tag","")).lower(),p.value("robots"))
        check(path+" one H1",len(h1)==1,h1)
        check(path+" content language",p.lang==lang or any(item["lang"] == lang for item in p.language_elements),{"html": p.lang, "elements": p.language_elements})
        check(path+" OG URL",p.value("og:url")=="https://lagrotti.dev"+path,p.value("og:url"))
        check(path+" description",bool(p.value("description")),p.value("description"))
        if title:
            check(path+" title identifies post",title in p.title,p.title)
            check(path+" H1 matches language",h1==[title],h1)
            check(path+" semantic Markdown headings",any(t=="h2" for t,v in p.headings),p.headings)
            check(path+" no literal Markdown links",not bool(re.search(r"\[[^\]]+\]\(https?://",p.visible)),"literal Markdown link syntax present" if re.search(r"\[[^\]]+\]\(https?://",p.visible) else "none")
            check(path+" BlogPosting schema","BlogPosting" in schema_types,schema_types)
            check(path+" BreadcrumbList schema","BreadcrumbList" in schema_types,schema_types)
            check(path+" OG article",p.value("og:type")=="article",p.value("og:type"))
            check(path+" OG post title",p.value("og:title")==title,p.value("og:title"))
            check(path+" machine-readable publication date",bool(p.times) and all(p.times),p.times)
            check(path+" translation alternates",{"pt-BR","en-US","es"}.issubset({a.get("hreflang") for a in alternates}),alternates)
            google = fetch(path,"Googlebot")
            if google:
                gp = Page(google[2])
                check(path+" Googlebot gets same content",gp.headings==p.headings and gp.title==p.title,{"status":google[0],"headings":gp.headings})
    response=fetch("/robots.txt")
    if response:
        check("robots HTTP 200",response[0]==200,response[0])
        check("robots references sitemap","Sitemap: https://lagrotti.dev/sitemap.xml" in response[2],response[2])
    response=fetch("/sitemap.xml")
    if response:
        try:
            root=ET.fromstring(response[2])
            urls=[n.text for n in root.findall(".//{*}loc")]
            check("sitemap includes all posts",all("https://lagrotti.dev"+p in urls for p,_,_ in posts),urls)
            check("sitemap unique URLs",len(urls)==len(set(urls)),len(urls))
            check("sitemap translated alternates",bool(root.findall(".//{http://www.w3.org/1999/xhtml}link")),"hreflang entries")
        except ET.ParseError as e: check("valid sitemap XML",False,str(e))
    for path in ["/blog/seo-audit-missing-post","/zz/blog","/zz/blog/welcome-to-my-blog"]:
        response=fetch(path)
        if response: check(path+" HTTP 404",response[0]==404,{"status":response[0],"location":response[1].get("location")})
    for path,target in [("/pt/blog","/blog"),("/en/blog/welcome-to-my-blog","/blog/welcome-to-my-blog")]:
        response=fetch(path)
        if response: check(path+" permanent redirect",response[0] in (301,308) and response[1].get("location")==target,{"status":response[0],"location":response[1].get("location")})
    result={"testedAt":datetime.now(timezone.utc).isoformat(),"baseUrl":opt.base_url,"scope":"HTTP HTML only; no hydration, browser performance, Google indexation or rich-results validation","summary":{"passed":sum(c["passed"] for c in checks),"failed":sum(not c["passed"] for c in checks),"networkErrors":len(errors)},"pages":pages,"checks":checks,"errors":errors}
    if opt.output:
        Path(opt.output).parent.mkdir(parents=True,exist_ok=True)
        Path(opt.output).write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(result,ensure_ascii=True,indent=2))
    return 1 if errors or any(not c["passed"] for c in checks) else 0
if __name__=="__main__": sys.exit(main())
