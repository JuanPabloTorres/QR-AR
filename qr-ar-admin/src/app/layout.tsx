// src/app/layout.tsx
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-gray-50 font-sans antialiased">
        <div className="min-h-full">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
