import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";

const doctors = [
  {
    id: "1",
    name: "Dr. Stone Gaze",
    specialty: "Ear, Nose & Throat specialist",
    price: "IDR. 120.000",
    rating: 4.5,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Dr. Stone Gaze",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor2.png"),
    isAvailable: false,
  },
  {
    id: "3",
    name: "Dr. Wahyu",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor3.png"),
    isAvailable: true,
  },
  {
    id: "4",
    name: "Dr. Reza Razor",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor4.png"),
    isAvailable: true,
  },
  {
    id: "5",
    name: "Dr. Jacky Cun",
    specialty: "Ear, Nose & Throat specialist",
    price: "INR. 120.00",
    rating: 4.5,
    image: require("../../assets/doctor5.png"),
    isAvailable: false,
  },
];

export default function DoctorsList({ navigation }) {
  const handlePress = (doctor) => {
    navigation.navigate("DoctorDetails", { doctor });
  };

  return (
    <View>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            disabled={!item.isAvailable}
          >
            <Text>
              {item.name} - {item.isAvailable ? "Available" : "Unavailable"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
