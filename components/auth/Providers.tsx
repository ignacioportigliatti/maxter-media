'use client'

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react'

interface ProvidersProps {
    children: ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  return (
    <SessionProvider>{props.children}</SessionProvider>
  )
}