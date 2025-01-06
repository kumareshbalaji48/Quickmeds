# QuickMeds

Welcome to **QuickMeds**, a React Native Expo project aimed at building a comprehensive patient assistive application. This README provides instructions and important information for setting up and running the application during its initial development phase.

---

## Get Started

### Prerequisites
   
   Follow the eas documentation to install the necessary dependencies , also the platform is a expo development build 
1. **Install npx expo-cli**: Ensure you have `npx expo-cli` installed. You can do this with:
   ```bash
   npm install -g expo-cli
   ```

2. **Login with EAS Credentials**: Log in to your Expo account:
   ```bash
   npx expo login
   ```

3. **Build the Platform for Android**: To generate an APK for the emulator or physical device, use the command:
   ```bash
   npx expo run:android
   ```
   After the build completes, download the APK and install it on your emulator or physical device.

### Install Dependencies

After cloning the repository, run:
```bash
npm install
```

### Run the App

Once the APK is installed on your emulator or device, start the development server with:
```bash
npx expo start
```

---

## Development Notes

This project is currently in its **initial development phase**. Below are the key features and their progress:

### Features Overview

1. **Sign-In with Phone Number**:
   - **Status**: Fully functional.
   - **Details**: Currently uses Firebase for authentication.
   - **Test Credentials**: Since the project is on the Firebase Free (Spark) plan, use the following test credentials for development:
     - Phone Number: `+911234567890`
     - Password: `123456`

2. **Book Appointment**:
   - **Status**: Frontend completed.
   Under the BookAppointment.js file , there is a field "hospitallocation" where the latitude and longitude must be changed according to the hospital location/user location for accessing the AppointmentScreens
   - **Details**: Integration with the web interface for live appointment booking is not yet implemented.

3. **NLP-Based Medical Summarizer**:
   - **Status**: Frontend completed.
   - **Details**: Google Cloud Healthcare API setup is complete, and backend implementation is in its final stages.

4. **Medical Bill and History Management**:
   - **Status**: Backend implementation in progress.
   - **Details**: Bill records and medical history features are in active development.

---

## Development Environment

- **Mobile App**: React Native with Expo Dev Build
- **Backend**: Firebase
- **Editor**: Visual Studio Code
- **Emulator**: Android Studio for testing

---

## Known Limitations

- **Firebase Blaze Plan**: The project currently uses the Free (Spark) plan. This limits scalability and functionality for advanced testing.
- **Feature Completion**:
  - Book Appointment: Frontend done; backend integration pending.
  - NLP Summarizer: Cloud setup complete; backend nearing completion.

---

## Future Plans

- Fully integrate live appointment booking with web interface.
- Complete backend implementation for all features.
- Upgrade to Firebase Blaze Plan for enhanced functionality.
- Expand feature set to include push notifications and detailed analytics.

---

## Community

For any questions or contributions, feel free to join the discussion or raise issues in the repository. Stay tuned for updates as we continue to develop **QuickMeds** into a robust and comprehensive healthcare solution.

