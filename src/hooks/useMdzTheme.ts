import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mdz-theme';

/**
 * Tema claro/oscuro compartido por todo el sitio. Se persiste en
 * localStorage y se refleja como la clase "mdz-light" en <html>.
 */
export function useMdzTheme() {
  const [light, setLight] = useState(() => localStorage.getItem(STORAGE_KEY) === 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('mdz-light', light);
  }, [light]);

  const toggleTheme = () => {
    setLight((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark');
      return next;
    });
  };

  return { light, toggleTheme };
}
