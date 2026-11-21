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

    def test_timestamp_display_uses_new_york_standard_and_daylight_time(self):
        self.assertEqual(mod.format_as_of("2026-11-17T02:14:51+00:00"), "Nov 16, 2026 9:14 PM EST")
        self.assertEqual(mod.format_as_of("2026-07-01T16:05:00+00:00"), "Jul 1, 2026 12:05 PM EDT")

    def test_pagination_dedup_prerelease_and_drafts(self):
        result = mod.collect(self.request, "2026-01-01T00:00:00+00:00")
        self.assertEqual(result["total"], 7)
        self.assertEqual(result["totalDisplay"], "7")
        self.assertEqual(result["repositories"], {"one": 7})

    def test_total_display_groups_thousands_and_millions(self):
        for count, expected in [(1000, "1,000"), (1000000, "1,000,000")]:
            with self.subTest(count=count):
                self.responses[self.assets][0][0]["download_count"] = count
                self.responses[self.asset_next] = ([], "")
                result = mod.collect(self.request, "2026-01-01T00:00:00+00:00")
                self.assertEqual(result["total"], count)
                self.assertEqual(result["totalDisplay"], expected)

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
