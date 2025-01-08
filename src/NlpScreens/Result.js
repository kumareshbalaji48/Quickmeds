import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button, Card, Portal, Provider, Text } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview'; // WebView to display PDF
import { title } from 'process';

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  cardBlue: "#293C7A",
  accent: "#0FEDED",
  blue: "#4F73DF",
  gray: "#2A2A2A",
};

const Result = ({ route, navigation }) => {
  const { summary } = route.params || {};

  if (!summary) {
    Alert.alert("Error", "No summary received from the Process page.");
    navigation.goBack();
    return null;
  }

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const generateHtml = (summaryText) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #121212;
          color: #FFFFFF;
        }
        .report-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #1E1E1E;
          border: 2px solid #0FEDED;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }
        .report-header {
          text-align: center;
          border-bottom: 2px solid #0FEDED;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .report-header h1 {
          color: #0FEDED;
          font-size: 28px;
          margin: 0;
        }
        .report-header p {
          font-size: 16px;
          color: #BBBBBB;
          margin: 0;
        }
        .report-content {
          line-height: 1.8;
          font-size: 18px;
          color: #FFFFFF;
        }
        .report-content p {
          margin: 10px 0;
          text-align: justify;
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="report-header">
          <h1>Medical Report Summary</h1>
          <p>Confidential - For Patient Use Only</p>
        </div>
        <div class="report-content">
          <p>${summaryText.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    </body>
  </html>
`;

  const generatePdf = async () => {
    try {
      setIsGenerating(true);
      const htmlContent = generateHtml(summary);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      Alert.alert("Success", "PDF generated successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "There was an error generating the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (pdfUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(pdfUri);
    } else {
      Alert.alert("Error", "Sharing is not available or PDF not generated.");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Card style={styles.card}>
            <Card.Title title="Medical Report Summary" subtitle="Generated Report"  />
            <Card.Content>
              <Text style={styles.summaryText}>{summary}</Text>
            </Card.Content>
          </Card>

          <View style={styles.buttonsContainer}>
            <Button
              mode="contained"
              loading={isGenerating}
              onPress={generatePdf}
              style={styles.button}
              icon="file-pdf-box"
            >
              Generate PDF
            </Button>
            <Button
              mode="contained"
              onPress={() => setIsModalVisible(true)}
              style={styles.button}
              icon="eye"
              disabled={!pdfUri}
            >
              View PDF
            </Button>
            <Button
              mode="contained"
              onPress={handleShare}
              style={styles.button}
              icon="share"
              disabled={!pdfUri}
            >
              Share PDF
            </Button>
          </View>
        </ScrollView>

        {/* Modal for PDF Viewer */}
        <Portal>
          <Modal
            visible={isModalVisible}
            animationType="slide"
            onDismiss={() => setIsModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              {pdfUri ? (
                <WebView
                  source={{ uri: pdfUri }}
                  style={styles.webView}
                  onError={() => Alert.alert("Error", "Failed to load PDF.")}
                />
              ) : (
                <Text style={styles.errorText}>No PDF to display</Text>
              )}
            </View>
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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.cardBlue,
    marginBottom: 20,
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryText: {
    fontSize: 18,
    color: COLORS.white,
    lineHeight: 26,
    textAlign: "justify",
    padding: 10,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    marginVertical: 6,
    backgroundColor: COLORS.accent,
    width: "97%"
  },
  modalContainer: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 12,
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
  closeButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  webView: {
    flex: 1,
    width: "100%",
  },
  errorText: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Result;
