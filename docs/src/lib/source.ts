import { type InferPageType, loader } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { 
  docs, 
  betterUptime, 
  bunnynet, 
  infisical, 
  logtail, 
  namecheap, 
  portainer, 
  teamcity, 
  time 
} from '@/.source'

// See https://fumadocs.dev/docs/headless/source-api for more info

// Main documentation source
export const docsSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

// Provider sources
export const betterUptimeSource = loader({
  baseUrl: '/better-uptime',
  source: betterUptime.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const bunnynetSource = loader({
  baseUrl: '/bunnynet',
  source: bunnynet.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const infisicalSource = loader({
  baseUrl: '/infisical',
  source: infisical.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const logtailSource = loader({
  baseUrl: '/logtail',
  source: logtail.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const namecheapSource = loader({
  baseUrl: '/namecheap',
  source: namecheap.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const portainerSource = loader({
  baseUrl: '/portainer',
  source: portainer.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const teamcitySource = loader({
  baseUrl: '/teamcity',
  source: teamcity.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export const timeSource = loader({
  baseUrl: '/time',
  source: time.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

// Legacy export for compatibility
export const source = docsSource

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
