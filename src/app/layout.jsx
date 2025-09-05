import { Inter } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthContext";
import { Toaster } from "sonner";
import TopNavigation from "@/components/navigation/TopNavigation";
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pen Tutor",
  description: "Smart Learning Solutions",
  generator: 'v0.dev',
  favicon: '/favicon.png',
  keywords: ['Pen Tutor', 'Online Tutoring', 'Tutoring Services', 'Online Learning', 'Smart Learning', 'Smart Tutoring', 'Online Tutor', 'Tutor', 'Learning', 'Smart Learning Solutions'],
  authors: [{ name: 'Pen Tutor' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.png',
  },
};

// add favicon to page

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <TopNavigation />
          <main className="pt-16 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            {children}
          </main>
          <Toaster richColors closeButton />
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
