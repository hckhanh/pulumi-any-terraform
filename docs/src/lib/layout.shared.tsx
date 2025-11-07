import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { 
  docsSource, 
  betterUptimeSource, 
  bunnynetSource, 
  infisicalSource, 
  logtailSource, 
  namecheapSource, 
  portainerSource, 
  teamcitySource, 
  timeSource 
} from '@/lib/source'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Pulumi Any Terraform',
    },
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
    ],
  }
}

export const docsOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: docsSource.pageTree,
  sidebar: {
    tabs: {
      transform(option, node) {
        const meta = node.root?.file.data.meta
        return {
          ...option,
          icon: meta?.icon,
        }
      },
    },
  },
}

export const betterUptimeOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: betterUptimeSource.pageTree,
}

export const bunnynetOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: bunnynetSource.pageTree,
}

export const infisicalOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: infisicalSource.pageTree,
}

export const logtailOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: logtailSource.pageTree,
}

export const namecheapOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: namecheapSource.pageTree,
}

export const portainerOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: portainerSource.pageTree,
}

export const teamcityOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: teamcitySource.pageTree,
}

export const timeOptions: BaseLayoutProps = {
  ...baseOptions(),
  tree: timeSource.pageTree,
}
