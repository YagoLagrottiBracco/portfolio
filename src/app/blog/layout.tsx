"use client";

import { ThemeProvider } from "next-themes";
import { TranslationProvider } from '@/contexts/TranslationContext';
import type { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TranslationProvider>
  );
}
