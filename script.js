function initializeSite() {
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  const year = document.getElementById('year');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? 'Close' : 'Menu';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'Menu';
      });
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

document.addEventListener('partialsloaded', initializeSite, { once: true });
