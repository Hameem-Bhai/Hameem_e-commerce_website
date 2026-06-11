/**
 * ============================================================
 *  HameemBhai er Dokan — Data Module
 *  All service data, reviews, recommendations & config
 *  Namespace: window.HBD.data
 * ============================================================
 */
(function () {
  'use strict';

  window.HBD = window.HBD || {};

  // ──────────────────────────────────────────────
  //  SERVICE CATEGORIES
  // ──────────────────────────────────────────────
  var categories = [
    {
      id: 'lighter-cases',
      name: 'Lighter Cases',
      icon: '🔥',
      description: 'Custom lighter cases — plain flat designs to full 3D printed elements. Your lighter, your style.',
      color: '#FF6B35'
    },
    {
      id: 'graphics-design',
      name: 'Graphics Design',
      icon: '🎨',
      description: 'Logos, banners, social media posts & brand identity — designed to stand out.',
      color: '#7B2FF7'
    },
    {
      id: 'poster-design',
      name: 'Poster Design',
      icon: '🖼️',
      description: 'Eye-catching event posters, flyers & promotional designs that grab attention.',
      color: '#00C9A7'
    },
    {
      id: 'website-building',
      name: 'Website Building',
      icon: '🌐',
      description: 'From simple landing pages to full websites — clean, fast, and mobile-ready.',
      color: '#3A86FF'
    },
    {
      id: 'digital-painting',
      name: 'Digital Painting',
      icon: '🎭',
      description: 'Hand-crafted digital portraits, illustrations & artworks — purely from imagination.',
      color: '#FF006E'
    }
  ];

  // ──────────────────────────────────────────────
  //  SERVICES
  // ──────────────────────────────────────────────
  var services = [
    {
      "id": "lc-premade-3d",
      "categoryId": "lighter-cases",
      "name": "Custom 3D Lighter Case",
      "tier": "Custom",
      "price": 699,
      "priceDisplay": "৳699",
      "description": "Carry lighter cases which glows your own aesthetic. We'll help you turning your idea into reality.\n\n1. Comes with a free lighter (sunlite smoll)\n2. Tell us what you want e.g. cartoon character, anime character or anything.\n3. If you wanna change the lighter model then please let us know while ordering.",
      "features": [
        "Premade 3D element designs",
        "Choose from available templates",
        "Durable & detailed finish",
        "Delivered in time",
        "Free lighter"
      ],
      "popular": false,
      "image": "img_lc_premade_3d.jpg",
      "originalPrice": 1300,
      "stock": 0,
      "badge": "Custom editions"
    },
    {
      "id": "lc-custom-3d",
      "categoryId": "lighter-cases",
      "name": "3D Lighter Case - Hello  Kitty version",
      "tier": "Collector edition",
      "price": 1350,
      "priceDisplay": "৳1,350",
      "description": "Buy 2 for only ৳2000.\nOnly for true HK fans!",
      "features": [
        "Buy 2 for ৳2000 (save ৳700)",
        "Delivered asap",
        "Nice glossy finishing",
        "CLICK IT!"
      ],
      "popular": true,
      "image": "img_lc_custom_3d.jpg",
      "originalPrice": 1500,
      "stock": 2,
      "badge": "FAN FAV!"
    },
    {
      "id": "gd-standard",
      "categoryId": "graphics-design",
      "name": "Custom Logo Design",
      "tier": "Standard",
      "price": 1299,
      "priceDisplay": "৳1,299",
      "description": "Custom logo with multiple variations — perfect for a brand just getting started.",
      "features": [
        "Custom logo design",
        "3 initial concepts to choose from",
        "Light + dark version",
        "PNG + SVG files",
        "2 revision rounds"
      ],
      "popular": false,
      "image": "img_gd_standard.png",
      "originalPrice": 1700,
      "stock": 0,
      "badge": null
    },
    {
      "id": "gd-brand",
      "categoryId": "graphics-design",
      "name": "Full Brand Identity",
      "tier": "Premium",
      "price": 14999,
      "priceDisplay": "৳14,999",
      "description": "Complete brand identity package — logo, colour palette, social media kit & business card design.",
      "features": [
        "Custom logo (all variations)",
        "Colour palette & typography guide",
        "Social media profile & cover designs",
        "Business card design",
        "Full-Stack modern aesthetic website!",
        "Other marketing tips if needed."
      ],
      "popular": true,
      "image": "https://i.postimg.cc/m2MYBhzt/Gemini-Generated-Image-b7vynnb7vynnb7vy.png",
      "originalPrice": 25000,
      "stock": 0,
      "badge": "Premium Edition"
    },
    {
      "id": "pd-basic",
      "categoryId": "poster-design",
      "name": "Basic Poster",
      "tier": "Basic",
      "price": 799,
      "priceDisplay": "৳799",
      "description": "A clean, straightforward poster for events, announcements or promotions.",
      "features": [
        "Single poster design",
        "A4 / social media size",
        "High-res PNG delivery",
        "1 revision round"
      ],
      "popular": false,
      "image": "https://i.postimg.cc/RFndjdww/Image8.jpg",
      "originalPrice": null,
      "stock": 1,
      "badge": null
    },
    {
      "id": "pd-custom",
      "categoryId": "poster-design",
      "name": "Custom Poster Design",
      "tier": "Standard",
      "price": 1500,
      "priceDisplay": "৳1,500",
      "description": "A custom poster with visual effects, lighting and detailed design work — built to impress.",
      "features": [
        "Custom design with effects & lighting",
        "Multiple size variants",
        "Print-ready quality",
        "2 revision rounds"
      ],
      "popular": false,
      "image": "img_pd_custom.jpg",
      "originalPrice": 2000,
      "stock": 14,
      "badge": "JDM Edition"
    },
    {
      "id": "pd-campaign",
      "categoryId": "poster-design",
      "name": "Album Cover Design",
      "tier": "Premium",
      "price": 2399,
      "priceDisplay": "৳2,399",
      "description": "An original hand-drawn digital artwork created on iPad, blending abstract expressionism, industrial aesthetics, and psychological symbolism. The composition explores themes of chaos, isolation, ambition, destruction, and rebirth through layered imagery, fragmented structures, and a dominant red-black palette. Designed to evoke intensity and emotional depth, this piece is suitable for album covers in genres such as hip-hop, alternative, metal, industrial, dark electronic, and experimental music.\n\nMedium: Digital Painting (iPad)\nStyle: Abstract / Industrial / Expressionist\nResolution: High Resolution\nRights: Commercial Use Available\n\n\n*THE MARKS ARE FOR COPYRIGHT ISSUES*",
      "features": [
        "Custom Cover Art",
        "Single & Album Designs",
        "Streaming Platform Ready",
        "Unique Creative Direction",
        "High-Resolution Delivery",
        "Fully Hand-Made"
      ],
      "popular": true,
      "image": "https://i.postimg.cc/pdVcmKz5/albumcover.jpg",
      "originalPrice": null,
      "stock": 0,
      "badge": "Music"
    },
    {
      "id": "wb-multi",
      "categoryId": "website-building",
      "name": "Multi-Page Website",
      "tier": "Standard",
      "price": 5999,
      "priceDisplay": "৳5,999",
      "description": "Get a sleek, high-performance website tailored to your brand. Includes 3–5 professionally crafted pages such as Home, About, Services, Contact, and more. Designed with a modern aesthetic, fast loading speeds, mobile responsiveness, and seamless navigation to help you attract visitors and convert them into customers.",
      "features": [
        "3–5 custom pages",
        "Responsive on all devices",
        "Contact form",
        "Basic SEO setup",
        "Aesthetic and modern",
        "you can make it like portfolio, experience, blog, community type etc."
      ],
      "popular": true,
      "image": "https://i.postimg.cc/LX9S6q6c/Screenshot-2026-06-06-152317.png",
      "originalPrice": 15000,
      "stock": 0,
      "badge": "Popular"
    },
    {
      "id": "wb-full",
      "categoryId": "website-building",
      "name": "Full Custom Website",
      "tier": "Premium",
      "price": 9500,
      "priceDisplay": "৳9,500",
      "description": "1. The Storefront & Customer Experience\nDynamic Product Catalog: Clean grids, category filters, and tags (like ⭐ Popular or Limited Item).\nActive Review & Rating System: Customers can rate products, write testimonials, and see average star ratings updated in real-time.\nWishlist System: Let customers save their favorite items to a custom list that persists across visits.\nSmart Shopping Cart & Checkout:\nAuto-calculates totals and delivery fees (digital vs. physical items).\nAuto-applies promo codes (e.g., HBFRIEND10).\nAuto-recognizes returning customers to apply special customer loyalty discounts.\nDirect cash-out integration showing bKash payment details.\n\n2. The Powerhouse: Admin Control Center\nLive Order Manager: View new orders, customer contact info, check transition IDs, and change order status (Pending ➡️ Completed).\nDirect WhatsApp Integration: Tap a button next to any order to immediately open a chat window with that specific customer on WhatsApp.\nInteractive Inventory Controller: Add new services, edit pricing, change badges, edit features, and upload photos directly from the dashboard.\nCustomer List: Search and view registered customer profiles and emails.\nDatabase Backup Utility: Export the entire store database as a JSON backup or import it to move databases instantly.",
      "features": [
        "Fully custom design & code",
        "Admin panel (if needed)",
        "Animations & micro-interactions",
        "Zero Templates, Zero WordPress Bloat",
        "Mobile-First Experience",
        "Full Control without Complexity"
      ],
      "popular": true,
      "image": "https://i.postimg.cc/nrLQ7cTd/Screenshot-2026-06-06-152925.png",
      "originalPrice": 30000,
      "stock": null,
      "badge": "Most Demanded"
    },
    {
      "id": "dp-basic",
      "categoryId": "digital-painting",
      "name": "Character Sketch",
      "tier": "Basic",
      "price": 999,
      "priceDisplay": "৳999",
      "description": "A striking, hand-drawn digital ink portrait that combines sharp, expressive black line-art with a soft, neon-pink ambient glow. It captures a moody, modern aesthetic that is perfect for personalized avatars, custom prints, or stickers.",
      "features": [
        "Single character / portrait",
        "Clean line art",
        "Basic shading & colour",
        "High-res PNG delivery",
        "Customizable background neon glow (choose your accent color)."
      ],
      "popular": false,
      "image": "https://i.postimg.cc/jqwGzVkx/Image-(10).jpg",
      "originalPrice": 1600,
      "stock": null,
      "badge": null
    },
    {
      "id": "dp-portrait",
      "categoryId": "digital-painting",
      "name": "Detailed Portrait",
      "tier": "Premium",
      "price": 1499,
      "priceDisplay": "৳1,499",
      "description": "A fully rendered, hand-painted digital portrait featuring rich color transitions, warm highlights, and a realistic canvas-texture background. The detailed shading on the face and hair creates a high-end, gallery-quality piece that is perfect for aesthetic wallpapers, custom gifts, or room prints.",
      "features": [
        "Detailed character / portrait",
        "Full shading & textures",
        "Simple background included",
        "2 revision rounds",
        "PNG + layered PSD",
        "Full-color rendering with facial lighting and blush details."
      ],
      "popular": true,
      "image": "https://i.postimg.cc/9XRvG3Nf/Image-(9).jpg",
      "originalPrice": 2100,
      "stock": null,
      "badge": null
    }
  ];

  // ──────────────────────────────────────────────
  //  REVIEWS  (placeholder — to be replaced with real ones)
  // ──────────────────────────────────────────────
  var reviews = [
  {
    "id": "r-1780753525582",
    "serviceId": "lc-custom-3d",
    "userName": "Kala Mia",
    "rating": 5,
    "text": "It's cool asf istg omg TT",
    "date": "2026-06-06",
    "hidden": false
  }
];

  // ──────────────────────────────────────────────
  //  HAMEEM BHAI RECOMMENDS  (curated picks)
  // ──────────────────────────────────────────────
  var recommendedIds = ["lc-custom-3d", "gd-brand", "wb-full", "dp-portrait"];


  // ──────────────────────────────────────────────
  //  REFERRAL / PROMO CODES
  // ──────────────────────────────────────────────
  var referralCodes = {
  "HAMEEMBHAI10": {
    "discount": 10,
    "description": "10% off — HameemBhai special"
  },
  "HBLOVE5": {
    "discount": 5,
    "description": "5% off — Spread the love"
  },
  "HBSTUDENT12": {
    "discount": 15,
    "description": "15% off — Student discount"
  }
};

  // ──────────────────────────────────────────────
  //  ORDER PROCESS STEPS
  // ──────────────────────────────────────────────
  var processSteps = [
    {
      step: 1,
      title: 'Browse & Order',
      icon: '🛒',
      description: 'Pick your service and tier, add to cart, and complete checkout. Takes less than 2 minutes.'
    },
    {
      step: 2,
      title: 'Pay via bKash or COD',
      icon: '💳',
      description: 'Send payment to bKash 01785501873, or choose Cash on Delivery via Pathao courier.'
    },
    {
      step: 3,
      title: 'Share Your Brief',
      icon: '📝',
      description: 'For custom orders, fill out a simple form describing exactly what you want. We\'ll confirm within 24 hours.'
    },
    {
      step: 4,
      title: 'We Get to Work',
      icon: '⚡',
      description: 'HameemBhai starts crafting your order. You\'ll receive updates as we progress.'
    },
    {
      step: 5,
      title: 'Receive & Enjoy',
      icon: '🎉',
      description: 'Digital files delivered online, or physical products shipped via Pathao to your door. Enjoy!'
    }
  ];

  // ──────────────────────────────────────────────
  //  PAYMENT METHODS
  // ──────────────────────────────────────────────
  var paymentMethods = [
    { id: 'bkash', name: 'bKash',            icon: '💸', number: '01785501873' },
    { id: 'cod',   name: 'Cash on Delivery', icon: '📦', number: 'Via Pathao Courier' }
  ];

  // ──────────────────────────────────────────────
  //  CONTACT INFO (used across the site)
  // ──────────────────────────────────────────────
  var contact = {
    name:       'HameemBhai er Dokan',
    realName:   'Basit Hameem',
    tagline:    'I help you turn your imagination into reality.',
    whatsapp:   '01785501873',
    bkash:      '01785501873',
    email:      'basithameem@gmail.com',
    instagram:  'https://www.instagram.com/HameemBhai_er_Dokan',
    facebook:   null,
    location:   'Dhanmondi, Dhaka, Bangladesh',
    googleForm: 'https://forms.gle/REPLACE_WITH_YOUR_FORM_LINK'
  };

  // ──────────────────────────────────────────────
  //  ADMIN CONFIG
  // ──────────────────────────────────────────────
  var ADMIN_EMAIL   = 'basithameem@gmail.com';

  function loadFromServer() {
    return fetch('/api/public-data')
      .then(function (res) { return res.json(); })
      .then(function (db) {
        if (db.services) services = db.services;
        if (db.categories) categories = db.categories;
        if (db.reviews) reviews = db.reviews;
        if (db.referralCodes) referralCodes = db.referralCodes;
        if (db.recommendedIds) recommendedIds = db.recommendedIds;

        if (db.content && window.HBD && window.HBD.content && window.HBD.content.syncFromServer) {
          window.HBD.content.syncFromServer(db.content);
        }
        if (db.availabilityStatus && window.HBD && window.HBD.content && window.HBD.content.syncAvailability) {
          window.HBD.content.syncAvailability(db.availabilityStatus);
        }

        // Notify page controllers
        if (window.HBD && window.HBD.store && window.HBD.store.EventBus) {
          window.HBD.store.EventBus.emit('data:changed');
        }
      })
      .catch(function (e) {
        console.warn('[HBD Data] Could not load data from server. Using offline defaults:', e);
      });
  }

  function reloadFromStorage() { return loadFromServer(); }

  // Load from server in background immediately on load
  loadFromServer();

  // ──────────────────────────────────────────────
  //  HELPER FUNCTIONS
  // ──────────────────────────────────────────────
  function getServiceById(id) {
    for (var i = 0; i < services.length; i++) {
      if (services[i].id === id) return services[i];
    }
    return null;
  }

  // ──────────────────────────────────────────────
  //  HELPER FUNCTIONS FOR CATEGORIES
  // ──────────────────────────────────────────────
  function getCategoryById(id) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === id) return categories[i];
    }
    return null;
  }

  function getServicesByCategory(categoryId) {
    return services.filter(function (s) { return s.categoryId === categoryId; });
  }

  function getReviewsByService(serviceId) {
    return reviews.filter(function (r) { return r.serviceId === serviceId; });
  }

  function getRecommended() {
    return recommendedIds.map(getServiceById).filter(Boolean);
  }

  function getAverageRating(serviceId) {
    var serviceReviews = getReviewsByService(serviceId);
    if (serviceReviews.length === 0) return 0;
    var sum = serviceReviews.reduce(function (acc, r) { return acc + r.rating; }, 0);
    return Math.round((sum / serviceReviews.length) * 10) / 10;
  }

  // ──────────────────────────────────────────────
  //  PUBLIC API
  // ──────────────────────────────────────────────
  window.HBD.data = {
    ADMIN_EMAIL:    ADMIN_EMAIL,
    contact:        contact,
    get categories()     { return categories; },
    get services()       { return services; },
    get reviews()        { return reviews; },
    get recommendedIds() { return recommendedIds; },
    get referralCodes()  { return referralCodes; },
    processSteps:        processSteps,
    paymentMethods:      paymentMethods,
    getServiceById:      getServiceById,
    getCategoryById:     getCategoryById,
    getServicesByCategory: getServicesByCategory,
    getReviewsByService: getReviewsByService,
    getRecommended:      getRecommended,
    getAverageRating:    getAverageRating,
    reloadFromStorage:   reloadFromStorage
  };

})();
