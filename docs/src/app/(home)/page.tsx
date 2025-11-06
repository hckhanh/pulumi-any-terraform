import Link from 'next/link'

export default function HomePage() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center'>
      <div className='space-y-4'>
        <h1 className='font-bold text-4xl md:text-5xl lg:text-6xl'>
          Pulumi Any Terraform
        </h1>
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl'>
          Use any Terraform provider with Pulumi. Get full type safety,
          multi-language support, and seamless integration with Pulumi's
          infrastructure-as-code platform.
        </p>
      </div>

      <div className='flex flex-wrap items-center justify-center gap-4'>
        <Link
          className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90'
          href='/docs'
        >
          Get Started
        </Link>
        <Link
          className='inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 font-medium transition-colors hover:bg-accent hover:text-accent-foreground'
          href='https://github.com/hckhanh/pulumi-any-terraform'
          rel='noopener noreferrer'
          target='_blank'
        >
          View on GitHub
        </Link>
      </div>

      <div className='grid w-full max-w-4xl gap-6 md:grid-cols-3'>
        <div className='space-y-2 rounded-lg border p-6'>
          <h3 className='font-semibold text-xl'>🔄 Full Compatibility</h3>
          <p className='text-muted-foreground text-sm'>
            Use any Terraform provider with Pulumi's state management and
            deployment engine.
          </p>
        </div>
        <div className='space-y-2 rounded-lg border p-6'>
          <h3 className='font-semibold text-xl'>📘 Type Safety</h3>
          <p className='text-muted-foreground text-sm'>
            Complete TypeScript definitions with IntelliSense and compile-time
            type checking.
          </p>
        </div>
        <div className='space-y-2 rounded-lg border p-6'>
          <h3 className='font-semibold text-xl'>⚡ Dynamic Updates</h3>
          <p className='text-muted-foreground text-sm'>
            Stay automatically synced with upstream Terraform providers without
            manual work.
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='font-semibold text-2xl'>Available Providers</h2>
        <div className='flex flex-wrap justify-center gap-2'>
          {[
            'Better Uptime',
            'Bunnynet',
            'Infisical',
            'Logtail',
            'Namecheap',
            'Portainer',
            'TeamCity',
            'Time',
          ].map((provider) => (
            <span
              className='rounded-full border bg-secondary px-4 py-1 text-secondary-foreground text-sm'
              key={provider}
            >
              {provider}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
