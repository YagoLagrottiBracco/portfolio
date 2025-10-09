"use client";

import { ThemeProvider } from "next-themes";
import { TranslationProvider } from '@/contexts/TranslationContext';
import { Fragment } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function LocaleLayout({ children }: LayoutProps) {
  return (
    <Fragment>
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
    </Fragment>
  );
}
