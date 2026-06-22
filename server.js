require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// ────────────────────────────────────────────────────────────
//  DATABASE READ/WRITE QUEUE LOGIC
// ────────────────────────────────────────────────────────────
let dbQueue = Promise.resolve();

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DB Read Error] Returning default schema:', err);
    return { categories: [], services: [], reviews: [], referralCodes: {}, users: [], orders: [] };
  }
}

async function writeDB(data) {
  let resolveWrite;
  const writePromise = new Promise((resolve) => { resolveWrite = resolve; });
  const previousQueue = dbQueue;
  dbQueue = writePromise;

  await previousQueue;
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB Write Error]:', err);
  } finally {
    resolveWrite();
  }
}

// ────────────────────────────────────────────────────────────
//  AUTHENTICATION MIDDLEWARE
// ────────────────────────────────────────────────────────────
async function authenticate(req, res, next) {
  const token = req.headers['authorization'] || req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing token.' });
  }

  const db = await readDB();
  const user = db.users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }

  req.user = user;
  next();
}

async function adminOnly(req, res, next) {
  await authenticate(req, res, () => {
    const ADMIN_EMAIL = 'basithameem@gmail.com';
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
    }
    next();
  });
}

// ────────────────────────────────────────────────────────────
//  API ROUTES
// ────────────────────────────────────────────────────────────

// 1. Auth Endpoints
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const db = await readDB();
  const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const token = 'tok_' + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  const newUser = {
    id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
    name,
    email,
    phone: phone || '',
    address: address || '',
    password, // Demo only — in production, use bcrypt hashing
    joinedAt: new Date().toISOString(),
    orderCount: 0,
    token
  };

  db.users.push(newUser);
  await writeDB(db);

  // Return user without password
  const { password: _, ...userSession } = newUser;
  res.status(201).json({ success: true, message: 'Registration successful!', user: userSession, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = await readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = 'tok_' + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  user.token = token;
  await writeDB(db);

  const { password: _, ...userSession } = user;
  res.json({ success: true, message: 'Login successful!', user: userSession, token });
});

app.post('/api/auth/logout', authenticate, async (req, res) => {
  const db = await readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.token = null;
    await writeDB(db);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const { password: _, token: __, ...userProfile } = req.user;
  res.json({ success: true, user: userProfile });
});

app.put('/api/auth/profile', authenticate, async (req, res) => {
  const { name, phone, address } = req.body;
  const db = await readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address !== undefined) user.address = address;

  await writeDB(db);
  const { password: _, token: __, ...userProfile } = user;
  res.json({ success: true, message: 'Profile updated successfully!', user: userProfile });
});

app.get('/api/public-data', async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const db = await readDB();
  res.json({
    services: db.services,
    categories: db.categories,
    reviews: db.reviews.filter(r => !r.hidden),
    referralCodes: db.referralCodes,
    recommendedIds: db.recommendedIds,
    blogPosts: db.blogPosts || [],
    content: db.content || {},
    availabilityStatus: db.availabilityStatus || 'available'
  });
});

// Site Content and Availability Endpoints
app.get('/api/content', async (req, res) => {
  const db = await readDB();
  res.json(db.content || {});
});

app.post('/api/content', adminOnly, async (req, res) => {
  const { section, data } = req.body;
  if (!section || !data) {
    return res.status(400).json({ success: false, message: 'Section and data are required.' });
  }

  const db = await readDB();
  if (!db.content) db.content = {};
  db.content[section] = { ...db.content[section], ...data };
  await writeDB(db);

  res.json({ success: true, message: `${section} content updated successfully!`, content: db.content });
});

app.post('/api/content/reset', adminOnly, async (req, res) => {
  const { section } = req.body;
  const db = await readDB();
  if (!db.content) db.content = {};
  
  if (section) {
    delete db.content[section];
  } else {
    db.content = {};
  }
  await writeDB(db);
  res.json({ success: true, message: 'Content reset successfully!', content: db.content });
});

app.get('/api/availability', async (req, res) => {
  const db = await readDB();
  res.json({ status: db.availabilityStatus || 'available' });
});

app.post('/api/availability', adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  const db = await readDB();
  db.availabilityStatus = status;
  await writeDB(db);

  res.json({ success: true, message: 'Availability status updated successfully!', status });
});


// 2. Services Endpoints
app.get('/api/services', async (req, res) => {
  const db = await readDB();
  res.json(db.services);
});

app.put('/api/services/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const db = await readDB();
  const serviceIndex = db.services.findIndex(s => s.id === id);
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  db.services[serviceIndex] = { ...db.services[serviceIndex], ...fields };
  await writeDB(db);
  res.json({ success: true, message: 'Service updated successfully!', service: db.services[serviceIndex] });
});

app.post('/api/services', adminOnly, async (req, res) => {
  const service = req.body;
  if (!service.id || !service.name || !service.categoryId) {
    return res.status(400).json({ success: false, message: 'Service ID, name, and categoryId are required.' });
  }

  const db = await readDB();
  const exists = db.services.some(s => s.id === service.id);
  if (exists) {
    return res.status(400).json({ success: false, message: 'Service with this ID already exists.' });
  }

  db.services.push(service);
  await writeDB(db);
  res.status(201).json({ success: true, message: 'Service added successfully!', service });
});

app.delete('/api/services/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const db = await readDB();
  const originalLength = db.services.length;
  db.services = db.services.filter(s => s.id !== id);

  if (db.services.length === originalLength) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  await writeDB(db);
  res.json({ success: true, message: 'Service deleted successfully!' });
});

// 3. Reviews Endpoints
app.get('/api/reviews', async (req, res) => {
  const db = await readDB();
  // Clients only load non-hidden reviews by default
  const showHidden = req.query.all === 'true';
  const filtered = showHidden ? db.reviews : db.reviews.filter(r => !r.hidden);
  res.json(filtered);
});

app.post('/api/reviews', async (req, res) => {
  const { serviceId, userName, rating, text, date } = req.body;
  if (!serviceId || !userName || !rating || !text) {
    return res.status(400).json({ success: false, message: 'Missing review fields.' });
  }

  const db = await readDB();
  const newReview = {
    id: 'r_' + Date.now() + Math.random().toString(36).substr(2, 4),
    serviceId,
    userName,
    rating: parseInt(rating, 10),
    text,
    date: date || new Date().toISOString().split('T')[0],
    hidden: false
  };

  db.reviews.push(newReview);
  await writeDB(db);
  res.status(201).json({ success: true, message: 'Review added successfully!', review: newReview });
});

app.put('/api/reviews/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const db = await readDB();
  const reviewIndex = db.reviews.findIndex(r => r.id === id);
  if (reviewIndex === -1) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  db.reviews[reviewIndex] = { ...db.reviews[reviewIndex], ...fields };
  await writeDB(db);
  res.json({ success: true, message: 'Review updated successfully!', review: db.reviews[reviewIndex] });
});

app.delete('/api/reviews/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const db = await readDB();
  const originalLength = db.reviews.length;
  db.reviews = db.reviews.filter(r => r.id !== id);

  if (db.reviews.length === originalLength) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  await writeDB(db);
  res.json({ success: true, message: 'Review deleted successfully!' });
});

// 4. Orders Endpoints
app.post('/api/orders', authenticate, async (req, res) => {
  const orderData = req.body;
  if (!orderData.orderId || !orderData.items || !orderData.total) {
    return res.status(400).json({ success: false, message: 'Missing order details.' });
  }

  const db = await readDB();
  
  // Format order
  const newOrder = {
    ...orderData,
    userId: req.user.id,
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };

  db.orders.push(newOrder);

  // Increment user order count
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.orderCount = (user.orderCount || 0) + 1;
  }

  await writeDB(db);
  res.status(201).json({ success: true, message: 'Order placed successfully!', order: newOrder });
});

app.get('/api/orders/my', authenticate, async (req, res) => {
  const db = await readDB();
  const myOrders = db.orders.filter(o => o.userId === req.user.id || o.email.toLowerCase() === req.user.email.toLowerCase());
  res.json(myOrders);
});

app.get('/api/orders', adminOnly, async (req, res) => {
  const db = await readDB();
  res.json(db.orders);
});

app.put('/api/orders/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const db = await readDB();
  const order = db.orders.find(o => o.orderId === id || o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (status) order.status = status;
  await writeDB(db);
  res.json({ success: true, message: 'Order status updated!', order });
});

// 5. Users List (Admin only)
app.get('/api/users', adminOnly, async (req, res) => {
  const db = await readDB();
  // Exclude tokens, keep passwords for admin dashboard visibility
  const usersSafe = db.users.map(({ token, ...user }) => user);
  res.json(usersSafe);
});

// 6. Referral Codes
app.get('/api/referrals', async (req, res) => {
  const db = await readDB();
  res.json(db.referralCodes);
});

app.post('/api/referrals', adminOnly, async (req, res) => {
  const { code, discount, description } = req.body;
  if (!code || discount === undefined || !description) {
    return res.status(400).json({ success: false, message: 'Code, discount, and description are required.' });
  }

  const db = await readDB();
  db.referralCodes[code.toUpperCase()] = { discount: parseFloat(discount), description };
  await writeDB(db);
  res.json({ success: true, message: 'Promo code added!', referralCodes: db.referralCodes });
});

app.delete('/api/referrals/:code', adminOnly, async (req, res) => {
  const { code } = req.params;
  const db = await readDB();
  const upperCode = code.toUpperCase();
  if (!db.referralCodes[upperCode]) {
    return res.status(404).json({ success: false, message: 'Promo code not found.' });
  }

  delete db.referralCodes[upperCode];
  await writeDB(db);
  res.json({ success: true, message: 'Promo code deleted!', referralCodes: db.referralCodes });
});

// 7. Database Import/Export (Admin only)
app.get('/api/admin/db/export', adminOnly, async (req, res) => {
  const db = await readDB();
  res.json(db);
});

app.post('/api/admin/db/import', adminOnly, async (req, res) => {
  const newDb = req.body;
  if (!newDb.services || !newDb.categories || !newDb.reviews || !newDb.referralCodes) {
    return res.status(400).json({ success: false, message: 'Invalid database schema.' });
  }

  await writeDB(newDb);
  res.json({ success: true, message: 'Database imported successfully!' });
});

app.post('/api/admin/services', adminOnly, async (req, res) => {
  const db = await readDB();
  db.services = req.body;
  await writeDB(db);
  res.json({ success: true, message: 'Services saved successfully!' });
});

app.post('/api/admin/reviews', adminOnly, async (req, res) => {
  const db = await readDB();
  db.reviews = req.body;
  await writeDB(db);
  res.json({ success: true, message: 'Reviews saved successfully!' });
});

app.post('/api/admin/recommended', adminOnly, async (req, res) => {
  const db = await readDB();
  db.recommendedIds = req.body;
  await writeDB(db);
  res.json({ success: true, message: 'Recommendations saved successfully!' });
});

app.post('/api/admin/referrals', adminOnly, async (req, res) => {
  const db = await readDB();
  db.referralCodes = req.body;
  await writeDB(db);
  res.json({ success: true, message: 'Referral codes saved successfully!' });
});

app.post('/api/admin/blog', adminOnly, async (req, res) => {
  const db = await readDB();
  db.blogPosts = req.body;
  await writeDB(db);
  res.json({ success: true, message: 'Blog posts saved successfully!' });
});

app.post('/api/admin/publish', adminOnly, async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // e.g., "Hameem-Bhai/Hameem_e-commerce_website"
    
    if (!token || !repo) {
      return res.status(400).json({ success: false, message: 'GitHub Auto-Publish is not configured. Missing GITHUB_TOKEN or GITHUB_REPO in server environment variables.' });
    }

    const dbContent = await fs.readFile(DB_FILE, 'utf8');
    const contentBase64 = Buffer.from(dbContent).toString('base64');
    const apiUrl = `https://api.github.com/repos/${repo}/contents/db.json`;
    
    let fileSha;
    try {
      const getRes = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'HameemBhai-Store'
        }
      });
      if (getRes.ok) {
        const getJson = await getRes.json();
        fileSha = getJson.sha;
      }
    } catch (e) {
      console.log('[Publish] Could not fetch existing db.json SHA:', e.message);
    }
    
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'HameemBhai-Store',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Admin Dashboard: Auto-Publish db.json updates',
        content: contentBase64,
        sha: fileSha
      })
    });
    
    const putJson = await putRes.json();
    if (!putRes.ok) {
      return res.status(400).json({ success: false, message: putJson.message || 'GitHub API error.' });
    }
    
    res.json({ success: true, message: 'Successfully published to GitHub!' });
  } catch (err) {
    console.error('[Publish Error]:', err);
    res.status(500).json({ success: false, message: 'Internal server error during publish: ' + err.message });
  }
});


// ────────────────────────────────────────────────────────────
//  STATIC FILES SERVING & ROUTE FALLBACKS
// ────────────────────────────────────────────────────────────
// Serve files in root directory
app.use(express.static(__dirname));

// Custom 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🚀 HameemBhai er Dokan Live API & Static Server!`);
  console.log(`👉 Open http://localhost:${PORT} in your browser.`);
  console.log(`============================================================\n`);
});
