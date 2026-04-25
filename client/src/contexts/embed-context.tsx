/**
 * EmbedContext — détecte le mode iframe WordPress (?embed=1)
 * et fournit l'état à tous les composants enfants.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const EmbedContext = createContext<boolean>(false);

export function EmbedProvider({ children }: { children: ReactNode }) {
  const [isEmbed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('embed') === '1';
  });

  useEffect(() => {
    if (!isEmbed) return;
    // Allow the body to stretch naturally so parent can measure it
    document.documentElement.style.overflow = 'visible';
    document.body.style.overflow = 'visible';
    // Transparent bg so WordPress theme shows through if needed
    document.body.style.background = 'transparent';
  }, [isEmbed]);

  return (
    <EmbedContext.Provider value={isEmbed}>
      {children}
    </EmbedContext.Provider>
  );
}

export function useEmbed(): boolean {
  return useContext(EmbedContext);
}
