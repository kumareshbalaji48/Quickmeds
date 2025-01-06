/*
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import auth from "@react-native-firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#BEBD88",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});









const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParser = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({
  dest: path.join(__dirname, "uploads"),
});

// Initialize GoogleGenerativeAI with the API Key
const genAI = new GoogleGenerativeAI("AIzaSyC5A8pXhr9W_ebEx90OPQQ_Mi_jfoHF3oA"); // Ensure this API key is valid

app.post("/backend", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const filePath = req.file.path;

  try {
    // Read and parse the PDF
    const fileBuffer = fs.readFileSync(filePath);
    const data = await pdfParser(fileBuffer);
    const extractedText = data.text;
    
    if (!extractedText || extractedText.trim() === "") {
      return res.status(400).send({ message: "No valid text found in the PDF." });
    }

    console.log("Extracted Text:", extractedText);

    // Use GoogleGenerativeAI to generate text summary
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (!model) {
      return res.status(500).send({ message: "Model initialization failed." });
    }

    // Attempt summarization
    const result = await model.generateContent(extractedText);
    const summary = result?.response?.text;

    // Send the summary as the response, or navigate back without summary if not generated
    if (summary) {
      return res.json({ summary });
    } else {
      return res.json({ message: "Summary generation failed" });
    }
  } catch (error) {
    console.error("Error during processing:", error);
    return res.status(500).json({ message: "Error processing the PDF." });
  } finally {
    // Clean up: Delete the file after processing
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Error deleting the uploaded file:", unlinkErr);
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://192.168.1.7:${port}`);
});

*/