import { SWRConfig } from 'swr'
import { Toaster } from 'sonner'

import { fetcher } from '@/lib/api'
import { ThemeProvider } from '@/components/providers/theme-provider'

type AppProvidersProps = {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig value={{ fetcher }}>
        {children}
        <Toaster richColors position="top-right" />
      </SWRConfig>
    </ThemeProvider>
  )
}
