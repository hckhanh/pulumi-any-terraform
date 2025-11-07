import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { docsOptions } from '@/lib/layout.shared'
import { 
  docsSource,
  betterUptimeSource,
  bunnynetSource,
  infisicalSource,
  logtailSource,
  namecheapSource,
  portainerSource,
  teamcitySource,
  timeSource,
} from '@/lib/source'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout 
      {...docsOptions}
      sidebar={{
        ...docsOptions.sidebar,
        tabs: [
          {
            title: 'Documentation',
            url: '/docs',
            tree: docsSource.pageTree,
          },
          {
            title: 'Better Uptime',
            url: '/better-uptime',
            tree: betterUptimeSource.pageTree,
          },
          {
            title: 'Bunnynet',
            url: '/bunnynet',
            tree: bunnynetSource.pageTree,
          },
          {
            title: 'Infisical',
            url: '/infisical',
            tree: infisicalSource.pageTree,
          },
          {
            title: 'Logtail',
            url: '/logtail',
            tree: logtailSource.pageTree,
          },
          {
            title: 'Namecheap',
            url: '/namecheap',
            tree: namecheapSource.pageTree,
          },
          {
            title: 'Portainer',
            url: '/portainer',
            tree: portainerSource.pageTree,
          },
          {
            title: 'TeamCity',
            url: '/teamcity',
            tree: teamcitySource.pageTree,
          },
          {
            title: 'Time',
            url: '/time',
            tree: timeSource.pageTree,
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  )
}
