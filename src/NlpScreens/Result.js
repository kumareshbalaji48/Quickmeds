import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Portal } from 'react-native-paper'; 
import { WebView } from 'react-native-webview'; 
import * as Print from 'expo-print'; 
import * as Sharing from 'expo-sharing'; 

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  cardBlue: "#293C7A",
  accent: "#0FEDED",
  blue: "#4F73DF",
  gray: "#2A2A2A",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const Result = ({ route, navigation }) => {
  const fallbackSummary = ` Medical Report Summary for John Doe

  Patient Name: John Doe
  Age: 45
  Gender: Male
  Date: January 2, 2025

  Clinical Summary:
  The patient has been experiencing progressive shortness of breath (dyspnea), chest pain, and occasional difficulty breathing while lying down (orthopnea) over the last six months. Examination revealed abnormal lung sounds (bilateral basilar crackles), diminished breath sounds, and swelling in the lower limbs (moderate edema). The presence of an S3 heart sound raised concerns about potential congestive heart failure (CHF).

  Diagnostic Workup:
  - ECG: Sinus tachycardia with no signs of acute ischemia.
  - Chest X-ray: Cardiomegaly with pulmonary congestion and mild pleural effusion.
  - Echocardiogram: Ejection fraction of 35%, indicating left ventricular dysfunction.
  - BNP: Elevated at 950 pg/mL, confirming heart failure with reduced ejection fraction (HFrEF).

  Management:
  The patient was prescribed ACE inhibitors, beta-blockers, and diuretics to manage symptoms. A cardiology referral was made to consider advanced treatments, including the potential use of an implantable cardioverter-defibrillator (ICD).

  Follow-up:
  A follow-up appointment is scheduled in two weeks to evaluate treatment response and conduct further diagnostic tests.`; 

  const { summary } = route.params || { summary: fallbackSummary };

  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const generateHtml = (summaryText) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            h1 {
              color: #0FEDED;
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 20px;
              text-align: center;
            }
            p {
              font-size: 18px;
              line-height: 1.8;
              margin-bottom: 20px;
              color: #555;
              text-align: justify;
            }
            .section-title {
              color: #157A6E;
              font-weight: bold;
              font-size: 22px;
              margin-top: 30px;
              margin-bottom: 10px;
            }
            .summary-text {
              font-size: 18px;
              margin-bottom: 20px;
              text-align: justify;
              color: #333;
            }
            .content-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .footer {
              font-size: 14px;
              color: #999;
              text-align: center;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="content-container">
            <h1>Medical Report Summary</h1>
            <p><strong>Patient Name:</strong> John Doe</p>
            <p><strong>Age:</strong> 45</p>
            <p><strong>Gender:</strong> Male</p>
            <p><strong>Date:</strong> January 2, 2025</p>
            
            <div class="section-title">Clinical Summary</div>
            <p class="summary-text">${summaryText}</p>
            
            <div class="section-title">Diagnostic Workup</div>
            <p class="summary-text">
              - ECG: Sinus tachycardia with no signs of acute ischemia.<br>
              - Chest X-ray: Cardiomegaly with pulmonary congestion and mild pleural effusion.<br>
              - Echocardiogram: Ejection fraction of 35%, indicating left ventricular dysfunction.<br>
              - BNP: Elevated at 950 pg/mL, confirming heart failure with reduced ejection fraction (HFrEF).
            </p>
            
            <div class="section-title">Management</div>
            <p class="summary-text">
              The patient was prescribed ACE inhibitors, beta-blockers, and diuretics to manage symptoms. A cardiology referral was made to consider advanced treatments, including the potential use of an implantable cardioverter-defibrillator (ICD).
            </p>
            
            <div class="section-title">Follow-up</div>
            <p class="summary-text">
              A follow-up appointment is scheduled in two weeks to evaluate treatment response and conduct further diagnostic tests.
            </p>
          </div>
  
          <div class="footer">Generated on: ${new Date().toLocaleDateString()}</div>
        </body>
      </html>
    `;
  };

  const generatePdf = async () => {
    try {
      setIsGenerating(true);

      const htmlContent = generateHtml(summary);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      setPdfUri(uri);
      Alert.alert("Success", "PDF generated successfully. You can now view or download it.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "There was an error generating the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const openPdfModal = () => {
    if (pdfUri) {
      setIsModalVisible(true);
    } else {
      Alert.alert("Error", "Please generate the PDF first.");
    }
  };

  const closePdfModal = () => {
    setIsModalVisible(false);
  };

  const handlePrint = async () => {
    if (pdfUri) {
      await Print.printAsync({ uri: pdfUri });
    } else {
      Alert.alert("Error", "Please generate the PDF first.");
    }
  };

  const handleShare = async () => {
    if (pdfUri && Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri);
    } else {
      Alert.alert("Error", "Sharing is not available or PDF not generated.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.summary}>{summary}</Text>
      </ScrollView>

      <Portal>
        {isModalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closePdfModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <WebView
                source={{ html: generateHtml(summary) }}
                style={styles.webview}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                startInLoadingState={true}
                renderLoading={() => <Text>Loading...</Text>}
              />
            </View>
          </View>
        )}
      </Portal>

      <View style={styles.buttonsContainer}>
        <Button
          title={isGenerating ? "Generating..." : "Generate PDF"}
          onPress={generatePdf}
          disabled={isGenerating}
          color={COLORS.transparentWhite}
        />
        <TouchableOpacity
          style={[styles.btn, !pdfUri && styles.btnDisabled]}
          onPress={openPdfModal}
          disabled={!pdfUri}
        >
          <Text style={styles.btnText}>View PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, !pdfUri && styles.btnDisabled]}
          onPress={handlePrint}
          disabled={!pdfUri}
        >
          <Text style={styles.btnText}>Print PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, !pdfUri && styles.btnDisabled]}
          onPress={handleShare}
          disabled={!pdfUri}
        >
          <Text style={styles.btnText}>Share PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  scrollViewContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  summary: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
    color: COLORS.white,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.blue,
  },
  webview: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
  },
  btn: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
    borderRadius: 5,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#D3D3D3',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Result;
