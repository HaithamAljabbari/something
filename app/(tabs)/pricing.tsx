import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated } from 'react-native';
import background from './Untitled.jpg'; // Correct way to import image

const PricingPage = () => {
    // Create animated values for each box
    const scale1 = useState(new Animated.Value(1))[0];
    const scale2 = useState(new Animated.Value(1))[0];
    const scale3 = useState(new Animated.Value(1))[0];

    // Function to handle hover effect (scale up)
    const handleMouseEnter = (scaleValue) => {
        Animated.spring(scaleValue, {
            toValue: 1.05, // Slightly scale up
            useNativeDriver: true,
        }).start();
    };

    // Function to handle releasing hover effect (scale down)
    const handleMouseLeave = (scaleValue) => {
        Animated.spring(scaleValue, {
            toValue: 1, // Return to original size
            useNativeDriver: true,
        }).start();
    };

    return (
        <ImageBackground source={background} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    {/* Price Box 1 */}
                    <Animated.View
                        style={[styles.priceBox, { transform: [{ scale: scale1 }] }]}
                        onMouseEnter={() => handleMouseEnter(scale1)}
                        onMouseLeave={() => handleMouseLeave(scale1)}
                    >
                        <Text style={styles.priceTitle}>Basic Plan</Text>
                        <Text style={styles.price}>$10/month</Text>
                        <Text style={styles.description}>
                            Access to basic crypto analysis and buy/sell signals. Ideal for beginners.
                        </Text>
                    </Animated.View>

                    {/* Price Box 2 */}
                    <Animated.View
                        style={[styles.priceBox, { transform: [{ scale: scale2 }] }]}
                        onMouseEnter={() => handleMouseEnter(scale2)}
                        onMouseLeave={() => handleMouseLeave(scale2)}
                    >
                        <Text style={styles.priceTitle}>Pro Plan</Text>
                        <Text style={styles.price}>$30/month</Text>
                        <Text style={styles.description}>
                            Advanced market analysis and AI predictions, perfect for experienced traders.
                        </Text>
                    </Animated.View>

                    {/* Price Box 3 */}
                    <Animated.View
                        style={[styles.priceBox, { transform: [{ scale: scale3 }] }]}
                        onMouseEnter={() => handleMouseEnter(scale3)}
                        onMouseLeave={() => handleMouseLeave(scale3)}
                    >
                        <Text style={styles.priceTitle}>Premium Plan</Text>
                        <Text style={styles.price}>$50/month</Text>
                        <Text style={styles.description}>
                            Full access to AI tools, crypto news integration, and historical data for expert traders.
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        width: '90%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 30, // Increased padding for a more spacious look
        margin: 10,
        borderRadius: 15,
        alignItems: 'center',
        height: 450,
        width: 350,
        cursor: 'pointer', // Change cursor to pointer on hover
        shadowColor: '#000', // Add shadow for elevation
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android
    },
    priceTitle: {
        fontSize: 22, // Increased size for the title
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textTransform: 'uppercase', // Convert title to uppercase for emphasis
    },
    price: {
        fontSize: 28, // Larger font size for price
        fontWeight: 'bold',
        color: '#4CAF50', // Green color for the price
        marginBottom: 15,
    },
    description: {
        fontSize: 16, // Slightly larger description text
        textAlign: 'center',
        color: '#555',
        lineHeight: 22, // Added line height for better readability
    },
});

export default PricingPage;
