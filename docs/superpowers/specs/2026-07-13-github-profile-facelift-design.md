# CAVI-AI GitHub Profile Facelift Design

## Goal

Reframe the CAVI-AI organization profile as the GitHub front door for an independent research and open-source company. The profile should clearly link to `https://cavi-ai.xyz`, explain the company in one scan, and give developers a useful path into the two product lines that exist today.

## Audience and Positioning

The primary audience is developers evaluating CAVI-AI's public work. The profile leads with research-company identity rather than package documentation or sales language. It states that CAVI-AI builds open tools for agent systems, works in public, and releases public work under the MIT license.

The profile may signal that more tools are in development, but it must not name, promise, or describe unreleased products.

## Information Architecture

1. Preserve the centered CAVI-AI wordmark.
2. Add a concise mission statement aligned with the company website.
3. Make `cavi-ai.xyz` the primary call to action, with a secondary link to the public repositories.
4. Present exactly two current product lines:
   - **Agent runtime infrastructure:** `@cavi-ai/api-client`, described as a gateway-agnostic TypeScript client and explicitly not as the canonical runtime contract.
   - **Knowledge workflows:** Companion for Claude and `claude-obsidian`, presented together because they share the local MCP bridge and vault workflow.
5. Retain only the shortest useful installation commands for the public developer tools.
6. Summarize current research themes: runtime interoperability, explicit contracts, graceful degradation, and local-first workflows.
7. Close with an open-source statement and a restrained note that more work is in development.

## Visual Treatment

Use GitHub-native Markdown and restrained HTML only where alignment is useful. Keep the existing wordmark asset, use compact linked badges for the website, repositories, and MIT license, and avoid decorative metrics, dynamic badges, excessive emoji, or graphics that compete with the work.

The profile should feel related to the landing page through its language—open, inspectable, verifiable, developer-oriented—without attempting to reproduce the website layout inside GitHub Markdown.

## Organization Metadata

Update the public organization fields to:

- Description: `Open research and MIT-licensed infrastructure for agent systems.`
- Website: `https://cavi-ai.xyz`

No repository visibility, membership, security, billing, or other organization settings change.

## Validation

- Every repository and website link resolves successfully.
- The profile contains the two product lines and no private or unreleased repository names.
- The profile renders without broken relative assets.
- The organization description and website match the approved text.
- The final diff is limited to the profile README, this design/implementation documentation, and organization metadata.
