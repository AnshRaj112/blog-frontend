import './globals.css';
import 'react-quill/dist/quill.snow.css';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
