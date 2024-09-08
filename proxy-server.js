const express = require('express');
const axios = require('axios');
const app = express();
const port = 5500; // You can use any port number

const API_KEY = '1f416b1c-272b-43a6-8add-fcad48b68b31';
const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

app.get('/api/market-data', async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
