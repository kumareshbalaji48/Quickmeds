import React, { useState,useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { Text, Button, Card, Portal, Modal, Provider, IconButton } from "react-native-paper";
import { WebView } from "react-native-webview";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Speech from 'expo-speech';
import { useNavigation } from "@react-navigation/native";
import CryptoJS from "crypto-js";
import Constants from 'expo-constants';

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  cardBlue: "#1C2A54",
  accent: "#0FEDED",
  blue: "#4F73DF",
  gray: "#2A2A2A",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const Result = ({ route }) => {
  const ENCRYPTION_KEY = Constants.expoConfig?.extra?.ENCRYPTION_KEY;

  const { summary } = route.params || {};
  const [visible, setVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const navigation = useNavigation();
  
  useEffect(() => {
    const verifySecurity = async () => {
      try {
        if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
          Alert.alert(
            "Security Warning", 
            "Encryption secure - proceed with caution",
            [{ text: "OK" }] 
          );
          return;
        }
  
        const testData = "security_test_" + Date.now();
        const encrypted = CryptoJS.AES.encrypt(testData, ENCRYPTION_KEY).toString();
        const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        
        if (decrypted !== testData) {
          Alert.alert("Security Warning", "Encryption verification failed - proceeding with limited security");
        }
      } catch (error) {
        Alert.alert("Security Notice", "Security checks incomplete - functionality may be limited");
      }
    };
    verifySecurity();
  }, [ENCRYPTION_KEY]); // Added navigation to dependencies


  useEffect(() => {
    if (!summary?.trim()) {
      Alert.alert("Error", "No valid medical summary received");
      navigation.goBack();
    }
  }, [summary, navigation]);

  const generateHtml = (summaryText) => `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            padding: 40px 20px;
          }

          .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          }

          .header {
            padding: 40px;
            background: ${COLORS.primary};
            border-radius: 12px 12px 0 0;
            text-align: center;
          }

          .header h1 {
            color: ${COLORS.white};
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .header p {
            color: ${COLORS.accent};
            font-size: 16px;
          }

          .content-section {
            padding: 40px;
          }

          .patient-info {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .report-body {
            margin-top: 30px;
          }

          .section-title {
            color: ${COLORS.primary};
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 15px;
            border-bottom: 2px solid ${COLORS.accent};
            padding-bottom: 8px;
          }

          .report-content {
            font-size: 16px;
            line-height: 1.8;
            color: #444;
          }

          .report-content p {
            margin-bottom: 15px;
            text-align: justify;
          }

          .watermark {
            position: fixed;
            opacity: 0.1;
            font-size: 120px;
            color: ${COLORS.primary};
            transform: rotate(-45deg);
            pointer-events: none;
            z-index: -1;
            top: 40%;
            left: 10%;
          }

          @media print {
            body {
              padding: 0;
            }
            .report-container {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1>Medical Diagnostic Report</h1>
            <p>Confidential Patient Document</p>
          </div>
          
          <div class="content-section">
            <div class="patient-info">
              <h3 style="color: ${COLORS.primary}; margin-bottom: 15px;">Patient Summary</h3>
              <div class="report-body">
                ${summary.split("\n").map((para) => `
                  <div class="report-content">
                    <p>${para}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
        <div class="watermark">MEDICAL REPORT</div>
      </body>
    </html>
  `;

  const generatePDF = async () => {
    try {
      const html = generateHtml(summary);
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Success", "PDF saved to: " + uri);
      }
    } catch (error) {
      console.error("PDF Error:", error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  const speakSummary = async () => {
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      Speech.speak(summary, {
        rate: 0.8,
        pitch: 1,
        onStart: () => console.log('Speech started'),
        onDone: () => setIsSpeaking(false),
        onError: (e) => {
          Alert.alert("Speech Error", e.message);
          setIsSpeaking(false);
        }
      });
    } catch (error) {
      console.error('Speech Failed:', error);
      setIsSpeaking(false);
    }
  };

  const buttonsConfig = [
    { 
      key: "generate", 
      title: "Generate PDF", 
      icon: "file-pdf-box", 
      action: generatePDF,
      color: COLORS.blue
    },
    { 
      key: "preview", 
      title: "Preview", 
      icon: "eye", 
      action: () => setVisible(true),
      color: COLORS.blue
    },
    { 
      key: "speak", 
      title: isSpeaking ? "Stop" : "Speak", 
      icon: isSpeaking ? "stop" : "volume-high", 
      action: speakSummary,
      color: COLORS.blue
    },
    { 
      key: "assistant", 
      title: "AI Assistant", 
      icon: "robot", 
      action: () => navigation.navigate('Assistant', { summary }),
      color: COLORS.blue
    },
  ];

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.card}>
            <Card.Title
              title="Medical Report Summary"
              titleStyle={styles.cardTitle}
              subtitle="Generated Report:"
              subtitleStyle={styles.cardSubtitle}
            />
            <Card.Content>
              <Text style={styles.summaryText}>{summary}</Text>
            </Card.Content>
          </Card>
        </ScrollView>

        <View style={styles.buttonContainer}>
          {buttonsConfig.map((btn) => (
            <View key={btn.key} style={styles.buttonWrapper}>
              <IconButton
                icon={btn.icon}
                size={32}
                mode="contained"
                onPress={btn.action}
                style={[styles.actionButton, { backgroundColor: btn.color }]}
              />
              <Text style={styles.buttonLabel}>{btn.title}</Text>
            </View>
          ))}
        </View>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <WebView 
              originWhitelist={["*"]} 
              source={{ html: generateHtml(summary) }} 
              style={styles.webview}
              startInLoadingState={true}
            />
            <Button
              mode="contained"
              onPress={() => setVisible(false)}
              style={styles.closeButton}
              labelStyle={styles.closeButtonLabel}
            >
              Close Preview
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
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: COLORS.cardBlue,
    borderRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.transparentWhite,
    elevation: 8,
    shadowColor: COLORS.accent,
  },
  cardTitle: {
    fontSize: 22,
    color: COLORS.accent,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: COLORS.white,
    fontSize: 16,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    paddingVertical: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderColor: COLORS.transparentWhite,
  },
  buttonWrapper: {
    alignItems: 'center',
    width: 80,
  },
  actionButton: {
    margin: 4,
    borderRadius: 15,
    elevation: 4,
    width:52
  },
  buttonLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: "90%",
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    margin: 16,
    backgroundColor: COLORS.accent,
  },
  closeButtonLabel: {
    color: COLORS.white,
  },
});

export default Result;