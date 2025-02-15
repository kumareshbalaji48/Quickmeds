import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const appointments = [
  { id: 1, name: "Kumaresh", time: "8:30 AM", status: "Pending" },
  { id: 2, name: "Jane Smith", time: "11:30 AM", status: "Pending" },
  { id: 3, name: "Bob Johnson", time: "2:00 PM", status: "Pending" },
  // Add more appointments as needed
]

export default function UpcomingAppointments() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Upcoming Appointments</h2>
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl font-semibold">{appointment.name}</span>
              <span className="text-lg text-blue-600">{appointment.time}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{appointment.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

