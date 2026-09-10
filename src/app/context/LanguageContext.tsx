import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'es';

const dictionary: Record<string, { en: string; es: string }> = {
  projects: { en: 'UI projects', es: 'Proyectos UI' },
  cases: { en: 'Case studies', es: 'Casos de estudio' },
  agent: { en: 'Agent', es: 'Agente' },
  about: { en: 'About me', es: 'Sobre mí' },
  contact: { en: 'Contact', es: 'Contacto' },
  uiProjects: { en: 'UI Projects', es: 'Proyectos UI' },
  caseStudies: { en: 'Case Studies', es: 'Casos de estudio' },
  open: { en: 'Open', es: 'Abrir' },
  nextPrevious: { en: 'Press next/previous keys to change between projects.', es: 'Presiona las teclas anterior/siguiente para cambiar de proyecto.' },
  swipe: { en: 'Swipe left/right to change project.', es: 'Desliza a la izquierda/derecha para cambiar de proyecto.' },
  unsaved: { en: 'Unsaved changes', es: 'Cambios sin guardar' },
  saving: { en: 'Saving…', es: 'Guardando…' },
  saved: { en: 'Saved', es: 'Guardado' },
  saveFailed: { en: 'Save failed', es: 'Error al guardar' },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('language') === 'es' ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try { localStorage.setItem('language', language); } catch { /* storage unavailable */ }
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage: () => setLanguage(current => current === 'en' ? 'es' : 'en'),
    t: (key: string) => dictionary[key]?.[language] ?? key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}