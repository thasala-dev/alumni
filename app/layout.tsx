import type React from "react";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import AppProviders from "./app-providers";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบศิษย์เก่าสำนักเภสัชศาสตร์ - มหาวิทยาลัยวลัยลักษณ์",
  description:
    "ระบบเครือข่ายศิษย์เก่าสำนักเภสัชศาสตร์ มหาวิทยาลัยวลัยลักษณ์ เชื่อมต่อเภสัชกรทั่วประเทศ แลกเปลี่ยนประสบการณ์ และร่วมพัฒนาวงการเภสัชกรรม",
  keywords:
    "ศิษย์เก่า, เภสัชศาสตร์, วลัยลักษณ์, เภสัชกร, เครือข่าย, มหาวิทยาลัย, pharmacy, alumni",
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
          " min-h-screen bg-gray-50 dark:bg-gray-800"
        }
      >
        <AppProviders>
          <main className="flex-1 min-w-0">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
