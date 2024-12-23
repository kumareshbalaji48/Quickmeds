import 'react-native-gesture-handler';
import 'expo-dev-client';
import { Provider as PaperProvider } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreenComponent from './src/SplashScreenComponent.js';
import OnboardingScreen from './src/OnboardingScreen.js';
import FirstPage from './src/FirstPage.js';
import PhoneAuth from './src/AuthScreens/PhoneAuth.js';
import HospitalIDAuth from './src/AuthScreens/HospitalIDAuth.js';
import Dashboard from './src/AuthScreens/Dashboard.js';
import RegisterPhone from './src/AuthScreens/RegisterPhone.js';
import SignIn from './src/AuthScreens/SignIn.js';
import HomePage from './src/HomeScreens/HomePage.js';
import BillStatements from './src/BillStatements.js';
import BookAppointments from './src/BookAppointments.js';
import MedicalRecords from './src/Records/MedicalRecords.js';
import NlpSummarizer from './src/NlpSummarizer.js';
import Profile from './src/ProfileScreens/Profile.js';
import AddDetails from './src/ProfileScreens/AddDetails.js';
import AddNotes from './src/Records/AddNotes.js';
import Reports from './src/Records/Reports.js';
import Test from './src/Records/Test.js';
const Stack = createNativeStackNavigator();

const App = () => {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 5000);

    const checkAppLaunch = async () => {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched');
      if (appData == null) {
        setIsAppFirstLaunched(true);
        await AsyncStorage.setItem('isAppFirstLaunched', 'false');
      } else {
        setIsAppFirstLaunched(false);
      }
    };

    checkAppLaunch();
  }, []);

  if (isShowSplash) {
    return <SplashScreenComponent />;
  }

  return (
    <PaperProvider>
    isAppFirstLaunched != null && (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAppFirstLaunched && (
            <Stack.Screen
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
          )}
          <Stack.Screen name="FirstPage" component={FirstPage} options={{headerShown: false}} />
          <Stack.Screen name="PhoneAuth" component={PhoneAuth} options={{headerShown: false}} />
          <Stack.Screen name="HospitalIDAuth" component={HospitalIDAuth} options={{headerShown: false}}/>
          <Stack.Screen name="RegisterPhone" component={RegisterPhone} options={{headerShown: false}}/>
          <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false}}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
          <Stack.Screen name="HomePage" component={HomePage} options={{headerShown: false}} />
          <Stack.Screen name="BillStatements" component={BillStatements} options={{headerShown: false}} />
          <Stack.Screen name="BookAppointments" component={BookAppointments} options={{headerShown: false}} />
          <Stack.Screen name="MedicalRecords" component={MedicalRecords} options={{headerShown: false}} />
          <Stack.Screen name="NlpSummarizer" component={NlpSummarizer} options={{headerShown: false}} />
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
          <Stack.Screen name="AddDetails" component={AddDetails} options={{headerShown: false}} />
          <Stack.Screen name="Reports" component={Reports} options={{headerShown: false}} />
          <Stack.Screen name="AddNotes" component={AddNotes} options={{headerShown: false}} />
          <Stack.Screen name="Test" component={Test} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
      
    )
    </PaperProvider>
  );
};

export default App;
