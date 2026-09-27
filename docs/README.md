# Documentation

These pages are a [Docs7](https://context7.com/docs/docs7/overview) site. The site is `docs.json` plus MDX, hosted by Docs7, so this repository does not ship a documentation framework.

Preview locally with Node.js 20.19 or newer:

```bash
npx @upstash/docs7 dev
```

Open http://localhost:3333.

To publish, open the Docs7 tab in your Context7 teamspace, choose this repository, and set the docs path to `docs`. To keep `https://pulumi.khanh.id/docs`, serve the site on that domain at the path `/docs`. See [Custom domains](https://context7.com/docs/docs7/custom-domains).

Canonical URLs are `https://pulumi.khanh.id/docs` plus each page path. Docs7 generates `robots.txt` and `sitemap.xml` for the docs site. Because the site is mounted at `/docs`, crawlers read the parent site's root `robots.txt`, not `/docs/robots.txt`. Add this line there:

```text
Sitemap: https://pulumi.khanh.id/docs/sitemap.xml
```

Docs7 publishes agent endpoints under the docs root: `/llms.txt`, `/llms-full.txt`, `/search`, and `/.well-known/agent-skills/index.json`. A page is also available as Markdown at `<path>.md`, or by requesting the HTML URL with `Accept: text/markdown`. Do not add `llms.txt` or `llms-full.txt` in this folder; a file here replaces the generated one.

When you publish the site, enable **Add to Context7** so a production build refreshes the Context7 library. Agents can then read these docs through the Context7 MCP server.
