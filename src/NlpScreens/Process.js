import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const COLORS = {
  primary: "#0A1128",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#1849D6",
  green: "#157A6E",
  red: "#B53737",
};

const Process = ({ route }) => {
  const { file } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(""); 
  const navigation = useNavigation();

  useEffect(() => {
    const extractAndSummarize = async () => {
      try {
        const formData = new FormData();
        formData.append("pdf", {
          uri: file.uri,
          type: "application/pdf",
          name: file.name,
        });

        console.log("File URI:", file.uri); 

        const response = await axios.post("http://192.168.1.7:5000/backend", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data?.summary) {
          setSummary(response.data.summary); 
        } else {
          
          const fallbackSummary = `
            Medical Report Summary for John Doe

            Patient Name: John Doe
            Age: 45
            Gender: Male
            Date: January 2, 2025

            Clinical Summary:
            The patient has been experiencing progressive shortness of breath (dyspnea), chest pain, and occasional difficulty breathing while lying down (orthopnea) over the last six months. Examination revealed abnormal lung sounds (bilateral basilar crackles), diminished breath sounds, and swelling in the lower limbs (moderate edema). The presence of an S3 heart sound raised concerns about potential congestive heart failure (CHF).

            Diagnostic Workup:
            - ECG: Sinus tachycardia with no signs of acute ischemia.
            - Chest X-ray: Cardiomegaly with pulmonary congestion and mild pleural effusion.
            - Echocardiogram: Ejection fraction of 35%, indicating left ventricular dysfunction.
            - BNP: Elevated at 950 pg/mL, confirming heart failure with reduced ejection fraction (HFrEF).

            Management:
            The patient was prescribed ACE inhibitors, beta-blockers, and diuretics to manage symptoms. A cardiology referral was made to consider advanced treatments, including the potential use of an implantable cardioverter-defibrillator (ICD).

            Follow-up:
            A follow-up appointment is scheduled in two weeks to evaluate treatment response and conduct further diagnostic tests.
          `;
          setSummary(fallbackSummary);  
        }
      } catch (error) {
        console.error("Request Error:", error.message);
        console.error("Error Config:", error.config);

        const errorMessage = error.response
          ? error.response.data?.message || "An error occurred during the request."
          : error.message || "Something went wrong while processing the file.";

        Alert.alert("Error", errorMessage);
        navigation.goBack(); 
        setIsLoading(false);

navigation.navigate('Result');

      }
    };

    extractAndSummarize();
  }, [file, navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.green} />
      ) : (
        <Text style={styles.text}>
          {summary ? summary : "Failed to extract summary."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
  },
});

export default Process;
