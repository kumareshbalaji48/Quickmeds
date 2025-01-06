import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const { width, height } = Dimensions.get("window");
const COLORS = { primary: "#020E22", white: "#fff", blue: "#4F73DF", gray: "#2A2A2A" };

export default function RegisterPhone({ route, navigation }) {
  const { uid } = route.params;
  const [name, setName] = useState("");
  const [hospitalid, setHospitalid] = useState("");
  const [loading, setLoading] = useState(false);

  const checkHospitalIdExists = async (hospitalid) => {
    try {
      const snapshot = await firestore()
        .collection("users")
        .where("hospitalid", "==", hospitalid)
        .get();

      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking Hospital ID existence:", error);
      return false;
    }
  };

  const saveDetails = async () => {
    if (!name.trim() || !hospitalid.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const exists = await checkHospitalIdExists(hospitalid);

      if (exists) {
        Alert.alert("Error", "This Hospital ID is already registered. Please use another.");
        setLoading(false);
        return;
      }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(now.getFullYear()).slice(-2); // Get the last two digits of the year
    const joinDate = `${day}-${month}-${year}`;

      await firestore()
        .collection("users")
        .doc("phone")
        .collection(uid)
        .doc("about")
        .set({
          name,
          hospitalid,
          uid,
          joinDate, // Add the joinDate field
        });

      Alert.alert("Success", "Registration completed successfully!");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Error saving details:", error);
      Alert.alert("Error", "An error occurred while saving your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.primary, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: COLORS.white,
          marginTop: height * 0.1,
          marginBottom: 20,
        }}
      >
        Register
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: COLORS.white,
          marginBottom: 30,
        }}
      >
        Please fill out the form to complete your registration.
      </Text>
      <TextInput
        style={{
          height: 50,
          width: "100%",
          borderColor: COLORS.gray,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 20,
          paddingHorizontal: 15,
          backgroundColor: COLORS.gray,
          color: COLORS.white,
        }}
        placeholder="Enter your full name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={{
          height: 50,
          width: "100%",
          borderColor: COLORS.gray,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 20,
          paddingHorizontal: 15,
          backgroundColor: COLORS.gray,
          color: COLORS.white,
        }}
        placeholder="Enter your Hospital ID"
        placeholderTextColor="#aaa"
        value={hospitalid}
        onChangeText={setHospitalid}
      />
      <TouchableOpacity
        onPress={saveDetails}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : COLORS.blue,
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "bold" }}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text
          style={{
            textAlign: "center",
            color: COLORS.white,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          I have an account? <Text style={{ color: COLORS.blue }}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
