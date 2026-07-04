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
        "name": "Custom 3D Lighter Case by Hameem Bhai",
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
        "images": ["img_lc_premade_3d.jpg", "img_lc_premade_3d.jpg", "img_lc_premade_3d.jpg"],
        "originalPrice": 1300,
        "stock": 10,
        "badge": "Custom editions"
    },
    {
        "id": "lc-custom-3d",
        "categoryId": "lighter-cases",
        "name": "3D Lighter Case - Hello  Kitty version by Hameem Bhai",
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
        "images": ["img_lc_custom_3d.jpg", "img_lc_custom_3d.jpg", "img_lc_custom_3d.jpg"],
        "originalPrice": 1500,
        "stock": 2,
        "badge": "FAN FAV!"
    },
    {
        "id": "gd-standard",
        "categoryId": "graphics-design",
        "name": "Custom Logo Design by Hameem Bhai",
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
        "images": ["img_gd_standard.png", "img_gd_standard.png", "img_gd_standard.png"],
        "originalPrice": 1700,
        "stock": null,
        "badge": null
    },
    {
        "id": "gd-brand",
        "categoryId": "graphics-design",
        "name": "Full Brand Identity by Hameem Bhai",
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
        "images": ["https://i.postimg.cc/m2MYBhzt/Gemini-Generated-Image-b7vynnb7vynnb7vy.png", "https://i.postimg.cc/m2MYBhzt/Gemini-Generated-Image-b7vynnb7vynnb7vy.png", "https://i.postimg.cc/m2MYBhzt/Gemini-Generated-Image-b7vynnb7vynnb7vy.png"],
        "originalPrice": 25000,
        "stock": null,
        "badge": "Premium Edition"
    },
    {
        "id": "pd-basic",
        "categoryId": "poster-design",
        "name": "Basic Poster by Hameem Bhai",
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
        "images": ["https://i.postimg.cc/RFndjdww/Image8.jpg", "https://i.postimg.cc/RFndjdww/Image8.jpg", "https://i.postimg.cc/RFndjdww/Image8.jpg"],
        "originalPrice": null,
        "stock": 1,
        "badge": null
    },
    {
        "id": "pd-custom",
        "categoryId": "poster-design",
        "name": "Custom Poster Design by Hameem Bhai",
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
        "name": "Album Cover Design by Hameem Bhai",
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
        "stock": null,
        "badge": "Music"
    },
    {
        "id": "wb-multi",
        "categoryId": "website-building",
        "name": "Multi-Page Website by Hameem Bhai",
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
        "name": "Full Custom Website by Hameem Bhai",
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
        "name": "Character Sketch by Hameem Bhai",
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
        "name": "Detailed Portrait by Hameem Bhai",
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
  var reviews = [];

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
    instagram:  'https://www.instagram.com/hameembhaierdokan_bd',
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
        if (db.blogPosts) blogPosts = db.blogPosts;

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

  var blogPosts = [
        {
                "id": "custom-lighter-cases-portfolio",
                "title": "How to Design Custom Lighter Cases in 2026: The Ultimate Guide",
                "author": "Hameem Bhai",
                "date": "June 18, 2026",
                "readTime": "3 min read",
                "category": "Lighter Cases",
                "keywords": [
                        "custom lighter cases",
                        "how to paint lighters",
                        "3D printed lighter case",
                        "DIY custom lighter",
                        "creative studio Dhaka"
                ],
                "summary": "Learn how to turn basic utility lighters into custom, hand-painted and 3D-sculpted works of art. Step-by-step DIY guide from Hameem Bhai.",
                "content": `<div class="blog-post__banner">
    <h2>✨ Custom Lighter Cases ✨</h2>
    <p class="tagline">Turn boring utility lighters into custom, hand-painted and 3D-sculpted works of art. Let's cook! 🔥</p>
</div>
<section>
    <h2>hey bestie, your lighter is giving NPC energy 🔥</h2>
    <p>No cap — a plain lighter is the most underrated canvas in your everyday carry. At <span class=\"highlight\">Hameem Bhai er Dokan</span>, we've been turning boring plastic lighters into straight-up wearable art. Think anime characters, UV-reactive sculptures, minimalist typography — all hand-crafted, all hitting different.</p>

    <div class=\"genz-slang\">
        <strong>Translation:</strong> \"NPC energy\" = boring/generic | \"Hitting different\" = feels special | \"No cap\" = for real | \"Main character\" = the protagonist of your own story
    </div>

    <p>Whether you want a hand-painted design, 3D sculpted elements, or a glow-in-the-dark masterpiece — this guide breaks down exactly how Hameem Bhai brings these to life. Let's get into it fr fr.</p>
</section>

<section>
    <h2>step 1: the prep era 🏗️</h2>
    <p>You cannot skip this step. Seriously. Even the most beautiful design will peel off in days if the surface isn't prepped properly. This is where the glow-up foundation gets laid.</p>

    <h3>Surface Cleaning</h3>
    <p>Wipe down the lighter case with <span class=\"highlight\">isopropyl alcohol (90%+)</span>. This removes skin oils, dust, and anything that would prevent adhesion. For metal or hard plastic surfaces, a light sanding with fine-grit sandpaper gives the primer something to actually grip.</p>

    <div class=\"genz-slang\">
        <strong>Real Talk:</strong> Skip the alcohol wipe and your paint will slide right off. It's not gatekeeping — it's just science. Don't be the person who skips prep and then cries over peeling art.
    </div>

    <h3>Priming</h3>
    <p>Apply a thin, even coat of primer and let it cure fully. This is the unsexy step that makes everything else possible. Respect the process.</p>
</section>

<section>
    <h2>step 2: painting — where the main character moment happens 💅</h2>
    <p>Now we're in the fun part. This is where the lighter transforms from mid factory plastic to something that actually slays.</p>

    <h3>Paint Type Matters</h3>
    <ul>
        <li><span class=\"highlight\">Acrylic paint pens</span> — GOAT for fine line work, anime details, and typography</li>
        <li><span class=\"highlight\">Spray paints</span> — best for solid base coats and smooth gradients</li>
        <li><span class=\"highlight\">UV-reactive paints</span> — for the ✨extra✨ glow-in-dark effect Hameem Bhai er Dokan is known for</li>
    </ul>

    <h3>The Painting Process</h3>
    <p>Apply your base color first. Let it cure completely — don't rush it, don't blow-dry it, just let it breathe. Then sketch your design lightly with a pencil before committing with paint. Anime characters, abstract patterns, or sharp typography all go crazy hard on a lighter canvas.</p>

    <div class=\"genz-slang\">
        <strong>Pro Tip:</strong> Thin layers > thick layers, always. Multiple thin coats dry faster, look smoother, and won't crack. One thick coat is a recipe for disaster.
    </div>
</section>

<section>
    <h2>step 3: the 3D era (optional but iconic) 🧠</h2>
    <p>This is where Hameem Bhai er Dokan really goes main character. Adding 3D sculpted elements to a lighter case is unhinged in the best way possible.</p>

    <h3>The Two Methods</h3>
    <div class=\"principle-box\">
        <h4>Clay Sculpting</h4>
        <p>Polymer clay lets you hand-sculpt tiny horns, flowers, dragon scales, literally anything. Bake it, glue it on, seal it. It's giving miniature sculpture energy.</p>
    </div>

    <div class=\"principle-box\">
        <h4>3D Printing</h4>
        <p>Design a sleeve in Blender that perfectly fits a standard BIC lighter. Print in PLA or PETG at 0.12mm layer height for detail. This is the high-tech route and it absolutely slaps.</p>
    </div>

    <div class=\"code-block\">
// 3D Print Settings for Lighter Sleeves
Material: PLA or PETG
Layer Height: 0.12mm (maximum detail)
Infill: 20% Gyroid (strong + lightweight)
Wall Count: 3 (for durability)
Supports: Yes — Organic mode
    </div>
</section>

<section>
    <h2>step 4: seal it — this is non-negotiable 🛡️</h2>
    <p>Your lighter lives in pockets. It gets dropped, rubbed, touched constantly. A proper seal coat is the difference between a design that lasts years vs. one that chips in a week.</p>

    <h3>Recommended Sealants</h3>
    <ul>
        <li><span class=\"highlight\">Matte varnish</span> — subtle, sophisticated finish. No glare.</li>
        <li><span class=\"highlight\">Glossy varnish</span> — vibrant, shiny, makes colors pop harder</li>
        <li><span class=\"highlight\">Epoxy resin</span> — strongest option, glass-like finish, used for premium pieces</li>
    </ul>

    <p>Apply 2-3 thin layers, letting each dry completely before the next. Once cured? Your custom lighter case is officially a piece of art and it's ready to slay. 💅✨</p>

    <div class=\"genz-slang\">
        <strong>Final Boss Tip:</strong> Order one from Hameem Bhai er Dokan if you're not ready to DIY yet. Every case is hand-crafted with premium materials and ships from Dhaka to your door. No cap, they hit different.
    </div>
</section>`
        },
        {
                "id": "graphic-design-beats-templates",
                "title": "Graphic Design for Beginners 2026 by Hameem Bhai : Learn Design Principles That Slay",
                "author": "Hameem Bhai",
                "date": "June 17, 2026",
                "readTime": "10 min read",
                "category": "Graphics Design",
                "keywords": [
                        "graphic design",
                        "learn graphic design",
                        "graphic design basics",
                        "graphic design for beginners",
                        "design principles",
                        "typography tutorial",
                        "color theory",
                        "logo design",
                        "branding design",
                        "design tools",
                        "Canva tutorial",
                        "Adobe Creative",
                        "web design",
                        "graphic design 2026",
                        "how to become graphic designer",
                        "freelance graphic design",
                        "design portfolio",
                        "visual design",
                        "UI design",
                        "design inspiration"
                ],
                "summary": "Graphic design isn't gatekept anymore. Learn color theory, typography, design principles, and branding basics. Build your first portfolio piece that actually slays. Real talk, simplified steps.",
                "content": `<div class="blog-post__banner">
    <h2>✨ Graphic Design for Beginners ✨</h2>
    <p class="tagline">Learn Design Principles That Actually Slay (No Cap) 💅</p>
</div>
<section>
            <h2>What Even Is Graphic Design? <span class=\"emoji-box\">🎨</span></h2>
            <p>Graphic design isn't just \"making things look pretty.\" That's mid. Real graphic design is about communicating ideas visually. It's about making people FEEL something when they see your work.</p>
            
            <p>And here's the real tea: <span class=\"highlight\">it's not gatekept anymore</span>. You don't need a fancy degree from a prestigious design school. You don't need to drop thousands on Adobe Creative Cloud. What you need? Understanding of principles. That's literally it.</p>

            <div class=\"genz-slang\">
                <strong>Translation:</strong> \"Mid\" = mediocre | \"Real tea\" = the truth | \"Gatekept\" = only for certain people | \"Slay\" = do excellently | \"No cap\" = no lie
            </div>

            <p>Whether you're building personal brand energy, creating content for your side hustle, or just tired of boring visuals—graphic design is your superpower. Let's get into it.</p>
        </section>

        <section>
            <h2>Design Principles: The Fundamentals That Hit Different <span class=\"emoji-box\">🔥</span></h2>
            <p>Before you touch Figma or Canva, you need to understand the fundamentals. Design isn't random. There are actual RULES (and you can break them once you know them, that's the tea).</p>

            <h3>Balance: Everything Feels Intentional</h3>
            <div class=\"principle-box\">
                <h4>Why it matters:</h4>
                <p>Balanced designs feel stable and professional. Unbalanced designs feel chaotic and accidental. We're not going for accidental energy.</p>
            </div>

            <p>There are two types: <span class=\"highlight\">symmetrical balance</span> (mirror image, formal) and <span class=\"highlight\">asymmetrical balance</span> (different elements, same visual weight, actually more interesting). Most modern designs use asymmetrical because it's giving sophisticated energy without being boring.</p>

            <h3>Contrast: Make Important Stuff POP</h3>
            <div class=\"principle-box\">
                <h4>Why it matters:</h4>
                <p>Contrast guides the viewer's eye. Without it? Everything looks the same and nothing stands out. That's not the vibe.</p>
            </div>

            <p>Contrast can be:</p>
            <ul>
                <li><span class=\"highlight\">Color contrast</span> - Light on dark, or vice versa</li>
                <li><span class=\"highlight\">Size contrast</span> - Big headings vs small body text</li>
                <li><span class=\"highlight\">Shape contrast</span> - Rounded shapes next to sharp ones</li>
                <li><span class=\"highlight\">Texture contrast</span> - Smooth next to rough</li>
            </ul>

            <p>Mix these and your designs go from mid to absolutely slaying.</p>

            <h3>White Space (The Underrated GOAT) <span class=\"emoji-box\">👑</span></h3>
            <div class=\"principle-box\">
                <h4>Why it matters:</h4>
                <p>White space isn't \"empty.\" It's intentional breathing room. It makes designs look clean, professional, and actually readable.</p>
            </div>

            <p>Here's the truth nobody tells beginners: <span class=\"highlight\">less is more, literally</span>. Stop cramming everything into every inch. Give your designs room to breathe. The most expensive, sophisticated designs? They use white space like it's a luxury product. Because it IS.</p>

            <h3>Hierarchy: Guide the Eye Intentionally</h3>
            <p>Not all elements are created equal. Some are important, some are supporting. Hierarchy shows what matters most through:</p>
            <ul>
                <li>Size (bigger = more important)</li>
                <li>Color (bright/bold = attention grabber)</li>
                <li>Position (top-left or center = primary focus)</li>
                <li>Weight (bold fonts = emphasis)</li>
            </ul>

            <p>When hierarchy is done right, people see what you want them to see in the order you want them to see it. That's the power move.</p>

            <h3>Alignment: Everything Connects</h3>
            <div class=\"principle-box\">
                <h4>The Rule:</h4>
                <p>Every element should align to something else. Left, center, right, or to a grid. Nothing should feel random.</p>
            </div>

            <p>Aligned designs look intentional. Misaligned designs look like an accident. That's not giving main character energy.</p>
        </section>

        <section>
            <h2>Color Theory: The Secret Sauce <span class=\"emoji-box\">🎨</span></h2>
            <p>Colors aren't random. They hit different because of psychology and actual science. That's the real magic.</p>

            <h3>The 60-30-10 Rule (The Cheat Code)</h3>
            <div class=\"principle-box\">
                <h4>How it works:</h4>
                <ul>
                    <li><span class=\"highlight\">60%</span> - Your dominant color (the vibe, the brand energy)</li>
                    <li><span class=\"highlight\">30%</span> - Secondary color (support that energy)</li>
                    <li><span class=\"highlight\">10%</span> - Accent color (the pop, the moment, the highlight)</li>
                </ul>
            </div>

            <p>This ratio literally never fails. Use it and your designs instantly look more professional. No cap.</p>

            <h3>Complementary Colors = Maximum Contrast</h3>
            <p>Colors opposite on the color wheel = they absolutely clash (in a good way). Think orange and blue, red and green. Use these when you want something to POP. Your accent color should probably be complementary to your dominant color.</p>

            <h3>Analogous Colors = Harmony</h3>
            <p>Colors next to each other on the color wheel = they vibe together. Think blues and purples, oranges and reds. Use these when you want a cohesive, calm energy. This is giving serene energy.</p>

            <h3>Color Psychology (The Real Tea) <span class=\"emoji-box\">☕</span></h3>
            <ul>
                <li><span class=\"highlight\">Red</span> - Energy, passion, urgency (use for CTAs)</li>
                <li><span class=\"highlight\">Blue</span> - Trust, calm, professional (corporate loves this)</li>
                <li><span class=\"highlight\">Green</span> - Growth, health, nature (eco-friendly vibes)</li>
                <li><span class=\"highlight\">Yellow</span> - Happiness, optimism, attention (but not too much)</li>
                <li><span class=\"highlight\">Purple</span> - Luxury, creativity, sophistication (main character color)</li>
                <li><span class=\"highlight\">Black</span> - Power, elegance, mystery (pairs with everything)</li>
                <li><span class=\"highlight\">White</span> - Clean, minimal, elegant (the minimalist's bestie)</li>
            </ul>

            <div class=\"genz-slang\">
                <strong>Pro Tip:</strong> Your color choices literally communicate before a single word is read. Choose wrong and your message is already dead. Choose right and people feel your vibe before they even know why.
            </div>
        </section>

        <section>
            <h2>Typography 101: Fonts That Actually Slay <span class=\"emoji-box\">✍️</span></h2>
            <p>Typography is the style and appearance of text. This is where most beginners mess up. They use random fonts that don't match and everything looks chaotic.</p>

            <h3>Font Families Matter</h3>
            <ul>
                <li><span class=\"highlight\">Serif</span> (Times New Roman, Georgia) - Classic, formal, traditional. Reading books energy.</li>
                <li><span class=\"highlight\">Sans-serif</span> (Arial, Helvetica, Roboto) - Modern, clean, professional. Tech company energy.</li>
                <li><span class=\"highlight\">Display</span> (Script, decorative fonts) - Personality, flair, statement. Use sparingly or it's giving try-hard.</li>
            </ul>

            <h3>Font Pairing (The Real Move)</h3>
            <p>Don't use more than 2-3 fonts max. Use one for headings (usually bold/display), one for body text (usually sans-serif for digital).</p>

            <div class=\"principle-box\">
                <h4>Safe Pairing Rules:</h4>
                <ul>
                    <li>Serif heading + sans-serif body = timeless combination</li>
                    <li>Sans-serif heading + sans-serif body = modern and clean</li>
                    <li>Display font (very limited) + sans-serif body = personality with readability</li>
                </ul>
            </div>

            <p>The fonts you choose literally set the entire tone. Choose a playful sans-serif? Playful energy. Choose a formal serif? Professional energy. Choose a script font everywhere? Unhinged energy (not in a good way).</p>

            <h3>Sizing & Readability</h3>
            <ul>
                <li>H1 (Main heading): 28px-36px</li>
                <li>H2 (Section heading): 20px-24px</li>
                <li>Body text: 14px-16px for digital, 12px minimum</li>
                <li>Never go smaller than 12px or it's literally unreadable</li>
            </ul>

            <p><span class=\"highlight\">Line height matters too</span>. Make it 1.5x or 1.6x the font size for body text. This makes reading actually pleasant instead of a chore.</p>

            <h3>Common Typography Mistakes (Don't Be This Person)</h3>
            <ul>
                <li>Too many fonts (3+ is giving chaos)</li>
                <li>No contrast between headings and body (everything looks the same)</li>
                <li>Poor line spacing (can't breathe while reading)</li>
                <li>All caps everywhere (literally aggressive energy)</li>
                <li>Tiny text that requires squinting (not accessible, not cool)</li>
                <li>Decorative fonts in paragraphs (nobody can read it)</li>
            </ul>
        </section>

        <section>
            <h2>Design Tools: What You Actually Need <span class=\"emoji-box\">🛠️</span></h2>
            <p>DO NOT spend money you don't have right now. Start free, build skills, get hired, THEN upgrade your tools. That's the realistic path.</p>

            <h3>Free Tools That Go Hard</h3>
            
            <div class=\"principle-box\">
                <h4>Canva</h4>
                <p>Best for: Instagram posts, presentations, social media, quick graphics. Literally everything. The free version is actually insane with features.</p>
                <p>Why it slaps: Templates, drag-and-drop, no learning curve. You can make professional-looking stuff in minutes.</p>
            </div>

            <div class=\"principle-box\">
                <h4>Figma</h4>
                <p>Best for: UI/UX design, web design, creating components, collaboration. Industry standard.</p>
                <p>Why it slaps: Free tier is robust. You learn the tool professionals use. Cloud-based so you work anywhere.</p>
            </div>

            <div class=\"principle-box\">
                <h4>Piktochart</h4>
                <p>Best for: Infographics, data visualization, charts that don't look mid.</p>
                <p>Why it slaps: Makes complex data actually pretty and understandable.</p>
            </div>

            <h3>When to Upgrade (Eventually)</h3>
            <p>Once you're getting PAID design work, then think about:</p>
            <ul>
                <li><span class=\"highlight\">Adobe Creative Suite</span> - Industry standard but expensive ($54.99/month or more)</li>
                <li><span class=\"highlight\">Figma Pro</span> - $12/month, worth it if you're doing serious design work</li>
                <li><span class=\"highlight\">Procreate</span> - $12.99 one-time, GOAT for digital illustration (iPad only)</li>
            </ul>

            <div class=\"genz-slang\">
                <strong>Real Talk:</strong> Your tool doesn't make you a good designer. Understanding principles and practice does. You could design with Microsoft Paint if you knew what you were doing. Start with free tools and learn. Upgrade when you're making money.
            </div>
        </section>

        <section>
            <h2>Your First Project: Logo Design <span class=\"emoji-box\">✨</span></h2>
            <p>Let's apply everything. Time to design your first logo. This is where theory becomes reality.</p>

            <h3>The Process</h3>
            <ol>
                <li><span class=\"highlight\">Research</span> - What's your brand? What does it represent? What's the vibe?</li>
                <li><span class=\"highlight\">Sketch</span> - Draw rough ideas. Don't worry about perfection. Just get ideas out.</li>
                <li><span class=\"highlight\">Digitize</span> - Pick your best sketch and create it in Figma or Canva.</li>
                <li><span class=\"highlight\">Apply principles</span> - Does it have contrast? Is it balanced? Is the hierarchy clear?</li>
                <li><span class=\"highlight\">Color</span> - Apply your 60-30-10 rule. Make it pop.</li>
                <li><span class=\"highlight\">Test</span> - How does it look small? Big? On different backgrounds?</li>
                <li><span class=\"highlight\">Ship it</span> - Share it. Get feedback. Iterate.</li>
            </ol>

            <p>Your first logo won't be perfect. That's the tea. But if you follow the principles? It will look intentional. It will look professional. It will absolutely slay.</p>
        </section>

        <section>
            <h2>Building a Portfolio That Gets You Noticed <span class=\"emoji-box\">👀</span></h2>
            <p>Here's the move: don't wait until you're \"perfect\" to start building a portfolio. Start now. Build in public.</p>

            <h3>What to Include</h3>
            <ul>
                <li>3-5 of your BEST projects (quality over quantity, no cap)</li>
                <li>Case studies (the thinking behind each design)</li>
                <li>Before/after (show your design process)</li>
                <li>Variety (show range - logo, social media, web design, etc.)</li>
            </ul>

            <h3>Where to Showcase</h3>
            <ul>
                <li><span class=\"highlight\">Behance</span> - Adobe's platform, designers browse here for inspiration</li>
                <li><span class=\"highlight\">Dribbble</span> - Very design-focused, creatives looking for inspo hang here</li>
                <li><span class=\"highlight\">Your own website</span> - Most credible. Shows you can actually design web stuff.</li>
                <li><span class=\"highlight\">Instagram/TikTok</span> - Behind-the-scenes content, design process videos = engagement</li>
            </ul>

            <p>Pro tip: Instagram reels showing your design process > finished portfolio. People want to see the thinking. The journey. Show that and you'll stand out.</p>
        </section>

        <section>
            <h2>Graphic Design Trends in 2026 <span class=\"emoji-box\">🚀</span></h2>
            <ul>
                <li><span class=\"highlight\">Maximalist but organized</span> - More stuff but with clear hierarchy. Chaos with intention.</li>
                <li><span class=\"highlight\">Authentic/imperfect</span> - Hand-drawn elements, scanned textures. Less polished, more human.</li>
                <li><span class=\"highlight\">Bold colors</span> - Bright, neon, unafraid colors. Boring is mid.</li>
                <li><span class=\"highlight\">Micro-interactions</span> - Small animations, hover effects. Make designs feel alive.</li>
                <li><span class=\"highlight\">3D + 2D mix</span> - Blend both. Creates depth and interest.</li>
                <li><span class=\"highlight\">Custom typography</span> - Standard fonts are mid. Customize or create your own.</li>
            </ul>

            <div class=\"genz-slang\">
                <strong>The Tea:</strong> Trends change. Don't chase trends. Build fundamental skills so when trends shift, you shift with them naturally. That's staying relevant fr fr.
            </div>
        </section>

        <section>
            <h2>FAQ: Your Design Questions Answered <span class=\"emoji-box\">❓</span></h2>

            <h3>Do I need to be naturally creative to be a good designer?</h3>
            <p>No cap, creativity is a skill, not a talent. You learn it. Understanding principles teaches you how to be intentional with your work. The rest is practice.</p>

            <h3>How long does it take to get good?</h3>
            <p>3-6 months of consistent practice? You'll be dangerous. 1 year? You can land clients. 2+ years? You're genuinely good. But you're making money and improving the whole time.</p>

            <h3>Should I start with Canva or Figma?</h3>
            <p>Canva if you want immediate results and quick projects. Figma if you want to learn \"proper\" design. Honestly? Use both. Canva for quick stuff, Figma for serious projects.</p>

            <h3>Can I make money with design right now?</h3>
            <p>Absolutely. Start with Fiverr, Upwork, or local clients. Charge for logos, social media graphics, presentations. Build your portfolio while making money. That's the move.</p>

            <h3>Do I need a degree?</h3>
            <p>No. Seriously. Your portfolio is your degree. If you can show that you understand design and your work is fire, nobody cares about credentials.</p>
        </section>

        <section>
            <h2>The Real Talk Ending <span class=\"emoji-box\">💅</span></h2>
            <p>Graphic design in 2026 is not gatekept. The tools are free or cheap. The knowledge is everywhere. The only thing stopping you is you.</p>

            <p>Learn the principles. Practice constantly. Build in public. Get feedback. Iterate. That's the path from \"I want to learn design\" to \"I'm a designer getting paid.\"</p>

            <p>Your first design won't be perfect. That's okay. Your 10th design will be better. Your 100th design will slay. Keep pushing.</p>

            <p><span class=\"highlight\">Design is solving problems beautifully.</span> Learn that and you've got a superpower that pays well and makes people happy.</p>

            <p>Now go design something. And when you do? Show me. 💅✨</p>
        </section>`
        },
        {
                "id": "web-dev-glassmorphism",
                "title": "Web Development Guide 2026 by Hameem Bhai : Learn HTML, CSS & JavaScript (No Cap)",
                "author": "Hameem Bhai",
                "date": "June 16, 2026",
                "readTime": "5 min read",
                "category": "Website Building",
                "keywords": [
                        "web development",
                        "learn web development",
                        "HTML CSS JavaScript",
                        "web design tutorial",
                        "beginner web development",
                        "responsive design",
                        "web development 2026",
                        "modern web development",
                        "how to learn coding",
                        "frontend development",
                        "web development guide",
                        "JavaScript basics",
                        "CSS tutorial",
                        "HTML basics",
                        "web development for beginners"
                ],
                "summary": "Learn web development from zero: HTML, CSS, JavaScript basics explained simply. Build responsive websites that actually look fire. No frameworks, no gatekeeping. Real talk for real devs.",
                "content": `<div class="blog-post__banner">
    <h2>✨ Web Dev is Bussin ✨</h2>
    <p class="tagline">A GenZ Guide to Slaying Code, No Cap 🚀</p>
</div>
<section>
            <h2>Intro: Why Web Dev Hits Different <span class=\"emoji-box\">🔥</span></h2>
            <p>Yo, real talk? Web development is literally <span class=\"highlight\">the move</span> right now. If you're still sleeping on learning how to code, it's giving main character energy, but like... for your career. We're not gatekeeping this anymore!</p>
            
            <div class=\"genz-slang\">
                <strong>Translation:</strong> \"No cap\" = no lie/for real | \"Bussin\" = really good | \"Hits different\" = is special | \"It's giving\" = it has the vibe of
            </div>

            <p>Web development is where you can literally build stuff that billions of people use. That's not just a side hustle era, that's a <span class=\"highlight\">legacy era</span>. From making personal websites that slay to building the next tech unicorn, the possibilities are actually unhinged (in a good way).</p>
        </section>

        <section>
            <h2>HTML: The Foundation That's Absolutely Iconic <span class=\"emoji-box\">🏗️</span></h2>
            <p>Look, HTML is like... the bare minimum. It's the skeleton of every website. You NEED this energy. Think of it as the structure of your whole vibe.</p>

            <h3>What's the Tea? <span class=\"emoji-box\">☕</span></h3>
            <p>HTML (HyperText Markup Language) is the markup language that tells browsers what content to display. It's not a programming language, so if you're allergic to math, don't worry bestie. It's literally just tags.</p>

            <div class=\"code-block\">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My Slay Website&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;This is main character energy&lt;/h1&gt;
    &lt;p&gt;HTML is literally so easy fr fr&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
            </div>

            <p>See? Not intimidating at all. Each tag is like a container for different types of content. Headers, paragraphs, images, links—it's all there.</p>

            <div class=\"genz-slang\">
                <strong>The Vibe Check:</strong> HTML alone looks mid. REALLY mid. But it's essential, so respect the process! Once you throw CSS on it? *Chef's kiss.*
            </div>
        </section>

        <section>
            <h2>CSS: Making It Aesthetic (The Real MVP) <span class=\"emoji-box\">💅</span></h2>
            <p>Okay so HTML is giving foundation, but CSS? CSS is giving <span class=\"highlight\">main character energy</span>. This is where you make your website actually look cute. Colors, fonts, spacing—all that good stuff that makes people not immediately close the tab.</p>

            <h3>The Glow Up Begins</h3>
            <p>CSS (Cascading Style Sheets) is how you style your website. Want that pink aesthetic? CSS got you. Want animations that go hard? CSS is your bestie.</p>

            <div class=\"code-block\">
body {
  background-color: #fff5f8;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h1 {
  color: #D4537E;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}
            </div>

            <p>That's literally it. You're changing the look and feel of your entire site with just a few lines. Once you understand <span class=\"highlight\">selectors</span>, <span class=\"highlight\">properties</span>, and <span class=\"highlight\">values</span>, CSS becomes your superpower.</p>

            <div class=\"genz-slang\">
                <strong>Pro Tip (No Lie):</strong> Flexbox and Grid are IT. They're the reason layouts actually work. Learn them and you're basically a professional. It's not gatekeeping anymore because everyone needs to know this!
            </div>
        </section>

        <section>
            <h2>JavaScript: The Brain of Your Website <span class=\"emoji-box\">🧠</span></h2>
            <p>Alright so we have the body (HTML) and the makeup (CSS), but JavaScript? JavaScript is the personality. It's what makes your website actually DO stuff. Like, respond to clicks, animate things, fetch data from APIs—all that spicy interactivity.</p>

            <h3>Interactive? Interactive.</h3>
            <p>JavaScript is a real programming language (yes, this is where it gets real), but it's also lowkey one of the most fun ones to learn. You can literally see results immediately in your browser.</p>

            <div class=\"code-block\">
document.querySelector('button').addEventListener('click', function() {
  alert('Yaaaas, you clicked it! Main character moment!');
});
            </div>

            <p>See? You just made a button interactive. That's JavaScript energy right there. From handling form submissions to building whole applications with frameworks like React or Vue, JavaScript is absolutely carrying the web dev industry on its back.</p>

            <h3>The Frameworks That Hit Different <span class=\"emoji-box\">🎯</span></h3>
            <ul>
                <li><span class=\"highlight\">React</span> - It's giving flexible, reusable components, industry standard</li>
                <li><span class=\"highlight\">Vue</span> - It's giving beginner-friendly, elegant, and honestly just vibes</li>
                <li><span class=\"highlight\">Angular</span> - It's giving corporate, professional, whole enterprise energy</li>
            </ul>

            <div class=\"genz-slang\">
                <strong>Real Talk:</strong> You don't need to learn all of them. Pick one, get really good at vanilla JavaScript first, THEN explore frameworks. The haters will say \"learn frameworks first\" but they're wrong. Build your fundamentals—that's the tea.
            </div>
        </section>

        <section>
            <h2>Responsive Design: The ✨ Aesthetic Requirement ✨</h2>
            <p>Your website needs to look fire on a phone, tablet, AND desktop. This isn't optional anymore, bestie. Google literally ranks you worse if your site is ugly on mobile. That's not even a threat, that's a fact.</p>

            <h3>Mobile First Energy</h3>
            <p>Design for mobile first, THEN scale up. Use <span class=\"highlight\">media queries</span> to adjust your CSS based on screen size. Make sure your website is readable, clickable, and honestly just gorgeous on all devices.</p>

            <div class=\"code-block\">
@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }
  
  body {
    padding: 1rem;
  }
}
            </div>

            <p>That code literally just says \"when the screen is smaller than 768px, make these adjustments.\" Simple as that. Your users will be served and you'll have the audacity of a successful developer.</p>
        </section>

        <section>
            <h2>Some Real Tips to Slay <span class=\"emoji-box\">💪</span></h2>
            <ol>
                <li><span class=\"highlight\">Learn the fundamentals first</span> - No shortcuts. HTML, CSS, JavaScript vanilla. Build a solid foundation or you'll be lost later (trust me).</li>
                <li><span class=\"highlight\">Practice constantly</span> - Build projects. Real projects. Not tutorials. Tutorials are mid if you're not applying what you learned.</li>
                <li><span class=\"highlight\">Use version control (Git)</span> - This is non-negotiable. GitHub is literally free. No cap, if you don't use Git, your future employer will side-eye you HARD.</li>
                <li><span class=\"highlight\">Read documentation</span> - I know, I know. But honestly? Reading docs is a skill, and it goes crazy hard once you get good at it.</li>
                <li><span class=\"highlight\">Join communities</span> - Discord servers, Twitter, Reddit (the good subreddits), conferences. The web dev community is actually nice and helpful? It's giving supportive energy.</li>
                <li><span class=\"highlight\">Deploy your projects</span> - Netlify, Vercel, GitHub Pages. Put your stuff out there. Let people use it. Get feedback. That's the growth.</li>
            </ol>

            <div class=\"genz-slang\">
                <strong>The Ultimate Truth:</strong> Web development is a marathon, not a sprint. There's always more to learn, and that's honestly the part that makes it so fire. You'll never be bored, and you'll always have something to work towards.
            </div>
        </section>

        <section>
            <h2>The Ending (And the Beginning) <span class=\"emoji-box\">🚀</span></h2>
            <p>Web development isn't just a career path—it's literally a superpower. You get to build things that matter, solve problems for real people, and honestly? Get paid pretty well doing it. No cap, this field is bussin.</p>

            <p>So stop scrolling and start coding. Build something. Break it. Fix it. Ship it. That's the web dev energy. And when you deploy that first project? That's your main character moment right there.</p>

            <p><span class=\"highlight\">The code is always waiting for you.</span> Now go absolutely slay. 💅✨</p>
        </section>`
        },
        {
                "id": "3d-modeling-process-portfolio",
                "title": "3D Modeling for Beginners 2026: Sculpting Digital Art (No Cap)",
                "author": "Hameem Bhai",
                "date": "June 15, 2026",
                "readTime": "4 min read",
                "category": "3D Modeling",
                "keywords": [
                        "3D modeling",
                        "learn 3D modeling",
                        "Blender tutorial",
                        "digital sculpting",
                        "3D printing Dhaka",
                        "3D modeling for beginners"
                ],
                "summary": "Get into 3D modeling from zero. Master basic Blender tools, digital sculpting workflows, and prepare your models for 3D printing. No gatekeeping.",
                "content": `<div class="blog-post__banner">
    <h2>✨ 3D Modeling with Blender ✨</h2>
    <p class="tagline">Master digital sculpting and prepare your models for 3D printing. Let's cook! 🚀</p>
</div>
<section>
    <h2>bestie, 2D is cute but 3D is the main character era 🚀</h2>
    <p>Real talk — 3D modeling is one of the most slept-on creative skills in 2026. Whether you want to design video game assets, create product mockups, or sculpt custom 3D printed lighter cases like the ones at <span class=\"highlight\">Hameem Bhai er Dokan</span>, this skill is a full superpower. And the best part? It's literally free to start.</p>

    <div class=\"genz-slang\">
        <strong>Translation:</strong> \"No cap\" = no lie/for real | \"Bussin\" = extremely good | \"Slay\" = do excellently | \"Hitting different\" = feels special and unique
    </div>

    <p>You don't need a $3,000 workstation. A mid-range laptop and Blender (which is 100% free) is all you need to enter your 3D modeling era. Let's break down the beginner workflow fr fr.</p>
</section>

<section>
    <h2>the holy trinity of 3D tools 🛠️</h2>
    <p>Before we get into technique, let's talk tools. These are the three you actually need — no subscription fees, no gatekeeping.</p>

    <div class=\"principle-box\">
        <h4>Blender (FREE) — The GOAT</h4>
        <p>Industry-grade 3D modeling, sculpting, rendering, and animation. Completely free, open-source, and honestly better than tools that cost thousands. Download it, open a new file, and delete the default cube — it's a canon event for every 3D artist.</p>
    </div>

    <div class=\"principle-box\">
        <h4>Cura or PrusaSlicer (FREE) — For 3D Printing</h4>
        <p>Once your model is done, these slice it into layers your 3D printer can understand. They're free, powerful, and not scary at all once you learn the basics.</p>
    </div>

    <div class=\"principle-box\">
        <h4>Meshmixer (FREE) — For Cleanup</h4>
        <p>Fixes mesh errors, hollows out models, adds drain holes for resin printing. The cleanup bestie you didn't know you needed.</p>
    </div>
</section>

<section>
    <h2>step 1: blender basics — no cap it's not that scary 🎮</h2>
    <p>The biggest barrier to Blender is the interface. It looks unhinged at first. But once you know these core shortcuts? You'll be navigating like a pro.</p>

    <div class=\"code-block\">
// Blender Essential Shortcuts
Middle Mouse Button    → Rotate the 3D view
Shift + Middle Mouse   → Pan (move around)
Scroll Wheel           → Zoom in/out
Tab Key                → Switch Object ↔ Edit Mode
G / R / S              → Grab / Rotate / Scale
X, Y, Z after G/R/S   → Lock to axis (super clean!)
Ctrl + Z               → Undo (use this liberally fr)
    </div>

    <p>Spend 30 minutes just moving around the viewport. Don't model anything yet. Just get comfortable existing in 3D space. That comfort is the whole foundation.</p>

    <div class=\"genz-slang\">
        <strong>Mindset Check:</strong> Everyone's first Blender session feels chaotic. That's normal. It's not you being bad — it's the learning curve being real. Push through and it clicks fast.
    </div>
</section>

<section>
    <h2>step 2: modeling vs sculpting — pick your vibe 🎨</h2>
    <p>There are two main workflows in Blender. Understanding which to use when is the difference between working with the software and fighting against it.</p>

    <h3>Polygon Modeling — For Hard Surfaces</h3>
    <p>You edit vertices, edges, and faces to build precise geometry. This is perfect for <span class=\"highlight\">mechanical objects, phone cases, furniture, architecture</span> — anything with clean lines and defined shapes. Hameem Bhai uses this to model the base sleeve of custom lighter cases so they fit BIC lighters perfectly.</p>

    <h3>Digital Sculpting — For Organic Shapes</h3>
    <p>This is like virtual clay. You use brushes to push, pull, and smooth geometry. Perfect for <span class=\"highlight\">characters, creatures, faces, and detailed textures</span>. After the base lighter sleeve is modeled, sculpting adds the dragon scales, anime characters, or skull details on top.</p>

    <div class=\"genz-slang\">
        <strong>Hameem Bhai's Workflow:</strong> Model base → Sculpt details → Export → Print. This combination is what makes the 3D lighter cases at HBD Dokan actually absurd in quality. Chef's kiss workflow fr fr.
    </div>
</section>

<section>
    <h2>step 3: going from digital to physical 🏗️</h2>
    <p>This is where it gets crazy real. Turning your digital sculpture into an actual object you can hold? That hits different every single time, no cap.</p>

    <h3>Pre-Print Checklist</h3>
    <ul>
        <li><span class=\"highlight\">Watertight mesh</span> — No holes or gaps in your geometry. Use Blender's 3D Print Toolbox addon to check.</li>
        <li><span class=\"highlight\">No self-intersections</span> — Geometry clipping through itself will destroy your print</li>
        <li><span class=\"highlight\">Scale in millimeters</span> — Measure your object in Blender before export. A 5mm lighter is a problem.</li>
        <li><span class=\"highlight\">Export as STL or OBJ</span> — These are the standard formats for slicer software</li>
    </ul>

    <h3>Slicer Settings for Detail Work</h3>
    <div class=\"code-block\">
// Cura/PrusaSlicer Settings (Detail Prints)
Layer Height:    0.10mm-0.12mm (maximum detail)
Infill:          20% Gyroid (strong and light)
Walls:           3 perimeters (durability)
Supports:        Yes — Organic/Tree supports
Material:        PLA (easy) or PETG (flexible+durable)
    </div>

    <p>Load it into Cura, slice it, export the G-code, and send it to your printer. Then wait. Watch the first layer stick. And when it's done — peel it off the bed, and your 3D model is now a real physical object. Absolutely unhinged how cool that is. 🔥</p>
</section>`
        },
        {
                "id": "commissioning-creative-work",
                "title": "How to Collaborate with Creatives in 2026 (No Gatekeeping)",
                "author": "Hameem Bhai",
                "date": "June 14, 2026",
                "readTime": "3 min read",
                "category": "Guides",
                "keywords": [
                        "commission creative work",
                        "collaborate with designers",
                        "freelance design Dhaka",
                        "creative brief tutorial"
                ],
                "summary": "Stop getting ghosted by freelancers. Learn how to write a killer creative brief, set realistic budgets, and manage design feedback like a pro.",
                "content": `<div class="blog-post__banner">
    <h2>✨ Collaborating with Creatives ✨</h2>
    <p class="tagline">Write killer briefs, negotiate budgets, and get results that actually slap. No cap! 🤝</p>
</div>
<section>
    <h2>bestie, 'make it look cool' is NOT a creative brief 🤝</h2>
    <p>Most creative projects don't fail because the designer was bad. They fail because nobody explained what was actually needed. If you've ever hired someone and gotten back something totally off from what you imagined, you know what I'm talking about. This guide fixes that.</p>

    <div class=\"genz-slang\">
        <strong>Translation:</strong> \"Mid\" = mediocre | \"Spilling tea\" = sharing the truth | \"No cap\" = for real | \"Brief\" = the document describing your project goals
    </div>

    <p>Whether you're ordering a custom lighter case from Hameem Bhai er Dokan, getting a logo made, or building a website, the quality of the result depends almost entirely on how clearly you communicate. Here's the full playbook, no gatekeeping.</p>
</section>

<section>
    <h2>step 1: write a brief (yes, even a text message counts) 📝</h2>
    <p>A brief doesn't have to be a formal Google Doc. Even a well-organized WhatsApp message does the job. The point is to give your creative everything they need before they start, not during.</p>

    <h3>What a Good Brief Covers</h3>
    <ul>
        <li><span class=\"highlight\">The goal.</span> What is this for? A brand logo? An event poster? A gift for your friend?</li>
        <li><span class=\"highlight\">The vibe.</span> Send reference images, a Pinterest board, or just say \"clean and minimal\" vs \"bold and loud.\" Anything helps.</li>
        <li><span class=\"highlight\">The deliverables.</span> What file formats do you need? What size? How many variations?</li>
        <li><span class=\"highlight\">The deadline.</span> A real one. Not \"I need it in 2 hours fr fr.\"</li>
        <li><span class=\"highlight\">The budget.</span> Be upfront. It helps the creative tell you what's actually possible.</li>
    </ul>

    <div class=\"genz-slang\">
        <strong>The Tea:</strong> Writing a brief takes maybe 10 minutes. Not writing one costs you days of revisions and a result you don't even like. Do the math bestie.
    </div>
</section>

<section>
    <h2>step 2: show references, don't just describe vibes 🎯</h2>
    <p>Words are subjective. \"Clean and professional\" looks completely different to you than it does to the designer. References solve this immediately. Show, don't just tell.</p>

    <h3>Where to Find Good References</h3>
    <ul>
        <li><span class=\"highlight\">Pinterest</span> is your best friend here. Make a board, drop 5 to 10 designs you love, share the link.</li>
        <li><span class=\"highlight\">Instagram</span> works too. Screenshot work from creators whose style matches what you want.</li>
        <li><span class=\"highlight\">Behance and Dribbble</span> are where professional designers show their portfolios. Great for logo and brand inspiration.</li>
    </ul>

    <div class=\"principle-box\">
        <h4>How to Actually Use References</h4>
        <p>Don't say \"make it look exactly like this.\" That's plagiarism and creatives hate it. Instead, say \"I like the color palette in this one, the font weight in that one, and the spacing in this other one.\" Pull out specific things you love and let the creative build something original from there.</p>
    </div>
</section>

<section>
    <h2>step 3: talk money before work starts 💰</h2>
    <p>This is the conversation most people avoid and then regret skipping. Creatives need to pay rent too. Talking about budget upfront isn't awkward, it's professional.</p>

    <h3>What to Agree On Before Starting</h3>
    <ul>
        <li><span class=\"highlight\">Total price.</span> Get it in writing so nobody's surprised at the end.</li>
        <li><span class=\"highlight\">Deposit.</span> 50% upfront is standard and totally fair. It shows you're serious.</li>
        <li><span class=\"highlight\">Revision rounds.</span> Usually 2 or 3. \"Unlimited revisions\" is not a real service, it's a trap.</li>
        <li><span class=\"highlight\">Payment timeline.</span> Agree on when the final payment is due so nobody's chasing anyone.</li>
    </ul>

    <div class=\"genz-slang\">
        <strong>Real Talk:</strong> If your budget is genuinely tight, just say so. Most creatives will work with you on it if you're upfront. What kills the vibe is finding out after the work is done.
    </div>
</section>

<section>
    <h2>step 4: give feedback that's actually useful 🗣️</h2>
    <p>This is where most collabs fall apart. Vague feedback wastes everyone's time and leads to more rounds of revisions than anyone wanted.</p>

    <h3>Feedback That Works vs. Feedback That Doesn't</h3>
    <div class=\"principle-box\">
        <h4>✅ Say This</h4>
        <ul>
            <li>\"Can we make the text a bit darker? I want better contrast with the background.\"</li>
            <li>\"I like the colors but the font feels too stiff. Something rounder would fit the brand better.\"</li>
            <li>\"Everything looks great except the logo size. It gets lost on mobile screens.\"</li>
            <li>Collect all your notes first and send them in one message.</li>
        </ul>
    </div>

    <div class=\"principle-box\">
        <h4>❌ Not This</h4>
        <ul>
            <li>\"Make it pop more\" (this means nothing, be specific)</li>
            <li>\"I don't like it\" (okay but what specifically needs to change)</li>
            <li>\"Can you just redo the whole thing\" (that's a new project, not a revision)</li>
            <li>Sending feedback in 15 separate messages at 2am</li>
        </ul>
    </div>

    <p>Good feedback gets you to the final result faster. And when the creative actually understands what you want? The work comes out way better than you expected. That's the whole glow-up. ☕✨</p>

    <div class=\"genz-slang\">
        <strong>Hameem Bhai's Promise:</strong> Every project at Hameem Bhai er Dokan comes with clear timelines, honest communication, and proper revision rounds. Hit the contact page and let's build something together fr fr.
    </div>
</section>`
        }
];

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
    get blogPosts()      { return blogPosts; },
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
