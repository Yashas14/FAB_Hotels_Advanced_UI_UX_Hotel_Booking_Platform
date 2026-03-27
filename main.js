/* ============================================================
   FAB HOTELS — Main Application JavaScript
   Modern ES6+ | No jQuery | Modular Architecture
   ============================================================ */

// ============================================
// DATA IMPORT (for non-module script usage)
// data.js must be loaded before this file
// ============================================

// We'll reference the data arrays from data.js via window scope
// since we're not using ES modules for static file compatibility

// ============================================
// UTILITY FUNCTIONS
// ============================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit = 100) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatPhone(value) {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;
  let formatted = '';
  if (match[1]) formatted += `+${match[1]} `;
  if (match[2] && match[3]) formatted += `(${match[2]}) ${match[3]}`;
  else if (match[2]) formatted += match[2];
  if (match[4]) formatted += `-${match[4]}`;
  return formatted;
}

// ============================================
// APP STATE
// ============================================
const AppState = {
  theme: localStorage.getItem('fab-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  currency: JSON.parse(localStorage.getItem('fab-currency')) || { code: 'USD', symbol: '$', rate: 1 },
  wishlist: JSON.parse(localStorage.getItem('fab-wishlist')) || [],
  guests: { adults: 2, children: 0, rooms: 1 },
  currentFilter: 'all',
  galleryFilter: 'all',
  reviewRating: 0,
  bookingStep: 1,
  mobileMenuOpen: false,
  searchOpen: false,
  drawerOpen: false,
  chatOpen: false,
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
class ToastSystem {
  constructor() {
    this.container = $('#toast-container');
  }

  show(type, title, message, duration = 4000) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-times-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i class="toast__icon ${icons[type]}"></i>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        <div class="toast__message">${message}</div>
      </div>
      <button class="toast__close" aria-label="Close"><i class="fas fa-times"></i></button>
      <div class="toast__progress" style="animation-duration: ${duration}ms"></div>
    `;

    this.container.appendChild(toast);

    toast.querySelector('.toast__close').addEventListener('click', () => this.dismiss(toast));

    setTimeout(() => this.dismiss(toast), duration);
  }

  dismiss(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('toast--removing');
    setTimeout(() => toast.remove(), 300);
  }
}

const toast = new ToastSystem();

// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
  constructor() {
    this.toggle = $('#theme-toggle');
    this.icon = $('#theme-icon');
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', AppState.theme);
    this.updateIcon();
    this.toggle.addEventListener('click', () => this.switch());

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('fab-theme')) {
        AppState.theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', AppState.theme);
        this.updateIcon();
      }
    });
  }

  switch() {
    AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('fab-theme', AppState.theme);
    this.updateIcon();
  }

  updateIcon() {
    this.icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// ============================================
// HEADER / NAVIGATION
// ============================================
class HeaderController {
  constructor() {
    this.header = $('#header');
    this.hamburger = $('#hamburger');
    this.mobileMenu = $('#mobile-menu');
    this.searchToggle = $('#search-toggle');
    this.headerSearch = $('#header-search');
    this.searchClose = $('#search-close');
    this.globalSearch = $('#global-search');
    this.searchSuggestions = $('#search-suggestions');
    this.profileBtn = $('#profile-btn');
    this.profileDrawer = $('#profile-drawer');
    this.drawerOverlay = $('#drawer-overlay');
    this.drawerClose = $('#drawer-close');
    this.currencySelector = $('#currency-selector');

    this.init();
  }

  init() {
    // Scroll behavior
    window.addEventListener('scroll', throttle(() => this.onScroll(), 50));

    // Hamburger
    this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

    // Mobile menu links
    $$('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Search
    this.searchToggle.addEventListener('click', () => this.toggleSearch());
    this.searchClose.addEventListener('click', () => this.closeSearch());
    this.globalSearch.addEventListener('input', debounce((e) => this.handleSearch(e.target.value), 200));

    // Profile drawer
    this.profileBtn.addEventListener('click', () => this.toggleDrawer());
    this.drawerClose.addEventListener('click', () => this.closeDrawer());
    this.drawerOverlay.addEventListener('click', () => this.closeDrawer());

    // Currency selector
    this.currencySelector.querySelector('.currency-selector__btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.currencySelector.classList.toggle('active');
    });

    $$('.currency-selector__option').forEach(opt => {
      opt.addEventListener('click', () => this.selectCurrency(opt));
    });

    document.addEventListener('click', () => {
      this.currencySelector.classList.remove('active');
    });

    // Active nav link on scroll
    window.addEventListener('scroll', throttle(() => this.updateActiveLink(), 100));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeSearch();
        this.closeDrawer();
      }
    });
  }

  onScroll() {
    const scrolled = window.scrollY > 50;
    this.header.classList.toggle('scrolled', scrolled);
  }

  toggleMobileMenu() {
    AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
    this.hamburger.classList.toggle('active');
    this.mobileMenu.classList.toggle('active');
    document.body.style.overflow = AppState.mobileMenuOpen ? 'hidden' : '';
    this.hamburger.setAttribute('aria-expanded', AppState.mobileMenuOpen);
  }

  closeMobileMenu() {
    AppState.mobileMenuOpen = false;
    this.hamburger.classList.remove('active');
    this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    this.hamburger.setAttribute('aria-expanded', 'false');
  }

  toggleSearch() {
    AppState.searchOpen = !AppState.searchOpen;
    this.headerSearch.classList.toggle('active');
    if (AppState.searchOpen) {
      this.globalSearch.focus();
    }
  }

  closeSearch() {
    AppState.searchOpen = false;
    this.headerSearch.classList.remove('active');
    this.searchSuggestions.classList.remove('active');
    this.globalSearch.value = '';
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.searchSuggestions.classList.remove('active');
      return;
    }

    const results = destinations.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.location.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length) {
      this.searchSuggestions.innerHTML = results.map(d => `
        <div class="search-suggestion__item" data-id="${d.id}">
          <i class="fas fa-map-marker-alt"></i>
          <span>${d.name}, ${d.country}</span>
        </div>
      `).join('');
      this.searchSuggestions.classList.add('active');

      $$('.search-suggestion__item', this.searchSuggestions).forEach(item => {
        item.addEventListener('click', () => {
          this.closeSearch();
          document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
        });
      });
    } else {
      this.searchSuggestions.classList.remove('active');
    }
  }

  toggleDrawer() {
    AppState.drawerOpen = !AppState.drawerOpen;
    this.profileDrawer.classList.toggle('active');
    this.drawerOverlay.classList.toggle('active');
    document.body.style.overflow = AppState.drawerOpen ? 'hidden' : '';
  }

  closeDrawer() {
    AppState.drawerOpen = false;
    this.profileDrawer.classList.remove('active');
    this.drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  selectCurrency(opt) {
    $$('.currency-selector__option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');

    AppState.currency = {
      code: opt.dataset.code,
      symbol: opt.dataset.symbol,
      rate: parseFloat(opt.dataset.rate),
    };

    localStorage.setItem('fab-currency', JSON.stringify(AppState.currency));

    $('.currency-selector__symbol').textContent = AppState.currency.symbol;
    $('.currency-selector__code').textContent = AppState.currency.code;

    this.currencySelector.classList.remove('active');

    // Re-render prices
    if (window.destinationsController) {
      window.destinationsController.render();
    }

    toast.show('info', 'Currency Updated', `Prices now displayed in ${AppState.currency.code}`);
  }

  updateActiveLink() {
    const sections = $$('section[id]');
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        $$('.header__nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = $(`.header__nav-link[data-section="${id}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Mobile bottom nav
        $$('.mobile-bottom-nav__item').forEach(item => item.classList.remove('active'));
        const activeBottom = $(`.mobile-bottom-nav__item[data-section="${id}"]`);
        if (activeBottom) activeBottom.classList.add('active');
      }
    });
  }
}

// ============================================
// HERO SECTION
// ============================================
class HeroController {
  constructor() {
    this.slides = $$('.hero__slide');
    this.currentSlide = 0;
    this.heroDestination = $('#hero-destination');
    this.heroSuggestions = $('#hero-suggestions');
    this.heroDates = $('#hero-dates');

    this.init();
  }

  init() {
    // Auto-slide hero images
    setInterval(() => this.nextSlide(), 5000);

    // Hero search autocomplete
    if (this.heroDestination) {
      this.heroDestination.addEventListener('input', debounce((e) => {
        this.showSuggestions(e.target.value, this.heroSuggestions);
      }, 200));

      this.heroDestination.addEventListener('focus', () => {
        if (this.heroDestination.value) {
          this.showSuggestions(this.heroDestination.value, this.heroSuggestions);
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero__search-field')) {
          this.heroSuggestions.classList.remove('active');
        }
      });
    }

    // Initialize Flatpickr for hero dates
    if (this.heroDates && typeof flatpickr !== 'undefined') {
      flatpickr(this.heroDates, {
        mode: 'range',
        minDate: 'today',
        dateFormat: 'M d, Y',
        theme: 'dark',
        disableMobile: true,
      });
    }

    // Hero search button
    const searchBtn = $('#hero-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Hero guests button — scroll to booking section's guest controls
    const heroGuestsBtn = $('#hero-guests-btn');
    if (heroGuestsBtn) {
      heroGuestsBtn.addEventListener('click', () => {
        document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
        // Open guests dropdown after scrolling
        setTimeout(() => {
          const trigger = $('#guests-trigger');
          const dropdown = $('#guests-dropdown');
          if (trigger && dropdown) {
            dropdown.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          }
        }, 600);
      });
    }
  }

  nextSlide() {
    this.slides[this.currentSlide].classList.remove('hero__slide--active');
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.slides[this.currentSlide].classList.add('hero__slide--active');
  }

  showSuggestions(query, container) {
    if (!query.trim()) {
      container.classList.remove('active');
      return;
    }

    const results = destinations.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length) {
      container.innerHTML = results.map(d => `
        <div class="search-suggestion__item" data-name="${d.name}">
          <i class="fas fa-map-marker-alt"></i>
          <span>${d.name}, ${d.country}</span>
        </div>
      `).join('');
      container.classList.add('active');

      $$('.search-suggestion__item', container).forEach(item => {
        item.addEventListener('click', () => {
          this.heroDestination.value = item.dataset.name;
          container.classList.remove('active');
        });
      });
    } else {
      container.classList.remove('active');
    }
  }
}

// ============================================
// ANIMATED COUNTERS
// ============================================
class CounterAnimator {
  constructor() {
    this.counters = $$('.hero__stat-value');
    this.animated = false;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateAll();
        }
      });
    }, { threshold: 0.5 });

    const statsBar = $('#hero-stats');
    if (statsBar) observer.observe(statsBar);
  }

  animateAll() {
    this.counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const decimals = parseInt(counter.dataset.decimals) || 0;
      this.animate(counter, target, suffix, decimals);
    });
  }

  animate(el, target, suffix, decimals) {
    const duration = 2000;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;

      el.textContent = decimals > 0
        ? current.toFixed(decimals) + suffix
        : Math.floor(current) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}

// ============================================
// BOOKING SECTION
// ============================================
class BookingController {
  constructor() {
    this.form = $('#booking-form');
    this.bookDates = $('#book-dates');
    this.bookDestination = $('#book-destination');
    this.bookSuggestions = $('#book-suggestions');
    this.guestsTrigger = $('#guests-trigger');
    this.guestsDropdown = $('#guests-dropdown');
    this.guestsDone = $('#guests-done');
    this.priceMin = $('#price-min');
    this.priceMax = $('#price-max');
    this.priceRangeDisplay = $('#price-range-display');
    this.priceRangeFill = $('#price-range-fill');

    this.init();
  }

  init() {
    // Tabs
    $$('.booking-card__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.booking-card__tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      });
    });

    // Flatpickr for booking dates
    if (this.bookDates && typeof flatpickr !== 'undefined') {
      flatpickr(this.bookDates, {
        mode: 'range',
        minDate: 'today',
        dateFormat: 'M d, Y',
        theme: 'dark',
        disableMobile: true,
      });
    }

    // Destination autocomplete
    if (this.bookDestination) {
      this.bookDestination.addEventListener('input', debounce((e) => {
        this.showBookingSuggestions(e.target.value);
      }, 200));

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.booking-card__field')) {
          this.bookSuggestions.classList.remove('active');
        }
      });
    }

    // Guests dropdown
    if (this.guestsTrigger) {
      this.guestsTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.guestsDropdown.classList.toggle('active');
        this.guestsTrigger.setAttribute('aria-expanded',
          this.guestsDropdown.classList.contains('active'));
      });

      $$('.guests-dropdown__btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.updateGuests(btn.dataset.type, btn.dataset.action);
        });
      });

      if (this.guestsDone) {
        this.guestsDone.addEventListener('click', () => {
          this.guestsDropdown.classList.remove('active');
          this.guestsTrigger.setAttribute('aria-expanded', 'false');
        });
      }

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.guests-dropdown') && !e.target.closest('#guests-trigger')) {
          this.guestsDropdown.classList.remove('active');
        }
      });
    }

    // Price range slider
    if (this.priceMin && this.priceMax) {
      this.priceMin.addEventListener('input', () => this.updatePriceRange());
      this.priceMax.addEventListener('input', () => this.updatePriceRange());
      this.updatePriceRange();
    }

    // Form submission — opens booking flow modal
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        toast.show('success', 'Searching...', 'Finding the best deals for you!');
        if (window.bookingFlow) window.bookingFlow.open();
      });
    }
  }

  showBookingSuggestions(query) {
    if (!query.trim()) {
      this.bookSuggestions.classList.remove('active');
      return;
    }

    const results = destinations.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase())
    );

    if (results.length) {
      this.bookSuggestions.innerHTML = results.map(d => `
        <div class="search-suggestion__item" data-name="${d.name}">
          <i class="fas fa-map-marker-alt"></i>
          <span>${d.name}, ${d.country}</span>
        </div>
      `).join('');
      this.bookSuggestions.classList.add('active');

      $$('.search-suggestion__item', this.bookSuggestions).forEach(item => {
        item.addEventListener('click', () => {
          this.bookDestination.value = item.dataset.name;
          this.bookSuggestions.classList.remove('active');
        });
      });
    } else {
      this.bookSuggestions.classList.remove('active');
    }
  }

  updateGuests(type, action) {
    const limits = { adults: [1, 10], children: [0, 6], rooms: [1, 5] };
    const [min, max] = limits[type];

    if (action === 'increase' && AppState.guests[type] < max) {
      AppState.guests[type]++;
    } else if (action === 'decrease' && AppState.guests[type] > min) {
      AppState.guests[type]--;
    }

    $(`#${type}-count`).textContent = AppState.guests[type];
    const display = `${AppState.guests.adults} Adults · ${AppState.guests.children} Children · ${AppState.guests.rooms} Room${AppState.guests.rooms > 1 ? 's' : ''}`;
    $('#guests-display').textContent = display;
    const heroText = $('#hero-guests-text');
    if (heroText) {
      heroText.textContent = `${AppState.guests.adults} Adults · ${AppState.guests.children} Children`;
    }
  }

  updatePriceRange() {
    let min = parseInt(this.priceMin.value);
    let max = parseInt(this.priceMax.value);

    if (min > max) {
      [min, max] = [max, min];
    }

    const totalRange = 1000 - 50;
    const leftPct = ((min - 50) / totalRange) * 100;
    const rightPct = ((max - 50) / totalRange) * 100;

    if (this.priceRangeFill) {
      this.priceRangeFill.style.left = leftPct + '%';
      this.priceRangeFill.style.width = (rightPct - leftPct) + '%';
    }

    const sym = AppState.currency.symbol;
    if (this.priceRangeDisplay) {
      this.priceRangeDisplay.textContent = `${sym}${Math.round(min * AppState.currency.rate)} — ${sym}${Math.round(max * AppState.currency.rate)}${max >= 1000 ? '+' : ''}`;
    }
  }
}

// ============================================
// DESTINATIONS SECTION
// ============================================
class DestinationsController {
  constructor() {
    this.grid = $('#destinations-grid');
    this.init();
  }

  init() {
    this.render();

    // Filter tabs
    $$('.filter-tabs__btn[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-tabs__btn[data-filter]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        AppState.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Mega menu filter links
    $$('.mega-menu__item[data-filter]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        AppState.currentFilter = item.dataset.filter;
        $$('.filter-tabs__btn[data-filter]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        const matchingTab = $(`.filter-tabs__btn[data-filter="${item.dataset.filter}"]`);
        if (matchingTab) {
          matchingTab.classList.add('active');
          matchingTab.setAttribute('aria-selected', 'true');
        }
        document.getElementById('packages').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => this.render(), 300);
      });
    });
  }

  render() {
    const filtered = AppState.currentFilter === 'all'
      ? destinations
      : destinations.filter(d => d.region === AppState.currentFilter);

    this.grid.innerHTML = filtered.map(d => this.createCard(d)).join('');

    // Init Vanilla Tilt
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init($$('.destination-card'), {
        max: 5,
        speed: 400,
        glare: true,
        'max-glare': 0.1,
      });
    }

    // Event listeners
    $$('.destination-card__wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleWishlist(parseInt(btn.dataset.id), btn);
      });
    });

    $$('.destination-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        this.openQuickView(id);
      });
    });

    // Trigger GSAP animations for cards
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.destination-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }

  createCard(d) {
    const sym = AppState.currency.symbol;
    const rate = AppState.currency.rate;
    const price = Math.round(d.price * rate);
    const origPrice = Math.round(d.originalPrice * rate);
    const savings = Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100);
    const isWishlisted = AppState.wishlist.includes(d.id);

    return `
      <div class="destination-card" data-id="${d.id}" data-region="${d.region}">
        <div class="destination-card__image">
          <img src="${d.image}" alt="${d.name}" loading="lazy">
          ${d.tagLabel ? `<span class="destination-card__tag destination-card__tag--${d.tag}">${d.tagLabel}</span>` : ''}
          <button class="destination-card__wishlist ${isWishlisted ? 'active' : ''}" data-id="${d.id}" aria-label="Add to wishlist">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
          </button>
          ${d.roomsLeft <= 5 ? `<span class="destination-card__urgency">Only ${d.roomsLeft} left!</span>` : ''}
        </div>
        <div class="destination-card__body">
          <div class="destination-card__header">
            <h3 class="destination-card__name">
              <i class="fas fa-map-marker-alt"></i> ${d.name}
            </h3>
            <div class="destination-card__rating">
              <i class="fas fa-star"></i> ${d.rating}
              <span>(${d.reviewCount.toLocaleString()})</span>
            </div>
          </div>
          <p class="destination-card__desc">${d.shortDesc}</p>
          <div class="destination-card__footer">
            <div class="destination-card__price">
              <span class="destination-card__price-current">${sym}${price}</span>
              <span class="destination-card__price-original">${sym}${origPrice}</span>
              <span class="destination-card__price-save">-${savings}%</span>
            </div>
            <button class="btn btn--accent btn--small destination-card__cta">Book Now</button>
          </div>
        </div>
      </div>
    `;
  }

  toggleWishlist(id, btn) {
    const idx = AppState.wishlist.indexOf(id);
    if (idx > -1) {
      AppState.wishlist.splice(idx, 1);
      btn.classList.remove('active');
      btn.querySelector('i').className = 'far fa-heart';
      toast.show('info', 'Removed', 'Destination removed from wishlist');
    } else {
      AppState.wishlist.push(id);
      btn.classList.add('active');
      btn.querySelector('i').className = 'fas fa-heart';
      toast.show('success', 'Saved!', 'Added to your wishlist');
    }
    localStorage.setItem('fab-wishlist', JSON.stringify(AppState.wishlist));
  }

  openQuickView(id) {
    const d = destinations.find(dest => dest.id === id);
    if (!d) return;

    const sym = AppState.currency.symbol;
    const rate = AppState.currency.rate;
    const price = Math.round(d.price * rate);
    const origPrice = Math.round(d.originalPrice * rate);

    const modalContent = $('#modal-content');
    modalContent.innerHTML = `
      <div class="modal-gallery">
        <img src="${d.image}" alt="${d.name}" loading="lazy">
        <div class="modal-gallery__side">
          ${d.gallery.slice(0, 2).map(img => `<img src="${img}" alt="${d.name}" loading="lazy">`).join('')}
        </div>
      </div>
      <div class="modal-info">
        <div class="modal-info__header">
          <h2>${d.name}, ${d.country}</h2>
          <div class="destination-card__rating">
            <i class="fas fa-star"></i> ${d.rating}
            <span>(${d.reviewCount.toLocaleString()} reviews)</span>
          </div>
        </div>
        <p class="modal-info__desc">${d.description}</p>
        <div class="modal-info__amenities">
          ${d.amenities.map(a => `<span class="modal-info__amenity"><i class="fas fa-check"></i> ${a}</span>`).join('')}
        </div>
        <div class="modal-info__policy">
          <p><i class="fas fa-check-circle"></i> ${d.cancellation}</p>
        </div>
        <div class="modal-info__price">
          <div class="destination-card__price">
            <span class="destination-card__price-current">${sym}${price}</span>
            <span class="destination-card__price-original">${sym}${origPrice}</span>
            <small style="color: var(--text-muted); margin-left: 8px;">per night · ${d.duration}</small>
          </div>
          <button class="btn btn--primary" onclick="document.getElementById('book').scrollIntoView({behavior:'smooth'}); document.getElementById('modal-overlay').classList.remove('active'); document.getElementById('quick-view-modal').classList.remove('active');">
            <i class="fas fa-calendar-check"></i> Reserve Now
          </button>
        </div>
      </div>
    `;

    $('#modal-overlay').classList.add('active');
    $('#quick-view-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// ============================================
// SERVICES SECTION
// ============================================
class ServicesController {
  constructor() {
    this.grid = $('#services-grid');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.grid.innerHTML = services.map(s => `
      <div class="service-card fade-in">
        <div class="service-card__inner">
          <div class="service-card__front">
            <div class="service-card__icon">
              <i class="fas fa-${s.icon}"></i>
            </div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
          </div>
          <div class="service-card__back">
            <h4>${s.title}</h4>
            <p>${s.detail}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// ============================================
// GALLERY SECTION
// ============================================
class GalleryController {
  constructor() {
    this.grid = $('#gallery-grid');
    this.lightbox = null;
    this.init();
  }

  init() {
    this.render();

    // Gallery filters
    $$('.filter-tabs__btn[data-gallery-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-tabs__btn[data-gallery-filter]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        AppState.galleryFilter = btn.dataset.galleryFilter;
        this.render();
      });
    });
  }

  render() {
    const filtered = AppState.galleryFilter === 'all'
      ? galleryItems
      : galleryItems.filter(item => item.category === AppState.galleryFilter);

    this.grid.innerHTML = filtered.map(item => `
      <a href="${item.image}" class="gallery-item glightbox ${item.span === 'wide' ? 'gallery-item--wide' : ''} ${item.span === 'tall' ? 'gallery-item--tall' : ''}"
         data-gallery="gallery" data-glightbox="title: ${item.title};" data-category="${item.category}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="gallery-item__overlay">
          <h4>${item.title}</h4>
          <div class="gallery-item__zoom"><i class="fas fa-search-plus"></i></div>
        </div>
      </a>
    `).join('');

    // Init GLightbox
    if (typeof GLightbox !== 'undefined') {
      if (this.lightbox) this.lightbox.destroy();
      this.lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
      });
    }

    // Animate gallery items
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.gallery-item',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }
}

// ============================================
// REVIEWS SECTION
// ============================================
class ReviewsController {
  constructor() {
    this.wrapper = $('#reviews-wrapper');
    this.breakdownEl = $('#reviews-breakdown');
    this.distributionEl = $('#reviews-distribution');
    this.swiper = null;
    this.init();
  }

  init() {
    this.renderBreakdown();
    this.renderDistribution();
    this.renderReviews();
    this.initSwiper();
    this.initReviewPanel();
  }

  renderBreakdown() {
    this.breakdownEl.innerHTML = ratingBreakdown.categories.map(cat => `
      <div class="breakdown-item">
        <span class="breakdown-item__label">${cat.name}</span>
        <div class="breakdown-item__bar">
          <div class="breakdown-item__fill" style="width: ${(cat.score / 5) * 100}%"></div>
        </div>
        <span class="breakdown-item__score">${cat.score}</span>
      </div>
    `).join('');
  }

  renderDistribution() {
    this.distributionEl.innerHTML = ratingBreakdown.distribution.map(d => `
      <div class="distribution-item">
        <span class="distribution-item__stars">${d.stars}★</span>
        <div class="distribution-item__bar">
          <div class="distribution-item__fill" style="width: ${d.percentage}%"></div>
        </div>
        <span class="distribution-item__pct">${d.percentage}%</span>
      </div>
    `).join('');
  }

  renderReviews() {
    this.wrapper.innerHTML = reviews.map(r => {
      const sourceIcons = {
        google: 'fab fa-google',
        tripadvisor: 'fab fa-tripadvisor',
        booking: 'fas fa-bed',
      };

      return `
        <div class="swiper-slide">
          <div class="review-card">
            <div class="review-card__header">
              <img class="review-card__avatar" src="${r.avatar}" alt="${r.name}" loading="lazy">
              <div class="review-card__info">
                <h4>${r.name} ${r.verified ? '<i class="fas fa-check-circle review-card__verified" title="Verified"></i>' : ''}</h4>
                <span class="review-card__location">${r.location} · ${r.stayType}</span>
              </div>
            </div>
            <div class="review-card__stars">
              ${'<i class="fas fa-star"></i>'.repeat(r.rating)}${'<i class="far fa-star"></i>'.repeat(5 - r.rating)}
            </div>
            <h4 class="review-card__title">${r.title}</h4>
            <p class="review-card__text">${r.text}</p>
            <div class="review-card__footer">
              <span class="review-card__source">
                <i class="${sourceIcons[r.source]}"></i> via ${r.source.charAt(0).toUpperCase() + r.source.slice(1)}
              </span>
              <span class="review-card__date">${formatDate(r.date)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  initSwiper() {
    if (typeof Swiper !== 'undefined') {
      this.swiper = new Swiper('#reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }
  }

  initReviewPanel() {
    const writeBtn = $('#write-review-btn');
    const panel = $('#review-panel');
    const closeBtn = $('#review-panel-close');
    const form = $('#review-form');

    if (writeBtn) {
      writeBtn.addEventListener('click', () => panel.classList.add('active'));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => panel.classList.remove('active'));
    }

    // Star rating
    $$('.star-rating__star').forEach(star => {
      star.addEventListener('click', () => {
        AppState.reviewRating = parseInt(star.dataset.rating);
        $$('.star-rating__star').forEach(s => {
          const rating = parseInt(s.dataset.rating);
          s.classList.toggle('active', rating <= AppState.reviewRating);
          s.querySelector('i').className = rating <= AppState.reviewRating ? 'fas fa-star' : 'far fa-star';
        });
      });
    });

    // Form submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('#review-name').value;
        if (!name || !AppState.reviewRating) {
          toast.show('warning', 'Missing Info', 'Please provide your name and rating');
          return;
        }
        toast.show('success', 'Thank You!', 'Your review has been submitted successfully');
        panel.classList.remove('active');
        form.reset();
        AppState.reviewRating = 0;
        $$('.star-rating__star').forEach(s => {
          s.classList.remove('active');
          s.querySelector('i').className = 'far fa-star';
        });
      });
    }
  }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactController {
  constructor() {
    this.form = $('#contact-form');
    this.phoneInput = $('#contact-phone');
    this.init();
  }

  init() {
    // Phone formatter
    if (this.phoneInput) {
      this.phoneInput.addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
      });
    }

    // Form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate()) {
          toast.show('success', 'Message Sent!', 'We\'ll get back to you within 24 hours.');
          this.form.reset();
        }
      });
    }

    // Login form
    const loginForm = $('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#login-email').value;
        const pass = $('#login-password').value;

        if (!email || !this.isValidEmail(email)) {
          this.showError('login-email-error', 'Please enter a valid email');
          return;
        }
        if (!pass || pass.length < 6) {
          this.showError('login-password-error', 'Password must be at least 6 characters');
          return;
        }

        toast.show('success', 'Welcome Back!', 'You have been signed in successfully');
        $('#profile-drawer').classList.remove('active');
        $('#drawer-overlay').classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Newsletter form
    const newsletterForm = $('#newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('#newsletter-email').value;
        if (!email || !this.isValidEmail(email)) {
          toast.show('error', 'Invalid Email', 'Please enter a valid email address');
          return;
        }
        toast.show('success', 'Subscribed!', 'You\'ll receive our best travel deals');
        newsletterForm.reset();
      });
    }
  }

  validate() {
    let valid = true;
    const fields = [
      { id: 'contact-name', error: 'contact-name-error', msg: 'Please enter your name', check: (v) => v.trim().length > 0 },
      { id: 'contact-email', error: 'contact-email-error', msg: 'Please enter a valid email', check: (v) => this.isValidEmail(v) },
      { id: 'contact-subject', error: 'contact-subject-error', msg: 'Please select a subject', check: (v) => v.length > 0 },
      { id: 'contact-message', error: 'contact-message-error', msg: 'Please enter your message', check: (v) => v.trim().length > 10 },
    ];

    fields.forEach(f => {
      const el = $(`#${f.id}`);
      const value = el ? el.value : '';
      if (!f.check(value)) {
        this.showError(f.error, f.msg);
        valid = false;
      } else {
        this.clearError(f.error);
      }
    });

    return valid;
  }

  showError(id, msg) {
    const el = $(`#${id}`);
    if (el) el.textContent = msg;
  }

  clearError(id) {
    const el = $(`#${id}`);
    if (el) el.textContent = '';
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ============================================
// CHAT WIDGET
// ============================================
class ChatWidget {
  constructor() {
    this.trigger = $('#chat-trigger');
    this.panel = $('#chat-panel');
    this.closeBtn = $('#chat-close');
    this.input = $('#chat-input');
    this.sendBtn = $('#chat-send');
    this.messages = $('#chat-messages');
    this.badge = $('.chat-widget__badge');

    this.responses = [
      "Thank you for your interest! Our team will assist you shortly. 😊",
      "Great question! I'd recommend our Maldives package — it's our most popular choice this season.",
      "You can view all available destinations in our Packages section. Would you like me to help you find something specific?",
      "Our cancellation policy allows free cancellation up to 48 hours before check-in for most properties.",
      "I'll connect you with a specialist who can help with your booking. In the meantime, feel free to explore our destinations!",
    ];

    this.init();
  }

  init() {
    if (this.trigger) {
      this.trigger.addEventListener('click', () => this.toggle());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.send());
    }
    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.send();
      });
    }
  }

  toggle() {
    AppState.chatOpen = !AppState.chatOpen;
    this.panel.classList.toggle('active');
    if (AppState.chatOpen && this.badge) {
      this.badge.style.display = 'none';
    }
  }

  close() {
    AppState.chatOpen = false;
    this.panel.classList.remove('active');
  }

  send() {
    const text = this.input.value.trim();
    if (!text) return;

    this.addMessage(text, 'user');
    this.input.value = '';

    // Simulate bot response
    setTimeout(() => {
      const response = this.responses[Math.floor(Math.random() * this.responses.length)];
      this.addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  addMessage(text, type) {
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const msg = document.createElement('div');
    msg.className = `chat-message chat-message--${type}`;
    msg.innerHTML = `<p>${text}</p><span class="chat-message__time">${now}</span>`;
    this.messages.appendChild(msg);
    this.messages.scrollTop = this.messages.scrollHeight;
  }
}

// ============================================
// MODAL CONTROLLER
// ============================================
class ModalController {
  constructor() {
    this.overlay = $('#modal-overlay');
    this.modal = $('#quick-view-modal');
    this.closeBtn = $('#modal-close');
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
  }

  close() {
    this.overlay.classList.remove('active');
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================
// BACK TO TOP
// ============================================
class BackToTop {
  constructor() {
    this.btn = $('#back-to-top');
    this.progressCircle = $('#progress-circle');
    this.init();
  }

  init() {
    if (!this.btn) return;

    window.addEventListener('scroll', throttle(() => this.update(), 50));
    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    this.btn.classList.toggle('visible', scrollTop > 400);

    // Update progress circle
    if (this.progressCircle) {
      const circumference = 2 * Math.PI * 20; // r=20
      const offset = circumference - (scrollPercent * circumference);
      this.progressCircle.style.strokeDashoffset = offset;
    }
  }
}

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
  constructor() {
    this.dot = $('#cursor-dot');
    this.ring = $('#cursor-ring');
    if (!this.dot || window.innerWidth < 1024) return;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.dot.style.left = e.clientX + 'px';
      this.dot.style.top = e.clientY + 'px';

      // Ring follows with slight delay via CSS transition
      this.ring.style.left = e.clientX + 'px';
      this.ring.style.top = e.clientY + 'px';
    });

    // Scale up on interactive elements
    const interactives = 'a, button, input, select, textarea, .destination-card, .gallery-item, .service-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        this.dot.classList.add('active');
        this.ring.classList.add('active');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        this.dot.classList.remove('active');
        this.ring.classList.remove('active');
      }
    });
  }
}

// ============================================
// GSAP ANIMATIONS
// ============================================
class AnimationController {
  constructor() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    this.heroAnimations();
    this.scrollAnimations();
    this.sectionReveals();
  }

  heroAnimations() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero__tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.hero__title-line', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.4')
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('.hero__search', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .to('.hero__stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
      .to('.hero__scroll-indicator', { opacity: 0.7, duration: 0.5 }, '-=0.1');
  }

  scrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Filter tabs
    gsap.utils.toArray('.filter-tabs').forEach(tabs => {
      gsap.fromTo(tabs,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tabs,
            start: 'top 90%',
          }
        }
      );
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          }
        }
      );
    });

    // Reviews summary
    gsap.fromTo('.reviews-summary',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.reviews-summary',
          start: 'top 85%',
        }
      }
    );

    // Contact grid
    gsap.fromTo('.contact-info',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
        }
      }
    );

    gsap.fromTo('.contact-form',
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
        }
      }
    );

    // Footer columns stagger
    gsap.fromTo('.footer__col',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.footer__grid',
          start: 'top 90%',
        }
      }
    );
  }

  sectionReveals() {
    // Intersection Observer for fade-in elements
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    $$('.fade-in').forEach(el => observer.observe(el));
  }
}

// ============================================
// SMOOTH SCROLL (Lenis)
// ============================================
class SmoothScroll {
  constructor() {
    if (typeof Lenis === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    this.init();
  }

  init() {
    // Connect Lenis with GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      // Fallback: standalone rAF loop
      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }
}

// ============================================
// BOOKING FLOW MODAL
// ============================================
class BookingFlow {
  constructor() {
    this.modal = $('#booking-flow');
    this.closeBtn = $('#booking-flow-close');
    this.overlay = this.modal ? this.modal.querySelector('.booking-flow__overlay') : null;
    this.body = $('#booking-flow-body');
    this.steps = this.modal ? $$('.booking-flow__step', this.modal) : [];
    this.currentStep = 1;
    if (!this.modal) return;
    this.init();
  }

  init() {
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) this.close();
    });
  }

  open() {
    this.currentStep = 1;
    this.updateSteps();
    this.renderStep();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateSteps() {
    this.steps.forEach((step, i) => {
      step.classList.toggle('active', i + 1 <= this.currentStep);
      step.classList.toggle('completed', i + 1 < this.currentStep);
    });
  }

  renderStep() {
    const dest = $('#book-destination') ? $('#book-destination').value || 'your destination' : 'your destination';
    const dates = $('#book-dates') ? $('#book-dates').value || 'flexible dates' : 'flexible dates';
    const guests = $('#guests-display') ? $('#guests-display').textContent : '2 Adults · 0 Children · 1 Room';

    const templates = {
      1: `<div class="booking-flow__step-content">
            <h3>Search Results</h3>
            <p>Showing results for <strong>${dest}</strong> on <strong>${dates}</strong> with <strong>${guests}</strong></p>
            <div style="margin-top:var(--space-6);display:grid;gap:var(--space-4);">
              ${destinations.slice(0, 3).map(d => `
                <div class="glass-card" style="padding:var(--space-4);display:flex;gap:var(--space-4);align-items:center;cursor:pointer;">
                  <img src="${d.image}" alt="${d.name}" style="width:80px;height:60px;object-fit:cover;border-radius:var(--radius-md);">
                  <div><strong>${d.name}</strong><br><small>${d.location} — $${d.price}/night ★ ${d.rating}</small></div>
                </div>
              `).join('')}
            </div>
            <button class="btn btn--primary" style="margin-top:var(--space-6);" onclick="window.bookingFlow.nextStep()">Select & Continue</button>
          </div>`,
      2: `<div class="booking-flow__step-content">
            <h3>Select Your Room</h3>
            <div style="margin-top:var(--space-4);display:grid;gap:var(--space-4);">
              <label class="glass-card" style="padding:var(--space-4);display:flex;gap:var(--space-4);align-items:center;cursor:pointer;">
                <input type="radio" name="room" value="deluxe" checked> <div><strong>Deluxe Room</strong><br><small>King bed, city view — $250/night</small></div>
              </label>
              <label class="glass-card" style="padding:var(--space-4);display:flex;gap:var(--space-4);align-items:center;cursor:pointer;">
                <input type="radio" name="room" value="suite"> <div><strong>Executive Suite</strong><br><small>Living area, panoramic view — $420/night</small></div>
              </label>
              <label class="glass-card" style="padding:var(--space-4);display:flex;gap:var(--space-4);align-items:center;cursor:pointer;">
                <input type="radio" name="room" value="villa"> <div><strong>Private Villa</strong><br><small>Private pool, butler service — $680/night</small></div>
              </label>
            </div>
            <button class="btn btn--primary" style="margin-top:var(--space-6);" onclick="window.bookingFlow.nextStep()">Continue</button>
          </div>`,
      3: `<div class="booking-flow__step-content">
            <h3>Guest Details</h3>
            <form style="margin-top:var(--space-4);display:grid;gap:var(--space-4);">
              <div class="form-group"><label>Full Name</label><input type="text" placeholder="John Doe" class="form-input"></div>
              <div class="form-group"><label>Email</label><input type="email" placeholder="john@example.com" class="form-input"></div>
              <div class="form-group"><label>Phone</label><input type="tel" placeholder="+1 (555) 000-0000" class="form-input"></div>
              <div class="form-group"><label>Special Requests</label><textarea rows="3" placeholder="Any special requirements..." class="form-input"></textarea></div>
            </form>
            <button class="btn btn--primary" style="margin-top:var(--space-6);" onclick="window.bookingFlow.nextStep()">Confirm Booking</button>
          </div>`,
      4: `<div class="booking-flow__step-content" style="text-align:center;">
            <div style="font-size:4rem;margin-bottom:var(--space-4);">🎉</div>
            <h3>Booking Confirmed!</h3>
            <p style="margin-top:var(--space-2);color:var(--text-secondary);">Your reservation has been confirmed. A confirmation email will be sent shortly.</p>
            <p style="margin-top:var(--space-4);"><strong>Confirmation #:</strong> FAB-${Date.now().toString(36).toUpperCase()}</p>
            <button class="btn btn--primary" style="margin-top:var(--space-6);" onclick="window.bookingFlow.close()">Done</button>
          </div>`
    };

    if (this.body) this.body.innerHTML = templates[this.currentStep] || '';
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
      this.updateSteps();
      this.renderStep();
      if (this.currentStep === 4) {
        toast.show('success', 'Booking Confirmed!', 'Your reservation is ready.');
      }
    }
  }
}

// ============================================
// APP INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Set footer year
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize all modules
  new ThemeManager();
  new HeaderController();
  new HeroController();
  new CounterAnimator();
  new BookingController();

  window.destinationsController = new DestinationsController();
  new ServicesController();
  new GalleryController();
  new ReviewsController();
  new ContactController();
  new ChatWidget();
  new ModalController();
  window.bookingFlow = new BookingFlow();
  new BackToTop();
  new CustomCursor();
  new AnimationController();
  new SmoothScroll();

  // Restore currency display
  if (AppState.currency.code !== 'USD') {
    $('.currency-selector__symbol').textContent = AppState.currency.symbol;
    $('.currency-selector__code').textContent = AppState.currency.code;
  }
});
