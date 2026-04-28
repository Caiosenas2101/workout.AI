import { createRootRoute } from '@tanstack/react-router'

import { AppLayout } from '@/components/app/app-layout'

export const Route = createRootRoute({
  component: AppLayout,
})
