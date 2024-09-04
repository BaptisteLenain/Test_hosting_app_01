const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Items API. Use /api/items to access the items.');
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO items (name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const { rows } = await pool.query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM items WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});