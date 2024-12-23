import React from 'react';
import { View, Text, StyleSheet, Image,StatusBar } from 'react-native';

const logo = require('../assets/images/Fatured-icon.png');
const COLORS = { primary: '#020E22', white: '#fff', blue: '#4F73DF' };
export default function SplashScreenComponent() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>QuickMeds Mobile App!</Text>
        <Text style={styles.subtext}>Product by HDS and BK</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Space between logo and text
    alignItems: 'center',
    backgroundColor: '#0A2463', // Match your splash screen background color
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%', 
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight :500,
    fontSize: 18,
    fontFamily: 'system-ui', // Ensure this font is supported
    textAlign: 'center', // Center-align text
  },
  subtext:{
    color: '#fff',
    fontWeight :200,
    fontSize: 12,
    fontFamily: 'system-ui', // Ensure this font is supported
    textAlign: 'center',

  },
  image: {
    width: 75, // Adjust the width of the logo
    height: 75, // Adjust the height of the logo
    resizeMode: 'cover',
  },
});
