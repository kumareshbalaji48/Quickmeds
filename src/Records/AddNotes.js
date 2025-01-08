import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  Alert,
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
  black:"#1b1b32",
  lightGray: "#1E2D44",
};

const AddNotes = ({ navigation, route }) => {
  const { setNotes = () => {} } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotesState] = useState([]);

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
    
        let aboutDoc, detailsDoc;
    
        if (isHospitalUser && hospitalId) {
          aboutDoc = await firestore()
            .collection("users")
            .doc("hospital")
            .collection("uid")
            .doc(hospitalId)
            .collection("about")
            .doc(uid)
            .get();
    
          detailsDoc = await firestore()
            .collection("users")
            .doc("hospital")
            .collection("uid")
            .doc(hospitalId)
            .collection("details")
            .doc(uid)
            .get();
        } else {
          aboutDoc = await firestore()
            .collection("users")
            .doc("phone")
            .collection(uid)
            .doc("about")
            .get();
    
          detailsDoc = await firestore()
            .collection("users")
            .doc("phone")
            .collection(uid)
            .doc("details")
            .get();
        }
    
        if (aboutDoc.exists || detailsDoc.exists) {
          const aboutData = aboutDoc.exists ? aboutDoc.data() : {};
          const detailsData = detailsDoc.exists ? detailsDoc.data() : {};
    
          
          setUserDetails({
            ...detailsData,
            name: aboutData.name || "N/A", 
          });
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
    
    const fetchNotes = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) {
          Alert.alert("Error", "User not authenticated!");
          return;
        }
    
        const notesSnapshot = await firestore()
          .collection("users")
          .doc("phone")
          .collection(uid)
          .doc("reminders")
          .collection("notes")
          .get();
    
        const notesList = notesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.timestamp?.toDate().toLocaleDateString(), // Convert timestamp to readable date
          };
        });
    
        setNotesState(notesList);
        setNotes(notesList);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch notes.");
        console.error("Error fetching notes:", error);
      }
    };
    

    fetchUserData();
    fetchNotes();
  }, [navigation]);

  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.description.trim()) {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        Alert.alert("Error", "User not authenticated!");
        return;
      }
  
      const noteData = {
        id: `${Date.now()}`, 
        title: newNote.title.trim(),
        description: newNote.description.trim(),
        timestamp: firestore.Timestamp.now(), 
      };
  
      try {
        
        await firestore()
          .collection("users")
          .doc("phone")
          .collection(uid)
          .doc("reminders")
          .collection("notes")
          .doc(noteData.id)
          .set(noteData);
  

        const addedNoteDoc = await firestore()
          .collection("users")
          .doc("phone")
          .collection(uid)
          .doc("reminders")
          .collection("notes")
          .doc(noteData.id)
          .get();
  
        if (addedNoteDoc.exists) {
          const addedNote = addedNoteDoc.data();
          const noteWithDate = {
            id: addedNoteDoc.id,
            ...addedNote,
            date: addedNote.timestamp.toDate().toLocaleDateString(), 
          };
  
          setNotesState((prevNotes) => [...prevNotes, noteWithDate]);
          setNotes((prevNotes) => [...prevNotes, noteWithDate]);
        }
  
        setNewNote({ title: "", description: "" });
        setModalVisible(false);
      } catch (error) {
        console.error("Error adding note to Firestore:", error);
        Alert.alert("Error", "Failed to add note.");
      }
    } else {
      Alert.alert("Validation Error", "Both title and description are required.");
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
              <Text style={styles.noteDate}>Added on {note.date}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

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
                  placeholderTextColor={COLORS.black}
                  style={styles.input}
                  value={newNote.title}
                  onChangeText={(text) =>
                    setNewNote((prev) => ({ ...prev, title: text }))
                  }
                />
                <TextInput
                  placeholder="Note Description"
                  placeholderTextColor={COLORS.bl}
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
                    textColor="#fff"
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
    backgroundColor: COLORS.textGray,
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
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 6,
    fontFamily:"monospace",
    textAlign: "center",
  },
  headerDivider: {
    height: 1,
    backgroundColor: COLORS.white,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginLeft:5,
  },
  infoText: {
    color: COLORS.black,
    fontSize: 17,
    fontWeight:"semibold",
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
  card: {
    backgroundColor: COLORS.blue,
    marginBottom: 18,
    borderRadius: 10,
    borderWidth: 0.80,
    padding:5,
    borderColor: COLORS.white,
  },
  noteTitle: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: "bold",
    fontFamily:"sans-serif",
  },
  noteDescription: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 10,
  },
  noteDate: {
    fontSize: 13,
    color: COLORS.textGray,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    width:350,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.modalBackground,
  },
  modalCard: {
    width: "91%",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color:COLORS.white,
    marginBottom: 22,
    textAlign: "center",
    fontFamily:"monospace",
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default AddNotes;
