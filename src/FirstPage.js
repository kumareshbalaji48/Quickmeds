import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');
const COLORS = { primary: '#020E22', white: '#fff', blue: '#4F73DF' };

const FirstPage = ({ navigation }) => {
  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.headerContainer}>
        
        <Image
          source={require('../assets/images/registration/firstpage.png')} 
          style={styles.headerImage}
        />

        
        <View style={styles.textContainer}>
          <Text style={styles.title}>QuickMeds</Text>
          <Text style={styles.subtitle}>
            Begin your journey to better health! Hope to rejuvenate your health and assist you in 360 deg ways.
          </Text>
        </View>

        
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.blue }]}
            onPress={() => navigation.navigate('PhoneAuth')}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Sign Up With Phone Number</Text>
              <Image
                source={require('../assets/images/registration/phone-call.png')} 
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          
          
        </View>
      </View>

      
      <View style={styles.bottomContainer}>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PhoneAuth')}>
            <Text style={[styles.signInText, { color: COLORS.blue }]}>Login !</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          By signing up or logging in, I accept the app’s{' '}
          <Text style={{ color: COLORS.blue }}>Terms of Service</Text> and{' '}
          <Text style={{ color: COLORS.blue }}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  headerImage: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: 10,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'left',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'left',
    maxWidth: '95%',
    marginTop: 15,
    lineHeight: 23,
  },
  buttonContainer: {
    marginTop: 23,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 53,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginRight: 10,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: COLORS.white,
    fontSize: 15,
  },
  termsText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default FirstPage;
