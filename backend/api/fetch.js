const { pool } = require('../database/db');

const fetch = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports = {
    fetch,
};