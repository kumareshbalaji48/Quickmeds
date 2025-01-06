import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, Image, ActivityIndicator, TouchableOpacity } from "react-native";
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
  const [aboutDetails, setAboutDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = userId || auth().currentUser?.uid;

        if (!uid) {
          console.log("No user ID available!");
          navigation.reset({
            index: 0,
            routes: [{ name: "AddDetails" }],
          });
          return;
        }

        // Fetch `details` document
        const userRef = firestore().collection("users").doc("phone").collection(uid).doc("details");
        const userDoc = await userRef.get();

        // Fetch `about` document
        const aboutRef = firestore().collection("users").doc("phone").collection(uid).doc("about");
        const aboutDoc = await aboutRef.get();

        if (userDoc.exists) {
          const detailsData = userDoc.data();
          const requiredFields = ["gender", "age", "weight", "bloodType"];
          const isIncomplete = requiredFields.some((field) => !detailsData[field]);

          if (isIncomplete) {
            console.log("Incomplete user data! Redirecting to AddDetails page.");
            navigation.navigate("AddDetails", { userData: detailsData }); // Pass existing data
          } else {
            setUserDetails(detailsData);
          }
        } else {
          console.log("No user details found! Redirecting to AddDetails page.");
          navigation.reset({
            index: 0,
            routes: [{ name: "AddDetails" }],
          });
        }

        if (aboutDoc.exists) {
          setAboutDetails(aboutDoc.data());
        } else {
          console.log("No about document found!");
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
        <ActivityIndicator size="large" color={COLORS.blue} />
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
              <Text style={styles.cardSubtext}>Patient Details:</Text>
              <Text style={styles.cardSubtext}>HOSP ID - {aboutDetails?.hospitalid || "N/A"}</Text>
              <Text style={styles.cardSubtext}>JOINED - {aboutDetails?.joinDate || "N/A"}</Text>
            </View>
          </View>
          <Image
            source={require("../../assets/images/profile/frame.png")}
            style={styles.frameImage}
          />
        </View>

        <View style={styles.patientDetailsContainer}>
          <Text style={styles.cardName}>{aboutDetails?.name || "FIRST-LAST NAME"}</Text>
          <Image
            source={require("../../assets/images/profile/barcode.png")}
            style={styles.barcode}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => {
          auth().signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "FirstPage" }],
          });
        }}
      >
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