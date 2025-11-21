import * as calloutComponents from 'fumadocs-ui/components/callout'
import * as cardComponents from 'fumadocs-ui/components/card'
import * as tabComponents from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,

    ...calloutComponents,
    ...cardComponents,
    ...tabComponents,
  }
}
