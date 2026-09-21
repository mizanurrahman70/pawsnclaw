class PetProductSlider extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-track]');
    this.track.scrollLeft = 0;
    this.cards = Array.from(this.track.children);

    this.querySelector('[data-previous]')?.addEventListener('click', () => this.scrollBySlide(-1));
    this.querySelector('[data-next]')?.addEventListener('click', () => this.scrollBySlide(1));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.shouldAutoplay = this.dataset.autoplay === 'true' && !reduced.matches;
    if (this.shouldAutoplay) {
      this.startTimer();
      this.addEventListener('mouseenter', () => this.stopTimer());
      this.addEventListener('mouseleave', () => this.startTimer());
      this.addEventListener('focusin', () => this.stopTimer());
      this.addEventListener('focusout', () => this.startTimer());
    }
  }

  scrollBySlide(direction) {
    if (!this.cards.length) return;

    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 20;
    const step = this.cards[0].getBoundingClientRect().width + gap;
    const maxLeft = this.track.scrollWidth - this.track.clientWidth;

    let target = this.track.scrollLeft + step * direction;
    if (target >= maxLeft) target = 0;
    if (target <= 0) target = maxLeft;

    this.track.scrollTo({ left: target, behavior: 'smooth' });
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.scrollBySlide(1), Number(this.dataset.interval));
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  disconnectedCallback() {
    this.stopTimer();
  }
}

if (!customElements.get('pet-product-slider')) customElements.define('pet-product-slider', PetProductSlider);