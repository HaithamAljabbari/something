const express = require('express');
const KrakenClient = require('kraken-api');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

// Replace these with your actual API credentials
const API_KEY = 'WPWWL2gI6hHn0al7542M9OgxT9sgj1bVEwb+qvS+TyqU+0XQ6Bl6jbFZ';
const API_SECRET = 'oSSPRmJEYTZoR/yxxOHMoJk2d/K/NSAmiwG54zE8b0cEFV8UHs/QxqJZcQGcSSECRR1AoHX1vJfxVpV/n+0Luw==';

// Initialize Kraken API
const kraken = new KrakenClient(API_KEY, API_SECRET);

// Initialize Express
const app = express();
app.use(express.json());

// Load the trained model
async function loadModel() {
    return await tf.loadLayersModel('file://./model/model.json');
}

// Fetch historical data from Kraken
async function fetchHistoricalData(pair, interval) {
    try {
        const data = await kraken.api('OHLC', { pair, interval });
        return data.result[pair].map(entry => ({
            timestamp: entry[0] * 1000, // Convert seconds to milliseconds
            open: parseFloat(entry[1]),
            high: parseFloat(entry[2]),
            low: parseFloat(entry[3]),
            close: parseFloat(entry[4]),
            volume: parseFloat(entry[6]),
        }));
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return [];
    }
}

// Predict price using the model with a sequence of input data
async function predictPrice(model, historicalData, sequenceLength = 5) {
    const inputData = historicalData.slice(-sequenceLength).map(data => [
        data.close, 
        data.volume,
        data.open, 
        data.high, 
        data.low
    ]);

    const inputTensor = tf.tensor2d(inputData);
    const prediction = model.predict(inputTensor.expandDims(0)); // Add batch dimension
    return prediction.arraySync()[0][0];
}

// Place a market order
async function placeMarketOrder(pair, type, volume) {
    try {
        const order = await kraken.api('AddOrder', {
            pair,
            type,
            ordertype: 'market',
            volume
        });
        console.log('Order placed:', order);
        return order;
    } catch (error) {
        console.error('Error placing order:', error);
        return null;
    }
}

// Check if a coin is halal or haram (placeholder function)
function checkCoinStatus(coin) {
    // Implement your logic here based on Sharia-compliance guidelines
    const haramCoins = ['BTC', 'LTC']; // Example of haram coins
    if (haramCoins.includes(coin)) {
        return 'haram';
    } else {
        return 'halal';
    }
}

// Main trading logic endpoint
app.post('/trade', async (req, res) => {
    const { pair, volume } = req.body;
    const model = await loadModel();
    const historicalData = await fetchHistoricalData(pair, 1440); // 1 day in minutes

    if (historicalData.length === 0) {
        return res.status(400).json({ error: 'No historical data available.' });
    }

    const predictedPrice = await predictPrice(model, historicalData);
    const lastDataPoint = historicalData[historicalData.length - 1];

    console.log('Predicted Price:', predictedPrice);

    let order = null;
    if (predictedPrice > lastDataPoint.close) {
        console.log('Placing buy order...');
        order = await placeMarketOrder(pair, 'buy', volume); // Adjust amount as needed
    } else {
        console.log('No action needed.');
    }

    res.json({
        predictedPrice,
        lastPrice: lastDataPoint.close,
        order,
    });
});

// Coin status check endpoint
app.get('/coin-status/:coin', (req, res) => {
    const { coin } = req.params;
    const status = checkCoinStatus(coin.toUpperCase());
    res.json({ coin, status });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
