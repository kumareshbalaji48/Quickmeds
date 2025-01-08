import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Text, Button, Card, IconButton } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { color } from "react-native-elements/dist/helpers";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#1849D6",
  green: "#157A6E",
  textGray: "rgba(255, 255, 255, 0.7)",
  red: "#B53737",
  cardBackground: "#1E293B",
  lightGray: "#64748B",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const NlpSummarizer = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
  
      console.log("DocumentPicker Result:", result);
  
      if (result.canceled) {
        Alert.alert("Upload Cancelled", "No file was selected.");
        return;
      }
  
      // Ensure assets exist and access the first file
      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
  
        if (selectedFile.mimeType === "application/pdf") {
          setFile(selectedFile); // Set the file in state
          Alert.alert("Success", `PDF file "${selectedFile.name}" uploaded successfully.`);
        } else {
          Alert.alert("Error", "The selected file is not a valid PDF.");
        }
      } else {
        Alert.alert("Error", "No valid file found in the selection.");
      }
    } catch (error) {
      console.error("File Upload Error:", error);
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };
  
  
  
  
  
  

  const handleUrlUpload = () => {
    if (!url) {
      Alert.alert("Error", "Please enter a valid URL.");
      return;
    }
    Alert.alert("Success", "File uploaded from URL.");
  };

  const handleGenerateSummary = () => {
    if (!file && !url) {
      Alert.alert("Error", "Please upload a file or provide a URL to generate a summary.");
      return;
    }

    
    navigation.navigate("Process", {
      file: file, 
      url: url,   
    });
    
    setIsLoading(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} >
      <Text style={{fontFamily:"monospace",fontWeight:"bold",fontSize:28,color:COLORS.white,marginBottom:10,textAlign: "center",}}>NLP Summarizer</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Media Upload</Text>
            {file && (
              <IconButton
              mode="contained-tonal"
                icon="close-box"
                onPress={() => setFile(null)}
              />
            )}
          </View>

          <Text style={styles.subText}>Add your documents here...</Text>

          <View style={styles.uploadSection}>
            <Image
              source={require("../../assets/images/reportssection/backup.png")} // Replace with the correct path to your uploaded cloud image
              style={styles.cloudIcon}
            />
            <Text style={styles.uploadText}>
              Drag your file(s) here or{" "}
              <Text
                style={styles.browseLink}
                onPress={handleFileUpload}
              >
                browse
              </Text>
            </Text>
          </View>

          <Text style={styles.supportText}>
            Only supports .pdf files (Max 10 MB).
          </Text>

          <Text style={styles.orText}>OR</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter file URL..."
            placeholderTextColor={COLORS.transparentWhite}
            value={url}
            onChangeText={(text) => setUrl(text)}
          />
          <Button
            mode="contained"
            onPress={handleUrlUpload}
            style={styles.urlButton}
            labelStyle={styles.buttonLabel}
          >
            Upload
          </Button>
        </Card.Content>
      </Card>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.green} style={styles.loader} />
      ) : (
        <Button
          mode="contained"
          onPress={handleGenerateSummary}
          style={styles.generateButton}
          labelStyle={styles.buttonLabel}
          icon="all-inclusive-box"
        >
          Generate Summary
        </Button>
      )}
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
    marginBottom: 57,
    borderBottomColor: COLORS.transparentWhite,
    borderWidth: 1,
  },
  card: {
    backgroundColor: COLORS.textGray,
    borderRadius: 15,
    padding: 15,
    marginBottom:25,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.blue,
    fontFamily:"system-ui",
  },
  subText: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  uploadSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 23,
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
    borderStyle: "dashed",
  },
  cloudIcon: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 16,
    color: COLORS.transparentWhite,
    textAlign: "center",
  },
  browseLink: {
    color: COLORS.blue,
    fontWeight:"bold",
    textDecorationLine: "underline",
  },
  supportText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 20,
  },
  orText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 14,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    
  },
  urlButton: {
    backgroundColor: COLORS.lightGray,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
  },
  loader: {
    marginVertical: 20,
  },
});

export default NlpSummarizer;
