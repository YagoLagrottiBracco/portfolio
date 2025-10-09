"use client"

import { useEffect, useState } from 'react';
import { Hero } from '@/components/organisms/Hero';
import { About } from '@/components/organisms/About';
import { Projects } from '@/components/organisms/Projects';
import { Experience } from '@/components/organisms/Experience';
import { Contact } from '@/components/organisms/Contact';
import { Navigation } from '@/components/organisms/Navigation';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { ThemeProvider } from 'next-themes';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe um idioma salvo no localStorage
    const savedLocale = localStorage.getItem('locale') as 'pt' | 'en';

    if (savedLocale && (savedLocale === 'pt' || savedLocale === 'en')) {
      setIsLoading(false);
      return;
    }

    // Detectar idioma do navegador
    const browserLang = navigator.language.toLowerCase();
    const detectedLocale = browserLang.startsWith('pt') ? 'pt' : 'en';

    // Salvar no localStorage
    localStorage.setItem('locale', detectedLocale);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <TranslationProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen">
          <Navigation />
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />

          {/* Footer */}
          <footer className="py-8 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground">
                © 2024 Yago Lagrotti Bracco. Built with Next.js and Tailwind CSS.
              </p>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </TranslationProvider>
  );
}
