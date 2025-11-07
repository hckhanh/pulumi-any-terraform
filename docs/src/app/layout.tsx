import { RootProvider } from 'fumadocs-ui/provider/next'
import type { Metadata } from 'next'
import './global.css'
import { inter, jetbrainsMono } from '@/lib/fonts'

export const metadata: Metadata = {
  metadataBase: new URL('https://pulumi.khanh.id'),
  title: {
    default: 'Pulumi Any Terraform - Bridge Terraform Providers to Pulumi',
    template: '%s | Pulumi Any Terraform',
  },
  description:
    'Use any Terraform provider with Pulumi. Get full type safety, multi-language support, and seamless integration with infrastructure-as-code. Supports Better Uptime, Bunnynet, Infisical, Namecheap, and more.',
  keywords: [
    'pulumi',
    'terraform',
    'infrastructure as code',
    'iac',
    'devops',
    'cloud infrastructure',
    'terraform provider',
    'pulumi provider',
    'typescript',
    'infrastructure automation',
    'namecheap',
    'better uptime',
    'bunnynet',
    'infisical',
  ],
  authors: [
    {
      name: 'Khánh Hoàng',
      url: 'https://www.khanh.id',
    },
  ],
  creator: 'Khánh Hoàng',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pulumi.khanh.id',
    title: 'Pulumi Any Terraform - Bridge Terraform Providers to Pulumi',
    description:
      'Use any Terraform provider with Pulumi. Get full type safety and seamless infrastructure-as-code integration.',
    siteName: 'Pulumi Any Terraform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulumi Any Terraform',
    description:
      'Use any Terraform provider with Pulumi. Full type safety and seamless IaC integration.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      lang='en'
      suppressHydrationWarning
    >
      <body className='flex min-h-screen flex-col'>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
