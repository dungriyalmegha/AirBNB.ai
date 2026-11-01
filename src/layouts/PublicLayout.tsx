import { Outlet } from 'react-router-dom'
import { FloatingWhatsApp } from '../components/FloatingWhatsApp'
import { Footer } from '../components/Footer'
import { MobileTabBar } from '../components/MobileTabBar'
import { Navbar } from '../components/Navbar'
import { useData } from '../context/DataContext'
import { useScrollToTop } from '../hooks/useScrollToTop'

export function PublicLayout() {
  useScrollToTop()
  const { ready } = useData()
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        {ready ? <Outlet /> : <PageLoader />}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileTabBar />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-sand border-t-forest" />
    </div>
  )
}
