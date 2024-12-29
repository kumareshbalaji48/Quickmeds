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

const COLORS = {
  primary: "#0A1128",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#1849D6",
  green: "#157A6E",
  red: "#B53737",
  cardBackground: "#1E293B",
  lightGray: "#64748B",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const NlpSummarizer = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.type === "success") {
        setFile(result);
      } else {
        Alert.alert("Upload Cancelled", "Please upload a valid PDF file.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while uploading the file.");
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
      <Text style={{fontFamily:"monospace",fontWeight:"bold",fontSize:28,color:COLORS.white,marginBottom:10,textAlign: "center"}}>NLP Summarizer</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Media Upload</Text>
            {file && (
              <IconButton
                icon="close"
                color={COLORS.white}
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
            placeholderTextColor={COLORS.lightGray}
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
    marginBottom: 110,
    borderBottomColor: COLORS.transparentWhite,
    borderWidth: 1,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 15,
    marginBottom:30,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.blue,
  },
  subText: {
    fontSize: 18,
    color: COLORS.transparentWhite,
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
    borderColor: COLORS.lightGray,
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
    color: COLORS.transparentWhite,
    textAlign: "center",
    marginBottom: 20,
  },
  orText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.transparentWhite,
    textAlign: "center",
    marginBottom: 14,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: COLORS.gray,
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
