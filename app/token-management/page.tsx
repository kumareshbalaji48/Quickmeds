"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Play, Pause, CircleStopIcon as Stop, SkipForward } from "lucide-react";

export default function DoctorInterface() {
  const [isActive, setIsActive] = useState(false);
  const [currentToken, setCurrentToken] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mock patient details for the current token
  const [currentPatient, setCurrentPatient] = useState({
    name: "John Doe",
    appointmentTime: "10:30 AM",
    status: "In Progress",
  });

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    { id: "1", patientName: "John Doe", time: "2023-10-25 10:00 AM", status: "pending" },
    { id: "2", patientName: "Jane Smith", time: "2023-10-25 10:30 AM", status: "pending" },
  ]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    // Reset patient details when starting
    setCurrentPatient({
      name: "John Doe",
      appointmentTime: "10:30 AM",
      status: "In Progress",
    });
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentToken(0);
    setIsPaused(false);
    // Clear patient details when stopping
    setCurrentPatient(null);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleNextToken = () => {
    if (isActive && !isPaused) {
      setCurrentToken(currentToken + 1);
      // Update patient details for the next token (mock data)
      setCurrentPatient({
        name: "Jane Smith",
        appointmentTime: "11:00 AM",
        status: "In Progress",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/doctor_page_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Blurred Overlay */}
      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm z-8"></div>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-15"></div>

      {/* Content */}
      <div className="relative z-20">
        <Header />
        <main className="flex-grow p-8">
          <h1 className="text-6xl font-bold text-white mb-12 text-center animate-fade-in">
            Token Management
          </h1>

          {/* Buttons Grid */}
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="space-y-8">
              <Button
                onClick={handleStart}
                disabled={isActive && !isPaused}
                className="w-full h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
              >
                <Play size={24} /> Start
              </Button>
              <Button
                onClick={handlePause}
                disabled={!isActive}
                className="w-full h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
              >
                {isPaused ? <Play size={24} /> : <Pause size={24} />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
            </div>

            <div className="space-y-8">
              <Button
                onClick={handleStop}
                disabled={!isActive}
                className="w-full h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
              >
                <Stop size={24} /> Stop
              </Button>
              <Button
                onClick={handleNextToken}
                disabled={!isActive || isPaused}
                className="w-full h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-2xl font-bold flex items-center justify-center gap-4 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center gap-2">
                  <SkipForward size={24} />
                  <span>Next Token - {currentToken}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Ongoing Token and Patient Details */}
          {isActive && currentPatient && (
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ongoing Token Details
              </h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Token Number */}
                <div className="bg-white/20 rounded-2xl p-6 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold text-white">
                    Current Token
                  </span>
                  <span className="text-6xl font-bold text-white mt-4">
                    {currentToken}
                  </span>
                </div>

                {/* Patient Details */}
                <div className="bg-white/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Patient Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-lg font-medium text-white">
                        Name:
                      </span>
                      <span className="text-lg text-white ml-2">
                        {currentPatient.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-white">
                        Appointment Time:
                      </span>
                      <span className="text-lg text-white ml-2">
                        {currentPatient.appointmentTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-lg font-medium text-white">
                        Status:
                      </span>
                      <span className="text-lg text-white ml-2">
                        {currentPatient.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Upcoming Appointments
            </h2>
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="bg-white/20 rounded-2xl p-6 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-white">
                      Patient: {appointment.patientName}
                    </p>
                    <p className="text-lg text-white">
                      Time: {appointment.time}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleNextToken()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-2xl"
                  >
                    Next Patient
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}