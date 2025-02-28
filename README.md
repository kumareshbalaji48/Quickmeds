# QuickMeds
Welcome to **QuickMeds**, a React Native Expo project aimed at building a **comprehensive patient assistive application**. This README provides instructions and essential information for setting up and running the application during its **initial development phase**.

---
## 🚀 Get Started
### Prerequisites
- Follow the **Expo Application Services (EAS)** documentation to install necessary dependencies.
- The platform is an **Expo Development Build**, consist of various Expo libraries.

### Install `npx expo-cli`
Ensure you have `npx expo-cli` installed:
```sh
npm install -g expo-cli
```

### Login with EAS Credentials
Log in to your Expo account:
```sh
npx expo login
```

### Build the Platform for Android
To generate an APK for the emulator or physical device:
```sh
npx expo run:android
```
After the build completes, download the APK and install it on your **emulator or physical device**.

### Install Dependencies
After cloning the repository, run:
```sh
npm install
```

### Run the App
Once the APK is installed on your **emulator or device**, start the development server with:
```sh
npx expo start
```

---
## 📌 Features Overview
### ✅ **Sign-In with Phone Number**
- **Status**: Fully functional.
- **Details**: Uses **Firebase Authentication** for phone-based login.
- **Test Credentials**: Since the project is on the Firebase Free (Spark) plan, use the following for development:
  - **Phone Number**: +911234567890
  - **Password**: 123456

### 📅 **Book Appointment**
- **Status**: ongoing.
- **Details**:
  - The appointment feature requires the **user to be in the specified geolocation** to access it.
  - The geolocation check is performed using **latitude and longitude** using haversine formula specified in `src/BookAppointment.js`.
  - Ensure you **edit the hospital location** field in the code to reflect the correct coordinates.
  - This ensures a seamless booking experience while maintaining accuracy in **hospital-based location constraints**.

### 💳 **Medical Bill & History Management**
- **Status**: Backend implementation in progress.
- **Details**:
  - Users can **view and manage their medical bill history** within the app.
  - Secure storage of **billing data** for easy reference.
  - Integration with Firebase for **cloud-based storage and retrieval**.

### 📜 **NLP-Based Medical Summarizer**
- **Status**: Completed.
- **Details**:
  - Requires **setting up a billing account in Google Cloud Platform (GCP)**.
  - Create a **service account** for the project after enabling **Cloud Healthcare NLP**.
  - The backend processes the uploaded **medical reports** and provides a **layman-friendly summary**.
  - **GCP Function Guide**: [How to Run a GCP Function](https://cloud.google.com/functions/docs/quickstart)
  - Setup Steps:
    1. Enable **Cloud Healthcare NLP API** in GCP.
    2. Create **Service Account** and download credentials.
    3. Deploy backend using Node.js (steps below).

### 🤖 **AI Chatbot (Gemini Integration)**
- **Status**: Implementation done .
- **Details**:
  - The chatbot feature requires setting up **Google Gemini API**.
  - This allows users to **ask questions about their medical summaries** for better understanding.
  - Requires API key integration and secure request handling.

---
## 🛠 **Setting Up Development Environment**
- Ensure your system meets the **Node.js and Firebase CLI requirements**.
- Clone the repository and navigate to the backend folder:
```sh
cd src/backend
```
- Install dependencies:
```sh
npm install
```
- Run the backend service:
```sh
node app.js
```

---
## 📲 **Expo Development Build Setup**
Since the application requires **advanced Expo libraries**, ensure your setup includes:
- **Expo EAS services**: Setting up EAS credentials is required for the expo dev build .
- **Expo Libraries Used**: `expo-speech`, `expo-share`, `expo-print`, `expo-location`, etc.
- **Install EAS CLI**:
```sh
npx expo install -g eas-cli
```
- **Login to EAS**:
```sh
eas login
```
- **Build Platform for Android**:
```sh
eas build -p android
```
- **Use the generated APK** to run the application.

📖 **Useful References**:
- [EAS Documentation](https://docs.expo.dev/eas/)
- [Expo Development Documentation](https://docs.expo.dev/development/build/)

---
## 🚧 **Known Limitations**
- **Firebase Free (Spark) Plan**: The project is currently limited in scalability due to the **Spark Plan**.
- **Feature Completion Status**:
  - **Book Appointment**: Frontend complete; backend integration pending.
  - **NLP Summarizer**: Cloud and query resolution chatbot setup complete , RAG chatbot is under development .

---
## 🌟 **Future Plans**
- **Fully integrate** live appointment booking with dynamic thresholds for government hospitals is planned eith Doctor's web interface.
- **Complete backend** implementation for all features.
- **Upgrade to Firebase Blaze Plan** for enhanced scalability.
- **Expand feature set** to include push notifications and analytics using firebase cloud messaging.

---
## 👥 **Community & Contributions**
For questions, feedback, or contributions, feel free to **join the discussion** or raise issues in the repository.

Stay tuned as we continue to develop **QuickMeds** into a **robust and comprehensive healthcare solution**! 🚀

