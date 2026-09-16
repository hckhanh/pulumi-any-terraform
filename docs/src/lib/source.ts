import { hedgehog } from '@lucide/lab'
import { llms, loader } from 'fumadocs-core/source'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { defineDocs } from 'fumadocs-mdx/macro'
import { Icon, icons } from 'lucide-react'
import { createElement } from 'react'
import { docsRoute } from './shared'

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
})

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  icon(icon) {
    const LucideIcon = icons[icon as keyof typeof icons]
    if (LucideIcon) {
      return createElement(LucideIcon)
    }

    if (icon === 'Hedgehog') {
      return createElement(Icon, { iconNode: hedgehog })
    }

    return null
  },
})

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
})
