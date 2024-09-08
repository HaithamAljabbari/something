import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import predictions from './predictions.json'; // Import the JSON file
import newsData from './news.json'; // Import the news JSON file
import { ImageBackground } from 'react-native';
import background from "./background3.jpg";

const TradingPage = () => {
    const [cryptoName, setCryptoName] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNews, setFilteredNews] = useState(newsData);

    useEffect(() => {
        // Filter news based on search query
        const filtered = newsData.filter(newsItem =>
            newsItem.headline.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredNews(filtered);
    }, [searchQuery]);

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

    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    return (
        <ImageBackground source={background} style={styles.container}>
            <View style={styles.box}>
                
                
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search News"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Text style={styles.newsTitle}>Latest Financial News</Text>
                <FlatList
                    data={filteredNews}
                    keyExtractor={(item) => item.id.toString()} // Ensure `id` is a unique identifier in your `news.json`
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleLinkPress(item.url)} style={styles.newsItem}>
                            <Image source={{ uri: item.image }} style={styles.newsImage} />
                            <Text style={styles.newsHeadline}>{item.headline}</Text>
                            <Text style={styles.newsSource}>{item.source}</Text>

                            <Text style={styles.newsDescription}>{item.summary}</Text>
                        </TouchableOpacity>
                    )}
                />
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
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: '#f0f',
        borderWidth: 3,
        marginBottom: 20,
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    searchInput: {
        width: '80%',
        padding: 10,
        borderColor: '#f0f',
        borderWidth: 3,
        marginBottom: 20,
        borderRadius: 5,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    prediction: {
        fontSize: 20,
        marginTop: 5,
        color: 'white',
    },
    newsTitle: {
        fontSize: 24,
        marginTop: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    newsItem: {
        backgroundColor: '#333',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '100%',
    },
    newsImage: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        marginBottom: 10,
    },
    newsHeadline: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    newsSource: {
        fontSize: 14,
        color: 'grey',
    },
    newsDate: {
        fontSize: 12,
        color: 'lightgrey',
    },
    newsDescription: {
        fontSize: 16,
        color: 'white',
    },
});

export default TradingPage;
