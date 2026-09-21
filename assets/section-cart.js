document.querySelectorAll('[data-qty]').forEach((el) => {
  const input = el.querySelector('[data-qty-input], .pet-cart__qty-input');
  if (!input) return;

  const clamp = (value) => {
    const min = Number(el.dataset.min || 1);
    const max = Number(el.dataset.max || 999);
    value = parseInt(value, 10);
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  };

  el.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
    input.value = clamp(Number(input.value) - 1);
  });

  el.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
    input.value = clamp(Number(input.value) + 1);
  });

  input.addEventListener('change', () => {
    input.value = clamp(input.value);
  });
});