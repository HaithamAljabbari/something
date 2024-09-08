import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated, PanResponder, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import data from './data.json'; // Path to your coin data
import signalsData from './signals.json'; // Path to your signals data

const { width } = Dimensions.get('window');

// Convert signals object into a simpler lookup object
const signals = signalsData.signals;

export default function WalletMDashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: animatedValue.x, dy: animatedValue.y }], {
          useNativeDriver: false,
        })(e, gestureState);
      },
      onPanResponderRelease: () => {
        Animated.spring(animatedValue, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const interpolateX = animatedValue.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const interpolateY = animatedValue.y.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['10deg', '0deg', '-10deg'],
  });

  const transformStyle = {
    transform: [
      { perspective: 1000 },
      { rotateX: interpolateY },
      { rotateY: interpolateX },
    ],
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        setTimeout(() => {
          setCoins(data); // Assuming data is an array of coin objects
          setLoading(false);
        }, 1000); // Simulate a delay
      };
      fetchData();
    } catch (ex) {
      console.log(ex);
      setError('Failed to load data');
      setLoading(false);
    }
  }, []);

  const getSignalForCoin = (symbol) => {
    const signal = signals[symbol.toLowerCase()];
    return signal || 'No signal available';
  };

  const getSignalStyle = (signal) => {
    if (signal.startsWith('Buy')) {
      return styles.buySignal;
    } else if (signal.startsWith('Sell')) {
      return styles.sellSignal;
    } else {
      return styles.holdSignal;
    }
  };

  const getSignalHeaderStyle = (signal) => {
    if (signal.startsWith('Buy')) {
      return styles.buySignalHeader;
    } else if (signal.startsWith('Sell')) {
      return styles.sellSignalHeader;
    } else {
      return styles.holdSignalHeader;
    }
  };

  // New function to get Shariah compliance styles and text
  const getShariahCompliance = (coin) => {
    const complianceStatus = coin.shariah_status; // Changed to match the data field
    const complianceExplanation = coin.shariah_explanation; // Added to get explanation
    
    switch (complianceStatus) {
      case 'halal':
        return { text: `Halal: ${complianceExplanation}`, style: styles.halal };
      case 'haram':
        return { text: `Haram: ${complianceExplanation}`, style: styles.haram };
      case 'disputed':
        return { text: `Disputed: ${complianceExplanation}`, style: styles.disputed };
      default:
        return { text: `Disputed: ${complianceExplanation}`, style: styles.disputed };
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.walletCollection, transformStyle]} {...panResponder.panHandlers}>
        {coins.map(coin => {
          const signal = getSignalForCoin(coin.symbol);
          const signalStyle = getSignalStyle(signal);
          const signalHeaderStyle = getSignalHeaderStyle(signal);
          const signalType = signal.startsWith('Buy') ? 'Buy' : signal.startsWith('Sell') ? 'Sell' : 'Hold';

          const { text: shariahText, style: shariahStyle } = getShariahCompliance(coin);

          return (
            <View key={coin.id} style={styles.wallet}>
              <Image source={{ uri: coin.image }} style={styles.coinImage} />
              <Text style={styles.crypto}>{coin.name} ({coin.symbol}): {' '}
                <Text style={styles.cryptoPrice}>${coin.current_price.toFixed(2)}</Text>
              </Text>
              <Text style={[styles.signalHeader, signalHeaderStyle]}>{signalType} Signal</Text>
              <Text style={[styles.signal, signalStyle]}>{signal}</Text>
              <Text style={shariahStyle}>Shariah Compliance: {shariahText}</Text>
              <Text style={styles.coinDetails}>Market Cap: ${coin.market_cap.toLocaleString()}</Text>
              <Text style={styles.coinDetails}>Fully Diluted Valuation: ${coin.fully_diluted_valuation.toLocaleString()}</Text>
              <Text style={styles.coinDetails}>24h Volume: ${coin.total_volume.toLocaleString()}</Text>
              <Text style={styles.coinDetails}>High 24h: ${coin.high_24h.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>Low 24h: ${coin.low_24h.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>Price Change 24h: ${coin.price_change_24h.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>Price Change % 24h: {coin.price_change_percentage_24h.toFixed(2)}%</Text>
              <Text style={styles.coinDetails}>Market Cap Change 24h: ${coin.market_cap_change_24h.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>Market Cap Change % 24h: {coin.market_cap_change_percentage_24h.toFixed(2)}%</Text>
              <Text style={styles.coinDetails}>Circulating Supply: {coin.circulating_supply.toLocaleString()}</Text>
              <Text style={styles.coinDetails}>Total Supply: {coin.total_supply.toLocaleString()}</Text>
              <Text style={styles.coinDetails}>Max Supply: {coin.max_supply ? coin.max_supply.toLocaleString() : 'N/A'}</Text>
              <Text style={styles.coinDetails}>ATH: ${coin.ath.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>ATH Change %: {coin.ath_change_percentage.toFixed(2)}%</Text>
              <Text style={styles.coinDetails}>ATL: ${coin.atl.toFixed(2)}</Text>
              <Text style={styles.coinDetails}>ATL Change %: {coin.atl_change_percentage.toFixed(2)}%</Text>
              <Text style={styles.coinDetails}>Last Updated: {new Date(coin.last_updated).toLocaleString()}</Text>
            </View>
          );
        })}
        <TouchableOpacity style={styles.gallery}><Text style={styles.galleryText}>Gallery</Text></TouchableOpacity>
      </Animated.View>
      <Text style={styles.total}>Total Price</Text>
      <LineChart
        data={{
          labels: ['1', '10', '100', '1000', '10000'],
          datasets: [
            {
              data: coins.map(coin => coin.current_price), // Example data; use aggregate or real data
              strokeWidth: 3,
            },
          ],
        }}
        width={width - 32}
        height={400}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          decimalPlaces: 2,
          color: (opacity = 1) => `purple`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  total: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  error: {
    flex: 1,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 20,
  },
  walletCollection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  wallet: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
  },
  coinImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  crypto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cryptoPrice: {
    fontSize: 16,
  },
  signalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  signal: {
    fontSize: 16,
    marginBottom: 10,
  },
  buySignal: {
    color: '#0f0',
  },
  sellSignal: {
    color: '#f00',
  },
  holdSignal: {
    color: '#ff0',
  },
  buySignalHeader: {
    color: '#0f0',
  },
  sellSignalHeader: {
    color: '#f00',
  },
  holdSignalHeader: {
    color: '#ff0',
  },
  halal: {
    color: '#0f0',
  },
  haram: {
    color: '#f00',
  },
  disputed: {
    color: '#ff0',
  },
  unknown: {
    color: '#808080',
  },
  gallery: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  galleryText: {
    color: '#fff',
    textAlign: 'center',
  },
  coinDetails: {
    color: '#ccc',
    marginVertical: 4,
  },
});
