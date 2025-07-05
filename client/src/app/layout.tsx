import '../style/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: 'Rooming List Management App',
    default: 'Home - Rooming List Management App',
  },
  description:
    'This application manages a collection of hotel bookings for events ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
