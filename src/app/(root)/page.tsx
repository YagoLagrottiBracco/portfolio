"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se já existe um idioma salvo no localStorage
    const savedLocale = localStorage.getItem('locale');

    if (savedLocale && (savedLocale === 'pt' || savedLocale === 'en')) {
      // Se já tem um idioma salvo, redirecionar para ele
      router.replace(`/${savedLocale}`);
      return;
    }

    // Detectar idioma do navegador
    const browserLang = navigator.language.toLowerCase();

    // Verificar se começa com 'pt' (portuguese) ou outros idiomas
    const detectedLocale = browserLang.startsWith('pt') ? 'pt' : 'en';

    // Salvar no localStorage
    localStorage.setItem('locale', detectedLocale);

    // Redirecionar para o idioma detectado
    router.replace(`/${detectedLocale}`);
  }, [router]);

  // Loading state enquanto redireciona
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
