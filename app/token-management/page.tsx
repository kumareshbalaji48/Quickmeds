"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function DoctorInterface() {
  // Mock appointments data
  const [appointments, setAppointments] = useState([
    { id: "1", patientName: "John Doe", time: "2023-10-25 10:00 AM", status: "pending" },
    { id: "2", patientName: "Jane Smith", time: "2023-10-25 10:30 AM", status: "pending" },
  ]);

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
            Upcoming Appointments
          </h1>

          {/* Upcoming Appointments List */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">

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

                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}