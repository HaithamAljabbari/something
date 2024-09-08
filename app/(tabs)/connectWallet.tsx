import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import predictions from './predictions.json'; // Import the JSON file
import { ImageBackground } from 'react-native';
import background from "./background3.jpg"
const TradingPage = () => {
    const [cryptoName, setCryptoName] = useState('');
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        // Set up an interval to refresh data every minute (if needed)
        const intervalId = setInterval(() => {
            updatePrediction(cryptoName);
        }, 60000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [cryptoName]); // Rerun effect if cryptoName changes

    const updatePrediction = (name) => {
        if (name) {
            // Find the prediction for the entered cryptocurrency name
            const cryptoPrediction = predictions.find(pred => pred.crypto_name.toLowerCase() === name.toLowerCase());
            if (cryptoPrediction) {
                setPrediction(cryptoPrediction.predicted_price);
            } else {
                setPrediction(null); // Reset prediction if crypto not found
            }
        }
    };

    return (
        <ImageBackground source={background} style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.title}>Crypto Price and Shariah Status Prediction<br/>          (Currenly under development)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Crypto Name"
                value={cryptoName}
                onChangeText={(text) => {
                    setCryptoName(text);
                    updatePrediction(text);
                }}
            />
            {prediction !== null ? (
                <Text style={styles.prediction}>Predicted Price for {cryptoName}: {prediction.toFixed(2)}</Text>
            ) : (
                <Text style={styles.prediction}>Enter a valid crypto name to see prediction</Text>
            )}
             </View>
        </ImageBackground>
       
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  box: {
      backgroundColor: 'black', // Black background color
      padding: 20, // Padding inside the box
      borderRadius: 15, // Rounded corners
      width: '40%',
      height: 500, // Width of the box (adjust as needed)
      alignItems: 'center', // Center content horizontally
      justifyContent: 'center', // Center content vertically
  },
  title: {
      fontSize: 24,
      marginBottom: 20,
      color: 'white', // Text color for better contrast
  },
  input: {
      width: '80%',
      padding: 10,
      borderColor: '#f0f',
      borderWidth: 3,
      marginBottom: 20,
      borderRadius: 5,
      textAlign: 'center',
      backgroundColor: 'white', // Background color of input for contrast
  },
  prediction: {
      fontSize: 20,
      marginTop: 5,
      color: 'white', // Text color for better contrast
  },
});

export default TradingPage;
