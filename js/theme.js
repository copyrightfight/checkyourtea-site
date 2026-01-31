// Theme Toggle Functionality

const THEME_KEY = 'checkyourtea-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DARK_THEME;
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    if (theme === LIGHT_THEME) {
        html.classList.add('light-theme');
        if (themeToggle) themeToggle.textContent = '🌙';
    } else {
        html.classList.remove('light-theme');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Attach toggle listener
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
