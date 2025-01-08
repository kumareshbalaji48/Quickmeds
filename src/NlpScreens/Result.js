import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Button, Divider, Card, Portal, Modal, Provider } from "react-native-paper";
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  cardBlue: "#1C2A54",
  accent: "#0FEDED",
  blue: "#4F73DF",
  gray: "#2A2A2A",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const Result = ({ route, navigation }) => {
  const { summary } = route.params || {};

  if (!summary) {
    Alert.alert("Error", "No summary received from the Process page.");
    navigation.goBack();
    return null;
  }

  const generateHtml = (summaryText) => `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #101820;
            color: #FFFFFF;
            line-height: 1.8;
          }
          .report-container {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            background-color: #1E1E1E;
            border: 3px solid #0FEDED;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(15, 237, 237, 0.4);
          }
          .report-header {
            text-align: center;
            border-bottom: 2px solid #0FEDED;
            margin-bottom: 25px;
          }
          .report-header h1 {
            font-size: 32px;
            color: #0FEDED;
            margin-bottom: 10px;
          }
          .report-content {
            font-size: 20px;
            text-align: justify;
            letter-spacing: 0.5px;
          }
          .report-content p {
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>Medical Report Summary</h1>
          </div>
          <div class="report-content">
            ${summaryText.split("\n").map((para) => `<p>${para}</p>`).join("")}
          </div>
        </div>
      </body>
    </html>
  `;

  const [visible, setVisible] = useState(false);
  const [htmlContent] = useState(generateHtml(summary));

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const generatePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      Alert.alert("Success", "PDF generated successfully.");

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate the PDF.");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView>
          <Card style={styles.card}>
            <Card.Title
              title="Medical Report Summary"
              titleStyle={{ fontSize: 24, color: COLORS.accent,fontWeight:"bold"

               }
              
              }
              subtitle="Generated Report :"
              subtitleStyle={{fontSize:18,color:COLORS.white,fontWeight:"ultralight"}}
            />
            <Card.Content>
              <Text style={styles.summaryText}>{summary}</Text>
            </Card.Content>
          </Card>
        </ScrollView>

        <Button
          mode="contained"
          buttonColor={COLORS.transparentWhite}
          textColor="#000"
          onPress={showModal}
          icon="eye"
          style={styles.button}
        >
          Preview PDF
        </Button>

        <Button
          mode="contained"
          buttonColor={COLORS.transparentWhite}
          textColor="#000"
          onPress={generatePDF}
          icon="file-pdf-box"
          style={styles.button}
        >
          Generate PDF
        </Button>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
            accessibilityLabel="PDF preview modal"
          >
            <WebView originWhitelist={["*"]} source={{ html: htmlContent }} style={{ flex: 1 }} />
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.closeButton}
              textColor="#FFF"
              buttonColor={COLORS.accent}
            >
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
    padding: 18,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBlue,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderColor: COLORS.transparentWhite,
    borderWidth: 0.8,
    shadowColor: "#0FEDED",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  summaryText: {
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 28,
    textAlign: "justify",
  },
  button: {
    marginTop: 10,
    padding: 8,
    borderRadius: 30,
    width: "98%",
    alignSelf: "center",
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    overflow: "hidden",
    maxHeight: "90%",
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 28,
    width: "55%",
    alignSelf: "center",
  },

});

export default Result;
