// src/app/layout.tsx
import Footer from "@/components/Footer";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata = {
  title: "QR-AR Admin",
  description: "Crea y administra experiencias de realidad aumentada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-gray-50 dark:bg-gray-900 font-sans antialiased">
        <ErrorBoundary>
          <div className="min-h-full">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
