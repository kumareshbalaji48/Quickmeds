import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Slider, Button } from "react-native-elements";

const COLORS = { primary: '#020E22', white: '#fff', blue: "#4F73DF" };

const AddDetails = ({ navigation }) => {
  const [hasDetails, setHasDetails] = useState(false);
  const [gender, setGender] = useState("Female");
  const [age, setAge] = useState(18);
  const [weight, setWeight] = useState(50);
  const [height, setHeight] = useState(160);
  const [bloodType, setBloodType] = useState("O+");
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = auth().currentUser;
  const userId = currentUser?.uid;
  const isHospitalUser = currentUser?.email?.includes("@hospital.com");
  const hospitalId = isHospitalUser ? currentUser?.email.split("@")[0] : null;

  const getUserRef = () => {
    if (isHospitalUser) {
      return firestore()
        .collection("users")
        .doc("hospital")
        .collection("uid")
        .doc(hospitalId)
        .collection("details")
        .doc(userId);
    } else {
      return firestore()
        .collection("users")
        .doc("phone")
        .collection(userId)
        .doc("details");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userRef = getUserRef();
        const doc = await userRef.get();

        if (doc.exists) {
          const data = doc.data();
          setGender(data.gender || "Female");
          setAge(data.age || 18);
          setWeight(data.weight || 50);
          setHeight(data.height || 160);
          setBloodType(data.bloodType || "O+");
          setHasDetails(true);

          const updatedData = {
            gender: data.gender || "Female",
            age: data.age || 18,
            weight: data.weight || 50,
            height: data.height || 160,
            bloodType: data.bloodType || "O+",
          };

          if (
            !data.gender ||
            !data.age ||
            !data.weight ||
            !data.height ||
            !data.bloodType
          ) {
            await userRef.set(updatedData, { merge: true });
          }
        } else {
          setHasDetails(false);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Unable to fetch details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isHospitalUser, userId, hospitalId]);

  const saveDetails = async () => {
    if (!gender || !bloodType || age <= 0 || weight <= 0 || height <= 0) {
      Alert.alert("Error", "Please fill in all fields with valid values before saving.");
      return;
    }

    setIsLoading(true);
    try {
      const userRef = getUserRef();
      await userRef.set({
        gender,
        age,
        weight,
        height,
        bloodType,
      });

      Alert.alert("Success", "Details saved successfully!");
      navigation.replace("Profile");
    } catch (error) {
      console.error("Error saving details:", error);
      Alert.alert("Error", "Something went wrong while saving details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  if (!hasDetails) {
    return (
      <View style={styles.detailcontainer}>
        <View style={styles.imageWrapper}>
          <Image source={require("../../assets/images/norecord.png")} style={styles.icon} />
        </View>
        <Text style={styles.title}>You Have Not Added Any Details</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setHasDetails(true)}>
          <Text style={styles.buttonText}>Add Records</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headertext}>Add Record</Text>
      </View>

      <Text style={styles.label}>What is your gender</Text>
      <View style={styles.genderContainer}>
        {['Male', 'Female', 'Other'].map((option) => (
          <Button
            key={option}
            title={option}
            type={gender === option ? 'solid' : 'outline'}
            onPress={() => setGender(option)}
            buttonStyle={styles.genderButton}
            titleStyle={{ color: gender === option ? '#fff' : '#00bcd4' }}
          />
        ))}
      </View>

      <Text style={styles.label}>How old are you</Text>
      <Slider
        value={age}
        onValueChange={(value) => setAge(Math.round(value))}
        minimumValue={0}
        maximumValue={100}
        step={1}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
      />
      <Text style={styles.sliderValue}>{age}</Text>

      <Text style={styles.label}>What is your weight</Text>
      <Slider
        value={weight}
        onValueChange={(value) => setWeight(Math.round(value))}
        minimumValue={0}
        maximumValue={200}
        step={1}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
      />
      <Text style={styles.sliderValue}>{weight} kg</Text>

      <Text style={styles.label}>What is your height</Text>
      <Slider
        value={height}
        onValueChange={(value) => setHeight(Math.round(value))}
        minimumValue={0}
        maximumValue={200}
        step={1}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
      />
      <Text style={styles.sliderValue}>{height} cm</Text>

      <Text style={styles.label}>What is your blood type</Text>
      <TextInput
        style={styles.input}
        value={bloodType}
        onChangeText={setBloodType}
        placeholder="Enter blood type"
        placeholderTextColor="#888"
      />

      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        onPress={saveDetails}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loaderText: {
    color: COLORS.white,
    marginTop: 10,
    fontSize: 18,
  },
  detailcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
  },
  imageWrapper: {
    marginBottom: 80,
  },
  icon: {
    height: 300,
    width: 300,
    resizeMode: "contain",
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 26,
    width: "85%",
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontWeight: "bold", fontSize: 20 },
  header: {
    marginBottom: 40,
    borderBottomColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    alignItems: "center",
  },
  headertext: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: "monospace",
    marginBottom: 13,
    marginTop: 13,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 18,
    fontWeight: "bold"
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderButton: {
    width: 110,
    borderRadius: 30,
    borderColor: "#00bcd4",
    borderWidth: 1,
  },
  sliderValue: {
    textAlign: 'center',
    color: "#00bcd4",
    marginBottom: 20,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#00bcd4',
  },
  track: {
    height: 5,
    backgroundColor: '#00bcd4',
  },
  input: {
    backgroundColor: '#1E2A47',
    borderRadius: 10,
    color: COLORS.white,
    padding: 10,
    marginBottom: 28,
    borderColor: COLORS.white,
    borderWidth: 0.2,
  },
  saveButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 30,
    paddingVertical: 12,
  },
});

export default AddDetails;
