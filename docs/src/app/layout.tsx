import { RootProvider } from 'fumadocs-ui/provider/next'
import './global.css'
import { inter, jetbrainsMono } from '@/lib/fonts'

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
