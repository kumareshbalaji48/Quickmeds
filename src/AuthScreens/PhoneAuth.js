import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const COLORS = {
  primary: "#020E22",
  white: "#fff",
  blue: "#4F73DF",
  placeholder: "#aaa",
  error: "#FF6F61",
};

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const signInWithPhoneNumber = async () => {
    setError("");
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber.trim());
      setConfirm(confirmation);
    } catch (err) {
      console.error("Error sending code:", err);
      setError("Failed to send verification code. Please check your phone number.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    setError("");
    if (!code.trim()) {
      setError("Please enter the verification code.");
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await confirm.confirm(code.trim());
      const user = userCredential.user;
  
      
      const userDoc = await firestore()
        .collection("users")
        .doc("phone")
        .collection(user.uid)
        .doc("about") 
        .get();
  
      if (userDoc.exists) {
        
        navigation.navigate("HomePage");
      } else {
        
        navigation.navigate("RegisterPhone", { uid: user.uid });
      }
    } catch (err) {
      console.error("Invalid code:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />
        <View style={styles.topContainer}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>
            Please enter your phone number to continue your registration
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!confirm ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Eg. +91-8618170601"
                placeholderTextColor={COLORS.placeholder}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                onPress={signInWithPhoneNumber}
                style={[
                  styles.button,
                  { backgroundColor: loading ? "#aaa" : COLORS.blue },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Code"
                placeholderTextColor={COLORS.placeholder}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                onPress={confirmCode}
                style={[
                  styles.button,
                  { backgroundColor: loading ? "#aaa" : COLORS.blue },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Confirm Code</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By signing up or logging in, I accept the app's{" "}
            <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "space-between",
  },
  topContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: COLORS.white,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.blue,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
  },
  footerText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: "center",
    marginHorizontal: 20,
  },
  link: {
    color: COLORS.blue,
    textDecorationLine: "underline",
  },
});

export default PhoneAuth;