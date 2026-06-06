/**
 * ============================================================
 *  HameemBhai er Dokan — Catalog Page JS
 *  Filtering, searching, sorting, active filter chips
 * ============================================================
 */
(function () {
  'use strict';

  // ── State ──
  var filters = {
    search: '',
    categories: [],
    priceMin: 0,
    priceMax: 15000,
    minRating: 0,
    sort: 'default'
  };

  document.addEventListener('DOMContentLoaded', function () {
    HBD.components.renderHeader('services');
    HBD.components.renderFooter();

    renderCategoryCheckboxes();
    readURLParams();
    bindFilterEvents();
    applyFilters();

    HBD.store.EventBus.on('data:changed', function () {
      renderCategoryCheckboxes();
      applyFilters();
    });

    HBD.components.initScrollAnimations();
    HBD.components.initCursorTrail();
    HBD.store.EventBus.emit('content:loaded');
  });


  // ════════════════════════════════════════════════════════════
  //  READ URL PARAMS
  // ════════════════════════════════════════════════════════════
  function readURLParams() {
    var catParam = HBD.utils.getQueryParam('category');
    var searchParam = HBD.utils.getQueryParam('q');

    if (catParam) {
      filters.categories = [catParam];
      // Check the corresponding checkbox
      var cb = document.querySelector('#filter-categories input[value="' + catParam + '"]');
      if (cb) cb.checked = true;
      // Update breadcrumb
      var cat = HBD.data.getCategoryById(catParam);
      if (cat) {
        var breadcrumb = document.getElementById('catalog-breadcrumb');
        if (breadcrumb) {
          breadcrumb.innerHTML =
            '<a href="index.html" class="breadcrumb__link">Home</a>' +
            '<span class="breadcrumb__sep">›</span>' +
            '<a href="services.html" class="breadcrumb__link">All Services</a>' +
            '<span class="breadcrumb__sep">›</span>' +
            '<span class="breadcrumb__current">' + HBD.utils.sanitize(cat.name) + '</span>';
        }
      }
    }

    if (searchParam) {
      filters.search = searchParam;
      var searchInput = document.getElementById('catalog-search');
      if (searchInput) searchInput.value = searchParam;
    }
  }


  // ════════════════════════════════════════════════════════════
  //  RENDER CATEGORY CHECKBOXES
  // ════════════════════════════════════════════════════════════
  function renderCategoryCheckboxes() {
    var container = document.getElementById('filter-categories');
    if (!container) return;

    var html = '';
    HBD.data.categories.forEach(function (cat) {
      html +=
        '<label class="filter-checkbox">' +
          '<input type="checkbox" name="category" value="' + cat.id + '"> ' +
          '<span class="filter-checkbox__icon">' + cat.icon + '</span> ' +
          cat.name +
        '</label>';
    });

    container.innerHTML = html;
  }


  // ════════════════════════════════════════════════════════════
  //  BIND FILTER EVENTS
  // ════════════════════════════════════════════════════════════
  function bindFilterEvents() {
    // Search
    var searchInput = document.getElementById('catalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', HBD.utils.debounce(function () {
        filters.search = searchInput.value.trim().toLowerCase();
        applyFilters();
      }, 300));
    }

    // Category checkboxes
    var catContainer = document.getElementById('filter-categories');
    if (catContainer) {
      catContainer.addEventListener('change', function () {
        var checked = catContainer.querySelectorAll('input[name="category"]:checked');
        filters.categories = [];
        checked.forEach(function (cb) { filters.categories.push(cb.value); });
        applyFilters();
      });
    }

    // Price range
    var priceMin = document.getElementById('filter-price-min');
    var priceMax = document.getElementById('filter-price-max');
    if (priceMin && priceMax) {
      priceMin.addEventListener('input', function () {
        filters.priceMin = parseInt(priceMin.value, 10);
        if (filters.priceMin > filters.priceMax) {
          filters.priceMin = filters.priceMax;
          priceMin.value = filters.priceMin;
        }
        document.getElementById('price-min-label').textContent = HBD.utils.formatBDT(filters.priceMin);
        applyFilters();
      });
      priceMax.addEventListener('input', function () {
        filters.priceMax = parseInt(priceMax.value, 10);
        if (filters.priceMax < filters.priceMin) {
          filters.priceMax = filters.priceMin;
          priceMax.value = filters.priceMax;
        }
        document.getElementById('price-max-label').textContent = HBD.utils.formatBDT(filters.priceMax);
        applyFilters();
      });
    }

    // Rating
    var ratingContainer = document.getElementById('filter-ratings');
    if (ratingContainer) {
      ratingContainer.addEventListener('change', function () {
        var checked = ratingContainer.querySelector('input[name="rating"]:checked');
        filters.minRating = checked ? parseFloat(checked.value) : 0;
        applyFilters();
      });
    }

    // Sort
    var sortSelect = document.getElementById('filter-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        filters.sort = sortSelect.value;
        applyFilters();
      });
    }

    // Clear all
    var clearBtn = document.getElementById('clear-all-filters');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearAllFilters);
    }

    // No results clear
    var noResultsClear = document.getElementById('no-results-clear');
    if (noResultsClear) {
      noResultsClear.addEventListener('click', clearAllFilters);
    }

    // Mobile filter toggle
    var filterToggle = document.getElementById('filter-toggle');
    var sidebar = document.getElementById('catalog-sidebar');
    var sidebarClose = document.getElementById('sidebar-close');

    if (filterToggle && sidebar) {
      filterToggle.addEventListener('click', function () {
        sidebar.classList.toggle('is-open');
      });
    }

    if (sidebarClose && sidebar) {
      sidebarClose.addEventListener('click', function () {
        sidebar.classList.remove('is-open');
      });
    }
  }


  // ════════════════════════════════════════════════════════════
  //  APPLY FILTERS & RENDER
  // ════════════════════════════════════════════════════════════
  function applyFilters() {
    var allServices = HBD.data.services.slice();
    var results = allServices;

    // Search filter
    if (filters.search) {
      var q = filters.search.toLowerCase();
      results = results.filter(function (s) {
        return s.name.toLowerCase().indexOf(q) !== -1 ||
               s.description.toLowerCase().indexOf(q) !== -1 ||
               s.tier.toLowerCase().indexOf(q) !== -1;
      });
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter(function (s) {
        return filters.categories.indexOf(s.categoryId) !== -1;
      });
    }

    // Price filter (include services with price=0 for "Get Quote")
    results = results.filter(function (s) {
      if (s.price === 0) return true;
      return s.price >= filters.priceMin && s.price <= filters.priceMax;
    });

    // Rating filter
    if (filters.minRating > 0) {
      results = results.filter(function (s) {
        var avg = HBD.data.getAverageRating(s.id);
        return avg >= filters.minRating;
      });
    }

    // Sort
    results = sortServices(results, filters.sort);

    // Render
    renderGrid(results);
    renderActiveFilters();
    renderResultsInfo(results.length);
  }


  // ════════════════════════════════════════════════════════════
  //  SORT
  // ════════════════════════════════════════════════════════════
  function sortServices(services, sortBy) {
    var sorted = services.slice();

    switch (sortBy) {
      case 'price-low':
        sorted.sort(function (a, b) { return a.price - b.price; });
        break;
      case 'price-high':
        sorted.sort(function (a, b) { return b.price - a.price; });
        break;
      case 'rating':
        sorted.sort(function (a, b) {
          return HBD.data.getAverageRating(b.id) - HBD.data.getAverageRating(a.id);
        });
        break;
      case 'popular':
        sorted.sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });
        break;
      case 'name':
        sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
    }

    return sorted;
  }


  // ════════════════════════════════════════════════════════════
  //  RENDER GRID
  // ════════════════════════════════════════════════════════════
  function renderGrid(services) {
    var grid = document.getElementById('catalog-grid');
    var noResults = document.getElementById('no-results');
    if (!grid) return;

    grid.innerHTML = '';

    if (services.length === 0) {
      grid.style.display = 'none';
      if (noResults) noResults.style.display = '';
      return;
    }

    grid.style.display = '';
    if (noResults) noResults.style.display = 'none';

    services.forEach(function (service) {
      HBD.components.renderServiceCard(service, grid);
    });

    HBD.store.EventBus.emit('content:loaded');
  }


  // ════════════════════════════════════════════════════════════
  //  RENDER ACTIVE FILTER CHIPS
  // ════════════════════════════════════════════════════════════
  function renderActiveFilters() {
    var container = document.getElementById('active-filters');
    if (!container) return;

    var chips = [];

    if (filters.search) {
      chips.push({ label: 'Search: "' + HBD.utils.sanitize(filters.search) + '"', type: 'search' });
    }

    filters.categories.forEach(function (catId) {
      var cat = HBD.data.getCategoryById(catId);
      if (cat) {
        chips.push({ label: cat.icon + ' ' + cat.name, type: 'category', value: catId });
      }
    });

    if (filters.priceMin > 0 || filters.priceMax < 15000) {
      chips.push({ label: HBD.utils.formatBDT(filters.priceMin) + ' — ' + HBD.utils.formatBDT(filters.priceMax), type: 'price' });
    }

    if (filters.minRating > 0) {
      chips.push({ label: filters.minRating + '+ Stars', type: 'rating' });
    }

    if (chips.length === 0) {
      container.innerHTML = '';
      return;
    }

    var html = chips.map(function (chip) {
      return '<span class="filter-chip" data-type="' + chip.type + '"' +
             (chip.value ? ' data-value="' + chip.value + '"' : '') + '>' +
               chip.label +
               ' <button class="filter-chip__remove" aria-label="Remove filter">✕</button>' +
             '</span>';
    }).join('');

    container.innerHTML = html;

    // Chip remove handlers
    container.addEventListener('click', function (e) {
      var removeBtn = e.target.closest('.filter-chip__remove');
      if (!removeBtn) return;

      var chip = removeBtn.closest('.filter-chip');
      var type = chip.getAttribute('data-type');
      var value = chip.getAttribute('data-value');

      switch (type) {
        case 'search':
          filters.search = '';
          var searchInput = document.getElementById('catalog-search');
          if (searchInput) searchInput.value = '';
          break;
        case 'category':
          filters.categories = filters.categories.filter(function (c) { return c !== value; });
          var cb = document.querySelector('#filter-categories input[value="' + value + '"]');
          if (cb) cb.checked = false;
          break;
        case 'price':
          filters.priceMin = 0;
          filters.priceMax = 15000;
          var priceMinEl = document.getElementById('filter-price-min');
          var priceMaxEl = document.getElementById('filter-price-max');
          if (priceMinEl) priceMinEl.value = 0;
          if (priceMaxEl) priceMaxEl.value = 15000;
          document.getElementById('price-min-label').textContent = '৳0';
          document.getElementById('price-max-label').textContent = '৳15,000';
          break;
        case 'rating':
          filters.minRating = 0;
          var allRating = document.querySelector('#filter-ratings input[value="0"]');
          if (allRating) allRating.checked = true;
          break;
      }

      applyFilters();
    });
  }


  // ════════════════════════════════════════════════════════════
  //  RESULTS INFO
  // ════════════════════════════════════════════════════════════
  function renderResultsInfo(count) {
    var info = document.getElementById('results-info');
    if (!info) return;
    info.textContent = 'Showing ' + count + ' service' + (count !== 1 ? 's' : '');
  }


  // ════════════════════════════════════════════════════════════
  //  CLEAR ALL FILTERS
  // ════════════════════════════════════════════════════════════
  function clearAllFilters() {
    filters = {
      search: '',
      categories: [],
      priceMin: 0,
      priceMax: 15000,
      minRating: 0,
      sort: 'default'
    };

    // Reset UI
    var searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.value = '';

    var checkboxes = document.querySelectorAll('#filter-categories input[type="checkbox"]');
    checkboxes.forEach(function (cb) { cb.checked = false; });

    var priceMinEl = document.getElementById('filter-price-min');
    var priceMaxEl = document.getElementById('filter-price-max');
    if (priceMinEl) priceMinEl.value = 0;
    if (priceMaxEl) priceMaxEl.value = 15000;
    document.getElementById('price-min-label').textContent = '৳0';
    document.getElementById('price-max-label').textContent = '৳15,000';

    var allRating = document.querySelector('#filter-ratings input[value="0"]');
    if (allRating) allRating.checked = true;

    var sortSelect = document.getElementById('filter-sort');
    if (sortSelect) sortSelect.value = 'default';

    applyFilters();
  }

})();
