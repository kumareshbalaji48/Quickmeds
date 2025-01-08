import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  green: "#157A6E",
  red: "#B53737",
  accent: "#0FEDED",
  cardBlue: "#293C7A",
  cardGreen: "#084C2E",
  cardRed: "#7A271A",
  cardOrange: "#772917",
  lightGray: "#1E2D44",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

export default function HomePage({ navigation }) {
  const [username, setUsername] = useState("User");
  const [reminders, setReminders] = useState([]);

  
  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth().currentUser;

      if (user) {
        try {
          const phoneDoc = await firestore()
            .collection("users")
            .doc("phone")
            .collection(user.uid)
            .doc("about")
            .get();

          if (phoneDoc.exists) {
            setUsername(phoneDoc.data().name || "User");
            return;
          }

          const hospitalSnapshot = await firestore()
            .collection("users")
            .doc("hospital")
            .collection("uid")
            .where("uid", "==", user.uid)
            .get();

          if (!hospitalSnapshot.empty) {
            hospitalSnapshot.forEach((doc) => {
              const hospitalData = doc.data();
              if (hospitalData.name) {
                setUsername(hospitalData.name);
              } else {
                setUsername("User");
              }
            });
          } else {
            setUsername("User");
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      }
    };

    fetchUsername();
  }, []);

  
  useEffect(() => {
    const fetchReminders = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const notesCollection = firestore()
          .collection("users")
          .doc("phone")
          .collection(user.uid)
          .doc("reminders")
          .collection("notes");

        const notesSnapshot = await notesCollection.get();
        const fetchedNotes = notesSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().description,
          type:"note",
        }));

        
        const appointmentReminder = {
          id: "1",
          type: "appointment",
          title: "Appointment with Dr. Stone",
          date: "Wed, 10 Jan 2024",
          time: "11:00 AM",
          doctorImage: require("../../assets/images/Homepage/image.png"),
        };

        
        setReminders([appointmentReminder, ...fetchedNotes]);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, []);

  
  const renderReminder = ({ item }) => {
    if (item.type === "appointment") {
      return (
        <View style={styles.reminderCard}>
          <Image source={item.doctorImage} style={styles.doctorImage} />
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <View style={styles.reminderDetailsContainer}>
              <View style={styles.iconTextContainer}>
                <Image
                  source={require("../../assets/images/Homepage/date.png")}
                  style={styles.smallIcon}
                />
                <Text style={styles.reminderDetails}>{item.date}</Text>
              </View>
              <View style={[styles.iconTextContainer, { marginLeft: 10 }]}>
                <Image
                  source={require("../../assets/images/Homepage/time.png")}
                  style={styles.smallIcon}
                />
                <Text style={styles.reminderDetails}>{item.time}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item.type === "note") {
      return (
        <View style={styles.reminderCard}>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>{item.title}</Text>
            <Text style={styles.reminderNote}>{item.content}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi {username}!</Text>
          <Text style={styles.subGreeting}>
            May you always be in good condition
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={require("../../assets/images/Homepage/profile.png")}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: COLORS.cardBlue }]}
          onPress={() => navigation.navigate("BookAppointments")}
        >
          <Image
            source={require("../../assets/images/Homepage/appointment.png")}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Book an Appointment</Text>
          <Text style={styles.cardSubtitle}>
            Find the department and availability
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: COLORS.cardGreen }]}
          onPress={() => navigation.navigate("MedicalRecords")}
        >
          <Image
            source={require("../../assets/images/Homepage/records.png")}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Medical Records</Text>
          <Text style={styles.cardSubtitle}>Keep your Health in check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: COLORS.cardOrange }]}
          onPress={() => navigation.navigate("NlpSummarizer")}
        >
          <Image
            source={require("../../assets/images/Homepage/nlp.png")}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Report Summarizer</Text>
          <Text style={styles.cardSubtitle}>NLP based</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: COLORS.cardRed }]}
          onPress={() => navigation.navigate("BillStatements")}
        >
          <Image
            source={require("../../assets/images/Homepage/expenses.png")}
            style={styles.cardIcon}
          />
          <Text style={styles.cardTitle}>Bill Statements</Text>
          <Text style={styles.cardSubtitle}>Medical Records</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reminderSection}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <FlatList
          data={reminders}
          renderItem={renderReminder}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      
      <TouchableOpacity
        style={styles.addNoteButton}
        onPress={() =>
          navigation.navigate("AddNotes", { notes: reminders, setNotes: setReminders })
        }
      >
        <Text style={styles.addNoteButtonText}>Add Reminders</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: 30,
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    paddingBottom: 15,
    borderBottomColor: COLORS.transparentWhite,
    borderWidth: 1,
  },
  greeting: {
    fontSize: 27,
    fontWeight: "bold",
    color: COLORS.accent,
    fontFamily: "monospace",
  },
  subGreeting: {
    fontSize: 15,
    color: COLORS.white,
  },
  profileIcon: {
    width: 39,
    height: 39,
    borderRadius: 17,
    borderWidth: 0.8,
    borderColor: COLORS.transparentWhite,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  card: {
    width: width * 0.44,
    height: 170,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  cardIcon: {
    width: 35,
    height: 35,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.white,
    fontFamily: "sans-serif",
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.transparentWhite,
    fontFamily: "serif",
  },
  reminderSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 15,
    fontFamily: "monospace",
  },
  reminderCard: {
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginRight: 10,
    width: width * 0.8,
    height: 130,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
    fontFamily: "sans-serif",
  },
  reminderDetails: {
    fontSize: 11,
    color: COLORS.transparentWhite,
    fontFamily: "serif",
  },
  reminderNote: {
    fontSize: 11,
    color: COLORS.white,
    fontFamily: "serif",
  },
  reminderDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  addNoteButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  addNoteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
