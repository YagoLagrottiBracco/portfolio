"use client"

import { useEffect, useState } from 'react';
import { Hero } from '@/components/organisms/Hero';
import { TechStack } from '@/components/organisms/TechStack';
import { FeaturedProjects } from '@/components/organisms/FeaturedProjects';
import { About } from '@/components/organisms/About';
import { Projects } from '@/components/organisms/Projects';
import { Experience } from '@/components/organisms/Experience';
import { Specializations } from '@/components/organisms/Specializations';
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
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen">
          <Navigation />

          {/* 1. Hero */}
          <Hero />

          {/* 2. Tech Stack Strip */}
          <TechStack />

          {/* 3. Featured Projects */}
          <FeaturedProjects />

          {/* 4. About */}
          <About />

          {/* 5. Full Projects Grid */}
          <Projects />

          {/* 6. Experience & Education */}
          <Experience />

          {/* 7. Specializations & Courses */}
          <Specializations />

          {/* 8. CTA / Contact */}
          <Contact />

          {/* Footer */}
          <footer className="py-10 border-t border-white/5 bg-muted/20">
            <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
              <p>
                &copy; {new Date().getFullYear()} Yago Lagrotti Bracco. Built with Next.js &amp; Tailwind CSS.
              </p>
              <a
                href="https://www.linkedin.com/in/yagolagrottibracco"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </footer>
        </div>
      </ThemeProvider>
    </TranslationProvider>
  );
}
