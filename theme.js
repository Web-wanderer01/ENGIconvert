(() => {
  const storageKey = 'engiconvert-theme';
  const savedTheme = localStorage.getItem(storageKey);
  const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  document.documentElement.dataset.theme = preferredTheme;

  const nav = document.querySelector('.nav');
  if (!nav) return;

  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Switch color theme');
  toggle.innerHTML = '<span class="theme-toggle-track"><span class="theme-toggle-thumb"></span></span><span class="theme-toggle-icon" aria-hidden="true">☼</span>';

  const spacer = nav.querySelector('.spacer');
  nav.insertBefore(toggle, spacer || null);

  const updateToggle = () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.querySelector('.theme-toggle-icon').textContent = isLight ? '☾' : '☼';
  };

  toggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    updateToggle();
  });

  updateToggle();
})();
