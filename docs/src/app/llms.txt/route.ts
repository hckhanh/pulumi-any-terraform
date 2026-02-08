import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  const lines = ['# Documentation', '']

  for (const page of source.getPages()) {
    lines.push(`- [${page.data.title}](${page.url}): ${page.data.description}`)
  }

  return new Response(lines.join('\n'))
}
