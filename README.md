QuickMeds - Doctor's Web Dashboard
Overview
The QuickMeds Web Dashboard is designed for government hospital doctors to efficiently manage patient appointments, monitor real-time queues, and access medical records seamlessly. This system integrates AI-powered intelligent token scheduling, medical report extraction for analysis .

Features
1. Doctor Authentication & Secure Login
Secure login using Firebase Authentication.
Role-based access control ensuring only authorized doctors can access patient data.
2. Live Patient Queue & Smart Appointment Management
Real-time patient monitoring using a geolocation-driven token system.
Dynamic appointment allocation based on doctor availability, ensuring efficient scheduling.
Live status updates for patients on appointment progress.
3. NLP powered Medical Report extraction
Integrated Google Healthcare NLP medical report entity extraction .
4. News Scrapper
Doctors can access latest Medical related articles in their free time .
Tech Stack
Frontend: Next.js, Tailwind CSS
Backend: Node.js, Express.js
Database: Firebase (Real-time DB & Firestore)
AI Services: Google Healthcare NLP

Setup & Installation
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-repo/quickmeds-dashboard.git
cd quickmeds-dashboard
2. Install Dependencies
bash
Copy
Edit
npm install
3. Run the Application
bash
Copy
Edit
npm start
The web dashboard will be available at http://localhost:3000.

Future Enhancements
Predictive AI-based patient flow analysis for appointment optimization.
Integration with government hospital EHR systems for direct data retrieval.
