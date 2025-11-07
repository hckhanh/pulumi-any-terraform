import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      sidebar={{
        tabs: {
          transform(option, node) {
            const meta = node.root?.file.data.meta
            return {
              ...option,
              icon: meta?.icon,
            }
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  )
}
