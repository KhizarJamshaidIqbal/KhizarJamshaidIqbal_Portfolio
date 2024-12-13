import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import Header from '@/components/header'
import Footer from '@/components/footer'
import { isValidElement } from 'react';
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KhizarJamshaidIqbal - Software Engineer',
  description: 'Personal website of KhizarJamshaidIqbal, a skilled Software Engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if we're in the admin section based on the URL pattern
  const isAdminSection = isValidElement(children) && children.props.childPropSegment === 'admin';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isAdminSection ? (
            // Admin section - no header/footer
            children
          ) : (
            // Main site - with header/footer
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          )}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
