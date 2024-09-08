const axios = require('axios');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(tabs)/data.json'); // Adjust path if needed

// List of popular coin IDs
const coins = [
  'bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'binancecoin',
  'ripple', 'litecoin', 'chainlink', 'dogecoin', 'uniswap', 'bitcoin-cash',
  'stellar', 'tether', 'usd-coin', 'monero', 'tron', 'eos', 'neo', 'zcash',
  'dash', 'omg-network', 'cosmos', 'aave', 'maker', 'compound', 'yearn-finance',
  'filecoin', 'ravencoin', 'tezos', 'shiba-inu', 'harmony', 'fantom', 'algorand',
  'thorchain', 'waves', 'qtum', 'decred', 'celo', 'husd', 'thorchain', 'fantom',
  'huobi-token', 'sushi', 'elrond', 'celo', 'enjincoin', 'xrp', 'basic-attention-token'
];

// Mock function to get Shariah compliance data
function getShariahCompliance(coinId) {
    const shariahData = {
        bitcoin: { 
            status: 'halal', 
            explanation: 'Bitcoin is considered halal by many scholars, but it is advised to exercise caution due to its volatility and speculative nature.' 
        },
        ethereum: { 
            status: 'halal (with caution)', 
            explanation: 'Ethereum is generally considered halal, but its use in certain DeFi activities may raise concerns.' 
        },
        solana: { 
            status: 'issue of dispute', 
            explanation: 'Solana’s involvement in DeFi creates some debate about its compliance with Shariah.' 
        },
        cardano: { 
            status: 'halal', 
            explanation: 'Cardano’s research-based approach and emphasis on regulatory compliance is generally seen as halal.' 
        },
        polkadot: { 
            status: 'halal', 
            explanation: 'Polkadot is considered halal due to its focus on interoperability and lack of interest-based features.' 
        },
        binancecoin: { 
            status: 'issue of dispute', 
            explanation: 'Binance Coin is used on the Binance exchange, which has mixed views about its Shariah compliance.' 
        },
        ripple: { 
            status: 'halal (with caution)', 
            explanation: 'Ripple is permissible for use in cross-border transactions but must avoid speculative uses.' 
        },
        litecoin: { 
            status: 'halal', 
            explanation: 'Litecoin is considered halal due to its decentralized nature, similar to Bitcoin.' 
        },
        chainlink: { 
            status: 'issue of dispute', 
            explanation: 'Chainlink is used in many DeFi projects, leading to debates about its Shariah compliance.' 
        },
        dogecoin: { 
            status: 'issue of dispute', 
            explanation: 'Dogecoin’s speculative nature raises concerns about its Shariah compliance.' 
        },
        tether: { 
            status: 'disputed', 
            explanation: 'Concerns around Tether stem from interest-bearing reserves, but it may be permissible for short-term transactions.' 
        },
        'usd-coin': { 
            status: 'halal', 
            explanation: 'USD Coin is pegged to the dollar and seen as Shariah-compliant due to its transparency and lack of interest-bearing reserves.' 
        },
        monero: { 
            status: 'issue of dispute', 
            explanation: 'Monero’s privacy features make it a subject of dispute among scholars regarding its Shariah status.' 
        },
        tron: { 
            status: 'issue of dispute', 
            explanation: 'Tron’s association with gambling platforms raises concerns about its Shariah compliance.' 
        },
        eos: { 
            status: 'issue of dispute', 
            explanation: 'EOS’s decentralized app platform leads to mixed views on its Shariah compliance.' 
        },
        xrp: { 
            status: 'halal (with caution)', 
            explanation: 'Ripple’s centralized control and banking partnerships are concerning, but its use for efficient transactions is halal.' 
        },
        // Other coins follow the same pattern...
    };
    

    return shariahData[coinId] || { status: 'unknown', explanation: 'Shariah status is not determined for this coin.' };
}

async function fetchAndSaveData() {
    let response = null;
    try {
        response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: coins.join(','), // Join the coin IDs with commas
            }
        });
    } catch (ex) {
        console.log(ex);
        return;
    }

    if (response) {
        const enrichedData = response.data.map(coin => {
            const shariahInfo = getShariahCompliance(coin.id);
            return {
                ...coin,
                shariah_status: shariahInfo.status,
                shariah_explanation: shariahInfo.explanation,
            };
        });

        fs.writeFile(filePath, JSON.stringify(enrichedData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Data written to data.json');
            }
        });
    }
}

// Initial call
fetchAndSaveData();

// Update every minute
setInterval(fetchAndSaveData, 60000);
