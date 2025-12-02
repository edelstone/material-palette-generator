(function () {
  const root = document.documentElement;
  const toggleButton = document.querySelector('[data-theme-toggle]');
  if (!toggleButton) return;

  const icon = toggleButton.querySelector('.material-icons');
  const label = toggleButton.querySelector('.theme-toggle__label');
  const storageKey = 'mp-theme';

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage errors (private mode, etc.)
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    toggleButton.setAttribute('aria-pressed', theme === 'dark');
    if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  };

  const preferred = getStoredTheme();
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = preferred || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  toggleButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storeTheme(nextTheme);
    applyTheme(nextTheme);
  });
})();
