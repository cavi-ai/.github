import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("publisher", Path(__file__).parents[1] / "scripts/publish_release_downloads.py")
publisher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(publisher)


class PublisherTest(unittest.TestCase):
    def test_unchanged_ignores_timestamp(self):
        old = {"total": 1, "repositories": {"one": 1}, "definition": "d", "asOf": "old"}
        self.assertIsNone(publisher.publish(old, {**old, "asOf": "new"}, "head", lambda _: self.fail("unexpected write")))

    def test_changed_uses_lease_single_file_and_requires_signature(self):
        old = {"total": 1, "repositories": {"one": 1}, "definition": "d"}
        new = {"total": 2, "repositories": {"one": 2}, "definition": "d"}
        def success(payload):
            data = payload["variables"]["input"]
            self.assertEqual(data["expectedHeadOid"], "head")
            self.assertEqual([f["path"] for f in data["fileChanges"]["additions"]], ["metrics/release-downloads.json"])
            return {"data": {"createCommitOnBranch": {"commit": {"oid": "new", "signature": {"isValid": True, "wasSignedByGitHub": True}}}}}
        self.assertEqual(publisher.publish(old, new, "head", success), "new")
        with self.assertRaisesRegex(ValueError, "signature"):
            publisher.publish(old, new, "head", lambda _: {"data": {"createCommitOnBranch": {"commit": {"oid": "new", "signature": None}}}})
        with self.assertRaisesRegex(ValueError, "rejected"):
            publisher.publish(old, new, "head", lambda _: {"errors": [{"message": "head changed"}]})


if __name__ == "__main__":
    unittest.main()
