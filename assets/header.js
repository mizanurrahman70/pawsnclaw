document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.site-header__burger');
  if (!button) return;
  const drawer = document.getElementById(button.getAttribute('aria-controls'));
  if (!drawer) return;

  const isOpen = () => !drawer.hasAttribute('hidden');
  const setState = (open) => {
    drawer.toggleAttribute('hidden', !open);
    drawer.classList.toggle('is-open', open);
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  button.addEventListener('click', () => setState(!isOpen()));
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setState(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setState(false);
  });
});