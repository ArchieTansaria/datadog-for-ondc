import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse — Observability for Open Network Commerce",
  description: "Purpose-built observability for open network commerce. See inside every ONDC order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-[#09090b] text-[#fafafa] antialiased selection:bg-[#27272a] selection:text-white">
      <body className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
