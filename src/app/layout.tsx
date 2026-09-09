import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'Scentsation Decant - Parfum Original Versi Mini',
  description: 'Nikmati wewangian original dalam ukuran decant 2ml, 3ml, 5ml, dan 10ml. 100% murni original.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900 font-sans">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
