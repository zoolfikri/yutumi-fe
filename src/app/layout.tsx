'use client'

import Script from 'next/script'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../store/store'

import "@/middlewares/http-interceptor";

import './../styles/style.scss'
// We use those styles to show code examples, you should remove them in your application.
// import './../styles/examples.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return (
    <html lang="en">
      <head>
        <title>CoreUI PRO Next.js Admin Template</title>
        <Script
          id="get-color-scheme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        const userMode = localStorage.getItem('coreui-pro-next-js-admin-template-theme-default');
        const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (userMode === 'dark' || (userMode !== 'light' && systemDarkMode)) {
          document.documentElement.dataset.coreuiTheme = 'dark';
        }`,
          }}
        />
      </head>
      <body>
        <Provider store={storeRef.current}>{children}</Provider>
      </body>
    </html>
  )
}
