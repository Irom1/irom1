var metaThemeColor = document.querySelector("meta[name=theme-color]");
/* Change browser theme color when system dark mode */
function changeTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Dark mode on
        document.body.classList.add("dark");
    } else {
        // Dark mode off
        document.body.classList.remove("dark");
    }
}
try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeTheme);
} catch (e) { }
changeTheme()