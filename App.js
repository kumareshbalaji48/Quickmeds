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

//import Dashboard from './src/AuthScreens/Dashboard.js';
import RegisterPhone from './src/AuthScreens/RegisterPhone.js';

import HomePage from './src/HomeScreens/HomePage.js';
import BillStatements from './src/BillScreens/BillStatements.js';
import BookAppointments from './src/BookAppointments.js';
import MedicalRecords from './src/Records/MedicalRecords.js';
import NlpSummarizer from './src/NlpScreens/NlpSummarizer.js';
import Process from './src/NlpScreens/Process.js';
import Profile from './src/ProfileScreens/Profile.js';
import AddDetails from './src/ProfileScreens/AddDetails.js';
import AddNotes from './src/Records/AddNotes.js';
import Reports from './src/Records/Reports.js';
import Test from './src/Records/Test.js';
import BillPdf from './src/BillScreens/BillPdf.js';
import Result from './src/NlpScreens/Result.js';
import AppointmentPage from "./src/AppointmentScreens/AppointmentPage.js";
import ENT from "./src/AppointmentScreens/ENT.js";
import Psychiatrist from "./src/AppointmentScreens/Psychiatrist.js";
import Dentist from "./src/AppointmentScreens/Dentist.js";
import Dermato from "./src/AppointmentScreens/Dermato.js";
import DoctorsList from "./src/AppointmentScreens/DoctorsList.js";
import DoctorDetails from "./src/AppointmentScreens/DoctorDetails.js";
import AppointmentConfirmation from "./src/AppointmentScreens/AppointmentConfirmation.js";
import Assistant from './src/NlpScreens/Assistant.js';
import Makeappointment from './src/AppointmentScreens/Makeappointment.js';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import process from 'process';

global.process = process;


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
          <Stack.Screen name="RegisterPhone" component={RegisterPhone} options={{headerShown: false}}/>
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
          <Stack.Screen name="BillPdf" component={BillPdf} options={{headerShown: false}} />
          <Stack.Screen name="Process" component={Process} options={{headerShown: false}} />
          <Stack.Screen name="Assistant" component={Assistant} options={{headerShown: false}} />
          <Stack.Screen name="Makeappointment" component={Makeappointment} options={{headerShown: false}} />

          <Stack.Screen
            name="AppointmentPage"
            component={AppointmentPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ENT"
            component={ENT}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Psychiatrist"
            component={Psychiatrist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dentist"
            component={Dentist}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dermato"
            component={Dermato}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DoctorsList"
            component={DoctorsList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DoctorDetails"
            component={DoctorDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AppointmentConfirmation"
            component={AppointmentConfirmation}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="Result" component={Result} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
      
    )
    </PaperProvider>
  );
};

export default App;
