import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Button, Card, Divider, Portal } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  accent: "#0FEDED",
  blue: "#4F73DF",
  cardBorder: "#4F73DF",
  textGray: "rgba(255, 255, 255, 0.7)",
  headerBackground: "#293C7A",
  addButton: "#1C6034",
};

const AddNotes = ({ navigation, route }) => {
  const { notes = [], setNotes = () => {} } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth().currentUser?.uid;

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
  }, [navigation]);

  const handleAddNote = () => {
    if (newNote.title && newNote.description) {
      const newId = notes.length + 1;
      const newNoteData = {
        id: newId,
        title: newNote.title,
        description: newNote.description,
        date: new Date().toLocaleDateString(),
      };

      setNotes((prevNotes) => [...prevNotes, newNoteData]);

      setNewNote({ title: "", description: "" });

      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Loading User Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>{userDetails?.name || "N/A"}</Text>
          <Divider style={styles.headerDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Gender: <Text style={styles.infoValue}>{userDetails?.gender || "N/A"}</Text>
            </Text>
            <Text style={styles.infoText}>
              Blood Type: <Text style={styles.infoValue}>{userDetails?.bloodType || "N/A"}</Text>
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Age: <Text style={styles.infoValue}>{userDetails?.age || "N/A"} Years</Text>
            </Text>
            <Text style={styles.infoText}>
              Weight: <Text style={styles.infoValue}>{userDetails?.weight || "N/A"} Kg</Text>
            </Text>
          </View>
        </View>

        {notes.map((note) => (
          <Card key={note.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.noteTitle}>{note.title}</Text>
              <Text style={styles.noteDescription}>{note.description}</Text>
              <Text style={styles.noteDate}>Added Manually {note.date}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Button
        mode="contained"
        buttonColor={COLORS.blue}
        textColor="#fff"
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        Add More
      </Button>

      <Portal>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Card style={styles.modalCard}>
              <Card.Content>
                <Text style={styles.modalTitle}>Add Note</Text>
                <TextInput
                  placeholder="Note Title"
                  placeholderTextColor={COLORS.textGray}
                  style={styles.input}
                  value={newNote.title}
                  onChangeText={(text) =>
                    setNewNote((prev) => ({ ...prev, title: text }))
                  }
                />
                <TextInput
                  placeholder="Note Description"
                  placeholderTextColor={COLORS.textGray}
                  style={[styles.input, styles.textArea]}
                  value={newNote.description}
                  multiline
                  numberOfLines={4}
                  onChangeText={(text) =>
                    setNewNote((prev) => ({ ...prev, description: text }))
                  }
                />
                <View style={styles.modalButtons}>
                  <Button
                    mode="outlined"
                    textColor={COLORS.blue}
                    onPress={() => setModalVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor={COLORS.blue}
                    textColor="#000"
                    onPress={handleAddNote}
                  >
                    Add Note
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  header: {
    backgroundColor: COLORS.headerBackground,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 10,
    textAlign: "center", 
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.accent,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoText: {
    color: COLORS.textGray,
    fontSize: 16, 
  },
  infoValue: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loaderText: {
    color: COLORS.accent,
    fontSize: 18,
  },
});

export default AddNotes;
