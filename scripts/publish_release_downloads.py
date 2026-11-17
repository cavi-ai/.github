#!/usr/bin/env python3
"""Publish a changed snapshot as a GitHub-signed, leased commit."""
import base64
import json
from pathlib import Path
import subprocess
import sys

MUTATION = '''mutation($input: CreateCommitOnBranchInput!) {
  createCommitOnBranch(input: $input) {
    commit { oid signature { isValid wasSignedByGitHub } }
  }
}'''


def publish(old, new, expected_head, execute):
    if (old.get("total"), old.get("repositories"), old.get("definition")) == (new.get("total"), new.get("repositories"), new.get("definition")):
        return None
    content = json.dumps(new, indent=2, ensure_ascii=False) + "\n"
    payload = {"query": MUTATION, "variables": {"input": {
        "branch": {"repositoryNameWithOwner": "cavi-ai/.github", "branchName": "main"},
        "expectedHeadOid": expected_head,
        "message": {"headline": "chore: refresh release download counts"},
        "fileChanges": {"additions": [{"path": "metrics/release-downloads.json", "contents": base64.b64encode(content.encode()).decode()}]},
    }}}
    result = execute(payload)
    if result.get("errors"):
        raise ValueError("GitHub rejected the counter update")
    commit = result.get("data", {}).get("createCommitOnBranch", {}).get("commit") or {}
    if not commit.get("oid") or not (commit.get("signature") or {}).get("isValid") or not (commit.get("signature") or {}).get("wasSignedByGitHub"):
        raise ValueError("counter commit missing a verified signature; inspect branch before retrying")
    return commit["oid"]


def execute(payload):
    result = subprocess.run(["gh", "api", "graphql", "--input", "-"], input=json.dumps(payload), text=True, capture_output=True, check=True)
    return json.loads(result.stdout)


def main():
    old = json.loads(Path(sys.argv[1]).read_text())
    new = json.loads(Path(sys.argv[2]).read_text())
    oid = publish(old, new, sys.argv[3], execute)
    print(f"Published {oid}" if oid else "Counts unchanged")


if __name__ == "__main__":
    main()
