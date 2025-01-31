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
import { Text, Button, Card, IconButton, TextInput } from "react-native-paper";
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

const MAX_CHARS = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

const NlpSummarizer = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

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

  const handleTextInput = (inputText) => {
    if (inputText.length <= MAX_CHARS) {
      setText(inputText);
    }
  };

  const handleGenerateSummary = () => {
    if (!file && !text.trim()) {
      Alert.alert("Error", "Please upload a file or enter text to generate a summary.");
      return;
    }

    setIsLoading(true);
    navigation.navigate("Process", {
      file: file,
      text: text,
    });
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

              <Text style={styles.supportText}>
                Only supports .pdf files (Max 10 MB).
              </Text>

              <Text style={styles.orText}>OR</Text>

              <View style={[
                styles.textInputWrapper,
                isFocused && styles.textInputWrapperFocused
              ]}>
                <TextInput
                  mode="flat"
                  multiline
                  numberOfLines={6}
                  style={styles.input}
                  placeholder="Enter medical report text..."
                  placeholderTextColor={COLORS.transparentWhite}
                  value={text}
                  onChangeText={handleTextInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={MAX_CHARS}
                  theme={{
                    colors: {
                      primary: COLORS.blue,
                      text: COLORS.white,
                      placeholder: COLORS.transparentWhite,
                    }
                  }}
                />
              </View>
              
              {text.length > 0 && (
                <Text style={styles.characterCount}>
                  {text.length}/{MAX_CHARS}
                </Text>
              )}
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
    fontFamily: Platform.select({ ios: "System", android: "monospace" }),
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
    fontFamily: Platform.select({ ios: "System", android: "system-ui" }),
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
    fontWeight: "bold",
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
  textInputWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBackground,
    marginBottom: 5,
    borderWidth: 0.8,
    borderColor: COLORS.transparentWhite,
  },
  textInputWrapperFocused: {
    borderColor: COLORS.transparentWhite,
  },
  input: {
    backgroundColor: 'transparent',
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    color: COLORS.white,
  },
  characterCount: {
    fontSize: 14,
    color: COLORS.transparentWhite,
    textAlign: 'right',
    marginBottom: 15,
    marginTop: 2,
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