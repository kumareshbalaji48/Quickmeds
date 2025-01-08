import React, { useState } from "react";
import { View, StyleSheet, ScrollView,Image } from "react-native";
import { Text, Button, Divider, Card, Portal, Modal, Provider } from "react-native-paper";
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

const BILL_STATEMENT = {
  patientName: "Kumaresh B",
  accountNumber: "01-2345678",
  date: "2024-12-20",
  serviceDate: "07/29/14 to 07/30/14",
  consultationType: "Men's Health",
  doctorName:"Joseph Kurvila",
  description:
    "Consultation for men's health services. Includes a general health checkup.",
  services: [
    { name: "Radiology", amount: "764.00 INR" },
    { name: "Therapy Services", amount: "754.00 INR" },
  ],
  amount: "1,518.00 INR",
  adjustments: "-68.00 INR",
  insurancePayments: "1,300.00 INR",
  patientPayments: "0.00 INR",
  balanceDue: "150.00 INR",
  primaryInsurance: "Covered under Primary Plan",
  secondaryInsurance: "No secondary insurance",
};


const generateHTML = () => {
  const logoURI = Image.resolveAssetSource(require('../../assets/images/quickmeds.png')).uri;
  return `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          padding: 20px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header img {
          max-height: 100px;
        }
        .header div {
          text-align: right;
        }
        .section {
          margin-top: 20px;
        }
        .section-title {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 10px;
          color: #293C7A;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .table th, .table td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        .table th {
          background-color: #f4f4f4;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${logoURI}" alt="Company Logo">
        <div>
          <h2>ACME HealthCare</h2>
          <p>1234 Street Avenue<br>Seattle, WA 98101</p>
          <p>Phone: 555-555-5555</p>
        </div>
      </div>

      <div class="section">
        <p><strong>Patient Name:</strong> ${BILL_STATEMENT.patientName}</p>
        <p><strong>Account Number:</strong> ${BILL_STATEMENT.accountNumber}</p>
        <p><strong>Statement Date:</strong> ${BILL_STATEMENT.date}</p>
      </div>

      <div class="section">
        <h3 class="section-title">Summary of Patient Services</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${BILL_STATEMENT.services
              .map(
                (service) => `
              <tr>
                <td>${service.name}</td>
                <td>${service.amount}</td>
              </tr>
              `
              )
              .join('')}
          </tbody>
          <tfoot>
            <tr>
              <th>Total Charges</th>
              <th>${BILL_STATEMENT.amount}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="section">
        <h3 class="section-title">Account Summary</h3>
        <table class="table">
          <tbody>
            <tr>
              <td>Service Date</td>
              <td>${BILL_STATEMENT.serviceDate}</td>
            </tr>
            <tr>
              <td>Type of Service</td>
              <td>${BILL_STATEMENT.consultationType}</td>
            </tr>
            <tr>
              <td>Adjustments</td>
              <td>${BILL_STATEMENT.adjustments}</td>
            </tr>
            <tr>
              <td>Insurance Payments</td>
              <td>${BILL_STATEMENT.insurancePayments}</td>
            </tr>
            <tr>
              <td>Patient Payments</td>
              <td>${BILL_STATEMENT.patientPayments}</td>
            </tr>
            <tr>
              <td>Balance Due</td>
              <td>${BILL_STATEMENT.balanceDue}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3 class="section-title">Insurance Information</h3>
        <p><strong>Primary:</strong> ${BILL_STATEMENT.primaryInsurance}</p>
        <p><strong>Secondary:</strong> ${BILL_STATEMENT.secondaryInsurance}</p>
      </div>

      <div class="footer">
        <p>Customer Service: 555-555-5560</p>
        <p>Pay Your Bill: 555-555-5561</p>
        <p>Financial Assistance: 555-555-5562</p>
        <p>Visit <a href="https://www.acme.net/paymybill">www.acme.net/paymybill</a> for online payments.</p>
      </div>
    </body>
  </html>
  `;
};


const generatePDF = async () => {
  const html = generateHTML();
  try {
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const BillPdf = () => {
  const [visible, setVisible] = useState(false);
  const [htmlContent] = useState(generateHTML());

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <Provider>
      <View style={styles.container}>
        
        <ScrollView>
          <Text style={styles.header}>Bill Statement</Text>
          <Divider style={styles.divider} />
          <Text style={styles.description}>Date: {BILL_STATEMENT.date}</Text>
          <Text style={styles.description}>Consultation Type: {BILL_STATEMENT.consultationType}</Text>
          <Text style={styles.description}>Doctor: {BILL_STATEMENT.doctorName}</Text>
          <Text style={styles.description}>{BILL_STATEMENT.description}</Text>
          {BILL_STATEMENT.services.map((service, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>{service.name}</Text>
                <View style={styles.valueRow}>
                  <Text style={styles.valueLabel}>Amount</Text>
                  <Text style={styles.valueText}>{service.amount}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Total Amount</Text>
              <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Total</Text>
                <Text style={styles.valueText}>{BILL_STATEMENT.amount}</Text>
              </View>
            </Card.Content>
          </Card>
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
          mode="contained-tonal"
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
    marginBottom: 12,
    fontFamily: "monospace",
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
    borderColor: COLORS.white,
    borderWidth: 0.5,
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

export default BillPdf;
