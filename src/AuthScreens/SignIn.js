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
} from "react-native";
import auth from "@react-native-firebase/auth";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  placeholder: "#aaa",
  border: "#4F73DF",
};

export default function SignIn({ navigation }) {
  const [hospitalid, setHospitalid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithHospitalID = async () => {
    if (!hospitalid || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      
      await auth().signInWithEmailAndPassword(
        `${hospitalid}@hospital.com`,
        password
      );

      alert("Login successful!");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Error during sign in: ", error);
      alert("Invalid Hospital ID or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Please enter your credentials to sign in
        </Text>

        
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

        
        <TouchableOpacity onPress={() => navigation.navigate("PhoneAuth")} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>


      <View style={styles.footer}>
        <TouchableOpacity
          onPress={signInWithHospitalID}
          disabled={loading}
          style={[
            styles.button,
            { backgroundColor: loading ? "#aaa" : COLORS.blue },
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => navigation.navigate("PhoneAuth")}>
          <Text style={styles.registerText}>
            Login with Phone number?{" "}
            <Text style={{ color: COLORS.blue }}>Login</Text>
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
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  forgotPasswordText: {
    color: COLORS.blue,
    fontSize: 14,
  },
  footer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
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
  registerText: {
    textAlign: "center",
    color: COLORS.white,
    fontSize: 14,
  },
});
