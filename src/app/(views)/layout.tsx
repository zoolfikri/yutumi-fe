'use client'

import { useRouter } from 'next/navigation'
import { AppAside, AppSidebar, AppFooter, AppHeader } from '@/components/layout'
import { CContainer } from '@coreui/react-pro'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const user_data = useSelector((state: any) => state.user_data)

  // Hook to check if user is logged in
  useEffect(() => {
    if (!user_data.access_token) {
      router.push('/login')
    }
  }, [user_data.access_token, router])

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CContainer fluid className="px-4">{children}</CContainer>
        </div>
        <AppFooter />
      </div>
      <AppAside />
    </>
  )
}
