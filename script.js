/* ============================================================
   SGP Tickets — Singapore Grand Prix 2026
   Interactive Functionality
   ============================================================ */

// ==================== TICKET PACKAGES ====================
const TICKETS = [
  {
    id: 1,
    name: "Zone 4 Walkabout",
    category: "General Admission",
    tag: "Best Value",
    tagColor: "#4ade80",
    price: 298,
    original: 380,
    description: "Roaming access across Zone 4 with great vantage points at Turns 14–17. Perfect for first-timers.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Standing access across Zone 4",
      "Turns 14, 15, 16 & 17 viewing",
      "Giant screen viewing areas",
      "Access to Zone 4 food village",
      "Free entertainment & concerts",
      "Digital ticket — instant delivery"
    ],
    availability: "available",
    stock: "Limited stock"
  },
  {
    id: 2,
    name: "Zone 1 Walkabout",
    category: "General Admission",
    tag: "Popular",
    tagColor: "#60a5fa",
    price: 448,
    original: 560,
    description: "Premium roaming access to Zone 1 — the heart of the action near the Pit Straight and Padang grandstand area.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Standing access across Zone 1",
      "Pit straight & Turns 1–3 views",
      "Close to Padang main stage",
      "Giant screen viewing areas",
      "Access to Zone 1 food & bars",
      "Free entertainment & concerts",
      "Digital ticket — instant delivery"
    ],
    availability: "selling-fast",
    stock: "Only 12 left"
  },
  {
    id: 3,
    name: "Turn 1 Grandstand",
    category: "Grandstand",
    tag: "Great Views",
    tagColor: "#fbbf24",
    price: 698,
    original: 850,
    description: "Reserved seat in the Turn 1 Grandstand — witness the first-corner drama of every session up close.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Reserved numbered seat",
      "Elevated Turn 1 viewing position",
      "See braking zone & overtakes",
      "Covered seating area",
      "Complimentary seat cushion",
      "Access to all entertainment zones",
      "Free concerts & fan activities",
      "Digital ticket — instant delivery"
    ],
    availability: "available",
    stock: "Seats available"
  },
  {
    id: 4,
    name: "Pit Grandstand",
    category: "Grandstand",
    tag: "Premium",
    tagColor: "#f97316",
    price: 898,
    original: 1100,
    description: "The ultimate grandstand — reserved seat overlooking the pit lane with views of pit stops and the start/finish straight.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Reserved numbered seat",
      "Direct pit lane views",
      "Start/finish straight action",
      "Watch live pit stops",
      "Covered & elevated seating",
      "Complimentary seat cushion & earplugs",
      "Access to all entertainment zones",
      "Free concerts & fan activities",
      "Digital ticket — instant delivery"
    ],
    availability: "selling-fast",
    stock: "Only 8 left"
  },
  {
    id: 5,
    name: "Stamford Grandstand",
    category: "Grandstand",
    tag: "Skyline Views",
    tagColor: "#a78bfa",
    price: 788,
    original: 950,
    description: "Elevated views of the high-speed section near Stamford Road with the stunning Marina Bay Sands as your backdrop.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Reserved numbered seat",
      "High-speed section viewing",
      "Iconic Marina Bay Sands backdrop",
      "Covered seating area",
      "Complimentary seat cushion",
      "Access to all entertainment zones",
      "Free concerts & fan activities",
      "Digital ticket — instant delivery"
    ],
    availability: "available",
    stock: "Seats available"
  },
  {
    id: 6,
    name: "Paddock Club Hospitality",
    category: "VIP",
    tag: "🏆 Ultimate",
    tagColor: "#e63946",
    price: 3899,
    original: 4800,
    description: "The pinnacle of Singapore GP luxury. All-inclusive hospitality directly above the pit lane with driver access and gourmet dining.",
    features: [
      "3-day weekend access (Fri–Sun)",
      "Air-conditioned Paddock Club suite",
      "Balcony seats directly above pit lane",
      "Guided pit lane walk",
      "Team garage & paddock access",
      "Meet & greet with F1 drivers",
      "Gourmet multi-course dining",
      "Premium open bar all weekend",
      "Exclusive Paddock Club gift pack",
      "VIP concierge service",
      "Dedicated parking & lounge",
      "Digital ticket — instant delivery"
    ],
    availability: "selling-fast",
    stock: "Only 3 left"
  }
];

// ==================== TESTIMONIALS DATA ====================
const TESTIMONIALS = [
  {
    name: "James Richardson",
    initials: "JR",
    location: "London, UK",
    rating: 5,
    text: "The Singapore night race is absolutely mesmerizing. Bought Pit Grandstand tickets through SGP Tickets — seats were exactly as described, instant delivery, and the views of the pit stops were incredible. Will book again next year!"
  },
  {
    name: "Sarah Chen",
    initials: "SC",
    location: "Singapore",
    rating: 5,
    text: "Got Zone 1 Walkabout passes for my family. The process was seamless — tickets arrived digitally within seconds. Being so close to the Padang stage and the racing was an unforgettable experience. Great prices compared to face value!"
  },
  {
    name: "Marco Rossi",
    initials: "MR",
    location: "Milan, Italy",
    rating: 5,
    text: "I've attended 8 different GPs around the world and Singapore is hands down the best. SGP Tickets made getting Paddock Club passes stress-free. The gourmet dining under the night sky while watching F1 — pure magic."
  },
  {
    name: "Emily Watson",
    initials: "EW",
    location: "Sydney, Australia",
    rating: 5,
    text: "First time at the Singapore GP and it exceeded every expectation. SGP Tickets had the best prices I could find for Turn 1 Grandstand. The atmosphere under the lights is something you have to experience at least once."
  },
  {
    name: "Yuki Tanaka",
    initials: "YT",
    location: "Tokyo, Japan",
    rating: 5,
    text: "Booked Stamford Grandstand seats and the Marina Bay Sands backdrop at night was breathtaking. The customer service team on WhatsApp helped me choose the perfect seats. Highly recommend this platform for Singapore GP tickets!"
  },
  {
    name: "David Müller",
    initials: "DM",
    location: "Berlin, Germany",
    rating: 5,
    text: "VIP Paddock Club was worth every single dollar. Pit lane walk, meeting drivers, Michelin-star food — and all of it under Singapore's night sky. SGP Tickets delivered flawlessly. Already planning to come back in 2027!"
  }
];

// ==================== STATE ====================
let cart = JSON.parse(localStorage.getItem('sgp_cart')) || [];
let selectedQuantity = 1;
let currentTicket = null;
let carouselIndex = 0;

// ==================== DOM HELPERS ====================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  renderTicketCards();
  initTicketFilters();
  renderTestimonials();
  initNavbar();
  initScrollAnimations();
  initCart();
  initCarousel();
  initNewsletter();
  initScrollTop();
});

// ==================== RENDER TICKET CARDS ====================
let activeFilter = 'all';
let searchQuery = '';

function getFilteredTickets() {
  return TICKETS.filter(ticket => {
    const matchesCategory = activeFilter === 'all' || ticket.category === activeFilter;
    const matchesSearch = searchQuery === '' ||
      ticket.name.toLowerCase().includes(searchQuery) ||
      ticket.category.toLowerCase().includes(searchQuery) ||
      ticket.description.toLowerCase().includes(searchQuery) ||
      ticket.tag.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });
}

function renderTicketCards() {
  const grid = $('#ticketsGrid');
  const noResults = $('#ticketsNoResults');
  const filtered = getFilteredTickets();

  if (filtered.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'flex';
    return;
  }

  grid.style.display = '';
  noResults.style.display = 'none';

  grid.innerHTML = filtered.map((ticket, i) => {
    const discount = Math.round((1 - ticket.price / ticket.original) * 100);
    return `
    <div class="ticket-card animate-on-scroll" data-ticket-id="${ticket.id}" style="animation-delay: ${i * 0.07}s">
      <div class="ticket-card-header">
        <div class="ticket-card-tag" style="background: ${ticket.tagColor}15; color: ${ticket.tagColor}; border: 1px solid ${ticket.tagColor}40;">${ticket.tag}</div>
        <div class="ticket-card-category">${ticket.category}</div>
      </div>
      <div class="ticket-card-body">
        <h3>${ticket.name}</h3>
        <p class="ticket-card-desc">${ticket.description}</p>
        <div class="ticket-card-pricing">
          <div class="ticket-card-price">
            <span class="current-price">$${ticket.price.toLocaleString()}</span>
            <span class="original-price">$${ticket.original.toLocaleString()}</span>
          </div>
          <span class="ticket-discount">-${discount}%</span>
        </div>
        <ul class="ticket-card-highlights">
          ${ticket.features.slice(0, 4).map(f => `
            <li>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${f}
            </li>
          `).join('')}
          ${ticket.features.length > 4 ? `<li class="more-features">+ ${ticket.features.length - 4} more features</li>` : ''}
        </ul>
      </div>
      <div class="ticket-card-footer">
        <span class="ticket-stock ${ticket.availability}">${ticket.stock}</span>
        <button class="btn-primary ticket-buy-btn" data-ticket-id="${ticket.id}">
          <span>Select Tickets</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `;
  }).join('');

  // Re-observe for scroll animation
  initScrollAnimations();

  // Attach click events
  $$('.ticket-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ticketId = parseInt(btn.dataset.ticketId);
      openTicketModal(ticketId);
    });
  });

  $$('.ticket-card').forEach(card => {
    card.addEventListener('click', () => {
      const ticketId = parseInt(card.dataset.ticketId);
      openTicketModal(ticketId);
    });
  });
}

// ==================== TICKET FILTERS ====================
function initTicketFilters() {
  const tabs = $$('.filter-tab');
  const searchInput = $('#ticketSearch');
  const clearBtn = $('#clearSearch');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter;
      renderTicketCards();
    });
  });

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase().trim();
      renderTicketCards();
    }, 200);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    activeFilter = 'all';
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');
    renderTicketCards();
  });
}

// ==================== TICKET MODAL ====================
function openTicketModal(ticketId) {
  currentTicket = TICKETS.find(t => t.id === ticketId);
  if (!currentTicket) return;

  selectedQuantity = 1;

  $('#modalTitle').textContent = currentTicket.name;
  $('#modalSubtitle').textContent = `${currentTicket.category} • Singapore Grand Prix 2026 • Oct 9–11`;

  renderModalContent();
  updateModalTotal();

  $('#ticketModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderModalContent() {
  const body = $('#modalBody');
  const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  const discount = Math.round((1 - currentTicket.price / currentTicket.original) * 100);

  body.innerHTML = `
    <div class="modal-ticket-info">
      <div class="modal-price-block">
        <span class="modal-current-price">$${currentTicket.price.toLocaleString()}</span>
        <span class="modal-original-price">$${currentTicket.original.toLocaleString()}</span>
        <span class="modal-discount-badge">Save ${discount}%</span>
      </div>
      <p class="modal-desc">${currentTicket.description}</p>
    </div>

    <div class="modal-features-list">
      <h4>What's Included</h4>
      <ul class="ticket-tier-features">
        ${currentTicket.features.map(f => `<li>${checkSvg} ${f}</li>`).join('')}
      </ul>
    </div>

    <div class="ticket-quantity">
      <label>Number of Tickets</label>
      <div class="qty-controls">
        <button class="qty-btn" id="qtyMinus">−</button>
        <span class="qty-value" id="qtyValue">${selectedQuantity}</span>
        <button class="qty-btn" id="qtyPlus">+</button>
      </div>
    </div>
  `;

  // Quantity controls
  $('#qtyMinus').addEventListener('click', () => {
    if (selectedQuantity > 1) {
      selectedQuantity--;
      $('#qtyValue').textContent = selectedQuantity;
      updateModalTotal();
    }
  });

  $('#qtyPlus').addEventListener('click', () => {
    if (selectedQuantity < 10) {
      selectedQuantity++;
      $('#qtyValue').textContent = selectedQuantity;
      updateModalTotal();
    }
  });
}

function updateModalTotal() {
  if (!currentTicket) return;
  const total = currentTicket.price * selectedQuantity;
  $('#modalTotal').textContent = `$${total.toLocaleString()}`;
}

// Close modal
$('#modalClose').addEventListener('click', closeModal);
$('#ticketModal').addEventListener('click', (e) => {
  if (e.target === $('#ticketModal')) closeModal();
});

function closeModal() {
  $('#ticketModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Add to cart from modal
$('#addToCartBtn').addEventListener('click', () => {
  if (!currentTicket) return;

  const item = {
    id: `${currentTicket.id}-${Date.now()}`,
    ticketId: currentTicket.id,
    name: currentTicket.name,
    category: currentTicket.category,
    price: currentTicket.price,
    quantity: selectedQuantity,
    total: currentTicket.price * selectedQuantity
  };

  cart.push(item);
  saveCart();
  updateCartUI();

  // Animate badge
  const badge = $('#cartBadge');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');

  closeModal();
  setTimeout(() => openCart(), 300);
});

// ==================== CART ====================
function initCart() {
  updateCartUI();
  $('#cartToggle').addEventListener('click', openCart);
  $('#cartOverlay').addEventListener('click', closeCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#checkoutBtn').addEventListener('click', () => {
    alert('🎉 Checkout coming soon!\n\nIn production, this would redirect to a secure payment gateway (Stripe / PayPal).');
  });
}

function openCart() {
  $('#cartOverlay').classList.add('active');
  $('#cartDrawer').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('#cartOverlay').classList.remove('active');
  $('#cartDrawer').classList.remove('active');
  document.body.style.overflow = '';
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.total, 0);

  // Badge
  const badge = $('#cartBadge');
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';

  // Count
  $('#cartCount').textContent = totalItems;

  // Cart body
  const body = $('#cartBody');
  const empty = $('#cartEmpty');
  const footer = $('#cartFooter');

  if (cart.length === 0) {
    empty.style.display = 'block';
    footer.style.display = 'none';
    body.querySelectorAll('.cart-item').forEach(el => el.remove());
  } else {
    empty.style.display = 'none';
    footer.style.display = 'block';

    body.querySelectorAll('.cart-item').forEach(el => el.remove());
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span class="cart-item-flag">🇸🇬</span>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-tier">${item.category} × ${item.quantity}</p>
          <span class="cart-item-price">$${item.total.toLocaleString()}</span>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">&times;</button>
      `;
      body.appendChild(div);
    });

    body.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart = cart.filter(item => item.id !== btn.dataset.id);
        saveCart();
        updateCartUI();
      });
    });
  }

  $('#cartTotalPrice').textContent = `$${totalPrice.toLocaleString()}`;
}

function saveCart() {
  localStorage.setItem('sgp_cart', JSON.stringify(cart));
}

// ==================== TESTIMONIALS ====================
function renderTestimonials() {
  const track = $('#testimonialsTrack');
  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initials}</div>
        <div class="testimonial-author-info">
          <h4>${t.name}</h4>
          <p>${t.location}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// ==================== CAROUSEL ====================
function initCarousel() {
  const track = $('#testimonialsTrack');
  const prevBtn = $('#carouselPrev');
  const nextBtn = $('#carouselNext');
  const dotsContainer = $('#carouselDots');

  function getVisibleCards() {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function getTotalSlides() {
    return Math.max(1, TESTIMONIALS.length - getVisibleCards() + 1);
  }

  function renderDots() {
    const total = getTotalSlides();
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === carouselIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const totalSlides = getTotalSlides();
    carouselIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const cardEl = track.querySelector('.testimonial-card');
    if (!cardEl) return;
    
    // Accurately calculate total width (card + margin + any gap)
    const cardWidth = cardEl.offsetWidth;
    const cardStyle = window.getComputedStyle(cardEl);
    const marginRight = parseFloat(cardStyle.marginRight) || 0;
    const trackGap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const shift = cardWidth + marginRight + trackGap;
    
    track.style.transform = `translateX(-${carouselIndex * shift}px)`;
    renderDots();
  }

  prevBtn.addEventListener('click', () => goToSlide(carouselIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(carouselIndex + 1));

  renderDots();

  let autoPlay = setInterval(() => {
    goToSlide((carouselIndex + 1) % getTotalSlides());
  }, 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => {
      goToSlide((carouselIndex + 1) % getTotalSlides());
    }, 5000);
  });

  window.addEventListener('resize', () => {
    renderDots();
    goToSlide(Math.min(carouselIndex, getTotalSlides() - 1));
  });
}

// ==================== NAVBAR ====================
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.animate-on-scroll').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

// ==================== NEWSLETTER ====================
function initNewsletter() {
  const form = $('#newsletterForm');
  const success = $('#newsletterSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#newsletterEmail').value;
    if (email) {
      form.style.display = 'none';
      success.classList.add('show');
      setTimeout(() => {
        form.style.display = 'flex';
        success.classList.remove('show');
        form.reset();
      }, 4000);
    }
  });
}

// ==================== SCROLL TO TOP ====================
function initScrollTop() {
  const btn = $('#scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if ($('#ticketModal').classList.contains('active')) closeModal();
    if ($('#cartDrawer').classList.contains('active')) closeCart();
  }
});
