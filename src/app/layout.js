import { ThemeProvider } from 'next-themes'
import Navbar from '../../src/components/Navbar'
import '@/app/globals.css'
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}