class PetCarousel extends HTMLElement {
  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll('[data-slide]'));
    this.dots = Array.from(this.querySelectorAll('[data-dot]'));
    this.current = 0;
    this.querySelector('[data-previous]')?.addEventListener('click', () => this.show(this.current - 1));
    this.querySelector('[data-next]')?.addEventListener('click', () => this.show(this.current + 1));
    this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.show(index)));
    this.shouldAutoplay = this.dataset.autoplay === 'true' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.shouldAutoplay) {
      this.startTimer();
      this.addEventListener('mouseenter', () => this.stopTimer());
      this.addEventListener('mouseleave', () => this.startTimer());
      this.addEventListener('focusin', () => this.stopTimer());
      this.addEventListener('focusout', () => this.startTimer());
    }
  }

  show(index) {
    this.current = (index + this.slides.length) % this.slides.length;
    this.slides.forEach((slide, slideIndex) => {
      const active = slideIndex === this.current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    this.dots.forEach((dot, dotIndex) => {
      const active = dotIndex === this.current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.show(this.current + 1), Number(this.dataset.interval));
  }

  stopTimer() { clearInterval(this.timer); }

  disconnectedCallback() { this.stopTimer(); }
}

if (!customElements.get('pet-carousel')) customElements.define('pet-carousel', PetCarousel);
