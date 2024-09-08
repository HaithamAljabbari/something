import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Text, View, ImageBackground, ScrollView, Animated, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import background1 from "./bg8-dark.jpg";
import logo from "./logo4.png";
import ParticleAnimation from '@/components/ParticleAnimation';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MetaMaskConnection from './connectWallet';
import { MetaMaskProvider } from '@metamask/sdk-react';

// Images for financial harams
import haram1 from "./haram1.png";
import haram2 from "./haram2.png";
import haram3 from "./haram3.png";
import haram4 from "./haram4.png";
import galaxy from "./galaxy.png";

const Stack = createStackNavigator();

export default function App() {
  return (
    <MetaMaskProvider>
      <Stack.Navigator  screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="connectWallet" component={MetaMaskConnection} />
      </Stack.Navigator>
      </MetaMaskProvider>

  );
}

function HomeScreen() {
  const [isWarnHovered, setIsWarnHovered] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const fadeAnim = new Animated.Value(0); // Initialize opacity
  const navigation = useNavigation();
  const [goodDeeds, setGoodDeeds] = useState(0);
  const [money, setMoney] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomFluctuation = (value) => value + Math.floor(Math.random() * 7) - 1;

      setMoney((prevMoney) => randomFluctuation(prevMoney + 1));
      setGoodDeeds((prevMoney) => randomFluctuation((prevMoney + 10)));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);
  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredButton(index);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const platformSpecificProps = Platform.OS === "web"
    ? {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
      }
    : {};

  return (
    <ScrollView style={styles.background}>
      <ImageBackground source={background1}>
      <View style={styles.dynamicSection}>
      <Text style={styles.dynamicShow}>    Good Deeds:     </Text>
        <Text style={styles.dynamicText}>
                 {goodDeeds}
        </Text>
        <Text style={styles.dynamicShow}>    Money Earning:     </Text>
        <Text style={styles.dynamicText}>
                 {money}$
        </Text>
      </View>
        <Text style={styles.heroTitle}>World's First Sharia<br/>compliant Crypto app</Text>
        <Text style={styles.heroSub}>Our AI trading software ensures you get gains for the world and the hereafter</Text>
        
      </ImageBackground>
      
      <ParticleAnimation />
      
      <View style={styles.mainHadith}>
        <Text style={styles.report}>Abu Qatadah reported: The Prophet, peace and blessings be upon him, said:</Text>
        <Text>      </Text>
        <Text style={styles.hadithEnglish}>
          Verily, you will never leave anything for the sake of Allah almighty<br/>
          but that Allah will replace it with something better
        </Text>
        <Text>      </Text>
        <Text style={styles.hadithArabic}><Text>                          </Text>
          عَنْ أَبِي قَتَادَةَ عَنْ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ إِنَّكَ لَنْ تَدَعَ شَيْئً<br/>
          <Text>                         </Text>لِلَّهِ عَزَّ وَجَلَّ إِلَّا بَدَّلَكَ اللَّهُ بِهِ مَا هُوَ خَيْرٌ لَكَ مِنْهُ
        </Text>
        <Text>      </Text>
        <Text style={styles.sahih}>Grade: Sahih according to Al-Albani in Musnad Aḥmad 22565</Text>
      </View>

      <Text style={styles.warn} {...platformSpecificProps}>
        Examples of what we warn in Crypto Projects/Schemes
      </Text>

      <View style={styles.haramSection}>
        {[haram1, haram2, haram3, haram4].map((haramImage, index) => (
          <View
            key={index}
            style={[
              styles.haramBox,
              hoverIndex === index && styles.haramBoxHover
            ]}
            {...platformSpecificProps}
          >
            <Image source={haramImage} style={styles.haramImage} />
            <Text style={styles.haramText}>
              {index === 0 && "Riba (Interest): Avoiding any form of interest-based transactions."}
              {index === 1 && "Gharar (Uncertainty): Ensuring clarity and transparency in contracts."}
              {index === 2 && "Maysir (Gambling): Excluding any activities that involve speculation."}
              {index === 3 && "Haram Investments: Avoiding investments in prohibited industries."}
            </Text>
          </View>
        ))}
      </View>

      <ImageBackground source={galaxy} style={[styles.newSection, { opacity: fadeAnim }]}>
        <Text style={styles.newTitle}>Let's earn Halal Crypto</Text>
        <TouchableOpacity 
          style={[styles.exploreButton, hoveredButton === 4 && styles.exploreButtonHover]} 
          onPress={() => navigation.navigate('connectWallet')}
          {...platformSpecificProps}
        >
          <Text style={styles.exploreButtonText}>Explore the App</Text>
        </TouchableOpacity>
      </ImageBackground>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 RizqFlow. All rights reserved.</Text>
        <Text style={styles.footerText}>Privacy Policy | Terms of Service</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  warn: {
    textShadowColor: 'red',
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 10,
    color: "white",
    top: 1600,
    fontWeight: "bold",
    fontSize: 35,
    left: 250,
    borderColor: "red",
    borderRadius: 50,
    backgroundColor: "black",
    padding: 10,
  },
  warnHovered: {
    backgroundColor: 'white',
    color: 'black',
    transform: [{ scale: 1.5 }],
  },
  sahih: {
    color: "white",
    fontSize: 20,
    left: 150,
  },
  mainHadith: {
    top: 1200,
  },
  report: {
    left: 150,
    fontSize: 20,
    color: "white",
  },
  hadithEnglish: {
    fontSize: 25,
    fontWeight: "bold",
    left: 150,
    color: "white",
  },
  hadithArabic: {
    fontSize: 30,
    fontWeight: "bold",
    left: -360,
    color: "white",
  },
  background: {
    backgroundColor: "black",
  },
  heroButtonText: {
    top: 16,
    left: 50,
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  heroButton: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "black",
    borderRadius: 100,
    width: 300,
    fontSize: 15,
    borderWidth: 4,
    borderColor: "purple",
    textAlignVertical: "center",
    height: 60,
    top: 300,
    left: 60,
  },
  heroButtonHover: {
    backgroundColor: 'purple',
    borderColor: 'white',
    transform: [{ scale: 1.1 }],
  },
  heroSub: {
    fontSize: 25,
    color: "white",
    top: 260,
    left: 60,
  },
  logoStyle: {
    width: 55,
    height: 55,
    left: 20,
    borderRadius: 10,
  },
  heroTitle: {
    top: 220,
    left: 60,
    fontSize: 60,
    color: "white",
    fontWeight: "bold",
  },
  navbar: {
    flex: 1,
    zIndex: 1000, 
    position: "absolute",
    opacity: 0.8,
    borderColor: "white",
    borderWidth: 2,
    width: 1200,
    height: 80,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    color: "purple",
    left: 100,
    top: 20,
  },
  navItem: {
    fontSize: 16,
    left: 60,
    fontWeight: "bold",
    color: "rgb(140, 10, 200)",
  },
  hovered: {
    color: 'white',
    transform: [{ scale: 1.1 }],
  },
  haramSection: {
    top: 1600,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  haramBox: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: 250,
    borderWidth: 2,
    borderColor: 'purple',
  },
  haramBoxHover: {
    backgroundColor: 'purple',
    transform: [{ scale: 1.05 }],
    borderColor: 'white',
  },
  haramImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  haramText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  newSection: {
    width: 1600,
    height: 800,
    top: 1600,
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
  },
  newTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 500,
    textShadowColor: 'black',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 3,
    left: -70,
    top: 300,
  },
  exploreButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    left: -100,
    top: -50,
    borderWidth: 2,
    borderColor: 'purple',
    width: 300,
    height: 80,
    alignItems: 'center',
  },
  exploreButtonHover: {
    backgroundColor: 'purple',
    borderColor: 'white',
    transform: [{ scale: 1.1 }],
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    top: 5,
  },
  footer: {
    top: 1500,
    backgroundColor: 'black',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'purple',
    marginTop: 50,
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  dynamicSection: {
    flexDirection: "row",
    marginTop: 50,
    left: 50,
    alignItems: 'center',
  },
  dynamicText: {
    color: 'lightgreen',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  dynamicShow: {
    color: "white",
    fontSize: 30,
  },
});
