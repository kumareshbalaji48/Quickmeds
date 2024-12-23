import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  placeholder: "#aaa",
  border: "#4F73DF",
};

export default function HospitalIDAuth({ navigation }) {
  const [name, setName] = useState("");
  const [hospitalid, setHospitalid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerWithHospitalID = async () => {
    if (!name.trim() || !hospitalid.trim() || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      
      const snapshot = await firestore()
        .collection("users")
        .doc("hospital")
        .collection("uid")
        .doc(hospitalid)
        .get();

      if (snapshot.exists) {
        Alert.alert("Error", "This Hospital ID is already registered.");
        setLoading(false);
        return;
      }

      
      const userCredential = await auth().createUserWithEmailAndPassword(
        `${hospitalid}@hospital.com`, 
        password
      );

      const uid = userCredential.user.uid;

      
      await firestore()
        .collection("users")
        .doc("hospital")
        .collection("uid")
        .doc(hospitalid)
        .set({
          name,
          hospitalid,
          uid,
        });

      Alert.alert("Success", "Hospital ID registered successfully!");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Please fill out the form to register</Text>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.placeholder}
            value={name}
            onChangeText={setName}
          />
        </View>

       
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hospital ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Hospital ID"
            placeholderTextColor={COLORS.placeholder}
            value={hospitalid}
            onChangeText={setHospitalid}
          />
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.placeholder}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor={COLORS.placeholder}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </ScrollView>

      
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={registerWithHospitalID}
          disabled={loading}
          style={[styles.button, { backgroundColor: loading ? "#aaa" : COLORS.blue }]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={{ color: COLORS.blue }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: height * 0.08,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 5,
  },
  input: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.gray,
    color: COLORS.white,
  },
  footer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 14,
  },
});
