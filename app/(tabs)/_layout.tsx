import { Tabs } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'; // FontAwesome5 for icons
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarStyle: {
          opacity: 1.1,
          backgroundColor: 'black', // Set the background color of the tab bar to black
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: 'purple', // Set the font color of the tab bar labels to purple
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              style={focused ? { color: 'purple' } : {}}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="connectWallet"
        options={{
          title: 'Crypto AI',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="robot" // 'robot' icon to represent AI/bot
              size={25}
              color={focused ? 'purple' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cryptoMarket"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'chart-line' : 'chart-bar'} // Correct icon names for FontAwesome5
              size={25}
              color={focused ? 'purple' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="tags" // FontAwesome5 price tag icon
              size={25}
              color={focused ? 'purple' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="newspaper" // FontAwesome5 newspaper icon
              size={25}
              color={focused ? 'purple' : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
