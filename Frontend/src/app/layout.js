// 위 줄을 완전히 삭제

import { Noto_Sans_KR } from 'next/font/google';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import NavBar from '@/components/common/NavBar';

const notoSansKr = Noto_Sans_KR({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

export const metadata = {
  title: 'ChiDiet - 당신만을 위한 맞춤형 건강 식단',
  description: '한의학 체질 이론과 현대 AI로 맞춤형 건강 식단을 제공하는 서비스입니다.',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKr.variable} suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${notoSansKr.className}`}>
        <AuthProvider>
          <NavBar />
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
} 