function loadPartials() {
  const placeholders = document.querySelectorAll('[data-include]');

  placeholders.forEach((placeholder) => {
    const path = placeholder.dataset.include;
    const partialName = path.split('/').pop().replace('.html', '');
    const markup = window.sitePartials?.[partialName];

    if (!markup) {
      throw new Error(`Could not find markup for ${path}.`);
    }

    placeholder.outerHTML = markup;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    loadPartials();
    document.dispatchEvent(new Event('partialsloaded'));
  }
  catch (error) {
    console.error('Unable to load page content:', error);
  }
});
