import { docs } from 'fumadocs-mdx:collections/server'
import { hedgehog } from '@lucide/lab'
import { type InferPageType, loader } from 'fumadocs-core/source'
import { Icon, icons } from 'lucide-react'
import { createElement } from 'react'

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    const LucideIcon = icons[icon as keyof typeof icons]
    if (LucideIcon) {
      return createElement(LucideIcon)
    }

    if (icon === 'Hedgehog') {
      return createElement(Icon, { iconNode: hedgehog })
    }

    // Return null or a default icon if not found
    return null
  },
})

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png']

  return {
    segments,
    url: `/og/docs/${segments.join('/')}`,
  }
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title}

${processed}`
}
