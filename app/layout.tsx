import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบศิษย์เก่า - เชื่อมต่อเครือข่ายศิษย์เก่า",
  description:
    "ระบบจัดการศิษย์เก่าที่ครบครัน เชื่อมต่อกับเพื่อนศิษย์เก่าทั่วประเทศ แลกเปลี่ยนประสบการณ์ และร่วมสร้างอนาคตที่ดีกว่า",
  keywords: "ศิษย์เก่า, เครือข่าย, มหาวิทยาลัย, สมาคม, alumni",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body
        className={
          ibmPlexSansThai.className +
          " min-h-screen bg-gray-100 dark:bg-neutral-900"
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1 min-w-0">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
