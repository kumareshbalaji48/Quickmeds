import Header from "@/components/Header"
import BackgroundVideo from "@/components/BackgroundVideo"
import UpcomingAppointments from "@/components/UpcomingAppointments"

export default function AppointmentsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundVideo videoSrc="/doctor-appointments.mp4" />
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-4xl">
                    <h1 className="text-4xl font-bold text-blue-800 mb-8">Today's Appointments</h1>
                    <UpcomingAppointments />
                </div>
            </main>
        </div>
    )
}

