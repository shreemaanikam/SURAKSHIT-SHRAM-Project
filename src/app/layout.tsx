import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/components/LanguageContext"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Surakshit Shram — Workplace Safety Compliance",
  description: "Government workplace safety compliance platform for companies, inspectors, and workers. Ministry of Labour & Employment.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
