// server.js

import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs'; // If using ES module
import dayjs from 'dayjs';

const app = express();
app.use(cors());
app.use(express.json());

// 📦 MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestionstocks',
});

// 🔌 Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// 📥 Register Route
app.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, company } = req.body;
  const role = "user";

  // Validate required fields
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All fields except company are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, company, role) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [first_name, last_name, email, hashedPassword, company, role], (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ 
          error: 'Registration failed',
          details: err.message,
          sqlError: err.sqlMessage 
        });
      }
      res.json({ message: 'User registered successfully', userId: result.insertId });
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});


// 🔐 Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send('Server error during login');
    if (results.length === 0) return res.status(404).send('User not found');

    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(400).send('Incorrect password');

    res.send({
      message: '✅ Login successful',
      user: {
        id: results[0].id,
        name: results[0].name,
        email: results[0].email,
        role: results[0].role,

      },
    });
  });
});

// 🔁 Reset Password (simple version)
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  const sql = 'UPDATE users SET password = ? WHERE email = ?';

  db.query(sql, [hashed, email], (err, result) => {
    if (err) return res.status(500).send('Error updating password');
    if (result.affectedRows === 0) return res.status(404).send('Email not found');
    res.send('✅ Password updated successfully');
  });
});



// 🚀 Get All Users API (GET)
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(results); // Return users
  });
});
// 🚀 Add User API (POST)
app.post('/users', async (req, res) => {
  const { first_name, last_name, email, password, company, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'All fields except company and role are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, company, role) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [first_name, last_name, email, hashedPassword, company, role], (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({
          error: 'User creation failed',
          details: err.message,
          sqlError: err.sqlMessage
        });
      }
      res.json({ message: 'User created successfully', userId: result.insertId });
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// 🚀 Update User API (PUT)
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, company, role } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  try {
    let sql = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, company = ?, role = ? WHERE id = ?';

    const values = [first_name, last_name, email, company, role, id];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, company = ?, role = ? WHERE id = ?';
      values.splice(3, 0, hashedPassword); // Insert hashed password at the correct index
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('MySQL Error:', err);
        return res.status(500).json({ error: 'Error updating user' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// 🚀 Delete User API (DELETE)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error deleting user');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.json({ message: 'User deleted successfully' });
  });
});
// 🚀 Get All Categories API
app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching categories');
    }
    res.json(results); // Return categories
  });
});
// 🚀 add  Categories API

app.post('/categories', (req, res) => {
  const { id, name, image, subcategories } = req.body;
  const sql = 'INSERT INTO categories (id, name, image, subcategories) VALUES (?, ?, ?, ?)';

  db.query(sql, [id, name, image, JSON.stringify(subcategories)], (err, result) => {
    if (err) {
      console.error('Error creating category:', err);
      return res.status(500).send('Error creating category');
    }
    res.status(201).send('Category created successfully');
  });
});
// 🚀 update  Categories API

app.put('/categories/:id', (req, res) => {
  const { name, image, subcategories } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE categories SET name = ?, image = ?, subcategories = ? WHERE id = ?';

  db.query(sql, [name, image, JSON.stringify(subcategories), id], (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).send('Error updating category');
    }
    res.send('Category updated successfully');
  });
});
// delete categories
app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).send('Error deleting category');
    }
    res.send('Category deleted successfully');
  });
});

// 🚀 Get All Products API
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching products');
    }
    res.json(results); // Return products
  });
});

// add products 
app.post('/products', (req, res) => {
  const { name, price, category, subcategory, description, images, sizes, colors, rating, reviews, in_stock, is_new, is_sale, discount } = req.body;
  
  const sql = `
    INSERT INTO products 
    (name, price, category, subcategory, description, images, sizes, colors, rating, reviews, in_stock, is_new, is_sale, discount) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    name, price, category, subcategory, description,
    JSON.stringify(images), JSON.stringify(sizes), JSON.stringify(colors),
    rating, reviews, in_stock, is_new, is_sale, discount
  ], (err, result) => {
    if (err) {
      console.error('Error creating product:', err);
      return res.status(500).send('Error creating product');
    }
    res.status(201).send('Product created successfully');
  });
});
// update products 
app.put('/products/:id', (req, res) => {
  const { name, price, category, subcategory, description, images, sizes, colors, rating, reviews, in_stock, is_new, is_sale, discount } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE products SET 
      name = ?, price = ?, category = ?, subcategory = ?, description = ?, 
      images = ?, sizes = ?, colors = ?, rating = ?, reviews = ?, 
      in_stock = ?, is_new = ?, is_sale = ?, discount = ? 
    WHERE id = ?
  `;

  db.query(sql, [
    name, price, category, subcategory, description,
    JSON.stringify(images), JSON.stringify(sizes), JSON.stringify(colors),
    rating, reviews, in_stock, is_new, is_sale, discount, id
  ], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }
    res.send('Product updated successfully');
  });
});
//delete products
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).send('Error deleting product');
    }
    res.send('Product deleted successfully');
  });
});

// 🚀 Get Products by Category API
app.get('/products/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = 'SELECT * FROM products WHERE category_id = ?';

  db.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching products by category');
    }
    res.json(results); // Return products for this category
  });
});
// ✅ Get product by ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE id = ?';

  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching product');
    }

    if (result.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.json(result[0]);
  });
});


app.post('/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  // Log incoming data
  console.log('Received data:', { userId, productId, quantity });

  // Check if data is valid
  if (!userId || !productId || !quantity) {
    console.error('Invalid input data');
    return res.status(400).send('Missing userId, productId, or quantity');
  }

  // Check if the product already exists in the cart for the user
  const checkSql = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
  
  db.query(checkSql, [userId, productId], (err, results) => {
    if (err) {
      console.error('MySQL Error during check:', err);
      return res.status(500).send('Error checking cart');
    }
    
    if (results.length > 0) {
      // If the product is already in the cart, update the quantity
      const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
      db.query(updateSql, [quantity, userId, productId], (err, result) => {
        if (err) {
          console.error('MySQL Error on update:', err);
          return res.status(500).send('Error updating cart');
        }
        res.json({ message: 'Product quantity updated in cart' });
      });
    } else {
      // If the product is not in the cart, insert a new entry
      const insertSql = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)';
      db.query(insertSql, [userId, productId, quantity], (err, result) => {
        if (err) {
          console.error('MySQL Error on insert:', err);
          return res.status(500).send('Error adding product to cart');
        }
        res.json({ message: 'Product added to cart' });
      });
    }
  });
});


// 🚀 Get Cart Items for a User
app.get('/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT p.*, c.quantity
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching cart items');
    }
    res.json(results); // Return cart items
  });
});
// 🚀 Get Wishlist Items for a User
app.get('/wishlist/:userId', (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT p.*
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching wishlist items');
    }
    res.json(results); // Return wishlist items
  });
});


// 🚀 Get All orders API
app.get('/orders', (req, res) => {
  const sql = 'SELECT * FROM orders';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results); // Return orders
  });
});

app.get('/orders/user/:id', (req, res) => {
  const userId = req.params.id;

  const sql = 'SELECT * FROM orders WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results);
  });
});


// 🚀 Add Order API
app.post('/orders', (req, res) => {
  const {
    userId,
    orderNumber,
    totalAmount,
    shippingAddress,
    city,
    state,
    zipCode,
    country,
    phone,
    email,
    status,
    items // Array of products from cart
  } = req.body;

  if (!userId || !orderNumber || !totalAmount || !shippingAddress || !city || !state || !zipCode || !country || !phone || !email || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertOrderSql = `
    INSERT INTO orders (
      user_id,
      order_number,
      total_amount,
      shipping_address,
      city,
      state,
      zip_code,
      country,
      phone,
      email,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userId,
    orderNumber,
    totalAmount,
    shippingAddress,
    city,
    state,
    zipCode,
    country,
    phone,
    email,
    status || 'Pending'
  ];

  db.query(insertOrderSql, values, (err, result) => {
    if (err) {
      console.error('❌ MySQL error while inserting order:', err);
      return res.status(500).send('Error while creating the order');
    }

    const orderId = result.insertId;

    // Insert items into order_items table
    const orderItemsSql = `
      INSERT INTO order_items (order_id, product_id, quantity, total_price)
      VALUES ?
    `;

    const orderItemsValues = items.map(item => [orderId, item.id, item.quantity, item.price]);

    db.query(orderItemsSql, [orderItemsValues], (err2) => {
      if (err2) {
        console.error('❌ Error inserting order items:', err2);
        return res.status(500).send('Error inserting order items');
      }

      // Update product stock
      const updateStockSql = `
        UPDATE products
        SET in_stock = in_stock - ?
        WHERE id = ? AND in_stock >= ?
      `;

      const stockUpdates = items.map(item => {
        return new Promise((resolve, reject) => {
          db.query(updateStockSql, [item.quantity, item.id, item.quantity], (err3) => {
            if (err3) {
              return reject(err3);
            }
            resolve();
          });
        });
      });

      Promise.all(stockUpdates)
        .then(() => {
          res.json({ message: '✅ Order created with items and stock updated', orderId });
        })
        .catch(err4 => {
          console.error('❌ Error updating product stock:', err4);
          res.status(500).send('Error updating product stock');
        });
    });
  });
});


// 🚀 Update Order Status API
app.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send("Status is required");
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';

  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error updating order status');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Order not found");
    }

    res.send("Order status updated successfully");
  });
});
// 🚀 Delete Order API
app.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  const sql = 'DELETE FROM orders WHERE id = ?';

  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error deleting order');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Order not found');
    }

    res.send('Order deleted successfully');
  });
});


// POST /orders
// POST /orders
app.post("/ordersboutique", async (req, res) => {
  const {
    orderId,
    employe_id,
    customerInfo,
    paymentMethod,
    amountPaid,
    total,
    change,
    cart
  } = req.body;

  // Start a transaction (MySQL does not use `client.query` like PostgreSQL)
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction Start Error:', err);
      return res.status(500).json({ error: 'Transaction start failed' });
    }

    // Insert the order into the orders table
    const orderSql = `
      INSERT INTO ordersboutique (
        order_id, employe_id, customer_name, customer_phone, 
        payment_method, amount_paid, total_amount, change_given
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(orderSql, [
      orderId,
      employe_id,
      customerInfo.name,
      customerInfo.phone,
      paymentMethod,
      amountPaid,
      total,
      change
    ], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('Order Insertion Error:', err);
          res.status(500).json({ error: 'Failed to insert order' });
        });
      }

      // Insert each item in the cart into the order_items table
      const orderItemsSql = `
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      const itemQueries = cart.map(item => {
        return new Promise((resolve, reject) => {
          // Insert into order_items
          db.query(orderItemsSql, [
            orderId,
            item.id,
            item.name,
            item.quantity,
            item.price,
            item.price * item.quantity
          ], (err) => {
            if (err) {
              return reject(err);
            }
      
            // Decrease product quantity
            const updateProductQtySql = `
              UPDATE products 
              SET in_stock = in_stock - ? 
              WHERE id = ? AND in_stock >= ?
            `;
            db.query(updateProductQtySql, [item.quantity, item.id, item.quantity], (err) => {
              if (err) {
                return reject(err);
              }
              resolve();
            });
          });
        });
      });
      

      // Wait for all cart items to be inserted
      Promise.all(itemQueries)
        .then(() => {
          // Commit the transaction after all items are inserted
          db.commit((err) => {
            if (err) {
              console.error('Commit Error:', err);
              return db.rollback(() => {
                res.status(500).json({ error: 'Transaction commit failed' });
              });
            }

            res.status(201).json({ message: "Order saved successfully" });
          });
        })
        .catch((err) => {
          // Rollback transaction in case of error during item insertion
          console.error('Cart Item Insertion Error:', err);
          db.rollback(() => {
            res.status(500).json({ error: 'Failed to insert cart items' });
          });
        });
    });
  });
});
// 🚀 Get All boutique orders API
app.get('/ordersboutique', (req, res) => {
  const sql = 'SELECT * FROM ordersboutique';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('MySQL Error:', err);
      return res.status(500).send('Error fetching orders');
    }
    res.json(results); // Return orders
  });
});
const formatMonth = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};



// Metrics endpoint with dynamic period filtering
app.get('/metrics', async (req, res) => {
  try {
    const period = req.query.period || 'monthly';

    // Determine date ranges based on the selected period
    const now = dayjs();
    let currentStart, previousStart, previousEnd;

    switch (period) {
      case 'daily':
        currentStart = now.subtract(1, 'day').startOf('day');
        previousStart = now.subtract(2, 'day').startOf('day');
        previousEnd = now.subtract(1, 'day').startOf('day');
        break;
      case 'weekly':
        currentStart = now.subtract(1, 'week').startOf('week');
        previousStart = now.subtract(2, 'week').startOf('week');
        previousEnd = now.subtract(1, 'week').startOf('week');
        break;
      case 'monthly':
        currentStart = now.subtract(1, 'month').startOf('month');
        previousStart = now.subtract(2, 'month').startOf('month');
        previousEnd = now.subtract(1, 'month').startOf('month');
        break;
      case 'yearly':
        currentStart = now.subtract(1, 'year').startOf('year');
        previousStart = now.subtract(2, 'year').startOf('year');
        previousEnd = now.subtract(1, 'year').startOf('year');
        break;
      default:
        return res.status(400).json({ error: 'Invalid period' });
    }

    const currentStartStr = currentStart.format('YYYY-MM-DD');
    const previousStartStr = previousStart.format('YYYY-MM-DD');
    const previousEndStr = previousEnd.format('YYYY-MM-DD');

    // Queries for current period
    const currentSalesQuery = `
      SELECT SUM(total_amount) as value 
      FROM (
        SELECT total_amount FROM orders WHERE created_at >= ?
        UNION ALL
        SELECT total_amount FROM ordersboutique WHERE date >= ?
      ) as combined
    `;

    const currentOrdersQuery = `
      SELECT COUNT(*) as value 
      FROM (
        SELECT id FROM orders WHERE created_at >= ?
        UNION ALL
        SELECT id FROM ordersboutique WHERE date >= ?
      ) as combined
    `;

    const currentAvgOrderQuery = `
      SELECT AVG(total_amount) as value 
      FROM (
        SELECT total_amount FROM orders WHERE created_at >= ?
        UNION ALL
        SELECT total_amount FROM ordersboutique WHERE date >= ?
      ) as combined
    `;

    // Queries for previous period
    const previousSalesQuery = `
      SELECT SUM(total_amount) as value 
      FROM (
        SELECT total_amount FROM orders WHERE created_at >= ? AND created_at < ?
        UNION ALL
        SELECT total_amount FROM ordersboutique WHERE date >= ? AND date < ?
      ) as combined
    `;

    const previousOrdersQuery = `
      SELECT COUNT(*) as value 
      FROM (
        SELECT id FROM orders WHERE created_at >= ? AND created_at < ?
        UNION ALL
        SELECT id FROM ordersboutique WHERE date >= ? AND date < ?
      ) as combined
    `;

    const previousAvgOrderQuery = `
      SELECT AVG(total_amount) as value 
      FROM (
        SELECT total_amount FROM orders WHERE created_at >= ? AND created_at < ?
        UNION ALL
        SELECT total_amount FROM ordersboutique WHERE date >= ? AND date < ?
      ) as combined
    `;

    // Fetch current period data
    const [currentSales, currentOrders, currentAvgOrder] = await Promise.all([
      dbQuery(currentSalesQuery, [currentStartStr, currentStartStr]),
      dbQuery(currentOrdersQuery, [currentStartStr, currentStartStr]),
      dbQuery(currentAvgOrderQuery, [currentStartStr, currentStartStr]),
    ]);

    // Fetch previous period data
    const [previousSales, previousOrders, previousAvgOrder] = await Promise.all([
      dbQuery(previousSalesQuery, [previousStartStr, previousEndStr, previousStartStr, previousEndStr]),
      dbQuery(previousOrdersQuery, [previousStartStr, previousEndStr, previousStartStr, previousEndStr]),
      dbQuery(previousAvgOrderQuery, [previousStartStr, previousEndStr, previousStartStr, previousEndStr]),
    ]);

    // Fetch total customers (not time-based)
    const totalCustomersQuery = 'SELECT COUNT(*) as value FROM users';
    const totalCustomers = await dbQuery(totalCustomersQuery, []);

    // Helper function to calculate percentage change
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return "+0%";
      const change = ((current - previous) / previous) * 100;
      return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    const metrics = [
      {
        id: 1,
        title: "Total Sales",
        value: `$${currentSales.toFixed(2)}`,
        change: calculateChange(currentSales, previousSales),
        period: "vs. previous period",
      },
      {
        id: 2,
        title: "Orders",
        value: currentOrders,
        change: calculateChange(currentOrders, previousOrders),
        period: "vs. previous period",
      },
      {
        id: 3,
        title: "Customers",
        value: totalCustomers,
        change: "+0%", // Not time-based
        period: "total count",
      },
      {
        id: 4,
        title: "Avg. Order Value",
        value: `$${currentAvgOrder.toFixed(2)}`,
        change: calculateChange(currentAvgOrder, previousAvgOrder),
        period: "vs. previous period",
      },
    ];


res.json({
  metrics,
 
});  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).send("Error fetching metrics");
  }
});

// Helper function to promisify db.query
function dbQuery(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results[0]?.value || 0);
    });
  });
}
// Helper to get MySQL DATE_FORMAT string based on period
function getDateFormat(period) {
  switch (period) {
    case "daily":
      return "%Y-%m-%d";
    case "weekly":
      return "%x-W%v"; // ISO week format
    case "monthly":
      return "%Y-%m";
    case "yearly":
      return "%Y";
    default:
      return "%Y-%m";
  }
}

// Generic function to get aggregated data
function getAggregatedData({ table, dateField, aggregateField, aggregateFunction, period, res }) {
  const dateFormat = getDateFormat(period);

  const sql = `
    SELECT 
      DATE_FORMAT(${dateField}, ?) AS period,
      ${aggregateFunction}(${aggregateField}) AS value
    FROM ${table}
    GROUP BY period
    ORDER BY period;
  `;

  db.query(sql, [dateFormat], (err, results) => {
    if (err) {
      console.error(`MySQL Error (${table}):`, err);
      return res.status(500).json({ error: `Error fetching data from ${table}` });
    }

    res.json(results);
  });
}

// GET: Sales Data
app.get("/sales", (req, res) => {
  const period = req.query.period || "monthly";
  getAggregatedData({
    table: "ordersboutique",
    dateField: "date",
    aggregateField: "total_amount",
    aggregateFunction: "SUM",
    period,
    res,
  });
});

// GET: Orders Count Data
app.get("/orders/count", (req, res) => {
  const period = req.query.period || "monthly";
  getAggregatedData({
    table: "orders",
    dateField: "created_at",
    aggregateField: "*",
    aggregateFunction: "COUNT",
    period,
    res,
  });
});

// 🚀 Start server
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
