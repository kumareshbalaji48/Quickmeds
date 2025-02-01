import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Text, Button, Card, IconButton, ToggleButton } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";

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
  black: "#000000", 
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const NlpSummarizer = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("ta"); // Default: Tamil
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });

      if (result.canceled) {
        Alert.alert("Upload Cancelled", "No file was selected.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        if (selectedFile.mimeType !== "application/pdf") {
          Alert.alert("Error", "The selected file is not a valid PDF.");
          return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
          Alert.alert("Error", "File size exceeds 10MB limit.");
          return;
        }

        setFile(selectedFile);
        Alert.alert("Success", `PDF file "${selectedFile.name}" uploaded successfully.`);
      } else {
        Alert.alert("Error", "No valid file found in the selection.");
      }
    } catch (error) {
      console.error("File Upload Error:", error);
      Alert.alert("Error", "An error occurred while selecting the file.");
    }
  };

  const handleGenerateSummary = () => {
    if (!file) {
      Alert.alert("Error", "Please upload a file to generate a summary.");
      return;
    }

    setIsLoading(true);
    navigation.navigate("Process", { file });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>NLP Summarizer</Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Media Upload</Text>
                {file && (
                  <IconButton mode="contained-tonal" icon="close-box" onPress={() => setFile(null)} />
                )}
              </View>

              <Text style={styles.subText}>Upload your documents here...</Text>

              <View style={styles.uploadSection}>
                <Image
                  source={require("../../assets/images/reportssection/backup.png")}
                  style={styles.cloudIcon}
                  resizeMode="contain"
                />
                <Text style={styles.uploadText}>
                  Drag your file(s) here or{" "}
                  <Text style={styles.browseLink} onPress={handleFileUpload}>
                    browse
                  </Text>
                </Text>
              </View>

              <Text style={styles.supportText}>Only supports .pdf files (Max 10 MB).</Text>

              <Text style={styles.orText}>ALSO</Text>

              <View style={styles.featureSection}>
  <Text style={styles.featureText}>
    Experience <Text style={styles.highlight}>AI-powered Assistant</Text> with  
    <Text style={styles.highlight}> Text-to-Speech </Text> &  
    <Text style={styles.highlight}> Multilingual Support</Text>.
  </Text>
  <ToggleButton.Row 
    onValueChange={setLanguage}  
    value={language}
  >
    <ToggleButton 
      icon="translate" 
      value="en" 
      style={styles.toggleButton} 
    />
    <ToggleButton 
      icon="alpha-t-box" 
      value="hi" 
      style={styles.toggleButton} 
    />
  </ToggleButton.Row>
</View>

            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleGenerateSummary}
            style={styles.generateButton}
            labelStyle={styles.buttonLabel}
            icon="all-inclusive-box"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Summary"}
          </Button>

          {isLoading && (
            <ActivityIndicator size="large" color={COLORS.green} style={styles.loader} />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    toggleButton: {
      backgroundColor: COLORS.black, 
      borderRadius: 15, 
      borderWidth: 1, 
      borderColor: COLORS.transparentWhite, 
    },
  
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 57,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.transparentWhite,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 28,
    color: COLORS.white,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.textGray,
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
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
    marginBottom: 22,
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
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  supportText: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 18,
  },
  orText: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 14,
  },
  featureSection: {
    alignItems: "center",
  },
  featureText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 10,
  },
  highlight: {
    
    color: COLORS.green,
  },
  generateButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginVertical: 20,
  },
});

export default NlpSummarizer;
