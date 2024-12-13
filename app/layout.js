import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing content',
}

// Add visitor tracking component
function VisitorTracker() {
  useEffect(() => {
    // Generate a session ID if not exists
    let sessionId = localStorage.getItem('visitorSessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('visitorSessionId', sessionId);
    }

    // Function to update visitor status
    const updateVisitor = async () => {
      try {
        await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            pageUrl: window.location.pathname
          })
        });
      } catch (error) {
        console.error('Error updating visitor status:', error);
      }
    };

    // Update immediately and then every minute
    updateVisitor();
    const interval = setInterval(updateVisitor, 60000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}
