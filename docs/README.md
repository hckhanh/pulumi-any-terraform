# Documentation

These pages are a [Docs7](https://context7.com/docs/docs7/overview) site. The site is `docs.json` plus MDX, hosted by Docs7, so this repository does not ship a documentation framework.

Preview locally with Node.js 20.19 or newer:

```bash
npx @upstash/docs7 dev
```

Open http://localhost:3333.

To publish, open the Docs7 tab in your Context7 teamspace, choose this repository, and set the docs path to `docs`. To keep `https://pulumi.khanh.id/docs`, serve the site on that domain at the path `/docs`. See [Custom domains](https://context7.com/docs/docs7/custom-domains).
