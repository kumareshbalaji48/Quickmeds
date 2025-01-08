import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Divider, Card, Portal, Modal, Provider } from "react-native-paper"; // Added Provider import
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  cardBlue: "#293C7A",
  accent: "#0FEDED",
  blue: "#4F73DF",
  gray: "#2A2A2A",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const DETAILED_REPORT = {
  title: "Blood Test",
  description:
    "Blood test reveals normal parameters; no abnormalities detected. Hemoglobin levels are adequate. Cholesterol and glucose readings are within healthy ranges. Overall, results indicate stable health.",
  sections: [
    {
      title: "Glucose",
      values: [
        { label: "Fasting Levels", value: "12 mg/dL" },
        { label: "Oral Glucose Tolerance Test (OGTT)", value: "6 mg/dL" },
        { label: "Hemoglobin A1c (HbA1c)", value: "16 mg/dL" },
      ],
    },
    {
      title: "Electrolytes",
      values: [
        { label: "Sodium", value: "10%" },
        { label: "Potassium", value: "23%" },
        { label: "Chloride", value: "12%" },
      ],
    },
    {
      title: "Liver Enzymes",
      values: [
        { label: "ALT", value: "6%" },
        { label: "AST", value: "19%" },
        { label: "ALP", value: "12%" },
        { label: "Bilirubin", value: "14%" },
      ],
    },
  ],
};


const generateHTML = () => {
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          line-height: 1.6;
        }
        h1 {
          color: #0FEDED;
          font-size: 32px;
          margin-bottom: 20px;
        }
        h2 {
          color: #293C7A;
          margin-top: 25px;
          font-size: 24px;
        }
        p {
          font-size: 18px;
          margin-bottom: 25px;
          color: #333;
        }
        .section-title {
          color: #157A6E;
          font-weight: bold;
          font-size: 22px;
          margin-top: 20px;
        }
        .values {
          margin-top: 15px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 15px;
        }
        .values span {
          display: block;
          font-size: 16px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <h1>${DETAILED_REPORT.title}</h1>
      <p>${DETAILED_REPORT.description}</p>
      ${DETAILED_REPORT.sections
        .map(
          (section) => ` 
          <h2 class="section-title">${section.title}</h2>
          <div class="values">
            ${section.values
              .map(
                (value) =>
                  `<span>${value.label} ................................................ ${value.value}</span>`
              )
              .join("")}
          </div>
        `
        )
        .join("")}
    </body>
  </html>

  `;
};


const generatePDF = async () => {
  const html = generateHTML();
  try {
    
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
    
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate or share the PDF. Please try again.");
  }
};

const Test = () => {
  const [visible, setVisible] = useState(false);
  const [htmlContent] = useState(generateHTML());

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <Provider> 
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.header}>{DETAILED_REPORT.title}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.description}>{DETAILED_REPORT.description}</Text>
          {DETAILED_REPORT.sections.map((section, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.values.map((value, idx) => (
                  <View key={idx} style={styles.valueRow}>
                    <Text style={styles.valueLabel}>{value.label}</Text>
                    <Text style={styles.valueText}>{value.value}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <Button
          mode="contained"
          buttonColor={COLORS.transparentWhite}
          textColor="#000"
          onPress={showModal}
          icon="eye"
          style={styles.generateButton}
          accessibilityLabel="Preview the generated PDF document"
        >

        <Text style={{ color: "#000" }}>Preview PDF</Text>
        </Button>

        <Button
          mode="contained"
          buttonColor={COLORS.transparentWhite}
          textColor="#000"
          onPress={generatePDF}
          icon="file-pdf-box"
          style={styles.generateButton}
        >
          <Text style={{ color: "#000" }}>Generate PDF</Text>
        </Button>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
            accessibilityLabel="PDF preview modal"
          >
            <WebView
              originWhitelist={["*"]}
              source={{ html: htmlContent }}
              style={{ flex: 1 }}
            />
            <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  header: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily:"monospace",
  },
  divider: {
    backgroundColor: COLORS.white,
    marginVertical: 10,
    height: 1,
  },
  description: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBlue,
    marginBottom: 15,
    borderRadius: 12,
    padding: 10,
    borderColor:COLORS.white,
    borderWidth:0.50,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.accent,
    fontWeight: "bold",
    marginBottom: 10,
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  valueLabel: {
    color: COLORS.transparentWhite,
    fontSize: 14,
  },
  valueText: {
    color: COLORS.transparentWhite,
    fontSize: 14,
  },
  generateButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: "hidden",
    padding: 15,
    maxHeight: "90%",
  },
  closeButton: {
    margin: 10,
    borderRadius: 25,
    backgroundColor: COLORS.accent,
  },
});

export default Test;
