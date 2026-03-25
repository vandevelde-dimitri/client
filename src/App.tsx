import { Analytics } from "@vercel/analytics/react"
import BookingInterface from "./components/BookingPage"

export function App() {
  return (
    <div className="flex min-h-svh p-6">
      <BookingInterface />
      <Analytics />
    </div>
  )
}

export default App
