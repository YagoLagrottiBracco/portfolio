import { Geist, Geist_Mono } from "next/font/google"

/** Loaded once here because every root layout renders the same document shell. */
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})
