class PetFacets {
  constructor(root) {
    this.root = root;
    this.form = root.querySelector('.pet-facets__form');

    if (this.form) {
      this.form.addEventListener('change', (event) => {
        if (event.target.matches('input, select')) {
          this.onFormChange(event);
        }
      });

      this.form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.matches('input')) {
          event.preventDefault();
          this.onFormChange(event);
        }
      });
    }
  }

  getCurrentParams() {
    return new URLSearchParams(window.location.search);
  }

  serializeForm() {
    const params = this.getCurrentParams();

    for (const key of Array.from(params.keys())) {
      if (key.startsWith('filter.')) params.delete(key);
    }

    if (this.form) {
      const formData = new FormData(this.form);
      for (const [key, value] of formData.entries()) {
        if (String(value).trim() !== '') {
          if (key.startsWith('filter.')) {
            params.append(key, value);
          } else {
            params.set(key, value);
          }
        }
      }
    }

    params.delete('page');
    return params;
  }

  getBaseUrl() {
    if (this.form) return new URL(this.form.action, window.location.origin);
    return new URL(window.location.pathname, window.location.origin);
  }

  onFormChange(event) {
    this.navigate(this.serializeForm());
  }

  navigate(params) {
    const base = this.getBaseUrl();
    base.search = params.toString();
    window.location.href = base.toString();
  }
}

customElements.define('pet-facets', class extends HTMLElement {
  connectedCallback() {
    new PetFacets(this);
    this.classList.add('is-initialized');
  }
});