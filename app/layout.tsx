import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSI Wallet Demo",
  description: "Demo de registro y login con SSI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-100 font-sans text-gray-800">
        {children}
      </body>
    </html>
  );
}
