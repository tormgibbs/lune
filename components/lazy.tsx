import React, { Suspense, ReactNode } from 'react'

interface LazyProps {
  children: ReactNode
  fallback?: ReactNode
}

const Lazy = ({ children, fallback = null }: LazyProps) => {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default Lazy
