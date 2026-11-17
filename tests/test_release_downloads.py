import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("release_downloads", Path(__file__).parents[1] / "scripts/release_downloads.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class CollectorTest(unittest.TestCase):
    def setUp(self):
        self.org = f"{mod.API}/orgs/cavi-ai/repos?type=public&per_page=100"
        self.next = f"{mod.API}/orgs/cavi-ai/repos?type=public&per_page=100&page=2"
        self.releases = f"{mod.API}/repos/cavi-ai/one/releases?per_page=100"
        self.assets = f"{mod.API}/repos/cavi-ai/one/releases/1/assets?per_page=100"
        self.asset_next = f"{self.assets}&page=2"
        repo = lambda name, fork=False: {"name": name, "private": False, "fork": fork, "owner": {"login": "cavi-ai"}}
        self.responses = {
            self.org: ([repo("one")], f'<{self.next}>; rel="next"'),
            self.next: ([repo("forked", True)], ""),
            self.releases: ([{"id": 1, "draft": False, "published_at": "2026-01-01", "prerelease": True}, {"id": 2, "draft": True}], ""),
            self.assets: ([{"id": 10, "download_count": 4}], f'<{self.asset_next}>; rel="next"'),
            self.asset_next: ([{"id": 10, "download_count": 4}, {"id": 11, "download_count": 3}], ""),
        }

    def request(self, url):
        return self.responses[url]

    def test_pagination_dedup_prerelease_and_drafts(self):
        result = mod.collect(self.request, "2026-01-01T00:00:00+00:00")
        self.assertEqual(result["total"], 7)
        self.assertEqual(result["repositories"], {"one": 7})

    def test_private_or_failed_collection_aborts(self):
        self.responses[self.next][0][0]["private"] = True
        with self.assertRaisesRegex(ValueError, "visibility"):
            mod.collect(self.request, "now")
        del self.responses[self.next]
        with self.assertRaises(KeyError):
            mod.collect(self.request, "now")

    def test_conflicting_asset_or_unsafe_next_aborts(self):
        self.responses[self.asset_next][0][0]["download_count"] = 5
        with self.assertRaisesRegex(ValueError, "conflicting"):
            mod.collect(self.request, "now")
        self.responses[self.org] = ([], '<https://example.org/page>; rel="next"')
        with self.assertRaisesRegex(ValueError, "unsafe"):
            mod.collect(self.request, "now")


if __name__ == "__main__":
    unittest.main()
