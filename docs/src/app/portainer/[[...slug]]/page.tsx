import { portainerSource } from '@/lib/source'
import type { Metadata } from 'next'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

export default async function Page(props: PageProps<'/portainer/[[...slug]]'>) {
  const params = await props.params
  const page = portainerSource.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return portainerSource.generateParams()
}

export async function generateMetadata(props: MetadataProps<'/portainer/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params
  const page = portainerSource.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
