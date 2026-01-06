import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "color the night",
  description: "We paint after dark. Indie-funk-pop from the shadows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: bandInfo } = await supabase.from('band_info').select('accent_color').single();
  const accentColor = bandInfo?.accent_color || '#f59e0b';

  return (
    <html lang="en">
      <body 
        className={`${syne.variable} ${inter.variable} grain`}
        style={{ '--accent': accentColor, '--accent-soft': `${accentColor}26` } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
