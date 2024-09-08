const axios = require('axios');
const ccxt = require('ccxt');
const fs = require('fs');
const path = require('path');

// Configure the exchange
const exchange = new ccxt.binance();

// Hugging Face API Key (replace with your key)
const HF_API_KEY = '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';

// List of cryptocurrencies to check
const symbols = ['BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'LTC/USDT', 'ADA/USDT']; // Add more as needed

// Function to fetch historical data and halal/haram status
async function fetchDataAndCompliance(symbol, timeframe, since, limit) {
    try {
        const data = await exchange.fetchOHLCV(symbol, timeframe, since, limit);

        // Perform halal/haram analysis using Hugging Face Inference API
        const complianceInfo = await checkCoinCompliance(symbol.split('/')[0]);

        return data.map(entry => ({
            timestamp: entry[0],
            open: entry[1],
            high: entry[2],
            low: entry[3],
            close: entry[4],
            volume: entry[5],
            compliance: complianceInfo.status, // Store compliance status
            description: complianceInfo.description, // Store description
            halal: complianceInfo.status === 'halal' ? 1 : 0 // Binary label for model training
        }));
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return [];
    }
}

// Function to check coin compliance using Hugging Face Inference API
async function checkCoinCompliance(symbol) {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/gpt2',
            { inputs: `Is ${symbol} cryptocurrency halal or haram? Explain.` },
            {
                headers: { Authorization: `Bearer ${HF_API_KEY}` }
            }
        );

        const resultText = response.data[0].generated_text;
        let status = 'unknown';
        if (resultText.toLowerCase().includes('haram')) {
            status = 'haram';
        } else if (resultText.toLowerCase().includes('halal')) {
            status = 'halal';
        }

        return {
            status: status,
            description: resultText
        };
    } catch (error) {
        console.error(`Error calling Hugging Face Inference API for ${symbol}:`, error);
        return {
            status: 'error',
            description: 'Could not determine compliance due to an error.'
        };
    }
}

// Function to save data to CSV
function saveDataToCSV(symbol, data) {
    const header = 'timestamp,open,high,low,close,volume,compliance,description,halal\n';
    const rows = data.map(row =>
        `${row.timestamp},${row.open},${row.high},${row.low},${row.close},${row.volume},${row.compliance},${row.description},${row.halal}`
    ).join('\n');

    const filePath = path.join(__dirname, `${symbol.replace('/', '_')}_market_data.csv`);
    fs.writeFileSync(filePath, header + rows);
    console.log(`Data saved to ${filePath}`);
}

// Main function to fetch data for multiple symbols
(async () => {
    const timeframe = '1d'; // Time interval (e.g., '1m', '1h', '1d')
    const since = exchange.parse8601('2023-01-01T00:00:00Z'); // Start date
    const limit = 1000; // Number of data points to fetch

    for (const symbol of symbols) {
        const marketData = await fetchDataAndCompliance(symbol, timeframe, since, limit);

        if (marketData.length > 0) {
            saveDataToCSV(symbol, marketData);
        }
    }
})();
