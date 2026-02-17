# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Integral Teamwork Toolkit (ITT)** — A collection of static HTML/CSS prototypes for a team collaboration web application. This is a design prototyping repository, not a build-tooling project. There is no package.json, no bundler, no test framework.

The product language is **Swedish**. All user-facing text, labels, and navigation should be in Swedish.

This repo will contain a progression of requireents and gui prototypes for a web based tool.

## Serving Locally

Open any `.html` file directly in a browser, or use a simple HTTP server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` to see the index page linking to all prototypes.

## Repository Structure

- prototypes/ - a progression of protoypes created, always build the next version based on the last existing version
- reqs/ - a list of requirements doc, as the project evolves, latest requiremts always dominate previous/older reqs
- **`docs/admin-section-req.md`** — Comprehensive admin specification (domain model, permissions, UI flows, CRUD patterns). This is the canonical requirements document for the **admin** section of the gui. 
- **`reqs/old`** — Original requirement materials (PowerPoints, screenshots, old system analysis). Gitignored.
- **`index.html`** — Landing page linking to all prototypes - **keep updated** with headers per version and direkt links to each prototype

## Files to keep updated with the latest info at all times
- reqs/admin-section-req.md
- index.html

## Key Conventions

- All HTML files are self-contained single-file prototypes (inline CSS + JS, no external dependencies except Google Fonts)
- CSS uses custom properties defined in `:root` for theming
- No build step — edit HTML files directly
- Temporary/scratch files go in `tmp/` (gitignored)
