import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,StatusBar, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  green: "#157A6E",
  red: "#B53737",
  cardBlue: "#293C7A",
  cardGreen: "#1C6034",
  cardRed: "#5A2E2E",
  cardOrange: "#D45C16",
  lightGray: "#1E2D44",
  transparentWhite: "rgba(255, 255, 255, 0.7)", 
};
const Profile = ({ navigation, userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = userId || auth().currentUser?.uid;

        if (!uid) {
          console.log("No user ID available!");
          navigation.replace("AddDetails");
          return;
        }

        const currentUser = auth().currentUser;
        const isHospitalUser = currentUser?.email?.includes("@hospital.com");
        const hospitalId = isHospitalUser ? currentUser?.email.split("@")[0] : null;

        let userDoc;

        if (isHospitalUser && hospitalId) {
          userDoc = await firestore()
            .collection("users")
            .doc("hospital")
            .collection("uid")
            .doc(hospitalId)
            .collection("details")
            .doc(uid)
            .get();
        } else {
          userDoc = await firestore()
            .collection("users")
            .doc("phone")
            .collection(uid)
            .doc("details")
            .get();
        }

        if (userDoc.exists) {
          setUserDetails(userDoc.data());
        } else {
          console.log("No user data found! Redirecting to Add Details page.");
          navigation.replace("AddDetails");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0FEDED" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>About</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoRow, styles.borderBottom]}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{userDetails?.gender || "N/A"}</Text>
          <Text style={styles.label}>Blood Type:</Text>
          <Text style={styles.value}>{userDetails?.bloodType || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{userDetails?.age || "N/A"} Years</Text>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{userDetails?.weight || "N/A"} Kg</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
      <View style={styles.cardRow}>
        
  <View style={styles.logoContainer}>
    <Image
      source={require("../../assets/images/quickmeds.png")}
      style={styles.logo}
    />
    
    
    <View style={styles.cardTextContainer}>
    
      <Text style={styles.cardSubtext}>Patient Details :</Text>
      <Text style={styles.cardSubtext}>HOSP ID - {userDetails?.hospitalid || "00000"}</Text>
      <Text style={styles.cardSubtext}>JOINED - {userDetails?.joinDate || "N/A"}</Text>
    </View>
  </View>
  <Image
    source={require("../../assets/images/profile/frame.png")}
    style={styles.frameImage}
  />
</View>


        <View style={styles.patientDetailsContainer}>
          <Text style={styles.cardName}>{userDetails?.name || "FIRST-LAST NAME"}</Text>
          <Image
            source={require("../../assets/images/profile/barcode.png")}
            style={styles.barcode}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate("FirstPage")}>
        <Text style={styles.supportButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 18 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: { alignItems: "center", marginBottom: 30,borderBottomColor:COLORS.white,padding:10, borderBottomWidth:1 },
  header: { fontSize: 32, color: "#FFFFFF",fontFamily:"monospace", fontWeight: "bold" },
  infoContainer: { marginBottom: 25 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  borderBottom: { borderBottomColor: "#7A8FA6", borderBottomWidth: 1, paddingBottom: 10 },
  label: { color: "#7A8FA6", fontSize: 16 },
  value: { color: "#0FEDED", fontSize: 16 },
  cardContainer: {
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    padding: 12,
    marginVertical: 20,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 85, height: 40, marginRight: 10 },
  cardTextContainer: { flex: 1, justifyContent: "flex-start" ,marginTop:10,marginBottom:20},
  logoContainer: {alignItems:"flex-start",flex:1},
  
  cardSubtext: { color:"#1b1b32", fontSize: 17,fontWeight:"bold" },
  frameImage: { width: 75, height: 95, marginLeft: 30, alignSelf: "center" ,borderRadius:6},
  patientDetailsContainer: { alignItems: "center", marginTop: 8 },
  cardName: { color: COLORS.white, fontSize: 28, fontWeight: "bold", marginVertical: 15,marginBottom:0,fontFamily:"monospace" },
  barcode: { width: "100%", height: 60, resizeMode: "contain" ,marginBottom:0},
  supportButton: {
    backgroundColor: "#2C3456",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 260,
  },
  supportButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
});

export default Profile;
