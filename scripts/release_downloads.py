#!/usr/bin/env python3
"""Collect public CAVI GitHub release-asset download counts."""
import datetime
import json
import os
import subprocess
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

API = "https://api.github.com"
ORG = "cavi-ai"


def pages(url, request):
    seen = set()
    while url:
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "api.github.com" or url in seen:
            raise ValueError("unsafe or repeated pagination URL")
        seen.add(url)
        body, link = request(url)
        if not isinstance(body, list):
            raise ValueError("expected a paginated list")
        yield from body
        matches = re.findall(r'<([^>]+)>;\s*rel="next"', link or "")
        if len(matches) > 1:
            raise ValueError("ambiguous pagination")
        url = matches[0] if matches else None


def format_as_of(value):
    instant = datetime.datetime.fromisoformat(value)
    if instant.utcoffset() is None:
        raise ValueError("timestamp must include an offset")
    local = instant.astimezone(ZoneInfo("America/New_York"))
    return f"{local:%b} {local.day}, {local.year} {local.hour % 12 or 12}:{local:%M %p %Z}"


def collect(request, now):
    repos = list(pages(f"{API}/orgs/{ORG}/repos?type=public&per_page=100", request))
    if not repos:
        raise ValueError("empty repository inventory")
    names = set()
    for repo in repos:
        if repo.get("private") is not False or repo.get("owner", {}).get("login", "").lower() != ORG:
            raise ValueError("unexpected repository ownership or visibility")
        if not isinstance(repo.get("fork"), bool):
            raise ValueError("missing fork status")
        if not repo["fork"]:
            name = repo.get("name")
            if not isinstance(name, str) or not re.fullmatch(r"[A-Za-z0-9_.-]+", name) or name in names:
                raise ValueError("invalid or duplicate repository")
            names.add(name)
    if not names:
        raise ValueError("no public first-party repositories")
    seen = {}
    totals = {}
    for name in sorted(names):
        subtotal = 0
        for release in pages(f"{API}/repos/{ORG}/{name}/releases?per_page=100", request):
            if release.get("draft") is not False:
                if release.get("draft") is True:
                    continue
                raise ValueError("missing release draft status")
            if not release.get("published_at"):
                raise ValueError("published release missing timestamp")
            release_id = release.get("id")
            if type(release_id) is not int or release_id <= 0:
                raise ValueError("invalid release ID")
            for asset in pages(f"{API}/repos/{ORG}/{name}/releases/{release_id}/assets?per_page=100", request):
                aid, count = asset.get("id"), asset.get("download_count")
                if type(aid) is not int or aid <= 0 or type(count) is not int or count < 0:
                    raise ValueError("invalid asset identity or count")
                if aid in seen:
                    if seen[aid] != (name, count):
                        raise ValueError("conflicting asset identity")
                    continue
                seen[aid] = (name, count)
                subtotal += count
        totals[name] = subtotal
    return {"total": sum(totals.values()), "asOf": now, "asOfDisplay": format_as_of(now), "definition": "Downloads of GitHub release assets from public non-fork CAVI repositories, including prereleases, documentation and repeated downloads; excludes drafts and other distribution channels.", "repositories": totals}


def request(url):
    result = subprocess.run(["gh", "api", "--include", "-H", "Accept: application/vnd.github+json", "-H", "X-GitHub-Api-Version: 2022-11-28", url], capture_output=True, check=True)
    raw = result.stdout.replace(b"\r\n", b"\n")
    headers, separator, body = raw.partition(b"\n\n")
    if not separator or not headers.startswith(b"HTTP/"):
        raise ValueError("invalid GitHub response")
    raw_dir = os.environ.get("CAVI_COUNTER_RAW_DIR")
    if raw_dir:
        import hashlib
        directory = Path(raw_dir)
        directory.mkdir(parents=True, exist_ok=True)
        (directory / (hashlib.sha256(url.encode()).hexdigest() + ".response")).write_bytes(result.stdout)
    link = next((line.split(":", 1)[1].strip() for line in headers.decode().splitlines() if line.lower().startswith("link:")), "")
    return json.loads(body), link


def main():
    result = collect(request, datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"))
    Path(sys.argv[1]).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
